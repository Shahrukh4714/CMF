"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolDefinition } from "@/data/tools";

interface ConverterFAQProps {
  tool: ToolDefinition;
}

export function ConverterFAQ({ tool }: ConverterFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = tool.faq;

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border-default">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle">
              Frequently asked questions
            </h2>
            <p className="text-sm text-body">
              Everything you need to know about {tool.name.toLowerCase()}
            </p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-base border border-border-default overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-heading transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-body transition-transform",
                      openIndex === i && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all",
                    openIndex === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-body leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
