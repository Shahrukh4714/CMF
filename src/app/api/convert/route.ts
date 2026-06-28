import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { isValidConversion } from "@/lib/security";
import { validateMimeType } from "@/lib/mime-validation";
import DOMPurify from "isomorphic-dompurify";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { DOMParser } from "xmldom";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB server-side limit

export async function POST(req: NextRequest) {
  try {
    // 1. Instantly check Content-Length header to reject large files before parsing
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `File size exceeds the server-side limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const from = formData.get("from") as string | null;
    const to = formData.get("to") as string | null;
    const action = formData.get("action") as string | null;
    const password = formData.get("password") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!from || !to) {
      return NextResponse.json({ error: "Missing conversion format parameters" }, { status: 400 });
    }

    // Enforce parameter boundaries
    if (from.length > 10 || to.length > 10) {
      return NextResponse.json({ error: "Format parameters must be 10 characters or less" }, { status: 400 });
    }

    // Validate conversion pair against allowlist
    if (!isValidConversion(from, to, action)) {
      return NextResponse.json({
        error: `Server-side conversion from ${from.toUpperCase()} to ${to.toUpperCase()} is not supported.`
      }, { status: 400 });
    }

    // Enforce server-side file size cap
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: `File size exceeds the server-side limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate actual file type (MIME type) against the claimed format
    const mimeValidation = await validateMimeType(buffer, from);
    if (!mimeValidation.isValid) {
      return NextResponse.json({
        error: mimeValidation.error || "File type validation failed."
      }, { status: 400 });
    }

    let base = file.name.replace(/\.[^/.]+$/, "");
    // Sanitize filename base to prevent header injection or unexpected path characters
    base = base.replace(/[^a-zA-Z0-9_\-\s.]/g, "").substring(0, 100);
    if (!base) {
      base = "converted_file";
    }

    let resultBuffer: Buffer | null = null;
    let mime = "";
    let ext = "";

    // ── Image conversions ──
    const imageFormats = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif"];

    if (imageFormats.includes(from) && imageFormats.includes(to)) {
      if (from === "svg") {
        // SVG → PNG/JPG via sharp
        const svgText = file.name.endsWith(".svg") ? buffer.toString("utf-8") : await file.text();
        // Sanitise SVG content to prevent XSS/XXE vulnerabilities
        const cleanSvg = DOMPurify.sanitize(svgText, {
          USE_PROFILES: { svg: true },
        });
        resultBuffer = await sharp(Buffer.from(cleanSvg, "utf-8")).png().toBuffer();
        mime = "image/png";
        ext = "png";
      } else if (to !== "svg") {
        const fmt = to === "jpg" ? "jpeg" : to as "jpeg" | "png" | "webp" | "tiff" | "avif";
        resultBuffer = await sharp(buffer)[fmt]().toBuffer();
        mime = `image/${to === "jpg" ? "jpeg" : to}`;
        ext = to;
      } else {
        return NextResponse.json({ error: "SVG output not supported" }, { status: 400 });
      }
    }
    // ── Image → PDF ──
    else if (imageFormats.includes(from) && to === "pdf") {
      resultBuffer = await sharp(buffer).jpeg().toBuffer();
      // Use pdf-lib for PDF creation from image
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const img = await doc.embedJpg(resultBuffer);
      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      resultBuffer = Buffer.from(await doc.save());
      mime = "application/pdf";
      ext = "pdf";
    }
    // ── DOCX → HTML/TXT ──
    else if (from === "docx" && (to === "html" || to === "txt")) {
      const result = to === "html"
        ? await mammoth.convertToHtml({ buffer })
        : await mammoth.extractRawText({ buffer });
      const content = to === "html"
        ? `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${result.value}</body></html>`
        : result.value;
      resultBuffer = Buffer.from(content, "utf-8");
      mime = to === "html" ? "text/html" : "text/plain";
      ext = to;
    }
    // ── TXT → HTML/PDF ──
    else if (from === "txt" && (to === "html" || to === "pdf")) {
      const text = buffer.toString("utf-8");
      if (to === "html") {
        const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><pre style="font-family:sans-serif;white-space:pre-wrap">${escaped}</pre></body></html>`;
        resultBuffer = Buffer.from(html, "utf-8");
        mime = "text/html";
        ext = "html";
      } else {
        resultBuffer = await convertTxtToPdf(text);
        mime = "application/pdf";
        ext = "pdf";
      }
    }
    // ── HTML → TXT ──
    else if (from === "html" && to === "txt") {
      const text = buffer.toString("utf-8");
      const stripped = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      resultBuffer = Buffer.from(stripped, "utf-8");
      mime = "text/plain";
      ext = "txt";
    }
    // ── MD → HTML/TXT ──
    else if ((from === "md" || from === "markdown") && (to === "html" || to === "txt")) {
      const md = buffer.toString("utf-8");
      if (to === "txt") {
        resultBuffer = Buffer.from(md, "utf-8");
        mime = "text/plain";
        ext = "txt";
      } else {
        const { marked } = await import("marked");
        const parsedHtml = await marked(md);
        const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;max-width:760px;margin:40px auto;line-height:1.7}code{background:#f4f4f4;padding:2px 5px;border-radius:3px}</style></head><body>${parsedHtml}</body></html>`;
        resultBuffer = Buffer.from(full, "utf-8");
        mime = "text/html";
        ext = "html";
      }
    }
    // ── CSV → JSON ──
    else if (from === "csv" && to === "json") {
      const text = buffer.toString("utf-8");
      const lines = text.trim().split("\n");
      const headers = parseCSVRow(lines[0]);
      const data = lines.slice(1).map((line) => {
        const vals = parseCSVRow(line);
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => (obj[h.trim()] = (vals[i] || "").trim()));
        return obj;
      });
      resultBuffer = Buffer.from(JSON.stringify(data, null, 2), "utf-8");
      mime = "application/json";
      ext = "json";
    }
    // ── JSON → CSV ──
    else if (from === "json" && to === "csv") {
      const text = buffer.toString("utf-8");
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : [data];
      const keys = Object.keys(arr[0] || {});
      const rows = [keys.join(","), ...arr.map((row: Record<string, unknown>) => keys.map((k) => JSON.stringify(row[k] ?? "")).join(","))];
      resultBuffer = Buffer.from(rows.join("\n"), "utf-8");
      mime = "text/csv";
      ext = "csv";
    }
    // ── XLSX → CSV/JSON ──
    else if (from === "xlsx" && (to === "csv" || to === "json")) {
      const wb = XLSX.read(buffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      if (to === "csv") {
        const csv = XLSX.utils.sheet_to_csv(ws);
        resultBuffer = Buffer.from(csv, "utf-8");
        mime = "text/csv";
        ext = "csv";
      } else {
        const data = XLSX.utils.sheet_to_json(ws);
        resultBuffer = Buffer.from(JSON.stringify(data, null, 2), "utf-8");
        mime = "application/json";
        ext = "json";
      }
    }
    // ── CSV → XLSX ──
    else if (from === "csv" && to === "xlsx") {
      const text = buffer.toString("utf-8");
      const rows = text.trim().split("\n").map((r) => parseCSVRow(r));
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      resultBuffer = Buffer.from(buf);
      mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      ext = "xlsx";
    }
    // ── XML → JSON ──
    else if (from === "xml" && to === "json") {
      const text = buffer.toString("utf-8");
      const parser = new (await import("xmldom")).DOMParser();
      const doc = parser.parseFromString(text, "text/xml");

      function xmlToObj(node: Element): Record<string, unknown> | string {
        const obj: Record<string, unknown> = {};
        let hasChildren = false;
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === 3) {
            const val = (child.textContent || "").trim();
            if (val) return val;
          } else if (child.nodeType === 1) {
            hasChildren = true;
            const k = (child as Element).tagName;
            const v = xmlToObj(child as Element);
            if (obj[k]) {
              if (!Array.isArray(obj[k])) obj[k] = [obj[k]];
              (obj[k] as unknown[]).push(v);
            } else {
              obj[k] = v;
            }
          }
        }
        return hasChildren ? obj : "";
      }

      const json = xmlToObj(doc.documentElement);
      resultBuffer = Buffer.from(JSON.stringify(json, null, 2), "utf-8");
      mime = "application/json";
      ext = "json";
    }
    // ── PDF → TXT ──
    else if (from === "pdf" && to === "txt") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      resultBuffer = Buffer.from(result.text, "utf-8");
      mime = "text/plain";
      ext = "txt";
    }
    // ── DOCX → PDF ──
    else if (from === "docx" && to === "pdf") {
      const result = await mammoth.convertToHtml({ buffer });
      resultBuffer = await convertHtmlToPdf(result.value);
      mime = "application/pdf";
      ext = "pdf";
    }
    // ── PDF → DOCX ──
    else if (from === "pdf" && to === "docx") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      const text = result.text;
      
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const lines = text.split("\n");
      const doc = new Document({
        sections: [
          {
            children: lines.map((line: string) => new Paragraph({
              children: [new TextRun({ text: line })]
            }))
          }
        ]
      });
      resultBuffer = await Packer.toBuffer(doc);
      mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      ext = "docx";
    }
    // ── XLSX → PDF ──
    else if (from === "xlsx" && to === "pdf") {
      const wb = XLSX.read(buffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];
      resultBuffer = await convertXlsxToPdf(data);
      mime = "application/pdf";
      ext = "pdf";
    }
    // ── PDF → XLSX ──
    else if (from === "pdf" && to === "xlsx") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      const lines = result.text.split("\n").filter((l: string) => l.trim());
      const rows = lines.map((l: string) => l.split(/\s{2,}|,|\t/).map((s: string) => s.trim()));
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      resultBuffer = Buffer.from(buf);
      mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      ext = "xlsx";
    }
    // ── EPUB → PDF ──
    else if (from === "epub" && to === "pdf") {
      const { default: EPub } = await import("epub");
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const os = await import("node:os");

      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `epub-${Date.now()}-${Math.random().toString(36).substring(2)}.epub`);

      try {
        await fs.writeFile(tempFilePath, buffer);
        const epub = new EPub(tempFilePath);
        await epub.parse();
        const chapters: string[] = [];
        for (const item of epub.flow) {
          try {
            const content = await epub.getChapter(item.id);
            chapters.push(content);
          } catch { /* skip failed chapters */ }
        }
        const text = chapters.join("\n\n");
        const stripped = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        resultBuffer = await convertTxtToPdf(stripped);
        mime = "application/pdf";
        ext = "pdf";
      } finally {
        try {
          await fs.unlink(tempFilePath);
        } catch { /* ignore cleanup errors */ }
      }
    }
    // ── OCR: Image → TXT ──
    else if ((from === "png" || from === "jpg" || from === "jpeg" || from === "webp" || from === "tiff") && to === "txt" && action === "ocr") {
      const Tesseract = await import("tesseract.js");
      const { data } = await Tesseract.recognize(buffer, "eng");
      resultBuffer = Buffer.from(data.text, "utf-8");
      mime = "text/plain";
      ext = "txt";
    }
    // ── CSV/JSON/TXT → XLSX (spreadsheet creation) ──
    else if ((from === "csv" || from === "json" || from === "txt") && to === "xlsx") {
      const text = buffer.toString("utf-8");
      let rows: string[][];
      if (from === "csv") {
        rows = text.trim().split("\n").map((r) => parseCSVRow(r));
      } else if (from === "json") {
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : [data];
        const keys = Object.keys(arr[0] || {});
        rows = [keys, ...arr.map((row: Record<string, unknown>) => keys.map((k) => String(row[k] ?? "")))];
      } else {
        rows = text.split("\n").map((l) => [l]);
      }
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      resultBuffer = Buffer.from(buf);
      mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      ext = "xlsx";
    }
    else {
      return NextResponse.json({
        error: `Server-side conversion from ${from.toUpperCase()} to ${to.toUpperCase()} is not yet supported. Try a different format pair or use the client-side converter.`,
      }, { status: 400 });
    }

    if (!resultBuffer || !mime || !ext) {
      return NextResponse.json({ error: "Conversion failed to generate output" }, { status: 500 });
    }

    if (ext === "pdf" && password) {
      const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
      const encrypted = await encryptPDF(new Uint8Array(resultBuffer), password);
      resultBuffer = Buffer.from(encrypted);
    }

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${base}.${ext}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === "," && !inQ) { result.push(cur); cur = ""; }
    else cur += c;
  }
  result.push(cur);
  return result;
}

