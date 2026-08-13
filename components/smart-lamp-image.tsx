'use client';

import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

type SmartLampImageProps = {
  imageOff: string;
  imageOn: string;
  alt: string;
  variant?: 'card' | 'detail';
  className?: string;
};

export function SmartLampImage({
  imageOff,
  imageOn,
  alt,
  variant = 'card',
  className,
}: SmartLampImageProps) {
  const [isLightOn, setIsLightOn] = useState(false);
  const t = useT();
  const isDetail = variant === 'detail';

  const glowSize = isDetail ? 'h-[110%] w-[110%]' : 'h-[90%] w-[85%]';

  return (
    <div className={cn('group relative overflow-hidden bg-secondary', className)}>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/40 blur-3xl transition-opacity duration-700 ease-out',
          glowSize,
          isLightOn ? 'opacity-100 animate-lamp-glow' : 'opacity-0',
        )}
      />

      <img
        src={imageOff}
        alt={`${alt}`}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out',
          isLightOn ? 'opacity-0' : 'opacity-100',
        )}
        loading="lazy"
      />
      <img
        src={imageOn}
        alt={`${alt}`}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out',
          isLightOn ? 'opacity-100' : 'opacity-0',
        )}
        loading="lazy"
      />

      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-radial from-amber-200/25 via-amber-100/5 to-transparent transition-opacity duration-700',
          isLightOn ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 transition-all duration-700',
          isLightOn
            ? 'opacity-100 shadow-[0_0_60px_rgba(253,224,71,0.35)_inset]'
            : 'opacity-0 shadow-none',
        )}
      />

      <button
        type="button"
        onClick={() => setIsLightOn((v) => !v)}
        aria-pressed={isLightOn}
        aria-label={isLightOn ? t(dictionary.lamp.onLabel) : t(dictionary.lamp.offLabel)}
        className={cn(
          'absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border backdrop-blur-md transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70',
          isLightOn
            ? 'border-amber-300/70 bg-amber-50/90 text-amber-900 shadow-[0_0_25px_rgba(253,224,71,0.45)]'
            : 'border-border/80 bg-background/80 text-foreground hover:border-foreground/40',
          isDetail ? 'px-5 py-3 text-sm' : 'px-4 py-2 text-xs',
        )}
      >
        <Lightbulb
          className={cn(
            'h-4 w-4 transition-all duration-300',
            isLightOn && 'fill-amber-300 text-amber-500',
          )}
        />
        <span className="font-medium tracking-wide">
          {isLightOn ? t(dictionary.lamp.on) : t(dictionary.lamp.off)}
        </span>
      </button>
    </div>
  );
}
