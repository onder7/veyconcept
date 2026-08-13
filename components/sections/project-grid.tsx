'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MoveUpRight } from 'lucide-react';
import { projects, L } from '@/lib/data';
import { useLocale, useT } from '@/lib/i18n/context';
import { dictionary } from '@/lib/i18n/dictionary';

export function ProjectGrid() {
  const { locale } = useLocale();
  const t = useT();
  const [activeId, setActiveId] = useState(projects[0].id);
  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0];

  return (
    <section id="projects" className="bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* Left: intro + numbered list */}
          <div className="flex flex-col">
            <div>
              <div className="mb-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-background/55">
                <span className="h-px w-10 bg-amber-400" />
                {t(dictionary.projects.eyebrow)}
              </div>
              <h2 className="max-w-md font-display text-5xl leading-[0.95] md:text-7xl">
                {t(dictionary.projects.title)}
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-background/65">
                {t(dictionary.projects.body)}
              </p>
            </div>

            {/* Numbered project list */}
            <div className="mt-12 border-t border-background/20">
              {projects.map((project, index) => {
                const isActive = project.id === activeProject.id;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onMouseEnter={() => setActiveId(project.id)}
                    onFocus={() => setActiveId(project.id)}
                    onClick={() => setActiveId(project.id)}
                    className={`group grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-background/20 py-5 text-left transition-colors md:grid-cols-[56px_1fr_auto] md:gap-6 ${
                      isActive ? 'text-background' : 'text-background/45 hover:text-background/80'
                    }`}
                  >
                    <span className="font-mono text-xs text-amber-400/80">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-xl md:text-2xl">
                        {project.title}
                      </span>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-current/60">
                        {project.location}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 text-xs">
                      <span className="hidden text-current/55 md:inline">{project.year}</span>
                      <ArrowUpRight
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isActive
                            ? 'translate-x-0.5 -translate-y-0.5 text-amber-400'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 hidden items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-background/45 lg:flex">
              <MoveUpRight className="h-4 w-4 text-amber-400" />
              {t(dictionary.projects.selectHint)}
            </div>
          </div>

          {/* Right: large preview image */}
          <div className="min-w-0">
            <Link href={`/projects/${activeProject.id}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-background/10 md:aspect-[16/10]">
                {projects.map((project) => (
                  <img
                    key={project.id}
                    src={project.image}
                    alt={project.title}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                      project.id === activeProject.id
                        ? 'scale-100 opacity-100'
                        : 'scale-105 opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/65">
                      {L(activeProject.typology, locale)} · {activeProject.year}
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-white md:text-5xl">
                      {activeProject.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/65">{activeProject.location}</p>
                  </div>
                  <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black md:flex">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* View project link */}
            <Link
              href={`/projects/${activeProject.id}`}
              className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-background/60 transition-colors hover:text-amber-400"
            >
              {t(dictionary.projects.viewProject)}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
