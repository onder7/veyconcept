import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as invoiceService from '../services/invoiceService';
import * as efinans from '../services/efinansService';

// e-Fatura / e-Arşiv (QNB eSolutions) — admin uçları

/** Sipariş için e-Fatura/e-Arşiv keser. */
export async function issue(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await invoiceService.issueInvoice(String(req.params.id));
    res.json({ success: result.status === 'SENT', data: result });
  } catch (err) {
    next(err);
  }
}

/** Faturanın kayıtlı durumunu döner. */
export async function get(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const invoice = await invoiceService.getInvoice(String(req.params.id));
    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
}

/** GİB durumunu yeniden sorgular. */
export async function refresh(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const status = await invoiceService.refreshStatus(String(req.params.id));
    res.json({ success: true, data: status });
  } catch (err) {
    next(err);
  }
}

/** Fatura PDF'ini indirir. */
export async function pdf(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const buf = await invoiceService.getInvoicePdf(String(req.params.id));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="fatura-${req.params.id}.pdf"`);
    res.send(buf);
  } catch (err) {
    next(err);
  }
}

/** UBL XML önizleme (göndermeden). */
export async function previewXml(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const xml = await invoiceService.previewXml(String(req.params.id));
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

/** Entegratör bağlantı/oturum testi. */
export async function ping(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const channel = req.query.channel === 'earsiv' ? 'earsiv' : 'efatura';
    const result = await efinans.ping(channel);
    res.json({ success: result.ok, data: result });
  } catch (err) {
    next(err);
  }
}
