import "server-only";
import { db } from "@/db/client";
import { projects as projectsTable, type Project, type NewProject } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { projects as fallbackProjects } from "@/lib/site";
import { randomUUID } from "crypto";

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  stack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  year: number;
  featured: boolean;
  published: boolean;
  position: number;
};

function fromRow(p: Project): PortfolioProject {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    blurb: p.blurb,
    description: p.description,
    thumbnail: p.thumbnail,
    gallery: p.gallery ?? [],
    stack: p.stack ?? [],
    liveUrl: p.liveUrl ?? null,
    repoUrl: p.repoUrl ?? null,
    year: p.year,
    featured: p.featured,
    published: p.published,
    position: p.position,
  };
}

export async function listPublishedProjects(): Promise<PortfolioProject[]> {
  try {
    const rows = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.published, true))
      .orderBy(asc(projectsTable.position), desc(projectsTable.year));

    if (rows.length === 0) {
      return fallbackProjects.map((p, i) => ({
        id: p.slug,
        slug: p.slug,
        title: p.title,
        blurb: p.blurb,
        description: p.description,
        thumbnail: p.thumbnail,
        gallery: [],
        stack: p.stack,
        liveUrl: p.liveUrl ?? null,
        repoUrl: p.repoUrl ?? null,
        year: p.year,
        featured: false,
        published: true,
        position: i,
      }));
    }
    return rows.map(fromRow);
  } catch {
    return [];
  }
}

export async function listAllProjects(): Promise<PortfolioProject[]> {
  const rows = await db.select().from(projectsTable).orderBy(asc(projectsTable.position));
  return rows.map(fromRow);
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  const rows = await db.select().from(projectsTable).where(eq(projectsTable.slug, slug)).limit(1);
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function getProjectById(id: string): Promise<PortfolioProject | null> {
  const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function createProject(input: Omit<NewProject, "id" | "createdAt" | "updatedAt">) {
  const id = randomUUID();
  await db.insert(projectsTable).values({ ...input, id });
  return id;
}

export async function updateProject(
  id: string,
  patch: Partial<Omit<NewProject, "id" | "createdAt">>,
) {
  await db
    .update(projectsTable)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(projectsTable.id, id));
}

export async function deleteProject(id: string) {
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
}

export async function reorderProjects(orderedIds: string[]) {
  await Promise.all(
    orderedIds.map((id, position) =>
      db.update(projectsTable).set({ position }).where(eq(projectsTable.id, id)),
    ),
  );
}
