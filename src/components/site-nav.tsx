"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    type NavId = (typeof navLinks)[number]["id"];
    const ids = navLinks.map((l) => l.id);
    const sections = ids
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((s): s is { id: NavId; el: HTMLElement } => s.el !== null);

    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = sections[0]?.id ?? "home";
      for (const s of sections) {
        if (s.el.offsetTop <= y) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 backdrop-blur-xl bg-background/60 border-b border-border/50"
            : "py-5 bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 relative z-[60]">
            <span className="font-display font-bold text-lg tracking-tight">
              {site.shortName}
              <span className="text-coral">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-card/40 backdrop-blur px-2 py-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={hrefFor(link.id)}
                className={cn(
                  "relative px-3.5 py-1.5 rounded-full text-sm transition-colors",
                  isHome && active === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isHome && active === link.id && (
                  <span className="absolute inset-0 rounded-full bg-secondary" aria-hidden />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 relative z-[60]">
            <ThemeToggle />
            <Link
              href={hrefFor("contact")}
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden md:inline-flex rounded-full bg-coral text-coral-foreground hover:bg-coral/90 h-9 px-4",
              )}
            >
              Let&apos;s talk
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-border/60 bg-card/40 backdrop-blur"
            >
              <span className="relative h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 right-0 h-px bg-foreground transition-all duration-300",
                    open ? "top-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 right-0 h-px bg-foreground transition-all duration-300",
                    open ? "top-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} hrefFor={hrefFor} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  hrefFor,
}: {
  open: boolean;
  onClose: () => void;
  hrefFor: (id: string) => string;
}) {
  return (
    <div
      aria-hidden={!open}
      className={cn(
        "md:hidden fixed inset-0 z-40 transition-[opacity,visibility] duration-500",
        open ? "opacity-100 visible" : "opacity-0 invisible",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-xl transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <nav
        className={cn(
          "absolute inset-0 flex flex-col px-6 pt-28 pb-10 transition-all duration-700 ease-out",
          open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
      >
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
          Menu
        </p>

        <ul className="space-y-1">
          {navLinks.map((link, i) => (
            <li
              key={link.id}
              className={cn(
                "transition-all duration-700 ease-out",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms" }}
            >
              <Link
                href={hrefFor(link.id)}
                onClick={onClose}
                className="group flex items-baseline justify-between gap-4 py-3 border-b border-border/40"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    0{i + 1}
                  </span>
                  <span className="font-display text-4xl tracking-[-0.02em] group-hover:text-coral transition-colors">
                    {link.label}
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-coral group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Elsewhere
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={site.socials.github}
              target="_blank"
              onClick={onClose}
              aria-label="GitHub"
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:border-coral hover:text-coral transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
            <Link
              href={site.socials.linkedin}
              target="_blank"
              onClick={onClose}
              aria-label="LinkedIn"
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-border hover:border-coral hover:text-coral transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </Link>
            <Link
              href={hrefFor("contact")}
              onClick={onClose}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-coral text-coral-foreground px-5 h-10 text-sm hover:bg-coral/90 transition-colors"
            >
              Let&apos;s talk <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
