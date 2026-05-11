import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { createProject } from "@/lib/projects-repo";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  blurb: z.string().min(10),
  description: z.string().default(""),
  year: z.number().int().min(2000).max(2100),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string().default(""),
  gallery: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch (e) {
    return new NextResponse(e instanceof Error ? e.message : "Invalid input", { status: 400 });
  }

  try {
    const id = await createProject({
      title: parsed.title,
      slug: parsed.slug,
      blurb: parsed.blurb,
      description: parsed.description,
      year: parsed.year,
      liveUrl: parsed.liveUrl || null,
      repoUrl: parsed.repoUrl || null,
      thumbnail: parsed.thumbnail,
      gallery: parsed.gallery,
      stack: parsed.stack,
      featured: parsed.featured ?? false,
      published: parsed.published ?? true,
      position: 0,
    });
    return NextResponse.json({ id });
  } catch (e) {
    return new NextResponse(e instanceof Error ? e.message : "Create failed", { status: 500 });
  }
}
