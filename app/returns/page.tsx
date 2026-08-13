'use client';

import { PageShell, PageTitle, InfoSection } from '@/components/page-shell';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export default function ReturnsPage() {
  const t = useT();
  return (
    <PageShell>
      <PageTitle
        title={t(dictionary.returnsPage.title)}
        subtitle={t(dictionary.returnsPage.subtitle)}
      />
      <InfoSection title={t(dictionary.returnsPage.s1Title)} body={t(dictionary.returnsPage.s1Body)} />
      <InfoSection title={t(dictionary.returnsPage.s2Title)} body={t(dictionary.returnsPage.s2Body)} />
      <InfoSection title={t(dictionary.returnsPage.s3Title)} body={t(dictionary.returnsPage.s3Body)} />
      <InfoSection title={t(dictionary.returnsPage.s4Title)} body={t(dictionary.returnsPage.s4Body)} />
    </PageShell>
  );
}
