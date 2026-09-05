import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Mail, RefreshCw, HelpCircle, FileText, Info, Lock, ArrowLeft, Loader2, MapPin, Phone } from 'lucide-react';

// Sistem sayfaları için ikon eşlemesi (özel sayfalar genel FileText kullanır)
const SYSTEM_ICONS: Record<string, typeof Mail> = {
  iletisim: Mail,
  iade: RefreshCw,
  sss: HelpCircle,
  sozlesmeler: FileText,
  hakkimizda: Info,
  kvkk: Lock,
  uyelik: FileText,
};

interface MenuPage { slug: string; title: string; isSystem: boolean }

export function SupportPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { isAuthenticated, user } = useAuthStore();

  const getSlugFromPath = (path: string) => {
    if (path.startsWith('/sayfa/')) return params.slug || '';
    if (path.startsWith('/iade')) return 'iade';
    if (path.startsWith('/sss')) return 'sss';
    if (path.startsWith('/sozlesmeler')) return 'sozlesmeler';
    if (path.startsWith('/hakkimizda')) return 'hakkimizda';
    if (path.startsWith('/kvkk')) return 'kvkk';
    if (path.startsWith('/uyelik')) return 'uyelik';
    return 'iletisim';
  };
  const currentSlug = getSlugFromPath(location.pathname);

  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companyInfo, setCompanyInfo] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    mapEmbed: string;
  } | null>(null);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName ?? ''}`.trim() : '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Menüde gösterilecek sayfalar (kenar çubuğu)
  useEffect(() => {
    api.get<{ success: boolean; data: MenuPage[] }>('/pages')
      .then((res) => { if (res.data?.success) setMenuPages(res.data.data); })
      .catch((err) => console.error('Failed to load menu pages:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    setSubmitSuccess(false);
    setSubmitError('');
    api.get<{ success: boolean; data: { slug: string; title: string; content: string } }>(`/pages/${currentSlug}`)
      .then((res) => {
        if (res.data?.success) {
          setContent(res.data.data.content);
          setPageTitle(res.data.data.title);
        } else {
          setError('Sayfa içeriği yüklenemedi.');
        }
      })
      .catch((err) => {
        console.error('Failed to load page content:', err);
        setError('Sayfa bulunamadı veya yüklenirken bir hata oluştu.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentSlug]);

  // Fetch company info for contact page
  useEffect(() => {
    if (currentSlug === 'iletisim') {
      fetch('/api/company-info')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.data) {
            setCompanyInfo(data.data);
          }
        })
        .catch(err => {
          console.error('Failed to load company info:', err);
        });
    }
  }, [currentSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.body) {
      setSubmitError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      const res = await api.post<{ success: boolean }>('/contact', formData);
      if (res.data?.success) {
        setSubmitSuccess(true);
        setFormData(prev => ({ ...prev, subject: '', body: '' })); // clear message inputs, keep name/email
      } else {
        setSubmitError('Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.');
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeLabel = pageTitle || menuPages.find(p => p.slug === currentSlug)?.title || 'Müşteri Hizmetleri';

  return (
    <main className="min-h-[calc(100vh-160px)] bg-background pb-20 pt-10 md:pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <button onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-1 transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span>{t('breadcrumb.home')}</span>
          </button>
          <span>/</span>
          <span className="font-medium text-foreground">{activeLabel}</span>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* Sidebar Nav */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 rounded-sm border border-border bg-card/70 p-4 shadow-sm backdrop-blur-sm">
              <h2 className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {t('support.customerService')}
              </h2>
              <nav className="space-y-1">
                {menuPages.map((item) => {
                  const Icon = item.isSystem ? (SYSTEM_ICONS[item.slug] ?? FileText) : FileText;
                  const isActive = item.slug === currentSlug;
                  const to = item.isSystem ? `/${item.slug}` : `/sayfa/${item.slug}`;
                  return (
                    <Link
                      key={item.slug}
                      to={to}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Page Content Card */}
          <section className="flex-1 min-w-0">
            <div className="rounded-sm border border-border bg-card/80 p-6 shadow-sm md:p-12">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-neutral-400 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-700 dark:text-amber-500" />
                  <p className="text-sm font-medium">Yükleniyor...</p>
                </div>
              ) : error ? (
                <div className="py-16 text-center">
                  <p className="text-red-500 font-medium">{error}</p>
                  <button
                    onClick={() => setContent('')} // triggers reload via effect dependency if changed
                    className="mt-4 px-4 py-2 bg-foreground text-background rounded-sm text-sm font-medium hover:bg-opacity-90 transition"
                  >
                    Tekrar Dene
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Rich HTML Content from Database */}
                  <div
                    className="page-content max-w-3xl font-sans text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />

                  {/* Interactive form only on iletisim page */}
                  {currentSlug === 'iletisim' && (
                    <div className="mt-12 border-t border-border pt-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Form */}
                        <div>
                          <h3 className="mb-5 font-display text-2xl text-foreground md:text-3xl">{t('support.contactUs')}</h3>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            {submitSuccess && (
                              <div className="p-4 rounded-sm bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                                {t('support.messageSentSuccess')}
                              </div>
                            )}
                            {submitError && (
                              <div className="p-4 rounded-sm bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                                {submitError}
                              </div>
                            )}
                            <div>
                              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                                {t('support.fullName')} *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full rounded-sm border border-neutral-200 dark:border-neutral-700 dark:text-neutral-100 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
                                placeholder={t('support.fullNamePlaceholder')}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                                {t('support.email')} *
                              </label>
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full rounded-sm border border-neutral-200 dark:border-neutral-700 dark:text-neutral-100 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
                                placeholder="ornek@mail.com"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                                {t('support.subject')}
                              </label>
                              <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                className="w-full rounded-sm border border-neutral-200 dark:border-neutral-700 dark:text-neutral-100 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40"
                                placeholder={t('support.subjectPlaceholder')}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                                {t('support.message')} *
                              </label>
                              <textarea
                                required
                                rows={4}
                                value={formData.body}
                                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                                className="w-full rounded-sm border border-neutral-200 dark:border-neutral-700 dark:text-neutral-100 bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 resize-none"
                                placeholder={t('support.messagePlaceholder')}
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>{t('support.sending')}</span>
                                </>
                              ) : (
                                <span>{t('support.sendMessage')}</span>
                              )}
                            </button>
                          </form>
                        </div>

                        {/* Company Info Card */}
                        <div>
                          <h3 className="mb-5 font-display text-2xl text-foreground md:text-3xl">{t('support.ourHeadquarters')}</h3>
                          <div className="space-y-4">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                              {companyInfo ? `${t('support.visitText')} ${companyInfo.city} ${t('support.visitText2')}` : `${t('support.visitText')} Ankara ${t('support.visitText2')}`}
                            </p>
                            {companyInfo && (
                              <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-start gap-3">
                                  <MapPin className="h-5 w-5 text-amber-700 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">{t('support.address')}</p>
                                    <p className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">{companyInfo.address}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Mail className="h-5 w-5 text-amber-700 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">{t('support.emailLabel')}</p>
                                    <a href={`mailto:${companyInfo.email}`} className="text-sm text-amber-700 dark:text-amber-500 hover:underline font-medium">
                                      {companyInfo.email}
                                    </a>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <Phone className="h-5 w-5 text-amber-700 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">{t('support.phone')}</p>
                                    <a href={`tel:${companyInfo.phone}`} className="text-sm text-amber-700 dark:text-amber-500 hover:underline font-medium">
                                      {companyInfo.phone}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Map Section */}
                      {companyInfo && (
                        <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                          <h3 className="mb-5 font-display text-2xl text-foreground md:text-3xl">{t('support.location')}</h3>
                          <div className="h-[400px] rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-xs">
                            <iframe
                              src={companyInfo.mapEmbed}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

