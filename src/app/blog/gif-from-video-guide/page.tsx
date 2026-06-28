import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Make a GIF from a Video (Free & Easy) | Convertmyfiles Blog",
  description:
    "Learn how to make a GIF from a video in seconds — no software needed. Perfect for memes, tutorials, and social media. Your files never leave your device.",
  openGraph: {
    title: "How to Make a GIF from a Video (Free & Easy) | Convertmyfiles Blog",
    description:
      "Learn how to make a GIF from a video in seconds — no software needed. Perfect for memes, tutorials, and social media. Your files never leave your device.",
    url: "https://convertmyfiles.com/blog/gif-from-video-guide",
    siteName: "Convertmyfiles",
    type: "article",
  },
};

export default function GifFromVideoGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <h1 className="text-heading text-4xl font-bold mb-4">
        How to Make a GIF from a Video — Free, Fast, and Private
      </h1>
      <p className="text-body-subtle text-lg mb-10">
        Animated GIFs are everywhere — in Slack threads, Reddit comments, Twitter feeds, and
        product docs. If you have a video clip and want to turn a moment into a shareable loop,
        here is everything you need to know, including how to do it in your browser without
        installing a single app.
      </p>

      {/* Section 1: Why GIFs */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          Why Turn a Video into a GIF?
        </h2>
        <p className="text-body mb-4">
          GIFs occupy a unique space between a static image and a full video. They autoplay
          silently, loop endlessly, and load almost anywhere — no video player, no codec, no
          sound controls required. That makes them the go-to format for:
        </p>
        <ul className="list-disc list-inside space-y-2 text-body pl-2">
          <li>
            <span className="font-medium">Memes and reaction clips</span> — capture the exact
            three-second moment that says everything.
          </li>
          <li>
            <span className="font-medium">Product tutorials and demos</span> — show a UI
            interaction inline in a README or help article without embedding a video player.
          </li>
          <li>
            <span className="font-medium">Social media content</span> — GIFs render natively on
            most platforms and draw the eye better than a static thumbnail.
          </li>
          <li>
            <span className="font-medium">Presentations and email</span> — drop a looping
            animation directly into a slide or a marketing email.
          </li>
        </ul>
      </section>

      {/* Section 2: GIF vs Video */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          GIF vs. Video — What&apos;s the Difference?
        </h2>
        <p className="text-body mb-4">
          GIF (Graphics Interchange Format) was invented in 1987, so it carries some baggage. It
          supports a maximum palette of 256 colours per frame, which means footage with lots of
          colour gradients looks noticeably different from the original. Video formats like MP4
          use modern codecs (H.264, H.265) that compress efficiently and preserve millions of
          colours — but they require a player and user interaction to play.
        </p>
        <p className="text-body">
          The tradeoff is universality versus quality. Use GIFs when you need something that
          just works everywhere. Use video when quality and audio matter.
        </p>
      </section>

      {/* Section 3: Keep File Size Small */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          Tips for Keeping Your GIF File Size Small
        </h2>
        <p className="text-body mb-4">
          GIFs get large fast. A 10-second clip at full resolution can easily balloon past 20 MB,
          which kills page load times and breaks upload limits. Here is how to stay lean:
        </p>
        <div className="space-y-4">
          <div className="card-base p-5 rounded-xl border border-border-default bg-neutral-primary-soft">
            <h3 className="text-heading font-semibold mb-1">⏱ Keep it short — under 5 seconds</h3>
            <p className="text-body-subtle text-sm">
              The single biggest lever. Trim your clip to only the essential moment. Most
              effective GIFs are 2–4 seconds long.
            </p>
          </div>
          <div className="card-base p-5 rounded-xl border border-border-default bg-neutral-primary-soft">
            <h3 className="text-heading font-semibold mb-1">🎞 Lower the frame rate to 10–15 fps</h3>
            <p className="text-body-subtle text-sm">
              Standard video runs at 24–60 fps. GIFs look smooth at 10–15 fps and are roughly
              half the size.
            </p>
          </div>
          <div className="card-base p-5 rounded-xl border border-border-default bg-neutral-primary-soft">
            <h3 className="text-heading font-semibold mb-1">📐 Reduce the resolution</h3>
            <p className="text-body-subtle text-sm">
              480px wide is plenty for most web uses. Going from 1080p to 480p can cut file size
              by 80% with almost no perceptible difference on screen.
            </p>
          </div>
          <div className="card-base p-5 rounded-xl border border-border-default bg-neutral-primary-soft">
            <h3 className="text-heading font-semibold mb-1">🎨 Limit colour complexity</h3>
            <p className="text-body-subtle text-sm">
              Clips with simple backgrounds and minimal motion compress best. High-action footage
              with lots of colour change will always be larger.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: How to use Convertmyfiles */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-3">
          How to Make a GIF from a Video Using Convertmyfiles
        </h2>
        <p className="text-body mb-5">
          Our{" "}
          <Link href="/convert/video-to-gif" className="text-fg-brand underline underline-offset-2 hover:opacity-80 transition-opacity">
            Video to GIF converter
          </Link>{" "}
          runs entirely in your browser using WebAssembly. Your files never leave your device —
          nothing is uploaded to any server. Here is how to use it:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-body pl-2">
          <li>
            <span className="font-medium">Open the tool.</span> Head to{" "}
            <Link href="/convert/video-to-gif" className="text-fg-brand underline underline-offset-2 hover:opacity-80 transition-opacity">
              convertmyfiles.com/convert/video-to-gif
            </Link>
            .
          </li>
          <li>
            <span className="font-medium">Upload your video.</span> Click the upload area or drag
            and drop your file. Supported formats include MP4, MOV, AVI, MKV, and WebM.
          </li>
          <li>
            <span className="font-medium">Set your options.</span> Adjust frame rate, output
            width, and clip duration to control the final GIF size.
          </li>
          <li>
            <span className="font-medium">Convert.</span> Click the Convert button. Processing
            happens locally in your browser — no waiting for server uploads.
          </li>
          <li>
            <span className="font-medium">Download your GIF.</span> Preview the result and
            download it instantly.
          </li>
        </ol>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-heading text-2xl font-semibold mb-5">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-heading font-semibold mb-1">
              Is there a file size limit for the video I upload?
            </h3>
            <p className="text-body-subtle">
              Because conversion happens in your browser, the practical limit depends on your
              device&apos;s memory rather than a server restriction. Most videos under 500 MB convert
              without any issues on a modern laptop or desktop.
            </p>
          </div>
          <div>
            <h3 className="text-heading font-semibold mb-1">
              Will my GIF have sound?
            </h3>
            <p className="text-body-subtle">
              No — the GIF format does not support audio. The output will be silent. If you need a
              looping clip with sound, consider converting to WebM or MP4 instead.
            </p>
          </div>
          <div>
            <h3 className="text-heading font-semibold mb-1">
              What video formats can I convert to GIF?
            </h3>
            <p className="text-body-subtle">
              Our tool supports the most common video formats: MP4, MOV, AVI, MKV, and WebM. If
              you have a less common format, try converting it to MP4 first using our{" "}
              <Link href="/convert/video-to-mp4" className="text-fg-brand underline underline-offset-2 hover:opacity-80 transition-opacity">
                video to MP4 converter
              </Link>
              , then convert to GIF.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="card-base rounded-2xl border border-border-default bg-neutral-primary-soft p-8 text-center">
        <h2 className="text-heading text-2xl font-bold mb-3">
          Ready to Make Your GIF?
        </h2>
        <p className="text-body-subtle mb-6">
          No account. No upload. No waiting. Convert your video to an animated GIF right in your
          browser — completely free.
        </p>
        <Link
          href="/convert/video-to-gif"
          className="inline-block bg-fg-brand text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Convert Video to GIF →
        </Link>
      </section>
    </main>
  );
}
