import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/types';
import { ProductQuickView } from '@/components/home/ProductQuickView';

interface Props {
  products: Product[];
  loading?: boolean;
}

/**
 * Ana sayfa "shop" bölümü — demo.veyconcept.com <section id="shop"> uyarlaması.
 * Tek sayfa mantığı: ürüne tıklayınca sayfa değişmeden hızlı-görüntüleme modalı
 * (ProductQuickView) açılır. Kategori pill filtreleri, aspect-[4/5] editorial kartlar.
 */
export function HomeShop({ products, loading = false }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

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
            {t('components.homeShop.title')}
          </p>
          <h2 className="font-display text-5xl leading-[0.95] text-foreground md:text-7xl">
            {t('components.homeShop.heading')} <span className="italic text-amber-700">{t('product.details')}</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t('components.homeShop.description')}
          </p>

          {/* Kategori pill filtreleri - Kaldırıldı */}
        </div>

        {/* Ürün ızgarası */}
        <div className="mx-auto grid max-w-[900px] grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 xl:gap-x-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-sm bg-muted" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
                </div>
              ))
            : products.map((product, index) => {
                const img =
                  product.images?.find((im) => im.isPrimary)?.url || product.images?.[0]?.url || '';
                return (
                  <article key={product.id} className="group cursor-pointer" onClick={() => openProduct(product)}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-none bg-transparent">
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground bg-muted">
                          {t('components.homeShop.imageNotAvailable')}
                        </div>
                      )}
                      <span className="absolute left-4 top-4 z-10 font-mono text-xs text-white mix-blend-difference">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {/* Hover overlay - ürün bilgileri */}
                      <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <h3 className="font-display text-sm leading-tight text-white mb-2">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-white/70 line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between w-full">
                          {product.variants?.[0]?.price && (
                            <span className="text-sm font-medium text-white">
                              ₺{Number(product.variants[0].price).toFixed(2)}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20">
                            {t('components.homeShop.explore')} <ArrowUpRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                  </article>
                );
              })}
        </div>

        {!loading && products.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">{t('components.homeShop.noProducts')}</p>
        )}
      </div>

      <ProductQuickView product={selected} open={open} onOpenChange={setOpen} />
    </section>
  );
}
