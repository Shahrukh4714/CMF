import type { Metadata } from "next";
import type { ToolDefinition, ToolCategory, ToolFaqEntry } from "@/data/tools";

export const SITE_URL = "https://convertmyfiles.com";
export const SITE_NAME = "Convertmyfiles";
export const DEFAULT_OG_IMAGE = "/og-image.svg";
export const TWITTER_HANDLE = "@convertmyfiles";

export function siteUrl(path = ""): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return clean ? `${SITE_URL}/${clean}` : SITE_URL;
}

export function generateBaseMetadata({
  title,
  description,
  path,
  ogImage,
  robots,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  robots?: { index?: boolean; follow?: boolean };
}): Metadata {
  const url = path ? siteUrl(path) : siteUrl();
  const image = ogImage || siteUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: {
      index: robots?.index ?? true,
      follow: robots?.follow ?? true,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description,
      images: [image],
    },
  };
}

export function generateToolMetadata(tool: ToolDefinition): Metadata {
  return generateBaseMetadata({
    title: tool.seo.title,
    description: tool.seo.description,
    path: `convert/${tool.slug}`,
    ogImage: undefined,
  });
}

export function generateCategoryMetadata(
  category: ToolCategory,
  urlSlug: string
): Metadata {
  const title = `${category.name} Tools — Free Online Converter | Convertmyfiles`;
  const description = `Free online ${category.name.toLowerCase()} converter tools. Convert and transform ${category.name.toLowerCase()} files directly in your browser. 100% private, no upload required.`;
  return generateBaseMetadata({
    title,
    description,
    path: `tools/${urlSlug}`,
    robots: { index: true, follow: true },
  });
}

// ── JSON-LD Generators ─────────────────────────────────────────────

export function generateToolJsonLd(tool: ToolDefinition) {
  const url = siteUrl(`convert/${tool.slug}`);
  const inputName = tool.inputFormat.name;
  const outputName = tool.outputFormat?.name || tool.outputFormats[0].toUpperCase();
  const isSameFormat = tool.inputFormat.ext === (tool.outputFormat?.ext || tool.outputFormats[0]);
  const howToSteps = tool.content?.howToGuide || [];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.seo.description,
    url,
    applicationCategory: "Multimedia",
    operatingSystem: "Web",
    browserRequirements: "Modern browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Free online converter",
      "100% browser-based",
      "No upload required",
      "Privacy first",
      "Fast conversion",
    ],
  };

  // Add HowTo schema with real steps from content generator
  if (!isSameFormat && howToSteps.length > 0) {
    schema.mainEntity = {
      "@type": "HowTo",
      name: tool.content?.h1 || `How to convert ${inputName} to ${outputName}`,
      description: `Step-by-step guide to convert ${inputName} files to ${outputName} using our free online tool.`,
      step: howToSteps.map((s) => ({
        "@type": "HowToStep",
        position: s.step,
        name: s.title,
        text: s.description,
      })),
    };
  }

  // Add FAQPage schema if tool has FAQ data
  if (tool.faq && tool.faq.length > 0) {
    schema.mainEntityOfPage = {
      "@type": "FAQPage",
      mainEntity: tool.faq.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    };
  }

  return schema;
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: siteUrl(item.url),
    })),
  };
}

export function generateCategoryJsonLd(category: ToolCategory, toolCount: number, urlSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Converter Tools`,
    description: category.description,
    url: siteUrl(`tools/${urlSlug}`),
    numberOfItems: toolCount,
  };
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description: "Universal file converter. Private, fast, and free — all processing happens in your browser.",
    url: SITE_URL,
    applicationCategory: "Multimedia",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    browserRequirements: "Modern browser with JavaScript enabled",
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Universal file converter. Private, fast, and free.",
    sameAs: [],
  };
}

export function generateFAQJsonLd(faqs: { q: string; a: string }[]) {
  return {
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
}
