import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export async function generateStaticParams() {
  const coaching = await reader.singletons.coaching.read();
  return (coaching?.offers ?? []).map((o) => ({ slug: o.slug }));
}

export const dynamicParams = false;

async function load(slug: string) {
  const coaching = await reader.singletons.coaching.read();
  const offers = coaching?.offers ?? [];
  const offer = offers.find((o) => o.slug === slug);
  if (!offer) return null;
  return { offer, others: offers.filter((o) => o.slug !== slug) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return {};
  return buildMetadata({
    title: data.offer.name,
    description: data.offer.metaDescription || data.offer.summary,
    path: `/coaching/${slug}`,
  });
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { offer, others } = data;

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({ name: offer.name, description: offer.summary, price: offer.price, url: `/coaching/${slug}` }),
          breadcrumbJsonLd([
            { name: "Coaching", url: "/coaching" },
            { name: offer.name, url: `/coaching/${slug}` },
          ]),
        ]}
      />

      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3.5rem" }}>
          <div className="offer-hero">
            <div>
              <p className="eyebrow">
                <Link href="/coaching">Coaching</Link>
              </p>
              <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.9rem", maxWidth: "20ch" }}>
                {offer.name}
              </h1>
              {offer.summary && <p className="sub" style={{ margin: 0, maxWidth: "46ch" }}>{offer.summary}</p>}
            </div>

            <div className="offer-booking">
              <div className="price">{offer.price}</div>
              {offer.duration && <div className="duration">{offer.duration}</div>}
              {offer.availability && (
                <div className="availability" style={{ marginTop: "0.75rem" }}>{offer.availability}</div>
              )}
              <Link
                href="/work-with-me"
                className="button"
                style={{ marginTop: "1.25rem", width: "100%", textAlign: "center" }}
              >
                Book a Free Consult
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap section">
        {offer.details && (
          <div className="prose-wrap content">
            {offer.details.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {others.length > 0 && (
          <section style={{ marginTop: "3rem" }}>
            <div className="section-head">
              <h2>Other programs</h2>
              <Link href="/coaching">All coaching →</Link>
            </div>
            <div className="card-grid">
              {others.map((o) => (
                <div key={o.slug} className="offer-card">
                  <h3>{o.name}</h3>
                  <div className="price-row">
                    <span className="price">{o.price}</span>
                    {o.duration && <span className="tag">{o.duration}</span>}
                  </div>
                  <p>{o.summary}</p>
                  <Link href={`/coaching/${o.slug}`} className="button button--ghost">
                    Explore this program →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
