import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;
    const action = formData.get("action") as string | null;
    const password = formData.get("password") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base = file.name.replace(/\.[^/.]+$/, "");

    let resultBuffer: Buffer;
    let mime: string;
    let ext: string;

    // ── Image conversions ──
    const imageFormats = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "avif"];

    if (imageFormats.includes(from) && imageFormats.includes(to)) {
      if (from === "svg") {
        // SVG → PNG/JPG via sharp
        const svgText = file.name.endsWith(".svg") ? buffer.toString("utf-8") : await file.text();
        resultBuffer = await sharp(Buffer.from(svgText, "utf-8")).resize(800, 600, { fit: "inside" }).png().toBuffer();
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
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        const lines = doc.splitTextToSize(text, 180);
        let y = 15;
        lines.forEach((line: string) => {
          if (y > 280) { doc.addPage(); y = 15; }
          doc.text(line, 15, y);
          y += 7;
        });
        resultBuffer = Buffer.from(doc.output("arraybuffer"));
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
        let html = md
          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/^###### (.+)/gm, "<h6>$1</h6>")
          .replace(/^##### (.+)/gm, "<h5>$1</h5>")
          .replace(/^#### (.+)/gm, "<h4>$1</h4>")
          .replace(/^### (.+)/gm, "<h3>$1</h3>")
          .replace(/^## (.+)/gm, "<h2>$1</h2>")
          .replace(/^# (.+)/gm, "<h1>$1</h1>")
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/`(.+?)`/g, "<code>$1</code>")
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
          .replace(/^- (.+)/gm, "<li>$1</li>")
          .replace(/\n\n/g, "</p><p>")
          .replace(/\n/g, "<br>");
        const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;max-width:760px;margin:40px auto;line-height:1.7}code{background:#f4f4f4;padding:2px 5px;border-radius:3px}</style></head><body><p>${html}</p></body></html>`;
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
      const result = await mammoth.extractRawText({ buffer });
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(result.value, 180);
      let y = 15;
      lines.forEach((line: string) => {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(line, 15, y);
        y += 7;
      });
      resultBuffer = Buffer.from(doc.output("arraybuffer"));
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
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<w:br/>");
      const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>${escaped}</w:t></w:r></w:p>
  </w:body>
</w:document>`;
      zip.file("word/document.xml", docXml);
      zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
      zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
      zip.file("word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`);
      const buf = await zip.generateAsync({ type: "nodebuffer" });
      resultBuffer = Buffer.from(buf);
      mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      ext = "docx";
    }
    // ── XLSX → PDF ──
    else if (from === "xlsx" && to === "pdf") {
      const wb = XLSX.read(buffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF("landscape");
      let y = 10;
      doc.setFontSize(8);
      for (const row of data) {
        if (y > 190) { doc.addPage("landscape"); y = 10; }
        let x = 5;
        for (const cell of row) {
          doc.text(String(cell ?? ""), x, y);
          x += 35;
        }
        y += 6;
      }
      resultBuffer = Buffer.from(doc.output("arraybuffer"));
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
      const epub = new EPub(buffer);
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
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(stripped, 180);
      let y = 15;
      lines.forEach((line: string) => {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(line, 15, y);
        y += 7;
      });
      resultBuffer = Buffer.from(doc.output("arraybuffer"));
      mime = "application/pdf";
      ext = "pdf";
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
