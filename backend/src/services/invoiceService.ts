import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { getTaxConfig } from './settingsService';
import * as efinans from './efinansService';
import { buildInvoiceXml, InvoiceData, InvoiceLineData, InvoiceParty, InvoiceProfile } from './efinansUbl';

// ─────────────────────────────────────────────────────────────────────────────
// Sipariş → UBL-TR fatura eşlemesi ve gönderim orkestrasyonu.
//
// Fiyat modeli: ürün fiyatları KDV DAHİL saklanır; ekran faturası tek global
// KDV oranı (tax_rate) ile net'i brütten çıkarır (net = brüt / (1+oran)).
// e-Fatura'yı ekran faturasıyla birebir tutmak için aynı modeli kullanıyoruz:
// iskonto satırlara oransal dağıtılır, kargo ayrı bir kalem olur, KDV kalem
// bazında brütten ayrıştırılır. Böylece Σ(net)+Σ(kdv) = sipariş toplamı.
// ─────────────────────────────────────────────────────────────────────────────

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

async function getSupplierParty(senderVkn: string, senderName: string): Promise<InvoiceParty> {
  const rows = await prisma.siteSettings.findMany({
    where: {
      key: {
        in: [
          'general_legal_name',
          'general_tax_office',
          'general_tax_number',
          'general_address',
          'general_city',
          'general_email',
          'general_phone',
        ],
      },
    },
  });
  const s = Object.fromEntries(rows.map((r) => [r.key.replace('general_', ''), r.value]));
  return {
    vknTckn: s.tax_number || senderVkn,
    name: s.legal_name || senderName || 'Satıcı',
    isCorporate: true,
    taxOffice: s.tax_office || '',
    street: s.address || '',
    city: s.city || '',
    country: 'Türkiye',
    email: s.email || '',
    phone: s.phone || '',
  };
}

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: { include: { variant: { include: { product: { select: { name: true } } } } } };
    address: true;
    invoice: true;
  };
}>;

async function loadOrder(orderId: string): Promise<OrderWithRelations> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { variant: { include: { product: { select: { name: true } } } } } },
      address: true,
      invoice: true,
    },
  });
  if (!order) throw Object.assign(new Error('Sipariş bulunamadı'), { status: 404 });
  return order;
}

/** Sipariş verisini UBL InvoiceData yapısına çevirir (tek global KDV oranı). */
export async function buildInvoiceData(order: OrderWithRelations, opts: {
  ettn: string;
  invoiceNo: string;
  supplier: InvoiceParty;
}): Promise<InvoiceData> {
  const { taxRate } = await getTaxConfig();
  const r = taxRate; // %; net = gross/(1+r/100)
  const div = 1 + r / 100;

  const subtotalGross = Number(order.subtotal);
  const discount = Number(order.discount);
  const shippingFee = Number(order.shippingFee);
  const totalGross = Number(order.total); // subtotal - discount + shipping

  const grossItems = order.items.map((it) => Number(it.unitPrice) * it.quantity);

  // İskontoyu ürün satırlarına oransal dağıt (son satırda yuvarlama artığı)
  const discountShares: number[] = [];
  let allocated = 0;
  grossItems.forEach((g, i) => {
    if (i === grossItems.length - 1) {
      discountShares.push(round2(discount - allocated));
    } else {
      const share = subtotalGross > 0 ? round2((discount * g) / subtotalGross) : 0;
      discountShares.push(share);
      allocated += share;
    }
  });

  const lines: InvoiceLineData[] = order.items.map((it, i) => {
    const grossAfter = round2(grossItems[i] - discountShares[i]);
    const net = round2(grossAfter / div);
    const vat = round2(grossAfter - net);
    return {
      name: it.variant.product.name,
      quantity: it.quantity,
      unitCode: 'C62',
      unitPriceNet: round2(net / it.quantity),
      lineNet: net,
      vatRate: r,
      vatAmount: vat,
    };
  });

  // Kargo ayrı kalem (KDV dahil brütten ayrıştır)
  if (shippingFee > 0) {
    const net = round2(shippingFee / div);
    lines.push({
      name: 'Kargo / Teslimat Bedeli',
      quantity: 1,
      unitCode: 'C62',
      unitPriceNet: net,
      lineNet: net,
      vatRate: r,
      vatAmount: round2(shippingFee - net),
    });
  }

  const lineExtensionTotal = round2(lines.reduce((s, l) => s + l.lineNet, 0));
  const taxTotal = round2(lines.reduce((s, l) => s + l.vatAmount, 0));

  const customer = buildCustomerParty(order);

  return {
    invoiceNo: opts.invoiceNo,
    ettn: opts.ettn,
    issueDate: new Date(),
    profile: pickProfile(order),
    invoiceTypeCode: 'SATIS',
    currency: 'TRY',
    supplier: opts.supplier,
    customer,
    lines,
    lineExtensionTotal,
    allowanceTotal: 0, // iskonto satır fiyatlarına gömüldü
    taxExclusiveTotal: lineExtensionTotal,
    taxTotal,
    taxInclusiveTotal: totalGross,
    payableTotal: totalGross,
    notes: [`Sipariş No: TR-${order.id.slice(-8).toUpperCase()}`],
  };
}

