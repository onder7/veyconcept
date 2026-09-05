import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { productApi } from '@/services/productApi';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { SeoHead, SITE_URL } from '@/components/seo/SeoHead';
import { breadcrumbSchema } from '@/lib/schemas';
import { useStoreInfo } from '@/hooks/useStoreInfo';

export function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { name: storeName } = useStoreInfo();
  const [page, setPage] = useState(1);

  const { data: catData } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => productApi.category(slug!),
    enabled: !!slug,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', { category: slug, page }],
    queryFn: () => productApi.list({ category: slug, page, limit: 20 }),
    enabled: !!slug,
  });

  const category = catData?.data?.data;
  const products = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  const breadcrumbItems = [
    { name: t('breadcrumb.home'), url: SITE_URL },
    ...(category?.parent
      ? [{ name: category.parent.name, url: `${SITE_URL}/kategori/${category.parent.slug}` }]
      : []),
    { name: category?.name ?? slug ?? '', url: `${SITE_URL}/kategori/${slug}` },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <SeoHead
        title={category?.name ?? slug}
        description={
          category?.description
            ? category.description.slice(0, 155)
            : `${category?.name ?? slug} kategorisindeki ürünleri keşfedin.${pagination ? ` ${pagination.total} ürün seçeneği.` : ''} ${storeName} kalite güvencesiyle.`
        }
        keywords={[category?.name, 'ev tekstili', 'satın al', 'fiyat', 'kargo'].filter(Boolean).join(', ')}
        url={`${SITE_URL}/kategori/${slug}`}
        image={category?.imageUrl ?? undefined}
        schema={breadcrumbSchema(breadcrumbItems)}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">{t('breadcrumb.home')}</Link>
        <ChevronRight className="h-4 w-4" />
        {category?.parent && (
          <>
            <Link to={`/kategori/${category.parent.slug}`} className="hover:text-foreground">
              {category.parent.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-foreground font-medium">{category?.name ?? slug}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="mb-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-8 bg-amber-500" /> {t('category.collection')}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-none text-foreground">{category?.name ?? slug}</h1>
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <span className="text-sm text-muted-foreground">{pagination.total} {t('category.products')}</span>
          )}
        </div>
      </div>

      {/* Alt kategoriler */}
      {category?.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {category.children.map((child) => (
            <Button
              key={child.id}
              variant="outline"
              size="sm"
              render={<Link to={`/kategori/${child.slug}`} />}
            >
              {child.name}
            </Button>
          ))}
        </div>
      )}

      <ProductGrid products={products} loading={isLoading} cols={4} />

      {/* Sayfalama */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t('category.previousPage')}
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            {page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t('category.nextPage')}
          </Button>
        </div>
      )}
    </main>
  );
}
