import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SchedulerEmbed } from "@/components/SchedulerEmbed";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Book a Free Consult",
  description:
    "Book a no-obligation consult with Grace Brinton, FDN-P: functional nutrition for women's hormones.",
  path: "/work-with-me",
});

export default function WorkWithMePage() {
  return (
    <>
      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3.5rem" }}>
          <div className="offer-hero">
            <div>
              <p className="eyebrow">Work With Me</p>
              <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", maxWidth: "18ch" }}>
                Book a free, no-obligation consult
              </h1>
              <p className="sub" style={{ margin: 0, maxWidth: "46ch" }}>
                Tell me what&apos;s going on and we&apos;ll map out what&apos;s likely
                driving it, and whether one of the programs is the right fit.
              </p>
            </div>

            <div className="offer-booking">
              <h3>What to expect</h3>
              <ul className="expect-list">
                <li>A relaxed 20–30 minute video call</li>
                <li>We map what&apos;s likely driving your symptoms</li>
                <li>Clear next steps, zero pressure</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap section">
        <div style={{ maxWidth: "52rem", marginInline: "auto" }}>
          <SchedulerEmbed />
          <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--color-muted)" }}>
            {SITE.founder}, {SITE.credential} · {SITE.tagline}
          </p>
        </div>
      </div>
    </>
  );
}
