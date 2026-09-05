import { SITE } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";

/**
 * Booking widget. Renders Grace's scheduler (Acuity/Calendly/Squarespace
 * Scheduling) in a responsive iframe when SITE.schedulerUrl is set; otherwise
 * the contact form stands in as the booking request, so there's always a
 * single way to reach out — never a bare mailto link.
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
      <h3>Start here</h3>
      <p className="signup__body">
        A few details and Grace will be in touch to schedule a call.
      </p>
      <ContactForm />
      {/* Dev: set SITE.schedulerUrl in src/lib/site.ts to Grace's real scheduler link. */}
    </div>
  );
}
