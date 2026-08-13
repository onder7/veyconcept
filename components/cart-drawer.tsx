'use client';

import { useCart } from '@/lib/cart/context';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { L } from '@/lib/data';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } =
    useCart();
  const { locale } = useLocale();
  const t = useT();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-6 py-5">
          <SheetTitle className="font-display text-2xl">
            {t(dictionary.cart.title)}
            <span className="ml-2 text-sm font-sans font-normal text-muted-foreground">
              ({items.length})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-xl">
                {t(dictionary.cart.empty)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(dictionary.cart.emptyBody)}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={closeCart}
              className="mt-2 rounded-full"
            >
              {t(dictionary.cart.continue)}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-secondary">
                      <img
                        src={item.product.imageOff}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display text-base leading-tight">
                            {item.product.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {L(item.product.tagline, locale)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          aria-label={t(dictionary.cart.remove)}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            aria-label="Decrease"
                            onClick={() =>
                              updateQty(item.product.id, item.qty - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase"
                            onClick={() =>
                              updateQty(item.product.id, item.qty + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-display text-base">
                          ${(item.product.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/60 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t(dictionary.cart.subtotal)}
                </span>
                <span className="font-display text-xl">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(dictionary.cart.freeShip)}
              </p>
              <Button className="mt-4 w-full rounded-full bg-foreground py-6 text-base hover:bg-amber-900">
                {t(dictionary.cart.checkout)}
              </Button>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                {t(dictionary.cart.continue)}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
