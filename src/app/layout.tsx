import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#DC2626",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://convertmyfiles.com"),
  title: {
    default: "Convertmyfiles \u2014 Convert files privately",
    template: "%s | Convertmyfiles",
  },
  description: "Everything runs in your browser. No uploads, no accounts, your files never leave your device.",
  openGraph: {
    type: "website",
    siteName: "Convertmyfiles",
    title: "Convertmyfiles \u2014 Convert files privately",
    description: "Everything runs in your browser. No uploads, no accounts, your files never leave your device.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convertmyfiles \u2014 Convert files privately",
    description: "Everything runs in your browser. No uploads, no accounts, your files never leave your device.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={[dmSans.variable, dmMono.variable].join(" ")} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem("cmf-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t);else document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`
        }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
