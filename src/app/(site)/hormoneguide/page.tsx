import Image from "next/image";
import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import s from "./guide.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Free Guide: Is This Perimenopause?",
  description:
    "Grace's free guide, Is This Perimenopause? 6 Steps to Support Hormones & Feel Your Best: minerals, circadian rhythm, stress, nourishment, detox, and gut health.",
  path: "/hormoneguide",
});

const SYMPTOMS = [
  "Thinning hair",
  "Sleep disturbances",
  "Mood changes",
  "Weight gain",
  "Irregular cycles",
  "Fatigue",
];

const STEPS = [
  {
    name: "Minerals",
    tagline: "The missing foundation",
    body: "Why calcium, magnesium, sodium, and potassium matter for your hormones, the foods richest in each, and the simple adrenal cocktail I recommend making every day.",
  },
  {
    name: "Circadian Rhythm",
    tagline: "The 24-hour hormone cycle",
    body: "How your internal clock shapes hormones, blood sugar, and sleep, plus easy morning-light and nightly routines to get it back on track.",
  },
  {
    name: "Stress & Nerves",
    tagline: "Hormone disruption",
    body: "You can't heal from a place of chronic stress. Realistic ways to start, check in during, and wind down your day.",
  },
  {
    name: "Nourishment",
    tagline: "Fuel for optimal function",
    body: "Nutrient density, how much protein you actually need, and balancing blood sugar, with a sample day of meals.",
  },
  {
    name: "Detoxification",
    tagline: "Balance and process hormones",
    body: "There's more to detox than a juice cleanse. Supporting your liver and drainage pathways one small step at a time.",
  },
  {
    name: "Your Gut",
    tagline: "The hidden connection",
    body: "A baseline check of your digestion, the foundations that support gut health, and when it's time to dig deeper.",
  },
];

const EXTRAS = [
  "My go-to adrenal cocktail recipe",
  "Food lists for the four main minerals",
  "Protein portions made simple, plus a sample daily meal plan",
  "Morning and evening routines for better sleep and less stress",
  "A step-by-step roadmap so you know exactly where to begin",
  "My list of trusted resources, from water filters to detox teas",
  "Bonus: my favorite Protein Chai Latte recipe",
];

function GuideSignup() {
  return (
    <div className={s.formCard}>
      <NewsletterSignup
        form="hormoneGuide"
        collectName
        cta="Send me the free guide"
        doneMessage="Thank you! Check your inbox, your free hormone guide is on its way."
      />
      <p className={s.formNote}>Free, and sent straight to your inbox.</p>
    </div>
  );
}

export default function HormoneGuidePage() {
  return (
    <>
      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <div>
            <p className="eyebrow">Free Guide</p>
            <h1 className={s.title}>Hormone Health Foundations</h1>
            <p className={s.subtitle}>6 Steps to Support Hormones &amp; Feel Your Best</p>
            <p className={s.lede}>
              An actionable guide to get you started today. Six foundational steps for better
              hormone health, and better overall health, whatever stage you&rsquo;re in.
            </p>
            <GuideSignup />
          </div>
          <div className={s.heroVisual}>
            <div className={s.mockup}>
              <span className={s.badge} aria-hidden="true">
                <strong>Free</strong>
                Guide
              </span>
              <Image
                className={s.pageBehind}
                src="/images/guide/inside-minerals.webp"
                alt=""
                width={900}
                height={1273}
                sizes="(max-width: 899px) 272px, 384px"
              />
              <Image
                className={s.cover}
                src="/images/guide/cover.webp"
                alt="Cover of the guide Is This Perimenopause? 6 Steps to Support Hormones & Feel Your Best"
                width={900}
                height={1273}
                priority
                sizes="(max-width: 899px) 272px, 384px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="wrap section">
        <div className={s.split}>
          <div>
            <p className="eyebrow">Who it&rsquo;s for</p>
            <h2 className={s.h2}>Wondering what&rsquo;s up with your hormones?</h2>
            <div className="content">
              <p>
                Women can begin to experience symptoms of perimenopause up to 10 years before true
                menopause. And hormone dysfunction can make those symptoms worse, or make
                perimenopause seem to arrive earlier.
              </p>
            </div>
            <p className={s.callout}>
              Whether you know you&rsquo;re in perimenopause or you&rsquo;re not sure yet, this
              guide is for you.
            </p>
          </div>
          <ul className={s.chips}>
            {SYMPTOMS.map((sym) => (
              <li key={sym}>{sym}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* The 6 steps */}
      <section className={s.steps}>
        <div className={s.stepsInner}>
          <p className="eyebrow" style={{ color: "var(--color-marigold)" }}>What&rsquo;s inside</p>
          <h2 className={s.h2}>Six steps to lay the foundation</h2>
          <p className={s.stepsIntro}>
            Perimenopause is naturally a time when hormones decline and feel unbalanced. Each step
            explains why it matters, where to start, and how to build from there.
          </p>
          <ol className={s.stepGrid}>
            {STEPS.map((step, i) => (
              <li key={step.name} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.stepTag}>{step.tagline}</span>
                <h3 className={s.stepName}>{step.name}</h3>
                <p className={s.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Extras */}
      <section className="wrap section">
        <div className={s.split}>
          <Image
            className={s.peek}
            src="/images/guide/inside-nourishment.webp"
            alt="A page from the guide with breakfast tips, protein portions, and a sample daily meal plan"
            width={900}
            height={1273}
            sizes="(max-width: 879px) 90vw, 352px"
          />
          <div>
            <p className="eyebrow">Plus</p>
            <h2 className={s.h2}>Practical tools you can use today</h2>
            <ul className={s.extras}>
              {EXTRAS.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={s.closing}>
        <div className={s.closingInner}>
          <div>
            <h2 className={s.h2}>We&rsquo;re in this together</h2>
            <div className={s.note}>
              <Image
                className={s.headshot}
                src="/images/about/grace-headshot.webp"
                alt={SITE.founder}
                width={400}
                height={400}
                sizes="88px"
              />
              <div>
                <p>
                  By the time I was 35, after years of extreme stress and health struggles, I had
                  what you could call &ldquo;menopausal levels of hormones.&rdquo; It&rsquo;s been
                  a journey from there, and I can&rsquo;t wait to share what I&rsquo;ve learned.
                </p>
                <p className={s.signature}>Grace</p>
              </div>
            </div>
          </div>
          <GuideSignup />
        </div>
      </section>
    </>
  );
}
