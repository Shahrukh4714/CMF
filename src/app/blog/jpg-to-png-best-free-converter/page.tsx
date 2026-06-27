import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to PNG: The Best Free Converter for Lossless Images | Convertmyfiles",
  description: "Convert JPG images to PNG format without quality loss. Everything runs in your browser — no upload needed.",
};

export default function Article() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/blog" className="text-sm text-fg-brand no-underline hover:underline mb-6 inline-block">&larr; Back to blog</Link>
      <h1 className="text-[30px] font-extrabold text-heading mb-3">JPG to PNG: The Best Free Converter for Lossless Images</h1>
      <p className="text-sm text-body-subtle mb-8">June 10, 2026 · 3 min read</p>

      <div className="prose prose-sm max-w-none text-body leading-relaxed space-y-4">
        <p>JPG and PNG are the two most common image formats on the web. Each has its strengths — JPG for photographs (smaller file size), PNG for graphics with transparency or text (lossless quality).</p>

        <h2 className="text-lg font-bold text-heading mt-8 mb-3">When to Convert JPG to PNG</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>You need transparency</strong> — PNG supports alpha channels, JPG doesn't.</li>
          <li><strong>Lossless editing</strong> — Every time you save a JPG, it loses quality. PNG is lossless.</li>
          <li><strong>Text or logos</strong> — PNG preserves sharp edges without compression artifacts.</li>
        </ul>

        <h2 className="text-lg font-bold text-heading mt-8 mb-3">How to Convert JPG to PNG Privately</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Open Convertmyfiles in your browser.</li>
          <li>Select your JPG file (drag and drop works).</li>
          <li>Choose PNG as the output format.</li>
          <li>Download your lossless PNG.</li>
        </ol>
        <p>That's it. No upload, no server, no privacy risk.</p>

        <div className="bg-warning-soft border border-border-warning-subtle rounded-base p-4 mt-8">
          <p className="text-sm text-fg-warning font-medium">Convert now: <Link href="/" className="text-fg-brand font-bold no-underline hover:underline">JPG to PNG converter →</Link></p>
        </div>
      </div>
    </article>
  );
}
