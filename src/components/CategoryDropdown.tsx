"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { CATEGORIES, CATEGORY_URLS } from "@/data/tools";

const categoryIcons: Record<string, string> = {
  image: "I",
  document: "D",
  video: "V",
  audio: "A",
  other: "T",
};

export function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = "category-menu";
  const buttonId = "category-button";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        (ref.current?.querySelector(`#${buttonId}`) as HTMLElement)?.focus();
      }
    },
    []
  );

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        id={buttonId}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="flex items-center gap-1.5 h-9 px-3 rounded-base text-sm text-body hover:text-heading hover:bg-neutral-secondary-medium transition-colors"
      >
        Categories
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={buttonId}
          className="absolute top-full mt-2 left-0 w-56 rounded-base border border-border-default bg-neutral-primary-soft p-2 z-50"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/tools/${CATEGORY_URLS[cat.id]}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-heading hover:bg-neutral-secondary-medium transition-colors no-underline"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-brand-softer text-xs font-semibold text-fg-brand">
                {categoryIcons[cat.id]}
              </div>
              <div>
                <span className="font-medium">{cat.name}</span>
                <p className="text-xs text-body">{cat.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
