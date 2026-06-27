import type { ConversionOptions, ConversionResult, Engine } from "./engine";
import { engineRegistry } from "./engine";
import YAML from "yaml";
import SparkMD5 from "spark-md5";

// ── JSON Formatter / Validator ──
function formatJson(text: string): string {
  const parsed = JSON.parse(text);
  return JSON.stringify(parsed, null, 2);
}

function minifyJson(text: string): string {
  const parsed = JSON.parse(text);
  return JSON.stringify(parsed);
}

function validateJson(text: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(text);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

// ── JSON ↔ YAML ──
async function convertJsonToYaml(file: File): Promise<ConversionResult> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const yaml = YAML.stringify(parsed);
  return { blob: new Blob([yaml], { type: "text/yaml" }), filename: file.name.replace(/\.[^.]+$/, ".yaml") };
}

async function convertYamlToJson(file: File): Promise<ConversionResult> {
  const text = await file.text();
  const parsed = YAML.parse(text);
  const json = JSON.stringify(parsed, null, 2);
  return { blob: new Blob([json], { type: "application/json" }), filename: file.name.replace(/\.[^.]+$/, ".json") };
}

// ── XML Formatter ──
function formatXml(text: string): string {
  let formatted = "";
  let indent = 0;
  const tokens = text.replace(/>\s*</g, ">\n<").split("\n");
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
    }
    formatted += "  ".repeat(indent) + trimmed + "\n";
    if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !trimmed.startsWith("<?") && !trimmed.startsWith("<!")) {
      indent++;
    }
  }
  return formatted.trim();
}

