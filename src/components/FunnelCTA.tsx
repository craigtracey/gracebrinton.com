import Link from "next/link";
import { ctaByKey } from "@/lib/funnel";

/**
 * The contextual coaching CTA block. Driven entirely by the `cta` frontmatter
 * field: the template passes the key, this resolves the copy + destination.
 * Falls back to the default "book a consult" CTA if the key is missing/unknown.
 */
export function FunnelCTA({ ctaKey }: { ctaKey?: string | null }) {
  // Allow pages (e.g. legal) to opt out of the coaching pitch entirely.
  if (ctaKey === "none") return null;
  const cta = ctaByKey(ctaKey);
  return (
    <aside className="funnel-cta" aria-label="Work with Grace">
      <h2>{cta.heading}</h2>
      <p>{cta.body}</p>
      <Link href={cta.href} className="button">
        {cta.buttonLabel}
      </Link>
    </aside>
  );
}
