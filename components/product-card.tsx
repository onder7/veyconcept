'use client';

import { Product } from '@/lib/data';
import { SmartLampImage } from '@/components/smart-lamp-image';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { L } from '@/lib/data';

type ProductCardProps = {
  product: Product;
  onOpen: (product: Product) => void;
};

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const { locale } = useLocale();
  const t = useT();

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-border/60 bg-secondary">
        <SmartLampImage
          imageOff={product.imageOff}
          imageOn={product.imageOn}
          alt={product.name}
          variant="card"
          className="h-full w-full"
        />
        {product.hasLamp && (
          <div className="absolute left-4 top-4 z-10">
            <Badge
              variant="outline"
              className="border-amber-300/70 bg-background/80 text-amber-800 backdrop-blur-md"
            >
              {t(dictionary.shop.smartLamp)}
            </Badge>
          </div>
        )}
        <button
          type="button"
          onClick={() => onOpen(product)}
          className="absolute inset-0 z-0 flex items-end justify-start p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-label={`${t(dictionary.shop.viewDetail)} — ${product.name}`}
        >
          <span className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">
            {t(dictionary.shop.viewDetail)} <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(product)}
        className="mt-5 flex items-start justify-between gap-4 text-left"
      >
        <div>
          <h3 className="font-display text-xl text-foreground transition-colors group-hover:text-amber-800">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {L(product.tagline, locale)}
          </p>
        </div>
        <span className="shrink-0 font-display text-lg text-foreground">
          ${product.price.toLocaleString()}
        </span>
      </button>
    </article>
  );
}
