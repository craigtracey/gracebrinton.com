import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { MarkdocContent } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { Testimonials } from "@/components/Testimonials";
import { serviceJsonLd, localBusiness } from "@/lib/schema";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const coaching = await reader.singletons.coaching.read();
  return buildMetadata({
    title: coaching?.metaTitle || coaching?.heading || "Work With a Functional Nutritionist for Hormones",
    description:
      coaching?.metaDescription ||
      coaching?.subheading ||
      "1:1 functional nutrition for women's hormones: lab-based programs to get to the root cause.",
    path: "/coaching",
  });
}

export default async function CoachingPage() {
  const coaching = await reader.singletons.coaching.read();
  const intro = coaching ? await coaching.intro() : null;
  const offers = coaching?.offers ?? [];

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", ...localBusiness() },
          ...offers.map((o) =>
            serviceJsonLd({ name: o.name, description: o.summary, price: o.price, url: `/coaching/${o.slug}` })
          ),
        ]}
      />

      <section className="band band--sage">
        <div className="band-inner hero-grid" style={{ paddingBlock: "3.5rem" }}>
          <div>
            <p className="eyebrow">Work With {SITE.name}</p>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)", margin: "0 0 0.9rem", maxWidth: "18ch" }}>
              {coaching?.heading || "Functional nutrition for your hormones"}
            </h1>
            {coaching?.subheading && (
              <p className="sub" style={{ margin: "0 0 1.5rem", maxWidth: "48ch" }}>{coaching.subheading}</p>
            )}
            <Link href="/work-with-me" className="button">
              Book a Free Consult
            </Link>
          </div>
          <Image
            className="hero-image"
            src="/images/grace-chopping.webp"
            alt={SITE.founder}
            width={900}
            height={1100}
            priority
            sizes="(max-width: 820px) 100vw, 40vw"
          />
        </div>
      </section>

      {intro && (
        <section className="wrap section" style={{ paddingBottom: 0 }}>
          <div className="prose-wrap content">
            <MarkdocContent content={intro} />
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="section-head">
          <h2>Programs</h2>
        </div>
        <div className="card-grid">
          {offers.map((offer) => (
            <div key={offer.slug} className="offer-card">
              <h3>{offer.name}</h3>
              <div className="price-row">
                <span className="price">{offer.price}</span>
                {offer.duration && <span className="tag">{offer.duration}</span>}
              </div>
              {offer.availability && <div className="availability">{offer.availability}</div>}
              <p>{offer.summary}</p>
              <Link href={`/coaching/${offer.slug}`} className="button button--ghost">
                Explore this program →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Testimonials heading="Women who've done this work" />

      <section className="band band--ink">
        <div className="band-inner" style={{ textAlign: "center", maxWidth: "42rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>Not sure which is right for you?</h2>
          <p style={{ margin: "0.75rem auto 1.5rem" }}>
            Book a free, no-obligation consult and we&apos;ll map out the best fit together.
          </p>
          <Link href="/work-with-me" className="button button--light">
            Book a Free Consult
          </Link>
        </div>
      </section>
    </>
  );
}
