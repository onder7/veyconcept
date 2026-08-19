import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCircle, ShoppingBag, Search, LogOut, ChevronDown, Loader2, AlertTriangle, Menu, X } from 'lucide-react';
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
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useStoreInfo } from '@/hooks/useStoreInfo';
import { useProfileCompleteness } from '@/hooks/useProfileCompleteness';
import { useTaxConfig } from '@/hooks/useTaxConfig';
import type { Product } from '@/types';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { name: storeName } = useStoreInfo();
  const { hasWarning: profileHasWarning, message: profileWarningMessage } = useProfileCompleteness();
  const { taxRate } = useTaxConfig();
  const itemCount = useCartStore((s) => s.itemCount);
  const openCart = useCartStore((s) => s.openCart);
  const navigate = useNavigate();
  const location = useLocation();

  // Ana sayfada hero üstünde şeffaf header; scroll'da katı zemine geçer.
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const overHero = isHome && !scrolled;

  const [searchQuery, setSearchQuery] = useState('');
  const { fetchWishlist } = useWishlistStore();

  const [predictions, setPredictions] = useState<Product[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  // Referans header etkileşimleri: açılır arama, kategori dropdown, mobil çekmece
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch logo from settings
  useEffect(() => {
    fetch('/api/store-logo')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.data?.logo_url) {
          setLogoUrl(data.data.logo_url);
        }
      })
      .catch(() => {
        // Silent fail - use fallback text
      });
  }, []);

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

  // Özel navigasyon linkleri — admin panelinden yönetilen kategori menüsü ekleri
  const { data: navLinksData } = useQuery({
    queryKey: ['nav-links'],
    queryFn: () => api.get<{ success: boolean; data: Array<{ id: string; label: string; url: string; openInNewTab: boolean }> }>('/nav-links'),
    staleTime: 5 * 60 * 1000,
  });
  const navLinks = navLinksData?.data?.data ?? [];

  // Üst şerit menüsü — admin tarafından yönetilen Müşteri Hizmetleri sayfaları
  const { data: menuPagesData } = useQuery({
    queryKey: ['menu-pages'],
    queryFn: () => api.get<{ success: boolean; data: Array<{ slug: string; title: string; isSystem: boolean; showInHeader: boolean; showInFooter: boolean }> }>('/pages'),
    staleTime: 5 * 60 * 1000,
  });
  const menuPages = (menuPagesData?.data?.data ?? []).filter((p) => p.showInHeader);

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // silently ignore
    }
    logout();
    toast.success('Çıkış yapıldı');
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
    setCatOpen(false);
  }, [location.pathname]);

  // Logo düğümü: mağaza adının son kelimesi italik (referanstaki "Vey Concept" gibi)
  const logoWords = storeName.trim().split(/\s+/);
  const logoNode =
    logoWords.length > 1 ? (
      <>
        {logoWords.slice(0, -1).join(' ')} <span className="italic">{logoWords[logoWords.length - 1]}</span>
      </>
    ) : (
      storeName
    );

  // Nav link renk sınıfları (hero'da beyaz, aksi halde koyu)
  const navLinkCls = overHero ? 'text-white/85 hover:text-white' : 'text-foreground/80 hover:text-foreground';
  const navUnderlineCls = overHero ? 'bg-white' : 'bg-foreground';

  const iconBtnCls = overHero ? 'text-white hover:bg-white/15' : 'text-foreground hover:bg-secondary';

  return (
    <header
      className={`top-0 z-40 transition-all duration-500 ${
        isHome
          ? `fixed inset-x-0 ${
              overHero && !searchOpen && !mobileOpen
                ? 'bg-transparent text-white'
                : 'border-b border-border bg-background/95 backdrop-blur-md dark:border-neutral-800'
            }`
          : 'sticky border-b border-border bg-background/95 backdrop-blur-md dark:border-neutral-800'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 md:h-20 md:px-10">
        {/* ─── Sol: masaüstü navigasyon ─────────────────────────────── */}
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          <Link to="/ara" className={cn('group relative text-sm tracking-wide transition-colors', navLinkCls)}>
            Mağaza
            <span className={cn('absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full', navUnderlineCls)} />
          </Link>

          {/* Kategoriler dropdown */}
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button type="button" className={cn('group relative flex items-center gap-1 text-sm tracking-wide transition-colors', navLinkCls)}>
              Kategoriler
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', catOpen && 'rotate-180')} />
            </button>
            {catOpen && categories.length > 0 && (
              <div className="absolute left-0 top-full pt-3">
                <div className="grid w-64 gap-0.5 rounded-sm border border-border/60 bg-background p-2 shadow-lg">
                  {categories.slice(0, 12).map((cat: any) => (
                    <Link
                      key={cat.id}
                      to={`/kategori/${cat.slug}`}
                      className="rounded-sm px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link to="/ara" className="mt-1 border-t border-border/60 px-3 pt-2.5 text-[11px] uppercase tracking-[0.16em] text-amber-800 dark:text-amber-500 hover:underline">
                    Tüm Ürünler →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin özel nav linkleri */}
          {navLinks.slice(0, 2).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.openInNewTab ? '_blank' : undefined}
              rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              className={cn('group relative text-sm tracking-wide transition-colors', navLinkCls)}
            >
              {link.label}
              <span className={cn('absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full', navUnderlineCls)} />
            </a>
          ))}
        </nav>

        {/* Mobil menü butonu */}
        <button
          type="button"
          className="flex flex-1 md:hidden"
          aria-label="Menü"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen
            ? <X className={cn('h-6 w-6', overHero ? 'text-white' : 'text-foreground')} />
            : <Menu className={cn('h-6 w-6', overHero ? 'text-white' : 'text-foreground')} />}
        </button>

        {/* ─── Orta: logo ────────────────────────────────────────────── */}
        <Link to="/" className="flex flex-1 items-center justify-center md:flex-none">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName} className="h-9 sm:h-11 object-contain max-w-[150px]" />
          ) : (
            <span className={cn('font-display text-2xl tracking-tight transition-colors sm:text-3xl', overHero ? 'text-white' : 'text-foreground')}>
              {logoNode}
            </span>
          )}
        </Link>

        {/* ─── Sağ: kalan nav + aksiyonlar ───────────────────────────── */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          {/* Menü sayfaları (md+) */}
          <nav className="hidden items-center gap-6 lg:flex">
            {menuPages.slice(0, 2).map((p) => (
              <Link
                key={p.slug}
                to={p.isSystem ? `/${p.slug}` : `/sayfa/${p.slug}`}
                className={cn('group relative text-sm tracking-wide transition-colors', navLinkCls)}
              >
                {p.title}
                <span className={cn('absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full', navUnderlineCls)} />
              </Link>
            ))}
          </nav>

          {/* Arama ikonu */}
          <button
            type="button"
            aria-label="Ara"
            onClick={() => setSearchOpen((v) => !v)}
            className={cn('flex h-9 w-9 items-center justify-center rounded-full transition-colors', iconBtnCls)}
          >
            {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
          </button>

          {/* Tema */}
          <ThemeToggle className={cn('hidden h-9 w-9 items-center justify-center rounded-full transition-colors sm:flex', iconBtnCls)} />

          {/* Hesap */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Hesabım"
                    className={cn('relative flex h-9 w-9 items-center justify-center rounded-full outline-none transition-colors', iconBtnCls)}
                  >
                    <UserCircle className="h-[19px] w-[19px] stroke-[1.5]" />
                    {profileHasWarning && (
                      <span title={profileWarningMessage} className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                    )}
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium text-foreground">{user?.profile?.firstName ?? user?.email}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                {!user?.isGuest && profileHasWarning && (
                  <>
                    <DropdownMenuItem
                      render={<Link to="/hesabim/profil" />}
                      className="items-start gap-2 bg-red-50 text-sm text-red-700 focus:bg-red-100 dark:bg-red-900/20 dark:text-red-300"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="leading-snug">{profileWarningMessage} Tamamlamak için tıklayın.</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {!user?.isGuest && (
                  <>
                    <DropdownMenuItem render={<Link to="/hesabim" />} className="text-sm">Hesap Özeti</DropdownMenuItem>
                    <DropdownMenuItem render={<Link to="/hesabim/siparisler" />} className="text-sm">Siparişlerim</DropdownMenuItem>
                    <DropdownMenuItem render={<Link to="/iletisim" />} className="text-sm">Soru ve Taleplerim</DropdownMenuItem>
                    <DropdownMenuItem render={<Link to="/hesabim/profil" />} className="text-sm">Kullanıcı Bilgilerim</DropdownMenuItem>
                    <DropdownMenuItem render={<Link to="/hesabim/favoriler" />} className="text-sm">Beğendiklerim</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-sm text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/giris"
              aria-label="Giriş"
              className={cn('flex h-9 w-9 items-center justify-center rounded-full transition-colors', iconBtnCls)}
            >
              <UserCircle className="h-[19px] w-[19px] stroke-[1.5]" />
            </Link>
          )}

          {/* Sepet — sağdan çekmeceyi açar */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Sepetim"
            className={cn('relative flex h-9 w-9 items-center justify-center rounded-full transition-colors', iconBtnCls)}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>
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
              placeholder="Ürün, kategori veya marka ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowPredictions(true)}
              className="h-11 rounded-sm border border-border bg-card pl-11 pr-4 text-sm placeholder:text-muted-foreground focus-visible:border-amber-500/60 focus-visible:ring-1 focus-visible:ring-amber-500/40"
            />
            {showPredictions && searchQuery.trim().length >= 2 && (
              <div className="absolute inset-x-4 top-full z-[100] mt-2 max-h-80 overflow-y-auto rounded-sm border border-border bg-background shadow-xl">
                {loadingPredictions ? (
                  <div className="flex items-center justify-center gap-2 p-4 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin text-amber-600" /> Aranıyor...
                  </div>
                ) : predictions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">Uyumlu ürün bulunamadı.</div>
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
                      Tüm sonuçları gör
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
          <Link to="/ara" className="py-2.5 font-display text-2xl text-foreground">Mağaza</Link>
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
              <Link to="/hesabim" className="py-2 text-sm text-muted-foreground">Hesabım</Link>
              <button onClick={handleLogout} className="py-2 text-left text-sm text-destructive">Çıkış Yap</button>
            </>
          ) : (
            <Link to="/giris" className="py-2 text-sm text-muted-foreground">Giriş Yap</Link>
          )}
          <Link to="/sepet" className="py-2 text-sm text-muted-foreground">Sepetim ({itemCount})</Link>
        </nav>
      </div>
    </header>
  );
}
