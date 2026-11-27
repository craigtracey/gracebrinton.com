/**
 * Pre-resizes every image under public/images into public/_img/ at each width
 * next/image can ask for (src/lib/image-widths.json), so production serves
 * plain static files instead of resizing on every request.
 *
 * Why: on Cloudflare, /_next/image runs the IMAGES binding per request and the
 * result is never cached — the home hero took 0.35–0.8s to first byte every
 * time, versus ~0.08s for the static file. src/lib/imageLoader.ts points
 * next/image at these files instead.
 *
 * Output is gitignored and regenerated on build. Incremental: a variant is only
 * rewritten when its source is newer, so repeat builds are quick.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(import.meta.dirname, "..");
const srcDir = path.join(root, "public/images");
const outDir = path.join(root, "public/_img");
const { deviceSizes, imageSizes } = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/image-widths.json"), "utf8"),
);
const widths = [...imageSizes, ...deviceSizes];

// Email images are linked by absolute URL from ActiveCampaign, never through next/image.
const SKIP_DIRS = new Set(["email"]);
const RASTER = /\.(webp|jpe?g|png|avif)$/i;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
    } else if (RASTER.test(entry.name)) {
      yield path.join(dir, entry.name);
    }
  }
}

let written = 0;
let sources = 0;
for (const file of walk(srcDir)) {
  sources++;
  const rel = path.relative(srcDir, file).replace(RASTER, "");
  const srcMtime = fs.statSync(file).mtimeMs;
  for (const w of widths) {
    const out = path.join(outDir, `${rel}-${w}.webp`);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= srcMtime) continue;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    // withoutEnlargement: a width larger than the original just gets the
    // original size, so every width the loader can ask for exists on disk.
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 75 }).toFile(out);
    written++;
  }
}
console.log(`optimize-images: ${sources} sources, ${written} variants written to public/_img`);
