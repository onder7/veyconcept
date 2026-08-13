'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export function Journal() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
    window.setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="journal" className="bg-foreground text-background">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2 md:px-12 md:py-32">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-background/60">
            {t(dictionary.journal.eyebrow)}
          </p>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            {t(dictionary.journal.title1)}
            <br />
            <span className="italic">{t(dictionary.journal.title2)}</span>
          </h2>
          <p className="mt-6 max-w-md text-background/70">
            {t(dictionary.journal.body)}
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <form
            onSubmit={submit}
            className="flex items-center gap-3 border-b border-background/30 pb-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(dictionary.journal.placeholder)}
              className="w-full bg-transparent text-lg text-background placeholder:text-background/40 focus:outline-none"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 text-sm uppercase tracking-[0.2em] text-background transition-colors hover:text-amber-300"
            >
              {t(dictionary.journal.subscribe)} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {sent && (
            <p className="mt-4 text-sm text-amber-300">
              {t(dictionary.journal.success)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
