import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  FRONTEND_URL: z.string().default('http://localhost'),
  ADMIN_URL: z.string().default('http://localhost/admin'),
  ADMIN_PASSWORD: z.string().default('Admin123!'),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  IYZICO_API_KEY: z.string().optional(),
  IYZICO_SECRET_KEY: z.string().optional(),
  IYZICO_BASE_URL: z.string().default('https://sandbox-api.iyzipay.com'),

  // Google Sign-In — OAuth Client ID (token audience doğrulaması için)
  GOOGLE_CLIENT_ID: z.string().optional(),

  // ── QNB eSolutions e-Fatura/e-Arşiv (SOAP) ──
  // Base host, ör: https://erpefaturatest1.qnbesolutions.com.tr (WSDL yolları bundan türetilir)
  EFINANS_BASE_URL: z.string().optional(),
  EFINANS_USER: z.string().optional(), // WS kullanıcı kodu
  EFINANS_PASSWORD: z.string().optional(),
  EFINANS_SENDER_VKN: z.string().optional(), // satıcı (gönderici) VKN
  EFINANS_SENDER_NAME: z.string().optional(), // satıcı ünvanı
  EFINANS_INVOICE_PREFIX: z.string().default('MAB'), // fatura no seri öneki (3 harf)

  // ── e-Arşiv kanalı (portaltest) — bireysel müşteriler için. Tanımlı değilse
  //    e-Arşiv gönderimi denenmez ("henüz aktif değil" hatası döner). ──
  EFINANS_EARSIV_BASE_URL: z.string().optional(),
  EFINANS_EARSIV_USER: z.string().optional(),
  EFINANS_EARSIV_PASSWORD: z.string().optional(),
  EFINANS_EARSIV_SENDER_VKN: z.string().optional(),
  EFINANS_EARSIV_SENDER_NAME: z.string().optional(),
  EFINANS_EARSIV_INVOICE_PREFIX: z.string().optional(),
  EFINANS_EARSIV_BELGE_TURU: z.string().optional(), // gönderim belgeTuru (portaltest'te denenerek bulunacak)
  EFINANS_EARSIV_BELGE_TURU_KISA: z.string().optional(), // durum/indirme kısa formu
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Geçersiz ortam değişkenleri:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
