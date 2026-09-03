import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { MarkdocContent } from "@/lib/content";
import { FunnelCTA } from "@/components/FunnelCTA";
import { MediaCard } from "@/components/MediaCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { PILLARS, pillarByKey } from "@/lib/funnel";

export function generateStaticParams() {
  return PILLARS.map((p) => ({ pillar: p.key }));
}

export const dynamicParams = false;

async function loadPillar(pillarKey: string) {
  const pillar = pillarByKey(pillarKey);
  if (!pillar) return null;

  const [articles, recipes] = await Promise.all([
    reader.collections.articles.all(),
    reader.collections.recipes.all(),
  ]);

  const inPillar = articles.filter((a) => a.entry.pillar === pillarKey);
  const cornerstone = inPillar.find((a) => a.entry.isCornerstone) ?? inPillar[0];
  const otherArticles = inPillar.filter((a) => a.slug !== cornerstone?.slug);
  const relatedRecipes = recipes.filter((r) => r.entry.pillar === pillarKey);

  return { pillar, cornerstone, otherArticles, relatedRecipes };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>;
}): Promise<Metadata> {
  const { pillar: pillarKey } = await params;
  const data = await loadPillar(pillarKey);
  if (!data) return {};
  const cs = data.cornerstone?.entry;
  return buildMetadata({
    title: cs?.metaTitle || `${data.pillar.label}: A Root-Cause Guide`,
    description: cs?.metaDescription || cs?.summary || `Guides on ${data.pillar.linkPhrase}.`,
    path: data.pillar.href,
    image: cs?.heroImage,
  });
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar: pillarKey } = await params;
  const data = await loadPillar(pillarKey);
  if (!data) notFound();

  const { pillar, cornerstone, otherArticles, relatedRecipes } = data;
  const body = cornerstone ? await cornerstone.entry.content() : null;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Hormone Health", url: "/hormone-health" },
          { name: pillar.label, url: pillar.href },
        ])}
      />

      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3.25rem" }}>
          <p className="eyebrow">Hormone Health</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", maxWidth: "20ch" }}>
            {cornerstone?.entry.title || pillar.label}
          </h1>
          {cornerstone?.entry.summary && (
            <p className="sub" style={{ margin: 0 }}>{cornerstone.entry.summary}</p>
          )}
        </div>
      </section>

      {body && (
        <div className="wrap" style={{ paddingTop: "3rem" }}>
          <div className="prose-wrap content">
            <MarkdocContent content={body} />
          </div>
        </div>
      )}

      {!body && relatedRecipes.length === 0 && otherArticles.length === 0 && (
        <div className="wrap section">
          <div className="prose-wrap content">
            <p>
              In-depth guides on {pillar.label.toLowerCase()} are coming soon. In the
              meantime, explore the other hormone-health topics, or book a consult
              and we&apos;ll get straight to what&apos;s driving your symptoms.
            </p>
            <p>
              <Link href="/hormone-health">← All hormone-health topics</Link>
            </p>
          </div>
        </div>
      )}

      {relatedRecipes.length > 0 && (
        <section className="wrap section">
          <div className="section-head">
            <h2>Recipes for this</h2>
          </div>
          <div className="card-grid">
            {relatedRecipes.map(({ slug, entry }) => (
              <MediaCard
                key={slug}
                href={`/recipes/${slug}`}
                image={entry.heroImage}
                title={entry.title}
                description={entry.summary}
              />
            ))}
          </div>
        </section>
      )}

      {otherArticles.length > 0 && (
        <section className="band band--peach">
          <div className="band-inner">
            <div className="section-head">
              <h2>More on {pillar.label.toLowerCase()}</h2>
            </div>
            <div className="card-grid">
              {otherArticles.map(({ slug, entry }) => (
                <MediaCard
                  key={slug}
                  href={`/articles/${slug}`}
                  image={entry.heroImage}
                  title={entry.title}
                  description={entry.summary}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="wrap section">
        <div className="prose-wrap">
          <FunnelCTA ctaKey={cornerstone?.entry.cta} />
        </div>
      </div>
    </>
  );
}
