/**
 * Developer-owned site constants (structure, not content).
 *
 * These drive canonical URLs, default Open Graph/metadata, social links, the
 * LocalBusiness/Person JSON-LD, and the email + booking integrations.
 */

export type SocialPlatform = "instagram" | "tiktok" | "pinterest" | "youtube" | "facebook";

export const SOCIAL: { platform: SocialPlatform; label: string; href: string }[] = [
  { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/gracebrinton" },
  // Add when live; the components render these automatically:
  // { platform: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@gracebrinton" },
  // { platform: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/gracebrinton" },
];

/**
 * Base origin: env-driven so OG images, canonicals, sitemap, and schema resolve
 * on whatever domain is actually serving the site:
 *   1. NEXT_PUBLIC_SITE_URL   → explicit override (set this in production to
 *                               https://www.gracebrinton.com)
 *   2. VERCEL_URL             → the current Vercel deployment (preview/prod)
 *   3. https://gracebrinton.tunn.dev → local dev via the tunnel
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://gracebrinton.tunn.dev")
).replace(/\/+$/, "");

export const SITE = {
  name: "Grace Brinton",
  tagline: "Functional Nutrition for Women's Hormones",
  founder: "Grace Brinton",
  credential: "FDN-P",
  url: SITE_URL,
  locale: "en_US",
  areaServed: "United States",
  email: "hello@gracebrinton.com",

  /**
   * Booking scheduler. Paste Grace's real Acuity/Calendly/Squarespace Scheduling
   * URL here (e.g. https://gracebrinton.as.me/consult or a Calendly link). While
   * empty, /work-with-me shows a graceful email fallback instead of the embed.
   */
  schedulerUrl: "" as string,

  /**
   * Grace's existing ActiveCampaign ("ActiveHosted") form #5, extracted from the
   * live site. The /api/subscribe route posts to this server-side so signups stay
   * on-site (no iframe, no redirect).
   */
  newsletter: {
    action: "https://gracebrinton.activehosted.com/proc.php",
    hidden: {
      u: "5",
      f: "5",
      c: "0",
      m: "0",
      act: "sub",
      v: "2",
      or: "1550edda-5afe-401a-a8e8-a91b1d214cfd",
    } as Record<string, string>,
  },

  // Feeds schema.org sameAs (entity/SEO signal).
  sameAs: SOCIAL.map((s) => s.href),
} as const;

export const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
