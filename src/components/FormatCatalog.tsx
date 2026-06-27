import Link from "next/link";
import { CATEGORIES, CATEGORY_URLS, getCategoryStats } from "@/data/tools";

const categoryIcons: Record<string, string> = {
  image: "I",
  document: "D",
  video: "V",
  audio: "A",
  other: "T",
};

export function FormatCatalog() {
  return (
    <div>
      <div className="text-center mb-10 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-body">
          Format catalog
        </p>
        <p className="text-sm text-body">
          Convertmyfiles handles formats across multiple categories.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => {
          const stats = getCategoryStats(cat.id);
          return (
            <Link
              key={cat.id}
              href={`/tools/${CATEGORY_URLS[cat.id]}`}
              className="flex items-center gap-3 rounded-base border border-border-default bg-neutral-primary-soft p-4 transition-all hover:border-border-brand hover:shadow-[0_2px_12px_rgba(255,108,0,0.1)] group no-underline"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-softer text-sm font-semibold text-fg-brand group-hover:bg-brand group-hover:text-white transition-colors">
                {categoryIcons[cat.id] || "T"}
              </div>
              <div>
                <p className="text-sm font-medium text-heading">{cat.name}</p>
                <p className="text-xs text-body">{stats.formats} formats</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
