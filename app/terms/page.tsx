'use client';

import { PageShell, PageTitle, InfoSection } from '@/components/page-shell';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export default function TermsPage() {
  const t = useT();
  return (
    <PageShell>
      <PageTitle
        title={t(dictionary.termsPage.title)}
        subtitle={t(dictionary.termsPage.subtitle)}
      />
      <InfoSection title={t(dictionary.termsPage.s1Title)} body={t(dictionary.termsPage.s1Body)} />
      <InfoSection title={t(dictionary.termsPage.s2Title)} body={t(dictionary.termsPage.s2Body)} />
      <InfoSection title={t(dictionary.termsPage.s3Title)} body={t(dictionary.termsPage.s3Body)} />
      <InfoSection title={t(dictionary.termsPage.s4Title)} body={t(dictionary.termsPage.s4Body)} />
      <InfoSection title={t(dictionary.termsPage.s5Title)} body={t(dictionary.termsPage.s5Body)} />
      <InfoSection title={t(dictionary.termsPage.s6Title)} body={t(dictionary.termsPage.s6Body)} />
    </PageShell>
  );
}
