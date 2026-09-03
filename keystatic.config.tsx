import { config, fields, collection, singleton } from "@keystatic/core";
import { PILLAR_OPTIONS, CTA_OPTIONS, DEFAULT_CTA } from "./src/lib/funnel";

/**
 * Keystatic: git-backed CMS.
 *
 * Division of labor: Grace owns CONTENT (recipes, articles, page copy) via this
 * admin UI at /keystatic; the developer owns STRUCTURE (layouts, routes, the
 * pillar/cta option lists in src/lib/funnel.ts).
 *
 * The `pillar` and `cta` fields are constrained `select` dropdowns sourced from
 * src/lib/funnel.ts; Grace picks from a list, so she can't typo a value that
 * breaks the auto-linking. Add/rename options in funnel.ts, not here.
 *
 * Storage: `local` — the admin writes straight to the working tree. The admin is
 * DEV-ONLY and never ships: its route files are named `*.dev.tsx` / `*.dev.ts`,
 * and next.config.ts only registers that extension outside production, so
 * `next build` emits no /keystatic UI and no /api/keystatic write endpoint. See
 * the note above `pageExtensions` in next.config.ts.
 *
 * The public site never needs this at runtime — it reads content/ through
 * `createReader` (src/lib/reader.ts) at BUILD time only.
 *
 * If Grace ever needs to edit without a local checkout, do NOT re-expose these
 * routes on the main deploy: give the admin its own separately-deployed,
 * access-controlled app using GitHub storage
 * (`storage: { kind: "github", repo: "gracebrinton/gracebrinton.com" }`), so her
 * edits land as commits and Cloudflare Pages rebuilds the public site.
 */

// Reusable funnel fields shared by Recipes, Articles, and Pages.
const pillarField = fields.select({
  label: "Pillar (auto-links up to this hub)",
  description:
    "Which hormone-health pillar does this feed? Adds a contextual link up to that hub page.",
  options: PILLAR_OPTIONS,
  defaultValue: PILLAR_OPTIONS[0].value,
});

const ctaField = fields.select({
  label: "Coaching CTA",
  description: "Which coaching offer should the call-to-action block promote?",
  options: CTA_OPTIONS,
  defaultValue: DEFAULT_CTA,
});

const legacyUrlField = fields.text({
  label: "Legacy URL (redirect source)",
  description:
    "The old Squarespace path this was migrated from (e.g. /treats/foo). Used to keep 301s in sync. Leave blank for new content.",
  validation: { isRequired: false },
});

