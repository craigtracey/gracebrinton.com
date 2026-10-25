"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MediaCard } from "./MediaCard";

export type RecipeCard = {
  slug: string;
  title: string;
  summary?: string;
  heroImage?: string | null;
  meal: string;
  mealLabel: string;
  ingredients: string[];
};

// Lowercase and strip accents so "jalapeno" finds "jalapeño".
const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wrap each occurrence of the search terms in <mark>. */
function highlight(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  // Try the whole phrase first so "sweet potato" marks as one run, not two.
  const phrase = terms.map(escapeRegExp).join("\\s+");
  const alternatives = terms.length > 1 ? [phrase, ...terms.map(escapeRegExp)] : terms.map(escapeRegExp);
  const re = new RegExp(`(${alternatives.join("|")})`, "gi");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

const MAX_INGREDIENTS_SHOWN = 3;

export function RecipesFilter({
  recipes,
  meals,
}: {
  recipes: RecipeCard[];
  meals: { key: string; label: string }[];
}) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Seed the search from ?q= so searches can be linked. Read on mount rather
  // than via useSearchParams, which would opt the static page out of
  // prerendering.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  // Keep ?q= in sync without adding a history entry per keystroke.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [query]);

  const index = useMemo(
    () =>
      recipes.map((r) => ({
        recipe: r,
        text: normalize([r.title, r.summary ?? "", ...r.ingredients].join(" ")),
      })),
    [recipes],
  );

  // Every word typed must appear somewhere, in any order; recipes containing
  // the exact phrase ("sweet potato", not "sweet sausage … potatoes") list first.
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const phrase = terms.join(" ");
  const matching = index
    .filter(({ text }) => terms.every((t) => text.includes(t)))
    .sort((a, b) => Number(b.text.includes(phrase)) - Number(a.text.includes(phrase)))
    .map(({ recipe }) => recipe);
  const visible = active === "all" ? matching : matching.filter((r) => r.meal === active);

  return (
    <>
      <div className="recipe-search">
        <svg className="recipe-search__icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13 13l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes or ingredients, e.g. salmon, sweet potato"
          aria-label="Search recipes"
        />
      </div>

      <div className="meal-filter" role="group" aria-label="Filter recipes by meal">
        <button
          type="button"
          className="meal-filter__chip"
          data-active={active === "all" || undefined}
          onClick={() => setActive("all")}
          aria-pressed={active === "all"}
        >
          All <span className="meal-filter__count">{matching.length}</span>
        </button>
        {meals.map((m) => {
          const count = matching.filter((r) => r.meal === m.key).length;
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

      {visible.length > 0 ? (
        <div className="card-grid">
          {visible.map((r) => {
            const hits = terms.length
              ? r.ingredients.filter((ing) => terms.some((t) => normalize(ing).includes(t)))
              : [];
            return (
              <MediaCard
                key={r.slug}
                href={`/recipes/${r.slug}`}
                image={r.heroImage}
                title={r.title}
                heading={highlight(r.title, terms)}
                description={r.summary && highlight(r.summary, terms)}
                tag={r.mealLabel}
              >
                {hits.length > 0 && (
                  <p className="mcard__matches">
                    <span>Ingredients: </span>
                    {hits.slice(0, MAX_INGREDIENTS_SHOWN).map((ing, i) => (
                      <span key={ing}>
                        {i > 0 && " · "}
                        {highlight(ing, terms)}
                      </span>
                    ))}
                    {hits.length > MAX_INGREDIENTS_SHOWN &&
                      ` +${hits.length - MAX_INGREDIENTS_SHOWN} more`}
                  </p>
                )}
              </MediaCard>
            );
          })}
        </div>
      ) : (
        <div className="recipe-search__empty" role="status">
          <p>
            No recipes match {query.trim() ? <>&ldquo;{query.trim()}&rdquo;</> : "that filter"}
            {active !== "all" && " in this meal"}.
          </p>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => {
              setQuery("");
              setActive("all");
            }}
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );
}
