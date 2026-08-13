'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageShell, PageTitle } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/lib/cart/context';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';
import { L } from '@/lib/data';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const t = useT();
  const router = useRouter();
  const { items, subtotal, clearAll } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { locale } = useLocale();

  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    address: '',
    city: '',
    country: '',
    postal: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderNo, setOrderNo] = useState('');

  if (items.length === 0 && status !== 'success') {
    return (
      <PageShell>
        <PageTitle title={t(dictionary.checkout.title)} />
        <p className="text-muted-foreground">{t(dictionary.checkout.empty)}</p>
        <Link
          href="/#shop"
          className="mt-4 inline-block text-sm text-foreground underline-offset-4 hover:underline"
        >
          {t(dictionary.cartPage.goShop)}
        </Link>
      </PageShell>
    );
  }

  if (!authLoading && !user && status !== 'success') {
    return (
      <PageShell>
        <PageTitle title={t(dictionary.checkout.title)} />
        <div className="flex items-center gap-3 rounded-sm border border-amber-300/50 bg-amber-50/50 p-5">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <p className="text-sm text-amber-900">
              {t(dictionary.checkout.mustLogin)}
            </p>
            <Link
              href="/auth"
              className="mt-1 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              {t(dictionary.nav.login)} →
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: subtotal,
          shipping_name: form.name,
          shipping_email: form.email,
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_country: form.country,
          shipping_postal_code: form.postal,
          notes: form.notes || null,
        })
        .select()
        .single();

      if (orderError || !order) {
        setStatus('error');
        return;
      }

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        qty: item.qty,
        image: item.product.imageOff,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        setStatus('error');
        return;
      }

      setOrderNo(order.id.slice(0, 8).toUpperCase());
      clearAll();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <PageShell>
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <CheckCircle2 className="h-16 w-16 text-amber-600" />
          <div>
            <h1 className="font-display text-4xl text-foreground">
              {t(dictionary.checkout.success)}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {t(dictionary.checkout.successBody)}{' '}
              <span className="font-mono font-medium text-foreground">
                {orderNo}
              </span>
            </p>
          </div>
          <Link href="/orders">
            <Button className="rounded-full bg-foreground px-8 hover:bg-amber-900">
              {t(dictionary.checkout.viewOrders)}
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTitle title={t(dictionary.checkout.title)} />

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Shipping form */}
        <div className="lg:col-span-2">
          <h2 className="mb-6 font-display text-2xl">
            {t(dictionary.checkout.shipping)}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">{t(dictionary.checkout.fullName)}</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-sm"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">{t(dictionary.checkout.email)}</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-sm"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">{t(dictionary.checkout.address)}</Label>
              <Input
                id="address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="rounded-sm"
                autoComplete="street-address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">{t(dictionary.checkout.city)}</Label>
              <Input
                id="city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-sm"
                autoComplete="address-level2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal">{t(dictionary.checkout.postal)}</Label>
              <Input
                id="postal"
                required
                value={form.postal}
                onChange={(e) => setForm({ ...form, postal: e.target.value })}
                className="rounded-sm"
                autoComplete="postal-code"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="country">{t(dictionary.checkout.country)}</Label>
              <Input
                id="country"
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="rounded-sm"
                autoComplete="country-name"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">{t(dictionary.checkout.notes)}</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder={t(dictionary.checkout.notesPlaceholder)}
                className="rounded-sm"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 rounded-sm border border-border bg-card p-6">
            <h2 className="mb-6 font-display text-2xl">
              {t(dictionary.checkout.orderSummary)}
            </h2>
            <ul className="space-y-4 border-b border-border pb-6">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-secondary">
                    <img
                      src={item.product.imageOff}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(dictionary.cartPage.qty)}: {item.qty}
                    </p>
                  </div>
                  <span className="self-center text-sm font-medium">
                    ${(item.product.price * item.qty).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t(dictionary.checkout.subtotal)}
                </span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t(dictionary.checkout.shippingCost)}
                </span>
                <span className="text-amber-700">
                  {t(dictionary.checkout.free)}
                </span>
              </div>
            </div>
            <div className="flex justify-between border-t border-border pt-4">
              <span className="font-display text-lg">
                {t(dictionary.checkout.total)}
              </span>
              <span className="font-display text-xl">
                ${subtotal.toLocaleString()}
              </span>
            </div>

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="mt-6 w-full rounded-full bg-foreground py-6 text-base hover:bg-amber-900"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t(dictionary.checkout.placing)}
                </>
              ) : (
                t(dictionary.checkout.placeOrder)
              )}
            </Button>

            {status === 'error' && (
              <p className="mt-4 text-sm text-destructive">
                {t(dictionary.checkout.errorGeneric)}
              </p>
            )}
          </div>
        </div>
      </form>
    </PageShell>
  );
}
