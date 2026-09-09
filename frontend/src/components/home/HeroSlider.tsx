import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface HeroSlide {
  img: string;
  link: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

interface Props {
  slides: HeroSlide[];
  storeName: string;

}

const SLIDE_DURATION = 6000;

/**
 * Tam ekran editorial hero slider.
 *
 * - Admin panelinden (Slider sekmesi) eklenen slaytlar {img, link} kullanılır.
 *   Her slayt tam ekran, TIKLANABİLİR bir bağlantıdır; kullanıcı görsele tıklayınca
 *   admin'de tanımlı `link` adresine gider. Promo görselleri kendi metnini taşıdığı
 *   için üzerine sabit başlık/CTA konmaz — yalnızca editorial kontroller (ilerleme
 *   çubuğu, sayaç, ok butonları, KAYDIR) gösterilir.
 * - Admin panelinde slayt yoksa yalnızca slider zemini gösterilir; varsayılan mağaza metni eklenmez.
 */
export function HeroSlider({ slides, storeName }: Props) {
  const { t } = useTranslation();
  const hasSlides = slides.length > 0;
  const count = Math.max(slides.length, 1);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
      setProgress(0);
      startRef.current = null;
    },
    [count],
  );

  useEffect(() => {
    if (isPaused || count < 2) return;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const pct = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        setIndex((i) => (i + 1) % count);
        setProgress(0);
        startRef.current = now;
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPaused, index, count]);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative h-[75svh] min-h-[500px] max-h-[900px] w-full overflow-hidden bg-foreground md:h-[80svh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── Slayt katmanı (tıklanabilir bağlantılar) ─────────────────── */}
      <div className="absolute inset-0 z-0">
        {hasSlides ? (
          slides.map((slide, i) => {
            const active = i === index;
            const cls = `absolute inset-0 block transition-opacity duration-[1200ms] ease-out ${
              active ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`;
            const img = (
              <img
                src={slide.img}
                alt=""
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                  active ? 'scale-105' : 'scale-100'
                }`}
              />
            );
            // Buton metni varsa CTA yönlendirir → görsel düz; yoksa tüm slayt tıklanabilir bağlantı
            return slide.buttonText ? (
              <div key={i} className={cls} aria-hidden={active ? undefined : true}>
                {img}
              </div>
            ) : (
              <Link
                key={i}
                to={slide.link || '#'}
                tabIndex={active ? 0 : -1}
                aria-hidden={active ? undefined : true}
                aria-label={`${storeName} — kampanya ${i + 1}`}
                className={cls}
              >
                {img}
              </Link>
            );
          })
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
        )}
      </div>

      {/* Okunabilirlik için degradeler — tıklamayı engellemez */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-black/5 to-black/70" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* ─── Slayt metni (admin: başlık/alt-başlık/buton) — aktif slayt ── */}
      {hasSlides && (slides[index]?.title || slides[index]?.subtitle || slides[index]?.buttonText) && (
        <div
          key={index}
          className="pointer-events-none relative z-10 mx-0 flex h-full max-w-none flex-col justify-start px-4 pt-6 text-left animate-fade-up sm:px-6 sm:pt-8 md:px-0 md:pt-10"
        >
          <div className="max-w-3xl">
            {slides[index]?.title && (
              <h1 className="font-display text-4xl font-bold leading-[1.02] text-emerald-900 sm:text-7xl md:text-8xl tracking-tight" style={{ fontFamily: 'serif' }}>
                {slides[index].title}
              </h1>
            )}
            {slides[index]?.subtitle && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                {slides[index].subtitle}
              </p>
            )}
            {slides[index]?.buttonText && (
              <div className="pointer-events-auto mt-9 flex justify-start">
                <Link
                  to={slides[index].link || '#'}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-amber-50 sm:px-7"
                >
                  {slides[index].buttonText}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}



      {/* ─── Editorial kontroller (yalnızca birden fazla slayt varsa) ── */}
      {count > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto max-w-[1600px] px-6 pb-8 md:px-12 md:pb-10">
          <div className="pointer-events-auto flex flex-col gap-3">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slayt ${i + 1}`}
                  className="group relative h-0.5 min-h-0 flex-1 overflow-hidden bg-white/25"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-amber-400"
                    style={{ width: i === index ? `${progress * 100}%` : i < index ? '100%' : '0%' }}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span className="font-mono text-xs">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Önceki slayt"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all hover:border-white hover:bg-white/10"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Sonraki slayt"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all hover:border-white hover:bg-white/10"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kaydır ipucu */}
      <button
        type="button"
        onClick={scrollDown}
        className="absolute left-1/2 top-6 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors hover:text-white md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{t('hero.scroll')}</span>
        <span className="h-12 w-px bg-white/40" />
      </button>
    </section>
  );
}
