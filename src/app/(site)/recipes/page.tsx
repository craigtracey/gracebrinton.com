import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { MEALS, mealByKey } from "@/lib/meals";
import { RecipesFilter } from "@/components/RecipesFilter";

export const metadata: Metadata = buildMetadata({
  title: "Hormone-Supporting Recipes",
  description:
    "Simple, blood-sugar-balancing recipes designed to support women's hormones, from protein-forward breakfasts to one-pan weeknight dinners.",
  path: "/recipes",
});

export default async function RecipesPage() {
  const recipes = await reader.collections.recipes.all();

  const cards = recipes.map(({ slug, entry }) => ({
    slug,
    title: entry.title,
    summary: entry.summary,
    heroImage: entry.heroImage,
    meal: entry.meal,
    mealLabel: mealByKey(entry.meal)?.label ?? entry.meal,
  }));

  // Only show chips for meals that actually have recipes, in MEALS order.
  const usedMeals = MEALS.filter((m) => cards.some((c) => c.meal === m.key)).map(
    (m) => ({ key: m.key, label: m.label })
  );

  return (
    <>
      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3rem" }}>
          <p className="eyebrow">Recipes</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", maxWidth: "18ch" }}>
            Hormone-supporting recipes
          </h1>
          <p className="sub" style={{ margin: 0 }}>
            Simple, blood-sugar-balancing breakfasts, dinners, and snacks &amp;
            treats to support your hormones.
          </p>
        </div>
      </section>

      <section className="wrap section">
        <RecipesFilter recipes={cards} meals={usedMeals} />
      </section>
    </>
  );
}
