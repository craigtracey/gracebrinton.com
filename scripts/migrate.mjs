/**
 * One-off migration from the live Squarespace site into Keystatic content files.
 *
 * Uses Squarespace's hidden JSON API (`?format=json-pretty`) for clean structured
 * data. For recipes it PARSES the Ingredients/Instructions sections out of the
 * body into structured frontmatter fields (so the two-column recipe layout +
 * Recipe schema work), dedupes images by content hash (Squarespace's featured
 * image duplicates the first body image), and keeps the intro as the story.
 *
 *   node scripts/migrate.mjs
 *
 * `pillar` is an auto-guess (explicit map for known articles); Grace refines in
 * the CMS. Reframing copy for hormone intent is intentionally left editorial.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import TurndownService from "turndown";
import * as cheerio from "cheerio";

const SITE = "https://www.gracebrinton.com";
const ROOT = process.cwd();
const UA = { "User-Agent": "Mozilla/5.0 (migration)" };

const RECIPES = [
  "/breakfast/sausage-frittata",
  "/breakfast/bread-pudding",
  "/breakfast/butternut-fennel-hash",
  "/breakfast/healing-breakfast-oatmeal",
  "/treats/green-protein-smoothie",
  "/treats/protein-chai-latte",
  "/treats/protein-oat-bars",
  "/dinner-1/turkey-taco-skillet",
  "/dinner-1/chicken-shawarma-salad",
  "/dinner-1/lemon-dill-salmon-cakes",
  "/dinner-1/primavera-chicken-meatballs",
  "/dinner-1/jennifer-aniston-salad",
  "/dinner-1/turkey-ragu-with-sweet-potato",
];

// Older 2020 /blog recipes worth keeping: [oldPath, cleanSlug]. Junk (face
// masks, placeholders, duplicate ginger-sodas, random slugs) is intentionally left
// behind and still covered by the /blog/:slug* catch-all redirect.
const BLOG_RECIPES = [
  ["/blog/goldenmilk-cmrzn", "golden-milk"],
  ["/blog/beetsalad-whhgg", "beet-salad"],
  ["/blog/watermelonsalad-xn24z", "watermelon-salad"],
  ["/blog/carrottahini-g6g8n", "carrot-tahini"],
  ["/blog/mashed-potatoes-with-mushrooms-and-brussels-sprout-zhtge", "mashed-potatoes-mushrooms-brussels-sprouts"],
  ["/blog/pea-amp-goat-cheese-crostini-x5wg5", "pea-goat-cheese-crostini"],
  ["/blog/ginger-soda-k6hb7-w85w4-dre64", "ginger-soda"],
];

const ARTICLES = [
  "/resources/the-3rd-and-hardest-pillar-of-gut-health",
  "/resources/the-2nd-pillar-of-gut-health",
  "/resources/5-pillars-of-gut-health",
  "/resources/whats-the-fuss-about-electrolytes",
  "/resources/the-power-of-protein",
  "/resources/toxin-exposure",
  "/resources/gut-health-unlocked",
  "/resources/unraveling-hair-loss",
  "/resources/weight-loss-resistance",
  "/resources/blood-sugar-and-hormones",
  "/resources/client-spotlight-sleep-and-hormones",
  "/resources/hormone-health-starts-here",
];

const PILLAR_RULES = [
  ["thyroid-hair-loss", /(thyroid|hair loss|hair fall|hair thinning|hair shed)/i],
  ["cortisol", /(cortisol|adrenal|stress|sleep|electrolyte)/i],
  ["gut-health", /(gut health|gut-health|microbiome|digest|bloat|toxin|detox|leaky gut)/i],
  ["perimenopause", /(perimenopause|menopaus|hot flash|estrogen dominance)/i],
  ["blood-sugar", /(blood sugar|blood-sugar|insulin|glucose|protein|weight[ -]?loss|metabol)/i],
];
const guessPillar = (text) => PILLAR_RULES.find(([, re]) => re.test(text))?.[0] ?? "blood-sugar";

const ARTICLE_PILLAR = {
  "the-3rd-and-hardest-pillar-of-gut-health": "gut-health",
  "the-2nd-pillar-of-gut-health": "gut-health",
  "5-pillars-of-gut-health": "gut-health",
  "gut-health-unlocked": "gut-health",
  "toxin-exposure": "gut-health",
  "whats-the-fuss-about-electrolytes": "cortisol",
  "client-spotlight-sleep-and-hormones": "cortisol",
  "the-power-of-protein": "blood-sugar",
  "weight-loss-resistance": "blood-sugar",
  "blood-sugar-and-hormones": "blood-sugar",
  "hormone-health-starts-here": "blood-sugar",
  "unraveling-hair-loss": "thyroid-hair-loss",
};

const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
td.remove(["script", "style", "iframe", "noscript"]);

const slugOf = (p) => p.split("/").filter(Boolean).pop();
const msToDate = (ms) => new Date(Number(ms)).toISOString().slice(0, 10);
const clean = (s) => (s || "").replace(/\s+/g, " ").replace(/^[-*•]\s*/, "").trim();
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
const yamlStr = (s) => JSON.stringify(s ?? "");

