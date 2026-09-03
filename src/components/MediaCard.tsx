import Link from "next/link";
import Image from "next/image";

/** Image-topped card used across listing grids (recipes, articles, pillar hubs). */
export function MediaCard({
  href,
  image,
  title,
  description,
  tag,
}: {
  href: string;
  image?: string | null;
  title: string;
  description?: string;
  tag?: string;
}) {
  return (
    <Link href={href} className="mcard">
      {image ? (
        <div className="mcard__media">
          <Image src={image} alt={title} fill sizes="(max-width: 800px) 100vw, 340px" />
        </div>
      ) : (
        <div className="mcard__media mcard__media--placeholder" aria-hidden />
      )}
      <div className="mcard__body">
        {tag && <span className="tag">{tag}</span>}
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </Link>
  );
}
