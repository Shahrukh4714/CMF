"use client";

export interface ErrorLogEntry {
  timestamp: string;
  message: string;
  stack?: string;
  toolSlug?: string;
  fileName?: string;
  fileSize?: number;
  userAgent?: string;
}

const STORAGE_KEY = "cmf_error_logs";
const MAX_LOGS = 20;

export function trackError(error: unknown, context?: { toolSlug?: string; fileName?: string; fileSize?: number }) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  
  const entry: ErrorLogEntry = {
    timestamp: new Date().toISOString(),
    message,
    stack,
    toolSlug: context?.toolSlug,
    fileName: context?.fileName,
    fileSize: context?.fileSize,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
  };

  // 1. Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Telemetry captured error:", entry);
  }

  if (typeof window === "undefined") return;

  // 2. Dispatch to external endpoint if configured via env
  const endpoint = process.env.NEXT_PUBLIC_TELEMETRY_URL;
  if (endpoint) {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    }).catch((e) => console.warn("Failed to dispatch telemetry error:", e));
  }

  // 3. Save to local storage circular buffer for user self-reporting
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const logs: ErrorLogEntry[] = raw ? JSON.parse(raw) : [];
    
    // Add to start of list
    logs.unshift(entry);
    
    // Cap at MAX_LOGS
    if (logs.length > MAX_LOGS) {
      logs.length = MAX_LOGS;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    // Ignore local storage quota limits
  }
}

export function getErrorLogs(): ErrorLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearErrorLogs() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
