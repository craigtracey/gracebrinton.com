import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { pillarByKey } from "@/lib/funnel";
import { MediaCard } from "@/components/MediaCard";

export const metadata: Metadata = buildMetadata({
  title: "Hormone-Supporting Recipes",
  description:
    "Simple, blood-sugar-balancing recipes designed to support women's hormones, from protein-forward breakfasts to one-pan weeknight dinners.",
  path: "/recipes",
});

export default async function RecipesPage() {
  const recipes = await reader.collections.recipes.all();

  return (
    <>
      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3rem" }}>
          <p className="eyebrow">Recipes</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", maxWidth: "18ch" }}>
            Hormone-supporting recipes
          </h1>
          <p className="sub" style={{ margin: 0 }}>
            Every recipe is reframed around the hormone job it does, and links you
            to the deeper guide behind it.
          </p>
        </div>
      </section>

      <section className="wrap section">
        <div className="card-grid">
          {recipes.map(({ slug, entry }) => (
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
      </section>
    </>
  );
}
