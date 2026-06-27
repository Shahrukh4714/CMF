import type { Metadata } from "next";
import Link from "next/link";
import { FORMATS, FORMAT_GROUPS } from "@/data/tools";
import { siteUrl } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { FormatQuickConverter } from "@/components/FormatQuickConverter";

export const metadata: Metadata = {
  title: "Format Catalog — All Supported File Formats | Convertmyfiles",
  description:
    "Browse all 70+ file formats supported by Convertmyfiles. Convert documents, images, video, audio, ebooks, fonts, archives, and 3D files — free and private.",
  alternates: { canonical: siteUrl("formats") },
  openGraph: {
    title: "Format Catalog — All Supported File Formats | Convertmyfiles",
    description:
      "Browse all 70+ file formats supported by Convertmyfiles. Convert documents, images, video, audio, ebooks, fonts, archives, and 3D files — free and private.",
    url: siteUrl("formats"),
    siteName: "Convertmyfiles",
    type: "website",
    locale: "en_US",
    images: [{ url: siteUrl("/og-image.svg"), width: 1200, height: 630, alt: "Convertmyfiles - Free Online Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@convertmyfiles",
    title: "Format Catalog — All Supported File Formats | Convertmyfiles",
    description:
      "Browse all 70+ file formats supported by Convertmyfiles. Convert documents, images, video, audio, ebooks, fonts, archives, and 3D files — free and private.",
    images: [siteUrl("/og-image.svg")],
  },
  robots: { index: true, follow: true },
};

const groupNames: Record<string, string> = {
  image: "Images",
  document: "Documents & Data",
  video: "Video",
  audio: "Audio",
  ebook: "E-books",
  font: "Fonts",
  archive: "Archives",
  "3d": "3D & CAD",
};

const groupDescriptions: Record<string, string> = {
  image: "Raster and vector image formats",
  document: "Office documents, PDFs, text, and data files",
  video: "Digital video containers and codecs",
  audio: "Compressed and lossless audio formats",
  ebook: "E-book and digital publishing formats",
  font: "Web and desktop font files",
  archive: "Compressed archive and package formats",
  "3d": "3D model and CAD exchange formats",
};

export default function FormatsPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-[1152px] px-6">
        <header className="mb-12 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-heading">
            Format Catalog
          </h1>
          <p className="text-body max-w-2xl mx-auto text-sm">
            Convertmyfiles supports <strong className="text-heading">{Object.keys(FORMATS).length}+ file formats</strong> across document, image, video, audio, ebook, font, archive, and 3D categories. Every conversion runs in your browser or through our secure API — no uploads to external servers.
          </p>
        </header>

        <FormatQuickConverter />

        <div className="space-y-16">
          {Object.entries(FORMAT_GROUPS).map(([groupId, exts]) => {
            const formats = exts.map((e) => FORMATS[e]).filter(Boolean);
            if (formats.length === 0) return null;
            return (
              <section key={groupId} id={groupId}>
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-heading">
                    {groupNames[groupId] || groupId}
                  </h2>
                  <span className="text-xs font-medium text-body bg-neutral-tertiary px-2.5 py-1 rounded-full">
                    {formats.length} {formats.length === 1 ? "format" : "formats"}
                  </span>
                  <p className="text-sm text-body-subtle hidden sm:block ml-2">
                    {groupDescriptions[groupId] || ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {formats.map((f) => (
                    <Link
                      key={f.ext}
                      href={`/format/${f.ext}`}
                      className="card-interactive group inline-flex items-center gap-2 px-3.5 py-2.5 no-underline"
                    >
                      <span className="font-mono text-xs font-semibold text-fg-brand uppercase">
                        {f.ext}
                      </span>
                      <span className="text-sm text-body group-hover:text-heading transition-colors">{f.name}</span>
                      {f.popular && (
                        <span className="text-[10px] font-medium text-success bg-success-soft px-1.5 py-0.5 rounded-sm">
                          Popular
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-20 pt-12 border-t border-border-default text-center">
          <h2 className="text-lg font-bold text-heading mb-2">
            Can&apos;t find what you need?
          </h2>
          <p className="text-sm text-body mb-6 max-w-md mx-auto">
            We&apos;re adding new formats regularly. Browse all conversion tools or request a format.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-fg-brand hover:text-fg-brand-strong transition-colors"
          >
            Browse all tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
