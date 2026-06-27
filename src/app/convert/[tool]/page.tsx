import { notFound } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getTool, getCategoryById, getRelatedTools, getAllTools, getToolsByCategory, CATEGORY_URLS } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConverterInfo } from "@/components/ConverterInfo";
import { ConverterFAQ } from "@/components/ConverterFAQ";
import { CategoryBadge } from "@/components/CategoryBadge";
import { TrackToolVisit } from "@/components/TrackToolVisit";
import { FormatNavigation } from "@/components/FormatNavigation";
import { ConverterErrorBoundary } from "@/components/ConverterErrorBoundary";
import { generateToolJsonLd, generateToolMetadata, generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ tool: string }>;
}

const BatchConverterUILazy = dynamic(
  () => import("@/components/BatchConverterUI").then((m) => ({ default: m.BatchConverterUI })),
  {
    loading: () => (
      <div className="rounded-base border border-border-default bg-neutral-primary-soft p-6">
        <div className="space-y-4">
          <div className="h-32 w-full rounded-base bg-neutral-tertiary" />
          <div className="h-12 w-full rounded-base bg-neutral-tertiary" />
        </div>
      </div>
    ),
  }
);

export function generateStaticParams() {
  return getAllTools().filter((t) => !t.comingSoon).map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "Tool Not Found | Convertmyfiles" };
  return generateToolMetadata(tool);
}

export default async function ConverterPage({ params }: Props) {
  const { tool: slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  const category = getCategoryById(tool.categoryId);
  const related = getRelatedTools(tool, 6);
  const categoryUrlSlug = CATEGORY_URLS[tool.categoryId] || tool.categoryId;
  const categoryTools = getToolsByCategory(tool.categoryId);
  const toolJsonLd = generateToolJsonLd(tool);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Tools", url: "/tools" },
    { name: category?.name || "Tools", url: `/tools/${categoryUrlSlug}` },
    { name: tool.name, url: `/convert/${tool.slug}` },
  ]);
  const faqJsonLd = tool.faq.length > 0 ? generateFAQJsonLd(tool.faq) : null;
  const content = tool.content;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <TrackToolVisit slug={tool.slug} />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-3 pb-6">
        <Breadcrumbs
          items={[
            { name: "Tools", href: "/tools" },
            { name: category?.name || "Tools", href: `/tools/${categoryUrlSlug}` },
            { name: tool.name, href: `/convert/${tool.slug}` },
          ]}
        />

        <div className="flex gap-6">
          <aside className="w-[220px] shrink-0 hidden lg:block">
            <div className="space-y-0.5 sticky top-20">
              <p className="text-xs font-semibold uppercase tracking-widest text-body-subtle mb-2 px-2">
                {category?.name || "Tools"}
              </p>
              {categoryTools.slice(0, 40).map((ct) => {
                const isActive = ct.slug === tool.slug;
                return (
                  <Link
                    key={ct.slug}
                    href={`/convert/${ct.slug}`}
                    className={`block px-2 py-1.5 text-xs rounded-[10px] transition-colors no-underline ${
                      isActive
                        ? "bg-brand-softer text-heading font-medium"
                        : "text-body hover:text-heading hover:bg-neutral-secondary-medium"
                    }`}
                  >
                    <span className="font-mono">{ct.inputFormats[0].toUpperCase()} → {ct.outputFormats[0].toUpperCase()}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          <div className="flex-1 min-w-0 max-w-3xl">
            <header className="mb-4 space-y-2">
              {category && <CategoryBadge iconId={category.icon} name={category.name} />}
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-heading">
                {content.h1}
              </h1>
              <p className="text-sm sm:text-base text-body">{tool.description}</p>
            </header>

            <section aria-label="Converter" className="mb-6">
              <ConverterErrorBoundary>
                <BatchConverterUILazy tool={tool} />
              </ConverterErrorBoundary>
            </section>

            {related.length > 0 && (
              <section aria-label="Related tools" className="py-8 border-t border-border-default">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle mb-4">Related Tools</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {related.map((t) => (
                    <ToolCard key={t.id} tool={t} />
                  ))}
                </div>
              </section>
            )}

            <section aria-label="Information about this tool" className="border-t border-border-default">
              <ConverterInfo tool={tool} />
            </section>

            <section aria-label="Frequently asked questions">
              <ConverterFAQ tool={tool} />
            </section>

            <FormatNavigation tool={tool} />
          </div>
        </div>
      </div>
    </div>
  );
}
