import type { MetadataRoute } from "next";
import { getIssues } from "@/lib/issues";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const issues = getIssues();
  const latest = issues[0]?.date;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/issues"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...issues.map((issue) => ({
      url: absoluteUrl(`/issues/${issue.slug}`),
      lastModified: issue.date,
      changeFrequency: "never" as const,
      priority: 0.7,
    })),
  ];
}
