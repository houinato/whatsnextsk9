/**
 * Shared copy and URLs. British English.
 */

export const siteName = "What's Next SK9";

export const pitch =
  "A Friday note on careers, local opportunities and safe AI use, for families in Wilmslow, Handforth, Alderley Edge and Styal.";

export const area = "Wilmslow, Handforth, Alderley Edge and Styal";

export const independenceNote =
  "What's Next SK9 is independent. It is not affiliated with Wilmslow High School, Cheshire East Council, or any college, university or employer, and it is not official careers advice. Check the official pages before you apply.";

export const owner = {
  name: "Frederic Houinato",
  contactEmail: "houinato@gmail.com",
} as const;

const FALLBACK_SITE_URL = "https://whatsnextsk9.vercel.app";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return FALLBACK_SITE_URL;
    }
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageTitle(title: string): string {
  if (title.includes(siteName)) return title;
  return `${title} · ${siteName}`;
}

export function alternatesFor(path: string) {
  return {
    canonical: path,
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: siteName }],
    },
  };
}
