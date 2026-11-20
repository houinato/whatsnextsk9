import { formatIssueDate, getIssues } from "@/lib/issues";
import { absoluteUrl, area, independenceNote, owner, pitch, siteName } from "@/lib/site";

export function GET() {
  const issues = getIssues();
  const issueLines = issues
    .map(
      (issue) =>
        `- [${issue.title}](${absoluteUrl(`/issues/${issue.slug}`)}): ${formatIssueDate(issue.date)}. ${issue.summary}`,
    )
    .join("\n");

  const body = `# ${siteName}

> ${pitch}

${siteName} is an independent weekly Friday newsletter and website for parents and teens in ${area} (SK9, Cheshire, UK). It covers career choices, local opportunities such as apprenticeships, open days, courses and deadlines, and safe, practical use of AI for study and careers.

${independenceNote}

The notes are written in British English. Links in each issue point at the official page. Dates and vacancies change, so readers should re-check before they travel or apply.

## What each Friday issue includes

- Local apprenticeships, open days, courses and deadlines
- Dates worth circling, including application deadlines
- One practical tip on using AI for planning or study, including the rule that assessed work must be the student's own

## Pages

- [Home](${absoluteUrl("/")}): the pitch, the newsletter sign-up, and the latest issue
- [Issues](${absoluteUrl("/issues")}): the archive
- [About](${absoluteUrl("/about")}): what the project is, and what it is not
- [Privacy](${absoluteUrl("/privacy")}): UK GDPR and PECR notice, including how to unsubscribe
- [RSS](${absoluteUrl("/feed.xml")}): the feed of issues

## Issues

${issueLines || "- No issues have been published yet."}

## Sign-up

The form collects an email address, an optional first name, and an explicit consent tick. It does not send email. When RESEND_API_KEY and RESEND_AUDIENCE_ID are set, the address is added to a Resend segment (Resend's current name for an audience). If those are not set, the form says sign-up is not open yet and stores nothing.

## Contact

${owner.name} — ${owner.contactEmail}

## Optional

For impartial careers guidance, readers can start with the National Careers Service (https://nationalcareers.service.gov.uk/) or their school or college careers team.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
