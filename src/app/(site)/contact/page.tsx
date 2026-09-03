import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Grace Brinton, FDN-P.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="wrap prose-wrap" style={{ paddingBlock: "3rem" }}>
      <p className="eyebrow">Contact</p>
      <h1>Get in touch</h1>
      <p className="sub">
        The fastest way to start is to{" "}
        <Link href="/work-with-me">book a free consult</Link>. For anything else,
        send a message below, or email{" "}
        <a href="mailto:grace@gracebrinton.com">grace@gracebrinton.com</a> directly.
      </p>
      <ContactForm />
    </section>
  );
}
