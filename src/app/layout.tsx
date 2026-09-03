import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Nunito_Sans, Great_Vibes } from "next/font/google";
import { SITE } from "@/lib/site";

// Elegant pairing: Playfair Display (refined serif) for headings, Nunito Sans
// for body, and Great Vibes (elegant script) reserved for the logo + hero
// signature only. Self-hosted via next/font for fast CWV.
const serif = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-var",
});
const sans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-var",
});
const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-script-var",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.tagline,
  // Default branded OG card; pages that use buildMetadata override this with a
  // title-specific card; this is the safety net for anything that doesn't.
  openGraph: {
    siteName: SITE.name,
    locale: SITE.locale,
    images: [{ url: "/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
