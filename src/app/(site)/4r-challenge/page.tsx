import Image from "next/image";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "The Free 4R Gut Challenge",
  description:
    "A free four-week gut health reset with meal plans, recipes, worksheets, and simple lifestyle strategies. Next round starts October 17th.",
  path: "/4r-challenge",
});

// Campaign details: update these for each new round of the challenge.
const REGISTER_URL = "https://l.bttr.to/6xxoC";
const START_DATE = "October 17th";

const SYMPTOMS = [
  "Struggling to lose weight despite eating well and exercising",
  "Feeling tired or running on empty throughout the day",
  "Noticing more hair shedding or changes in your hair",
  "Dealing with bloating, digestive discomfort, or food sensitivities",
  "Experiencing hormone changes or feeling like your hormones are “off”",
  "Waking during the night or struggling to get truly restorative sleep",
  "Feeling more inflamed, sluggish, or unlike yourself",
  "Unsure what foods actually support your body anymore",
];

const STEPS = ["Remove", "Replace", "Reinoculate", "Repair"];

const BENEFITS = [
  "Support healthy digestion",
  "Nourish your body with nutrient-dense foods",
  "Identify habits and foods that may be working against you",
  "Build a stronger foundation for gut health",
  "Learn how your gut can influence the way you feel",
  "Create simple habits you can continue beyond the four weeks",
];

function RegisterButton({ light = false }: { light?: boolean }) {
  return (
    <a
      href={REGISTER_URL}
      className={light ? "button button--light" : "button"}
      target="_blank"
      rel="noopener"
    >
      Register for the free 4R Challenge
    </a>
  );
}

export default function FourRChallengePage() {
  return (
    <>
      {/* Hero */}
      <section className="band band--sage">
        <div className="band-inner hero-grid">
          <div>
            <p className="eyebrow">Free 4-Week Gut Health Reset · Starts {START_DATE}</p>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", margin: "0 0 1rem", maxWidth: "20ch" }}>
              You&apos;re doing all the &ldquo;right&rdquo; things&hellip; so why don&apos;t you feel your best?
            </h1>
            <p className="sub" style={{ fontSize: "1.15rem", maxWidth: "46ch", margin: "0 0 1rem" }}>
              You&apos;re eating fairly well. You&apos;re trying to stay active. You&apos;re taking
              care of everyone around you.
            </p>
            <p className="sub" style={{ fontSize: "1.15rem", maxWidth: "46ch", margin: "0 0 2rem" }}>
              But lately, your body just doesn&apos;t seem to be responding the way it used to.
            </p>
            <RegisterButton />
          </div>
          <Image
            className="hero-image"
            src="/images/grace-chopping.webp"
            alt={`${SITE.founder} preparing vegetables in her kitchen`}
            width={828}
            height={1123}
            priority
            sizes="(max-width: 820px) 100vw, 40vw"
          />
        </div>
      </section>

      {/* Symptoms */}
      <section className="wrap section">
        <div style={{ maxWidth: "46rem", marginInline: "auto" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", margin: "0 0 1.25rem" }}>Maybe you&apos;re&hellip;</h2>
          <ul className="expect-list challenge-list">
            {SYMPTOMS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="content" style={{ marginTop: "2rem" }}>
            <p>
              These changes can be frustrating, especially when you&apos;re already doing your best
              to take care of yourself.
            </p>
            <p>
              <strong>The good news?</strong> You don&apos;t have to overhaul your entire life to
              start supporting your health.
            </p>
            <p>
              Your digestive system is one of the foundations of overall health, and the 4R
              Challenge gives you a simple place to start.
            </p>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <RegisterButton />
          </div>
        </div>
      </section>

      {/* The 4R approach */}
      <section className="band band--peach">
        <div className="band-inner">
          <div style={{ maxWidth: "46rem" }}>
            <p className="eyebrow">The 4R Challenge</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", margin: "0 0 1rem" }}>Give your gut a reset</h2>
            <p style={{ margin: "0 0 1rem" }}>
              The 4R Challenge is a free four-week gut health reset that combines nourishing meal
              plans, simple lifestyle strategies, and supportive supplements to help you improve
              digestion and support gut healing.
            </p>
            <p style={{ margin: 0 }}>Each week, we&apos;ll focus on one step of the 4R approach:</p>
          </div>

          <ol className="step-grid">
            {STEPS.map((step, i) => (
              <li key={step} className="step-card">
                <span className="step-card__week">Week {i + 1}</span>
                <span className="step-card__name">{step}</span>
              </li>
            ))}
          </ol>

          <p style={{ maxWidth: "46rem", margin: "2rem 0 0" }}>
            You&apos;ll have the guidance, recipes, worksheets, and resources to help you put the
            pieces together, without having to figure it all out on your own.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="wrap section">
        <div style={{ maxWidth: "46rem", marginInline: "auto" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", margin: "0 0 1.25rem" }}>
            This is your opportunity to:
          </h2>
          <ul className="expect-list challenge-list">
            {BENEFITS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <p className="challenge-pullquote">
            You don&apos;t need another extreme diet. You need a foundation.
          </p>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="band band--ink">
        <div className="band-inner" style={{ textAlign: "center", maxWidth: "44rem" }}>
          <p className="eyebrow" style={{ color: "var(--color-sage)" }}>Registration is now open</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", margin: "0 0 1rem" }}>
            Ready to give your gut some attention?
          </h2>
          <p style={{ margin: "0 auto 1rem" }}>
            Join the <strong>free</strong> 4R Gut Challenge. The next round starts{" "}
            <strong>{START_DATE}</strong> and runs for four weeks.
          </p>
          <p style={{ margin: "0 auto 1rem" }}>
            You&apos;ll get access to the full program, including weekly guidance, meal plans,
            recipes, worksheets, lifestyle recommendations, and optional supplement support.
          </p>
          <p style={{ margin: "0 auto 1.75rem" }}>
            It&apos;s completely free, so there&apos;s nothing to lose and a lot to learn about your
            gut health.
          </p>
          <RegisterButton light />
          <p style={{ margin: "1.25rem auto 0", fontSize: "0.95rem" }}>
            Save your spot and get ready to start your gut health reset on {START_DATE}!
          </p>
        </div>
      </section>

      {/* Sign-off */}
      <section className="wrap section">
        <div className="challenge-signoff">
          <Image
            src="/images/about/grace-headshot.webp"
            alt={SITE.founder}
            width={400}
            height={400}
            sizes="160px"
          />
          <div>
            <p style={{ margin: "0 0 0.25rem", fontSize: "1.1rem" }}>I hope to see you there,</p>
            <p className="challenge-signoff__name">Grace</p>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-muted)" }}>
              {SITE.founder}, {SITE.credential} · {SITE.tagline}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
