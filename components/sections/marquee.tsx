'use client';

import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export function Marquee() {
  const t = useT();
  const items = [
    t(dictionary.marquee.architecture),
    t(dictionary.marquee.bespoke),
    t(dictionary.marquee.lighting),
    t(dictionary.marquee.collectible),
    t(dictionary.marquee.sculptural),
    t(dictionary.marquee.madetoorder),
  ];
  const row = [...items, ...items];

  return (
    <div className="border-y border-border/60 bg-foreground py-5 text-background overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 font-display text-2xl italic">{item}</span>
            <span className="text-amber-300">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