function pickProfile(order: OrderWithRelations): InvoiceProfile {
  // Kurumsal (VKN) → e-Fatura; bireysel → e-Arşiv.
  // e-Fatura mükellefi mi kontrolü (kayıtlı kullanıcı sorgulama) ileride eklenecek.
  return order.isCorporate ? 'TEMELFATURA' : 'EARSIVFATURA';
}

function buildCustomerParty(order: OrderWithRelations): InvoiceParty {
  const a = order.address;
  const fullName = `${a.firstName} ${a.lastName}`.trim();
  const vknTckn = order.isCorporate ? order.taxNumber ?? '' : order.identityNo ?? '11111111111';
  return {
    vknTckn,
    name: order.isCorporate ? order.billingName || fullName : fullName,
    isCorporate: order.isCorporate,
    firstName: a.firstName,
    lastName: a.lastName,
    taxOffice: order.taxOffice ?? undefined,
    street: a.address,
    citySubdivision: a.district,
    city: a.city,
    postalZone: a.postalCode ?? undefined,
    phone: a.phone,
    country: 'Türkiye',
  };
}

// ─── Orkestrasyon ────────────────────────────────────────────────────────────

export interface IssueResult {
  status: 'SENT' | 'ERROR' | 'QUEUED';
  ettn?: string;
  invoiceNo?: string;
  errorMessage?: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Sipariş için e-Fatura/e-Arşiv keser. Mükerrer gönderimi engeller. */
export async function issueInvoice(orderId: string): Promise<IssueResult> {
  const order = await loadOrder(orderId);

  // Mükerrer engelleme
  if (order.invoice && ['QUEUED', 'SENT'].includes(order.invoice.status)) {
    throw Object.assign(new Error('Bu sipariş için zaten fatura kesilmiş'), { status: 409 });
  }

  // Kanal seçimi: kurumsal → e-Fatura, bireysel → e-Arşiv
  const channel: efinans.Channel = order.isCorporate ? 'efatura' : 'earsiv';
  const type = order.isCorporate ? 'EFATURA' : 'EARSIV';

  if (!(await efinans.isConfigured(channel))) {
    throw Object.assign(
      new Error(
        channel === 'earsiv'
          ? 'e-Arşiv entegrasyonu henüz aktif değil. Bireysel müşteriler için e-Arşiv (portaltest) erişimi tanımlanmalı.'
          : 'QNB e-Finans yapılandırılmamış',
      ),
      { status: 400 },
    );
  }

  const ettn = crypto.randomUUID();

  // Fatura no üret + UBL kur
  const invoiceNo = await efinans.generateInvoiceNo(channel);
  const supplier = await getSupplierParty(process.env.EFINANS_SENDER_VKN ?? '', process.env.EFINANS_SENDER_NAME ?? '');
  const data = await buildInvoiceData(order, { ettn, invoiceNo, supplier });
  const xml = buildInvoiceXml(data);

  // DRAFT kaydı (idempotent upsert)
  await prisma.invoice.upsert({
    where: { orderId },
    create: { orderId, type, status: 'DRAFT', ettn, invoiceNo, profile: data.profile },
    update: { type, status: 'DRAFT', ettn, invoiceNo, profile: data.profile, errorMessage: null },
  });

  try {
    const res = await efinans.sendInvoice(channel, { xml, belgeNo: invoiceNo });

    // belgeOid = yalnızca "kuyruğa alındı" demek; belge async işlenir ve durum 2'de
    // (hata) kalabilir. Bu yüzden gerçek durumu (durum) sorgulamadan SENT deme.
    if (!res.belgeOid) {
      const msg = res.errorMessage ?? 'Gönderim reddedildi (belgeOid alınamadı)';
      await prisma.invoice.update({ where: { orderId }, data: { status: 'ERROR', errorMessage: msg, providerResponse: res.raw as any } });
      logger.warn(`Fatura gönderim reddedildi (order ${orderId}): ${msg}`);
      return { status: 'ERROR', errorMessage: msg, ettn, invoiceNo };
    }

    await prisma.invoice.update({ where: { orderId }, data: { status: 'QUEUED', belgeOid: res.belgeOid, providerResponse: res.raw as any } });

    // Durum netleşene kadar poll et (durum: 1=işleniyor, 2=hata, 3+=başarı)
    let st: any = null;
    for (let i = 0; i < 6; i++) {
      await sleep(2500);
      st = await efinans.queryStatusByOid(channel, res.belgeOid).catch(() => null);
      if (st && st.durum !== 1) break;
    }

    if (st && st.durum >= 3) {
      const realEttn = st.ettn || ettn;
      const realNo = st.belgeNo || invoiceNo;
      await prisma.invoice.update({
        where: { orderId },
        data: { status: 'SENT', sentAt: new Date(), ettn: realEttn, invoiceNo: realNo, providerResponse: st as any, errorMessage: null },
      });
      logger.info(`Fatura kesildi (order ${orderId}, ETTN ${realEttn}, No ${realNo})`);
      return { status: 'SENT', ettn: realEttn, invoiceNo: realNo };
    }

    if (st && st.durum === 2) {
      const msg = String(st.aciklama || 'Belge işlenirken hata').slice(0, 500);
      await prisma.invoice.update({ where: { orderId }, data: { status: 'REJECTED', errorMessage: msg, providerResponse: st as any } });
      logger.warn(`Fatura reddedildi (order ${orderId}): ${msg}`);
      return { status: 'ERROR', errorMessage: msg, ettn, invoiceNo };
    }

    // Hâlâ işleniyor → QUEUED bırak; admin "Durumu Yenile" ile kontrol edebilir
    logger.info(`Fatura kuyrukta, işleniyor (order ${orderId}, belgeOid ${res.belgeOid})`);
    return { status: 'QUEUED', errorMessage: 'Fatura işleniyor. Birkaç saniye sonra durumu yenileyin.', ettn, invoiceNo };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await prisma.invoice.update({ where: { orderId }, data: { status: 'ERROR', errorMessage: message } }).catch(() => {});
    logger.error(`Fatura gönderim hatası (order ${orderId}): ${message}`);
    return { status: 'ERROR', errorMessage: message, ettn, invoiceNo };
  }
}

/** Fatura tipine göre entegratör kanalını verir. */
function channelOf(type: string): efinans.Channel {
  return type === 'EARSIV' ? 'earsiv' : 'efatura';
}

/** Güncel GİB durumunu belgeOid ile sorgular, statüyü ilerletir ve kaydı günceller. */
export async function refreshStatus(orderId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { orderId } });
  if (!invoice?.belgeOid) throw Object.assign(new Error('Fatura bulunamadı'), { status: 404 });
  const status = await efinans.queryStatusByOid(channelOf(invoice.type), invoice.belgeOid);
  const data: Record<string, unknown> = { providerResponse: status as any };
  if (status?.durum >= 3) {
    data.status = 'SENT';
    if (!invoice.sentAt) data.sentAt = new Date();
    if (status.ettn) data.ettn = status.ettn;
    if (status.belgeNo) data.invoiceNo = status.belgeNo;
    data.errorMessage = null;
  } else if (status?.durum === 2) {
    data.status = 'REJECTED';
    data.errorMessage = String(status.aciklama || 'Belge işlenirken hata').slice(0, 500);
  }
  await prisma.invoice.update({ where: { orderId }, data });
  return status;
}

/** Fatura PDF'ini ETTN ile indirir (ham PDF Buffer). Belge işlenmemişse hata döner. */
export async function getInvoicePdf(orderId: string): Promise<Buffer> {
  const invoice = await prisma.invoice.findUnique({ where: { orderId } });
  if (!invoice?.ettn) throw Object.assign(new Error('Fatura bulunamadı'), { status: 404 });
  return efinans.downloadByEttn(channelOf(invoice.type), invoice.ettn, 'PDF');
}

export async function getInvoice(orderId: string) {
  return prisma.invoice.findUnique({ where: { orderId } });
}

/** Sadece XML üretir (test/önizleme; entegratöre göndermeden). */
export async function previewXml(orderId: string): Promise<string> {
  const order = await loadOrder(orderId);
  const supplier = await getSupplierParty(process.env.EFINANS_SENDER_VKN ?? '', process.env.EFINANS_SENDER_NAME ?? '');
  const data = await buildInvoiceData(order, {
    ettn: crypto.randomUUID(),
    invoiceNo: 'PREVIEW',
    supplier,
  });
  return buildInvoiceXml(data);
}
