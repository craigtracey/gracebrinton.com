/**
 * OpenNext adapter config for Cloudflare Workers.
 *
 * `@cloudflare/next-on-pages` (the Cloudflare Pages route) is deprecated upstream
 * in favour of this adapter, which builds a Worker + static assets instead.
 *
 * Incremental cache: `staticAssetsIncrementalCache` serves prerendered pages
 * straight out of the Workers static-asset bundle. It is the right choice here
 * precisely because this site has NO revalidation — every content route is
 * generateStaticParams + `dynamicParams = false`, and nothing sets `revalidate`.
 * That buys us zero extra infrastructure: no R2 bucket, no D1 tag cache, no
 * WORKER_SELF_REFERENCE binding, no revalidation queue.
 *
 * If ISR is ever introduced (any `revalidate`, or `dynamicParams = true`), this
 * override MUST be swapped for the R2 one and the matching bindings added to
 * wrangler.jsonc — see https://opennext.js.org/cloudflare/caching
 */
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
