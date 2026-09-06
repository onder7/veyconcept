import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, ShoppingCart, Star, Minus, Plus, Heart, X, ZoomIn, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { productApi } from '@/services/productApi';
import { cartApi } from '@/services/cartApi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ProductQA } from '@/components/product/ProductQA';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { SeoHead, SITE_URL } from '@/components/seo/SeoHead';
import { productSchema, breadcrumbSchema } from '@/lib/schemas';
import { useTaxConfig } from '@/hooks/useTaxConfig';
import { useStoreInfo } from '@/hooks/useStoreInfo';

function ProductShareBar({ name, url }: { name: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const { name: storeName } = useStoreInfo();
  const { t } = useTranslation();

  const encodedUrl  = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${name} — ${storeName}`);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [url]);

  const shares = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(name + '\n' + url)}`,
      bg: 'hover:bg-[#25D366]/10 hover:border-[#25D366]/40 hover:text-[#25D366]',
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 32 32">
          <path d="M16.003 3C9.375 3 4 8.373 4 15.001c0 2.118.553 4.107 1.518 5.837L4 29l8.38-1.495A12.94 12.94 0 0016.003 28c6.628 0 12.003-5.373 12.003-12.001S22.631 3 16.003 3zm5.97 16.774c-.327-.163-1.935-.955-2.234-1.065-.3-.109-.517-.163-.735.163-.218.328-.844 1.065-.935 1.065-.163 0-.327-.054-.49-.163-.327-.163-1.38-.508-2.625-1.62-.97-.866-1.625-1.937-1.815-2.265-.19-.327-.02-.503.144-.666.147-.147.327-.382.49-.572.164-.19.219-.327.328-.545.109-.218.054-.41-.027-.572-.082-.163-.735-1.774-1.008-2.427-.264-.635-.537-.545-.735-.556h-.626c-.218 0-.572.082-.872.41-.3.327-1.143 1.118-1.143 2.727s1.17 3.162 1.333 3.38c.163.218 2.302 3.514 5.58 4.93.78.336 1.388.536 1.863.687.783.25 1.496.214 2.059.13.628-.094 1.935-.79 2.208-1.554.273-.763.273-1.417.19-1.554-.08-.136-.3-.218-.626-.382z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600',
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      bg: 'hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800',
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.254 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      bg: 'hover:bg-red-50 hover:border-red-200 hover:text-red-600',
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="text-xs text-muted-foreground shrink-0">{t('product.shareProduct')}:</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {shares.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${s.label}'da paylaş`}
            className={`flex items-center justify-center h-8 w-8 rounded-full border border-border text-muted-foreground transition-all ${s.bg}`}
          >
            {s.icon}
          </a>
        ))}

        {/* Link kopyala */}
        <button
          type="button"
          title={t('product.copyLink')}
          onClick={copy}
          className={`flex items-center justify-center h-8 w-8 rounded-full border transition-all ${
            copied
              ? 'border-green-300 bg-green-50 text-green-600'
              : 'border-border text-muted-foreground hover:bg-muted hover:border-muted-foreground/40'
          }`}
        >
          {copied ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
      {copied && (
        <span className="text-xs text-green-600 animate-in fade-in slide-in-from-left-1 duration-150">
          {t('product.copied')}
        </span>
      )}
    </div>
  );
}

