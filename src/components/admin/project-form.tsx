"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and dashes only"),
  blurb: z.string().min(10),
  description: z.string().min(0),
  year: z.number().int().min(2000).max(2100),
  liveUrl: z.string().url().optional().or(z.literal("")),
  repoUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export type ProjectFormInitial = {
  id?: string;
  title: string;
  slug: string;
  blurb: string;
  description: string;
  year: number;
  liveUrl: string | null;
  repoUrl: string | null;
  thumbnail: string;
  gallery: string[];
  stack: string[];
  featured: boolean;
  published: boolean;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function ProjectForm({ initial }: { initial: ProjectFormInitial }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [stack, setStack] = useState<string[]>(initial.stack);
  const [stackInput, setStackInput] = useState("");
  const [gallery, setGallery] = useState<string[]>(initial.gallery);
  const [thumbnail, setThumbnail] = useState(initial.thumbnail);
  const [featured, setFeatured] = useState(initial.featured);
  const [published, setPublished] = useState(initial.published);
  const [uploading, setUploading] = useState<"thumb" | "gallery" | null>(null);
  const isEdit = Boolean(initial.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial.title,
      slug: initial.slug,
      blurb: initial.blurb,
      description: initial.description,
      year: initial.year,
      liveUrl: initial.liveUrl ?? "",
      repoUrl: initial.repoUrl ?? "",
      thumbnail: initial.thumbnail,
      featured: initial.featured,
      published: initial.published,
    },
  });

  const title = watch("title");

  const handleTitleBlur = () => {
    if (!isEdit && title && !watch("slug")) setValue("slug", slugify(title));
  };

  const upload = async (files: FileList, kind: "thumb" | "gallery") => {
    setUploading(kind);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error(await res.text());
        const data = (await res.json()) as { url: string };
        uploaded.push(data.url);
      }
      if (kind === "thumb") {
        setThumbnail(uploaded[0]);
        setValue("thumbnail", uploaded[0]);
      } else {
        setGallery((g) => [...g, ...uploaded]);
      }
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = (values: FormValues) => {
    start(async () => {
      const body = { ...values, stack, gallery, featured, published, thumbnail };
      const url = initial.id ? `/api/admin/projects/${initial.id}` : "/api/admin/projects";
      const method = initial.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        toast.error(await res.text());
        return;
      }
      toast.success(initial.id ? "Saved" : "Created");
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Title</label>
          <Input className="h-11" {...register("title")} onBlur={handleTitleBlur} />
          {errors.title && <p className="text-xs text-coral">{errors.title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Slug</label>
          <Input className="h-11 font-mono text-sm" {...register("slug")} />
          {errors.slug && <p className="text-xs text-coral">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Blurb (one-liner for cards)</label>
        <Input className="h-11" {...register("blurb")} />
        {errors.blurb && <p className="text-xs text-coral">{errors.blurb.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Description (markdown)</label>
        <Textarea className="min-h-32" {...register("description")} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Year</label>
          <Input type="number" className="h-11" {...register("year", { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Live URL</label>
          <Input className="h-11" placeholder="https://" {...register("liveUrl")} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Repo URL</label>
          <Input className="h-11" placeholder="https://github.com/..." {...register("repoUrl")} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Tech stack</label>
        <div className="flex flex-wrap gap-2">
          {stack.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-border bg-background">
              {t}
              <button type="button" onClick={() => setStack((s) => s.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-coral">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && stackInput.trim()) {
                e.preventDefault();
                setStack((s) => [...s, stackInput.trim()]);
                setStackInput("");
              }
            }}
            placeholder="Type and press Enter"
            className="flex-1 min-w-32 bg-transparent text-sm py-1.5 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Thumbnail</label>
        <div className="flex items-start gap-4">
          {thumbnail ? (
            <div className="relative h-32 w-48 rounded-xl overflow-hidden border border-border">
              <Image src={thumbnail} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => { setThumbnail(""); setValue("thumbnail", ""); }}
                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:text-coral"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="h-32 w-48 rounded-xl border border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:border-coral hover:text-coral transition-colors">
              {uploading === "thumb" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload thumbnail
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && upload(e.target.files, "thumb")} />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Gallery</label>
        <div className="flex flex-wrap gap-3">
          {gallery.map((g, i) => (
            <div key={i} className="relative h-24 w-32 rounded-lg overflow-hidden border border-border">
              <Image src={g} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setGallery((arr) => arr.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/80 flex items-center justify-center hover:text-coral"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="h-24 w-32 rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-coral hover:text-coral text-muted-foreground transition-colors">
            {uploading === "gallery" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && upload(e.target.files, "gallery")} />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-coral" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-coral" />
          Published
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-coral text-coral-foreground px-6 py-2.5 text-sm hover:bg-coral/90 disabled:opacity-50"
        >
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {isEdit ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full px-6 py-2.5 text-sm hover:bg-muted text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
