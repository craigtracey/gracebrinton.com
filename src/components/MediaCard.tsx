import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

/** Image-topped card used across listing grids (recipes, articles, pillar hubs). */
export function MediaCard({
  href,
  image,
  title,
  description,
  tag,
  heading,
  children,
}: {
  href: string;
  image?: string | null;
  /** Plain title, also used as the image alt text. */
  title: string;
  description?: ReactNode;
  tag?: string;
  /** Rich version of the title (e.g. with search highlights); defaults to `title`. */
  heading?: ReactNode;
  /** Extra content under the description. */
  children?: ReactNode;
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
        <h3>{heading ?? title}</h3>
        {description && <p>{description}</p>}
        {children}
      </div>
    </Link>
  );
}
