'use client';

import { Lightbulb, Layers, Sparkles } from 'lucide-react';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export function Atelier() {
  const t = useT();

  const pillars = [
    {
      icon: Lightbulb,
      title: t(dictionary.atelier.p1Title),
      body: t(dictionary.atelier.p1Body),
    },
    {
      icon: Layers,
      title: t(dictionary.atelier.p2Title),
      body: t(dictionary.atelier.p2Body),
    },
    {
      icon: Sparkles,
      title: t(dictionary.atelier.p3Title),
      body: t(dictionary.atelier.p3Body),
    },
  ];

  return (
    <section id="atelier" className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t(dictionary.atelier.eyebrow)}
          </p>
          <h2 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
            {t(dictionary.atelier.title1)}
            <br />
            <span className="italic">{t(dictionary.atelier.title2)}</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            {t(dictionary.atelier.body)}
          </p>

          <div className="mt-10 flex items-center gap-4 rounded-sm border border-amber-300/40 bg-amber-50/50 p-5">
            <Lightbulb className="h-8 w-8 shrink-0 fill-amber-300 text-amber-600" />
            <p className="text-sm text-amber-900">
              {t(dictionary.atelier.hint)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-px">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group flex gap-6 border-b border-border py-10 transition-colors first:border-t hover:bg-secondary/40"
            >
              <p.icon className="mt-1 h-7 w-7 shrink-0 text-foreground transition-transform duration-500 group-hover:scale-110" />
              <div>
                <h3 className="font-display text-2xl text-foreground">{p.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
