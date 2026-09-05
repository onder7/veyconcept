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
      className="relative h-[72svh] min-h-[500px] max-h-[940px] w-full overflow-hidden bg-neutral-950 md:h-screen"
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
        className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] -translate-y-10 flex-col justify-center px-4 text-center animate-fade-up sm:-translate-y-14 sm:px-6 md:-translate-y-20 md:px-12"
      >
        <div className="mx-auto max-w-3xl">
          <span className="mx-auto mb-6 block h-px w-12 bg-amber-400" />
          <h1 className="font-display text-4xl leading-[1.02] text-white sm:text-7xl md:text-8xl">
            {storeName}
          </h1>
          {cleanSlogan && (
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {cleanSlogan}
            </p>
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
