import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Minus, Plus, Trash2, ShoppingBag, Truck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cartApi } from '@/services/cartApi';
import { productApi } from '@/services/productApi';
import { useCartStore } from '@/store/cartStore';
import type { Cart as CartType } from '@/types';
import { toast } from 'sonner';

function formatPrice(price: number) {
  return price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

export function Cart() {
  const { setCart, setAppliedCoupon } = useCartStore();
  const qc = useQueryClient();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const { data: cart, isLoading } = useQuery<CartType | null>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartApi.get();
      return (res.data.data as CartType | null) ?? null;
    },
  });

  const { data: shippingConfig } = useQuery({
    queryKey: ['shipping-config'],
    queryFn: () => productApi.shippingConfig().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  // tax-config sorgusu kaldırıldı — fiyatlar KDV dahil

  const SHIPPING_FEE = shippingConfig?.shippingFee ?? 49.9;
  const FREE_THRESHOLD = shippingConfig?.freeShippingThreshold ?? 500;

  useEffect(() => {
    if (cart !== undefined) setCart(cart);
  }, [cart, setCart]);

  const updateMut = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: (res) => {
      setCart(res.data.data);
      qc.setQueryData(['cart'], res.data.data);
    },
    onError: () => toast.error('Güncelleme başarısız'),
  });

  const removeMut = useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (res) => {
      setCart(res.data.data);
      qc.setQueryData(['cart'], res.data.data);
    },
    onError: () => toast.error('Kaldırma başarısız'),
  });

  async function validateCoupon() {
    if (!couponCode.trim()) {
      toast.error('Kupon kodu girin');
      return;
    }

    const currentSubtotal = (cart?.items ?? []).reduce(
      (sum, item) => sum + item.priceAtAdd * item.quantity,
      0,
    );

    setValidatingCoupon(true);
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: currentSubtotal }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.error || 'Kupon geçersiz');
        setAppliedDiscount(null);
        setAppliedCoupon(null);
        return;
      }

      setAppliedDiscount(data.data);
      setAppliedCoupon({ code: data.data.code, value: Number(data.data.value), type: data.data.type });
      setCouponCode('');
      toast.success('Kupon başarıyla uygulandı!');
    } catch (err: any) {
      toast.error('Bir hata oluştu');
      setAppliedDiscount(null);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl mb-6">Sepetim</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-4xl mb-2">Sepetiniz boş</h1>
        <p className="text-muted-foreground mb-6">Alışverişe başlamak için ürünlere göz atın.</p>
        <Button render={<Link to="/ara" />}>Alışverişe Başla</Button>
      </main>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  let isDiscountValid = true;

  if (appliedDiscount) {
    const discountValue = typeof appliedDiscount.value === 'string'
      ? parseFloat(appliedDiscount.value)
      : appliedDiscount.value;

    const minOrder = appliedDiscount.minOrder
      ? (typeof appliedDiscount.minOrder === 'string'
        ? parseFloat(appliedDiscount.minOrder)
        : appliedDiscount.minOrder)
      : null;

    if (minOrder && subtotal < minOrder) {
      isDiscountValid = false;
    } else {
      discountAmount =
        appliedDiscount.type === 'PERCENT'
          ? (subtotal * discountValue) / 100
          : discountValue;
    }
  }

  // Remove discount if minimum order not met
  if (appliedDiscount && !isDiscountValid) {
    // Don't apply discount, but keep showing the UI (user can see why it's not working)
    discountAmount = 0;
  }

  if (appliedDiscount) {
    console.log('Applied discount:', appliedDiscount);
    console.log('Subtotal:', subtotal);
    console.log('Discount amount:', discountAmount);
    console.log('Subtotal after discount:', subtotal - discountAmount);
  }

  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount >= FREE_THRESHOLD ? 0 : SHIPPING_FEE;
  // Ürün fiyatları KDV dahil (vatIncluded=true). Ayrıca KDV hesaplanmaz.
  const total = subtotalAfterDiscount + shipping;
  const remaining = FREE_THRESHOLD - subtotalAfterDiscount;
  const isPending = updateMut.isPending || removeMut.isPending;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl mb-6">Sepetim</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Ürün listesi */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const img = item.variant.product.images?.[0];
            const attrValues = item.variant.attributeValues ?? [];
            return (
              <div key={item.id} className="flex gap-4 border border-border rounded-sm p-4">
                <div className="w-20 h-20 rounded-sm overflow-hidden bg-secondary flex-shrink-0">
                  {img ? (
                    <img src={img.url} alt={item.variant.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link
                      to={`/urun/${item.variant.product.slug}`}
                      className="font-display text-lg leading-snug hover:text-amber-700 line-clamp-2"
                    >
                      {item.variant.product.name}
                    </Link>
                  </div>
                  {attrValues.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {attrValues.map((av) => `${av.attributeValue.attribute.name}: ${av.attributeValue.value}`).join(' / ')}
                    </p>
                  )}
                  <p className="font-display text-lg text-foreground mt-1">{formatPrice(item.priceAtAdd)}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeMut.mutate(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    disabled={isPending}
                    aria-label="Kaldır"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center border border-border rounded-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      disabled={isPending}
                      onClick={() => {
                        if (item.quantity === 1) removeMut.mutate(item.id);
                        else updateMut.mutate({ itemId: item.id, quantity: item.quantity - 1 });
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      disabled={isPending || item.quantity >= item.variant.stockQty}
                      onClick={() => updateMut.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-sm font-medium">{formatPrice(item.priceAtAdd * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sipariş özeti */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-sm p-6 space-y-4 sticky top-24">
            <h2 className="font-display text-2xl">Sipariş Özeti</h2>

            {/* Kupon input */}
            <div className="border-b border-border pb-4">
              <label className="text-xs uppercase tracking-[0.14em] text-muted-foreground block mb-2">Kupon Kodu</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
                  disabled={appliedDiscount || validatingCoupon}
                  placeholder="Kupon kodunu girin"
                  className="flex-1 min-w-0 px-3 py-2 border border-border rounded-sm text-sm outline-none focus:border-amber-500 disabled:bg-secondary"
                />
                {appliedDiscount ? (
                  <button
                    onClick={() => {
                      setAppliedDiscount(null);
                      setAppliedCoupon(null);
                      setCouponCode('');
                    }}
                    className="shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    title="Kuponu kaldır"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={validateCoupon}
                    disabled={validatingCoupon}
                    className="shrink-0 whitespace-nowrap px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium hover:bg-amber-900 disabled:opacity-50 transition-all"
                  >
                    {validatingCoupon ? 'Kontrol ediliyor...' : 'Uygula'}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ara Toplam (KDV Dahil)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {appliedDiscount && isDiscountValid && discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim {appliedDiscount.type === 'PERCENT' ? `(${appliedDiscount.value}%)` : ''}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {appliedDiscount && !isDiscountValid && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  Min. {formatPrice(typeof appliedDiscount.minOrder === 'string' ? parseFloat(appliedDiscount.minOrder) : appliedDiscount.minOrder)} alışveriş gerekli ({formatPrice((typeof appliedDiscount.minOrder === 'string' ? parseFloat(appliedDiscount.minOrder) : appliedDiscount.minOrder) - subtotal)} daha)
                </div>
              )}

              <div className="flex justify-between">
                <span>Kargo</span>
                <span>{shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}</span>
              </div>

              {shipping > 0 && remaining > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatPrice(remaining)} daha ekleyin, kargo ücretsiz!</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (subtotal / FREE_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {shipping === 0 && (
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <Truck className="h-3.5 w-3.5 shrink-0" />
                  <span>Ücretsiz kargo hakkı kazandınız!</span>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-[0.14em] text-muted-foreground">Toplam</span>
              <span className="font-display text-2xl">{formatPrice(total)}</span>
            </div>

            <Button className="w-full h-11 rounded-full bg-foreground text-background hover:bg-amber-900" size="lg" render={<Link to="/odeme" />}>
              Siparişi Tamamla
            </Button>
            <Button variant="outline" className="w-full h-11 rounded-full" render={<Link to="/ara" />}>
              Alışverişe Devam Et
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
