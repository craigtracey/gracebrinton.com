import type { MetadataRoute } from "next";
import { reader } from "@/lib/reader";
import { abs } from "@/lib/site";
import { PILLARS } from "@/lib/funnel";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [recipes, articles, pages] = await Promise.all([
    reader.collections.recipes.all(),
    reader.collections.articles.all(),
    reader.collections.pages.all(),
  ]);
  const coaching = await reader.singletons.coaching.read();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number) =>
    entries.push({ url: abs(path), lastModified: now, changeFrequency: "weekly", priority });

  // Core pages
  add("/", 1);
  // /articles has no index page; it 308s to /hormone-health, which now lists
  // every article grouped by pillar. Individual /articles/<slug> URLs are added below.
  ["/coaching", "/hormone-health", "/recipes", "/about", "/work-with-me", "/contact"].forEach((p) =>
    add(p, 0.8)
  );

  // Pillars + coaching offers
  PILLARS.forEach((p) => add(p.href, 0.7));
  (coaching?.offers ?? []).forEach((o) => add(`/coaching/${o.slug}`, 0.8));

  // Content
  recipes.forEach(({ slug }) => add(`/recipes/${slug}`, 0.6));
  articles.filter((a) => !a.entry.isCornerstone).forEach(({ slug }) => add(`/articles/${slug}`, 0.6));
  pages.forEach(({ slug }) => add(`/${slug}`, 0.4));

  return entries;
}
