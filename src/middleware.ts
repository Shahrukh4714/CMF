import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OLD_CATEGORY_SLUGS: Record<string, string> = {
  "/tools#image": "/tools/image-tools",
  "/tools#document": "/tools/pdf-tools",
  "/tools#video": "/tools/video-tools",
  "/tools#audio": "/tools/audio-tools",
  "/tools#other": "/tools/developer-tools",
};

export function middleware(request: NextRequest) {
  const { pathname, hash } = new URL(request.url);

  // Redirect old /tools#hash links to new /tools/{category} pages
  if (pathname === "/tools" && hash) {
    const redirect = OLD_CATEGORY_SLUGS[`/tools#${hash}`];
    if (redirect) {
      return NextResponse.redirect(new URL(redirect, request.url), 301);
    }
  }

  // Enforce trailing slash redirects for canonical URLs
  const cleanPath = pathname.replace(/\/+$/, "");
  if (cleanPath !== pathname && cleanPath.length > 1) {
    return NextResponse.redirect(new URL(cleanPath, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.svg|og-image\\.svg|robots\\.txt|sitemap\\.xml).*)",
  ],
};
