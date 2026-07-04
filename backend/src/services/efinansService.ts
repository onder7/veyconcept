import crypto from 'crypto';
import * as soap from 'soap';
import { env } from '../config/env';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

// ─────────────────────────────────────────────────────────────────────────────
// QNB eSolutions (e-Finans) SOAP entegrasyonu — e-Fatura / e-Arşiv
//
// İKİ KANAL:
//   'efatura' → erpefatura ortamı (kurumsal e-Fatura + e-İrsaliye). EFINANS_* env.
//   'earsiv'  → portaltest ortamı (bireysel e-Arşiv). EFINANS_EARSIV_* env.
// İkisi de AYNI connectorService API'sini kullanır; yalnızca baseUrl, kullanıcı
// ve belgeTuru kodları farklıdır. e-Arşiv config yoksa 'earsiv' yapılandırılmamış
// sayılır ve gönderim denenmez.
//
// Akış (efatura canlı doğrulandı):
//   userService.wsLogin(userId, password, lang) → oturum CSAPSESSIONID cookie'de.
//   connectorService: faturaNoUret → belgeGonderExt(parametreler{...}) → belgeOid,
//     gidenBelgeDurumSorgula(belgeOid), gidenBelgeIndirExt(ettn) → PDF.
// ─────────────────────────────────────────────────────────────────────────────

export type Channel = 'efatura' | 'earsiv';

export interface EfinansConfig {
  baseUrl: string;
  user: string;
  password: string;
  senderVkn: string;
  senderName: string;
  invoicePrefix: string; // 3 harf
  belgeTuruUbl: string; // gönderimde (belgeGonderExt) — ör: FATURA_UBL / EARSIV_UBL
  belgeTuruShort: string; // durum/indirmede (kısa form) — ör: FATURA / EARSIV
}

// ─── Config (env > DB hibrit; kanal bazlı) ───────────────────────────────────

async function resolveConfig(channel: Channel): Promise<EfinansConfig | null> {
  const isEarsiv = channel === 'earsiv';

  // 1) .env öncelikli
  const e = isEarsiv
    ? {
        baseUrl: env.EFINANS_EARSIV_BASE_URL, user: env.EFINANS_EARSIV_USER, password: env.EFINANS_EARSIV_PASSWORD,
        senderVkn: env.EFINANS_EARSIV_SENDER_VKN, senderName: env.EFINANS_EARSIV_SENDER_NAME,
        invoicePrefix: env.EFINANS_EARSIV_INVOICE_PREFIX ?? env.EFINANS_INVOICE_PREFIX,
        belgeTuruUbl: env.EFINANS_EARSIV_BELGE_TURU ?? 'EARSIV_UBL',
        belgeTuruShort: env.EFINANS_EARSIV_BELGE_TURU_KISA ?? 'EARSIV',
      }
    : {
        baseUrl: env.EFINANS_BASE_URL, user: env.EFINANS_USER, password: env.EFINANS_PASSWORD,
        senderVkn: env.EFINANS_SENDER_VKN, senderName: env.EFINANS_SENDER_NAME,
        invoicePrefix: env.EFINANS_INVOICE_PREFIX,
        belgeTuruUbl: 'FATURA_UBL', belgeTuruShort: 'FATURA',
      };
  if (e.baseUrl && e.user && e.password && e.senderVkn) {
    return {
      baseUrl: e.baseUrl.replace(/\/+$/, ''),
      user: e.user,
      password: e.password,
      senderVkn: e.senderVkn,
      senderName: e.senderName ?? '',
      invoicePrefix: (e.invoicePrefix ?? 'MAB').slice(0, 3).toUpperCase(),
      belgeTuruUbl: e.belgeTuruUbl,
      belgeTuruShort: e.belgeTuruShort,
    };
  }

  // 2) Admin panel (DB) ayarları — anahtarlar efinans_* / efinans_earsiv_*
  try {
    const dbPrefix = isEarsiv ? 'efinans_earsiv_' : 'efinans_';
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: ['base_url', 'user', 'password', 'sender_vkn', 'sender_name', 'invoice_prefix'].map((k) => dbPrefix + k) } },
    });
    const m = Object.fromEntries(rows.map((r) => [r.key.slice(dbPrefix.length), r.value?.trim()]));
    if (m.base_url && m.user && m.password && m.sender_vkn) {
      return {
        baseUrl: m.base_url.replace(/\/+$/, ''),
        user: m.user,
        password: m.password,
        senderVkn: m.sender_vkn,
        senderName: m.sender_name ?? '',
        invoicePrefix: (m.invoice_prefix ?? 'MAB').slice(0, 3).toUpperCase(),
        belgeTuruUbl: e.belgeTuruUbl,
        belgeTuruShort: e.belgeTuruShort,
      };
    }
  } catch {
    // DB okunamazsa yapılandırılmamış say
  }
  return null;
}

