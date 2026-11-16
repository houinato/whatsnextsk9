import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteName } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="wordmark">
          <span className="mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <rect width="32" height="32" rx="8" fill="#8d3b16" />
              <path d="M8 9.5h16v12.2a1.3 1.3 0 0 1-1.3 1.3H9.3A1.3 1.3 0 0 1 8 21.7V9.5z" fill="#fffdf8" />
              <path d="M18.2 9.5H24v5.2h-5a.8.8 0 0 1-.8-.8V9.5z" fill="#f6e2b8" />
              <path d="M11 16.6h8.2M11 19.6h5.6" stroke="#8d3b16" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="wordmark-text">
            <span className="wordmark-name">{siteName.replace(" SK9", "")}</span>
            <span className="wordmark-place">SK9</span>
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
