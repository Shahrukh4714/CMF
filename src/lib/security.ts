import { NextRequest } from "next/server";
import { DAILY_LIMIT } from "./limits";

// ── Cryptographic Session Helpers using Web Crypto API ──
const ENCODER = new TextEncoder();
const SECRET = process.env.APP_SECRET || "convertit-default-secret-key-for-session-protection";

async function getCryptoKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(payload: string): Promise<string> {
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    ENCODER.encode(payload)
  );
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${signatureHex}`;
}

export async function verifyToken(token: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signatureHex] = parts;
  
  if (!signatureHex.match(/^[0-9a-fA-F]{64}$/)) return null;

  try {
    const key = await getCryptoKey();
    const signatureBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    const verified = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      ENCODER.encode(payload)
    );
    return verified ? payload : null;
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}

// ── Dual-Mode Rate Limiter ──
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Global store to persist across requests on the same instance
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up store every hour
if (typeof global !== "undefined") {
  const g = global as any;
  if (!g.rateLimitInterval) {
    g.rateLimitInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime) {
          rateLimitStore.delete(key);
        }
      }
    }, 60 * 60 * 1000);
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(
  ip: string,
  sessionId: string
): Promise<RateLimitResult> {
  const limit = DAILY_LIMIT; // centralized conversions per day limit
  const windowMs = 24 * 60 * 60 * 1000; // 24 hours

  // 1. Check if Upstash / Vercel KV is configured
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const vercelKvUrl = process.env.KV_REST_API_URL;
  const vercelKvToken = process.env.KV_REST_API_TOKEN;

  if ((upstashUrl && upstashToken) || (vercelKvUrl && vercelKvToken)) {
    try {
      // Use dynamic imports to prevent require issues
      const { Redis } = await import("@upstash/redis");
      const { Ratelimit } = await import("@upstash/ratelimit");

      const redis = upstashUrl
        ? new Redis({ url: upstashUrl, token: upstashToken })
        : new Redis({ url: vercelKvUrl!, token: vercelKvToken! });

      // Create a sliding window rate limiter: 5 requests per 24 hours
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, "24 h"),
        analytics: true,
        prefix: "@upstash/ratelimit/convertit",
      });

      // We combine IP and SessionId for the identifier
      const identifier = `ratelimit:${ip}:${sessionId}`;
      const result = await ratelimit.limit(identifier);

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (err) {
      console.error("Upstash rate limit failed, falling back to in-memory:", err);
    }
  }

  // 2. Fallback to In-Memory rate limiting
  const key = `${ip}:${sessionId}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

// ── Validation Allowlist ──
const VALID_CONVERSIONS: Record<string, string[]> = {
  "jpg": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf", "txt"],
  "jpeg": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf", "txt"],
  "png": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf", "txt"],
  "webp": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf", "txt"],
  "gif": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf"],
  "bmp": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf"],
  "svg": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "png", "jpg"],
  "tiff": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf", "txt"],
  "avif": ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif", "pdf"],
  "docx": ["html", "txt", "pdf"],
  "txt": ["html", "pdf", "xlsx"],
  "html": ["txt"],
  "md": ["html", "txt"],
  "markdown": ["html", "txt"],
  "csv": ["json", "xlsx"],
  "json": ["csv", "xlsx"],
  "xlsx": ["csv", "json", "pdf"],
  "xml": ["json"],
  "pdf": ["txt", "docx", "xlsx"],
  "epub": ["pdf"],
};

export function isValidConversion(from: string, to: string, action?: string | null): boolean {
  const fromClean = from.toLowerCase();
  const toClean = to.toLowerCase();

  // 1. Special check for Image -> TXT (OCR)
  const imageFormats = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif"];
  if (["png", "jpg", "jpeg", "webp", "tiff"].includes(fromClean) && toClean === "txt" && action === "ocr") {
    return true;
  }

  // 2. Special check for CSV/JSON/TXT -> XLSX
  if (["csv", "json", "txt"].includes(fromClean) && toClean === "xlsx") {
    return true;
  }

  // 3. Regular allowlist check
  const allowed = VALID_CONVERSIONS[fromClean];
  if (!allowed) return false;

  // SVG to PNG/JPG is supported, but general SVG output is not
  if (fromClean === "svg") {
    return toClean === "png" || toClean === "jpg" || toClean === "jpeg";
  }
  if (toClean === "svg") {
    return false;
  }

  return allowed.includes(toClean);
}