async function fetchItem(p) {
  const res = await fetch(`${SITE}${p}?format=json-pretty`, { headers: UA });
  if (!res.ok) throw new Error(`fetch ${p} -> ${res.status}`);
  const data = await res.json();
  const item = data.item || (data.items && data.items[0]);
  if (!item) throw new Error(`no item in ${p}`);
  return item;
}

function extFor(contentType, url) {
  if (/webp/i.test(contentType)) return "webp";
  if (/png/i.test(contentType)) return "png";
  if (/gif/i.test(contentType)) return "gif";
  if (/jpe?g/i.test(contentType)) return "jpg";
  const u = url.split("?")[0].toLowerCase();
  return u.endsWith(".png") ? "png" : u.endsWith(".webp") ? "webp" : "jpg";
}

async function fetchImage(url) {
  try {
    const clean = url.split("?")[0];
    const res = await fetch(`${clean}?format=1500w`, { headers: UA });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return { buf, ext: extFor(res.headers.get("content-type") || "", clean), hash: crypto.createHash("md5").update(buf).digest("hex") };
  } catch {
    return null;
  }
}

function saveBuf(buf, collection, baseName, ext) {
  const publicPath = `/images/${collection}/${baseName}.${ext}`;
  const abs = path.join(ROOT, "public", publicPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, buf);
  return publicPath;
}

const parsePT = (s) => {
  if (!s) return null;
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(s);
  if (!m) return null;
  return parseInt(m[1] || 0, 10) * 60 + parseInt(m[2] || 0, 10) || null;
};

// Extract structured recipe data and REMOVE the source widget from the body so
// only the narrative intro remains. Prefers the "Copy Me That" (ccm-*) widget's
// schema.org microdata; falls back to heading-based parsing of plain lists.
function extractRecipe($, title) {
  const rc = $('[itemtype*="schema.org/Recipe"]').first();
  if (rc.length) {
    const ingredients = rc
      .find('[itemprop="recipeIngredient"]')
      .map((_, el) => clean($(el).text()))
      .get()
      .filter(Boolean);
    const steps = [];
    rc.find('[itemprop="recipeInstructions"]').each((_, el) => {
      const $el = $(el);
      const lis = $el.find("li");
      if (lis.length) lis.each((_, li) => steps.push(clean($(li).text())));
      else {
        const t = clean($el.text());
        if (t) steps.push(t);
      }
    });
    const prepMinutes = parsePT(rc.find('[itemprop="prepTime"]').attr("content"));
    const cookMinutes = parsePT(rc.find('[itemprop="cookTime"]').attr("content"));
    const servings = clean(rc.find('[itemprop="recipeYield"], .ccm-yield__amount').first().text());
    // Remove the whole widget (and any stray ccm chrome) from the narrative body.
    (rc.closest(".sqs-block").length ? rc.closest(".sqs-block") : rc).remove();
    $('[class*="ccm-"]').each((_, el) => {
      const b = $(el).closest(".sqs-block");
      (b.length ? b : $(el)).remove();
    });
    if (ingredients.length && steps.length) return { ingredients, steps, prepMinutes, cookMinutes, servings };
  }

  // Fallback: parse plain "Ingredients"/"Instructions" heading sections.
  const nodes = $("h1,h2,h3,h4,h5,ul,ol").toArray();
  const ingredients = [];
  const steps = [];
  const remove = [];
  let mode = "pre";
  for (const el of nodes) {
    const tag = el.tagName.toLowerCase();
    if (/^h[1-5]$/.test(tag)) {
      const t = $(el).text().trim();
      const tl = t.toLowerCase();
      if (/ingredient/.test(tl)) { mode = "ing"; remove.push(el); }
      else if (/instruction|method|direction|^\s*steps?\s*$|preparation/.test(tl)) { mode = "steps"; remove.push(el); }
      else if (/equipment|note|tip|substitut|storage|to serve|nutrition/.test(tl)) { mode = "post"; }
      else if (norm(t) === norm(title)) { remove.push(el); }
    } else if (tag === "ul" || tag === "ol") {
      if (mode === "ing") { $(el).find("li").each((_, li) => ingredients.push(clean($(li).text()))); remove.push(el); }
      else if (mode === "steps") { $(el).find("li").each((_, li) => steps.push(clean($(li).text()))); remove.push(el); }
    }
  }
  const ing = ingredients.filter(Boolean);
  const stp = steps.filter(Boolean);
  if (ing.length && stp.length) {
    remove.forEach((el) => $(el).remove());
    return { ingredients: ing, steps: stp, prepMinutes: null, cookMinutes: null, servings: "" };
  }
  return null;
}

