"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/lib/projects-repo";

export function ProjectsClient({ projects }: { projects: PortfolioProject[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      cards.forEach((card, i) => {
        const scale = 1 - (cards.length - i) * 0.04;
        gsap.to(card, {
          scale,
          opacity: i === cards.length - 1 ? 1 : 0.6,
          scrollTrigger: {
            trigger: card,
            start: "top 80px",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section id="projects" ref={root} className="relative py-32 md:py-40 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.25em] text-coral mb-3">Selected work</p>
        <h2 className="font-display text-4xl md:text-6xl tracking-[-0.02em] max-w-3xl">
          Projects I&apos;ve <em className="font-serif-italic font-normal">shipped</em> recently.
        </h2>
      </div>

      <div className="mx-auto max-w-6xl px-6 space-y-8">
        {projects.map((p, i) => (
          <article
            key={p.id}
            className="project-card sticky rounded-3xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/5"
            style={{ top: `${80 + i * 16}px` }}
          >
            <div className="grid md:grid-cols-2 gap-0 min-h-[28rem]">
              <div className="relative aspect-video md:aspect-auto bg-gradient-to-br from-coral/10 via-transparent to-foreground/5 flex items-center justify-center">
                {p.thumbnail ? (
                  <Image src={p.thumbnail} alt={p.title} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                ) : (
                  <span className="font-display text-[20vw] md:text-[14rem] font-bold text-foreground/10 select-none">
                    0{i + 1}
                  </span>
                )}
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.year}</span>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-coral transition-colors"
                    >
                      Case study <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <h3 className="font-display text-3xl md:text-5xl tracking-[-0.02em] leading-tight mb-4">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-pretty">{p.blurb}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full border border-border bg-background/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
