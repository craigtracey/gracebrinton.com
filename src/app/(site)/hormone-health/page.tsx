import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { MediaCard } from "@/components/MediaCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { pillarCards } from "@/lib/pillars";
import { reader } from "@/lib/reader";
import { PILLARS } from "@/lib/funnel";

export const metadata: Metadata = buildMetadata({
  title: "Hormone Health for Women",
  description:
    "Root-cause guides and articles on the hormone shifts women actually feel: blood sugar, cortisol, perimenopause, thyroid & hair loss, and gut health.",
  path: "/hormone-health",
});

export default async function HormoneHealthPage() {
  const [cards, articles] = await Promise.all([
    pillarCards(),
    reader.collections.articles.all(),
  ]);

  return (
    <>
      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3.25rem" }}>
          <p className="eyebrow">Hormone Health</p>
          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", margin: "0 0 0.75rem", maxWidth: "18ch" }}>
            Where do your symptoms point?
          </h1>
          <p className="sub" style={{ margin: 0, maxWidth: "54ch" }}>
            Start with the pillar that matches what you&apos;re feeling. Each guide
            connects the science to what to actually eat and do next.
          </p>
        </div>
      </section>

      <section className="wrap section">
        <div className="card-grid">
          {cards.map((pillar) => (
            <MediaCard
              key={pillar.key}
              href={pillar.href}
              image={pillar.image}
              title={pillar.label}
              description={`Read the guide to ${pillar.linkPhrase}.`}
            />
          ))}
        </div>
      </section>

      {/* Everything Grace has written, grouped under the pillar it feeds. */}
      <div className="wrap section">
        {PILLARS.map((pillar) => {
          const items = articles.filter((a) => a.entry.pillar === pillar.key);
          if (!items.length) return null;
          return (
            <section key={pillar.key} style={{ marginBottom: "3.5rem" }}>
              <div className="section-head">
                <h2>
                  <Link href={pillar.href}>{pillar.label}</Link>
                </h2>
                <Link href={pillar.href}>Guide →</Link>
              </div>
              <div className="card-grid">
                {items.map(({ slug, entry }) => (
                  <MediaCard
                    key={slug}
                    href={entry.isCornerstone ? pillar.href : `/articles/${slug}`}
                    image={entry.heroImage}
                    title={entry.title}
                    description={entry.summary}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="band band--peach">
        <div className="band-inner" style={{ maxWidth: "40rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", margin: "0 0 0.5rem" }}>
            Get hormone notes in your inbox
          </h2>
          <p style={{ color: "var(--color-muted)", margin: "0 0 1.25rem" }}>
            Occasional, practical emails on hormones, recipes, and root-cause health,
            no spam, unsubscribe anytime.
          </p>
          <NewsletterSignup collectName cta="Subscribe" />
        </div>
      </section>
    </>
  );
}
