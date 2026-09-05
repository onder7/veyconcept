import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/services/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useStoreInfo } from '@/hooks/useStoreInfo';

export function ResetPassword() {
  const { t } = useTranslation();
  const { name: storeName } = useStoreInfo();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error(t('auth.invalidResetLink'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error(t('auth.passwordsMismatch'));
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      toast.success(t('auth.passwordUpdated'));
      navigate('/giris', { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ??
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ??
        t('auth.resetLinkExpired');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-background">
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between min-h-[85vh]">
          {/* Logo */}
          <div className="mb-8 sm:mb-12">
            <Link to="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-display text-3xl sm:text-4xl font-semibold uppercase tracking-[0.14em] text-[#6b1017]">VEY</span>
              <span className="mt-1 text-[0.35rem] sm:text-[0.4rem] font-semibold uppercase tracking-[0.48em] text-[#6b1017]">CONCEPT</span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="font-display text-4xl mb-3">{t('auth.resetPassword')}</h1>
            <p className="text-sm text-muted-foreground mb-6 sm:mb-8">
              {t('auth.passwordRequirements')}
            </p>

            {!token ? (
              <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                {t('auth.invalidResetLink')}. {t('auth.requestNewLink')}
                <Link to="/sifremi-unuttum" className="font-bold underline">
                  {t('auth.hereLink')}
                </Link>
                .
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold text-sm text-foreground">
                    {t('auth.newPassword')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={viewPassword ? 'text' : 'password'}
                      placeholder={t('auth.newPassword')}
                      className="h-12 pl-4 pr-12 rounded-sm border border-input focus:border-amber-500 w-full"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setViewPassword(!viewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                      aria-label={viewPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    >
                      {viewPassword ? <EyeOff className="h-5 w-5 stroke-[1.5]" /> : <Eye className="h-5 w-5 stroke-[1.5]" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-bold text-sm text-foreground">
                    {t('auth.confirmPassword')}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={viewPassword ? 'text' : 'password'}
                    placeholder={t('auth.confirmPassword')}
                    className="h-12 px-4 rounded-sm border border-input focus:border-amber-500 w-full"
                    value={form.confirmPassword}
                    onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full text-sm font-medium uppercase tracking-[0.14em] rounded-full bg-foreground text-background hover:bg-amber-900 transition-colors"
                >
                  {loading ? t('common.updating') : t('auth.updatePassword')}
                </Button>
              </form>
            )}

            <div className="mt-8 text-center">
              <Link to="/giris" className="font-medium text-amber-800 dark:text-amber-500 hover:underline underline-offset-4 text-sm">
                {t('auth.backToSignIn')}
              </Link>
            </div>
          </div>

          {/* Footer Linkleri */}
          <footer className="mt-8 sm:mt-16 flex gap-2 sm:gap-4 justify-center text-[10px] sm:text-xs font-bold text-muted-foreground flex-wrap">
            <Link to="/sozlesmeler" className="hover:text-foreground transition-colors">
              Kullanım Koşulları
            </Link>
            <Link to="/kvkk" className="hover:text-foreground transition-colors">
              Gizlilik Politikası
            </Link>
          </footer>
        </div>
      </div>

      <div className="relative hidden lg:flex h-full w-full flex-col justify-end overflow-hidden bg-foreground p-16 text-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black" />
        <div className="relative z-10 max-w-md">
          <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
            <span className="h-px w-8 bg-amber-500" /> {storeName}
          </p>
          <p className="font-display text-4xl leading-tight text-white">
            Yeni bir <span className="italic text-amber-300">başlangıç.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