function wrapText(text: string, maxCharsPerLine: number = 80): string[] {
  const lines: string[] = [];
  const paragraphs = text.split("\n");
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    const words = paragraph.split(/\s+/);
    let currentLine = "";
    for (const word of words) {
      if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  return lines;
}

async function convertTxtToPdf(text: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let page = pdfDoc.addPage([612, 792]); // Letter size
  const margin = 50;
  const fontSize = 10;
  const lineHeight = 14;
  
  let y = 792 - margin;
  
  const lines = wrapText(text, 80);
  
  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([612, 792]);
      y = 792 - margin;
    }
    if (line.trim() !== "") {
      page.drawText(line, {
        x: margin,
        y: y,
        size: fontSize,
        font: font,
      });
    }
    y -= lineHeight;
  }
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

async function convertXlsxToPdf(data: string[][]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  let page = pdfDoc.addPage([792, 612]); // Letter Landscape
  const marginTop = 30;
  const marginBottom = 30;
  const fontSize = 8;
  const lineHeight = 12;
  const colWidth = 75;
  
  let y = 612 - marginTop;
  
  for (const row of data) {
    if (y < marginBottom + lineHeight) {
      page = pdfDoc.addPage([792, 612]);
      y = 612 - marginTop;
    }
    
    let x = 30;
    for (const cell of row) {
      const cellText = String(cell ?? "").trim();
      const truncated = cellText.length > 15 ? cellText.substring(0, 12) + "..." : cellText;
      
      if (truncated !== "") {
        page.drawText(truncated, {
          x: x,
          y: y,
          size: fontSize,
          font: font,
        });
      }
      x += colWidth;
      if (x > 792 - 30) break;
    }
    y -= lineHeight;
  }
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
interface TextSpan {
  text: string;
  font: any;
  fontSize: number;
}

interface InlineToken {
  text: string;
  bold: boolean;
  italic: boolean;
}

function extractTokens(node: any, bold = false, italic = false): InlineToken[] {
  let tokens: InlineToken[] = [];
  if (!node) return tokens;

  if (node.nodeType === 3) {
    const text = node.nodeValue || "";
    if (text) {
      tokens.push({ text, bold, italic });
    }
  } else if (node.nodeType === 1) {
    const tagName = node.tagName.toLowerCase();
    let newBold = bold;
    let newItalic = italic;
    if (tagName === "strong" || tagName === "b") newBold = true;
    if (tagName === "em" || tagName === "i") newItalic = true;

    const childNodes = node.childNodes;
    if (childNodes) {
      for (let i = 0; i < childNodes.length; i++) {
        tokens = tokens.concat(extractTokens(childNodes[i], newBold, newItalic));
      }
    }
  }
  return tokens;
}

function layoutParagraph(
  tokens: InlineToken[],
  fontSize: number,
  maxWidth: number,
  fonts: { regular: any; bold: any; italic: any; boldItalic: any }
): TextSpan[][] {
  const lines: TextSpan[][] = [];
  let currentLine: TextSpan[] = [];
  let currentLineWidth = 0;

  for (const token of tokens) {
    let font = fonts.regular;
    if (token.bold && token.italic) font = fonts.boldItalic;
    else if (token.bold) font = fonts.bold;
    else if (token.italic) font = fonts.italic;

    const words = token.text.split(/(\s+)/);

    for (const word of words) {
      if (word === "") continue;

      const wordWidth = font.widthOfTextAtSize(word, fontSize);

      if (currentLineWidth + wordWidth > maxWidth && currentLineWidth > 0) {
        lines.push(currentLine);
        currentLine = [];
        currentLineWidth = 0;
        if (/^\s+$/.test(word)) continue;
      }

      currentLine.push({ text: word, font, fontSize });
      currentLineWidth += wordWidth;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

function drawLine(page: any, line: TextSpan[], x: number, y: number) {
  let currentX = x;
  for (const span of line) {
    page.drawText(span.text, {
      x: currentX,
      y: y,
      font: span.font,
      size: span.fontSize,
    });
    currentX += span.font.widthOfTextAtSize(span.text, span.fontSize);
  }
}

async function convertHtmlToPdf(html: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  let page = pdfDoc.addPage([612, 792]);
  const margin = 50;
  const maxWidth = 612 - margin * 2;
  let y = 792 - margin;

  const parser = new DOMParser();
  const cleanHtml = html
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;/g, "\"")
    .replace(/&rdquo;/g, "\"")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "--");
  const doc = parser.parseFromString(`<div>${cleanHtml}</div>`, "text/xml");
  const root = doc.documentElement;

  const childNodes = root.childNodes;
  if (!childNodes) {
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    if (node.nodeType !== 1) continue;

    const tagName = (node as any).tagName.toLowerCase();
    let fontSize = 10;
    let isHeading = false;
    let spaceBefore = 8;
    let spaceAfter = 6;
    let isList = false;

    if (tagName.match(/^h[1-6]$/)) {
      isHeading = true;
      const level = parseInt(tagName.charAt(1));
      fontSize = level === 1 ? 18 : level === 2 ? 14 : 12;
      spaceBefore = level === 1 ? 16 : 12;
      spaceAfter = 8;
    } else if (tagName === "p") {
      fontSize = 10;
      spaceBefore = 6;
      spaceAfter = 6;
    } else if (tagName === "ul" || tagName === "ol") {
      isList = true;
      spaceBefore = 6;
      spaceAfter = 6;
    }

    if (isList) {
      const items = (node as any).childNodes;
      if (!items) continue;
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (item.nodeType !== 1 || (item as any).tagName.toLowerCase() !== "li") continue;

        const tokens = extractTokens(item);
        const lines = layoutParagraph(tokens, 10, maxWidth - 20, fonts);

        for (let l = 0; l < lines.length; l++) {
          const line = lines[l];
          const lineHeight = 14;
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([612, 792]);
            y = 792 - margin;
          }
          if (l === 0) {
            page.drawText("•", { x: margin + 10, y: y, font: fonts.bold, size: 10 });
          }
          drawLine(page, line, margin + 20, y);
          y -= lineHeight;
        }
        y -= 4;
      }
    } else {
      const tokens = extractTokens(node, isHeading);
      const lines = layoutParagraph(tokens, fontSize, maxWidth, fonts);

      y -= spaceBefore;

      for (const line of lines) {
        const lineHeight = fontSize + 4;
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([612, 792]);
          y = 792 - margin;
        }
        drawLine(page, line, margin, y);
        y -= lineHeight;
      }
      y -= spaceAfter;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
