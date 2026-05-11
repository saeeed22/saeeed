import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects-repo";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs uppercase tracking-[0.25em] text-coral mb-2">Edit</p>
      <h1 className="font-display text-4xl tracking-[-0.02em] mb-10">{project.title}</h1>
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          blurb: project.blurb,
          description: project.description,
          year: project.year,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
          thumbnail: project.thumbnail,
          gallery: project.gallery,
          stack: project.stack,
          featured: project.featured,
          published: project.published,
        }}
      />
    </div>
  );
}
