import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { MarkdocContent } from "@/lib/content";
import { PillarUpLink } from "@/components/PillarUpLink";
import { FunnelCTA } from "@/components/FunnelCTA";
import { JsonLd } from "@/components/JsonLd";
import { recipeJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export async function generateStaticParams() {
  const slugs = await reader.collections.recipes.list();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await reader.collections.recipes.read(slug);
  if (!recipe) return {};
  return buildMetadata({
    title: recipe.metaTitle || recipe.title,
    description: recipe.metaDescription || recipe.summary,
    path: `/recipes/${slug}`,
    image: recipe.heroImage,
    type: "article",
  });
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await reader.collections.recipes.read(slug);
  if (!recipe) notFound();

  const body = await recipe.content();
  const ingredients = [...recipe.ingredients];
  const steps = [...recipe.steps];
  const hasStructured = ingredients.length > 0 && steps.length > 0;

  return (
    <>
      <JsonLd
        data={[
          recipeJsonLd({
            name: recipe.title,
            description: recipe.summary,
            image: recipe.heroImage,
            datePublished: recipe.publishedDate,
            prepMinutes: recipe.prepMinutes,
            cookMinutes: recipe.cookMinutes,
            servings: recipe.servings,
            ingredients,
            steps,
            url: `/recipes/${slug}`,
          }),
          breadcrumbJsonLd([
            { name: "Recipes", url: "/recipes" },
            { name: recipe.title, url: `/recipes/${slug}` },
          ]),
        ]}
      />

      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3rem" }}>
          <p className="eyebrow">Recipe</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", maxWidth: "22ch" }}>
            {recipe.title}
          </h1>
          {recipe.summary && <p className="sub" style={{ margin: 0 }}>{recipe.summary}</p>}
          {(recipe.prepMinutes || recipe.cookMinutes || recipe.servings) && (
            <div className="meta-chips">
              {recipe.prepMinutes ? <span className="tag">Prep {recipe.prepMinutes} min</span> : null}
              {recipe.cookMinutes ? <span className="tag">Cook {recipe.cookMinutes} min</span> : null}
              {recipe.servings ? <span className="tag">{recipe.servings}</span> : null}
            </div>
          )}
        </div>
      </section>

      <div className="wrap section">
        {recipe.heroImage && (
          <div className="article-hero">
            <Image
              src={recipe.heroImage}
              alt={recipe.title}
              width={1280}
              height={720}
              priority
              sizes="(max-width: 940px) 100vw, 900px"
            />
          </div>
        )}

        <PillarUpLink pillarKey={recipe.pillar} />

        {hasStructured ? (
          <div className="recipe-layout" style={{ marginTop: "2rem" }}>
            <aside className="recipe-ingredients">
              <h2>Ingredients</h2>
              <ul>
                {ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </aside>
            <div className="recipe-method content">
              <MarkdocContent content={body} />
              <h2>Method</h2>
              <ol>
                {steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <FunnelCTA ctaKey={recipe.cta} />
            </div>
          </div>
        ) : (
          <div className="content-layout" style={{ marginTop: "2rem" }}>
            <div className="content-main">
              <div className="content">
                <MarkdocContent content={body} />
              </div>
            </div>
            <aside className="content-aside">
              <FunnelCTA ctaKey={recipe.cta} />
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
