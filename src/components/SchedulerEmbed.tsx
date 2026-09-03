import { SITE } from "@/lib/site";

/**
 * Booking widget. Renders Grace's scheduler (Acuity/Calendly/Squarespace
 * Scheduling) in a responsive iframe when SITE.schedulerUrl is set; otherwise a
 * graceful email fallback so the page never looks broken pre-launch.
 */
export function SchedulerEmbed() {
  if (SITE.schedulerUrl) {
    return (
      <iframe
        src={SITE.schedulerUrl}
        title="Book a free consult"
        className="scheduler-embed"
        loading="lazy"
      />
    );
  }

  return (
    <div className="scheduler-fallback">
      <p>
        Booking opens here shortly. In the meantime, email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we&apos;ll get you on the
        calendar.
      </p>
      <a href={`mailto:${SITE.email}`} className="button">
        Email to book
      </a>
      {/* Dev: set SITE.schedulerUrl in src/lib/site.ts to Grace's real scheduler link. */}
    </div>
  );
}
