import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolCard } from "./ToolCard";
import { CATEGORIES, getPopularTools, getToolsByCategory } from "@/data/tools";

export function ToolGrid() {
  const popularTools = getPopularTools(6);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-heading">
            Popular Conversions
          </h2>
          <p className="text-sm text-body">
            The tools our users reach for most
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <div className="space-y-12">
          {CATEGORIES.map((category) => {
            const catTools = getToolsByCategory(category.id);
            if (catTools.length === 0) return null;
            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold tracking-tight text-heading">
                    {category.name}
                  </h3>
                  <Link
                    href="/tools"
                    className="text-sm text-body hover:text-heading transition-colors inline-flex items-center gap-1 no-underline"
                  >
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {catTools.slice(0, 6).map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
