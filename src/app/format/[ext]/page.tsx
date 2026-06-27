import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FORMATS, getFormatByExt, getToolsByInputFormat, getToolsByOutputFormat, getToolsByFormat, FORMAT_GROUPS, type FormatDefinition } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FormatQuickConverter } from "@/components/FormatQuickConverter";
import { siteUrl } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ ext: string }>;
}

export function generateStaticParams() {
  return Object.keys(FORMATS).map((ext) => ({ ext }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ext } = await params;
  const fmt = getFormatByExt(ext);
  if (!fmt) return { title: "Format Not Found | Convertmyfiles" };
  return {
    title: `${fmt.fullName} (${fmt.ext.toUpperCase()}) — Format Details | Convertmyfiles`,
    description: `Learn about the ${fmt.fullName} (${fmt.ext.toUpperCase()}) file format. ${fmt.description}. Convert ${fmt.ext.toUpperCase()} online for free — no upload required.`,
    alternates: { canonical: siteUrl(`format/${ext}`) },
    openGraph: {
      title: `${fmt.fullName} (${fmt.ext.toUpperCase()}) — Format Details | Convertmyfiles`,
      description: `Learn about the ${fmt.fullName} (${fmt.ext.toUpperCase()}) file format. ${fmt.description}. Convert ${fmt.ext.toUpperCase()} online for free.`,
      url: siteUrl(`format/${ext}`),
      siteName: "Convertmyfiles",
      type: "article",
      locale: "en_US",
    },
    robots: { index: true, follow: true },
  };
}

function findFormatGroup(ext: string): string | null {
  for (const [group, members] of Object.entries(FORMAT_GROUPS)) {
    if (members.includes(ext)) return group;
  }
  return null;
}

const groupDisplayNames: Record<string, string> = {
  image: "Image", document: "Document & Data", video: "Video",
  audio: "Audio", ebook: "E-book", font: "Font", archive: "Archive", "3d": "3D & CAD",
};

export default async function FormatPage({ params }: Props) {
  const { ext } = await params;
  const fmt = getFormatByExt(ext);
  if (!fmt) notFound();

  const inputTools = getToolsByInputFormat(ext).filter((t) => !t.comingSoon);
  const outputTools = getToolsByOutputFormat(ext).filter((t) => !t.comingSoon);
  const allRelated = getToolsByFormat(ext).filter((t) => !t.comingSoon);
  const group = findFormatGroup(ext);
  const relatedExts = group
    ? (FORMAT_GROUPS[group] || []).filter((e) => e !== ext && FORMATS[e])
    : [];
  const relatedFormats = relatedExts.map((e) => FORMATS[e]).filter(Boolean) as FormatDefinition[];

  return (
    <div className="py-24">
      <div className="mx-auto max-w-[1152px] px-6">
        <Breadcrumbs
          items={[
            { name: "Formats", href: "/formats" },
            { name: fmt.ext.toUpperCase(), href: `/format/${fmt.ext}` },
          ]}
        />

        <FormatQuickConverter />

        <header className="mt-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-lg font-bold text-fg-brand uppercase">{fmt.ext}</span>
            {fmt.popular && (
              <span className="text-[11px] font-medium text-body bg-neutral-tertiary px-2 py-0.5 rounded-sm">
                Popular
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-2">
            {fmt.fullName}
          </h1>
          <p className="text-body max-w-2xl text-sm">{fmt.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {inputTools.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle mb-3">
                  Convert from {fmt.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {inputTools.slice(0, 12).map((t) => (
                    <ToolCard key={t.id} tool={t} compact />
                  ))}
                </div>
                {inputTools.length > 12 && (
                  <Link
                    href={`/tools/${group || ""}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-brand mt-3 hover:text-fg-brand-strong transition-colors"
                  >
                    View all {inputTools.length} conversions <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </section>
            )}

            {outputTools.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle mb-3">
                  Convert to {fmt.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {outputTools.slice(0, 12).map((t) => (
                    <ToolCard key={t.id} tool={t} compact />
                  ))}
                </div>
                {outputTools.length > 12 && (
                  <Link
                    href={`/tools/${group || ""}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-brand mt-3 hover:text-fg-brand-strong transition-colors"
                  >
                    View all {outputTools.length} conversions <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card-base p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-body-subtle mb-3">
                Format Details
              </h3>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-body-subtle">Extension</dt>
                  <dd className="font-mono font-medium text-heading">.{fmt.ext}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-body-subtle">Full Name</dt>
                  <dd className="text-right text-heading max-w-[200px]">{fmt.fullName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-body-subtle">MIME Type</dt>
                  <dd className="font-mono text-xs text-heading text-right max-w-[200px] break-all">{fmt.mime}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-body-subtle">Category</dt>
                  <dd className="text-heading">{group ? (groupDisplayNames[group] || group) : "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-body-subtle">Tools</dt>
                  <dd className="text-heading">{allRelated.length} {allRelated.length === 1 ? "tool" : "tools"}</dd>
                </div>
              </dl>
            </div>

            {relatedFormats.length > 0 && (
              <div className="card-base p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-body-subtle mb-3">
                  Related {group ? groupDisplayNames[group] || group : ""} Formats
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedFormats.slice(0, 16).map((rf) => (
                    <Link
                      key={rf.ext}
                      href={`/format/${rf.ext}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border-default px-2.5 py-1.5 text-xs font-mono font-medium text-fg-brand hover:border-border-brand-light hover:bg-brand-softer transition-colors"
                    >
                      {rf.ext.toUpperCase()}
                      <span className="font-sans text-[10px] text-body font-normal">{rf.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {allRelated.length === 0 && !fmt.popular && (
          <section className="text-center py-12 border-t border-border-default">
            <h2 className="text-lg font-bold text-heading mb-2">
              No conversion tools yet for {fmt.ext.toUpperCase()}
            </h2>
            <p className="text-sm text-body mb-4">
              We&apos;re working on adding support for this format. Check back soon.
            </p>
            <Link
              href="/formats"
              className="inline-flex items-center gap-2 text-sm font-medium text-fg-brand hover:text-fg-brand-strong transition-colors"
            >
              Browse all formats <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
