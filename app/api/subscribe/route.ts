import { Resend } from "resend";
import { independenceNote, getSiteUrl } from "@/lib/site";
import { messages, validateSubscribe, type SubscribeField } from "@/lib/subscribe";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, number[]>();

type ResendFailure = {
  message: string;
  statusCode: number | null;
  name: string;
};

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 1000) {
    for (const [entry, times] of attempts) {
      if (times.every((time) => now - time >= WINDOW_MS)) attempts.delete(entry);
    }
  }
  return recent.length > MAX_ATTEMPTS;
}

function originAllowed(request: Request): boolean {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  let received: string;
  try {
    received = new URL(origin).origin;
  } catch {
    return false;
  }
  const host = request.headers.get("host");
  const allowed = new Set<string>([getSiteUrl()]);
  if (host) {
    allowed.add(`https://${host}`);
    allowed.add(`http://${host}`);
  }
  return allowed.has(received);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; font-family: Georgia, "Iowan Old Style", serif; background: #f3eee4; color: #241c15; }
    main { max-width: 38rem; margin: 0 auto; padding: 2.5rem 1.25rem; }
    a { color: #8d3b16; }
    .note { background: #e4f2ea; border: 1px solid #c9dfd0; border-radius: 1rem; padding: 1rem; }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <p><a href="/#signup">Back to What's Next SK9</a></p>
    <p class="note">${escapeHtml(independenceNote)}</p>
  </main>
</body>
</html>`;
}

function respond(wantsHtml: boolean, status: number, message: string, ok: boolean, field?: SubscribeField) {
  if (wantsHtml) {
    const title = ok ? "You're on the list" : status === 503 ? "Sign-up isn't open yet" : "We couldn't add you";
    return new Response(htmlPage(title, message), {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
  return Response.json(
    { ok, message, ...(field ? { field } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function readSubmission(request: Request): Promise<{ payload: Record<string, unknown>; wantsHtml: boolean } | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await request.json().catch(() => null);
    if (!json || typeof json !== "object" || Array.isArray(json)) return null;
    return { payload: json as Record<string, unknown>, wantsHtml: false };
  }
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    return {
      wantsHtml: true,
      payload: {
        email: form.get("email"),
        firstName: form.get("firstName"),
        consent: form.get("consent"),
        fax_number: form.get("fax_number"),
      },
    };
  }
  return null;
}

function isDuplicate(error: ResendFailure): boolean {
  return error.statusCode === 409 || error.message.toLowerCase().includes("already exists");
}

function logResendProblem(action: string, error: ResendFailure) {
  console.error(`Resend ${action} failed`, { name: error.name, statusCode: error.statusCode });
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return respond(false, 403, messages.origin, false, "form");
  }
  if (tooManyAttempts(clientKey(request))) {
    const wantsHtml = !(request.headers.get("content-type") ?? "").includes("application/json");
    return respond(wantsHtml, 429, messages.rate, false, "form");
  }

  const submission = await readSubmission(request);
  if (!submission) {
    return respond(false, 400, messages.invalid, false, "form");
  }

  const { payload, wantsHtml } = submission;
  const result = validateSubscribe({
    email: payload.email,
    firstName: payload.firstName,
    consent: payload.consent,
    honeypot: payload.fax_number,
  });
  if (!result.ok) {
    return respond(wantsHtml, result.status, result.message, false, result.field);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!apiKey || !audienceId) {
    return respond(wantsHtml, 503, messages.unavailable, false, "form");
  }

  // Adds the contact to the newsletter segment only. This route must not send email.
  const resend = new Resend(apiKey);
  const created = await resend.contacts.create({
    email: result.email,
    unsubscribed: false,
    segments: [{ id: audienceId }],
    ...(result.firstName ? { firstName: result.firstName } : {}),
  });

  if (!created.error) {
    return respond(wantsHtml, 200, messages.saved, true);
  }

  if (!isDuplicate(created.error)) {
    logResendProblem("create contact", created.error);
    return respond(wantsHtml, 502, messages.upstream, false, "form");
  }

  const updated = await resend.contacts.update({
    email: result.email,
    unsubscribed: false,
    ...(result.firstName ? { firstName: result.firstName } : {}),
  });
  if (updated.error && !isDuplicate(updated.error)) {
    logResendProblem("update contact", updated.error);
  }

  const added = await resend.contacts.segments.add({
    email: result.email,
    segmentId: audienceId,
  });
  if (added.error && !isDuplicate(added.error)) {
    logResendProblem("add segment", added.error);
    return respond(wantsHtml, 502, messages.upstream, false, "form");
  }

  return respond(wantsHtml, 200, messages.already, true);
}