function formatPrice(price: number | string): string {
  return Number(price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
}

export function ProductDetail() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { name: storeName } = useStoreInfo();
  const { taxRate } = useTaxConfig();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'reviews' | 'qa'>('reviews');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const { setCart, openCart } = useCartStore();
  const qc = useQueryClient();
  const { isFavorite, toggleFavorite } = useWishlistStore();
  const addToRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);

  const addToCartMut = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      cartApi.addItem(variantId, quantity),
    onSuccess: (res) => {
      setCart(res.data.data);
      qc.setQueryData(['cart'], res.data.data);
      openCart();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Sepete eklenemedi');
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug, i18n.language],
    queryFn: () => productApi.get(slug!),
    enabled: !!slug,
    staleTime: 1000 * 30, // 30 saniye
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const product = data?.data?.data;

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (product?.images?.length) {
      const idx = product.images.findIndex((img) => img.isPrimary);
      setActiveImageIdx(idx >= 0 ? idx : 0);
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveImageIdx((i) => Math.min(i + 1, (product?.images?.length ?? 1) - 1));
      if (e.key === 'ArrowLeft') setActiveImageIdx((i) => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, product?.images?.length]);

  const fav = product ? isFavorite(product.id) : false;
  const variant = product?.variants?.[0] ?? null;
  const activeImage = product?.images?.[activeImageIdx] ?? product?.images?.[0];
  const hasDiscount = variant?.compareAt && Number(variant.compareAt) > Number(variant.price);
  const avgRating = product?.reviews?.length
    ? (product.reviews as { rating: number }[]).reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;

  if (isLoading) return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </main>
  );

  if (isError || !product) return (
    <main className="container mx-auto px-4 py-24 text-center">
      <p className="text-xl text-muted-foreground">{t('product.notFound')}</p>
      <Button render={<Link to="/" />} className="mt-4">{t('breadcrumb.home')}</Button>
    </main>
  );

  // Üründeki tüm attribute'ları sortOrder'a göre sıralı topla
  const attributeMap = new Map<string, { id: string; name: string; slug: string; inputType: string; sortOrder: number }>();
  product.variants.forEach((v) =>
    v.attributeValues?.forEach(({ attributeValue: av }) => {
      if (!attributeMap.has(av.attribute.id)) attributeMap.set(av.attribute.id, av.attribute);
    })
  );
  const attributeKeys = [...attributeMap.values()].sort((a, b) => a.sortOrder - b.sortOrder);

  const primaryImage =
    product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <SeoHead
        title={product.name}
        description={
          product.description
            ? product.description.slice(0, 155)
            : `${product.name} — ${product.category.name} kategorisinde en iyi fiyatlarla. Hızlı kargo, kolay iade.`
        }
        keywords={[
          product.name,
          product.category.name,
          product.brand?.name,
          'satın al',
          'fiyat',
          'ev tekstili',
        ]
          .filter(Boolean)
          .join(', ')}
        image={primaryImage?.url}
        url={`${SITE_URL}/urun/${product.slug}`}
        type="product"
        schema={[
          productSchema(product, storeName),
          breadcrumbSchema([
            { name: 'Ana Sayfa', url: SITE_URL },
            {
              name: product.category.name,
              url: `${SITE_URL}/kategori/${product.category.slug}`,
            },
            { name: product.name, url: `${SITE_URL}/urun/${product.slug}` },
          ]),
        ]}
      />
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">{t('breadcrumb.home')}</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/kategori/${product.category.slug}`} className="hover:text-foreground">
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
        {/* Görsel Galerisi */}
        <div className="space-y-4">
          <div className="relative mx-auto w-full max-w-none">
            <div
              className="aspect-[4/5] sm:aspect-square rounded-sm overflow-hidden bg-transparent cursor-zoom-in group/img"
              onClick={() => activeImage && setLightboxOpen(true)}
            >
              {activeImage ? (
                <>
                  <img
                    src={activeImage.url}
                    alt={activeImage.altText ?? product.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-1.5">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Görsel yok</div>
              )}
            </div>

            {/* Favori butonu — resmin sağ üst köşesi */}
            <button
              type="button"
              title={fav ? t('product.removeFromWishlist') : t('product.addToWishlist')}
              onClick={() => {
                if (authUser?.isGuest || !authUser) {
                  toast.info(t('product.favoriteLoginRequired'));
                  navigate('/kayit');
                  return;
                }
                toggleFavorite(product.id);
              }}
              className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
                fav
                  ? 'bg-red-500 hover:bg-red-600 text-white scale-110'
                  : 'bg-white/90 backdrop-blur-sm text-neutral-400 hover:text-red-400 hover:bg-white hover:scale-110'
              }`}
            >
              <Heart className={`h-5 w-5 transition-all duration-200 ${fav ? 'fill-white' : ''}`} />
            </button>

            {/* İleri / geri okları (birden fazla görsel varsa) */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={t('product.previousImage')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((i) => (i - 1 + product.images.length) % product.images.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 dark:bg-neutral-800/85 backdrop-blur-sm text-neutral-700 dark:text-neutral-200 shadow-md hover:bg-white dark:hover:bg-neutral-700 active:scale-95 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={t('product.nextImage')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx((i) => (i + 1) % product.images.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 dark:bg-neutral-800/85 backdrop-blur-sm text-neutral-700 dark:text-neutral-200 shadow-md hover:bg-white dark:hover:bg-neutral-700 active:scale-95 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin justify-start">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`shrink-0 h-20 w-20 sm:h-16 sm:w-16 rounded-sm overflow-hidden border transition-colors ${
                    i === activeImageIdx
                      ? 'border-foreground'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText ?? `${t('product.image')} ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bilgi */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {product.category.name}{product.brand ? ` · ${product.brand.name}` : ''}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-foreground">{product.name}</h1>

          {avgRating !== null && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                ))}
              </div>
              <span className="text-muted-foreground">({(product.reviews as { rating: number }[]).length} değerlendirme)</span>
            </div>
          )}

          {/* Fiyat - KDV - Stok - Miktar - Sepet (Grid Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end py-6 border-y border-border">
            {/* Sol: Bilgiler */}
            <div className="space-y-3">
              {/* Renk/Varyant */}
              {attributeKeys.length > 0 && (
                <div>
                  {attributeKeys.map((attr) => {
                    const selected = variant?.attributeValues?.find((x: any) => x.attributeValue.attribute.id === attr.id);
                    return (
                      <div key={attr.id}>
                        <p className="text-xs text-muted-foreground mb-1">{attr.name}</p>
                        <p className="text-sm font-medium">{selected?.attributeValue.value ?? '-'}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Stok */}
              {variant && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('product.stock')}</p>
                  <p className={`text-sm font-medium ${variant.stockQty > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variant.stockQty > 0 ? `${variant.stockQty} adet` : t('product.outOfStock')}
                  </p>
                </div>
              )}
              
              {/* KDV Dahil */}
              <p className="text-xs text-muted-foreground">KDV Dahil</p>
            </div>

            {/* Orta: Fiyat */}
            <div className="text-center">
              {variant && (
                <div className="space-y-2">
                  {hasDiscount && (
                    <p className="text-sm text-muted-foreground line-through">
                      {product.vatIncluded
                        ? formatPrice(variant.compareAt!)
                        : formatPrice(Number(variant.compareAt!) * (1 + taxRate / 100))}
                    </p>
                  )}
                  <p className={`font-display text-3xl ${hasDiscount ? 'text-amber-800 dark:text-amber-400' : 'text-foreground'}`}>
                    {product.vatIncluded
                      ? formatPrice(variant.price)
                      : formatPrice(Number(variant.price) * (1 + taxRate / 100))}
                  </p>
                </div>
              )}
            </div>

            {/* Sağ: Miktar + Sepete Ekle */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 justify-end">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    aria-label={t('product.decrease')}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                  <button
                    type="button"
                    aria-label={t('product.increase')}
                    className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => setQty((q) => Math.min(variant?.stockQty ?? 1, q + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <Button
                className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!variant || variant.stockQty === 0 || addToCartMut.isPending}
                onClick={() => variant && addToCartMut.mutate({ variantId: variant.id, quantity: qty })}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {addToCartMut.isPending ? t('product.addingToCart') : t('product.addToCart')}
              </Button>
            </div>
          </div>

          {/* Sosyal Medya Paylaşım */}
          <ProductShareBar
            name={product.name}
            url={typeof window !== 'undefined' ? window.location.href : `${SITE_URL}/urun/${product.slug}`}
          />

          {product.description && (
            <div className="border-t border-border pt-5">
              <h3 className="font-display text-2xl mb-3">{t('product.productDescription')}</h3>
              <div
                className="text-sm text-muted-foreground leading-relaxed product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Değerlendirmeler & Sorular Sekmesi ── */}
      <div className="mt-12">
        {/* Sekme Başlıkları */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 text-xs uppercase tracking-[0.14em] font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'reviews'
                ? 'border-amber-600 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('product.reviews')}
            {product._count?.reviews ? (
              <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                {product._count.reviews}
              </span>
            ) : null}
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-6 py-3 text-xs uppercase tracking-[0.14em] font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'qa'
                ? 'border-amber-600 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('product.questionsAnswers')}
          </button>
        </div>

        {/* Sekme İçeriği */}
        <div className="py-8">
          {activeTab === 'reviews' ? (
            <ProductReviews productId={product.id} />
          ) : (
            <ProductQA productId={product.id} />
          )}
        </div>
      </div>

      {/* Son görüntülenen ürünler */}
      <div className="mt-12">
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* Lightbox */}
      {lightboxOpen && product.images.length > 0 && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={(e) => { if (e.target === lightboxRef.current) setLightboxOpen(false); }}
        >
          {/* Kapat */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Önceki */}
          {product.images.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveImageIdx((i) => Math.max(i - 1, 0))}
              disabled={activeImageIdx === 0}
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Ana Resim */}
          <img
            src={product.images[activeImageIdx]?.url ?? ''}
            alt={product.images[activeImageIdx]?.altText ?? product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
            draggable={false}
          />

          {/* Sonraki */}
          {product.images.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveImageIdx((i) => Math.min(i + 1, product.images.length - 1))}
              disabled={activeImageIdx === product.images.length - 1}
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Sayaç */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === activeImageIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
