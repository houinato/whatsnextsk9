import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

export type Issue = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  highlights: string[];
};

const issuesDirectory = path.join(process.cwd(), "content", "issues");
const filenamePattern = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const inlineMarkdownPattern = /\[([^\]]+)\]\([^)]+\)/g;
const emphasisPattern = /[*_`]/g;

function stripInlineMarkdown(value: string): string {
  return value.replace(inlineMarkdownPattern, "$1").replace(emphasisPattern, "").trim();
}

function highlightsFrom(markdown: string): string[] {
  const highlights: string[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^###\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    highlights.push(stripInlineMarkdown(match[1]));
    if (highlights.length === 5) break;
  }
  return highlights;
}

function asIsoDate(value: unknown, filename: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof value === "string" && isoDatePattern.test(value.trim())) {
    return value.trim();
  }
  throw new Error(
    `${filename} needs a frontmatter date in YYYY-MM-DD form. Quote it, for example date: "2026-11-20".`,
  );
}

function requiredString(value: unknown, filename: string, field: "title" | "summary"): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${filename} is missing a frontmatter ${field}.`);
  }
  return value.trim();
}

function readIssueFile(filename: string): Issue {
  const match = filenamePattern.exec(filename);
  if (!match) {
    throw new Error(
      `${filename} should be named YYYY-MM-DD-short-slug.md, using lowercase letters, numbers and hyphens.`,
    );
  }

  const raw = fs.readFileSync(path.join(issuesDirectory, filename), "utf8");
  const parsed = matter(raw);
  const date = asIsoDate(parsed.data.date, filename);
  if (date !== match[1]) {
    throw new Error(`${filename} starts with ${match[1]} but its frontmatter date is ${date}.`);
  }

  return {
    slug: filename.replace(/\.md$/, ""),
    title: requiredString(parsed.data.title, filename, "title"),
    date,
    summary: requiredString(parsed.data.summary, filename, "summary"),
    content: parsed.content.trim(),
    highlights: highlightsFrom(parsed.content),
  };
}

export const getIssues = cache(function getIssues(): Issue[] {
  if (!fs.existsSync(issuesDirectory)) return [];
  return fs
    .readdirSync(issuesDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map(readIssueFile)
    .sort((a, b) => {
      if (a.date === b.date) return b.slug.localeCompare(a.slug);
      return a.date < b.date ? 1 : -1;
    });
});

export function getIssue(slug: string): Issue | null {
  return getIssues().find((issue) => issue.slug === slug) ?? null;
}

export function getLatestIssue(): Issue | null {
  return getIssues()[0] ?? null;
}

export function getAdjacentIssues(slug: string): { newer: Issue | null; older: Issue | null } {
  const issues = getIssues();
  const index = issues.findIndex((issue) => issue.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: issues[index - 1] ?? null,
    older: issues[index + 1] ?? null,
  };
}

const weekdayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  timeZone: "UTC",
});

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatIssueDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return `${weekdayFormat.format(date)} ${dayFormat.format(date)}`;
}

/** Noon-adjacent UTC so the calendar day stays Friday in the UK. */
export function issueTimestamp(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 7, 0, 0));
}
