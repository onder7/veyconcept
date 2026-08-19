import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { X, Minus, Plus, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cartStore';
import { cartApi } from '@/services/cartApi';
import { toast } from 'sonner';

function formatPrice(n: number): string {
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

/**
 * Sağdan açılan sepet çekmecesi — demo.veyconcept.com cart-drawer uyarlaması.
 * Sepete ekleme yapıldığında otomatik açılır (useCartStore.openCart).
 */
export function CartDrawer() {
  const { cart, isDrawerOpen, setDrawerOpen, closeCart, setCart } = useCartStore();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

  const applyCart = (c: any) => {
    setCart(c);
    qc.setQueryData(['cart'], c);
  };

  const updateQty = async (itemId: string, quantity: number) => {
    if (busy) return;
    setBusy(true);
    try {
      if (quantity < 1) {
        const res = await cartApi.removeItem(itemId);
        applyCart(res.data.data);
      } else {
        const res = await cartApi.updateItem(itemId, quantity);
        applyCart(res.data.data);
      }
    } catch {
      toast.error('Güncelleme başarısız');
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await cartApi.removeItem(itemId);
      applyCart(res.data.data);
    } catch {
      toast.error('Kaldırma başarısız');
    } finally {
      setBusy(false);
    }
  };

  const goCheckout = () => {
    closeCart();
    navigate('/odeme');
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="right" className="flex w-full flex-col border-l border-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-6 py-5">
          <SheetTitle className="font-display text-2xl text-foreground">
            Sepetim
            <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">({items.length})</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-xl text-foreground">Sepetiniz boş</p>
              <p className="mt-1 text-sm text-muted-foreground">Alışverişe başlamak için ürünlere göz atın.</p>
            </div>
            <Link
              to="/ara"
              onClick={closeCart}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-5">
                {items.map((item) => {
                  const img = item.variant.product.images?.[0];
                  const attrs = item.variant.attributeValues ?? [];
                  return (
                    <li key={item.id} className="flex gap-4">
                      <Link
                        to={`/urun/${item.variant.product.slug}`}
                        onClick={closeCart}
                        className="h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-secondary"
                      >
                        {img ? (
                          <img src={img.url} alt={item.variant.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              to={`/urun/${item.variant.product.slug}`}
                              onClick={closeCart}
                              className="font-display text-base leading-tight text-foreground transition-colors hover:text-amber-800 line-clamp-2"
                            >
                              {item.variant.product.name}
                            </Link>
                            {attrs.length > 0 && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {attrs
                                  .map((av) => `${av.attributeValue.attribute.name}: ${av.attributeValue.value}`)
                                  .join(' / ')}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            disabled={busy}
                            aria-label="Kaldır"
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              type="button"
                              aria-label="Azalt"
                              disabled={busy}
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Artır"
                              disabled={busy || item.quantity >= item.variant.stockQty}
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-display text-base text-foreground">
                            {formatPrice(item.priceAtAdd * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-border/60 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ara Toplam</span>
                <span className="font-display text-xl text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Kargo ödeme adımında hesaplanır.</p>
              <button
                type="button"
                onClick={goCheckout}
                className="mt-4 w-full rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition-colors hover:bg-amber-900"
              >
                Ödemeye Geç
              </button>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  to="/sepet"
                  onClick={closeCart}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-amber-800 hover:underline dark:text-amber-500"
                >
                  Sepeti Görüntüle <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-xs uppercase tracking-[0.12em] text-muted-foreground underline-offset-4 hover:underline"
                >
                  Alışverişe Devam
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
