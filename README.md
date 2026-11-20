# What's Next SK9

An independent Friday newsletter and website for parents and teens in Wilmslow, Handforth, Alderley Edge and Styal (SK9, Cheshire). It covers career choices, local opportunities, and safe, practical use of AI for study and careers.

The site is a Next.js app. It is meant to deploy on Vercel with no extra configuration. A new issue is one Markdown file.

What's Next SK9 is not affiliated with Wilmslow High School, Cheshire East Council, or any college, university or employer, and it is not official careers advice.

## Develop locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

The build succeeds when `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` are missing. The sign-up form then shows a friendly message and stores nothing.

## Add a new issue

1. Create a file in `content/issues/` named `YYYY-MM-DD-short-slug.md`. Use the Friday’s date, lowercase letters, and hyphens. Example: `content/issues/2026-11-27-open-days.md`.
2. Start the file with this frontmatter:

```yaml
---
title: "What's Next SK9 — 27 November 2026"
date: "2026-11-27"
summary: "One or two sentences. This is used on the home page, the archive, the RSS feed and search results."
---
```

3. Write the issue in Markdown under the frontmatter. Keep the links you want readers to follow. Use `##` and `###` headings. Up to five `###` headings are shown as highlights on the home page.
4. Commit the file. The home page, archive, issue page, sitemap, RSS feed and `/llms.txt` all pick it up. No other file needs editing.

Quote the date so it stays a `YYYY-MM-DD` string. The filename date and the frontmatter date must match. Keep at least one issue file in the folder. Do not put logos of schools, colleges, councils or employers in an issue.

## Environment variables

Copy `.env.example` to `.env.local` for local work. On Vercel, add the same names in the project settings. Do not commit real keys.

| Name | Required to take sign-ups | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Resend API key. Used only to store a contact. The site does not send email. |
| `RESEND_AUDIENCE_ID` | Yes | The Resend **segment** id for the newsletter list. Resend renamed audiences to segments. Create a segment in the Resend dashboard and paste its id here. |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL, with no trailing slash, for canonical links, Open Graph, the sitemap, RSS and `/llms.txt`. Defaults to `https://whatsnextsk9.vercel.app`. Set the real domain before sharing the site. |

If either Resend variable is missing or empty, `POST /api/subscribe` returns a friendly “sign-up isn’t open yet” message and does not call Resend.

The form asks for an email, an optional first name, and an explicit consent tick. A hidden honeypot field catches simple bots. People can unsubscribe later; see the privacy page.

The privacy notice names Frederic Houinato as the data controller. Contact and privacy requests go to houinato@gmail.com. The site does not publish a postal address or a phone number.

## Pages

- `/` — pitch, sign-up, latest issue, what arrives each Friday
- `/issues` — archive
- `/issues/YYYY-MM-DD-slug` — one issue
- `/about` — what the project is
- `/privacy` — UK GDPR and PECR notice
- `/feed.xml` — RSS
- `/llms.txt` — short summary for AI tools
- `/sitemap.xml` and `/robots.txt`

## Deploy

Push the repository to GitHub and import it in Vercel. The framework is detected as Next.js. Leave the build command as `npm run build`. Add the environment variables above, then deploy. No `vercel.json` is required.

Set `NEXT_PUBLIC_SITE_URL` to the production domain and redeploy so the sitemap and feed use that address.
