import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { PrivacyPrinciples } from "@/components/PrivacyPrinciples";

export const metadata: Metadata = {
  title: "Privacy Policy - Convertmyfiles",
  description:
    "Convertmyfiles is a privacy-first file converter. All processing happens in your browser. We don't collect, store, or even see your files. No accounts, no tracking, no servers.",
  alternates: { canonical: siteUrl("privacy") },
  openGraph: {
    title: "Privacy Policy - Convertmyfiles",
    description:
      "Convertmyfiles is a privacy-first file converter. All processing happens in your browser. We don't collect, store, or even see your files.",
    url: siteUrl("privacy"),
    siteName: "Convertmyfiles",
    type: "website",
    locale: "en_US",
    images: [{ url: siteUrl("/og-image.svg"), width: 1200, height: 630, alt: "Convertmyfiles Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@convertmyfiles",
    title: "Privacy Policy - Convertmyfiles",
    description:
      "Convertmyfiles is a privacy-first file converter. All processing happens in your browser. We don't collect, store, or even see your files.",
    images: [siteUrl("/og-image.svg")],
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-12 space-y-3">
          <PrivacyPrinciples.Badge />
          <h1 className="text-3xl sm:text-4xl font-bold text-heading">
            Your privacy is the product
          </h1>
          <p className="text-lg text-body">
            We don&apos;t collect, store, or even see your files.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {PrivacyPrinciples.items.map((p) => (
            <div
              key={p.title}
              className="card-base p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-tertiary">
                {p.icon}
              </div>
              <h3 className="text-sm font-medium text-heading mb-1">{p.title}</h3>
              <p className="text-sm text-body leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <div className="card-base p-6">
          <h2 className="text-base font-semibold text-heading mb-3">In Plain English</h2>
          <div className="space-y-3 text-sm text-body leading-relaxed">
            <p>
              Convertmyfiles runs entirely in your web browser. When you select a file
              to convert, it is read into your browser&apos;s memory, processed using
              client-side technologies, and the result is made available for
              download. At no point is any data transmitted over the network.
            </p>
            <p>
              We do not use cookies, analytics services, or third-party scripts
              that could collect information about you. There are no accounts,
              no logins, and no databases.
            </p>
            <p>
              We believe online tools should be private by default - no fine
              print, no hidden clauses, just a tool that works entirely on your
              terms.
            </p>
            <p className="text-xs pt-3 border-t border-border-default">
              Last updated: June 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
