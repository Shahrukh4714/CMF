import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SVG to PNG Converter: A Complete How-To Guide | Convertmyfiles Blog",
  description:
    "Learn when and why to convert SVG to PNG, how resolution and DPI work, and how to do it instantly in your browser — no uploads, no installs.",
  openGraph: {
    title: "SVG to PNG Converter: A Complete How-To Guide | Convertmyfiles Blog",
    description:
      "Learn when and why to convert SVG to PNG, how resolution and DPI work, and how to do it instantly in your browser — no uploads, no installs.",
    url: "https://convertmyfiles.com/blog/svg-to-png-guide",
    siteName: "Convertmyfiles",
    type: "article",
  },
};

export default function SvgToPngGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-body">

      {/* Hero */}
      <h1 className="text-heading text-3xl font-bold mb-4">
        SVG to PNG Converter: When to Use It and How to Get It Right
      </h1>
      <p className="text-body-subtle mb-10">
        SVG is a fantastic format — scalable, tiny, and resolution-independent.
        But the real world keeps throwing situations at you where only a PNG will
        do. This guide explains exactly when you need to make the switch, what to
        watch out for, and how to convert SVG to PNG in seconds without leaving
        your browser.
      </p>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          When You Actually Need a PNG Instead of an SVG
        </h2>
        <p className="mb-4">
          SVG is an XML-based vector format that browsers and design tools love.
          But plenty of everyday software simply cannot render it:
        </p>
        <ul className="list-disc list-inside space-y-2 text-body mb-4">
          <li>
            <strong>Email clients</strong> — Gmail, Outlook, and Apple Mail
            either ignore SVGs entirely or display a broken-image placeholder.
            PNG is the safe, universally supported choice for email graphics,
            logos, and banners.
          </li>
          <li>
            <strong>Microsoft Word &amp; PowerPoint</strong> — Older versions of
            Office do not support SVG embedding. Even newer versions can be
            inconsistent, especially when sharing files across different Office
            versions or operating systems.
          </li>
          <li>
            <strong>WhatsApp, Slack, and social media</strong> — These platforms
            accept JPEG and PNG for image uploads. SVG files are either rejected
            outright or stripped of their vector data.
          </li>
          <li>
            <strong>App stores and submission portals</strong> — Many asset
            upload forms (Google Play, the App Store, Figma export pipelines)
            require rasterized images at specific pixel dimensions.
          </li>
        </ul>
        <p>
          In short: use SVG for the web and design systems; convert to PNG the
          moment you need to share, embed, or upload the image elsewhere.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          Resolution and DPI: Getting the Size Right
        </h2>
        <p className="mb-4">
          Because SVG is vector-based, the source file has no fixed pixel size —
          it is defined by shapes and coordinates. When you rasterize it to PNG,
          you choose the output resolution. Get this wrong and you end up with a
          blurry logo on a retina display or a 40 MB file that takes forever to
          upload.
        </p>
        <div className="card-base p-5 rounded-lg border border-border-default bg-neutral-primary-soft mb-4">
          <p className="font-semibold mb-2 text-fg-brand">Quick reference</p>
          <ul className="list-disc list-inside space-y-1 text-body-subtle text-sm">
            <li>
              <strong>Web / screen use:</strong> 72–96 PPI is standard. Multiply
              your target CSS size by 2x for sharp retina rendering (e.g.,
              200 x 200 px CSS — export at 400 x 400 px).
            </li>
            <li>
              <strong>Print:</strong> 300 DPI is the standard for most print
              work. A business card logo at 5 cm wide needs roughly 590 px.
            </li>
            <li>
              <strong>Social media headers:</strong> Platforms publish exact
              pixel specs — always match those precisely to avoid compression
              artefacts.
            </li>
          </ul>
        </div>
        <p>
          Our SVG to PNG converter lets you specify the exact output width before
          converting, so you hit your target pixel dimensions every time.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          Preserving Transparent Backgrounds
        </h2>
        <p className="mb-4">
          One of the biggest advantages of SVG is that transparency is built in.
          PNG is the only widely supported raster format that also supports full
          alpha-channel transparency — which is exactly why SVG-to-PNG is such a
          natural pairing.
        </p>
        <p className="mb-4">
          The risk comes when converters silently flatten the transparency onto a
          white (or black) background. This is painfully common with quick online
          tools that process your file server-side with default settings.
        </p>
        <p>
          Our converter renders SVGs natively in the browser using an HTML5
          canvas pipeline that respects the alpha channel, so transparent regions
          in your SVG stay transparent in the exported PNG. Drop the result onto
          any coloured background and it will look exactly as intended.
        </p>
      </section>

      {/* Section 4 — How to */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          How to Convert SVG to PNG on Convertmyfiles
        </h2>
        <p className="mb-4">
          The whole process runs inside your browser using WebAssembly.{" "}
          <strong>Your files never leave your device</strong> — there is no
          server upload, no account required, and no file size limit imposed by
          a cloud tier.
        </p>
        <ol className="list-decimal list-inside space-y-3 text-body">
          <li>
            Go to our{" "}
            <Link
              href="/convert/svg-to-png"
              className="text-fg-brand underline underline-offset-2 hover:opacity-80"
            >
              SVG to PNG converter
            </Link>
            .
          </li>
          <li>
            Click <strong>Choose file</strong> or drag your{" "}
            <code className="bg-neutral-primary-soft px-1 rounded text-sm">.svg</code>{" "}
            file onto the drop zone.
          </li>
          <li>
            Set your desired output width in pixels if you need a specific
            resolution (leave blank to match the SVG viewport dimensions).
          </li>
          <li>
            Click <strong>Convert</strong>. The conversion runs locally in
            milliseconds.
          </li>
          <li>
            Click <strong>Download</strong> to save your PNG — transparent
            background preserved.
          </li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div className="border-l-4 border-border-default pl-4">
            <h3 className="text-heading font-semibold mb-1">
              Will my SVG fonts and gradients survive the conversion?
            </h3>
            <p className="text-body-subtle">
              Yes. Because we render the SVG in a real browser engine before
              rasterizing, web fonts, gradients, filters, and CSS animations (at
              their initial state) are all rendered faithfully. The output is
              exactly what you see in a browser.
            </p>
          </div>

          <div className="border-l-4 border-border-default pl-4">
            <h3 className="text-heading font-semibold mb-1">
              Can I convert multiple SVG files at once?
            </h3>
            <p className="text-body-subtle">
              Batch conversion is on our roadmap. Right now, each file is
              converted individually — but because conversion is near-instant
              with no upload wait time, running through a handful of files takes
              only a few seconds.
            </p>
          </div>

          <div className="border-l-4 border-border-default pl-4">
            <h3 className="text-heading font-semibold mb-1">
              Is there a file size limit?
            </h3>
            <p className="text-body-subtle">
              No server-side limit, because nothing is uploaded. The only
              practical constraint is your device available memory. In practice,
              even complex SVGs with thousands of paths convert without issues on
              any modern laptop or phone.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card-base rounded-xl border border-border-default bg-neutral-primary-soft p-8 text-center">
        <h2 className="text-heading text-xl font-semibold mb-2">
          Ready to convert your SVG?
        </h2>
        <p className="text-body-subtle mb-5">
          No sign-up. No upload. Just a fast, private SVG to PNG conversion
          right in your browser.
        </p>
        <Link
          href="/convert/svg-to-png"
          className="inline-block bg-fg-brand text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Convert SVG to PNG — Free
        </Link>
      </section>

    </main>
  );
}
