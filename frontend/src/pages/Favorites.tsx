import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductGrid } from '@/components/product/ProductGrid';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

export function Favorites() {
  const { t } = useTranslation();
  const { items, isLoading, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const products = items
    .map((item) => item.variant?.product)
    .filter(Boolean); // Filter out any null/undefined products

  return (
    <main className="container mx-auto px-4 py-12 flex-grow">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-4xl text-foreground">{t('favorites.myFavorites')}</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {t('favorites.description')}
          </p>
        </div>

        {isLoading && !products.length ? (
          <ProductGrid products={[]} loading={true} cols={4} />
        ) : !products.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-sm border border-border p-8">
            <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
              <Heart className="h-10 w-10 fill-red-50" />
            </div>
            <h2 className="font-display text-2xl text-foreground">{t('favorites.emptyFavorites')}</h2>
            <p className="text-neutral-500 text-sm max-w-sm mt-2 mb-8">
              {t('favorites.noFavoritesMessage')}
            </p>
            <Link to="/ara" className={cn(buttonVariants({ size: 'lg' }))}>
              {t('favorites.discoverProducts')}
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} cols={4} />
        )}
      </div>
    </main>
  );
}
export default Favorites;
