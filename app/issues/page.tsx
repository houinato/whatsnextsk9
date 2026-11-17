import type { Metadata } from "next";
import { IssueCard } from "@/components/issue-card";
import { getIssues } from "@/lib/issues";
import { alternatesFor, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Past issues",
  description: `Every Friday note from ${siteName}, for families in Wilmslow, Handforth, Alderley Edge and Styal.`,
  alternates: alternatesFor("/issues"),
  openGraph: {
    title: `Past issues · ${siteName}`,
    description: `Every Friday note from ${siteName}.`,
    url: "/issues",
  },
};

export default function IssuesPage() {
  const issues = getIssues();

  return (
    <div className="wrap">
      <header className="page-intro">
        <p className="kicker">Archive</p>
        <h1>Past issues</h1>
        <p>Each note stays here after it goes out on Friday. Start with the newest.</p>
      </header>
      {issues.length > 0 ? (
        <ul className="issue-list">
          {issues.map((issue) => (
            <li key={issue.slug}>
              <IssueCard issue={issue} heading="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">No issues yet. The first Friday note will be listed here.</p>
      )}
    </div>
  );
}
