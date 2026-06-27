"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllTools, getTool, type ToolDefinition } from "@/data/tools";

const RECENT_KEY = "convertit_recent_tools";

interface SearchBarProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SearchBar({ isModal, isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolDefinition[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentTools, setRecentTools] = useState<ToolDefinition[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const listboxId = "search-results";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (!stored) return;
      const slugs: string[] = JSON.parse(stored).slice(0, 5);
      const tools = slugs.map((s) => getTool(s)).filter(Boolean) as ToolDefinition[];
      setRecentTools(tools);
    } catch {
      // ignore
    }
  }, [open]);

  useEffect(() => {
    // If not in modal mode, trigger focus/open on Ctrl+K
    if (!isModal) {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          inputRef.current?.focus();
          setOpen(true);
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [isModal]);

  useEffect(() => {
    if (!isModal) {
      const handler = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [isModal]);

  useEffect(() => {
    if (isModal) {
      setOpen(!!isOpen);
      if (isOpen) {
        setQuery("");
        setResults([]);
        setActiveIndex(-1);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  }, [isModal, isOpen]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setActiveIndex(-1);
      if (value.length < 1) {
        setResults([]);
        setOpen(isModal ? true : false);
        return;
      }
      const all = getAllTools();
      const q = value.toLowerCase();
      const filtered = all.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.slug.includes(q) ||
          t.inputFormats.some((f) => f.includes(q)) ||
          t.outputFormats.some((f) => f.includes(q))
      );
      setResults(filtered.slice(0, 8));
      setOpen(true);
    },
    [isModal]
  );

  const handleSelect = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/convert/${slug}`);
      if (onClose) onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const activeResults = query ? results : recentTools;
      if (!open || activeResults.length === 0) {
        if (e.key === "Escape" && isModal && onClose) {
          onClose();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < activeResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : activeResults.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const index = activeIndex >= 0 ? activeIndex : 0;
        if (activeResults[index]) {
          handleSelect(activeResults[index].slug);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
        if (onClose) onClose();
      }
    },
    [open, results, recentTools, query, activeIndex, handleSelect, isModal, onClose]
  );

  const showRecent = !query && open && recentTools.length > 0;

  if (isModal && !isOpen) return null;

  if (isModal) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        />

        {/* Modal Search Container */}
        <div className="relative w-full max-w-[520px] bg-neutral-primary-soft border border-border-default rounded-base shadow-xl overflow-hidden z-10 flex flex-col">
          {/* Header Input bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
            <Search className="h-4.5 w-4.5 text-body-subtle shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tools..."
              className="flex-1 bg-transparent text-sm text-heading placeholder:text-body-subtle outline-none border-none"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                aria-label="Clear search"
                className="p-1 rounded-[10px] hover:bg-neutral-quaternary text-body"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <span className="font-mono text-[9px] text-body-subtle px-1.5 py-0.5 rounded border border-border-default bg-neutral-tertiary shrink-0">
              ESC
            </span>
          </div>

          {/* Results list */}
          <div className="max-h-[350px] overflow-y-auto p-1">
            {showRecent && (
              <div>
                <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-body-subtle">
                  <Clock className="h-3.5 w-3.5" />
                  Recently used
                </div>
                {recentTools.map((tool, idx) => (
                  <button
                    key={tool.slug}
                    onClick={() => handleSelect(tool.slug)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-sm transition-colors ${
                      idx === activeIndex
                        ? "bg-brand-softer text-heading"
                        : "text-heading hover:bg-neutral-secondary-medium"
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-brand-softer text-[10px] font-semibold text-fg-brand">
                      {tool.inputFormat.ext.toUpperCase()}
                    </div>
                    <span className="flex-1 min-w-0">
                      <span className="font-medium">{tool.shortName || tool.name}</span>
                      <span className="ml-2 text-xs text-body">{tool.categoryId}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-body" />
                  </button>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div id={listboxId} role="listbox" aria-label="Search results" className="p-1">
                {results.map((tool, idx) => (
                  <button
                    key={tool.id}
                    id={`result-${idx}`}
                    role="option"
                    aria-selected={idx === activeIndex}
                    onClick={() => handleSelect(tool.slug)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-sm transition-colors ${
                      idx === activeIndex
                        ? "bg-brand-softer text-heading"
                        : "text-heading hover:bg-neutral-secondary-medium"
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-brand-softer text-[10px] font-semibold text-fg-brand">
                      {tool.inputFormat.ext.toUpperCase()}
                    </div>
                    <span className="flex-1 min-w-0">
                      <span className="font-medium">{tool.shortName || tool.name}</span>
                      <span className="ml-2 text-xs text-body">{tool.categoryId}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-body" />
                  </button>
                ))}
              </div>
            )}

            {!showRecent && results.length === 0 && query.length >= 1 && (
              <div className="px-4 py-6 text-center text-sm text-body">
                No tools found for &quot;{query}&quot;
              </div>
            )}

            {!query && recentTools.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-body-subtle">
                Type a format or tool name...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full" onKeyDown={handleKeyDown}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body-subtle" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (query.length > 0) setOpen(true);
            if (!query && recentTools.length > 0) setOpen(true);
          }}
          placeholder="Search tools..."
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-label="Search converter tools"
          className="w-full h-9 pl-9 pr-8 rounded-base border border-border-default bg-neutral-tertiary text-sm text-heading placeholder:text-body-subtle outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-[10px] hover:bg-neutral-quaternary transition-colors"
          >
            <X className="h-4 w-4 text-body" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-2 w-full rounded-base border border-border-default bg-neutral-primary-soft z-50 overflow-hidden shadow-lg">
          {showRecent && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-body-subtle">
                <Clock className="h-3.5 w-3.5" />
                Recently used
              </div>
              {recentTools.map((tool, idx) => (
                <button
                  key={tool.slug}
                  onClick={() => handleSelect(tool.slug)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-left text-sm transition-colors ${
                    idx === activeIndex
                      ? "bg-brand-softer text-heading"
                      : "text-heading hover:bg-neutral-secondary-medium"
                  }`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-brand-softer text-[10px] font-semibold text-fg-brand">
                    {tool.inputFormat.ext.toUpperCase()}
                  </div>
                  <span className="flex-1 min-w-0">
                    <span className="font-medium">{tool.shortName || tool.name}</span>
                    <span className="ml-2 text-xs text-body">{tool.categoryId}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-body" />
                </button>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div>
              {showRecent && <div className="border-t border-border-default" />}
              <div id={listboxId} role="listbox" aria-label="Search results" className="p-1">
                {results.map((tool, idx) => (
                  <button
                    key={tool.id}
                    id={`result-${idx}`}
                    role="option"
                    aria-selected={idx === activeIndex}
                    onClick={() => handleSelect(tool.slug)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left text-sm transition-colors ${
                      idx === activeIndex
                        ? "bg-brand-softer text-heading"
                        : "text-heading hover:bg-neutral-secondary-medium"
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-brand-softer text-[10px] font-semibold text-fg-brand">
                      {tool.inputFormat.ext.toUpperCase()}
                    </div>
                    <span className="flex-1 min-w-0">
                      <span className="font-medium">{tool.shortName || tool.name}</span>
                      <span className="ml-2 text-xs text-body">{tool.categoryId}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-body" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showRecent && results.length === 0 && query.length >= 1 && (
            <div className="px-4 py-6 text-center text-sm text-body">
              No tools found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
