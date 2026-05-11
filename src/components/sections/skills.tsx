"use client";

import { skills } from "@/lib/site";

const categories = Array.from(new Set(skills.map((s) => s.category)));

export function Skills() {
  return (
    <section id="skills" className="relative py-32 md:py-40 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-coral mb-3">Toolkit</p>
            <h2 className="font-display text-4xl md:text-6xl tracking-[-0.02em]">
              The stack I <em className="font-serif-italic font-normal">live</em> in.
            </h2>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-y border-border/60 py-8 mb-12">
        <div className="marquee flex gap-12 whitespace-nowrap font-display text-5xl md:text-7xl">
          {[...skills, ...skills].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-12">
              <span className="text-foreground/80 hover:text-coral transition-colors">{s.name}</span>
              <span className="text-coral">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-5 gap-8 mt-16">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{cat}</p>
            <ul className="space-y-1.5">
              {skills.filter((s) => s.category === cat).map((s) => (
                <li key={s.name} className="text-sm hover:text-coral transition-colors cursor-default">
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
