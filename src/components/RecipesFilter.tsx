"use client";

import { useState } from "react";
import { MediaCard } from "./MediaCard";

export type RecipeCard = {
  slug: string;
  title: string;
  summary?: string;
  heroImage?: string | null;
  meal: string;
  mealLabel: string;
};

export function RecipesFilter({
  recipes,
  meals,
}: {
  recipes: RecipeCard[];
  meals: { key: string; label: string }[];
}) {
  const [active, setActive] = useState<string>("all");

  const visible =
    active === "all" ? recipes : recipes.filter((r) => r.meal === active);

  return (
    <>
      <div className="meal-filter" role="group" aria-label="Filter recipes by meal">
        <button
          type="button"
          className="meal-filter__chip"
          data-active={active === "all" || undefined}
          onClick={() => setActive("all")}
          aria-pressed={active === "all"}
        >
          All <span className="meal-filter__count">{recipes.length}</span>
        </button>
        {meals.map((m) => {
          const count = recipes.filter((r) => r.meal === m.key).length;
          return (
            <button
              key={m.key}
              type="button"
              className="meal-filter__chip"
              data-active={active === m.key || undefined}
              onClick={() => setActive(m.key)}
              aria-pressed={active === m.key}
            >
              {m.label} <span className="meal-filter__count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="card-grid">
        {visible.map((r) => (
          <MediaCard
            key={r.slug}
            href={`/recipes/${r.slug}`}
            image={r.heroImage}
            title={r.title}
            description={r.summary}
            tag={r.mealLabel}
          />
        ))}
      </div>
    </>
  );
}
