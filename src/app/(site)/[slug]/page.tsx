import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { MarkdocContent } from "@/lib/content";
import { PillarUpLink } from "@/components/PillarUpLink";
import { FunnelCTA } from "@/components/FunnelCTA";

export async function generateStaticParams() {
  const slugs = await reader.collections.pages.list();
  return slugs.map((slug) => ({ slug }));
}

// Only render real Pages entries; anything else 404s (won't shadow /coaching etc.).
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await reader.collections.pages.read(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.summary,
    path: `/${slug}`,
  });
}

export default async function StandalonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await reader.collections.pages.read(slug);
  if (!page) notFound();

  const body = await page.content();
  const pillarKey = page.pillar === "none" ? null : page.pillar;

  return (
    <article className="wrap prose-wrap" style={{ paddingBlock: "3rem" }}>
      <h1>{page.title}</h1>
      {page.summary && <p className="sub">{page.summary}</p>}
      <PillarUpLink pillarKey={pillarKey} />
      <div className="content" style={{ marginTop: "1.5rem" }}>
        <MarkdocContent content={body} />
      </div>
      <FunnelCTA ctaKey={page.cta} />
    </article>
  );
}
