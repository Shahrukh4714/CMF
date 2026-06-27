import type { ToolCategory, FormatDefinition } from "@/data/tools";
import { FORMATS } from "@/data/tools";

interface FAQItem {
  q: string;
  a: string;
}

function generateCategoryFAQs(category: ToolCategory): FAQItem[] {
  const name = category.name;
  const isImage = category.id === "image";
  const isDoc = category.id === "document";
  const isVideo = category.id === "video";
  const isAudio = category.id === "audio";

  const formatList = Object.values(FORMATS)
    .filter((f) => {
      if (isImage) return f.family === "raster" || f.family === "vector";
      if (isDoc) return f.family === "document" || f.family === "text" || f.family === "data" || f.family === "markup";
      if (isVideo) return f.family === "video";
      if (isAudio) return f.family === "audio";
      return false;
    })
    .map((f) => f.ext.toUpperCase());

  const faqs: FAQItem[] = [
    {
      q: `What ${name.toLowerCase()} formats do you support?`,
      a: `We support a wide range of ${name.toLowerCase()} formats including ${formatList.slice(0, 6).join(", ")}${formatList.length > 6 ? `, and more` : ""}. All conversions are handled entirely in your browser.`,
    },
    {
      q: `Is it safe to convert ${name.toLowerCase()} files online?`,
      a: `Yes, absolutely. Unlike other online converters, Convertmyfiles never uploads your files to a server. All ${name.toLowerCase()} conversion happens locally in your browser using client-side technologies. Your files remain on your device and are permanently deleted when you close the page.`,
    },
    {
      q: `Are these ${name.toLowerCase()} tools really free?`,
      a: `Yes, every ${name.toLowerCase()} tool on Convertmyfiles is completely free with no hidden costs, no premium tiers, and no credit card required. You can convert as many files as you want, as often as you like, without any limitations.`,
    },
    {
      q: `Do I need to create an account to use ${name.toLowerCase()} tools?`,
      a: `No account, email, or personal information is needed. Simply visit any tool page, upload your file, and convert. We believe online tools should be accessible to everyone without barriers.`,
    },
    {
      q: `What is the maximum file size for ${name.toLowerCase()} conversions?`,
      a: `There is no hard file size limit. However, since conversion happens in your browser, very large files may use significant memory. For the best experience, we recommend files under 50MB. Your browser may have its own memory limitations for extremely large files.`,
    },
    {
      q: `Can I use ${name.toLowerCase()} tools on my phone or tablet?`,
      a: `Yes, all our ${name.toLowerCase()} tools work perfectly on any device with a modern web browser - including smartphones and tablets. The interface is fully responsive and touch-friendly. No app download is required.`,
    },
    {
      q: `How fast are ${name.toLowerCase()} conversions?`,
      a: `Conversions are nearly instantaneous. Since everything runs locally on your device, there is no upload or download time. Most ${name.toLowerCase()} conversions complete in under a second, though larger files may take slightly longer depending on your device's processing power.`,
    },
  ];

  return faqs;
}

interface CategoryFAQProps {
  category: ToolCategory;
}

export function CategoryFAQ({ category }: CategoryFAQProps) {
  const faqs = generateCategoryFAQs(category);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section className="py-12 sm:py-16 border-t border-border-default">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-body-subtle">
            Frequently asked questions
          </h2>
          <p className="text-sm text-body">
            Everything you need to know about our {category.name.toLowerCase()} tools
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-base border border-border-default overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-heading cursor-pointer list-none">
                {faq.q}
                <svg
                  className="h-4 w-4 shrink-0 text-body transition-transform group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-sm text-body leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
