import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useTaxConfig } from '@/hooks/useTaxConfig';
import { ProductQuickView } from '@/components/home/ProductQuickView';

interface Props {
  products: Product[];
  loading?: boolean;
}

function formatPrice(n: number): string {
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

/**
 * Ana sayfa "shop" bölümü — demo.veyconcept.com <section id="shop"> uyarlaması.
 * Tek sayfa mantığı: ürüne tıklayınca sayfa değişmeden hızlı-görüntüleme modalı
 * (ProductQuickView) açılır. Kategori pill filtreleri, aspect-[4/5] editorial kartlar.
 */
export function HomeShop({ products, loading = false }: Props) {
  const { taxRate } = useTaxConfig();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          products
            .filter((p) => p.category?.slug)
            .map((p) => [p.category!.slug, p.category as { id: string; name: string; slug: string }]),
        ).values(),
      ),
    [products],
  );

  const filtered = useMemo(
    () => (activeCat === 'all' ? products : products.filter((p) => p.category?.slug === activeCat)),
    [products, activeCat],
  );

  const grossOf = (p: Product): number => {
    if (!p.variants?.length) return 0;
    const cheapest = p.variants.reduce((min, v) => (Number(v.price) < Number(min.price) ? v : min), p.variants[0]);
    const price = Number(cheapest.price);
    return p.vatIncluded ? price : price * (1 + taxRate / 100);
  };

  const openProduct = (p: Product) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <section id="shop" className="bg-background">
      <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 md:px-12 md:py-28">
        {/* Bölüm başlığı */}
        <div className="mb-12 md:mb-16">
          <p className="mb-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="h-px w-10 bg-amber-500" />
            Mağaza · Seçkiler
          </p>
          <h2 className="font-display text-5xl leading-[0.95] text-foreground md:text-7xl">
            Öne Çıkan <span className="italic text-amber-700">Parçalar</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Seçkin koleksiyonumuzdan öne çıkan ürünler. İncelemek istediğinize dokunun — sayfadan
            ayrılmadan detayları görüp sepetinize ekleyin.
          </p>

          {/* Kategori pill filtreleri */}
          {categories.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCat('all')}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-all',
                  activeCat === 'all'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                )}
              >
                Tümü
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveCat(cat.slug)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-all',
                    activeCat === cat.slug
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ürün ızgarası */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-sm bg-muted" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
                </div>
              ))
            : filtered.map((product, index) => {
                const img =
                  product.images?.find((im) => im.isPrimary)?.url || product.images?.[0]?.url || '';
                return (
                  <article key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          Görsel yok
                        </div>
                      )}
                      <span className="absolute left-4 top-4 z-10 font-mono text-xs text-white mix-blend-difference">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {/* Hover overlay pill */}
                      <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/20 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-medium text-foreground">
                          İncele <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg text-foreground transition-colors group-hover:text-amber-800 dark:group-hover:text-amber-500">
                          {product.brand?.name ? `${product.brand.name} ` : ''}
                          {product.name}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{product.category?.name}</p>
                      </div>
                      <span className="shrink-0 font-display text-lg text-foreground">
                        {product.variants?.length ? formatPrice(grossOf(product)) : ''}
                      </span>
                    </div>
                  </article>
                );
              })}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">Bu kategoride ürün bulunamadı.</p>
        )}
      </div>

      <ProductQuickView product={selected} open={open} onOpenChange={setOpen} />
    </section>
  );
}
