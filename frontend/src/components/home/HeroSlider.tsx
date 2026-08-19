import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

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
  /** Mağaza sloganı (HTML olabilir) — slayt yokken overlay başlığı için düz metne indirgenir */
  slogan?: string;
}

const SLIDE_DURATION = 6000;

/** HTML slogandan düz metin çıkar */
function plainText(html?: string): string {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

/**
 * Tam ekran editorial hero slider.
 *
 * - Admin panelinden (Slider sekmesi) eklenen slaytlar {img, link} kullanılır.
 *   Her slayt tam ekran, TIKLANABİLİR bir bağlantıdır; kullanıcı görsele tıklayınca
 *   admin'de tanımlı `link` adresine gider. Promo görselleri kendi metnini taşıdığı
 *   için üzerine sabit başlık/CTA konmaz — yalnızca editorial kontroller (ilerleme
 *   çubuğu, sayaç, ok butonları, KAYDIR) gösterilir.
 * - Slayt yoksa mağaza adı + "Mağazayı Keşfet" CTA'lı editorial fallback gösterilir.
 */
export function HeroSlider({ slides, storeName, slogan }: Props) {
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
      className="relative h-screen min-h-[600px] max-h-[940px] w-full overflow-hidden bg-foreground"
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
          className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 animate-fade-up md:px-12 md:pb-28"
        >
          <div className="max-w-3xl">
            <span className="mb-6 block h-px w-12 bg-amber-400" />
            {slides[index]?.title && (
              <h1 className="font-display text-5xl leading-[0.95] text-white sm:text-7xl md:text-8xl">
                {slides[index].title}
              </h1>
            )}
            {slides[index]?.subtitle && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                {slides[index].subtitle}
              </p>
            )}
            {slides[index]?.buttonText && (
              <div className="pointer-events-auto mt-9">
                <Link
                  to={slides[index].link || '#'}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-amber-50"
                >
                  {slides[index].buttonText}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Slayt yokken: editorial fallback overlay ─────────────────── */}
      {!hasSlides && (
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
          <div className="max-w-4xl animate-fade-up">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/70">{storeName}</p>
            <h1 className="font-display text-5xl leading-[0.95] text-white sm:text-7xl md:text-8xl lg:text-[8rem]">
              {plainText(slogan) || storeName}
            </h1>
            <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/ara"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-amber-50"
              >
                Mağazayı Keşfet
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <button
                type="button"
                onClick={scrollDown}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
              >
                Koleksiyonlar
              </button>
            </div>
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
                  className="group relative h-0.5 flex-1 overflow-hidden bg-white/25"
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
        className="absolute bottom-8 right-8 z-20 hidden flex-col items-center gap-2 text-white/60 transition-colors hover:text-white md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Kaydır</span>
        <span className="h-12 w-px bg-white/40" />
      </button>
    </section>
  );
}
