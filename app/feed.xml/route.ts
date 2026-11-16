import { getIssues, issueTimestamp } from "@/lib/issues";
import { markdownToHtml } from "@/lib/markdown";
import { absoluteUrl, pitch, siteName } from "@/lib/site";
import { cdata, escapeXml } from "@/lib/xml";

export function GET() {
  const issues = getIssues();
  const self = absoluteUrl("/feed.xml");
  const items = issues
    .map((issue) => {
      const link = absoluteUrl(`/issues/${issue.slug}`);
      const html = markdownToHtml(issue.content);
      return `    <item>
      <title>${escapeXml(issue.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${issueTimestamp(issue.date).toUTCString()}</pubDate>
      <description>${escapeXml(issue.summary)}</description>
      <content:encoded>${cdata(html)}</content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>${escapeXml(pitch)}</description>
    <language>en-gb</language>
    <lastBuildDate>${(issues[0] ? issueTimestamp(issues[0].date) : new Date(Date.UTC(2026, 10, 16))).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
