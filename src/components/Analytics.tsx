import Script from "next/script";
import { SITE } from "@/lib/site";

/**
 * Google Analytics 4 + Microsoft Clarity.
 *
 * Both load with `afterInteractive` so the tags never block first paint or LCP
 * — analytics is not worth a Core Web Vitals hit on a site whose whole job is
 * ranking. next/script also dedupes the inline blocks by `id`, so they run once
 * per page load rather than on every client-side navigation.
 *
 * Rendered only in production builds: `next dev` would otherwise pollute
 * Grace's real reporting with local page views and session recordings.
 *
 * SPA route changes need no extra wiring. GA4's enhanced measurement counts
 * page views off browser history events, and Clarity tracks history changes
 * natively, so App Router navigations register in both.
 */
export function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

  const { googleAnalyticsId, clarityId } = SITE.analytics;

  return (
    <>
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}
