'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageShell, PageTitle } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const t = useT();
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'signup' && !name)) {
      setError(t(dictionary.auth.errorEmpty));
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (err) {
          setError(
            err.message.includes('already')
              ? t(dictionary.auth.errorExists)
              : t(dictionary.auth.errorGeneric)
          );
          setLoading(false);
          return;
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) {
          setError(
            err.message.includes('Invalid')
              ? t(dictionary.auth.errorSignin)
              : t(dictionary.auth.errorGeneric)
          );
          setLoading(false);
          return;
        }
      }
      router.push('/profile');
    } catch {
      setError(t(dictionary.auth.errorGeneric));
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageTitle
        eyebrow={mode === 'signin' ? t(dictionary.nav.login) : t(dictionary.nav.register)}
        title={mode === 'signin' ? t(dictionary.auth.signInTitle) : t(dictionary.auth.signUpTitle)}
        subtitle={mode === 'signin' ? t(dictionary.auth.welcome) : t(dictionary.auth.welcomeNew)}
      />

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">{t(dictionary.auth.name)}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-sm"
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t(dictionary.auth.email)}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t(dictionary.auth.password)}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-sm"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <p className="rounded-sm bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-foreground py-6 text-base hover:bg-amber-900"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : mode === 'signin' ? (
              t(dictionary.auth.signInBtn)
            ) : (
              t(dictionary.auth.signUpBtn)
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {mode === 'signin' ? (
            <>
              {t(dictionary.auth.noAccount)}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {t(dictionary.auth.createOne)}
              </button>
            </>
          ) : (
            <>
              {t(dictionary.auth.haveAccount)}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {t(dictionary.auth.signInHere)}
              </button>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
