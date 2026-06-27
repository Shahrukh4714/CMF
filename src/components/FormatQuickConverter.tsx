"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FORMATS, FORMAT_GROUPS } from "@/data/tools";
import { ArrowRightLeft, ArrowRight } from "lucide-react";

const groupNames: Record<string, string> = {
  image: "Images", document: "Documents & Data", video: "Video",
  audio: "Audio", ebook: "E-books", font: "Fonts", archive: "Archives", "3d": "3D & CAD",
};

const groupOrder = ["image", "document", "video", "audio", "ebook", "font", "archive", "3d"];

export function FormatQuickConverter() {
  const router = useRouter();
  const [from, setFrom] = useState("png");
  const [to, setTo] = useState("jpg");

  const handleConvert = () => {
    if (from && to) {
      router.push(`/convert/${from}-to-${to}`);
    }
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const sortedGroups = groupOrder.filter((g) => FORMAT_GROUPS[g]?.length > 0);

  return (
    <div className="card-base p-6 sm:p-8 mb-10">
      <div className="flex items-center gap-2 mb-5">
        <ArrowRightLeft className="h-4 w-4 text-fg-brand" />
        <h2 className="text-sm font-semibold text-heading">Quick Convert</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
        <div className="flex-1">
          <label htmlFor="fqc-from" className="block text-xs font-medium text-body-subtle mb-1.5">From</label>
          <select
            id="fqc-from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-neutral-tertiary px-3 py-2.5 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            {sortedGroups.map((g) => (
              <optgroup key={g} label={groupNames[g] || g}>
                {FORMAT_GROUPS[g].map((ext) => {
                  const f = FORMATS[ext];
                  return f ? (
                    <option key={ext} value={ext}>
                      {f.ext.toUpperCase()} — {f.name}
                    </option>
                  ) : null;
                })}
              </optgroup>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          aria-label="Swap formats"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-default bg-neutral-tertiary hover:bg-quaternary-medium transition-colors self-end sm:self-center cursor-pointer"
        >
          <ArrowRightLeft className="h-4 w-4 text-body" />
        </button>

        <div className="flex-1">
          <label htmlFor="fqc-to" className="block text-xs font-medium text-body-subtle mb-1.5">To</label>
          <select
            id="fqc-to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-neutral-tertiary px-3 py-2.5 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          >
            {sortedGroups.map((g) => (
              <optgroup key={g} label={groupNames[g] || g}>
                {FORMAT_GROUPS[g].map((ext) => {
                  const f = FORMATS[ext];
                  return f ? (
                    <option key={ext} value={ext}>
                      {f.ext.toUpperCase()} — {f.name}
                    </option>
                  ) : null;
                })}
              </optgroup>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          className="btn-brand flex items-center gap-2 self-end"
        >
          Convert <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
