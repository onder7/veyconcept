import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/productService';

function qs(val: unknown): string | undefined {
  if (typeof val === 'string') return val || undefined;
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0] : undefined;
  return undefined;
}

const getLanguage = (req: Request): svc.Language => {
  const lang = qs(req.query.language);
  return (lang === 'en' || lang === 'tr') ? lang : 'tr';
};

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, minPrice, maxPrice } = req.query;
    const language = getLanguage(req);
    const result = await svc.listProducts({
      language,
      page: page ? Number(page) : 1,
      limit: limit ? Math.min(Number(limit), 100) : 20,
      search: qs(req.query.search),
      categorySlug: qs(req.query.category),
      brandId: qs(req.query.brand),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: qs(req.query.sort) as svc.ProductFilters['sort'],
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const language = getLanguage(req);
    const product = await svc.getProductBySlug(req.params['slug'] as string, language);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function getFeatured(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const language = getLanguage(req);
    const products = await svc.getFeaturedProducts(Number(req.query.limit) || 8, language);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const language = getLanguage(req);
    const categories = await svc.listCategories(language);
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const language = getLanguage(req);
    const category = await svc.getCategoryBySlug(req.params['slug'] as string, language);
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function getBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const language = getLanguage(req);
    const brands = await svc.listBrands(language);
    res.json({ success: true, data: brands });
  } catch (err) {
    next(err);
  }
}
