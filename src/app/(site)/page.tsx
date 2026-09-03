import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { ctaByKey, pillarByKey } from "@/lib/funnel";
import { pillarCards } from "@/lib/pillars";
import { JsonLd } from "@/components/JsonLd";
import { MediaCard } from "@/components/MediaCard";
import { Testimonials } from "@/components/Testimonials";
import { localBusiness } from "@/lib/schema";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const home = await reader.singletons.home.read();
  return buildMetadata({
    title: home?.metaTitle || `${SITE.name} | ${SITE.tagline}`,
    description: home?.metaDescription || home?.subheading || SITE.tagline,
    path: "/",
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const home = await reader.singletons.home.read();
  const cta = ctaByKey(home?.cta);
  const featured = (await reader.collections.recipes.all()).slice(0, 3);
  const pillars = await pillarCards();

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...localBusiness() }} />

      {/* Hero on a soft sage band */}
      <section className="band band--sage">
        <div className="band-inner hero-grid">
          <div>
            <p className="eyebrow">{SITE.tagline}</p>
            <h1 className="hero-title" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", margin: "0 0 1rem", maxWidth: "16ch", fontWeight: 400 }}>
              {home?.heading || "Feel like yourself again."}
            </h1>
            <p className="sub" style={{ fontSize: "1.2rem", maxWidth: "46ch" }}>
              {home?.subheading ||
                "Functional nutrition and lab-based 1:1 support for women navigating hormone, thyroid, and gut changes."}
            </p>
            <div className="price-row">
              <Link href={cta.href} className="button">
                {cta.buttonLabel}
              </Link>
              <Link href="/coaching" className="button button--ghost">
                See how we work together
              </Link>
            </div>
          </div>
          {home?.heroImage && (
            <Image
              className="hero-image"
              src={home.heroImage}
              alt={SITE.founder}
              width={900}
              height={1100}
              priority
              sizes="(max-width: 820px) 100vw, 40vw"
            />
          )}
        </div>
      </section>

      {home?.intro && (
        <section className="wrap prose-wrap content" style={{ paddingBlock: "3.5rem" }}>
          {home.intro.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {/* Pillars */}
      <section className="wrap section">
        <div className="section-head">
          <h2>Start with what&apos;s bothering you</h2>
          <Link href="/hormone-health">All hormone guides →</Link>
        </div>
        <div className="card-grid">
          {pillars.map((pillar) => (
            <Link key={pillar.key} href={pillar.href} className="card">
              <h3>{pillar.label}</h3>
              <p>Read the guide to {pillar.linkPhrase}.</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured recipes with images */}
      {featured.length > 0 && (
        <section className="band band--peach">
          <div className="band-inner">
            <div className="section-head">
              <h2>Hormone-supporting recipes</h2>
              <Link href="/recipes">All recipes →</Link>
            </div>
            <div className="card-grid">
              {featured.map(({ slug, entry }) => (
                <MediaCard
                  key={slug}
                  href={`/recipes/${slug}`}
                  image={entry.heroImage}
                  title={entry.title}
                  description={entry.summary}
                  tag={pillarByKey(entry.pillar)?.label}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Testimonials />

      {/* Closing CTA */}
      <section className="band band--ink">
        <div className="band-inner" style={{ textAlign: "center", maxWidth: "42rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>{cta.heading}</h2>
          <p style={{ margin: "0.75rem auto 1.5rem" }}>{cta.body}</p>
          <Link href={cta.href} className="button button--light">
            {cta.buttonLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
