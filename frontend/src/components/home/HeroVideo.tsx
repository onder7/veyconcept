import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  storeName: string;
  slogan?: string;
}

function stripHtml(value: string): string {
  const temp = document.createElement('div');
  temp.textContent = value;
  return temp.innerHTML.replace(/&[^;]+;/g, (entity) => {
    const entities: { [key: string]: string } = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&apos;': "'",
    };
    return entities[entity] || entity;
  }).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Ana sayfa için bağımsız video hero.
 * Görsel slider'dan ayrı çalışır; video public/hero-background.mp4 üzerinden servis edilir.
 * 
 * Metin hemen gösterilir (videoLoaded'e bağlı değil), video yüklendikten sonra scroll butonası görünür.
 */
export function HeroVideo({ storeName, slogan }: Props) {
  const { t } = useTranslation();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cleanSlogan, setCleanSlogan] = useState('');

  useEffect(() => {
    if (slogan) {
      setCleanSlogan(stripHtml(slogan));
    }
  }, [slogan]);

  return (
    <section
      id="hero-video"
      aria-label={`${storeName} tanıtım videosu`}
      className="relative h-[50svh] min-h-[360px] max-h-[600px] w-full overflow-hidden bg-neutral-950 md:h-[55svh]"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => setVideoLoaded(true)}
        onError={() => setVideoLoaded(true)}
      >
        <source src="/hero-background.mp4" type="video/mp4" />
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />

      {/* Metin hemen gösterilir - videoLoaded'e bağlı değil */}
      <div
        className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-start px-4 pt-20 text-left sm:px-6 sm:pt-28 md:px-12 md:pt-40"
      >
        <div className="max-w-[min(32rem,90vw)] text-white">
          <span className="mb-4 block h-px w-12 bg-amber-400 sm:mb-6" />
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/70">{storeName}</p>
          {cleanSlogan && (
            <h1 className="font-display text-2xl leading-tight sm:text-3xl md:text-4xl">
              {cleanSlogan}
            </h1>
          )}
        </div>
      </div>

      {/* Scroll butonası video yüklendikten sonra görünür */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
        className={`absolute bottom-6 right-6 z-30 hidden flex-col items-center gap-2 text-white/60 transition-all duration-700 hover:text-white md:flex ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{t('hero.scroll')}</span>
        <span className="h-12 w-px bg-white/40" />
      </button>
    </section>
  );
}
