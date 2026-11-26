import Image from "next/image";
import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
// Same landing-page layout as the hormone guide; only the wide weekly-grid peek is new.
import s from "../hormoneguide/guide.module.css";
import m from "./mealplan.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Free 7-Day Gut Health Meal Plan",
  description:
    "Grace's free 7-day Gut Health Meal Plan: 20 nourishing recipes for breakfast, snacks, lunch, and dinner, plus a complete grocery list sorted by aisle.",
  path: "/gut-meal-plan",
});

const SYMPTOMS = [
  "Gas",
  "Bloating",
  "Constipation",
  "Loose stools",
  "Heartburn",
  "Food sensitivities",
];

const MEALS = [
  {
    name: "Breakfast",
    tagline: "Start with protein",
    body: "Zucchini Turkey Breakfast Skillet, Egg & Black Bean Tacos, Turkey Potato Breakfast Casserole, and Turkey Apple Breakfast Hash.",
  },
  {
    name: "Morning Snack",
    tagline: "Steady energy",
    body: "Golden Bone Broth Latte, Cinnamon Roll Protein Bars, Blueberry Avocado Protein Smoothie, and a Fruit & Egg Snack Plate.",
  },
  {
    name: "Lunch",
    tagline: "Fresh and filling",
    body: "Egg & Avocado Salad Lettuce Wraps, Pad Thai Chicken Salad, and Grilled Chicken with Cauliflower Rice Tabbouleh.",
  },
  {
    name: "Afternoon Snack",
    tagline: "Beat the slump",
    body: "Strawberry Green Smoothie, Peanut Butter Chia Yogurt with a Chocolate Top, and Ranch Cucumbers with hummus.",
  },
  {
    name: "Dinner",
    tagline: "Cook once, eat twice",
    body: "Chicken, Leek & Asparagus Orzo, Sweet Potato, Turkey & Kale Bowls, Salmon Noodle Stir Fry, Beef Tacos, and Coconut Harissa Poached Cod.",
  },
  {
    name: "Evening",
    tagline: "Wind down",
    body: "A cup of chamomile tea every night to close out the day and help your body settle before sleep.",
  },
];

const EXTRAS = [
  "20 recipes with step-by-step directions",
  "A complete grocery list, sorted by aisle",
  "Built-in leftovers, so dinner becomes tomorrow's lunch",
  "Most recipes ready in 30 minutes or less",
  "Easy swaps for dairy-free, nut-free, and vegetarian",
  "Storage notes so nothing goes to waste",
];

function PlanSignup() {
  return (
    <div className={s.formCard}>
      <NewsletterSignup
        form="gutMealPlan"
        collectName
        cta="Send me the meal plan"
        doneMessage="Thank you! Check your inbox, your free gut health meal plan is on its way."
      />
      <p className={s.formNote}>Free, and sent straight to your inbox.</p>
    </div>
  );
}

export default function GutMealPlanPage() {
  return (
    <>
      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <div>
            <p className="eyebrow">Free Meal Plan</p>
            <h1 className={s.title}>Gut Health Meal Plan</h1>
            <p className={s.subtitle}>7 Days of Nourishing Meals, Planned for You</p>
            <p className={s.lede}>
              A full week of breakfasts, snacks, lunches, and dinners built to support your
              digestion, with every recipe and the grocery list ready to go.
            </p>
            <PlanSignup />
          </div>
          <div className={s.heroVisual}>
            <div className={s.mockup}>
              <span className={s.badge} aria-hidden="true">
                <strong>Free</strong>
                7 Days
              </span>
              <Image
                className={s.pageBehind}
                src="/images/gut-meal-plan/grocery-list.webp"
                alt=""
                width={900}
                height={1165}
                sizes="(max-width: 899px) 272px, 384px"
              />
              <Image
                className={s.cover}
                src="/images/gut-meal-plan/recipe.webp"
                alt="A recipe page from the Gut Health Meal Plan: Zucchini Turkey Breakfast Skillet"
                width={900}
                height={1165}
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
            <h2 className={s.h2}>Does your digestion need some support?</h2>
            <div className="content">
              <p>
                Your gut plays a part in almost everything, from your energy and mood to how you
                process hormones. When digestion is off, it can feel overwhelming to know what to
                eat.
              </p>
            </div>
            <p className={s.callout}>
              This plan takes the guesswork out of the week, so you can focus on feeling better.
            </p>
          </div>
          <ul className={s.chips}>
            {SYMPTOMS.map((sym) => (
              <li key={sym}>{sym}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* The week */}
      <section className={s.steps}>
        <div className={s.stepsInner}>
          <p className="eyebrow" style={{ color: "var(--color-marigold)" }}>What&rsquo;s inside</p>
          <h2 className={s.h2}>Every meal, every day, for a week</h2>
          <p className={s.stepsIntro}>
            Six meals a day across seven days, with whole-food ingredients, plenty of protein, and
            leftovers planned in so you&rsquo;re not cooking from scratch every night.
          </p>
          <ol className={s.stepGrid}>
            {MEALS.map((meal, i) => (
              <li key={meal.name} className={s.step}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.stepTag}>{meal.tagline}</span>
                <h3 className={s.stepName}>{meal.name}</h3>
                <p className={s.stepBody}>{meal.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Extras */}
      <section className="wrap section">
        <div className={m.split}>
          <Image
            className={m.peekWide}
            src="/images/gut-meal-plan/week.webp"
            alt="The meal plan's weekly calendar, with breakfast, two snacks, lunch, dinner, and evening tea for Monday through Sunday"
            width={1200}
            height={928}
            sizes="(max-width: 879px) 90vw, 560px"
          />
          <div>
            <p className="eyebrow">Plus</p>
            <h2 className={s.h2}>Everything you need to make it easy</h2>
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
            <h2 className={s.h2}>Healing starts in the gut</h2>
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
                  Gut health is one of the first places I look with every client. Nourishing,
                  simple meals are where that work begins, and I put this plan together to make
                  that first week as easy as possible.
                </p>
                <p className={s.signature}>Grace</p>
              </div>
            </div>
          </div>
          <PlanSignup />
        </div>
      </section>
    </>
  );
}
