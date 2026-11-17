"use client";

import { useState } from "react";

type Field = "email" | "firstName" | "consent" | "form";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; field?: Field };

export function SignupForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "submitting" });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: data.get("email"),
          firstName: data.get("firstName"),
          consent: data.get("consent") === "on",
          fax_number: data.get("fax_number") ?? "",
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        field?: Field;
      } | null;

      if (!response.ok || !body?.ok) {
        setStatus({
          kind: "error",
          message: body?.message ?? "Something went wrong. Please try again.",
          field: body?.field,
        });
        return;
      }

      form.reset();
      setStatus({ kind: "success", message: body.message ?? "You're on the list." });
    } catch {
      setStatus({
        kind: "error",
        message: "We couldn't reach the sign-up service. Please try again in a moment.",
        field: "form",
      });
    }
  }

  const message = status.kind === "success" || status.kind === "error" ? status.message : "";
  const field = status.kind === "error" ? status.field : undefined;
  const submitting = status.kind === "submitting";

  return (
    <form className="signup" id="signup" action="/api/subscribe" method="post" onSubmit={onSubmit} noValidate>
      <h2 id="signup-heading">Get Friday&apos;s note</h2>
      <p className="signup-lead">
        One email each Friday. Your address is used only for that. You can unsubscribe whenever you like.
      </p>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="fax_number">Fax number</label>
        <input id="fax_number" name="fax_number" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          spellCheck={false}
          aria-invalid={field === "email" ? true : undefined}
          aria-describedby={field === "email" ? "signup-status" : undefined}
        />
      </div>

      <div className="field">
        <label htmlFor="firstName">
          First name <span className="optional">(optional)</span>
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="given-name"
          maxLength={80}
          aria-invalid={field === "firstName" ? true : undefined}
          aria-describedby={field === "firstName" ? "signup-status" : undefined}
        />
      </div>

      <div className="consent">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          value="on"
          required
          aria-invalid={field === "consent" ? true : undefined}
          aria-describedby="consent-hint"
        />
        <label htmlFor="consent">
          Yes. Email me What&apos;s Next SK9 each Friday. I understand this is an independent newsletter and not
          official careers advice, and I can unsubscribe at any time.
        </label>
      </div>
      <p id="consent-hint" className="field-hint">
        The box is there so we only write to people who have asked. See the{" "}
        <a href="/privacy">privacy notice</a>.
      </p>

      <button className="button" type="submit" disabled={submitting}>
        {submitting ? "Adding you…" : "Sign me up"}
      </button>

      <p
        id="signup-status"
        className={status.kind === "success" ? "form-status success" : "form-status"}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
