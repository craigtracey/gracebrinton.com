import { reader } from "@/lib/reader";

/** Social proof; renders nothing if there are no testimonials. */
export async function Testimonials({ heading = "What women are saying" }: { heading?: string }) {
  const data = await reader.singletons.testimonials.read();
  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="band band--sage">
      <div className="band-inner">
        <div className="section-head">
          <h2>{heading}</h2>
        </div>
        <div className="testimonial-grid">
          {items.map((t, i) => (
            <figure key={i} className="testimonial">
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="testimonial__name">{t.name}</span>
                {t.detail && <span className="testimonial__detail">{t.detail}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
