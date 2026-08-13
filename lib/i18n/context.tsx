'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Locale, defaultLocale } from './dictionary';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'en' ? 'tr' : 'en'));
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale }),
    [locale, toggleLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useLocale must be used within an I18nProvider');
  }
  return ctx;
}

/** Pick a localized string from a { tr, en } record */
export function useT() {
  const { locale } = useLocale();
  return useCallback(
    <T extends { tr: string; en: string }>(entry: T): string => entry[locale],
    [locale],
  );
}
