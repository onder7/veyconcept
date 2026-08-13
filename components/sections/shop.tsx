'use client';

import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { products, Product, L } from '@/lib/data';
import { ProductDetail } from '@/components/product-detail';
import { SmartLampImage } from '@/components/smart-lamp-image';
import { cn } from '@/lib/utils';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

type Category = 'All' | 'Seating' | 'Tables' | 'Objects';

export function Shop() {
  const t = useT();
  const { locale } = useLocale();
  const [active, setActive] = useState<Category>('All');
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const categories: { key: Category; label: string }[] = [
    { key: 'All', label: t(dictionary.shop.all) },
    { key: 'Seating', label: t(dictionary.shop.seating) },
    { key: 'Tables', label: t(dictionary.shop.tables) },
    { key: 'Objects', label: t(dictionary.shop.objects) },
  ];

  const filtered = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active],
  );

  const handleOpen = (product: Product) => {
    setSelected(product);
    setOpen(true);
  };

  return (
    <section id="shop" className="bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <p className="mb-5 flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span className="h-px w-10 bg-amber-500" />
            {t(dictionary.shop.eyebrow)}
          </p>
          <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
            {t(dictionary.shop.title1)}{' '}
            <span className="italic text-amber-600">{t(dictionary.shop.title2)}</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t(dictionary.shop.body)}
          </p>

          {/* Category filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActive(cat.key)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-all',
                  active === cat.key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {filtered.map((product, index) => (
            <article
              key={product.id}
              className="group cursor-pointer"
              onClick={() => handleOpen(product)}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <SmartLampImage
                  imageOff={product.imageOff}
                  imageOn={product.imageOn}
                  alt={product.name}
                  variant="card"
                  className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 z-10 font-mono text-xs text-foreground/40 mix-blend-difference">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/20 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-xs font-medium text-foreground">
                    {t(dictionary.shop.viewDetail)}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-xl text-foreground transition-colors group-hover:text-amber-700">
                    {product.name}
                  </h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {L(product.tagline, locale)}
                  </p>
                </div>
                <span className="shrink-0 font-display text-lg text-foreground">
                  ${product.price.toLocaleString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProductDetail product={selected} open={open} onOpenChange={setOpen} />
    </section>
  );
}
