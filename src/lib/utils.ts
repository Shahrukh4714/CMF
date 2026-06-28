import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DAILY_LIMIT } from "./limits";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function getMimeType(extension: string): string {
  const mimeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    mp4: "video/mp4",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    txt: "text/plain",
  };
  return mimeMap[extension] || "application/octet-stream";
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateOutputFilename(inputName: string, outputFormat: string): string {
  const base = inputName.replace(/\.[^.]+$/, "");
  return `${base}.${outputFormat}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Daily conversion limit ──

const USAGE_KEY = "convertit_usage_today";

export function getDailyUsage(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(USAGE_KEY);
  if (!raw) return 0;
  try {
    const { date, count } = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    return date === today ? count : 0;
  } catch {
    return 0;
  }
}

export function incrementDailyUsage(): number {
  const today = new Date().toISOString().slice(0, 10);
  const count = getDailyUsage() + 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count }));
  return count;
}

export function isDailyLimitReached(): boolean {
  return getDailyUsage() >= DAILY_LIMIT;
}

export function getDailyLimit(): number {
  return DAILY_LIMIT;
}

export function getRemainingConversions(): number {
  return Math.max(0, DAILY_LIMIT - getDailyUsage());
}
