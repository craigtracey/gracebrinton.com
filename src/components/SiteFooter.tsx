import Link from "next/link";
import { SITE } from "@/lib/site";
import { NewsletterSignup } from "./NewsletterSignup";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="brand">{SITE.name}</p>
          <p style={{ maxWidth: "30ch", marginTop: "0.5rem" }}>{SITE.tagline}.</p>
          <SocialLinks className="footer-social" />
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <Link href="/coaching">Coaching</Link>
          <Link href="/hormone-health">Learn</Link>
          <Link href="/recipes">Recipes</Link>
          <Link href="/about">About</Link>
          <Link href="/work-with-me">Contact</Link>
        </nav>

        <div className="footer-signup">
          <NewsletterSignup
            compact
            heading="Hormone notes, no spam"
            body="Grace's occasional emails on hormones, recipes, and root-cause health."
            cta="Subscribe"
          />
        </div>
      </div>

      <div className="wrap">
        <p className="footer-legal">
          © {SITE.name}, {SITE.credential}. {SITE.tagline}.
        </p>
      </div>
    </footer>
  );
}
