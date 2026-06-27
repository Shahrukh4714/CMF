import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Converter Guides & Tutorials | Convertmyfiles Blog",
  description: "Learn how to convert files between formats, compare converter tools, and get tips for working with PDFs, images, documents, and more.",
  openGraph: { title: "Converter Guides & Tutorials | Convertmyfiles Blog", description: "Learn how to convert files between formats." },
};

const articles = [
  { slug: "how-to-convert-pdf-to-word-free", title: "How to Convert PDF to Word Free (No Upload, 100% Private)", excerpt: "The best free ways to convert PDF to DOCX without uploading your files to a server.", date: "2026-06-15", readingTime: "4 min" },
  { slug: "jpg-to-png-best-free-converter", title: "JPG to PNG: The Best Free Converter for Lossless Images", excerpt: "Convert JPG images to PNG format without quality loss. Everything runs in your browser.", date: "2026-06-10", readingTime: "3 min" },
  { slug: "free-online-file-converter-privacy", title: "Why Free Online File Converters Are a Privacy Risk (And How to Stay Safe)", excerpt: "Most online converters upload your files to unknown servers. Here's how to convert privately.", date: "2026-06-05", readingTime: "5 min" },
  { slug: "csv-to-json-converter-guide", title: "CSV to JSON: The Developer's Guide to Converting Spreadsheets", excerpt: "Convert CSV data to JSON format for APIs and web applications. No upload required.", date: "2026-05-28", readingTime: "4 min" },
  { slug: "image-to-pdf-best-practices", title: "Image to PDF: Best Practices for Documents, Scans, and Photos", excerpt: "Combine multiple images into a single PDF. Tips for resolution, size, and organization.", date: "2026-05-20", readingTime: "6 min" },
  { slug: "heic-to-jpg-converter-guide", title: "HEIC to JPG Converter: Convert iPhone Photos Free in Any Browser", excerpt: "Learn how to convert HEIC photos from iPhone to JPG on Windows, Mac, or any browser — no software needed.", date: "2026-06-27", readingTime: "5 min" },
  { slug: "mp4-to-mp3-free-converter", title: "MP4 to MP3 Free Converter: Extract Audio Privately", excerpt: "How to extract audio from video files (MP4 to MP3) for free without uploading to a server.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "how-to-compress-pdf-free", title: "How to Compress a PDF for Free (No Upload, 100% Private)", excerpt: "How to reduce PDF file size for free without losing quality. Complete guide.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "webp-vs-png-which-format", title: "WebP vs PNG: Which Image Format Should You Use?", excerpt: "Compare WebP vs PNG for web design, performance, and transparency.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "wav-to-mp3-free-guide", title: "WAV to MP3 Free Guide: Convert High-Fidelity Audio", excerpt: "Convert uncompressed WAV files to highly-compatible MP3 format free and privately.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "png-to-pdf-guide", title: "PNG to PDF Converter Free: Convert Images Privately", excerpt: "Learn how to convert PNG images to PDF files for sharing, printing, or archiving.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "mov-to-mp4-guide", title: "MOV to MP4 Converter Free: Fix Playback Issues", excerpt: "Why QuickTime MOV files fail on Windows and Android, and how to convert them.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "svg-to-png-guide", title: "SVG to PNG Converter: Export Vector Graphics", excerpt: "Convert SVG vector files to PNG raster images with transparency preserved.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "docx-to-pdf-guide", title: "DOCX to PDF Converter Free: Export Word Docs", excerpt: "Save DOCX files as PDF free in your browser without Microsoft Office.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "compress-image-free-guide", title: "How to Compress Image Size Free and Privately", excerpt: "Optimize JPG, PNG, and WebP images to speed up loading times without quality loss.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "merge-pdf-free-guide", title: "Merge PDF Files Free: Combine Documents Locally", excerpt: "How to combine multiple PDF files into one document privately in your browser.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "gif-from-video-guide", title: "How to Make a GIF From a Video: Convert Clips Free", excerpt: "Create animated GIFs from MP4 or WebM video clips for social sharing and memes.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "csv-to-excel-guide", title: "CSV to Excel: Convert Tabular Data to XLSX Free", excerpt: "Convert plain text CSV files to Excel sheets for advanced reporting and sorting.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "flac-to-mp3-guide", title: "FLAC to MP3 Converter: Convert Audio Privately", excerpt: "Reduce high-fidelity FLAC sizes by converting them to universally supported MP3s.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "pdf-to-word-alternative", title: "Free PDF to Word Converter: Best Acrobat Alternatives", excerpt: "Compare free tools for converting PDF documents into editable Word DOCX files.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "webm-to-mp4-guide", title: "WebM to MP4: Convert Web Video Format Free", excerpt: "Make web-recorded videos compatible with iOS and standard video players.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "image-to-text-ocr-guide", title: "Image to Text OCR: Extract Text from Photos Free", excerpt: "Digitize screenshots, scans, and notes instantly without uploading them to cloud servers.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "json-to-csv-developer-guide", title: "JSON to CSV: Export Structured Data to Spreadsheets", excerpt: "Flatten and convert nested JSON objects into simple, readable CSV rows.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "avif-format-guide", title: "AVIF Image Format: The Next-Gen Web Standard", excerpt: "Learn how AVIF compresses images better than WebP or JPEG for faster sites.", date: "2026-06-27", readingTime: "4 min" },
  { slug: "mkv-to-mp4-guide", title: "MKV to MP4: Convert Video Files Free & Privately", excerpt: "Enjoy compatibility on all screens by converting MKV containers to MP4 locally.", date: "2026-06-27", readingTime: "4 min" }
];

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-[32px] font-extrabold text-heading mb-2">Converter Guides & Tutorials</h1>
      <p className="text-base text-body mb-10">Tips, comparisons, and privacy-first file conversion guides.</p>
      <div className="space-y-8">
        {articles.map((a) => (
          <article key={a.slug} className="border-b border-border-default pb-6">
            <Link href={`/blog/${a.slug}`} className="group no-underline">
              <h2 className="text-xl font-bold text-heading group-hover:text-fg-brand transition-colors mb-1.5">{a.title}</h2>
            </Link>
            <p className="text-sm text-body mb-2">{a.excerpt}</p>
            <p className="text-xs text-body-subtle">{a.date} · {a.readingTime} read</p>
          </article>
        ))}
      </div>
    </div>
  );
}
