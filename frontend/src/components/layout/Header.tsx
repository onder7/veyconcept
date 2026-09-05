import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCircle, ShoppingBag, Search, LogOut, Loader2, Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { authApi } from '@/services/authApi';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/services/productApi';
import { api } from '@/services/api';
import { useProfileCompleteness } from '@/hooks/useProfileCompleteness';
import { useTaxConfig } from '@/hooks/useTaxConfig';
import type { Product } from '@/types';

export function Header() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { hasWarning: profileHasWarning, message: profileWarningMessage } = useProfileCompleteness();
  const { taxRate } = useTaxConfig();
  const itemCount = useCartStore((s) => s.itemCount);
  const openCart = useCartStore((s) => s.openCart);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'tr' | 'en'>(() => {
    const lang = (i18n.language || 'tr').split('-')[0];
    return lang === 'en' ? 'en' : 'tr';
  });
  const { fetchWishlist } = useWishlistStore();

  const [predictions, setPredictions] = useState<Product[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  // Referans header etkileşimleri: açılır arama, mobil çekmece
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setPredictions([]);
      setLoadingPredictions(false);
      return;
    }

    setLoadingPredictions(true);
    const delayDebounceFn = setTimeout(() => {
      productApi.list({ search: searchQuery.trim(), limit: 5 })
        .then((res) => {
          setPredictions(res.data?.items || []);
        })
        .catch((err) => {
          console.error('Failed to load predictions:', err);
        })
        .finally(() => {
          setLoadingPredictions(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowPredictions(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productApi.categories(),
  });
  const categories = (categoriesData?.data?.data ?? []).filter((cat: any) => cat.showInMenu !== false);

  // Üst şerit menüsü — admin tarafından yönetilen Müşteri Hizmetleri sayfaları
  const { data: menuPagesData } = useQuery({
    queryKey: ['menu-pages'],
    queryFn: () => api.get<{ success: boolean; data: Array<{ slug: string; title: string; isSystem: boolean; showInHeader: boolean; showInFooter: boolean }> }>('/pages'),
    staleTime: 5 * 60 * 1000,
  });
  const menuPages = (menuPagesData?.data?.data ?? []).filter((p) => p.showInHeader);

  const handleLanguageChange = (lang: 'tr' | 'en') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // silently ignore
    }
    logout();
    toast.success(t('header.logout'));
    navigate('/');
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setShowPredictions(false);
    if (searchQuery.trim()) {
      navigate(`/ara?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/ara');
    }
  };

  // Rota değişince açık panelleri kapat
  useEffect(() => {
    setSearchOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full self-start border-b border-[#eadcc9]/90 bg-[#fff9ef]/95 text-[#7a6a5a] shadow-sm backdrop-blur-md">
      <div className="relative mx-auto flex min-h-[148px] max-w-[1600px] flex-col items-center justify-center px-4 py-5 sm:min-h-[166px] sm:py-6">
        <button
          type="button"
          className="absolute left-4 top-5 flex md:hidden"
          aria-label={t('common.search')}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex flex-col items-center leading-none" aria-label={t('header.home')}>
          <>
            <span className="font-display text-[2.65rem] font-semibold uppercase tracking-[0.14em] text-[#6b1017] sm:text-[3.2rem]">VEY</span>
            <span className="mt-1 text-[0.48rem] font-semibold uppercase tracking-[0.48em] text-[#6b1017] sm:text-[0.55rem]">CONCEPT</span>
          </>
        </Link>

        <nav className="mt-6 hidden items-center justify-center gap-7 sm:gap-8 md:flex" aria-label="Ana menü">
          <Link to="/" className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7a6a5a] transition-colors hover:text-[#6b1017]">{t('header.home')}</Link>
          <Link to="/ara" className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7a6a5a] transition-colors hover:text-[#6b1017]">{t('header.shop')}</Link>
          <Link to="/hakkimizda" className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7a6a5a] transition-colors hover:text-[#6b1017]">{t('header.about')}</Link>
          <Link to="/iletisim" className="text-[0.68rem] uppercase tracking-[0.08em] text-[#7a6a5a] transition-colors hover:text-[#6b1017]">{t('header.contact')}</Link>
        </nav>

        <div className="absolute right-4 top-5 hidden items-center gap-1 sm:flex md:right-6 md:top-6">
          <button type="button" aria-label={t('common.search')} onClick={() => setSearchOpen((v) => !v)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#7a6a5a] transition-colors hover:bg-[#f3e7d6] hover:text-[#6b1017]">
            {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<button type="button" aria-label={t('common.language')} className="flex h-8 w-8 items-center justify-center rounded-full text-[#7a6a5a] transition-colors hover:bg-[#f3e7d6] hover:text-[#6b1017]"><Globe className="h-4 w-4" /></button>} />
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => handleLanguageChange('tr')} className={`text-sm ${language === 'tr' ? 'bg-amber-50 text-[#6b1017]' : ''}`}>
                🇹🇷 {t('common.turkish')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')} className={`text-sm ${language === 'en' ? 'bg-amber-50 text-[#6b1017]' : ''}`}>
                🇬🇧 {t('common.english')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<button type="button" aria-label={t('header.account')} className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#7a6a5a] hover:bg-[#f3e7d6] hover:text-[#6b1017]"><UserCircle className="h-[18px] w-[18px] stroke-[1.5]" />{profileHasWarning && <span title={profileWarningMessage} className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#fff9ef]" />}</button>} />
              <DropdownMenuContent align="end" className="w-56">{user?.email && <div className="px-3 py-2"><p className="truncate text-sm font-medium text-foreground">{user?.profile?.firstName ?? user.email}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>}<DropdownMenuSeparator /><DropdownMenuItem render={<Link to="/hesabim" />} className="text-sm">{t('account.myAccount')}</DropdownMenuItem><DropdownMenuItem onClick={handleLogout} className="text-sm text-destructive"><LogOut className="mr-2 h-4 w-4" />{t('header.logoutBtn')}</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          ) : <Link to="/giris" aria-label={t('header.signIn')} className="flex h-8 w-8 items-center justify-center rounded-full text-[#7a6a5a] hover:bg-[#f3e7d6] hover:text-[#6b1017]"><UserCircle className="h-[18px] w-[18px] stroke-[1.5]" /></Link>}
          <button type="button" onClick={openCart} aria-label={t('common.myCart')} className="relative flex h-8 w-8 items-center justify-center rounded-full text-[#7a6a5a] hover:bg-[#f3e7d6] hover:text-[#6b1017]"><ShoppingBag className="h-[17px] w-[17px]" />{itemCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#6b1017] px-1 text-[10px] font-semibold text-white">{itemCount}</span>}</button>
        </div>
      </div>

      {/* ─── Açılır arama barı ─────────────────────────────────────── */}
      {searchOpen && (
        <div className="border-t border-border/60 bg-background">
          <form onSubmit={handleSearchSubmit} className="search-container relative mx-auto max-w-2xl px-4 py-4">
            <Search className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              autoFocus
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowPredictions(true)}
              className="h-11 rounded-sm border border-border bg-card pl-11 pr-4 text-sm placeholder:text-muted-foreground focus-visible:border-amber-500/60 focus-visible:ring-1 focus-visible:ring-amber-500/40"
            />
            {showPredictions && searchQuery.trim().length >= 2 && (
              <div className="absolute inset-x-4 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-sm border border-border bg-background shadow-xl">
                {loadingPredictions ? (
                  <div className="flex items-center justify-center gap-2 p-4 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin text-amber-600" /> {t('header.searching')}
                  </div>
                ) : predictions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">{t('header.noResults')}</div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {predictions.map((prod) => {
                      const primaryImg = prod.images?.find((img) => img.isPrimary)?.url || prod.images?.[0]?.url || '';
                      const rawPrice = prod.variants?.[0]?.price ? Number(prod.variants[0].price) : 0;
                      const grossPrice = prod.vatIncluded ? rawPrice : rawPrice * (1 + taxRate / 100);
                      const price = rawPrice ? grossPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }) : '';
                      return (
                        <Link
                          key={prod.id}
                          to={`/urun/${prod.slug}`}
                          onClick={() => { setSearchQuery(''); setShowPredictions(false); setSearchOpen(false); }}
                          className="flex items-center gap-3 p-3 transition-colors hover:bg-secondary"
                        >
                          <img src={primaryImg} alt={prod.name} className="h-10 w-10 shrink-0 rounded-sm bg-secondary object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">{prod.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{prod.category?.name}</p>
                          </div>
                          {price && <div className="shrink-0 font-display text-sm text-foreground">{price}</div>}
                        </Link>
                      );
                    })}
                    <Link
                      to={`/ara?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => { setShowPredictions(false); setSearchOpen(false); }}
                      className="block bg-secondary/40 p-2.5 text-center text-[11px] font-semibold text-amber-800 hover:underline dark:text-amber-500"
                    >
                      {t('header.viewAll')}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {/* ─── Mobil çekmece ─────────────────────────────────────────── */}
      <div
        className={cn(
          'overflow-hidden border-t transition-all duration-500 md:hidden',
          mobileOpen ? 'max-h-[560px] border-border bg-background' : 'max-h-0 border-transparent',
        )}
      >
          <nav className="flex flex-col gap-1 px-6 py-4">
          <Link to="/ara" className="py-2.5 font-display text-2xl text-foreground">{t('header.shop')}</Link>
          {categories.slice(0, 6).map((cat: any) => (
            <Link key={cat.id} to={`/kategori/${cat.slug}`} className="py-1.5 text-sm text-muted-foreground">
              {cat.name}
            </Link>
          ))}
          <div className="my-2 h-px bg-border/60" />
          {menuPages.map((p) => (
            <Link key={p.slug} to={p.isSystem ? `/${p.slug}` : `/sayfa/${p.slug}`} className="py-2 text-sm text-muted-foreground">
              {p.title}
            </Link>
          ))}
          <div className="my-2 h-px bg-border/60" />
          {isAuthenticated ? (
            <>
              <Link to="/hesabim" className="py-2 text-sm text-muted-foreground">{t('header.account')}</Link>
              <button onClick={handleLogout} className="py-2 text-left text-sm text-destructive">{t('header.logoutBtn')}</button>
            </>
          ) : (
            <Link to="/giris" className="py-2 text-sm text-muted-foreground">{t('header.signIn')}</Link>
          )}
          <Link to="/sepet" className="py-2 text-sm text-muted-foreground">{t('header.cartItems', { count: itemCount })}</Link>
        </nav>
      </div>
    </header>
  );
}
