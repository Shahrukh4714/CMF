import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Compress a PDF for Free Without Losing Quality | Convertmyfiles Blog",
  description:
    "Learn how to compress a PDF for free and reduce file size without sacrificing quality. No uploads needed — everything runs in your browser.",
  openGraph: {
    title: "How to Compress a PDF for Free Without Losing Quality | Convertmyfiles Blog",
    description:
      "Learn how to compress a PDF for free and reduce file size without sacrificing quality. No uploads needed — everything runs in your browser.",
    url: "https://convertit.app/blog/how-to-compress-pdf-free",
    siteName: "Convertmyfiles",
    type: "article",
  },
};

export default function HowToCompressPDFFree() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <h1 className="text-heading text-3xl font-bold mb-4">
        How to Compress a PDF for Free (Without Losing Quality)
      </h1>
      <p className="text-body-subtle text-sm mb-8">Updated June 2026 · 5 min read</p>

      <p className="text-body mb-8">
        PDFs are everywhere — invoices, contracts, portfolios, research papers. But they can quickly
        balloon to sizes that email clients reject and cloud storage plans resent. The good news: you
        don&apos;t need paid software or a risky online service to shrink them. In this guide we
        walk through exactly why PDFs get large, which compression level to pick, and how to
        compress a PDF for free right in your browser — with zero file uploads.
      </p>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-heading text-xl font-semibold mb-3">Why PDF Files Get So Large</h2>
        <p className="text-body mb-4">
          A PDF isn&apos;t just text — it&apos;s a container that can pack in high-resolution
          images, embedded fonts, color profiles, vector graphics, and metadata. Each of these
          contributes to file size in different ways:
        </p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>
            <span className="font-medium">Embedded images</span> — Photos saved at print-resolution
            (300 DPI+) are the single biggest culprit. A single full-page photo can add 5–10 MB on
            its own.
          </li>
          <li>
            <span className="font-medium">Embedded fonts</span> — PDFs often bundle an entire
            typeface so the document renders identically everywhere, even if only a handful of
            glyphs are used.
          </li>
          <li>
            <span className="font-medium">Uncompressed streams</span> — Some PDF exporters skip
            internal compression entirely, leaving raw binary data in the file.
          </li>
          <li>
            <span className="font-medium">Duplicate resources</span> — The same image or font
            referenced multiple times may be stored multiple times.
          </li>
        </ul>
        <p className="text-body">
          Understanding the cause helps you pick the right compression level — and avoid
          over-compressing documents where quality actually matters.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-heading text-xl font-semibold mb-3">
          Compression Levels: Which One Should You Use?
        </h2>
        <p className="text-body mb-4">
          Most PDF compressors offer two or three presets. Here&apos;s a practical breakdown:
        </p>
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          {[
            {
              level: "Low / Screen",
              dpi: "72 DPI",
              useCase: "Email attachments, web previews, sharing drafts.",
              saving: "Up to 90% smaller",
            },
            {
              level: "Medium / eBook",
              dpi: "150 DPI",
              useCase: "Digital distribution, client review docs.",
              saving: "50–75% smaller",
            },
            {
              level: "High / Print",
              dpi: "300 DPI",
              useCase: "Final printable docs where quality must be preserved.",
              saving: "10–30% smaller",
            },
          ].map((item) => (
            <div key={item.level} className="card-base p-4 border border-border-default rounded-xl">
              <p className="text-fg-brand font-semibold mb-1">{item.level}</p>
              <p className="text-body-subtle text-sm mb-1">Image resolution: {item.dpi}</p>
              <p className="text-body text-sm mb-1">{item.useCase}</p>
              <p className="text-body-subtle text-xs">{item.saving}</p>
            </div>
          ))}
        </div>
        <p className="text-body">
          For most everyday needs — emailing a contract or uploading a portfolio — the{" "}
          <span className="font-medium">Medium</span> preset strikes the best balance between
          readable quality and a manageable file size.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-heading text-xl font-semibold mb-3">
          Common Size Limits You&apos;ll Run Into
        </h2>
        <p className="text-body mb-4">
          Knowing the limits you&apos;re working against makes it easier to choose a target size:
        </p>
        <ul className="list-disc list-inside text-body space-y-2">
          <li>
            <span className="font-medium">Gmail / Outlook email attachments</span> — 25 MB hard
            limit. Anything larger and the email bounces.
          </li>
          <li>
            <span className="font-medium">Government / university portals</span> — Often cap at 5
            MB or even 2 MB per file.
          </li>
          <li>
            <span className="font-medium">WhatsApp / Telegram file sharing</span> — 100 MB and 2
            GB respectively, but slow to receive on mobile data.
          </li>
          <li>
            <span className="font-medium">Job application platforms (LinkedIn, Workday)</span> — Typically
            capped at 5 MB for résumés and portfolios.
          </li>
          <li>
            <span className="font-medium">Cloud storage free tiers</span> — Google Drive (15 GB
            total) and Dropbox (2 GB) incentivise keeping files lean.
          </li>
        </ul>
      </section>

      {/* Section 4 — How to use the tool */}
      <section className="mb-10">
        <h2 className="text-heading text-xl font-semibold mb-3">
          How to Compress a PDF for Free on Convertmyfiles
        </h2>
        <p className="text-body mb-4">
          Our tool runs entirely in your browser using WebAssembly —{" "}
          <span className="font-medium">your files never leave your device</span>. No account, no
          watermark, no server upload.
        </p>
        <ol className="list-decimal list-inside text-body space-y-3">
          <li>
            Go to our{" "}
            <Link href="/convert/compress-pdf" className="text-fg-brand underline underline-offset-2 hover:opacity-80">
              free PDF compressor
            </Link>
            .
          </li>
          <li>
            Click <span className="font-medium">Choose File</span> or drag your PDF onto the upload
            area.
          </li>
          <li>
            Select a compression level — <span className="font-medium">Screen</span>,{" "}
            <span className="font-medium">eBook</span>, or <span className="font-medium">Print</span>.
          </li>
          <li>
            Hit <span className="font-medium">Compress PDF</span>. The browser processes the file
            locally using WebAssembly — no waiting for a server response.
          </li>
          <li>
            Preview the result. If the file size meets your target, click{" "}
            <span className="font-medium">Download</span>.
          </li>
        </ol>
        <p className="text-body mt-4">
          The whole process takes seconds for most documents. If you need a smaller file, simply
          switch to a lower quality preset and compress again — no re-upload needed.
        </p>
      </section>

      {/* Section 5 — Tips */}
      <section className="mb-10">
        <h2 className="text-heading text-xl font-semibold mb-3">
          Tips for Getting the Smallest File Without Ugly Results
        </h2>
        <ul className="list-disc list-inside text-body space-y-2">
          <li>
            Start with the <span className="font-medium">eBook (Medium)</span> preset — only step
            down to Screen if you still need a smaller file.
          </li>
          <li>
            Text-heavy PDFs (contracts, reports) survive heavy compression far better than
            photo-heavy ones. Compress aggressively when it&apos;s mostly text.
          </li>
          <li>
            If your original PDF was exported from a design tool like Figma or Illustrator, try
            re-exporting at a lower DPI setting first — that often beats post-compression.
          </li>
          <li>
            For scanned documents, compress to the lowest quality that keeps text legible. An OCR
            layer (invisible to compression) preserves searchability regardless.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-12 bg-neutral-primary-soft rounded-2xl p-6">
        <h2 className="text-heading text-xl font-semibold mb-6">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-body font-semibold mb-1">
              Does compressing a PDF reduce text quality?
            </h3>
            <p className="text-body-subtle">
              No — PDF compression primarily targets embedded images. Vector text and line art are
              losslessly re-streamed, so your text stays perfectly sharp regardless of the
              compression level you choose.
            </p>
          </div>

          <div>
            <h3 className="text-body font-semibold mb-1">
              Is it safe to compress sensitive documents online?
            </h3>
            <p className="text-body-subtle">
              With Convertmyfiles, yes — because there is no &quot;online&quot; transfer involved.
              Everything runs locally in your browser. Confidential contracts, medical records, and
              financial statements never touch our servers.
            </p>
          </div>

          <div>
            <h3 className="text-body font-semibold mb-1">
              Why is my PDF still large after compression?
            </h3>
            <p className="text-body-subtle">
              If your PDF contains many large embedded images already compressed as JPEG, further
              compression yields diminishing returns. Try the Screen preset for the maximum
              reduction, or consider splitting the PDF into smaller documents if size is the main
              concern.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-body mb-4 text-lg">
          Ready to shrink your PDF? It&apos;s free, instant, and completely private.
        </p>
        <Link
          href="/convert/compress-pdf"
          className="inline-block bg-fg-brand text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Compress PDF for Free →
        </Link>
      </section>
    </main>
  );
}
