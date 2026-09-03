import { ImageResponse } from "next/og";

/**
 * NOTE: no `export const runtime = "edge"`. The OpenNext Cloudflare adapter does
 * not support Next's edge runtime (it shims next/dist/compiled/edge-runtime to an
 * empty module); the whole Worker already runs on workerd, so the default nodejs
 * runtime is both correct and the only supported option here.
 */

const SIZE = { width: 1200, height: 630 };

/**
 * Dynamic Open Graph card: /og?title=...  → a branded 1200×630 image with the
 * page title, Grace's script wordmark, and the brand palette. Used as the OG /
 * Twitter image for every page (fixes missing + wrong-aspect social cards).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("title") || "Functional Nutrition for Women's Hormones";
  const title = raw.length > 110 ? raw.slice(0, 107) + "…" : raw;

  // Fonts are fetched from /public over the request's own origin rather than via
  // `new URL("./font.ttf", import.meta.url)`. That bundler-relative form resolves
  // to a bare path ("/_next/static/media/...") which workerd's fetch() rejects
  // with "Invalid URL" — it has no notion of a relative base. Resolving against
  // req.url yields an absolute URL that works both in `next dev` and on Workers.
  const [script, serif] = await Promise.all([
    fetch(new URL("/fonts/GreatVibes-Regular.ttf", req.url)).then((r) => r.arrayBuffer()),
    fetch(new URL("/fonts/Prata-Regular.ttf", req.url)).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbf9f6",
          padding: "72px 84px",
          color: "#222425",
          borderTop: "14px solid #cdd4c4",
        }}
      >
        <div style={{ fontFamily: "Great Vibes", fontSize: 68, color: "#6d7c5a" }}>Grace Brinton</div>
        <div
          style={{
            fontFamily: "Prata",
            fontSize: title.length > 55 ? 58 : 74,
            lineHeight: 1.12,
            maxWidth: 960,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Prata",
            fontSize: 22,
            color: "#6b645d",
            textTransform: "uppercase",
            letterSpacing: 3,
          }}
        >
          <span>Functional Nutrition for Women&apos;s Hormones</span>
          <span>FDN-P</span>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Great Vibes", data: script, style: "normal", weight: 400 },
        { name: "Prata", data: serif, style: "normal", weight: 400 },
      ],
    }
  );
}
