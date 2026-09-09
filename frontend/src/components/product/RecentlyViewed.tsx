import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { ProductCard } from './ProductCard';
import { useTranslation } from 'react-i18next';

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const { t } = useTranslation();
  const items = useRecentlyViewedStore((s) => s.items);
  const visible = excludeId ? items.filter((p) => p.id !== excludeId) : items;

  if (visible.length === 0) return null;

  return (
    <section className="border-t border-border pt-10 sm:pt-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="h-px w-8 bg-amber-500" />
            {t('product.recentlyViewed')}
          </p>
          <h2 className="font-display text-3xl leading-none text-foreground sm:text-4xl">{t('product.recentlyViewed')}</h2>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">{visible.length} ürün</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
        {visible.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} cols={4} />
        ))}
      </div>
    </section>
  );
}
