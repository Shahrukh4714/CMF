import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Free Online File Converters Are a Privacy Risk | Convertmyfiles",
  description: "Most online converters upload your files to unknown servers. Here's how to convert files privately and securely.",
};

export default function Article() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/blog" className="text-sm text-fg-brand no-underline hover:underline mb-6 inline-block">&larr; Back to blog</Link>
      <h1 className="text-[30px] font-extrabold text-heading mb-3">Why Free Online File Converters Are a Privacy Risk (And How to Stay Safe)</h1>
      <p className="text-sm text-body-subtle mb-8">June 5, 2026 · 5 min read</p>

      <div className="prose prose-sm max-w-none text-body leading-relaxed space-y-4">
        <p>You need to convert a PDF to Word. You search Google, click the first result, upload your file, and download the result. It took 30 seconds. But in those 30 seconds, your document traveled to a server you don't control.</p>

        <h2 className="text-lg font-bold text-heading mt-8 mb-3">What Happens to Your Files?</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Server copies</strong> — Your file is stored temporarily (or permanently) on the provider's server.</li>
          <li><strong>Data mining</strong> — Some free services scan your documents for marketing data.</li>
          <li><strong>Security breaches</strong> — If the converter gets hacked, your documents are exposed.</li>
          <li><strong>No deletion guarantee</strong> — Most free tools don't explicitly state when files are deleted.</li>
        </ul>

        <h2 className="text-lg font-bold text-heading mt-8 mb-3">The Local Processing Solution</h2>
        <p>Convertmyfiles processes everything in your browser using WebAssembly and JavaScript libraries. Your files never leave your device. This means:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>No server upload — the file stays on your computer.</li>
          <li>Works offline — after the page loads, you can disconnect from the internet.</li>
          <li>No account needed — no personal information required.</li>
        </ul>

        <div className="bg-warning-soft border border-border-warning-subtle rounded-base p-4 mt-8">
          <p className="text-sm text-fg-warning font-medium">Convert privately: <Link href="/" className="text-fg-brand font-bold no-underline hover:underline">Convertmyfiles — private file converter →</Link></p>
        </div>
      </div>
    </article>
  );
}
