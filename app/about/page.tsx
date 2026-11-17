import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/placeholder";
import { alternatesFor, area, owner, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${siteName} is an independent Friday newsletter for parents and teens in ${area}. It is not a school, council or college site.`,
  alternates: alternatesFor("/about"),
  openGraph: {
    title: `About · ${siteName}`,
    description: `What ${siteName} is, who it is for, and what it is not.`,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="wrap prose">
      <header className="page-intro">
        <p className="kicker">About</p>
        <h1>A Friday note for SK9 families</h1>
        <p>
          {siteName} is a short, independent newsletter and website for parents and teenagers in {area} — the SK9
          postcode, in Cheshire.
        </p>
      </header>

      <h2>What arrives each Friday</h2>
      <ul>
        <li>Local opportunities: apprenticeships, open days, courses and deadlines nearby.</li>
        <li>Dates worth putting in the diary, with a link to the page that owns them.</li>
        <li>One practical, cautious way to use AI for revision, planning or an application.</li>
      </ul>
      <p>
        It is written in plain language. The links go to the official page, so you can check the detail and apply
        there. Dates and vacancies change. Please re-check before you travel or apply.
      </p>

      <h2>Independent, on purpose</h2>
      <p>
        {siteName} is not affiliated with Wilmslow High School, Cheshire East Council, or any college, university or
        employer. It is not official careers advice, and it is not a school communication.
      </p>
      <p>
        Schools, colleges and employers are named only when a date, vacancy or event is being described. Their logos
        and brands are not used.
      </p>
      <p>
        For impartial careers guidance, start with the{" "}
        <a href="https://nationalcareers.service.gov.uk/">National Careers Service</a> or the careers team at your
        school or college.
      </p>

      <h2>How a new issue is published</h2>
      <p>
        A person is responsible for what is published. An AI agent helps prepare the weekly issue from official pages.
        The note goes on the site when a Markdown file is added. Nothing is sent by email unless you have asked for it
        on the <Link href="/#signup">sign-up form</Link>.
      </p>

      <h2>What this site does not do</h2>
      <ul>
        <li>It does not take applications for you.</li>
        <li>It does not ask for school records, dates of birth or CVs.</li>
        <li>It does not sell your details, or pass them to a school, college, council or employer.</li>
      </ul>

      <h2 id="contact">Get in touch</h2>
      <p>
        Suggestions for the Friday list, corrections, and unsubscribe requests can all come to the same address:{" "}
        <Placeholder>{owner.contactEmail}</Placeholder>
      </p>
      <p>
        Read the <Link href="/privacy">privacy notice</Link> for what the sign-up form stores, and how to ask for your
        details to be removed.
      </p>
    </div>
  );
}
