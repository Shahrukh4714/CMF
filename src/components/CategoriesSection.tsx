import Link from "next/link";
import { getPopularTools } from "@/data/tools";

const popularTools = getPopularTools().slice(0, 12);

export function CategoriesSection() {
  return (
    <section>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/convert/${tool.slug}`}
              className="flex flex-col items-center text-center gap-3 rounded-base border border-border-default bg-neutral-primary-soft p-5 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-border-default-strong no-underline"
            >
              <div className="w-12 h-12 rounded-base bg-brand-softer flex items-center justify-center">
                <span className="text-fg-brand text-sm font-semibold">{tool.inputFormats[0].toUpperCase()}</span>
              </div>
              <span className="text-[15px] font-semibold text-heading">
                {tool.inputFormats[0].toUpperCase()} → {tool.outputFormats[0].toUpperCase()}
              </span>
              <span className="text-sm text-body line-clamp-2">
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
