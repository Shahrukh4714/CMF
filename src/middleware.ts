import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signToken, verifyToken, checkRateLimit } from "@/lib/security";

const OLD_CATEGORY_SLUGS: Record<string, string> = {
  "/tools#image": "/tools/image-tools",
  "/tools#document": "/tools/pdf-tools",
  "/tools#video": "/tools/video-tools",
  "/tools#audio": "/tools/audio-tools",
  "/tools#other": "/tools/developer-tools",
};

export async function middleware(request: NextRequest) {
  const { pathname, hash } = new URL(request.url);

  // 1. Handle secure conversions API route (/api/convert)
  if (pathname === "/api/convert") {
    // A. CSRF check: check sec-fetch-site header or referer/origin
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const secFetchSite = request.headers.get("sec-fetch-site");
    const host = request.headers.get("host");

    if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
      return NextResponse.json({ error: "Forbidden: cross-origin API request blocked" }, { status: 403 });
    }

    if (origin) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ error: "Forbidden: Origin mismatch" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Forbidden: Invalid Origin header" }, { status: 403 });
      }
    } else if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.host !== host) {
          return NextResponse.json({ error: "Forbidden: Referer mismatch" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Forbidden: Invalid Referer header" }, { status: 403 });
      }
    }

    // B. Session Authentication check
    const sessionCookie = request.cookies.get("convertit_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized: Missing session token" }, { status: 401 });
    }

    const sessionId = await verifyToken(sessionCookie);
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired session" }, { status: 401 });
    }

    // C. Server-side Rate Limiting check
    const ip = (request as any).ip || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimit = await checkRateLimit(ip, sessionId);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too Many Requests: Daily server-side conversion limit reached" },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(rateLimit.reset / 1000).toString(),
          },
        }
      );
    }

    // Proceed to API route handler and attach rate limit headers
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", rateLimit.limit.toString());
    response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString());
    response.headers.set("X-RateLimit-Reset", Math.ceil(rateLimit.reset / 1000).toString());
    return response;
  }

  // 2. Redirect old /tools#hash links to new /tools/{category} pages
  if (pathname === "/tools" && hash) {
    const redirect = OLD_CATEGORY_SLUGS[`/tools#${hash}`];
    if (redirect) {
      return NextResponse.redirect(new URL(redirect, request.url), 301);
    }
  }

  // 3. Enforce trailing slash redirects for canonical URLs
  const cleanPath = pathname.replace(/\/+$/, "");
  if (cleanPath !== pathname && cleanPath.length > 1) {
    return NextResponse.redirect(new URL(cleanPath, request.url), 308);
  }

  // 4. Session cookie assignment for regular browser pages
  const response = NextResponse.next();
  const sessionCookie = request.cookies.get("convertit_session")?.value;
  let isSessionValid = false;

  if (sessionCookie) {
    const validSession = await verifyToken(sessionCookie);
    if (validSession) {
      isSessionValid = true;
    }
  }

  if (!isSessionValid) {
    const newSessionId = crypto.randomUUID();
    const token = await signToken(newSessionId);
    response.cookies.set("convertit_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Intercept convert API route and all pages (excluding statics, icons, robots, and sitemaps)
    "/api/convert",
    "/((?!_next/static|_next/image|favicon\\.svg|og-image\\.svg|robots\\.txt|sitemap\\.xml).*)",
  ],
};
