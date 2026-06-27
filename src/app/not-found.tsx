import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { NotFoundClient } from "@/components/NotFoundClient";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Convertmyfiles",
  description: "The page or converter tool you're looking for doesn't exist. Browse all available conversion tools on Convertmyfiles.",
  alternates: { canonical: siteUrl() },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundClient />;
}
