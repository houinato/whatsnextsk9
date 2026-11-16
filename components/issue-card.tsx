import Link from "next/link";
import { formatIssueDate, type Issue } from "@/lib/issues";

export function IssueCard({
  issue,
  heading,
  featured = false,
}: {
  issue: Issue;
  heading: "h2" | "h3";
  featured?: boolean;
}) {
  const Title = heading;

  return (
    <article className={featured ? "issue-card featured" : "issue-card"}>
      <p className="kicker">
        <time dateTime={issue.date}>{formatIssueDate(issue.date)}</time>
      </p>
      <Title>
        <Link href={`/issues/${issue.slug}`}>{issue.title}</Link>
      </Title>
      <p>{issue.summary}</p>
      {featured && issue.highlights.length > 0 ? (
        <>
          <p className="highlights-label">In this note</p>
          <ul className="highlights">
            {issue.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="card-action">
        <Link className="text-link" href={`/issues/${issue.slug}`}>
          Read the full note
        </Link>
      </p>
    </article>
  );
}