export async function isConfigured(channel: Channel = 'efatura'): Promise<boolean> {
  return (await resolveConfig(channel)) !== null;
}

async function requireConfig(channel: Channel): Promise<EfinansConfig> {
  const cfg = await resolveConfig(channel);
  if (!cfg) {
    throw Object.assign(
      new Error(
        channel === 'earsiv'
          ? 'e-Arşiv entegrasyonu henüz aktif değil (portaltest/EFINANS_EARSIV_* yapılandırılmadı)'
          : 'QNB e-Finans yapılandırılmamış (EFINANS_* env değişkenleri eksik)',
      ),
      { status: 400 },
    );
  }
  return cfg;
}

// ─── SOAP client & oturum yönetimi (baseUrl bazlı) ───────────────────────────

interface Session {
  cookie: string;
  createdAt: number;
}

const clientCache = new Map<string, { user: soap.Client; connector: soap.Client }>();
const sessions = new Map<string, Session>(); // baseUrl → session
const SESSION_TTL_MS = 15 * 60 * 1000;

async function getClients(cfg: EfinansConfig) {
  let entry = clientCache.get(cfg.baseUrl);
  if (!entry) {
    const [user, connector] = await Promise.all([
      soap.createClientAsync(`${cfg.baseUrl}/efatura/ws/userService?wsdl`),
      soap.createClientAsync(`${cfg.baseUrl}/efatura/ws/connectorService?wsdl`),
    ]);
    entry = { user, connector };
    clientCache.set(cfg.baseUrl, entry);
  }
  return entry;
}

function readSessionCookie(client: soap.Client): string | null {
  const headers = (client as any).lastResponseHeaders;
  const setCookie: string[] | undefined = headers && headers['set-cookie'];
  if (!setCookie) return null;
  return setCookie.map((c) => c.split(';')[0]).find((c) => c.startsWith('CSAPSESSIONID=')) ?? null;
}

async function login(cfg: EfinansConfig): Promise<Session> {
  const { user } = await getClients(cfg);
  await (user as any).wsLoginAsync({ userId: cfg.user, password: cfg.password, lang: 'tr' });
  const cookie = readSessionCookie(user);
  if (!cookie) throw new Error('QNB e-Finans: wsLogin sonrası oturum çerezi alınamadı');
  logger.info(`QNB e-Finans oturumu açıldı (${cfg.baseUrl})`);
  return { cookie, createdAt: Date.now() };
}

async function ensureSession(cfg: EfinansConfig): Promise<string> {
  const cur = sessions.get(cfg.baseUrl);
  if (!cur || Date.now() - cur.createdAt > SESSION_TTL_MS) {
    const s = await login(cfg);
    sessions.set(cfg.baseUrl, s);
    return s.cookie;
  }
  return cur.cookie;
}

function isSessionError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return /oturum|session|login|yetki|yetkisiz|authoriz|expired|geçersiz kullanıcı/.test(msg);
}

/** connectorService metodunu oturum çereziyle çağırır; oturum düşerse bir kez yeniden dener. */
async function callConnector<T = any>(cfg: EfinansConfig, method: string, args: Record<string, unknown>): Promise<T> {
  const { connector } = await getClients(cfg);
  const invoke = async (cookie: string): Promise<T> => {
    const [result] = await (connector as any)[`${method}Async`](args, {}, { Cookie: cookie });
    return result as T;
  };
  try {
    return await invoke(await ensureSession(cfg));
  } catch (err) {
    if (isSessionError(err)) {
      logger.warn(`QNB e-Finans oturumu düştü, yeniden login (${cfg.baseUrl})`);
      const s = await login(cfg);
      sessions.set(cfg.baseUrl, s);
      return invoke(s.cookie);
    }
    throw err;
  }
}

