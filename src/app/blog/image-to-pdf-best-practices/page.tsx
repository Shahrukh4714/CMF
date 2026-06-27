import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF: Best Practices for Documents, Scans, and Photos | Convertmyfiles",
  description: "Combine multiple images into a single PDF with tips for resolution, file size, and organization. All local, no upload.",
};

export default function Article() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/blog" className="text-sm text-fg-brand no-underline hover:underline mb-6 inline-block">&larr; Back to blog</Link>
      <h1 className="text-[30px] font-extrabold text-heading mb-3">Image to PDF: Best Practices for Documents, Scans, and Photos</h1>
      <p className="text-sm text-body-subtle mb-8">May 20, 2026 · 6 min read</p>

      <div className="prose prose-sm max-w-none text-body leading-relaxed space-y-4">
        <p>Converting images to PDF is one of the most common file conversion tasks. Whether you're combining scanned documents, creating a photo album, or preparing a presentation, knowing the best practices saves time and ensures quality.</p>

        <h2 className="text-lg font-bold text-heading mt-8 mb-3">When to Convert Images to PDF</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Scanning documents</strong> — Combine multiple scanned pages into a single PDF.</li>
          <li><strong>Sending photos</strong> — Share multiple images as one organized file.</li>
          <li><strong>Archiving</strong> — PDF is better for long-term storage than loose image files.</li>
        </ul>

        <h2 className="text-lg font-bold text-heading mt-8 mb-3">Resolution Tips</h2>
        <p>For most documents, 300 DPI is sufficient. Higher resolution (600 DPI) is better for text-heavy documents that need OCR later. Lower resolution (150 DPI) works for web sharing. Convertmyfiles preserves your original image quality during conversion.</p>

        <h2 className="text-lg font-bold text-heading mt-8 mb-3">How to Convert Image to PDF Privately</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Go to Convertmyfiles.</li>
          <li>Upload your image (JPG, PNG, WebP, or BMP).</li>
          <li>Select PDF as the output format.</li>
          <li>Download your PDF — processed entirely in your browser.</li>
        </ol>

        <div className="bg-warning-soft border border-border-warning-subtle rounded-base p-4 mt-8">
          <p className="text-sm text-fg-warning font-medium">Try it: <Link href="/" className="text-fg-brand font-bold no-underline hover:underline">Image to PDF converter →</Link></p>
        </div>
      </div>
    </article>
  );
}
