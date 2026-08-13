'use client';

import { PageShell, PageTitle, InfoSection } from '@/components/page-shell';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export default function PrivacyPage() {
  const t = useT();
  return (
    <PageShell>
      <PageTitle
        title={t(dictionary.privacyPage.title)}
        subtitle={t(dictionary.privacyPage.subtitle)}
      />
      <InfoSection title={t(dictionary.privacyPage.s1Title)} body={t(dictionary.privacyPage.s1Body)} />
      <InfoSection title={t(dictionary.privacyPage.s2Title)} body={t(dictionary.privacyPage.s2Body)} />
      <InfoSection title={t(dictionary.privacyPage.s3Title)} body={t(dictionary.privacyPage.s3Body)} />
      <InfoSection title={t(dictionary.privacyPage.s4Title)} body={t(dictionary.privacyPage.s4Body)} />
      <InfoSection title={t(dictionary.privacyPage.s5Title)} body={t(dictionary.privacyPage.s5Body)} />
    </PageShell>
  );
}
