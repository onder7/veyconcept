'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { projects, L } from '@/lib/data';
import { dictionary } from '@/lib/i18n/dictionary';
import { useLocale, useT } from '@/lib/i18n/context';
import { SiteHeader } from '@/components/site-header';
import { Footer } from '@/components/sections/footer';
import { CartDrawer } from '@/components/cart-drawer';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { locale } = useLocale();
  const t = useT();
  const project = projects.find((item) => item.id === params.id);

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <SiteHeader />
      <main className="bg-background">
        <section className="mx-auto max-w-[1600px] px-6 pb-16 pt-28 md:px-12 md:pb-24 md:pt-40">
          <Link
            href="/#shop"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t(dictionary.projectDetail.back)}
          </Link>

          <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-24">
            <div>
              <p className="mb-7 flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="h-px w-10 bg-amber-500" />
                {L(project.typology, locale)} · {project.year}
              </p>
              <h1 className="max-w-3xl font-display text-6xl leading-[0.9] md:text-8xl">
                {project.title}
              </h1>
              <p className="mt-6 text-sm uppercase tracking-[0.22em] text-muted-foreground">
                {project.location}
              </p>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {L(project.description, locale)}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div className="aspect-[16/9] overflow-hidden bg-muted md:aspect-[2/1]">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <section className="mx-auto grid max-w-[1600px] gap-16 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              {t(dictionary.projectDetail.overview)}
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
              {locale === 'tr' ? 'Mekân, ışıkla başlar.' : 'A space begins with light.'}
            </h2>
          </div>
          <div>
            <div className="grid grid-cols-2 border-t border-border">
              <DetailItem label={t(dictionary.projectDetail.client)} value={project.client} />
              <DetailItem label={t(dictionary.projectDetail.area)} value={project.area} />
              <DetailItem label={t(dictionary.projectDetail.scope)} value={L(project.scope, locale)} />
              <DetailItem label={t(dictionary.projectDetail.status)} value={L(project.status, locale)} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-6 pb-24 md:px-12 md:pb-36">
          <div className="mb-8 flex items-center justify-between border-t border-border pt-6">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              {t(dictionary.projectDetail.gallery)}
            </p>
            <span className="font-mono text-xs text-muted-foreground">03 / 03</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {project.gallery.map((image, index) => (
              <div
                key={image}
                className={`overflow-hidden bg-muted ${index === 0 ? 'md:col-span-2 md:aspect-[2/1]' : 'aspect-[4/3]'}`}
              >
                <img
                  src={image}
                  alt={`${project.title} ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-foreground text-background">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-12 md:py-24">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-background/50">
                {t(dictionary.projectDetail.nextProject)}
              </p>
              <h2 className="mt-4 font-display text-5xl md:text-7xl">{nextProject.title}</h2>
            </div>
            <Link
              href={`/projects/${nextProject.id}`}
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-background/70 transition-colors hover:text-amber-400"
            >
              {nextProject.location}
              <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-5 pr-5">
      <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}
