import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Page not found",
};

const LINKS = [
  { href: "/hormone-health", label: "Hormone guides", body: "Articles on blood sugar, cortisol, gut health, and more." },
  { href: "/recipes", label: "Recipes", body: "Simple, nourishing meals that support your hormones." },
  { href: "/coaching", label: "Coaching", body: "Ways we can work together 1:1." },
];

// Lives at the app root (outside the (site) route group) so it catches every
// unmatched URL as well as notFound() calls, and pulls in the site chrome itself.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="band band--sage">
          <div className="band-inner" style={{ paddingBlock: "4rem", textAlign: "center", maxWidth: "40rem" }}>
            <p className="eyebrow">404</p>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", textWrap: "balance" }}>
              We couldn&apos;t find that page
            </h1>
            <p className="sub" style={{ margin: "0 auto 1.75rem", maxWidth: "40ch", color: "var(--color-muted)" }}>
              It may have moved, or the link may be out of date. Here are a few good places to pick
              back up.
            </p>
            <Link href="/" className="button">
              Back to home
            </Link>
          </div>
        </section>

        <section className="wrap section">
          <div className="card-grid">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="card">
                <h3>{l.label}</h3>
                <p>{l.body}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
