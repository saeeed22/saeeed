import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs uppercase tracking-[0.25em] text-coral mb-2">New</p>
      <h1 className="font-display text-4xl tracking-[-0.02em] mb-10">Create project</h1>
      <ProjectForm
        initial={{
          title: "",
          slug: "",
          blurb: "",
          description: "",
          year: new Date().getFullYear(),
          liveUrl: null,
          repoUrl: null,
          thumbnail: "",
          gallery: [],
          stack: [],
          featured: false,
          published: true,
        }}
      />
    </div>
  );
}
