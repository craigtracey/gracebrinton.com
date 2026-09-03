import type { Metadata } from "next";
import { SITE, abs } from "./site";

/**
 * Per-page metadata builder. Every page gets a tuned title + description and a
 * canonical URL. Falls back sensibly so a page is never shipped title-less.
 */
export function buildMetadata(input: {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  /** Skip the "%s · Grace Brinton" template (use for the home page). */
  absoluteTitle?: boolean;
}): Metadata {
  const title = input.title;
  const description = input.description?.trim() || SITE.tagline;
  const url = abs(input.path);

  // Branded 1200×630 OG card generated per page (correct aspect, always present).
  // Relative URL → Next resolves it against metadataBase (the real serving origin),
  // so it works on the tunnel, Vercel previews, and production alike.
  const ogImage = {
    url: `/og?title=${encodeURIComponent(title)}`,
    width: 1200,
    height: 630,
    alt: title,
  };

  return {
    title: input.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: input.type ?? "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
