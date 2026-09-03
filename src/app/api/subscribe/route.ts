import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

/**
 * Server-side proxy to Grace's ActiveCampaign hosted form. Posting from the
 * server avoids CORS and keeps the subscriber on our site (no redirect to AC's
 * thank-you page). The client shows an inline success state.
 */
export async function POST(req: Request) {
  try {
    const { email, fullname } = (await req.json()) as { email?: string; fullname?: string };

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }

    const body = new URLSearchParams({
      ...SITE.newsletter.hidden,
      email,
      fullname: fullname ?? "",
    });

    const res = await fetch(SITE.newsletter.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (res.status >= 500) {
      return NextResponse.json({ ok: false, error: "The subscription service is unavailable. Try again shortly." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
