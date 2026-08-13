'use client';

import { useState } from 'react';
import { PageShell, PageTitle } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';
import { MapPin, Mail, Phone, Check } from 'lucide-react';

export default function ContactPage() {
  const t = useT();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    window.setTimeout(() => setSent(false), 4000);
  };

  const studios = [
    { city: t(dictionary.contactPage.paris), address: '12 Rue de Sévigné, 75004', phone: '+33 1 42 78 90 12' },
    { city: t(dictionary.contactPage.milan), address: 'Via Brera 28, 20121', phone: '+39 02 8765 4321' },
    { city: t(dictionary.contactPage.marrakech), address: 'Rue Yves Saint Laurent, 40000', phone: '+212 5 24 33 12 45' },
  ];

  return (
    <PageShell>
      <PageTitle
        title={t(dictionary.contactPage.title)}
        subtitle={t(dictionary.contactPage.subtitle)}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="c-name">{t(dictionary.contactPage.name)}</Label>
              <Input
                id="c-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-email">{t(dictionary.contactPage.email)}</Label>
              <Input
                id="c-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-subject">{t(dictionary.contactPage.subject)}</Label>
              <Input
                id="c-subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-message">{t(dictionary.contactPage.message)}</Label>
              <Textarea
                id="c-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="rounded-sm"
              />
            </div>
            <Button
              type="submit"
              className="rounded-full bg-foreground px-8 py-6 hover:bg-amber-900"
            >
              {sent ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t(dictionary.contactPage.sent)}
                </>
              ) : (
                t(dictionary.contactPage.send)
              )}
            </Button>
          </form>
        </div>

        {/* Studios */}
        <div>
          <h2 className="mb-6 font-display text-2xl">
            {t(dictionary.contactPage.studios)}
          </h2>
          <div className="space-y-6">
            {studios.map((studio) => (
              <div
                key={studio.city}
                className="rounded-sm border border-border bg-card p-5"
              >
                <h3 className="font-display text-xl">{studio.city}</h3>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {studio.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {studio.phone}
                  </p>
                </div>
              </div>
            ))}
            <div className="rounded-sm border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:studio@maisonorbe.com"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  studio@maisonorbe.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
