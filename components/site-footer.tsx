import Link from "next/link";
import { area, independenceNote } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="disclaimer">
          <strong>Independent. </strong>
          {independenceNote}
        </p>
        <div className="footer-row">
          <nav aria-label="Footer">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/issues">Issues</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <a href="/feed.xml">RSS</a>
              </li>
              <li>
                <Link href="/#signup">Get Friday&apos;s note</Link>
              </li>
            </ul>
          </nav>
          <p className="footer-place">For families in {area}.</p>
        </div>
      </div>
    </footer>
  );
}
