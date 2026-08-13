'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export function PageShell({
  children,
  backHref = '/',
}: {
  children: ReactNode;
  backHref?: string;
}) {
  const t = useT();
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t(dictionary.nav.projects)}
        </Link>
        {children}
      </div>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-12">
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl text-foreground md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function InfoSection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="border-b border-border py-8 last:border-0">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
