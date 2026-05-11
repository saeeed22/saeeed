import Link from "next/link";
import Image from "next/image";
import { listAllProjects } from "@/lib/projects-repo";
import { Pencil, EyeOff, Eye, Star } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const items = await listAllProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-coral mb-2">Dashboard</p>
          <h1 className="font-display text-4xl tracking-[-0.02em]">Projects</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {items.length} {items.length === 1 ? "project" : "projects"} · drag to reorder (coming next)
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <p className="font-display text-2xl mb-2">No projects yet</p>
          <p className="text-muted-foreground text-sm mb-6">Add your first project to see it on the homepage.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-full bg-coral text-coral-foreground px-5 py-2.5 text-sm hover:bg-coral/90"
          >
            Create first project
          </Link>
        </div>
      ) : (
        <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {items.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="relative h-14 w-20 rounded-md bg-muted overflow-hidden shrink-0">
                {p.thumbnail ? (
                  <Image src={p.thumbnail} alt="" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{p.title}</p>
                  {p.featured && <Star className="h-3.5 w-3.5 text-coral fill-coral" />}
                  {!p.published && (
                    <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">/{p.slug} · {p.year}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/projects/${p.slug}`}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="View"
                  title="View public page"
                >
                  {p.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </Link>
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <DeleteButton id={p.id} title={p.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
