import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Grid2X2, Grid3X3 } from 'lucide-react';
import { productApi } from '@/services/productApi';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { SeoHead } from '@/components/seo/SeoHead';

export function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page') ?? '1');
  const [gridCols, setGridCols] = useState<2 | 4>(() => {
    const saved = Number(localStorage.getItem('catalog-grid-cols'));
    return saved === 4 ? 4 : 2;
  });

  const changeGridCols = (cols: 2 | 4) => {
    setGridCols(cols);
    localStorage.setItem('catalog-grid-cols', String(cols));
  };

  const updateParams = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') params.delete(key);
      else params.set(key, String(value));
    });
    if (!('page' in updates)) params.set('page', '1');
    setSearchParams(params);
  };

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products', 'catalog', { q, page }],
    queryFn: () => productApi.list({ search: q || undefined, page, limit: 12 }),
  });

  const products = productsData?.data?.items ?? [];
  const pagination = productsData?.data?.pagination;

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <SeoHead
        title={q ? `"${q}" için arama sonuçları` : 'Ürünler'}
        description={q ? `"${q}" araması için ${productsData?.data?.pagination?.total ?? ''} ürün bulundu.` : 'VEY Concept ürünleri.'}
        noindex
      />

      <div>
        <div className="mb-8 flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">VEY Concept</p>
            <h1 className="font-display text-4xl text-foreground md:text-5xl">
              {q && t('search.searchResults', { query: q })}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center rounded-sm border border-border bg-card p-0.5" aria-label={t('search.gridView')}>
              <button
                type="button"
                aria-label={t('search.gridView2')}
                aria-pressed={gridCols === 2}
                onClick={() => changeGridCols(2)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-sm px-2 text-xs font-semibold transition-colors ${gridCols === 2 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={t('search.gridView4')}
                aria-pressed={gridCols === 4}
                onClick={() => changeGridCols(4)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-sm px-2 text-xs font-semibold transition-colors ${gridCols === 4 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <ProductGrid products={products} loading={isProductsLoading} cols={gridCols} hideDetails={true} />

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => updateParams({ page: String(page - 1) })}
              className="cursor-pointer"
            >
              {t('category.previousPage')}
            </Button>
            <span className="flex items-center px-4 text-sm font-medium text-muted-foreground">
              {page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === pagination.totalPages}
              onClick={() => updateParams({ page: String(page + 1) })}
              className="cursor-pointer"
            >
              {t('category.nextPage')}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
