import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">
            {site.name}<span className="text-coral">.</span>
          </p>
          <p className="text-muted-foreground mt-2 max-w-sm text-pretty">
            {site.tagline}. Based in {site.location}.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={site.socials.github} className="inline-flex items-center gap-2 hover:text-coral transition-colors" target="_blank">
                <GithubIcon className="h-4 w-4" /> GitHub
              </Link>
            </li>
            <li>
              <Link href={site.socials.linkedin} className="inline-flex items-center gap-2 hover:text-coral transition-colors" target="_blank">
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </Link>
            </li>
            <li>
              <Link href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-coral transition-colors">
                <Mail className="h-4 w-4" /> {site.email}
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:text-right">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Built with</p>
          <p className="text-sm">Next.js 16 · GSAP · Sanity · Tailwind v4</p>
        </div>
      </div>

      <div className="overflow-hidden">
        <p className="font-display font-bold text-[18vw] leading-none text-center -mb-[3vw] bg-gradient-to-b from-foreground/10 to-transparent bg-clip-text text-transparent select-none">
          {site.shortName}
        </p>
      </div>

      <div className="border-t border-border/60 py-6 px-6 text-center text-xs text-muted-foreground">
        © {year} {site.name}. Crafted with care in {site.location}.
      </div>
    </footer>
  );
}
