import type { Metadata } from "next";
import Image from "next/image";
import { reader } from "@/lib/reader";
import { buildMetadata } from "@/lib/seo";
import { MarkdocContent } from "@/lib/content";
import { FunnelCTA } from "@/components/FunnelCTA";
import { SITE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const about = await reader.singletons.about.read();
  return buildMetadata({
    title: about?.metaTitle || about?.heading || `About ${SITE.name}`,
    description: about?.metaDescription || about?.summary,
    path: "/about",
    image: about?.portrait,
  });
}

const FACTS = ["FDN-P", "Professional Chef", "Functional Lab Testing", "Women's Hormone Health"];

export default async function AboutPage() {
  const about = await reader.singletons.about.read();
  const body = about ? await about.content() : null;

  return (
    <>
      <section className="band band--sage">
        <div className="band-inner" style={{ paddingBlock: "3rem" }}>
          <p className="eyebrow">About</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0 0 0.75rem", maxWidth: "22ch" }}>
            {about?.heading || `Meet ${SITE.name}`}
          </h1>
          {about?.summary && <p className="sub" style={{ margin: 0, maxWidth: "52ch" }}>{about.summary}</p>}
        </div>
      </section>

      <div className="wrap section">
        <div className="about-layout">
          <div className="about-portrait">
            {about?.portrait && (
              <Image
                src={about.portrait}
                alt={SITE.name}
                width={800}
                height={1000}
                priority
                sizes="(max-width: 900px) 100vw, 320px"
              />
            )}
            <div className="about-facts">
              {FACTS.map((f) => (
                <span key={f} className="tag">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="content-main">
            {body && (
              <div className="content">
                <MarkdocContent content={body} />
              </div>
            )}
            <FunnelCTA ctaKey={about?.cta} />
          </div>
        </div>
      </div>
    </>
  );
}
