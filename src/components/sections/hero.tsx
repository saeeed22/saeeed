"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero-line", { yPercent: 110, rotate: 6 });
      gsap.set(".hero-fade", { opacity: 0, y: 24 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(".hero-line", {
        yPercent: 0,
        rotate: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.06,
      });
      tl.to(
        ".hero-fade",
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.6",
      );
      gsap.to(".hero-blob", {
        x: "+=40",
        y: "+=30",
        repeat: -1,
        yoyo: true,
        duration: 6,
        ease: "sine.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={root}
      className="relative min-h-screen flex items-center overflow-hidden grain"
    >
      <div className="hero-blob pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-coral/20 blur-[120px]" />
      <div className="hero-blob pointer-events-none absolute -bottom-60 -right-40 h-[36rem] w-[36rem] rounded-full bg-foreground/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 w-full">
        <p className="hero-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
          <Sparkles className="h-3.5 w-3.5 text-coral" />
          Available for new work · {site.location}
        </p>

        <h1 className="font-display font-semibold tracking-[-0.04em] text-[clamp(3rem,11vw,11rem)] leading-[0.92]">
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">Building</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">the <em className="font-serif-italic font-normal text-coral">quiet</em></span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">side of the web.</span>
          </span>
        </h1>

        <div className="mt-10 grid md:grid-cols-2 gap-10 items-end">
          <p className={cn("hero-fade max-w-xl text-lg md:text-xl text-muted-foreground text-pretty")}>
            I&apos;m <span className="text-foreground font-medium">{site.name}</span> — a software engineer
            crafting fast websites, headless WordPress, and agentic AI products.
          </p>
          <div className="hero-fade flex flex-wrap gap-3 md:justify-end">
            <Link
              href="#projects"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-coral text-coral-foreground hover:bg-coral/90 h-12 px-6 text-sm")}
            >
              View my work
            </Link>
            <Link
              href="#contact"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full h-12 px-6 text-sm")}
            >
              Get in touch
            </Link>
          </div>
        </div>

        <div className="hero-fade mt-24 flex items-center gap-3 text-sm text-muted-foreground">
          <ArrowDown className="h-4 w-4 animate-bounce" />
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
