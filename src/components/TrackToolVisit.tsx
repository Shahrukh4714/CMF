"use client";

import { useEffect } from "react";

const STORAGE_KEY = "convertit_recent_tools";
const MAX_RECENT = 12;

export function TrackToolVisit({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let recent: string[] = stored ? JSON.parse(stored) : [];
      recent = recent.filter((s) => s !== slug);
      recent.unshift(slug);
      if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch {
      // localStorage not available
    }
  }, [slug]);

  return null;
}
