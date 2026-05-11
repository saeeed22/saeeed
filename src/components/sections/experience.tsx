"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/lib/site";

export function Experience() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".exp-line", {
        scaleY: 0,
        transformOrigin: "top",
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 80%", scrub: true },
      });
      gsap.from(".exp-item", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="relative py-32 md:py-40 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-coral mb-3">Path</p>
        <h2 className="font-display text-4xl md:text-6xl tracking-[-0.02em] mb-16">
          The <em className="font-serif-italic font-normal">road</em> so far.
        </h2>

        <div className="relative pl-8 md:pl-12">
          <span className="exp-line absolute left-2 md:left-3 top-2 bottom-2 w-px bg-coral/60" />
          <ul className="space-y-12">
            {experiences.map((e, i) => (
              <li key={i} className="exp-item relative">
                <span className="absolute -left-[26px] md:-left-[34px] top-2 h-3 w-3 rounded-full bg-coral ring-4 ring-background" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{e.period}</p>
                <p className="font-display text-2xl md:text-3xl mt-1">{e.title}</p>
                <p className="text-coral text-sm mt-1">{e.company}</p>
                <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">{e.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
