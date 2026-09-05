import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/authApi';
import { cartApi } from '@/services/cartApi';
import { useCartStore } from '@/store/cartStore';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useStoreInfo } from '@/hooks/useStoreInfo';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { ConsentCheckboxes, type ConsentValue } from '@/components/auth/ConsentCheckboxes';

export function Login() {
  const { t } = useTranslation();
  const { name: storeName } = useStoreInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  const { sessionId, setCart, clearSession } = useCartStore();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [guestForm, setGuestForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [guestConsent, setGuestConsent] = useState<ConsentValue>({ emailConsent: true, smsConsent: true, acceptTerms: false });
  const [loading, setLoading] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'guest'>(from === '/odeme' ? 'guest' : 'login');

  async function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestConsent.acceptTerms) {
      toast.error(t('auth.acceptTermsError'));
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.guestLogin({
        ...guestForm,
        marketingConsent: guestConsent.emailConsent,
        smsConsent: guestConsent.smsConsent,
        acceptTerms: guestConsent.acceptTerms,
      });
      const { accessToken, user } = res.data.data;
      setUser(user as User, accessToken);

      // Misafir sepetini aktar
      try {
        const mergeRes = await cartApi.merge(sessionId);
        setCart(mergeRes.data.data);
        clearSession();
      } catch {
        // merge başarısız olsa da devam et
      }

      toast.success(t('auth.guestLoginSuccess'));
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; error?: string } } }).response?.data;
      const msg = data?.message ?? data?.error ?? t('common.operationFailed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleCredential = async (idToken: string) => {
    try {
      const res = await fetch('/api/auth/oauth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user as User, data.data.accessToken);
        try {
          const mergeRes = await cartApi.merge(sessionId);
          setCart(mergeRes.data.data);
          clearSession();
        } catch {
          // merge başarısız olsa da girişe devam et
        }
        toast.success(t('auth.googleSignInSuccess'));
        navigate(from, { replace: true });
      } else {
        toast.error(data.error || t('auth.signInFailed'));
      }
    } catch {
      toast.error(t('auth.googleSignInFailed'));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const { accessToken, user } = res.data.data;
      setUser(user as User, accessToken);

      // Misafir sepetini kullanıcı hesabına aktar
      try {
        const mergeRes = await cartApi.merge(sessionId);
        setCart(mergeRes.data.data);
        clearSession();
      } catch {
        // merge başarısız olsa da girişe devam et
      }

      toast.success(t('auth.signInSuccess'));
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; error?: string } } }).response?.data;
      const msg = data?.message ?? data?.error ?? t('auth.signInFailed');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-background">
      {/* Sol Sütun: Form Alanı */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 py-6 sm:py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between min-h-screen sm:min-h-[85vh]">
          {/* Logo */}
          <div className="mb-8 sm:mb-12">
            <Link to="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-display text-3xl sm:text-4xl font-semibold uppercase tracking-[0.14em] text-[#6b1017]">VEY</span>
              <span className="mt-1 text-[0.35rem] sm:text-[0.4rem] font-semibold uppercase tracking-[0.48em] text-[#6b1017]">CONCEPT</span>
            </Link>
          </div>

          {/* Form İçeriği */}
          <div className="flex-1 flex flex-col justify-center">
            {from === '/odeme' ? (
              <div className="flex border-b border-border mb-6">
                <button
                  className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
                    activeTab === 'login'
                      ? 'border-amber-600 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('login')}
                >
                  {t('auth.memberSignIn')}
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${
                    activeTab === 'guest'
                      ? 'border-amber-600 text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('guest')}
                >
                  {t('auth.guestCheckout')}
                </button>
              </div>
            ) : (
              <h1 className="font-display text-4xl mb-6 sm:mb-8">{t('auth.signIn')}</h1>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-sm text-foreground">
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.email')}
                    className="h-12 px-4 rounded-sm border border-input focus:border-amber-500 w-full"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-bold text-sm text-foreground">
                    {t('auth.password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={viewPassword ? 'text' : 'password'}
                      placeholder={t('auth.password')}
                      className="h-12 pl-4 pr-12 rounded-sm border border-input focus:border-amber-500 w-full"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setViewPassword(!viewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                      aria-label={viewPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    >
                      {viewPassword ? (
                        <EyeOff className="h-5 w-5 stroke-[1.5]" />
                      ) : (
                        <Eye className="h-5 w-5 stroke-[1.5]" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
                  <div className="flex gap-4 text-sm">
                    <Link to="/kayit" className="font-medium text-amber-800 dark:text-amber-500 hover:underline underline-offset-4">
                      {t('auth.doNotHaveAccount')}
                    </Link>
                    <Link to="/sifremi-unuttum" className="font-medium text-amber-800 dark:text-amber-500 hover:underline underline-offset-4">
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-10 text-sm font-medium uppercase tracking-[0.14em] rounded-full bg-foreground text-background hover:bg-amber-900 transition-colors w-full sm:w-auto"
                  >
                    {loading ? t('auth.signingIn') : t('auth.signInButton')}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-input" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">{t('auth.or')}</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <GoogleSignInButton text="signin_with" onCredential={handleGoogleCredential} />
                </div>
              </form>
            ) : (
              <form onSubmit={handleGuestSubmit} className="space-y-6 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest-firstName" className="font-bold text-sm text-foreground">
                      {t('auth.firstName')}
                    </Label>
                    <Input
                      id="guest-firstName"
                      placeholder={t('auth.firstName')}
                      className="h-12 px-4 rounded-sm border border-input focus:border-amber-500 w-full"
                      value={guestForm.firstName}
                      onChange={(e) => setGuestForm((f) => ({ ...f, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-lastName" className="font-bold text-sm text-foreground">
                      {t('auth.lastName')}
                    </Label>
                    <Input
                      id="guest-lastName"
                      placeholder={t('auth.lastName')}
                      className="h-12 px-4 rounded-sm border border-input focus:border-amber-500 w-full"
                      value={guestForm.lastName}
                      onChange={(e) => setGuestForm((f) => ({ ...f, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest-email" className="font-bold text-sm text-foreground">
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="guest-email"
                    type="email"
                    placeholder={t('auth.email')}
                    className="h-12 px-4 rounded-sm border border-input focus:border-amber-500 w-full"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">{t('auth.orderNotificationsInfo')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest-phone" className="font-bold text-sm text-foreground">
                    {t('checkout.phone')} ({t('common.optional')})
                  </Label>
                  <Input
                    id="guest-phone"
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    className="h-12 px-4 rounded-sm border border-input focus:border-amber-500 w-full"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>

                {/* ETK/KVKK onayları */}
                <ConsentCheckboxes value={guestConsent} onChange={(p) => setGuestConsent((c) => ({ ...c, ...p }))} />

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-10 text-sm font-medium uppercase tracking-[0.14em] rounded-full bg-foreground text-background hover:bg-amber-900 transition-colors w-full"
                  >
                    {loading ? t('common.processing') : t('auth.continueToPayment')}
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Sağ Sütun: Editorial marka paneli */}
      <div className="relative hidden lg:flex h-full w-full flex-col justify-end overflow-hidden bg-foreground p-16 text-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black" />
        <div className="relative z-10 max-w-md">
          <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
            <span className="h-px w-8 bg-amber-500" /> {storeName}
          </p>
          <p className="font-display text-4xl leading-tight text-white">
            Zarif yaşam alanları için <span className="italic text-amber-300">seçkin parçalar.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
