import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, ShoppingBag, ArrowUpRight, Star, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Product } from '@/types';
import { cartApi } from '@/services/cartApi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useTaxConfig } from '@/hooks/useTaxConfig';
import { toast } from 'sonner';

interface Props {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPrice(n: number): string {
  return n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

/** Ürün açıklamasından düz metin (kısa özet) */
function plainText(html?: string | null): string {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

/**
 * Ana sayfadaki "shop" bölümünden açılan ürün hızlı-görüntüleme modalı
 * (demo.veyconcept.com product-detail pop-up mantığı). Sayfa değişmeden
 * ürün detayını gösterir; sepete ekleme gerçek backend'e bağlıdır.
 */
export function ProductQuickView({ product, open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const { taxRate } = useTaxConfig();
  const { setCart, openCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useWishlistStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setQty(1);
    setImgIdx(0);
  }, [product?.id]);

  if (!product) return null;

  const images = (product.images ?? [])
    .slice()
    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  const activeImage = images[imgIdx] ?? images[0];

  const cheapestVariant = product.variants?.length
    ? product.variants.reduce((min, v) => (Number(v.price) < Number(min.price) ? v : min), product.variants[0])
    : null;
  const inStock = product.variants?.some((v) => v.stockQty > 0) ?? false;

  const discount =
    cheapestVariant && cheapestVariant.compareAt
      ? Math.round(((Number(cheapestVariant.compareAt) - Number(cheapestVariant.price)) / Number(cheapestVariant.compareAt)) * 100)
      : 0;

  const toGross = (v: number) => (product.vatIncluded ? v : v * (1 + taxRate / 100));
  const grossPrice = cheapestVariant ? toGross(Number(cheapestVariant.price)) : 0;
  const grossCompareAt = discount > 0 && cheapestVariant?.compareAt ? toGross(Number(cheapestVariant.compareAt)) : 0;

  const ratings = product.reviews?.map((r) => r.rating) ?? [];
  const reviewCount = product._count?.reviews ?? ratings.length;
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  const hasVariants = (product.variants?.length ?? 0) > 1;
  const description = plainText(product.description).slice(0, 220);

  const fav = isFavorite(product.id);

  const handleAdd = async () => {
    if (!cheapestVariant || !inStock) return;
    setAdding(true);
    try {
      const res = await cartApi.addItem(cheapestVariant.id, qty);
      setCart(res.data.data);
      onOpenChange(false);
      openCart();
    } catch {
      toast.error(t('components.productCard.addToCart'));
    } finally {
      setAdding(false);
    }
  };

  const handleFav = () => {
    if (user?.isGuest || !user) {
      toast.info(t('product.favoriteLoginRequired'));
      navigate('/kayit');
      return;
    }
    toggleFavorite(product.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-sm border border-border bg-background p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">{plainText(product.description).slice(0, 80)}</DialogDescription>

        <div className="grid max-h-[88vh] grid-cols-1 overflow-y-auto md:grid-cols-2">
          {/* Görsel */}
          <div className="relative flex flex-col gap-3 bg-transparent p-4 md:p-6">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-transparent">
              {activeImage ? (
                <img src={activeImage.url} alt={activeImage.altText ?? product.name} className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">{t('components.productCard.noImage')}</div>
              )}
              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-sm bg-amber-600 px-2 py-1 text-[11px] font-semibold text-white">
                  %{discount}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-sm border transition-colors ${
                      i === imgIdx ? 'border-foreground' : 'border-border hover:border-foreground/50'
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div className="flex flex-col gap-5 p-6 md:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {product.category?.name}
                {product.brand?.name ? ` · ${product.brand.name}` : ''}
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight text-foreground md:text-4xl">{product.name}</h2>
              {avgRating !== null && (
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground/80">{avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({reviewCount})</span>
                </div>
              )}
            </div>

            {/* Fiyat */}
            <div className="flex items-baseline gap-3">
              <span className={`font-display text-3xl ${discount > 0 ? 'text-amber-800 dark:text-amber-400' : 'text-foreground'}`}>
                {cheapestVariant ? formatPrice(grossPrice) : 'Fiyat yok'}
              </span>
              {discount > 0 && <span className="text-sm text-muted-foreground line-through">{formatPrice(grossCompareAt)}</span>}
            </div>

            {description && <p className="text-sm leading-relaxed text-foreground/70">{description}…</p>}

            {!inStock && (
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-destructive">{t('product.outOfStock')}</p>
            )}

            <div className="mt-auto space-y-3">
              {inStock && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      aria-label="Azalt"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                    <button
                      type="button"
                      aria-label="Artır"
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={adding}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-amber-900 disabled:opacity-60"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {adding ? t('product.addingToCart') : t('product.addToCart')}
                  </button>
                  <button
                    type="button"
                    onClick={handleFav}
                    aria-label={t('product.addToWishlist')}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-red-300 hover:text-red-500"
                  >
                    <Heart className={`h-4.5 w-4.5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              )}

              <Link
                to={`/urun/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-amber-800 transition-colors hover:text-amber-600 dark:text-amber-500"
              >
                {hasVariants ? t('product.details') : 'Ürün detayına git'}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
