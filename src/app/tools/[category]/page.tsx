import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryByUrlSlug,
  getCategoryTools,
  getCategoryPopularTools,
  getCategoryStats,
  URL_TO_CATEGORY,
} from "@/data/tools";
import { CategoryHero } from "@/components/CategoryHero";
import { CategoryToolGrid } from "@/components/CategoryToolGrid";
import { CategoryFAQ } from "@/components/CategoryFAQ";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { generateCategoryMetadata, generateCategoryJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return Object.keys(URL_TO_CATEGORY).map((urlSlug) => ({ category: urlSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: urlSlug } = await params;
  const category = getCategoryByUrlSlug(urlSlug);
  if (!category) return { title: "Category Not Found" };
  return generateCategoryMetadata(category, urlSlug);
}

export default async function CategoryPage({ params }: Props) {
  const { category: urlSlug } = await params;
  const category = getCategoryByUrlSlug(urlSlug);

  if (!category) notFound();

  const tools = getCategoryTools(category.id);
  const popularTools = getCategoryPopularTools(category.id, 6);
  const stats = getCategoryStats(category.id);
  const uniqueFormats = [...new Set(tools.flatMap((t) => [...t.inputFormats, ...t.outputFormats]))].sort();

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateCategoryJsonLd(category, stats.total, urlSlug)),
        }}
      />

      <div className="mx-auto max-w-[1152px] px-6 pt-6">
        <Breadcrumbs
          items={[
            { name: "Tools", href: "/tools" },
            { name: category.name, href: `/tools/${urlSlug}` },
          ]}
        />
      </div>

      <CategoryHero
        category={category}
        toolCount={stats.total}
        formatCount={stats.formats}
        formats={uniqueFormats}
      />

      <CategoryToolGrid tools={tools} categoryName={category.name} />

      {popularTools.length > 0 && (
        <section className="py-24 bg-neutral-primary-soft">
          <div className="mx-auto max-w-[1152px] px-6">
            <h2 className="text-2xl font-bold text-heading mb-6 text-center">
              Popular {category.name} Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {popularTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CategoryFAQ category={category} />
    </div>
  );
}
