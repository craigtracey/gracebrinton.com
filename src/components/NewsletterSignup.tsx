"use client";

import { useState } from "react";

/**
 * Email capture wired to Grace's ActiveCampaign via /api/subscribe. Use for the
 * footer newsletter and inline lead-magnet blocks.
 */
export function NewsletterSignup({
  heading,
  body,
  cta = "Subscribe",
  collectName = false,
  compact = false,
}: {
  heading?: string;
  body?: string;
  cta?: string;
  collectName?: boolean;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullname: name }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data.ok) setState("done");
      else {
        setState("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className={`signup${compact ? " signup--compact" : ""}`}>
        {heading && <h3>Thank you!</h3>}
        <p className="signup__done">You&apos;re in. Check your inbox to confirm your subscription.</p>
      </div>
    );
  }

  return (
    <form className={`signup${compact ? " signup--compact" : ""}`} onSubmit={onSubmit} noValidate>
      {heading && <h3>{heading}</h3>}
      {body && <p className="signup__body">{body}</p>}
      <div className="signup__row">
        {collectName && (
          <input
            type="text"
            name="fullname"
            aria-label="First name"
            placeholder="First name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          name="email"
          required
          aria-label="Email address"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="button" disabled={state === "loading"}>
          {state === "loading" ? "Sending…" : cta}
        </button>
      </div>
      {state === "error" && <p className="signup__err">{error}</p>}
    </form>
  );
}
