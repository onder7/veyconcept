'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageShell, PageTitle } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { useAuth } from '@/lib/auth/context';
import { Package, ShoppingBag, LogOut, Check } from 'lucide-react';

export default function ProfilePage() {
  const t = useT();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
    }
  }, [user]);

  if (loading || !user) {
    return (
      <PageShell>
        <p className="text-muted-foreground">{t(dictionary.common.loading)}</p>
      </PageShell>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      })
    : '';

  return (
    <PageShell>
      <PageTitle title={t(dictionary.profile.title)} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left: account info */}
        <div className="lg:col-span-2">
          <div className="rounded-sm border border-border bg-card p-8">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground font-display text-xl text-background">
                {(user.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-display text-xl text-foreground">
                  {fullName || user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(dictionary.profile.member)} · {t(dictionary.profile.since)}{' '}
                  {memberSince}
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">{t(dictionary.profile.email)}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="rounded-sm bg-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t(dictionary.profile.name)}</Label>
                <Input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-sm"
                />
              </div>
              <Button
                type="submit"
                className="rounded-full bg-foreground px-8 hover:bg-amber-900"
              >
                {saved ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t(dictionary.profile.saved)}
                  </>
                ) : (
                  t(dictionary.profile.save)
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Right: quick links */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t(dictionary.profile.quickLinks)}
          </h2>
          <Link
            href="/orders"
            className="flex items-center justify-between rounded-sm border border-border bg-card p-5 transition-colors hover:border-foreground/30"
          >
            <span className="flex items-center gap-3 text-sm">
              <Package className="h-5 w-5 text-muted-foreground" />
              {t(dictionary.profile.myOrders)}
            </span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-between rounded-sm border border-border bg-card p-5 transition-colors hover:border-foreground/30"
          >
            <span className="flex items-center gap-3 text-sm">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              {t(dictionary.profile.myCart)}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push('/');
            }}
            className="flex w-full items-center gap-3 rounded-sm border border-border bg-card p-5 text-sm transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            {t(dictionary.profile.signOut)}
          </button>
        </div>
      </div>
    </PageShell>
  );
}
