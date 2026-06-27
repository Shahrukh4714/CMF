"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getTool } from "@/data/tools";
import type { ToolDefinition } from "@/data/tools";

const STORAGE_KEY = "convertit_recent_tools";

export function RecentlyUsedTools() {
  const [recent, setRecent] = useState<ToolDefinition[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const slugs: string[] = JSON.parse(stored);
      const tools = slugs
        .map((slug) => getTool(slug))
        .filter(Boolean) as ToolDefinition[];
      if (tools.length > 0) setRecent(tools);
    } catch {
      // ignore
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-body" />
            <h2 className="text-xl font-semibold tracking-tight text-heading">Recently used</h2>
          </div>
          <Link
            href="/tools"
            className="text-sm text-fg-brand hover:text-fg-brand-strong transition-colors flex items-center gap-1 no-underline"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {recent.slice(0, 8).map((tool) => (
            <Link
              key={tool.slug}
              href={`/convert/${tool.slug}`}
              className="shrink-0 flex items-center gap-3 rounded-base border border-border-default bg-neutral-primary-soft px-4 py-3 text-sm transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-border-default-strong no-underline"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-base bg-brand-softer text-xs font-semibold text-fg-brand">
                {tool.inputFormat.ext.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-heading truncate max-w-[140px]">{tool.shortName || tool.name}</p>
                <p className="text-xs text-body truncate max-w-[140px]">{tool.categoryId}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
