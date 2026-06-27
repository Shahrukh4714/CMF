import type { Metadata } from "next";
import { ToolCard } from "@/components/ToolCard";
import { CATEGORIES, getToolsByCategory } from "@/data/tools";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Tools - Free Online Converter | Convertmyfiles",
  description:
    "Browse all available conversion tools. Convert images, documents, video, and audio - all in your browser, no upload required.",
  alternates: { canonical: siteUrl("tools") },
  openGraph: {
    title: "All Tools - Free Online Converter | Convertmyfiles",
    description:
      "Browse all available conversion tools. Convert images, documents, video, and audio - all in your browser, no upload required.",
    url: siteUrl("tools"),
    siteName: "Convertmyfiles",
    type: "website",
    locale: "en_US",
    images: [{ url: siteUrl("/og-image.svg"), width: 1200, height: 630, alt: "Convertmyfiles - Free Online Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@convertmyfiles",
    title: "All Tools - Free Online Converter | Convertmyfiles",
    description:
      "Browse all available conversion tools. Convert images, documents, video, and audio - all in your browser, no upload required.",
    images: [siteUrl("/og-image.svg")],
  },
  robots: { index: true, follow: true },
};

export default function ToolsPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-[1152px] px-6">
        <header className="mb-12 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-heading">
            All Tools
          </h1>
          <p className="text-body">
            Everything you need to convert your files - all in your browser
          </p>
        </header>

        <div className="space-y-16">
          {CATEGORIES.map((category) => {
            const catTools = getToolsByCategory(category.id);
            if (catTools.length === 0) return null;
            return (
              <section key={category.id} id={category.slug}>
                <h2 className="text-xl font-bold text-heading mb-4">{category.name}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