// Download body images, rewrite srcs to local, and drop any that duplicate an
// already-seen image (by content hash, which kills the hero-repeat). `seen` maps hash
// -> localPath and should be pre-seeded with the hero's hash.
async function processImages($, collection, slug, seen) {
  let n = 0;
  for (const img of $("img").toArray()) {
    const el = $(img);
    const src = el.attr("data-src") || el.attr("src") || "";
    if (!src || src.startsWith("data:")) { el.remove(); continue; }
    const fetched = await fetchImage(src);
    if (!fetched) { el.remove(); continue; }
    if (seen.has(fetched.hash)) { el.remove(); continue; } // duplicate image → drop
    n += 1;
    const local = saveBuf(fetched.buf, collection, `${slug}-${n}`, fetched.ext);
    seen.set(fetched.hash, local);
    el.attr("src", local);
    el.removeAttr("data-src");
    el.removeAttr("srcset");
  }
}

async function migrateOne(oldPath, collection, slugOverride) {
  const item = await fetchItem(oldPath);
  const slug = slugOverride || slugOf(oldPath);
  const title = clean(item.title) || slug;
  const summary = clean(cheerio.load(`<x>${item.excerpt || ""}</x>`)("x").text());
  const publishedDate = item.publishOn ? msToDate(item.publishOn) : msToDate(item.addedOn);
  const pillar =
    collection === "articles"
      ? ARTICLE_PILLAR[slug] ?? guessPillar(`${title} ${summary}`)
      : guessPillar(`${title} ${summary}`);

  const seen = new Map();
  let heroImage = null;
  if (item.assetUrl) {
    const h = await fetchImage(item.assetUrl);
    if (h) {
      heroImage = saveBuf(h.buf, collection, slug, h.ext);
      seen.set(h.hash, heroImage); // so body copies of the hero get dropped
    }
  }

  const $ = cheerio.load(item.body || "", null, false);
  let recipe = null;
  if (collection === "recipes") {
    recipe = extractRecipe($, title);
    $("img").remove(); // hero carries the dish; drop redundant/near-duplicate body photos
  } else {
    await processImages($, collection, slug, seen);
  }
  const body = td.turndown($.html()).replace(/\n{3,}/g, "\n\n").trim();

  const yamlList = (key, arr) => [`${key}:`, ...arr.map((v) => `  - ${yamlStr(v)}`)].join("\n");

  const fm = [
    "---",
    `title: ${yamlStr(title)}`,
    `summary: ${yamlStr(summary)}`,
    `publishedDate: ${publishedDate}`,
    heroImage ? `heroImage: ${heroImage}` : null,
    `pillar: ${pillar}`,
    `cta: book-consult`,
    collection === "articles" ? `isCornerstone: false` : null,
    recipe && recipe.prepMinutes ? `prepMinutes: ${recipe.prepMinutes}` : null,
    recipe && recipe.cookMinutes ? `cookMinutes: ${recipe.cookMinutes}` : null,
    recipe && recipe.servings ? `servings: ${yamlStr(recipe.servings)}` : null,
    recipe ? yamlList("ingredients", recipe.ingredients) : null,
    recipe ? yamlList("steps", recipe.steps) : null,
    `legacyUrl: ${oldPath}`,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const out = path.join(ROOT, "content", collection, `${slug}.mdoc`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${fm}\n\n${body}\n`);

  return { slug, pillar, oldPath, collection, structured: !!recipe, images: seen.size };
}

async function run() {
  const results = [];
  for (const p of RECIPES) {
    try {
      const r = await migrateOne(p, "recipes");
      results.push(r);
      console.log(`✓ recipe  ${r.slug}  [${r.structured ? "structured" : "body-only"}, ${r.images} img]`);
    } catch (e) {
      console.log(`✗ recipe  ${p}: ${e.message}`);
    }
  }
  for (const [p, s] of BLOG_RECIPES) {
    try {
      const r = await migrateOne(p, "recipes", s);
      results.push(r);
      console.log(`✓ recipe  ${r.slug}  [blog, ${r.structured ? "structured" : "body-only"}]`);
    } catch (e) {
      console.log(`✗ recipe  ${p}: ${e.message}`);
    }
  }
  for (const p of ARTICLES) {
    try {
      const r = await migrateOne(p, "articles");
      results.push(r);
      console.log(`✓ article ${r.slug}  [pillar: ${r.pillar}, ${r.images} img]`);
    } catch (e) {
      console.log(`✗ article ${p}: ${e.message}`);
    }
  }
  const structured = results.filter((r) => r.structured).length;
  console.log(`\n=== ${results.length} migrated (${structured} recipes with parsed ingredients/steps) ===`);
  console.log("\nBlog recipe redirects for next.config.ts (place BEFORE the /blog/:slug* catch-all):");
  for (const [p, s] of BLOG_RECIPES) {
    console.log(`  { source: "${p}", destination: "/recipes/${s}", permanent: true },`);
  }
}

run();
