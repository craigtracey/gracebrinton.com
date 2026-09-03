"use client";

import { useState } from "react";

/** Contact form wired to Grace's inbox via /api/contact (Resend). */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
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
      <div className="contact-form">
        <p className="signup__done">
          Thanks, {name.split(" ")[0] || "there"}! Grace will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="contact-form__hp"
        aria-hidden="true"
      />
      <div className="contact-form__row">
        <label>
          Name
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <label>
        Message
        <textarea
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <button type="submit" className="button" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Send message"}
      </button>
      {state === "error" && <p className="signup__err">{error}</p>}
    </form>
  );
}
