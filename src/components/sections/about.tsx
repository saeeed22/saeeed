"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { site } from "@/lib/site";

export function About() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const words = root.current!.querySelectorAll<HTMLElement>(".about-word");
      gsap.from(words, {
        opacity: 0.08,
        stagger: 0.04,
        scrollTrigger: {
          trigger: ".about-text",
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
        },
      });
      gsap.from(".about-photo", {
        scale: 0.92,
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-photo",
          start: "top 85%",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const text =
    "I'm a fresh Software Engineering graduate from Karachi University. I build websites that feel fast, ship WordPress builds that don't break, and design agentic AI systems that actually do useful work. When I'm not coding, I'm in the gym.";

  return (
    <section id="about" ref={root} className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <div className="about-photo relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted/40">
              <Image
                src="/saeed.png"
                alt={`Portrait of ${site.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                className="object-cover object-top scale-110 -translate-y-2"
              />
              <div className="absolute inset-0 grain pointer-events-none" />
              <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
                Available
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-coral mb-2">About</p>
              <p className="font-display text-xl">{site.location}</p>
              <p className="text-muted-foreground text-sm mt-1">Open to remote & on-site</p>
            </div>
          </div>

          <p className="about-text md:col-span-8 lg:col-span-9 font-display text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-[-0.02em] text-pretty">
            {text.split(" ").map((w, i) => (
              <span key={i} className="about-word inline-block mr-[0.25em]">
                {w}
              </span>
            ))}
          </p>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-10">
          {[
            { k: "Years coding", v: "4+" },
            { k: "Projects shipped", v: "20+" },
            { k: "Stacks fluent in", v: "6" },
            { k: "Coffee per day", v: "∞" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-4xl md:text-5xl font-semibold">{s.v}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{s.k}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
