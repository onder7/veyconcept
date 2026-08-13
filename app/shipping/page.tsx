'use client';

import { PageShell, PageTitle, InfoSection } from '@/components/page-shell';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export default function ShippingPage() {
  const t = useT();
  return (
    <PageShell>
      <PageTitle
        title={t(dictionary.shippingPage.title)}
        subtitle={t(dictionary.shippingPage.subtitle)}
      />
      <InfoSection title={t(dictionary.shippingPage.s1Title)} body={t(dictionary.shippingPage.s1Body)} />
      <InfoSection title={t(dictionary.shippingPage.s2Title)} body={t(dictionary.shippingPage.s2Body)} />
      <InfoSection title={t(dictionary.shippingPage.s3Title)} body={t(dictionary.shippingPage.s3Body)} />
      <InfoSection title={t(dictionary.shippingPage.s4Title)} body={t(dictionary.shippingPage.s4Body)} />
    </PageShell>
  );
}
