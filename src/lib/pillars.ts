import { reader } from "./reader";
import { PILLARS } from "./funnel";

/**
 * Pillars that currently have at least one article or recipe, each with a lead
 * image (cornerstone article → first article → first recipe). Empty pillars are
 * filtered out so grids never show a blank card. When Grace publishes content
 * tagged to a pillar in Keystatic, it reappears automatically.
 */
export async function pillarCards() {
  const [articles, recipes] = await Promise.all([
    reader.collections.articles.all(),
    reader.collections.recipes.all(),
  ]);

  return PILLARS.map((pillar) => {
    const inArticles = articles.filter((a) => a.entry.pillar === pillar.key);
    const inRecipes = recipes.filter((r) => r.entry.pillar === pillar.key);
    const lead = inArticles.find((a) => a.entry.isCornerstone) ?? inArticles[0] ?? inRecipes[0];
    return {
      ...pillar,
      image: lead?.entry.heroImage ?? null,
      count: inArticles.length + inRecipes.length,
    };
  }).filter((p) => p.count > 0);
}
