import Link from "next/link";
import { pillarByKey } from "@/lib/funnel";

/**
 * The "link up to the pillar" half of the funnel. Driven by the `pillar`
 * frontmatter field. Renders nothing if the page has no pillar (e.g. a
 * standalone Page with pillar = none).
 */
export function PillarUpLink({ pillarKey }: { pillarKey?: string | null }) {
  const pillar = pillarByKey(pillarKey);
  if (!pillar) return null;
  return (
    <p className="pillar-uplink">
      Part of our guide to{" "}
      <Link href={pillar.href}>{pillar.linkPhrase}</Link>.
    </p>
  );
}
