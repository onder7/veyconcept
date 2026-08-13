'use client';

import { PageShell, PageTitle } from '@/components/page-shell';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { Hammer, Leaf, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const t = useT();

  const values = [
    {
      icon: Hammer,
      title: t(dictionary.aboutPage.v1Title),
      body: t(dictionary.aboutPage.v1Body),
    },
    {
      icon: Leaf,
      title: t(dictionary.aboutPage.v2Title),
      body: t(dictionary.aboutPage.v2Body),
    },
    {
      icon: Lightbulb,
      title: t(dictionary.aboutPage.v3Title),
      body: t(dictionary.aboutPage.v3Body),
    },
  ];

  const team = [
    { name: t(dictionary.aboutPage.l1Name), role: t(dictionary.aboutPage.l1Role) },
    { name: t(dictionary.aboutPage.l2Name), role: t(dictionary.aboutPage.l2Role) },
    { name: t(dictionary.aboutPage.l3Name), role: t(dictionary.aboutPage.l3Role) },
  ];

  return (
    <PageShell>
      <PageTitle
        title={t(dictionary.aboutPage.title)}
        subtitle={t(dictionary.aboutPage.subtitle)}
      />

      <div className="space-y-6 border-b border-border pb-12">
        <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
          {t(dictionary.aboutPage.p1)}
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {t(dictionary.aboutPage.p2)}
        </p>
      </div>

      <div className="py-12">
        <h2 className="mb-8 font-display text-3xl">
          {t(dictionary.aboutPage.valuesTitle)}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="border-t border-border pt-6">
              <v.icon className="mb-4 h-8 w-8 text-foreground" />
              <h3 className="font-display text-xl">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border py-12">
        <h2 className="mb-8 font-display text-3xl">
          {t(dictionary.aboutPage.teamTitle)}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name}>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground font-display text-2xl text-background">
                {member.name[0]}
              </div>
              <h3 className="font-display text-xl">{member.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
