/**
 * Single source of truth for the funnel mechanic.
 *
 * Every recipe/article carries two frontmatter fields, `pillar` and `cta`,
 * that the page templates read to (a) auto-link UP to the relevant hormone-health
 * pillar and (b) inject the matching coaching call-to-action block.
 *
 * These same arrays generate the constrained dropdown options in Keystatic
 * (see keystatic.config.tsx), so Grace physically cannot type a value that the
 * templates don't know how to route. Add a pillar/CTA here and it appears in the
 * CMS dropdown and resolves in the templates in one edit.
 */

export const PILLARS = [
  {
    key: "blood-sugar",
    label: "Blood Sugar & Hormones",
    href: "/hormone-health/blood-sugar",
    // Short line used on up-links: "Part of our guide to ___"
    linkPhrase: "balancing blood sugar for hormone health",
  },
  {
    key: "cortisol",
    label: "Cortisol & Stress Hormones",
    href: "/hormone-health/cortisol",
    linkPhrase: "lowering cortisol naturally",
  },
  {
    key: "perimenopause",
    label: "Perimenopause",
    href: "/hormone-health/perimenopause",
    linkPhrase: "eating for perimenopause",
  },
  {
    key: "thyroid-hair-loss",
    label: "Thyroid & Hair Loss",
    href: "/hormone-health/thyroid-hair-loss",
    linkPhrase: "thyroid health & hair loss",
  },
  {
    key: "gut-health",
    label: "Gut Health",
    href: "/hormone-health/gut-health",
    linkPhrase: "gut health for hormones",
  },
] as const;

export type PillarKey = (typeof PILLARS)[number]["key"];

export const CTAS = [
  {
    key: "book-consult",
    label: "Book a Free Consult (default)",
    heading: "Not sure where to start?",
    body: "Book a no-obligation consult and we'll map out what's actually driving your symptoms, and whether working together is the right fit.",
    buttonLabel: "Book a Free Consult",
    href: "/work-with-me",
  },
  {
    key: "starter-kit",
    label: "Women's Health Starter Kit ($1,497)",
    heading: "Ready to find your baseline?",
    body: "The Women's Health Starter Kit pairs functional lab testing with two months of guided 1:1 sessions to get you a clear starting point.",
    buttonLabel: "Explore the Starter Kit",
    href: "/coaching/starter-kit",
  },
  {
    key: "hormone-deep-dive",
    label: "Hormone Health Deep Dive ($2,397)",
    heading: "Want to get to the root cause?",
    body: "The Hormone Health Deep Dive is four months of 1:1 support with personalized functional testing, for women ready to do the real work.",
    buttonLabel: "Explore the Deep Dive",
    href: "/coaching/hormone-deep-dive",
  },
  {
    key: "thyroid-hair-loss",
    label: "Thyroid & Hair Loss Intensive ($2,397)",
    heading: "Thyroid symptoms or thinning hair?",
    body: "The Thyroid Wellness & Hair Loss Intensive is a four-month, laser-focused program built around your labs and your hair-regrowth timeline.",
    buttonLabel: "Explore the Intensive",
    href: "/coaching/thyroid-hair-loss",
  },
] as const;

export type CtaKey = (typeof CTAS)[number]["key"];

export const DEFAULT_CTA: CtaKey = "book-consult";

export const pillarByKey = (key: string | null | undefined) =>
  PILLARS.find((p) => p.key === key);

export const ctaByKey = (key: string | null | undefined) =>
  CTAS.find((c) => c.key === key) ?? CTAS.find((c) => c.key === DEFAULT_CTA)!;

// Option lists consumed by Keystatic select fields.
export const PILLAR_OPTIONS = PILLARS.map((p) => ({ label: p.label, value: p.key }));
export const CTA_OPTIONS = CTAS.map((c) => ({ label: c.label, value: c.key }));
