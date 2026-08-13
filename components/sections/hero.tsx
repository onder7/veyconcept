'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { L } from '@/lib/data';

const SLIDE_IMAGES = [
  'https://images.pexels.com/photos/34688219/pexels-photo-34688219.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/6970061/pexels-photo-6970061.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

const SLIDE_DURATION = 6000;

export function Hero() {
  const t = useT();
  const { locale } = useLocale();
  const slides = dictionary.hero.slides;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((next + slides.length) % slides.length);
      setProgress(0);
      startRef.current = null;
    },
    [slides.length],
  );

  useEffect(() => {
    if (isPaused) return;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const pct = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        setIndex((i) => (i + 1) % slides.length);
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
  }, [isPaused, index, slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index]);

  const active = slides[index];

  return (
    <section
      id="top"
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-foreground"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Crossfading images */}
      <div className="absolute inset-0">
        {SLIDE_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={src}
              alt={L(slides[i].title, locale)}
              className={`h-full w-full object-cover ${i === index ? 'scale-105' : 'scale-100'} transition-transform duration-[6000ms] ease-out`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Slide content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
        <div key={index} className="max-w-4xl animate-fade-up">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/70">
            {L(active.eyebrow, locale)}
          </p>
          <h1 className="font-display text-5xl leading-[0.95] text-white sm:text-7xl md:text-8xl lg:text-9xl">
            {L(active.title, locale)}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            {L(active.body, locale)}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-amber-50"
            >
              {t(dictionary.hero.cta2)}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#atelier"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
            >
              {t(dictionary.nav.atelier)}
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-end justify-between gap-6">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="group relative h-0.5 flex-1 overflow-hidden bg-white/25"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-amber-400"
                    style={{ width: i === index ? `${progress * 100}%` : i < index ? '100%' : '0%' }}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-white/60">
              <span className="font-mono text-xs">
                {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all hover:border-white hover:bg-white/10"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all hover:border-white hover:bg-white/10"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 hidden flex-col items-center gap-2 text-white/60 md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em]">{t(dictionary.hero.scroll)}</span>
        <span className="h-12 w-px bg-white/40" />
      </div>
    </section>
  );
}
