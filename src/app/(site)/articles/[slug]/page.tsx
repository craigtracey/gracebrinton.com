import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { MarkdocContent } from "@/lib/content";
import { FunnelCTA } from "@/components/FunnelCTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { pillarByKey } from "@/lib/funnel";

export async function generateStaticParams() {
  const articles = await reader.collections.articles.all();
  return articles.filter((a) => !a.entry.isCornerstone).map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await reader.collections.articles.read(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.summary,
    path: `/articles/${slug}`,
    image: article.heroImage,
    type: "article",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await reader.collections.articles.read(slug);
  if (!article) notFound();

  const pillar = pillarByKey(article.pillar);
  const body = await article.content();
  const related = (await reader.collections.articles.all())
    .filter((a) => a.entry.pillar === article.pillar && a.slug !== slug)
    .slice(0, 5);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Hormone Health", url: "/hormone-health" },
          ...(pillar ? [{ name: pillar.label, url: pillar.href }] : []),
          { name: article.title, url: `/articles/${slug}` },
        ])}
      />

      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3rem" }}>
          {pillar && (
            <p className="eyebrow">
              <Link href={pillar.href}>{pillar.label}</Link>
            </p>
          )}
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", maxWidth: "24ch" }}>
            {article.title}
          </h1>
          {article.summary && <p className="sub" style={{ margin: 0 }}>{article.summary}</p>}
        </div>
      </section>

      <div className="wrap section">
        <div className="content-layout">
          <div className="content-main">
            {article.heroImage && (
              <div className="article-hero">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  width={1280}
                  height={720}
                  priority
                  sizes="(max-width: 940px) 100vw, 720px"
                />
              </div>
            )}
            <div className="content">
              <MarkdocContent content={body} />
            </div>
          </div>

          <aside className="content-aside">
            <FunnelCTA ctaKey={article.cta} />
            {related.length > 0 && pillar && (
              <div className="aside-card">
                <h3>More on {pillar.label.toLowerCase()}</h3>
                <ul>
                  {related.map(({ slug: s, entry }) => (
                    <li key={s}>
                      <Link href={`/articles/${s}`}>{entry.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
