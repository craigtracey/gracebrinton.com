/**
 * next/image loader that serves the variants scripts/optimize-images.mjs builds
 * into public/_img/, instead of resizing per request through /_next/image
 * (uncached on Cloudflare, and slow). Next only ever asks for widths listed in
 * src/lib/image-widths.json, which is exactly the set the script generates.
 *
 * In dev the originals are served as-is, so an image just added in Keystatic
 * shows up without re-running the script.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/images/") || src.endsWith(".svg")) return src;
  if (process.env.NODE_ENV === "development") return `${src}?w=${width}`;
  return `/_img/${src.slice("/images/".length).replace(/\.[a-z0-9]+$/i, "")}-${width}.webp`;
}
