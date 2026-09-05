import { prisma } from '../config/database';
import { AppError } from '../types';
import { Prisma } from '@prisma/client';

export type Language = 'tr' | 'en';

export interface ProductFilters {
  language?: Language;
  categorySlug?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

const getProductInclude = (language: Language = 'tr') => ({
  category: { 
    select: { 
      id: true, 
      name: language === 'en' ? true : undefined,
      nameEn: language === 'en' ? true : undefined,
      slug: true 
    } 
  },
  brand: { 
    select: { 
      id: true, 
      name: language === 'en' ? true : undefined,
      nameEn: language === 'en' ? true : undefined,
      slug: true 
    } 
  },
  variants: {
    where: { isActive: true },
    select: {
      id: true, sku: true, price: true, compareAt: true,
      stockQty: true, desi: true,
      attributeValues: {
        select: {
          attributeValue: {
            select: {
              id: true, value: true, colorHex: true, sortOrder: true,
              attribute: { select: { id: true, name: true, slug: true, inputType: true, sortOrder: true } },
            },
          },
        },
      },
    },
  },
  images: {
    orderBy: { sortOrder: 'asc' as const },
    select: { id: true, url: true, altText: true, isPrimary: true },
  },
  tags: { select: { tag: true } },
  reviews: { where: { isApproved: true }, select: { rating: true } },
  _count: { select: { reviews: { where: { isApproved: true } } } },
});

const formatProductName = (product: any, language: Language = 'tr') => {
  return language === 'en' ? product.nameEn || product.name : product.name;
};

const formatProductDescription = (product: any, language: Language = 'tr') => {
  if (language === 'en') return product.descriptionEn || product.description;
  return product.descriptionTr || product.description;
};

const formatCategoryName = (category: any, language: Language = 'tr') => {
  return language === 'en' ? category.nameEn || category.name : category.name;
};

const formatBrandName = (brand: any, language: Language = 'tr') => {
  return language === 'en' ? brand.nameEn || brand.name : brand.name;
};

export async function listProducts(filters: ProductFilters = {}) {
  const { page = 1, limit = 20, search, categorySlug, brandId, minPrice, maxPrice, sort = 'newest', language = 'tr' } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nameEn: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { descriptionEn: { contains: search, mode: 'insensitive' } },
      { descriptionTr: { contains: search, mode: 'insensitive' } },
      { tags: { some: { tag: { contains: search, mode: 'insensitive' } } } },
    ];
  }

  if (categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new AppError('Kategori bulunamadı', 404);
    const descendantIds = await getCategoryDescendantIds(category.id);
    where.categoryId = { in: [category.id, ...descendantIds] };
  }

  if (brandId) where.brandId = brandId;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.variants = {
      some: {
        isActive: true,
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      },
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'price_asc' ? { variants: { _count: 'asc' } }
    : sort === 'price_desc' ? { variants: { _count: 'desc' } }
    : sort === 'popular' ? { reviews: { _count: 'desc' } }
    : { createdAt: 'desc' };

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, include: getProductInclude(language), orderBy, skip, take: limit }),
    prisma.product.count({ where }),
  ]);

  const formattedItems = items.map(product => ({
    ...product,
    name: formatProductName(product, language),
    description: formatProductDescription(product, language),
    category: product.category ? { ...product.category, name: formatCategoryName(product.category, language) } : product.category,
    brand: product.brand ? { ...product.brand, name: formatBrandName(product.brand, language) } : product.brand,
  }));

  return {
    items: formattedItems,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getProductBySlug(slug: string, language: Language = 'tr') {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: getProductInclude(language),
  });
  if (!product || !product.isActive) throw new AppError('Ürün bulunamadı', 404);
  
  return {
    ...product,
    name: formatProductName(product, language),
    description: formatProductDescription(product, language),
    category: product.category ? { ...product.category, name: formatCategoryName(product.category, language) } : product.category,
    brand: product.brand ? { ...product.brand, name: formatBrandName(product.brand, language) } : product.brand,
  };
}

export async function getFeaturedProducts(limit = 8, language: Language = 'tr') {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: getProductInclude(language),
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return products.map(product => ({
    ...product,
    name: formatProductName(product, language),
    description: formatProductDescription(product, language),
    category: product.category ? { ...product.category, name: formatCategoryName(product.category, language) } : product.category,
    brand: product.brand ? { ...product.brand, name: formatBrandName(product.brand, language) } : product.brand,
  }));
}

export async function listCategories(language: Language = 'tr') {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: {
      children: {
        where: { isActive: true },
        select: {
          id: true, name: true, nameEn: true, slug: true, imageUrl: true, showInMenu: true,
          children: {
            where: { isActive: true },
            select: { id: true, name: true, nameEn: true, slug: true, imageUrl: true, showInMenu: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      },
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  const formatCategories = (cats: any[]): any[] => 
    cats.map(cat => ({
      ...cat,
      name: formatCategoryName(cat, language),
      children: formatCategories(cat.children || []),
    }));

  return formatCategories(categories);
}

export async function getCategoryBySlug(slug: string, language: Language = 'tr') {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { where: { isActive: true }, select: { id: true, name: true, nameEn: true, slug: true } },
      parent: { select: { id: true, name: true, nameEn: true, slug: true } },
    },
  });
  if (!category || !category.isActive) throw new AppError('Kategori bulunamadı', 404);
  
  return {
    ...category,
    name: formatCategoryName(category, language),
    children: (category.children || []).map(child => ({
      ...child,
      name: formatCategoryName(child, language),
    })),
    parent: category.parent ? { ...category.parent, name: formatCategoryName(category.parent, language) } : category.parent,
  };
}

export async function listBrands(language: Language = 'tr') {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    select: { id: true, name: true, nameEn: true, slug: true, logoUrl: true },
    orderBy: { name: 'asc' },
  });

  return brands.map(brand => ({
    ...brand,
    name: formatBrandName(brand, language),
  }));
}

async function getCategoryDescendantIds(categoryId: string): Promise<string[]> {
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  });
  const ids = children.map((c) => c.id);
  for (const child of children) {
    const deeper = await getCategoryDescendantIds(child.id);
    ids.push(...deeper);
  }
  return ids;
}
