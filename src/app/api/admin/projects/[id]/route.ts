import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { deleteProject, updateProject } from "@/lib/projects-repo";

const patchSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  blurb: z.string().min(10).optional(),
  description: z.string().optional(),
  year: z.number().int().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  stack: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  let parsed;
  try {
    parsed = patchSchema.parse(await req.json());
  } catch (e) {
    return new NextResponse(e instanceof Error ? e.message : "Invalid input", { status: 400 });
  }
  const patch = {
    ...parsed,
    liveUrl: parsed.liveUrl === "" ? null : parsed.liveUrl,
    repoUrl: parsed.repoUrl === "" ? null : parsed.repoUrl,
  };
  await updateProject(id, patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
