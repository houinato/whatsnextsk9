import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IssueBody } from "@/components/issue-body";
import { JsonLd } from "@/components/json-ld";
import { formatIssueDate, getAdjacentIssues, getIssue, getIssues, issueTimestamp } from "@/lib/issues";
import { absoluteUrl, alternatesFor, pageTitle, siteName } from "@/lib/site";

type IssueRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const issues = getIssues();
  if (issues.length === 0) {
    throw new Error("Add at least one markdown file to content/issues before building.");
  }
  return issues.map((issue) => ({ slug: issue.slug }));
}

export async function generateMetadata({ params }: IssueRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) {
    return { title: "Issue not found" };
  }

  const title = pageTitle(issue.title);
  const path = `/issues/${issue.slug}`;

  return {
    title: { absolute: title },
    description: issue.summary,
    alternates: alternatesFor(path),
    openGraph: {
      type: "article",
      title,
      description: issue.summary,
      url: path,
      publishedTime: issueTimestamp(issue.date).toISOString(),
      modifiedTime: issueTimestamp(issue.date).toISOString(),
      locale: "en_GB",
    },
  };
}

export default async function IssuePage({ params }: IssueRouteProps) {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) notFound();

  const { newer, older } = getAdjacentIssues(issue.slug);
  const url = absoluteUrl(`/issues/${issue.slug}`);
  const siteUrl = absoluteUrl("/");

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: issue.title,
    description: issue.summary,
    datePublished: issueTimestamp(issue.date).toISOString(),
    dateModified: issueTimestamp(issue.date).toISOString(),
    inLanguage: "en-GB",
    mainEntityOfPage: url,
    url,
    author: { "@id": `${siteUrl}/#organisation` },
    publisher: { "@id": `${siteUrl}/#organisation` },
    isPartOf: { "@id": `${siteUrl}/#blog` },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Issues", item: absoluteUrl("/issues") },
      { "@type": "ListItem", position: 3, name: issue.title, item: url },
    ],
  };

  return (
    <article className="wrap issue-layout">
      <p className="kicker">
        <time dateTime={issue.date}>{formatIssueDate(issue.date)}</time>
        {" · "}
        <Link href="/issues">All issues</Link>
      </p>
      <IssueBody markdown={issue.content} />
      {newer || older ? (
        <nav className="pager" aria-label="Other issues">
          {newer ? <Link href={`/issues/${newer.slug}`}>Newer: {newer.title}</Link> : null}
          {older ? <Link href={`/issues/${older.slug}`}>Older: {older.title}</Link> : null}
        </nav>
      ) : null}
      <p className="muted">
        <Link href="/#signup">Get the next one by email</Link>
        {" · "}
        {siteName}
      </p>
      <JsonLd data={[article, breadcrumb]} />
    </article>
  );
}
