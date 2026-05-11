"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Send, Loader2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2, "Your name, please"),
  email: z.string().email("Valid email, please"),
  message: z.string().min(10, "A bit more detail helps"),
  honey: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export function Contact() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (values.honey) return;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      setDone(true);
      reset();
      toast.success("Message sent. I'll reply soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section id="contact" className="relative py-32 md:py-40 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-coral mb-3">Contact</p>
          <h2 className="font-display text-4xl md:text-6xl tracking-[-0.02em] mb-6">
            Have a project in <em className="font-serif-italic font-normal">mind</em>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-md text-pretty">
            Tell me what you&apos;re building and I&apos;ll get back within a day.
          </p>

          <ul className="mt-10 space-y-3">
            <li>
              <Link href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-coral transition-colors">
                <Mail className="h-4 w-4" /> {site.email}
              </Link>
            </li>
            <li>
              <Link href={site.socials.github} target="_blank" className="inline-flex items-center gap-3 hover:text-coral transition-colors">
                <GithubIcon className="h-4 w-4" /> @{site.github.username}
              </Link>
            </li>
            <li>
              <Link href={site.socials.linkedin} target="_blank" className="inline-flex items-center gap-3 hover:text-coral transition-colors">
                <LinkedinIcon className="h-4 w-4" /> /in/saeeeed
              </Link>
            </li>
          </ul>
        </div>

        <div className="relative rounded-3xl border border-border bg-card p-8 md:p-10">
          {done ? (
            <div className="flex flex-col items-center justify-center min-h-[24rem] text-center">
              <div className="h-14 w-14 rounded-full bg-coral/10 flex items-center justify-center mb-4 animate-pulse">
                <Check className="h-7 w-7 text-coral" />
              </div>
              <p className="font-display text-3xl">Sent.</p>
              <p className="text-muted-foreground mt-2">I&apos;ll be in touch shortly.</p>
              <Button variant="ghost" className="mt-6" onClick={() => setDone(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <input type="text" tabIndex={-1} aria-hidden className="hidden" {...register("honey")} />

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                <Input className="mt-2 h-12 rounded-xl" placeholder="Jane Doe" {...register("name")} />
                {errors.name && <p className="text-xs text-coral mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <Input type="email" className="mt-2 h-12 rounded-xl" placeholder="jane@company.com" {...register("email")} />
                {errors.email && <p className="text-xs text-coral mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea
                  className="mt-2 min-h-32 rounded-xl"
                  placeholder="Tell me about your project, timeline, and budget."
                  {...register("message")}
                />
                {errors.message && <p className="text-xs text-coral mt-1">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-coral text-coral-foreground hover:bg-coral/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