// ── Base64 ──
function base64Encode(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(text: string): string {
  return decodeURIComponent(escape(atob(text)));
}

async function convertBase64(file: File, action: "encode" | "decode"): Promise<ConversionResult> {
  const text = await file.text();
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const result = action === "encode" ? base64Encode(text) : base64Decode(text);
  return {
    blob: new Blob([result], { type: "text/plain" }),
    filename: action === "encode" ? `${baseName}_encoded.txt` : `${baseName}_decoded.txt`,
  };
}

// ── URL Encode/Decode ──
async function convertUrl(file: File, action: "encode" | "decode"): Promise<ConversionResult> {
  const text = await file.text();
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const result = action === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
  return {
    blob: new Blob([result], { type: "text/plain" }),
    filename: action === "encode" ? `${baseName}_url_encoded.txt` : `${baseName}_url_decoded.txt`,
  };
}

// ── Hash Generators (Web Crypto / SparkMD5) ──
async function generateHash(text: string, algorithm: "MD5" | "SHA-1" | "SHA-256" | "SHA-512"): Promise<string> {
  if (algorithm === "MD5") {
    return SparkMD5.hash(text);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest(algorithm as "SHA-1" | "SHA-256" | "SHA-512", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function convertHash(file: File, algorithm: string): Promise<ConversionResult> {
  const text = await file.text();
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const hash = await generateHash(text, algorithm as any);
  return {
    blob: new Blob([hash], { type: "text/plain" }),
    filename: `${baseName}_${algorithm.toLowerCase().replace("-", "")}.txt`,
  };
}

// ── CSV ↔ JSON (re-exported from converters.ts for engine integration) ──
async function csvToJson(text: string): Promise<string> {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must have headers and at least one row");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const result: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
    result.push(row);
  }
  return JSON.stringify(result, null, 2);
}

async function jsonToCsv(text: string): Promise<string> {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) throw new Error("Empty JSON array");
  const headers = Object.keys(arr[0]);
  const csvRows = [headers.join(",")];
  for (const row of arr) {
    csvRows.push(
      headers
        .map((h) => {
          const val = row[h];
          const str = val == null ? "" : String(val);
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    );
  }
  return csvRows.join("\n");
}

// ── HTML Formatter ──
function formatHtml(text: string): string {
  let formatted = text
    .replace(/>\s*</g, ">\n<")
    .replace(/<\/(\w+)>/g, "</$1>\n")
    .replace(/<(\w+)([^>]*)>/g, "<$1$2>\n");
  const lines = formatted.split("\n").filter(Boolean);
  let indent = 0;
  const result: string[] = [];
  for (const line of lines) {
    if (line.startsWith("</")) indent = Math.max(0, indent - 1);
    result.push("  ".repeat(indent) + line);
    if (line.startsWith("<") && !line.startsWith("</") && !line.endsWith("/>") && !line.startsWith("<!--")) indent++;
  }
  return result.join("\n");
}

// ── CSS Formatter ──
function formatCss(text: string): string {
  return text
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/}\s*/g, "}\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

// ── CSS Minifier ──
function minifyCss(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;\s*}/g, "}")
    .replace(/;+/g, ";")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Title Case ──
function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// ── Text Counter ──
function countText(text: string): string {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  return `Characters: ${chars}\nCharacters (no spaces): ${charsNoSpaces}\nWords: ${words}\nLines: ${lines}`;
}

// ── Strip Markdown ──
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^>+\s/gm, "")
    .replace(/^[-*+]\s/gm, "- ")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^---$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── HTML to Markdown (basic) ──
function htmlToMarkdown(html: string): string {
  return html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (_: string, text: string) => `## ${stripHtml(text)}\n`)
    .replace(/<p[^>]*>(.*?)<\/p>/gi, (_: string, text: string) => `${stripHtml(text)}\n\n`)
    .replace(/<li[^>]*>(.*?)<\/li>/gi, (_: string, text: string) => `- ${stripHtml(text)}\n`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Markdown to HTML (basic) ──
function markdownToHtml(md: string): string {
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withParagraphs = escaped
    .split(/\n{2,}/)
    .map((block) => {
      if (/^#{1,6}\s/.test(block)) {
        const level = block.match(/^#+/)![0].length;
        return `<h${level}>${block.replace(/^#+\s+/, "")}</h${level}>`;
      }
      if (/^[-*+]\s/.test(block)) {
        const items = block.split("\n").map((l) => `<li>${l.replace(/^[-*+]\s+/, "")}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
  return withParagraphs
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// ── Strip HTML tags ──
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// ── Text to HTML ──
function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted Text</title></head><body>\n${paragraphs}\n</body></html>`;
}

// ── Text to Markdown ──
function textToMarkdown(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

// ── UUID Generator ──
function generateUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ── API fallback for Developer Conversions ──
async function convertViaApi(file: File, from: string, to: string, action?: string): Promise<ConversionResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("from", from);
  formData.append("to", to);
  if (action) formData.append("action", action);

  const res = await fetch("/api/convert", { method: "POST", body: formData });
  if (!res.ok) {
    let errMsg = "Conversion failed";
    try {
      const err = await res.json();
      if (err && err.error) errMsg = err.error;
    } catch {
      // use default fallback message
    }
    throw { message: errMsg };
  }

  const blob = await res.blob();
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return { blob, filename: `${baseName}.${to}` };
}

// ── Create Developer Engine ──
function createDeveloperEngine(id: string): Engine {
  return {
    id,
    name: "Developer Engine",
    async convert(file: File, options: ConversionOptions = {}) {
      let action = options.toolSlug || options.action || "";

      // Resolve format action shorthand (e.g. action="json" or "csv") to tool slugs (e.g. "csv-to-json")
      if (action && !action.includes("-to-") && !action.includes("case-") && !action.startsWith("base64-") && !action.startsWith("url-")) {
        const inExt = file.name.split(".").pop()?.toLowerCase();
        const outExt = action.toLowerCase();
        const supportedDevExts = ["json", "xml", "csv", "yaml", "html", "css", "md", "txt"];
        if (inExt && supportedDevExts.includes(inExt) && supportedDevExts.includes(outExt) && inExt !== outExt) {
          action = `${inExt}-to-${outExt}`;
        }
      }

      // Normalize slugs to developer engine actions
      if (action === "text-to-uppercase") action = "case-upper";
      else if (action === "text-to-lowercase") action = "case-lower";
      else if (action === "text-to-titlecase") action = "case-title";
      else if (action === "word-counter") action = "count";
      else if (action === "text-reverser") action = "reverse";
      else if (action === "css-minifier") action = "css-minify";
      else if (action === "uuid-generator") action = "uuid";
      else if (action === "hash-generator") action = "hash";
      else if (action === "image-to-text") {
        const ext = file.name.split(".").pop()?.toLowerCase() || "png";
        return convertViaApi(file, ext, "txt", "ocr");
      }

      const text = await file.text();
      const baseName = file.name.replace(/\.[^.]+$/, "");

      switch (action) {
        case "json-format":
          return { blob: new Blob([formatJson(text)], { type: "application/json" }), filename: `${baseName}.json` };
        case "json-minify":
          return { blob: new Blob([minifyJson(text)], { type: "application/json" }), filename: `${baseName}.json` };
        case "json-validate": {
          const result = validateJson(text);
          const output = result.valid ? "Valid JSON" : `Invalid JSON: ${result.error}`;
          return { blob: new Blob([output], { type: "text/plain" }), filename: `${baseName}_validation.txt` };
        }
        case "json-to-yaml":
          return convertJsonToYaml(file);
        case "yaml-to-json":
          return convertYamlToJson(file);
        case "csv-to-json": {
          const json = await csvToJson(text);
          return { blob: new Blob([json], { type: "application/json" }), filename: `${baseName}.json` };
        }
        case "json-to-csv": {
          const csv = await jsonToCsv(text);
          return { blob: new Blob([csv], { type: "text/csv" }), filename: `${baseName}.csv` };
        }
        case "xml-format":
          return { blob: new Blob([formatXml(text)], { type: "application/xml" }), filename: `${baseName}.xml` };
        case "json-to-xml": {
          const parsed = JSON.parse(text);
          const jsonToXml = (obj: unknown, name = "root"): string => {
            if (obj === null || obj === undefined) return `<${name}/>`;
            if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean")
              return `<${name}>${String(obj).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${name}>`;
            if (Array.isArray(obj)) return obj.map((item) => jsonToXml(item, name)).join("\n");
            const entries = Object.entries(obj as Record<string, unknown>);
            return `<${name}>\n${entries.map(([k, v]) => jsonToXml(v, k)).join("\n")}\n</${name}>`;
          };
          const xml = jsonToXml(parsed);
          return { blob: new Blob([xml], { type: "application/xml" }), filename: `${baseName}.xml` };
        }
      case "csv-to-xml": {
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error("CSV must have headers and at least one row");
        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
        const rows = lines.slice(1).map((line) => {
          const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
          return obj;
        });
        const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${rows.map((r) => `  <row>\n${Object.entries(r).map(([k, v]) => `    <${k}>${esc(v)}</${k}>`).join("\n")}\n  </row>`).join("\n")}\n</root>`;
        return { blob: new Blob([xml], { type: "application/xml" }), filename: `${baseName}.xml` };
      }
      case "xml-to-csv": {
        const parser = new (await import("xmldom")).DOMParser();
        const doc = parser.parseFromString(text, "text/xml");
        const root = doc.documentElement;
        const rows = Array.from(root.getElementsByTagName(root.childNodes[0] ? (root.childNodes[0] as Element).tagName : "row"));
        const allKeys = new Set<string>();
        const rowData: Record<string, string>[] = [];
        for (const row of rows) {
          const obj: Record<string, string> = {};
          for (let i = 0; i < row.childNodes.length; i++) {
            const child = row.childNodes[i];
            if (child.nodeType === 1) {
              const tag = (child as Element).tagName;
              const val = (child.textContent || "").trim();
              obj[tag] = val;
              allKeys.add(tag);
            }
          }
          rowData.push(obj);
        }
        const keys = Array.from(allKeys);
        const escCsv = (s: string) => s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
        const csv = [keys.join(","), ...rowData.map((r) => keys.map((k) => escCsv(r[k] || "")).join(","))].join("\n");
        return { blob: new Blob([csv], { type: "text/csv" }), filename: `${baseName}.csv` };
      }
      case "html-format":
          return { blob: new Blob([formatHtml(text)], { type: "text/html" }), filename: `${baseName}.html` };
        case "css-format":
          return { blob: new Blob([formatCss(text)], { type: "text/css" }), filename: `${baseName}.css` };
        case "css-minify":
          return { blob: new Blob([minifyCss(text)], { type: "text/css" }), filename: `${baseName}.min.css` };
        case "base64-encode":
        case "base64-decode":
          return convertBase64(file, action === "base64-encode" ? "encode" : "decode");
        case "url-encode":
        case "url-decode":
          return convertUrl(file, action === "url-encode" ? "encode" : "decode");
        case "hash":
          return convertHash(file, options.algorithm || "SHA-256");
        case "uuid":
          return { blob: new Blob([generateUuid()], { type: "text/plain" }), filename: "uuid.txt" };
        case "case-upper":
          return { blob: new Blob([text.toUpperCase()], { type: "text/plain" }), filename: `${baseName}_uppercase.txt` };
        case "case-lower":
          return { blob: new Blob([text.toLowerCase()], { type: "text/plain" }), filename: `${baseName}_lowercase.txt` };
        case "case-title":
          return { blob: new Blob([toTitleCase(text)], { type: "text/plain" }), filename: `${baseName}_titlecase.txt` };
        case "count":
          return { blob: new Blob([countText(text)], { type: "text/plain" }), filename: `${baseName}_count.txt` };
        case "reverse":
          return { blob: new Blob([text.split("").reverse().join("")], { type: "text/plain" }), filename: `${baseName}_reversed.txt` };
        case "md-to-txt":
          return { blob: new Blob([stripMarkdown(text)], { type: "text/plain" }), filename: `${baseName}.txt` };
        case "txt-to-md":
          return { blob: new Blob([textToMarkdown(text)], { type: "text/markdown" }), filename: `${baseName}.md` };
        case "html-to-md":
          return { blob: new Blob([htmlToMarkdown(text)], { type: "text/markdown" }), filename: `${baseName}.md` };
        case "md-to-html":
          return { blob: new Blob([markdownToHtml(text)], { type: "text/html" }), filename: `${baseName}.html` };
        case "html-to-txt":
          return { blob: new Blob([stripHtml(text)], { type: "text/plain" }), filename: `${baseName}.txt` };
        case "txt-to-html":
          return { blob: new Blob([textToHtml(text)], { type: "text/html" }), filename: `${baseName}.html` };
        default:
          throw new Error(`Unknown developer action: ${action}`);
      }
    },
    supportedActions: [
      "json-format", "json-minify", "json-validate",
      "json-to-yaml", "yaml-to-json",
      "csv-to-json", "json-to-csv",
      "xml-format", "json-to-xml", "csv-to-xml", "xml-to-csv", "html-format", "css-format", "css-minify",
      "base64-encode", "base64-decode",
      "url-encode", "url-decode",
      "hash", "uuid",
      "case-upper", "case-lower", "case-title",
      "count", "reverse",
      "md-to-txt", "txt-to-md",
      "html-to-md", "md-to-html", "html-to-txt", "txt-to-html",
    ],
  };
}

engineRegistry.register(createDeveloperEngine("developer"));
engineRegistry.register(createDeveloperEngine("text"));
engineRegistry.register(createDeveloperEngine("data"));

export {
  formatJson, minifyJson, validateJson,
  convertJsonToYaml, convertYamlToJson,
  formatXml, formatHtml, formatCss,
  generateHash,
};
