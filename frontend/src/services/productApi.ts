import { api } from './api';
import i18n from '@/lib/i18n';
import type { Product, Category, Brand } from '@/types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  language?: 'tr' | 'en';
}

export interface ProductListResponse {
  success: boolean;
  items: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const productApi = {
  list: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    const lang = filters.language || (i18n.language as 'tr' | 'en') || 'tr';
    Object.entries({ ...filters, language: lang }).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    return api.get<ProductListResponse>(`/products?${params}`);
  },

  featured: (limit = 8, language?: 'tr' | 'en') => {
    const lang = language || (i18n.language as 'tr' | 'en') || 'tr';
    return api.get<{ success: boolean; data: Product[] }>(`/products/featured?limit=${limit}&language=${lang}`);
  },

  get: (slug: string, language?: 'tr' | 'en') => {
    const lang = language || (i18n.language as 'tr' | 'en') || 'tr';
    return api.get<{ success: boolean; data: Product }>(`/products/${slug}?language=${lang}`);
  },

  categories: (language?: 'tr' | 'en') => {
    const lang = language || (i18n.language as 'tr' | 'en') || 'tr';
    return api.get<{ success: boolean; data: Category[] }>(`/categories?language=${lang}`);
  },

  category: (slug: string, language?: 'tr' | 'en') => {
    const lang = language || (i18n.language as 'tr' | 'en') || 'tr';
    return api.get<{ success: boolean; data: Category }>(`/categories/${slug}?language=${lang}`);
  },

  brands: (language?: 'tr' | 'en') => {
    const lang = language || (i18n.language as 'tr' | 'en') || 'tr';
    return api.get<{ success: boolean; data: Brand[] }>(`/brands?language=${lang}`);
  },

  shippingConfig: () =>
    api.get<{ success: boolean; data: { shippingFee: number; freeShippingThreshold: number } }>('/shipping-config'),
};
