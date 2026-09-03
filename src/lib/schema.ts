import { SITE, abs } from "./site";

/**
 * JSON-LD builders. Recipes emit Recipe schema (rich results); coaching offers
 * emit Service schema whose provider is the LocalBusiness. Keep output minimal
 * and truthful: only emit fields we actually have.
 */

const isoDuration = (minutes?: number | null) =>
  minutes && minutes > 0 ? `PT${minutes}M` : undefined;

const clean = <T extends Record<string, unknown>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")) as T;

/** The practice itself, referenced as the provider of every Service. */
export function localBusiness() {
  return clean({
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    areaServed: SITE.areaServed,
    founder: { "@type": "Person", name: SITE.founder },
    sameAs: SITE.sameAs.length ? SITE.sameAs : undefined,
  });
}

export function recipeJsonLd(input: {
  name: string;
  description?: string;
  image?: string | null;
  datePublished?: string | null;
  prepMinutes?: number | null;
  cookMinutes?: number | null;
  servings?: string | null;
  ingredients?: string[];
  steps?: string[];
  url: string;
}) {
  return clean({
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: input.name,
    description: input.description,
    image: input.image ? abs(input.image) : undefined,
    author: { "@type": "Person", name: SITE.founder },
    datePublished: input.datePublished || undefined,
    prepTime: isoDuration(input.prepMinutes),
    cookTime: isoDuration(input.cookMinutes),
    recipeYield: input.servings || undefined,
    recipeIngredient: input.ingredients?.length ? input.ingredients : undefined,
    recipeInstructions: input.steps?.length
      ? input.steps.map((text) => ({ "@type": "HowToStep", text }))
      : undefined,
    mainEntityOfPage: abs(input.url),
  });
}

export function serviceJsonLd(input: {
  name: string;
  description?: string;
  price?: string;
  url: string;
}) {
  const priceValue = input.price?.replace(/[^0-9.]/g, "");
  return clean({
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: "Functional nutrition coaching",
    description: input.description,
    provider: localBusiness(),
    areaServed: SITE.areaServed,
    url: abs(input.url),
    offers: priceValue
      ? clean({ "@type": "Offer", price: priceValue, priceCurrency: "USD" })
      : undefined,
  });
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}
