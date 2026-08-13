'use client';

import { I18nProvider } from '@/lib/i18n/context';
import { CartProvider } from '@/lib/cart/context';
import { AuthProvider } from '@/lib/auth/context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
