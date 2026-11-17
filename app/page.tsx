import type { Metadata } from "next";
import Link from "next/link";
import { IssueCard } from "@/components/issue-card";
import { SignupForm } from "@/components/signup-form";
import { getLatestIssue } from "@/lib/issues";
import { alternatesFor, area, pitch, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteName} — Friday notes for families in SK9` },
  description: pitch,
  alternates: alternatesFor("/"),
};

const benefits = [
  {
    title: "Local opportunities",
    text: "Apprenticeships, open days, courses and deadlines within reach of Wilmslow, Handforth, Alderley Edge and Styal.",
  },
  {
    title: "Dates you can circle",
    text: "Application cut-offs and event days, each with a link back to the official page so you can check before you go.",
  },
  {
    title: "A careful AI tip",
    text: "One practical way to use a chatbot for planning or revision, and the rules that keep schoolwork your own.",
  },
];

export default function HomePage() {
  const latest = getLatestIssue();

  return (
    <div className="wrap">
      <section className="hero" aria-labelledby="pitch">
        <div>
          <p className="kicker">Every Friday · SK9, Cheshire</p>
          <h1 id="pitch">{pitch}</h1>
          <p className="lede">
            Independent, and written for parents and teens in {area}. It arrives by email, and stays on this site to
            read again.
          </p>
        </div>
        <SignupForm />
      </section>

      <section className="band" aria-labelledby="latest-heading">
        <div className="section-head">
          <h2 id="latest-heading">The latest note</h2>
          <Link href="/issues">All issues</Link>
        </div>
        {latest ? (
          <IssueCard issue={latest} heading="h3" featured />
        ) : (
          <p className="empty">The first Friday note will appear here.</p>
        )}
      </section>

      <section className="band" aria-labelledby="friday-heading">
        <div className="section-head">
          <h2 id="friday-heading">What you get each Friday</h2>
        </div>
        <div className="benefits">
          {benefits.map((benefit) => (
            <article className="benefit" key={benefit.title}>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
