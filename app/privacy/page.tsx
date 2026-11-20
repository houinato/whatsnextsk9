import type { Metadata } from "next";
import Link from "next/link";
import { alternatesFor, owner, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${siteName} handles your email address under UK GDPR and PECR, and how to unsubscribe.`,
  alternates: alternatesFor("/privacy"),
  openGraph: {
    title: `Privacy notice · ${siteName}`,
    description: "What the Friday newsletter collects, why, and how to unsubscribe.",
    url: "/privacy",
  },
};

function ContactEmail() {
  return <a href={`mailto:${owner.contactEmail}`}>{owner.contactEmail}</a>;
}

export default function PrivacyPage() {
  return (
    <div className="wrap prose">
      <header className="page-intro">
        <p className="kicker">Privacy</p>
        <h1>Privacy notice</h1>
        <p>Last updated: 20 November 2026.</p>
        <p>
          This notice explains what {siteName} collects when you sign up for the Friday email, why, and how to stop
          it. It is written for the UK GDPR and the Privacy and Electronic Communications Regulations (PECR).
        </p>
      </header>

      <h2>Who is responsible</h2>
      <p>The data controller is {owner.name}.</p>
      <p>
        Contact for privacy requests: <ContactEmail />
      </p>

      <h2>What we collect</h2>
      <p>When you sign up on this website we collect:</p>
      <ul>
        <li>your email address, so we can send the newsletter;</li>
        <li>your first name, if you choose to give it, so a greeting can use it;</li>
        <li>
          the fact that you ticked the consent box. Our email provider stores that contact record, including when it
          was created.
        </li>
      </ul>
      <p>
        We do not ask for your age, school, address or CV. Please do not put those in the name field.
      </p>
      <p>
        The form includes a hidden field that people are not meant to fill in. It is there to catch automated spam. If
        it is filled in, the submission is ignored and nothing is stored.
      </p>

      <h2>Why we collect it</h2>
      <p>
        We use your email address, and your first name if you gave one, only to send you {siteName} and to manage that
        subscription — including stopping it when you unsubscribe.
      </p>
      <ul>
        <li>
          <strong>UK GDPR.</strong> The lawful basis is your consent (Article 6(1)(a)).
        </li>
        <li>
          <strong>PECR.</strong> The newsletter is an email you did not ask for until you opted in, so we only send it
          after you tick the box. You can withdraw consent at any time.
        </li>
      </ul>
      <p>
        We do not use your details to build advertising profiles. We do not sell them, and we do not share them with
        schools, colleges, councils or employers.
      </p>
      <p>
        This website does not send the newsletter itself. The sign-up form only adds your contact to a list. Email is
        sent later, from that list, once the owner has switched sending on.
      </p>

      <h2>Who processes it</h2>
      <p>
        Contacts are stored with Resend, which will also deliver the email once sending is switched on. Resend&apos;s
        privacy notice is at{" "}
        <a href="https://resend.com/legal/privacy-policy">resend.com/legal/privacy-policy</a>.
      </p>
      <p>
        The site is hosted on Vercel. A normal request log may briefly include your IP address.
      </p>
      <p>
        Resend stores data in the United States. Its privacy notice describes how that data is handled.
      </p>
      <p>
        This site does not currently use analytics or advertising cookies. If another tool is added later, it will be
        listed here before it is switched on.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your contact details for as long as you stay subscribed. If you unsubscribe, we stop sending the
        newsletter and keep the email address only so it is not added again by mistake. Email <ContactEmail /> if you
        want that record deleted.
      </p>

      <h2>How to unsubscribe</h2>
      <p>
        Every newsletter email includes an unsubscribe link. You can also email <ContactEmail /> and ask to be
        removed. We will treat that as withdrawing consent.
      </p>

      <h2>Your rights</h2>
      <p>Under the UK GDPR you can ask to:</p>
      <ul>
        <li>see the personal data we hold about you;</li>
        <li>correct it;</li>
        <li>delete it;</li>
        <li>restrict how we use it;</li>
        <li>receive a copy in a portable format, where that right applies;</li>
        <li>withdraw consent. Withdrawal does not affect emails already sent lawfully.</li>
      </ul>
      <p>We will respond within one month. We may need to check it is you who is asking.</p>
      <p>
        You can complain to the Information Commissioner&apos;s Office:{" "}
        <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</a> or 0303 123 1113.
      </p>

      <h2>Cookies</h2>
      <p>
        This website does not set a tracking cookie for the sign-up form. It does not use advertising cookies. If
        analytics are added later, and the cookies are not strictly necessary, we will ask before setting them and
        update this page.
      </p>

      <h2>Children</h2>
      <p>
        The newsletter is written for parents and for teenagers. Please only sign up if you are able to consent to
        receiving the email. If you are under 13, ask a parent or guardian to sign up instead.
      </p>

      <h2>Changes</h2>
      <p>
        If the way we handle data changes, this page will be updated and the date at the top will change. The{" "}
        <Link href="/about">about page</Link> explains what the newsletter is for.
      </p>
    </div>
  );
}
