import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { cartApi } from '@/services/cartApi';
import { toast } from 'sonner';
import { CampaignBadges } from '@/components/common/CampaignDisplay';
import { useTaxConfig } from '@/hooks/useTaxConfig';

interface Props {
  product: Product;
  hideDetails?: boolean;
  cols?: 2 | 3 | 4;
}

function formatPrice(price: number | string): string {
  return Number(price).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' TL';
}

export function ProductCard({ product, hideDetails = false, cols = 4 }: Props) {
  const { t } = useTranslation();
  
  // Görseller: birincil önce, ardından diğerleri — hover'da sırayla döner
  const images = (product.images ?? [])
    .slice()
    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  const primaryImage = images[0];

  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = () => {
    if (images.length < 2 || intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setImgIdx((i) => (i + 1) % images.length);
    }, 900);
  };
  const stopCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setImgIdx(0);
  };
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const activeImage = images[imgIdx] ?? primaryImage;

  const cheapestVariant = product.variants?.reduce((min, v) =>
    Number(v.price) < Number(min.price) ? v : min, product.variants[0]);
  const inStock = product.variants?.some((v) => v.stockQty > 0);

  // İndirim oranı
  const discount = cheapestVariant && cheapestVariant.compareAt
    ? Math.round(((Number(cheapestVariant.compareAt) - Number(cheapestVariant.price)) / Number(cheapestVariant.compareAt)) * 100)
    : 0;

  // Ortalama puan
  const ratings = product.reviews?.map((r) => r.rating) ?? [];
  const reviewCount = product._count?.reviews ?? ratings.length;
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;

  // KDV dahil fiyat — global tax-config kullanılır (sepet ile tutarlı)
  const { taxRate } = useTaxConfig();
  const toGross = (v: number) => (product.vatIncluded ? v : v * (1 + taxRate / 100));
  const grossPrice = cheapestVariant ? toGross(Number(cheapestVariant.price)) : 0;
  const grossCompareAt = discount > 0 && cheapestVariant?.compareAt ? toGross(Number(cheapestVariant.compareAt)) : 0;

  const { isFavorite, toggleFavorite } = useWishlistStore();
  const { setCart, openCart } = useCartStore();
  const fav = isFavorite(product.id);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user?.isGuest || !user) {
      toast.info(t('components.productCard.favoriteLoginRequired'));
      navigate('/kayit');
      return;
    }
    await toggleFavorite(product.id);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cheapestVariant || !inStock) return;
    try {
      const res = await cartApi.addItem(cheapestVariant.id, 1);
      setCart(res.data.data);
      openCart();
    } catch {
      toast.error(t('components.productCard.addToCart'));
    }
  };

  // 2li gösterimde resim daha küçük aspect ratio, 4lü gösterimde daha büyük
  const aspectRatio = cols === 2 ? 'aspect-[2/3]' : 'aspect-[5/6]';
  const scale = cols === 2 ? 'scale-75' : '';

  return (
    <Link
      to={`/urun/${product.slug}`}
      className={`group flex flex-col rounded-sm overflow-hidden text-left transition-all duration-300 ${
        hideDetails ? `border-none bg-transparent ${scale} origin-top-left` : 'border border-border bg-card dark:bg-neutral-900 hover:border-foreground/30 dark:hover:border-neutral-600'
      }`}
    >
      {/* Görsel Kutusu */}
      <div
        className={`relative ${aspectRatio} bg-transparent flex items-center justify-center overflow-hidden`}
        onMouseEnter={startCycle}
        onMouseLeave={stopCycle}
      >
        {activeImage ? (
          <img
            src={activeImage.url}
            alt={activeImage.altText ?? product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <span className="text-neutral-400 text-xs font-semibold">{t('components.productCard.noImage')}</span>
        )}

        {/* Favori */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-background/90 backdrop-blur-xs text-foreground/60 hover:text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-border"
          aria-label={t('components.productCard.addFavorites')}
        >
          <Heart className={`h-4.5 w-4.5 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`} />
        </button>

        {!inStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-[10px] font-medium uppercase tracking-[0.2em] bg-black/70 px-3 py-1">
              {t('components.productCard.outOfStock')}
            </span>
          </div>
        )}

        {/* Hover overlay - hideDetails'a göre bilgi göster */}
        {hideDetails && (
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <h3 className="font-display text-xs leading-tight text-white mb-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-[10px] text-white/70 line-clamp-2 mb-1.5">
                {product.description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').substring(0, 100)}
              </p>
            )}
            <div className="w-full">
              {cheapestVariant && (
                <span className="text-xs font-medium text-white">
                  {formatPrice(grossPrice)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detaylar */}
      {!hideDetails && (
        <div className="flex flex-col gap-1.5 p-3 flex-1">
          {/* Kampanya / Kupon rozeti */}
          <div className="flex justify-center">
            <CampaignBadges />
          </div>

          {/* Ürün Adı (marka + ad, 2 satır) */}
          <h3 className="font-sans text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[3.25rem]">
            {product.brand?.name && <span className="font-semibold">{product.brand.name} </span>}
            {product.name}
          </h3>

          {/* Puan */}
          {avgRating !== null && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground/80">
                {avgRating.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">({reviewCount})</span>
            </div>
          )}

          {/* Fiyat bilgisi (gri alan) + Sepete Ekle */}
          <div className="mt-auto rounded-sm bg-secondary dark:bg-neutral-800 px-3 py-2.5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              {discount > 0 && (
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(grossCompareAt)}</span>
                  <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 rounded-sm px-1.5 py-0.5">%{discount}</span>
                </div>
              )}
              <span className={`font-display text-xl ${discount > 0 ? 'text-amber-800 dark:text-amber-400' : 'text-foreground'}`}>
                {cheapestVariant ? formatPrice(grossPrice) : t('components.productCard.noPrice')}
              </span>
            </div>
            {inStock && (
              <button
                onClick={handleAddToCart}
                className="shrink-0 h-10 w-10 flex items-center justify-center rounded-full border border-border bg-card dark:bg-neutral-900 text-foreground/70 dark:text-neutral-200 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all cursor-pointer"
                aria-label={t('components.productCard.addToCart')}
              >
                <ShoppingCart className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
