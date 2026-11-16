import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, alternatesFor, getSiteUrl, pitch, siteName } from "@/lib/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const viewport: Viewport = {
  themeColor: "#f3eee4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteName} — Friday notes for families in SK9`,
    template: `%s · ${siteName}`,
  },
  description: pitch,
  applicationName: siteName,
  authors: [{ name: siteName, url: "/" }],
  creator: siteName,
  publisher: siteName,
  category: "education",
  alternates: alternatesFor("/"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName,
    title: `${siteName} — Friday notes for families in SK9`,
    description: pitch,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Friday notes for families in SK9`,
    description: pitch,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const url = getSiteUrl();
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: siteName,
        url,
        description: pitch,
        inLanguage: "en-GB",
        publisher: { "@id": `${url}/#organisation` },
      },
      {
        "@type": "Blog",
        "@id": `${url}/#blog`,
        name: siteName,
        url: absoluteUrl("/issues"),
        description: pitch,
        inLanguage: "en-GB",
        publisher: { "@id": `${url}/#organisation` },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organisation`,
        name: siteName,
        url,
        description:
          "Independent Friday newsletter for parents and teens in Wilmslow, Handforth, Alderley Edge and Styal.",
      },
    ],
  };

  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
        <JsonLd data={graph} />
      </body>
    </html>
  );
}
