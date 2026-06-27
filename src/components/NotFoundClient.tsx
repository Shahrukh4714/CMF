"use client";

import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";

export function NotFoundClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-12 text-center max-w-2xl mx-auto">
      <div className="space-y-3 mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-accentbg border border-accentbd text-xs font-mono font-medium text-fg-brand">
          Error 404
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-heading tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-body leading-relaxed max-w-md mx-auto">
          We couldn&apos;t find the converter tool or page you were looking for. 
          Use the search bar below to search our 100+ file tools.
        </p>
      </div>

      {/* Dynamic Search Bar */}
      <div className="w-full max-w-md mx-auto mb-10 card p-3 shadow-lg text-left">
        <SearchBar />
      </div>

      {/* Quick link recommendations */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-body-subtle">
          Popular Converters
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/convert/pdf-to-docx" className="px-3.5 py-1.5 rounded-full border border-border-default bg-neutral-primary-soft text-xs text-body hover:text-fg-brand hover:border-accent font-medium no-underline transition-all">
            PDF to Word
          </Link>
          <Link href="/convert/png-to-jpg" className="px-3.5 py-1.5 rounded-full border border-border-default bg-neutral-primary-soft text-xs text-body hover:text-fg-brand hover:border-accent font-medium no-underline transition-all">
            PNG to JPG
          </Link>
          <Link href="/convert/mp4-to-mp3" className="px-3.5 py-1.5 rounded-full border border-border-default bg-neutral-primary-soft text-xs text-body hover:text-fg-brand hover:border-accent font-medium no-underline transition-all">
            MP4 to MP3
          </Link>
          <Link href="/convert/heic-to-jpg" className="px-3.5 py-1.5 rounded-full border border-border-default bg-neutral-primary-soft text-xs text-body hover:text-fg-brand hover:border-accent font-medium no-underline transition-all">
            HEIC to JPG
          </Link>
        </div>
      </div>

      <Link
        href="/"
        className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 no-underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
