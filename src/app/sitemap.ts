import { MetadataRoute } from "next";
import { getAllTools, CATEGORIES, CATEGORY_URLS, FORMATS } from "@/data/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://convertit.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/formats`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/tools/${CATEGORY_URLS[cat.id]}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${baseUrl}/convert/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: tool.popular ? 0.9 : 0.6,
  }));

  const formatPages: MetadataRoute.Sitemap = Object.keys(FORMATS).map((ext) => ({
    url: `${baseUrl}/format/${ext}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: FORMATS[ext].popular ? 0.7 : 0.5,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...formatPages];
}
