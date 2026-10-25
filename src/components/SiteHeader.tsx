"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";
import s from "./SiteHeader.module.css";

type NavLink = { href: string; label: string };
type NavItem = NavLink | { label: string; children: NavLink[] };

const NAV: NavItem[] = [
  { href: "/coaching", label: "Work With Me" },
  // The hub keeps its keyword-bearing /hormone-health URL; the nav just wears a
  // shorter label now that it covers both the pillar guides and the articles.
  {
    label: "Learn",
    children: [
      { href: "/hormone-health", label: "Articles" },
      { href: "/hormoneguide", label: "Hormone Guide" },
    ],
  },
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
          {NAV.map((item) =>
            "children" in item ? (
              <NavGroup key={item.label} label={item.label} items={item.children} onNavigate={close} />
            ) : (
              <Link key={item.href} href={item.href} onClick={close}>
                {item.label}
              </Link>
            ),
          )}
          <SocialLinks className="header-social" />
          <Link href="/work-with-me" className="button" onClick={close}>
            Book a Consult
          </Link>
        </nav>
      </div>
    </header>
  );
}

/**
 * A nav item with sub-links. On desktop it opens on hover/focus (CSS) or on
 * click; in the mobile menu the sub-links are always shown, indented.
 */
function NavGroup({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: NavLink[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`${s.group}${open ? ` ${s.open}` : ""}`}>
      <button
        type="button"
        className={s.trigger}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg className={s.caret} viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div className={s.menu}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={s.item}
            onClick={() => {
              setOpen(false);
              onNavigate();
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
