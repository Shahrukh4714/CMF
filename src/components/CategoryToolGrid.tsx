"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ToolCard } from "./ToolCard";
import { type ToolDefinition } from "@/data/tools";
import { cn } from "@/lib/utils";

interface CategoryToolGridProps {
  tools: ToolDefinition[];
  categoryName: string;
}

export function CategoryToolGrid({ tools, categoryName }: CategoryToolGridProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "popular">("popular");

  const engines = useMemo(() => {
    const set = new Set(tools.map((t) => t.engine));
    return Array.from(set);
  }, [tools]);

  const [activeEngine, setActiveEngine] = useState<string | null>(null);

  const allFormats = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => {
      t.inputFormats.forEach((f) => set.add(f));
      t.outputFormats.forEach((f) => set.add(f));
    });
    return Array.from(set).sort();
  }, [tools]);

  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = tools;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.shortName.toLowerCase().includes(q) ||
          t.inputFormats.some((f) => f.includes(q)) ||
          t.outputFormats.some((f) => f.includes(q))
      );
    }

    if (activeEngine) {
      result = result.filter((t) => t.engine === activeEngine);
    }

    if (activeFormat) {
      result = result.filter((t) => t.inputFormats.includes(activeFormat) || t.outputFormats.includes(activeFormat));
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return result;
  }, [tools, query, activeEngine, activeFormat, sortBy]);

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tools.length} ${categoryName.toLowerCase()} tools...`}
              className="w-full h-10 pl-9 pr-4 rounded-base border border-border-default bg-neutral-tertiary text-sm text-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-body flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Engine:
              </span>
              {engines.map((engine) => (
                <button
                  key={engine}
                  onClick={() => { setActiveEngine(activeEngine === engine ? null : engine); setActiveFormat(null); }}
                  className={cn(
                    "px-3 py-1.5 rounded-[10px] text-xs font-medium border transition-colors",
                    activeEngine === engine
                      ? "border-brand bg-brand-softer text-heading"
                      : "border-border-default text-body hover:border-border-default-strong"
                  )}
                >
                  {engine.charAt(0).toUpperCase() + engine.slice(1)}
                </button>
              ))}
            </div>

            {allFormats.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-body flex items-center gap-1">
                  Format:
                </span>
                {allFormats.slice(0, 10).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => { setActiveFormat(activeFormat === fmt ? null : fmt); setActiveEngine(null); }}
                    className={cn(
                      "px-3 py-1.5 rounded-[10px] text-xs font-medium border transition-colors uppercase",
                      activeFormat === fmt
                        ? "border-brand bg-brand-softer text-heading"
                        : "border-border-default text-body hover:border-border-default-strong"
                    )}
                  >
                    {fmt}
                  </button>
                ))}
                {allFormats.length > 10 && (
                  <span className="text-xs text-body">+{allFormats.length - 10}</span>
                )}
              </div>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 px-3 rounded-base border border-border-default bg-neutral-tertiary text-sm text-heading outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
          >
            <option value="popular">Popular</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <p className="text-sm text-body mb-6">
          Showing {filtered.length} of {tools.length} tools
          {query && <span> for &ldquo;{query}&rdquo;</span>}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-body mb-2">No tools found</p>
            <button
              onClick={() => { setQuery(""); setActiveEngine(null); }}
              className="text-sm text-fg-brand hover:text-fg-brand-strong transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