// ─── Belge kodlama ───────────────────────────────────────────────────────────
// veri = base64(UBL XML) — GZIP YOK; belgeHash = ham XML'in MD5 (hex).

function encodeDocument(xml: string): { veri: string; belgeHash: string } {
  const raw = Buffer.from(xml, 'utf8');
  return { veri: raw.toString('base64'), belgeHash: crypto.createHash('md5').update(raw).digest('hex') };
}

// ─── Public API (hepsi kanal alır) ───────────────────────────────────────────

export interface SendInvoiceResult {
  belgeOid?: string;
  responseStatus?: string;
  errorMessage?: string;
  raw: unknown;
}

/** Seri önekine göre yeni fatura numarası üretir. */
export async function generateInvoiceNo(channel: Channel, prefix?: string): Promise<string> {
  const cfg = await requireConfig(channel);
  const kod = (prefix ?? cfg.invoicePrefix).slice(0, 3).toUpperCase();
  const res = await callConnector<{ return: string }>(cfg, 'faturaNoUret', { vknTckn: cfg.senderVkn, faturaKodu: kod });
  return res.return;
}

/** UBL XML'i entegratöre gönderir (belgeGonderExt) → belgeOid. */
export async function sendInvoice(channel: Channel, params: {
  xml: string;
  belgeNo: string;
  belgeVersiyon?: string;
  alanEtiket?: string;
  gonderenEtiket?: string;
}): Promise<SendInvoiceResult> {
  const cfg = await requireConfig(channel);
  const { veri, belgeHash } = encodeDocument(params.xml);
  const parametreler: Record<string, unknown> = {
    vergiTcKimlikNo: cfg.senderVkn,
    belgeTuru: cfg.belgeTuruUbl,
    belgeNo: params.belgeNo,
    veri,
    belgeHash,
    mimeType: 'application/xml',
    belgeVersiyon: params.belgeVersiyon ?? '1.0',
  };
  if (params.alanEtiket) parametreler.alanEtiket = params.alanEtiket;
  if (params.gonderenEtiket) parametreler.gonderenEtiket = params.gonderenEtiket;

  const res = await callConnector<{ belgeOid?: string }>(cfg, 'belgeGonderExt', { parametreler });
  return { belgeOid: res.belgeOid, raw: res };
}

/** belgeOid ile durum sorgular. durum: 1=işleniyor, 2=hata, 3+=başarı. */
export async function queryStatusByOid(channel: Channel, belgeOid: string): Promise<any> {
  const cfg = await requireConfig(channel);
  const res = await callConnector<{ return: any }>(cfg, 'gidenBelgeDurumSorgula', { vergiTcKimlikNo: cfg.senderVkn, belgeOid });
  return res.return;
}

/** ETTN ile TEK belgeyi indirir → ham Buffer (PDF ise %PDF). */
export async function downloadByEttn(channel: Channel, ettn: string, format: 'PDF' | 'HTML' | 'XML' = 'PDF'): Promise<Buffer> {
  const cfg = await requireConfig(channel);
  const res = await callConnector<{ return: string }>(cfg, 'gidenBelgeIndirExt', {
    vergiTcKimlikNo: cfg.senderVkn,
    belgeEttn: ettn,
    belgeTuru: cfg.belgeTuruShort,
    belgeFormati: format,
  });
  return Buffer.from(res.return, 'base64');
}

/** Bağlantı/oturum sağlık kontrolü. */
export async function ping(channel: Channel = 'efatura'): Promise<{ ok: boolean; channel: Channel; message: string }> {
  try {
    const cfg = await requireConfig(channel);
    await ensureSession(cfg);
    return { ok: true, channel, message: `Oturum açık (${cfg.baseUrl}, VKN ${cfg.senderVkn})` };
  } catch (err) {
    return { ok: false, channel, message: err instanceof Error ? err.message : String(err) };
  }
}
