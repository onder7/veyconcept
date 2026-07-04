// ─────────────────────────────────────────────────────────────────────────────
// UBL-TR 1.2 e-Fatura / e-Arşiv XML üretici (QNB eSolutions belgeGonder için)
//
// Kesin geçerlilik ilk canlı gönderimde belgeGonderWithValidate'in errorMessage'ı
// ile iteratif doğrulanacak. Bu üretici zorunlu UBL-TR alanlarını kapsar.
// ─────────────────────────────────────────────────────────────────────────────

export type InvoiceProfile = 'TEMELFATURA' | 'TICARIFATURA' | 'EARSIVFATURA';

export interface InvoiceParty {
  vknTckn: string; // 10 hane VKN veya 11 hane TCKN
  name: string; // ünvan (kurumsal) veya "Ad Soyad" (bireysel)
  isCorporate: boolean;
  firstName?: string;
  lastName?: string;
  taxOffice?: string; // vergi dairesi (kurumsal)
  street?: string;
  citySubdivision?: string; // ilçe
  city?: string;
  country?: string; // varsayılan Türkiye
  postalZone?: string;
  email?: string;
  phone?: string;
}

export interface InvoiceLineData {
  name: string;
  quantity: number;
  unitCode?: string; // UBL birim kodu, adet = C62
  unitPriceNet: number; // KDV hariç birim fiyat
  lineNet: number; // satır KDV matrahı (iskonto sonrası, KDV hariç)
  vatRate: number; // ör: 20
  vatAmount: number; // satır KDV tutarı
  allowance?: number; // satır iskontosu (KDV hariç)
}

export interface InvoiceData {
  invoiceNo: string;
  ettn: string; // UUIDv4
  issueDate: Date;
  profile: InvoiceProfile;
  invoiceTypeCode?: string; // SATIS
  currency?: string; // TRY
  supplier: InvoiceParty;
  customer: InvoiceParty;
  lines: InvoiceLineData[];
  lineExtensionTotal: number; // mal/hizmet toplamı (KDV hariç, iskonto sonrası)
  allowanceTotal?: number; // toplam iskonto (KDV hariç)
  taxExclusiveTotal: number; // matrah
  taxTotal: number; // toplam KDV
  taxInclusiveTotal: number; // KDV dahil toplam
  payableTotal: number; // ödenecek tutar
  notes?: string[];
}

// ─── Yardımcılar ─────────────────────────────────────────────────────────────

