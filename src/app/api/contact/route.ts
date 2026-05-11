import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  honey: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (parsed.honey) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set; logging only");
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: site.email,
    replyTo: parsed.email,
    subject: `New message from ${parsed.name}`,
    text: `From: ${parsed.name} <${parsed.email}>\n\n${parsed.message}`,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
