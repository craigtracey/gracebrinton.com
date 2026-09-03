import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { SITE } from "@/lib/site";

/**
 * Sends the contact form to Grace via Resend (free tier: 3,000 emails/mo).
 * RESEND_API_KEY and CONTACT_TO_EMAIL are Worker secrets (see .dev.vars for
 * local dev; `wrangler secret put` for production) — never hardcoded, since
 * Resend keys are credentials, unlike the public AC form endpoint in SITE.
 */
export async function POST(req: Request) {
  try {
    const { name, email, message, company } = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
      company?: string; // honeypot — real visitors never fill this in
    };

    if (company) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Please fill in every field." }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const to = env.CONTACT_TO_EMAIL || SITE.email;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE.name} website <onboarding@resend.dev>`,
        to,
        reply_to: email,
        subject: `New contact form message from ${name}`,
        text: `${message}\n\n—\n${name} <${email}>`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "The message couldn't be sent. Try again shortly." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
