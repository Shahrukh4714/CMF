import { getToolsByInputFormat, getToolsByOutputFormat, getFormatByExt, getCategoryById, CATEGORY_URLS } from "@/data/tools";
import type { ToolDefinition } from "@/data/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolCard } from "./ToolCard";

interface FormatNavigationProps {
  tool: ToolDefinition;
}

export function FormatNavigation({ tool }: FormatNavigationProps) {
  const { inputFormats, outputFormats, inputFormat, outputFormat } = tool;
  const inputExt = inputFormat.ext;
  const outputExt = outputFormat?.ext || outputFormats[0];

  const sameInput = getToolsByInputFormat(inputExt).filter((t) => t.slug !== tool.slug && !t.comingSoon);
  const sameOutput = getToolsByOutputFormat(outputExt).filter((t) => t.slug !== tool.slug && !t.comingSoon);
  const complementary = getToolsByInputFormat(outputExt).filter((t) => t.slug !== tool.slug && !t.comingSoon);
  const reverseTools = getToolsByOutputFormat(inputExt).filter((t) => t.slug !== tool.slug && !t.comingSoon);

  if (sameInput.length === 0 && sameOutput.length === 0 && complementary.length === 0 && reverseTools.length === 0) {
    return null;
  }

  const inputCat = getCategoryById(tool.categoryId);
  const catSlug = inputCat ? CATEGORY_URLS[tool.categoryId] : "";

  return (
    <section className="py-12 sm:py-16 border-t border-border-default">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle mb-6 text-center">
          Explore related conversions
        </h2>

        <div className="space-y-8">
          {reverseTools.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-body-subtle mb-3">Reverse</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {reverseTools.slice(0, 4).map((t) => (
                  <ToolCard key={t.slug} tool={t} compact />
                ))}
              </div>
            </div>
          )}

          {complementary.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-body-subtle mb-3">
                Convert {outputFormat?.name || outputExt.toUpperCase()} further
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {complementary.slice(0, 4).map((t) => (
                  <ToolCard key={t.slug} tool={t} compact />
                ))}
              </div>
            </div>
          )}

          {sameInput.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-body-subtle mb-3">
                Convert from {inputFormat.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {sameInput.slice(0, 4).map((t) => (
                  <ToolCard key={t.slug} tool={t} compact />
                ))}
              </div>
            </div>
          )}

          {sameOutput.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-body-subtle mb-3">
                Convert to {outputFormat?.name || outputExt.toUpperCase()}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {sameOutput.slice(0, 4).map((t) => (
                  <ToolCard key={t.slug} tool={t} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {catSlug && (
          <div className="text-center mt-8">
            <Link
              href={`/tools/${catSlug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-fg-brand hover:text-fg-brand-strong transition-colors no-underline"
            >
              Browse all {inputCat?.name || ""} tools <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