const esc = (s: string | undefined): string =>
  (s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const money = (n: number): string => (Math.round((n + Number.EPSILON) * 100) / 100).toFixed(2);
const qty = (n: number): string => (Math.round((n + Number.EPSILON) * 1000) / 1000).toString();
const pad2 = (n: number): string => String(n).padStart(2, '0');
const dateStr = (d: Date): string => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const timeStr = (d: Date): string => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;

// KDV vergi kodu (GİB): 0015 = Gerçek Usulde KDV
const KDV_TAX_CODE = '0015';
const KDV_TAX_NAME = 'KDV';

function partyIdScheme(p: InvoiceParty): string {
  // 11 hane → TCKN, aksi halde VKN
  return p.vknTckn.length === 11 ? 'TCKN' : 'VKN';
}

function partyXml(tag: string, p: InvoiceParty, currency: string): string {
  const scheme = partyIdScheme(p);
  const person =
    !p.isCorporate && (p.firstName || p.lastName)
      ? `
      <cac:Person>
        <cbc:FirstName>${esc(p.firstName)}</cbc:FirstName>
        <cbc:FamilyName>${esc(p.lastName)}</cbc:FamilyName>
      </cac:Person>`
      : '';
  return `
  <${tag}>
    <cac:Party>
      <cbc:WebsiteURI/>
      <cac:PartyIdentification>
        <cbc:ID schemeID="${scheme}">${esc(p.vknTckn)}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name>${esc(p.name)}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${esc(p.street)}</cbc:StreetName>
        <cbc:CitySubdivisionName>${esc(p.citySubdivision)}</cbc:CitySubdivisionName>
        <cbc:CityName>${esc(p.city)}</cbc:CityName>
        <cbc:PostalZone>${esc(p.postalZone)}</cbc:PostalZone>
        <cac:Country><cbc:Name>${esc(p.country ?? 'Türkiye')}</cbc:Name></cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cac:TaxScheme><cbc:Name>${esc(p.taxOffice ?? '')}</cbc:Name></cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:Contact>
        <cbc:Telephone>${esc(p.phone)}</cbc:Telephone>
        <cbc:ElectronicMail>${esc(p.email)}</cbc:ElectronicMail>
      </cac:Contact>${person}
    </cac:Party>
  </${tag}>`;
}

// KDV oranına göre gruplanmış TaxSubtotal'lar
function taxTotalXml(data: InvoiceData): string {
  const groups = new Map<number, { base: number; tax: number }>();
  for (const l of data.lines) {
    const g = groups.get(l.vatRate) ?? { base: 0, tax: 0 };
    g.base += l.lineNet;
    g.tax += l.vatAmount;
    groups.set(l.vatRate, g);
  }
  const cur = data.currency ?? 'TRY';
  const subtotals = [...groups.entries()]
    .map(
      ([rate, g]) => `
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="${cur}">${money(g.base)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="${cur}">${money(g.tax)}</cbc:TaxAmount>
      <cbc:Percent>${rate}</cbc:Percent>
      <cac:TaxCategory>
        <cac:TaxScheme>
          <cbc:Name>${KDV_TAX_NAME}</cbc:Name>
          <cbc:TaxTypeCode>${KDV_TAX_CODE}</cbc:TaxTypeCode>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>`,
    )
    .join('');
  return `
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${cur}">${money(data.taxTotal)}</cbc:TaxAmount>${subtotals}
  </cac:TaxTotal>`;
}

function lineXml(l: InvoiceLineData, index: number, currency: string): string {
  const allowance =
    l.allowance && l.allowance > 0
      ? `
    <cac:AllowanceCharge>
      <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
      <cbc:Amount currencyID="${currency}">${money(l.allowance)}</cbc:Amount>
    </cac:AllowanceCharge>`
      : '';
  return `
  <cac:InvoiceLine>
    <cbc:ID>${index + 1}</cbc:ID>
    <cbc:InvoicedQuantity unitCode="${l.unitCode ?? 'C62'}">${qty(l.quantity)}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="${currency}">${money(l.lineNet)}</cbc:LineExtensionAmount>${allowance}
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="${currency}">${money(l.vatAmount)}</cbc:TaxAmount>
      <cac:TaxSubtotal>
        <cbc:TaxableAmount currencyID="${currency}">${money(l.lineNet)}</cbc:TaxableAmount>
        <cbc:TaxAmount currencyID="${currency}">${money(l.vatAmount)}</cbc:TaxAmount>
        <cbc:Percent>${l.vatRate}</cbc:Percent>
        <cac:TaxCategory>
          <cac:TaxScheme>
            <cbc:Name>${KDV_TAX_NAME}</cbc:Name>
            <cbc:TaxTypeCode>${KDV_TAX_CODE}</cbc:TaxTypeCode>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Name>${esc(l.name)}</cbc:Name>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="${currency}">${money(l.unitPriceNet)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>`;
}

/** UBL-TR 1.2 fatura XML'ini string olarak üretir. */
export function buildInvoiceXml(data: InvoiceData): string {
  const cur = data.currency ?? 'TRY';
  const notes = (data.notes ?? []).map((n) => `\n  <cbc:Note>${esc(n)}</cbc:Note>`).join('');
  const allowance =
    data.allowanceTotal && data.allowanceTotal > 0
      ? `
  <cac:AllowanceCharge>
    <cbc:ChargeIndicator>false</cbc:ChargeIndicator>
    <cbc:Amount currencyID="${cur}">${money(data.allowanceTotal)}</cbc:Amount>
  </cac:AllowanceCharge>`
      : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>TR1.2</cbc:CustomizationID>
  <cbc:ProfileID>${data.profile}</cbc:ProfileID>
  <cbc:ID>${esc(data.invoiceNo)}</cbc:ID>
  <cbc:CopyIndicator>false</cbc:CopyIndicator>
  <cbc:UUID>${esc(data.ettn)}</cbc:UUID>
  <cbc:IssueDate>${dateStr(data.issueDate)}</cbc:IssueDate>
  <cbc:IssueTime>${timeStr(data.issueDate)}</cbc:IssueTime>
  <cbc:InvoiceTypeCode>${data.invoiceTypeCode ?? 'SATIS'}</cbc:InvoiceTypeCode>${notes}
  <cbc:DocumentCurrencyCode>${cur}</cbc:DocumentCurrencyCode>
  <cbc:LineCountNumeric>${data.lines.length}</cbc:LineCountNumeric>${partyXml('cac:AccountingSupplierParty', data.supplier, cur)}${partyXml('cac:AccountingCustomerParty', data.customer, cur)}${allowance}${taxTotalXml(data)}
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${cur}">${money(data.lineExtensionTotal)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${cur}">${money(data.taxExclusiveTotal)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${cur}">${money(data.taxInclusiveTotal)}</cbc:TaxInclusiveAmount>
    <cbc:AllowanceTotalAmount currencyID="${cur}">${money(data.allowanceTotal ?? 0)}</cbc:AllowanceTotalAmount>
    <cbc:PayableAmount currencyID="${cur}">${money(data.payableTotal)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>${data.lines.map((l, i) => lineXml(l, i, cur)).join('')}
</Invoice>`;
}
