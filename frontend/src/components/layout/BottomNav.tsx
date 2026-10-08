import { Link, useLocation } from 'react-router-dom';
import { UserCircle, Heart, ShoppingBag, Phone, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authApi } from '@/services/authApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useFindUsLinks, type FindUsLink } from '@/hooks/useFindUsLinks';

export function BottomNav() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: findUsData } = useFindUsLinks();

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-2 py-2 z-[60]">
      <div className="flex items-center justify-around h-16">
        {/* Hesabım */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-col items-center gap-1 text-neutral-700 hover:text-primary transition-colors cursor-pointer p-2 flex-1 bg-transparent border-none outline-none">
              <UserCircle className="h-6 w-6 stroke-[1.5]" />
              <span className="text-[9px] font-medium">Hesabım</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-48 mb-2">
              {/* User Info */}
              <div className="px-3 py-2">
                <p className="text-xs font-medium truncate text-black">
                  {user?.profile?.firstName ?? user?.email}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />

              {/* Account Links */}
              <DropdownMenuItem render={<Link to="/hesabim" />} className="text-xs">
                Hesap Özeti
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/hesabim/siparisler" />} className="text-xs">
                Siparişlerim
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/hesabim/profil" />} className="text-xs">
                Profil Bilgilerim
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/hesabim/favoriler" />} className="text-xs">
                Favori Ürünlerim
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive text-xs">
                <LogOut className="h-3 w-3 mr-2" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/giris"
            className="flex flex-col items-center gap-1 text-neutral-700 hover:text-primary transition-colors p-2 flex-1"
          >
            <UserCircle className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[9px] font-medium">Hesabım</span>
          </Link>
        )}

        {/* Favorilerim */}
        <Link
          to="/hesabim/favoriler"
          className={`flex flex-col items-center gap-1 transition-colors p-2 flex-1 ${
            isActive('/hesabim/favoriler') ? 'text-primary' : 'text-neutral-700 hover:text-primary'
          }`}
        >
          <Heart className="h-6 w-6 stroke-[1.5]" />
          <span className="text-[9px] font-medium">Favorilerim</span>
        </Link>

        {/* Sepetim */}
        <Link
          to="/sepet"
          className={`flex flex-col items-center gap-1 transition-colors p-2 flex-1 relative ${
            isActive('/sepet') ? 'text-primary' : 'text-neutral-700 hover:text-primary'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
            {itemCount > 0 && (
              <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium">Sepetim</span>
        </Link>

        {/* İletişim */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center gap-1 text-neutral-700 hover:text-primary transition-colors cursor-pointer p-2 flex-1 bg-transparent border-none outline-none">
            <Phone className="h-6 w-6 stroke-[1.5]" />
            <span className="text-[9px] font-medium">İletişim</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48 mb-2">
            {findUsData && findUsData.links && findUsData.links.length > 0 ? (
              <>
                {findUsData.title_tr && (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-black">{findUsData.title_tr}</p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                {findUsData.links.map((link: FindUsLink) => (
                  <DropdownMenuItem
                    key={link.id}
                    render={
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    className="text-xs"
                  >
                    {link.label_tr}
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <div className="px-3 py-2">
                <p className="text-xs text-neutral-500">İletişim bilgisi bulunamadı</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
