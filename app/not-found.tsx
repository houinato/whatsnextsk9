import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="wrap page-intro">
      <p className="kicker">404</p>
      <h1>That page isn&apos;t here</h1>
      <p>The link may be out of date. The Friday notes are still on the issues page.</p>
      <p>
        <Link className="text-link" href="/">
          Back to the home page
        </Link>
        {" · "}
        <Link className="text-link" href="/issues">
          Browse issues
        </Link>
      </p>
    </div>
  );
}
