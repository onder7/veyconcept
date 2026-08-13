'use client';

import Link from 'next/link';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export function Footer() {
  const t = useT();

  return (
    <footer id="contact" className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-display text-4xl text-foreground md:text-5xl">
              MAISON <span className="italic">Orbe</span>
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t(dictionary.footer.desc)}
            </p>
            <a
              href="mailto:studio@maisonorbe.com"
              className="mt-6 inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-amber-800"
            >
              studio@maisonorbe.com
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {t(dictionary.footer.explore)}
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#shop" className="hover:text-amber-800">{t(dictionary.nav.shop)}</Link></li>
              <li><Link href="/#atelier" className="hover:text-amber-800">{t(dictionary.nav.atelier)}</Link></li>
              <li><Link href="/about" className="hover:text-amber-800">{t(dictionary.footer.about)}</Link></li>
              <li><Link href="/contact" className="hover:text-amber-800">{t(dictionary.footer.contact)}</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {t(dictionary.footer.connect)}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="inline-flex items-center gap-2 hover:text-amber-800">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </li>
              <li><Link href="/faq" className="hover:text-amber-800">{t(dictionary.footer.faq)}</Link></li>
              <li><Link href="/shipping" className="hover:text-amber-800">{t(dictionary.footer.shipping)}</Link></li>
              <li><Link href="/returns" className="hover:text-amber-800">{t(dictionary.footer.returns)}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Vey Concept. {t(dictionary.footer.rights)}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-foreground">{t(dictionary.footer.privacy)}</Link>
            <Link href="/terms" className="hover:text-foreground">{t(dictionary.footer.terms)}</Link>
            <Link href="/shipping" className="hover:text-foreground">{t(dictionary.footer.shipping)}</Link>
            <Link href="/returns" className="hover:text-foreground">{t(dictionary.footer.returns)}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
