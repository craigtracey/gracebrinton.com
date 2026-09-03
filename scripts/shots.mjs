import { chromium } from "playwright";

const B = process.env.B || "http://localhost:3205";
const DIR = process.env.SHOTDIR;
const targets = [
  ["home", "/"],
  ["recipes-index", "/recipes"],
  ["recipe", "/recipes/lemon-dill-salmon-cakes"],
  ["article", "/articles/blood-sugar-and-hormones"],
  ["pillar", "/hormone-health/gut-health"],
  ["coaching", "/coaching"],
];

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
for (const [name, url] of targets) {
  await page.goto(B + url, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${DIR}/shot-${name}.png`, fullPage: true });
  console.log("shot", name);
}
await browser.close();