const seoFields = {
  metaTitle: fields.text({
    label: "SEO title",
    description: "Overrides the page title in search results (~60 chars).",
    validation: { isRequired: false },
  }),
  metaDescription: fields.text({
    label: "SEO meta description",
    multiline: true,
    description: "Search-result snippet (~155 chars). Write for the click.",
    validation: { isRequired: false },
  }),
};

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Grace Brinton Content" },
    navigation: {
      Content: ["recipes", "articles", "pages"],
      "Site copy": ["home", "about", "coaching", "testimonials"],
    },
  },
  collections: {
    // ── RECIPES: top-of-funnel, reframed for hormone intent ────────────────
    recipes: collection({
      label: "Recipes",
      slugField: "title",
      path: "content/recipes/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "pillar"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: {
            description:
              "The URL slug. Reframe food-only slugs toward hormone intent (e.g. 'adrenal-cortisol-mocktail', not 'hibiscus-lemonade').",
          },
        }),
        summary: fields.text({
          label: "Summary / intro",
          multiline: true,
          description: "1–2 sentences. Doubles as the default meta description.",
        }),
        heroImage: fields.image({
          label: "Hero image",
          directory: "public/images/recipes",
          publicPath: "/images/recipes",
        }),
        publishedDate: fields.date({ label: "Published date" }),
        pillar: pillarField,
        cta: ctaField,
        // Structured recipe data → powers Recipe JSON-LD (rich results).
        prepMinutes: fields.integer({ label: "Prep time (minutes)", validation: { isRequired: false } }),
        cookMinutes: fields.integer({ label: "Cook time (minutes)", validation: { isRequired: false } }),
        servings: fields.text({ label: "Servings / yield", validation: { isRequired: false } }),
        ingredients: fields.array(fields.text({ label: "Ingredient" }), {
          label: "Ingredients",
          itemLabel: (props) => props.value,
        }),
        steps: fields.array(fields.text({ label: "Step", multiline: true }), {
          label: "Method",
          itemLabel: (props) => props.value.slice(0, 60),
        }),
        // The narrative body: the hormone-supporting story. This is where the
        // SEO + funnel framing lives (why this dish helps with X).
        content: fields.markdoc({ label: "Story & notes" }),
        legacyUrl: legacyUrlField,
        ...seoFields,
      },
    }),

    // ── ARTICLES: hormone-health cluster content ───────────────────────────
    articles: collection({
      label: "Articles (hormone-health)",
      slugField: "title",
      path: "content/articles/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "pillar"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({
          label: "Summary / intro",
          multiline: true,
          description: "Doubles as the default meta description.",
        }),
        heroImage: fields.image({
          label: "Hero image",
          directory: "public/images/articles",
          publicPath: "/images/articles",
        }),
        publishedDate: fields.date({ label: "Published date" }),
        pillar: pillarField,
        isCornerstone: fields.checkbox({
          label: "Cornerstone / pillar-hub article",
          description:
            "Tick ONE article per pillar. That article becomes the body of the /hormone-health/<pillar>/ hub page.",
          defaultValue: false,
        }),
        cta: ctaField,
        content: fields.markdoc({ label: "Body" }),
        legacyUrl: legacyUrlField,
        ...seoFields,
      },
    }),

    // ── PAGES: catch-all for one-off standalone pages ──────────────────────
    pages: collection({
      label: "Pages (standalone)",
      slugField: "title",
      path: "content/pages/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title"],
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: { description: "Renders at /<slug>." },
        }),
        summary: fields.text({ label: "Summary / intro", multiline: true }),
        pillar: fields.select({
          label: "Pillar (optional up-link)",
          options: [{ label: "(none)", value: "none" }, ...PILLAR_OPTIONS],
          defaultValue: "none",
        }),
        cta: fields.select({
          label: "Coaching CTA",
          description: "Choose a coaching offer, or '(none)' for legal/utility pages.",
          options: [{ label: "(none)", value: "none" }, ...CTA_OPTIONS],
          defaultValue: "none",
        }),
        content: fields.markdoc({ label: "Body" }),
        ...seoFields,
      },
    }),
  },

  singletons: {
    // ── HOME ───────────────────────────────────────────────────────────────
    home: singleton({
      label: "Home page",
      path: "content/singletons/home",
      format: { data: "yaml" },
      schema: {
        heading: fields.text({ label: "Headline" }),
        subheading: fields.text({ label: "Subheadline", multiline: true }),
        heroImage: fields.image({
          label: "Hero image",
          directory: "public/images",
          publicPath: "/images",
        }),
        intro: fields.text({ label: "Intro copy", multiline: true }),
        cta: ctaField,
        ...seoFields,
      },
    }),

    // ── ABOUT ───────────────────────────────────────────────────────────────
    about: singleton({
      label: "About page",
      path: "content/singletons/about",
      format: { contentField: "content" },
      schema: {
        heading: fields.text({ label: "Headline" }),
        summary: fields.text({ label: "Intro", multiline: true }),
        portrait: fields.image({
          label: "Portrait",
          directory: "public/images/about",
          publicPath: "/images/about",
        }),
        content: fields.markdoc({ label: "Body" }),
        cta: ctaField,
        ...seoFields,
      },
    }),

    // ── COACHING: the money page + its offer sub-pages ─────────────────────
    coaching: singleton({
      label: "Coaching page & offers",
      path: "content/singletons/coaching",
      format: { contentField: "intro" },
      schema: {
        heading: fields.text({
          label: "Headline",
          description:
            'Target "functional nutritionist for hormones" language, not "hormone coach" (see keyword pass).',
        }),
        subheading: fields.text({ label: "Subheadline", multiline: true }),
        intro: fields.markdoc({ label: "Intro / pillar copy" }),
        offers: fields.array(
          fields.object({
            slug: fields.text({
              label: "URL slug",
              description: "Renders at /coaching/<slug> (e.g. starter-kit).",
            }),
            name: fields.text({ label: "Program name" }),
            price: fields.text({ label: "Price", description: "e.g. $1,497" }),
            duration: fields.text({ label: "Duration", description: "e.g. 2-month program" }),
            availability: fields.text({
              label: "Availability note",
              validation: { isRequired: false },
            }),
            summary: fields.text({ label: "Short summary", multiline: true }),
            details: fields.text({
              label: "Full description",
              multiline: true,
              description: "Shown on the individual /coaching/<slug> page.",
            }),
            metaDescription: fields.text({
              label: "SEO meta description",
              multiline: true,
              validation: { isRequired: false },
            }),
          }),
          {
            label: "Offers",
            itemLabel: (props) => props.fields.name.value || props.fields.slug.value,
          }
        ),
        ...seoFields,
      },
    }),

    // ── TESTIMONIALS: social proof (the biggest conversion lever) ──────────
    testimonials: singleton({
      label: "Testimonials",
      path: "content/singletons/testimonials",
      format: { data: "yaml" },
      schema: {
        items: fields.array(
          fields.object({
            quote: fields.text({ label: "Quote", multiline: true }),
            name: fields.text({ label: "Client name or initials" }),
            detail: fields.text({
              label: "Detail",
              description: "e.g. 'Perimenopause · lost 18 lbs', shown under the name.",
              validation: { isRequired: false },
            }),
          }),
          {
            label: "Testimonials",
            itemLabel: (props) => props.fields.name.value || "Testimonial",
          }
        ),
      },
    }),
  },
});
