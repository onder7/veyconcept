import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

/**
 * "Günce" tarzı koyu editorial bülten bandı — demo.veyconcept.com Journal
 * bölümünün mağaza uyarlaması. Mevcut /newsletter/subscribe API'sine bağlı.
 */
export function HomeJournal() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; message: string }>('/newsletter/subscribe', { email });
      if (res.data.success) {
        setSent(true);
        setEmail('');
        toast.success(res.data.message || 'Bültenimize başarıyla abone oldunuz!');
        window.setTimeout(() => setSent(false), 4000);
      } else {
        toast.error(res.data.message || 'Abonelik sırasında bir hata oluştu.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-4 sm:px-6 py-20 md:grid-cols-2 md:px-12 md:py-28">
        <div>
          <p className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-background/60">
            <span className="h-px w-8 bg-amber-500" /> Günce
          </p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            Yeni ürünler, kampanyalar,
            <br />
            <span className="italic text-amber-300">ve size özel fırsatlar.</span>
          </h2>
          <p className="mt-6 max-w-md text-background/70 leading-relaxed">
            Bültenimize abone olun; yeni koleksiyonlardan, indirimlerden ve size özel sürpriz
            fırsatlardan ilk siz haberdar olun.
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <form
            onSubmit={submit}
            className="flex items-center gap-3 border-b border-background/30 pb-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              disabled={submitting}
              className="w-full bg-transparent text-lg text-background placeholder:text-background/40 focus:outline-none"
              aria-label="E-posta adresi"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:text-amber-300 disabled:opacity-60"
            >
              {submitting ? 'Gönderiliyor' : 'Abone Ol'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {sent && (
            <p className="mt-4 text-sm text-amber-300">
              Teşekkürler — aboneliğiniz alındı.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
