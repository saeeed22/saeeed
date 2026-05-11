import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { getProjectBySlug, listPublishedProjects } from "@/lib/projects-repo";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await listPublishedProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) notFound();

  const all = await listPublishedProjects();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];

  return (
    <article className="pt-32 pb-32">
      <div className="mx-auto max-w-4xl px-6">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-coral transition-colors mb-12">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        <p className="text-xs uppercase tracking-[0.25em] text-coral mb-3">{project.year}</p>
        <h1 className="font-display text-5xl md:text-7xl tracking-[-0.03em] leading-[0.95] mb-6">
          {project.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl text-pretty">{project.blurb}</p>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          {project.stack.map((t) => (
            <span key={t} className="text-xs px-3 py-1 rounded-full border border-border bg-background/50">
              {t}
            </span>
          ))}
          {project.liveUrl && (
            <Link href={project.liveUrl} target="_blank" className="ml-auto inline-flex items-center gap-1.5 text-sm hover:text-coral transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </Link>
          )}
          {project.repoUrl && (
            <Link href={project.repoUrl} target="_blank" className="inline-flex items-center gap-1.5 text-sm hover:text-coral transition-colors">
              <GithubIcon className="h-3.5 w-3.5" /> Repo
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-16">
        <div className="aspect-[16/9] relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-coral/10 via-transparent to-foreground/5">
          {project.thumbnail ? (
            <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
          ) : (
            <div className="grain h-full w-full flex items-center justify-center">
              <span className="font-display text-[20vw] md:text-[12rem] font-bold text-foreground/10 select-none">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {project.description && (
        <div className="mx-auto max-w-3xl px-6 mt-20">
          <p className="text-lg text-pretty whitespace-pre-wrap leading-relaxed">{project.description}</p>
        </div>
      )}

      {project.gallery.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 mt-20 grid sm:grid-cols-2 gap-4">
          {project.gallery.map((src, i) => (
            <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-border">
              <Image src={src} alt="" fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
            </div>
          ))}
        </div>
      )}

      {next && next.slug !== project.slug && (
        <div className="mx-auto max-w-4xl px-6 mt-32 border-t border-border pt-10 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Up next</p>
          <Link
            href={`/projects/${next.slug}`}
            className="group inline-flex items-center gap-2 font-display text-2xl md:text-3xl tracking-[-0.02em] hover:text-coral transition-colors"
          >
            {next.title}
            <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      )}
    </article>
  );
}
