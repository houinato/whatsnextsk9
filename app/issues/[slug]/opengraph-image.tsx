import { ImageResponse } from "next/og";
import { ShareCard } from "@/components/share-card";
import { formatIssueDate, getIssue } from "@/lib/issues";

export const alt = "What's Next SK9 issue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getIssue(slug);
  const title = issue?.title ?? "What's Next SK9";
  const summary = issue?.summary ?? "A Friday note for families in SK9.";
  const detail = summary.length > 150 ? `${summary.slice(0, 149).trimEnd()}…` : summary;
  const kicker = issue ? formatIssueDate(issue.date) : "Friday note";

  return new ImageResponse(<ShareCard kicker={kicker} title={title} detail={detail} />, { ...size });
}
