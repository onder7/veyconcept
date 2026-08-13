'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageShell, PageTitle } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderRow = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  shipping_postal_code: string;
  order_items: {
    id: string;
    product_name: string;
    price: number;
    qty: number;
    image: string | null;
  }[];
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderRow[]) || []);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || loading) {
    return (
      <PageShell>
        <p className="text-muted-foreground">{t(dictionary.common.loading)}</p>
      </PageShell>
    );
  }

  if (orders.length === 0) {
    return (
      <PageShell>
        <PageTitle title={t(dictionary.orders.title)} />
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-display text-2xl">{t(dictionary.orders.empty)}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(dictionary.orders.emptyBody)}
            </p>
          </div>
          <Link href="/#shop">
            <Button className="rounded-full bg-foreground px-8 hover:bg-amber-900">
              {t(dictionary.orders.goShop)}
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const statusLabel = (status: string) => {
    const map: Record<string, { tr: string; en: string }> = {
      pending: dictionary.orders.statuses.pending,
      paid: dictionary.orders.statuses.paid,
      shipped: dictionary.orders.statuses.shipped,
      delivered: dictionary.orders.statuses.delivered,
      cancelled: dictionary.orders.statuses.cancelled,
    };
    return map[status] ? map[status][locale] : status;
  };

  return (
    <PageShell>
      <PageTitle title={t(dictionary.orders.title)} />

      <div className="space-y-4">
        {orders.map((order) => {
          const isOpen = expanded === order.id;
          const date = new Date(order.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-sm border border-border bg-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-display text-lg">
                      {t(dictionary.orders.orderNo)} #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(dictionary.orders.date)}: {date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      statusColors[order.status] || 'bg-secondary text-muted-foreground',
                    )}
                  >
                    {statusLabel(order.status)}
                  </span>
                  <span className="font-display text-lg">
                    ${Number(order.total).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border p-5">
                  <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t(dictionary.orders.items)}
                  </h3>
                  <ul className="space-y-3">
                    {order.order_items.map((item) => (
                      <li key={item.id} className="flex items-center gap-4">
                        <div className="h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-secondary">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.product_name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t(dictionary.cartPage.qty)}: {item.qty} · ${Number(item.price).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          ${(Number(item.price) * item.qty).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
                    <p>{order.shipping_name}</p>
                    <p>{order.shipping_address}</p>
                    <p>
                      {order.shipping_city}, {order.shipping_postal_code}
                    </p>
                    <p>{order.shipping_country}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
