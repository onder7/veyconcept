import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/services/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailCheck } from 'lucide-react';
import { useStoreInfo } from '@/hooks/useStoreInfo';

export function ForgotPassword() {
  const { name: storeName } = useStoreInfo();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch {
      // Güvenlik için backend e-posta var/yok bilgisini sızdırmaz; yine de başarı göster
      setSent(true);
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
            <Link to="/" className="font-display text-3xl tracking-tight text-foreground">
              {storeName}
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {!sent ? (
              <>
                <h1 className="font-display text-4xl mb-3">Şifremi Unuttum</h1>
                <p className="text-sm text-muted-foreground mb-6 sm:mb-8">
                  Hesabınızın e-posta adresini girin; şifre sıfırlama bağlantısını size gönderelim.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-sm text-foreground">
                      E-posta
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="E-posta"
                      className="h-12 px-4 rounded-sm border border-input focus:border-amber-500 w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full text-sm font-medium uppercase tracking-[0.14em] rounded-full bg-foreground text-background hover:bg-amber-900 transition-colors"
                  >
                    {loading ? 'Gönderiliyor...' : 'SIFIRLAMA BAĞLANTISI GÖNDER'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                  <MailCheck className="h-7 w-7 text-amber-700 dark:text-amber-500" />
                </div>
                <h1 className="font-display text-4xl mb-3">E-postanızı kontrol edin</h1>
                <p className="text-sm text-muted-foreground">
                  Eğer <span className="font-semibold text-foreground">{email}</span> adresine kayıtlı bir hesap
                  varsa, şifre sıfırlama bağlantısı gönderildi. Bağlantı 1 saat geçerlidir.
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link to="/giris" className="font-medium text-amber-800 dark:text-amber-500 hover:underline underline-offset-4 text-sm">
                Giriş ekranına dön
              </Link>
            </div>
          </div>

        </div>
      </div>

      <div className="relative hidden lg:flex h-full w-full flex-col justify-end overflow-hidden bg-foreground p-16 text-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black" />
        <div className="relative z-10 max-w-md">
          <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
            <span className="h-px w-8 bg-amber-500" /> {storeName}
          </p>
          <p className="font-display text-4xl leading-tight text-white">
            Hesabınıza <span className="italic text-amber-300">güvenle</span> dönün.
          </p>
        </div>
      </div>
    </main>
  );
}
