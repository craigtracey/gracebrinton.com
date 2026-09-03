"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";

const NAV = [
  { href: "/coaching", label: "Coaching" },
  // The hub keeps its keyword-bearing /hormone-health URL; the nav just wears a
  // shorter label now that it covers both the pillar guides and the articles.
  { href: "/hormone-health", label: "Learn" },
  { href: "/recipes", label: "Recipes" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" onClick={close}>
          {SITE.name}
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav${open ? " is-open" : ""}`} aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={close}>
              {item.label}
            </Link>
          ))}
          <SocialLinks className="header-social" />
          <Link href="/work-with-me" className="button" onClick={close}>
            Book a Consult
          </Link>
        </nav>
      </div>
    </header>
  );
}
