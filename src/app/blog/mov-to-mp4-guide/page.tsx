import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MOV to MP4 Converter Free — No Upload Needed | Convertmyfiles Blog",
  description:
    "Learn how to convert MOV files from iPhone or Mac to MP4 for free, privately, right in your browser. Your files never leave your device.",
  openGraph: {
    title: "MOV to MP4 Converter Free — No Upload Needed | Convertmyfiles Blog",
    description:
      "Learn how to convert MOV files from iPhone or Mac to MP4 for free, privately, right in your browser. Your files never leave your device.",
    url: "https://convertmyfiles.com/blog/mov-to-mp4-guide",
    siteName: "Convertmyfiles",
    type: "article",
  },
};

export default function MovToMp4GuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="mb-10">
        <span className="text-sm font-medium text-fg-brand uppercase tracking-wide">
          Video Conversion
        </span>
        <h1 className="text-heading mt-2 mb-4 text-3xl font-bold leading-snug">
          MOV to MP4 Converter Free: Convert QuickTime Files Without Uploading
          Anything
        </h1>
        <p className="text-body-subtle text-lg">
          Shot a video on your iPhone or Mac and now it won't play on Windows or
          Android? You're not alone. MOV is Apple's default container format,
          and it travels poorly outside the Apple ecosystem. Here's everything
          you need to know — and how to fix it in seconds, for free.
        </p>
      </div>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          Why MOV Files Don't Play on Windows or Android
        </h2>
        <p className="text-body mb-4">
          MOV is a container format developed by Apple for QuickTime. iPhones
          record in MOV (or HEVC inside a MOV wrapper), and macOS handles it
          natively. But Windows Media Player, most Android video apps, and the
          majority of social platforms either refuse the file outright or play
          it with no audio.
        </p>
        <p className="text-body mb-4">
          The root cause is codec and container support. Windows and Android
          are optimized for MP4 with H.264 or H.265 video and AAC audio — the
          universal baseline for video playback. MOV can hold the exact same
          codec data, but the wrapper itself isn't recognized by many players,
          so the file appears broken.
        </p>
        <p className="text-body">
          The good news: converting MOV to MP4 is usually a fast remux — the
          video data doesn't need to be re-encoded, just repackaged — which
          means zero quality loss and conversion in under a second for most
          clips.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          MOV vs. MP4: What's Actually Different?
        </h2>
        <div className="card-base border border-border-default bg-neutral-primary-soft rounded-xl p-6 mb-4">
          <ul className="text-body space-y-3">
            <li>
              <span className="font-semibold text-fg-brand">Container:</span>{" "}
              Both MOV and MP4 are containers — they hold video, audio, and
              subtitle tracks. The container tells the player how to read the
              file.
            </li>
            <li>
              <span className="font-semibold text-fg-brand">Compatibility:</span>{" "}
              MP4 (MPEG-4 Part 14) is an international standard. MOV is
              Apple-proprietary. MP4 wins on cross-platform reach.
            </li>
            <li>
              <span className="font-semibold text-fg-brand">Codecs inside:</span>{" "}
              Both can contain H.264, H.265, and AAC. Converting between them
              usually doesn't touch the codec data at all.
            </li>
            <li>
              <span className="font-semibold text-fg-brand">File size:</span>{" "}
              Virtually identical after conversion. You're not compressing
              anything — just changing the wrapper.
            </li>
          </ul>
        </div>
        <p className="text-body">
          In short: the video quality you recorded on your iPhone is perfectly
          preserved after a MOV to MP4 conversion. Nothing is lost.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          Why You Shouldn't Upload Your Videos to a Cloud Converter
        </h2>
        <p className="text-body mb-4">
          Most "free" online converters work by uploading your file to their
          servers, processing it, then letting you download the result. That
          means your video — which might contain personal moments, private
          conversations, or sensitive footage — sits on a stranger's server.
          Many of these services retain files for days, or use them to train
          systems or serve ads.
        </p>
        <p className="text-body">
          Our tool works differently. Convertmyfiles runs entirely in your
          browser using WebAssembly. <strong>Your files never leave your
          device.</strong> There is no upload, no server processing, and no
          waiting in a queue. The conversion happens locally on your CPU, and
          the result is available for download instantly.
        </p>
      </section>

      {/* Section 4 — How To */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          How to Convert MOV to MP4 on Convertmyfiles
        </h2>
        <ol className="text-body space-y-3 list-none">
          {[
            {
              step: "1",
              text: 'Open our free MOV to MP4 converter — click the button at the bottom of this article, or navigate to convertmyfiles.com.',
            },
            {
              step: "2",
              text: 'Click "Choose File" or drag your .mov file onto the drop zone. Any MOV file from iPhone, Mac, or a camera works.',
            },
            {
              step: "3",
              text: 'The tool automatically detects the format. Select MP4 as the output format if it isn\'t already selected.',
            },
            {
              step: "4",
              text: 'Click "Convert." WebAssembly processes the file locally — no upload happens at any point.',
            },
            {
              step: "5",
              text: 'When conversion is complete, click "Download" to save your MP4. Done.',
            },
          ].map(({ step, text }) => (
            <li key={step} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-primary-soft border border-border-default flex items-center justify-center text-fg-brand font-bold text-sm">
                {step}
              </span>
              <span className="pt-1">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Section 5 — Use Cases */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          Common Situations Where This Helps
        </h2>
        <ul className="text-body space-y-2 list-disc list-inside">
          <li>
            Sending an iPhone video to a Windows or Android user who can't play
            it.
          </li>
          <li>
            Uploading a video to Instagram, TikTok, or LinkedIn, which prefer
            MP4.
          </li>
          <li>
            Editing footage in software that doesn't support MOV natively
            (e.g., some older versions of Premiere or DaVinci Resolve on
            Windows).
          </li>
          <li>
            Embedding a video in a PowerPoint presentation on Windows.
          </li>
          <li>
            Archiving home videos in a more universally supported format.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-heading text-2xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="card-base border border-border-default rounded-xl p-6">
            <h3 className="text-body font-semibold mb-2">
              Will converting MOV to MP4 reduce video quality?
            </h3>
            <p className="text-body-subtle">
              No — in most cases the conversion is a lossless remux. The video
              and audio streams are moved into the new container without
              re-encoding, so quality is bit-for-bit identical to the original.
            </p>
          </div>
          <div className="card-base border border-border-default rounded-xl p-6">
            <h3 className="text-body font-semibold mb-2">
              Is there a file size limit?
            </h3>
            <p className="text-body-subtle">
              Because conversion happens in your browser, the limit is
              effectively your device's available RAM rather than an artificial
              server cap. Most modern computers handle files up to several
              gigabytes without issue.
            </p>
          </div>
          <div className="card-base border border-border-default rounded-xl p-6">
            <h3 className="text-body font-semibold mb-2">
              Does it work on iPhone or iPad too?
            </h3>
            <p className="text-body-subtle">
              Yes. Convertmyfiles runs in any modern browser, including Safari
              on iOS and iPadOS. You can convert a video directly on your iPhone
              without installing any app.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="card-base border border-border-default bg-neutral-primary-soft rounded-2xl p-8 text-center">
        <h2 className="text-heading text-xl font-bold mb-2">
          Ready to convert your MOV file?
        </h2>
        <p className="text-body-subtle mb-6">
          Free, instant, and 100% private — no account, no upload, no waiting.
        </p>
        <Link
          href="/convert/mov-to-mp4"
          className="inline-block bg-fg-brand text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Convert MOV to MP4 Free →
        </Link>
      </div>
    </main>
  );
}
