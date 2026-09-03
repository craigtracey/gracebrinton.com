import type { NextConfig } from "next";
import path from "node:path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Lets `next dev` resolve Cloudflare bindings (env vars/secrets) via
// getCloudflareContext(), the same way the deployed Worker does — needed by
// /api/contact to read RESEND_API_KEY from .dev.vars during local dev.
initOpenNextCloudflareForDev();

/**
 * 301 redirect map: Squarespace URL → new home.
 *
 * Non-negotiable #1: every old URL must 301 to its closest new equivalent so we
 * don't torch existing rankings. Built from the live sitemap crawl (69 URLs).
 *
 * `permanent: true` emits an HTTP 308 (permanent, method-preserving) which Google
 * treats equivalently to a 301 for ranking-signal consolidation.
 *
 * TODO(grace): once you export Google Search Console (Pages + Queries, 12 mo),
 * refine the /resources → /hormone-health cluster assignments below to point each
 * article at whichever pillar it actually earns impressions for.
 */
const redirects = async () => [
  // ── Recipes: old Squarespace collections collapse into /recipes ──────────
  { source: "/breakfast", destination: "/recipes", permanent: true },
  { source: "/treats", destination: "/recipes", permanent: true },
  { source: "/dinner-1", destination: "/recipes", permanent: true },
  { source: "/breakfast/sausage-frittata", destination: "/recipes/sausage-frittata", permanent: true },
  { source: "/breakfast/bread-pudding", destination: "/recipes/bread-pudding", permanent: true },
  { source: "/breakfast/butternut-fennel-hash", destination: "/recipes/butternut-fennel-hash", permanent: true },
  { source: "/breakfast/healing-breakfast-oatmeal", destination: "/recipes/healing-breakfast-oatmeal", permanent: true },
  { source: "/treats/green-protein-smoothie", destination: "/recipes/green-protein-smoothie", permanent: true },
  { source: "/treats/protein-chai-latte", destination: "/recipes/protein-chai-latte", permanent: true },
  { source: "/treats/protein-oat-bars", destination: "/recipes/protein-oat-bars", permanent: true },
  // Hibiscus lemonade has no migrated recipe of its own yet → recipes hub.
  { source: "/treats/sparkling-hibiscus-lemonade", destination: "/recipes", permanent: true },
  { source: "/dinner-1/turkey-taco-skillet", destination: "/recipes/turkey-taco-skillet", permanent: true },
  { source: "/dinner-1/chicken-shawarma-salad", destination: "/recipes/chicken-shawarma-salad", permanent: true },
  { source: "/dinner-1/lemon-dill-salmon-cakes", destination: "/recipes/lemon-dill-salmon-cakes", permanent: true },
  { source: "/dinner-1/primavera-chicken-meatballs", destination: "/recipes/primavera-chicken-meatballs", permanent: true },
  { source: "/dinner-1/jennifer-aniston-salad", destination: "/recipes/jennifer-aniston-salad", permanent: true },
  { source: "/dinner-1/turkey-ragu-with-sweet-potato", destination: "/recipes/turkey-ragu-with-sweet-potato", permanent: true },

  // ── Hormone content: /resources → migrated /articles/<slug> ──────────────
  // Article URLs are pillar-independent, so these stay valid even if Grace
  // recategorizes an article's pillar in the CMS.
  { source: "/resources", destination: "/hormone-health", permanent: true },
  { source: "/resources/:slug", destination: "/articles/:slug", permanent: true },

  // The articles index merged into the /hormone-health hub (which lists every
  // article grouped by pillar). Article detail URLs (/articles/:slug) stay put.
  { source: "/articles", destination: "/hormone-health", permanent: true },

  // ── Money / service pages → /coaching ────────────────────────────────────
  { source: "/services", destination: "/coaching", permanent: true },
  { source: "/special-offer", destination: "/coaching", permanent: true },
  { source: "/workshop", destination: "/coaching", permanent: true },
  { source: "/hormoneguide", destination: "/hormone-health", permanent: true },

  // ── Structural ───────────────────────────────────────────────────────────
  { source: "/home", destination: "/", permanent: true },
  // Privacy policy removed (it was placeholder content, never real copy) —
  // both the old Squarespace disclaimer URL and the page itself now fall
  // through to the homepage.
  { source: "/website-disclaimer", destination: "/", permanent: true },
  { source: "/privacy-policy", destination: "/", permanent: true },
  // Standalone /contact page removed: the contact form now lives on
  // /work-with-me (booking and messaging are the same funnel).
  { source: "/contact", destination: "/work-with-me", permanent: true },

  // ── Legacy 2020 /blog: duplicates, placeholders, one-offs → /recipes ─────
  // (GSC showed no ranking value worth preserving individually; consolidate.)
  { source: "/blog", destination: "/recipes", permanent: true },
  // The 2020 /blog posts were never written: every one carried Squarespace's
  // "It all begins with an idea…" demo body and a "List item" ingredient list, so
  // there's nothing to migrate. They fall through to the catch-all below.
  // Everything under /blog (junk, dupes, placeholders) → recipes hub.
  { source: "/blog/:slug*", destination: "/recipes", permanent: true },
];

/**
 * The Keystatic admin (/keystatic) and its route handler (/api/keystatic) are
 * DEV-ONLY. Their files are named `*.dev.tsx` / `*.dev.ts`, and that extension is
 * only registered as a route extension when NODE_ENV is not "production" — so
 * `next build` (which sets NODE_ENV=production) never sees them as routes and
 * they are absent from the deployed Cloudflare Pages output entirely: no admin
 * UI, no write API, no @keystatic/next code in the server bundle.
 *
 * The public site is unaffected: it reads content through `createReader` from the
 * committed files in content/ at BUILD time (every content route uses
 * generateStaticParams + dynamicParams=false), so nothing reads the filesystem
 * at request time.
 *
 * Editing flow: run `yarn dev`, edit at http://localhost:6500/keystatic, commit
 * the resulting content/ changes, push → Cloudflare Pages rebuilds.
 */
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  pageExtensions: isDev
    ? ["ts", "tsx", "dev.ts", "dev.tsx"]
    : ["ts", "tsx"],
  // Isolate production builds (NEXT_DIST_DIR=.next-prod yarn build/start) from a
  // running `next dev`, which otherwise rewrites the shared .next and breaks
  // `next start`. Dev keeps using the default .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // A stray lockfile in a parent dir makes Next mis-infer the workspace root;
  // pin it to this project so output file tracing is correct.
  outputFileTracingRoot: path.join(import.meta.dirname),
  redirects,
  // No `images.remotePatterns`: every image is local under public/images (40
  // files; no content or component references a remote host). remotePatterns is
  // an allowlist for the image optimizer, so an unused entry would let anyone
  // pass a URL on that host to /_next/image and have the Worker fetch and
  // re-serve it. Add a host back only when something actually needs it.
};

export default nextConfig;
