'use client';

import { PageShell, PageTitle } from '@/components/page-shell';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import Link from 'next/link';

export default function FaqPage() {
  const t = useT();
  const items = [
    { q: dictionary.faq.items.q1, a: dictionary.faq.items.a1 },
    { q: dictionary.faq.items.q2, a: dictionary.faq.items.a2 },
    { q: dictionary.faq.items.q3, a: dictionary.faq.items.a3 },
    { q: dictionary.faq.items.q4, a: dictionary.faq.items.a4 },
    { q: dictionary.faq.items.q5, a: dictionary.faq.items.a5 },
    { q: dictionary.faq.items.q6, a: dictionary.faq.items.a6 },
  ];

  return (
    <PageShell>
      <PageTitle
        title={t(dictionary.faq.title)}
        subtitle={t(dictionary.faq.subtitle)}
      />

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="font-display text-lg text-foreground hover:no-underline">
              {t(item.q)}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {t(item.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 rounded-sm border border-border bg-secondary/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t(dictionary.faq.subtitle)}{' '}
          <Link
            href="/contact"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {t(dictionary.faq.contactUs)} →
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
