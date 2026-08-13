'use client';

import Link from 'next/link';
import { PageShell, PageTitle } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart/context';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { L } from '@/lib/data';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();
  const { locale } = useLocale();
  const t = useT();

  if (items.length === 0) {
    return (
      <PageShell>
        <PageTitle title={t(dictionary.cartPage.title)} />
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-display text-2xl">{t(dictionary.cartPage.empty)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(dictionary.cartPage.emptyBody)}
            </p>
          </div>
          <Link href="/#shop">
            <Button className="rounded-full bg-foreground px-8 hover:bg-amber-900">
              {t(dictionary.cartPage.goShop)}
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTitle title={t(dictionary.cartPage.title)} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-sm border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-4 text-left font-medium">
                    {t(dictionary.cartPage.product)}
                  </th>
                  <th className="hidden px-4 py-4 text-center font-medium sm:table-cell">
                    {t(dictionary.cartPage.qty)}
                  </th>
                  <th className="px-4 py-4 text-right font-medium">
                    {t(dictionary.cartPage.total)}
                  </th>
                  <th className="px-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-4">
                      <div className="flex gap-4">
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-secondary">
                          <img
                            src={item.product.imageOff}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-display text-base">{item.product.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {L(item.product.tagline, locale)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            ${item.product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-4 sm:table-cell">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() => updateQty(item.product.id, item.qty - 1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center tabular-nums">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.product.id, item.qty + 1)}
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-display text-base">
                      ${(item.product.price * item.qty).toLocaleString()}
                    </td>
                    <td className="px-2 py-4">
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 rounded-sm border border-border bg-card p-6">
            <h2 className="font-display text-2xl">
              {t(dictionary.cartPage.grandTotal)}
            </h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t(dictionary.cartPage.subtotal)}
                </span>
                <span className="font-medium">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t(dictionary.cartPage.shipping)}
                </span>
                <span className="font-medium text-amber-700">
                  {t(dictionary.cartPage.free)}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-base">
                  <span className="font-display">
                    {t(dictionary.cartPage.grandTotal)}
                  </span>
                  <span className="font-display text-xl">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="mt-6 w-full rounded-full bg-foreground py-6 text-base hover:bg-amber-900">
                {t(dictionary.cartPage.checkout)}
              </Button>
            </Link>
            <Link
              href="/#shop"
              className="mt-3 block text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {t(dictionary.cartPage.continueShopping)}
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
