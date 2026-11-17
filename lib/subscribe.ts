export type SubscribeField = "email" | "firstName" | "consent" | "form";

export type SubscribeResult =
  | { ok: true; email: string; firstName?: string }
  | { ok: false; status: number; message: string; field: SubscribeField };

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const firstNamePattern = /^[\p{L}\p{M}][\p{L}\p{M}'’.\- ]{0,79}$/u;

export const messages = {
  honeypot: "We couldn't take that sign-up. Please use the form on the website and try again.",
  consent:
    "Please tick the box to confirm we may email you the Friday note. We only add people who ask for it.",
  email: "Please enter a valid email address.",
  firstName: "Please use a first name of up to 80 letters, or leave it blank.",
  unavailable:
    "Sign-up isn't open yet. The Friday notes are still on this website — please check back soon.",
  saved: "You're on the list. We'll send the next Friday note to this address.",
  already: "You're already on the list. We'll keep sending Friday's note to this address.",
  upstream: "We couldn't add you just now. Please try again in a little while.",
  rate: "That's a lot of tries in a short time. Please wait a few minutes and try again.",
  origin: "Please use the sign-up form on What's Next SK9.",
  invalid: "We couldn't read that sign-up. Please try the form again.",
} as const;

function honeypotFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value !== "string") return true;
  return value.trim() !== "";
}

export function validateSubscribe(input: {
  email: unknown;
  firstName: unknown;
  consent: unknown;
  honeypot: unknown;
}): SubscribeResult {
  if (honeypotFilled(input.honeypot)) {
    return { ok: false, status: 400, message: messages.honeypot, field: "form" };
  }

  const consent = input.consent;
  const consented = consent === true || consent === "on" || consent === "true";
  if (!consented) {
    return { ok: false, status: 400, message: messages.consent, field: "consent" };
  }

  if (typeof input.email !== "string") {
    return { ok: false, status: 400, message: messages.email, field: "email" };
  }
  const email = input.email.trim().toLowerCase();
  if (email.length === 0 || email.length > 254 || !emailPattern.test(email)) {
    return { ok: false, status: 400, message: messages.email, field: "email" };
  }

  if (input.firstName !== undefined && input.firstName !== null && typeof input.firstName !== "string") {
    return { ok: false, status: 400, message: messages.firstName, field: "firstName" };
  }
  const firstName = (typeof input.firstName === "string" ? input.firstName : "")
    .trim()
    .replace(/\s+/g, " ");
  if (firstName !== "" && !firstNamePattern.test(firstName)) {
    return { ok: false, status: 400, message: messages.firstName, field: "firstName" };
  }

  return { ok: true, email, firstName: firstName === "" ? undefined : firstName };
}
