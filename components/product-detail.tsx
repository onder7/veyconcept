'use client';

import { useState } from 'react';
import { Product } from '@/lib/data';
import { SmartLampImage } from '@/components/smart-lamp-image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { L } from '@/lib/data';
import { useCart } from '@/lib/cart/context';

type ProductDetailProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDetail({ product, open, onOpenChange }: ProductDetailProps) {
  const [qty, setQty] = useState(1);
  const { locale } = useLocale();
  const t = useT();
  const { addItem } = useCart();

  if (!product) return null;

  const handleAdd = () => {
    addItem(product, qty);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden rounded-sm border-border bg-background p-0 sm:max-w-5xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          {L(product.tagline, locale)}
        </DialogDescription>
        <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto md:h-full">
            <SmartLampImage
              imageOff={product.imageOff}
              imageOn={product.imageOn}
              alt={product.name}
              variant="detail"
              className="h-full w-full"
            />
            {product.hasLamp && (
              <div className="absolute left-5 top-5 z-20">
                <Badge className="border-amber-300/70 bg-background/85 text-amber-800 backdrop-blur-md">
                  <Lightbulb className="mr-1.5 h-3.5 w-3.5 fill-amber-300 text-amber-500" />
                  {t(dictionary.detail.integrated)}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {product.category} · {product.year}
                </p>
                <h2 className="mt-2 font-display text-4xl leading-tight text-foreground">
                  {product.name}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {L(product.tagline, locale)}
                </p>
              </div>

              <p className="text-sm leading-relaxed text-foreground/80">
                {L(product.description, locale)}
              </p>

              <Separator />

              <dl className="grid grid-cols-2 gap-y-4 text-sm">
                <dt className="text-muted-foreground">{t(dictionary.detail.designer)}</dt>
                <dd className="text-right text-foreground">{product.designer}</dd>
                <dt className="text-muted-foreground">{t(dictionary.detail.material)}</dt>
                <dd className="text-right text-foreground">{L(product.material, locale)}</dd>
                <dt className="text-muted-foreground">{t(dictionary.detail.edition)}</dt>
                <dd className="text-right text-foreground">{L(product.edition, locale)}</dd>
              </dl>
            </div>

            <div className="space-y-5">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl text-foreground">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t(dictionary.detail.freeShip)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAdd}
                  className="flex-1 rounded-full bg-foreground py-6 text-base text-background transition-all hover:bg-amber-900"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {t(dictionary.detail.addToBag)}
                </Button>
              </div>

              {product.hasLamp && (
                <p className="flex items-center gap-2 text-xs text-amber-800">
                  <Lightbulb className="h-3.5 w-3.5 fill-amber-300 text-amber-500" />
                  {t(dictionary.detail.lightHint)}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
