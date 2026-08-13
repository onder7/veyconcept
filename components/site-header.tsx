'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { useCart } from '@/lib/cart/context';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const t = useT();
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t(dictionary.nav.shop), href: '#shop' },
    { label: t(dictionary.nav.atelier), href: '#atelier' },
    { label: t(dictionary.nav.journal), href: '#journal' },
    { label: t(dictionary.nav.contact), href: '#contact' },
  ];

  // light = over dark hero (not scrolled); dark = over light bg (scrolled)
  const light = !scrolled;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-border/60'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        {/* Left: desktop nav (md+) */}
        <nav className="hidden flex-1 items-center gap-7 md:flex">
          {navLinks.slice(0, 2).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'group relative text-sm tracking-wide transition-colors',
                light ? 'text-white/80 hover:text-white' : 'text-foreground/80 hover:text-foreground',
              )}
            >
              {link.label}
              <span
                className={cn(
                  'absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full',
                  light ? 'bg-white' : 'bg-foreground',
                )}
              />
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex-1 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className={cn('h-6 w-6', light ? 'text-white' : 'text-foreground')} />
          ) : (
            <Menu className={cn('h-6 w-6', light ? 'text-white' : 'text-foreground')} />
          )}
        </button>

        {/* Center: logo */}
        <a
          href="#top"
          className={cn(
            'flex-1 text-center font-display text-2xl tracking-tight transition-colors md:flex-none',
            light ? 'text-white' : 'text-foreground',
          )}
        >
          Vey <span className="italic">Concept</span>
        </a>

        {/* Right: remaining nav + actions */}
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
          {/* Remaining nav links (md+) */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.slice(2).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative text-sm tracking-wide transition-colors',
                  light ? 'text-white/80 hover:text-white' : 'text-foreground/80 hover:text-foreground',
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full',
                    light ? 'bg-white' : 'bg-foreground',
                  )}
                />
              </a>
            ))}
          </nav>

          {/* Account dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setAcctOpen(true)}
            onMouseLeave={() => setAcctOpen(false)}
          >
            <button
              type="button"
              aria-label={t(dictionary.nav.account)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                light ? 'text-white hover:bg-white/15' : 'text-foreground hover:bg-secondary',
              )}
            >
              <User className="h-[18px] w-[18px]" />
            </button>
            {acctOpen && (
              <div className="absolute right-0 top-full pt-2">
                <div className="w-52 rounded-sm border border-border/60 bg-background p-2 shadow-lg">
                  <p className="px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t(dictionary.nav.account)}
                  </p>
                  <Link
                    href="/auth"
                    className="block rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                  >
                    {t(dictionary.nav.login)}
                  </Link>
                  <Link
                    href="/auth"
                    className="block rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                  >
                    {t(dictionary.nav.register)}
                  </Link>
                  <div className="my-1 h-px bg-border/60" />
                  <Link
                    href="/orders"
                    className="block rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                  >
                    {t(dictionary.nav.orders)}
                  </Link>
                  <Link
                    href="/profile"
                    className="block rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                  >
                    {t(dictionary.nav.settings)}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            aria-label={t(dictionary.cart.title)}
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-full transition-colors',
              light ? 'text-white hover:bg-white/15' : 'text-foreground hover:bg-secondary',
            )}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'overflow-hidden border-t transition-all duration-500 md:hidden',
          open ? 'max-h-[480px] border-border/60 bg-background' : 'max-h-0 border-transparent',
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 font-display text-2xl text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="my-2 h-px bg-border/60" />
          <Link href="/auth" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">
            {t(dictionary.nav.login)}
          </Link>
          <Link href="/auth" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">
            {t(dictionary.nav.register)}
          </Link>
          <Link href="/orders" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">
            {t(dictionary.nav.orders)}
          </Link>
          <Link href="/cart" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">
            {t(dictionary.cart.title)}
          </Link>
        </nav>
      </div>
    </header>
  );
}
