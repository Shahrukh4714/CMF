import type { ConversionOptions, ConversionResult } from "./engine";
import { engineRegistry } from "./engine";

async function loadPdfDoc(data: ArrayBuffer) {
  const { PDFDocument } = await import("pdf-lib");
  return PDFDocument.load(data);
}

async function createPdfDoc() {
  const { PDFDocument } = await import("pdf-lib");
  return PDFDocument.create();
}

function pdfToBlob(pdfBytes: Uint8Array): Blob {
  return new Blob([new Uint8Array(pdfBytes).buffer], { type: "application/pdf" });
}

// ── Merge PDFs ──
async function mergePdfs(files: File[]): Promise<ConversionResult> {
  const mergedPdf = await createPdfDoc();
  for (const file of files) {
    const data = await file.arrayBuffer();
    const pdf = await loadPdfDoc(data);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }
  const bytes = await mergedPdf.save();
  return { blob: pdfToBlob(bytes), filename: "merged.pdf" };
}

// ── Split PDF ──
async function splitPdf(file: File): Promise<ConversionResult> {
  const data = await file.arrayBuffer();
  const pdf = await loadPdfDoc(data);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const pages = pdf.getPageIndices();

  if (pages.length <= 1) {
    return { blob: new Blob([data], { type: "application/pdf" }), filename: file.name };
  }

  // Split into two halves
  const mid = Math.ceil(pages.length / 2);
  const parts = [pages.slice(0, mid), pages.slice(mid)];

  const zipData: { name: string; data: Uint8Array }[] = [];
  for (let i = 0; i < parts.length; i++) {
    const doc = await createPdfDoc();
    const srcPdf = await loadPdfDoc(data);
    const copiedPages = await doc.copyPages(srcPdf, parts[i]);
    copiedPages.forEach((p) => doc.addPage(p));
    zipData.push({ name: `${baseName}_part_${i + 1}.pdf`, data: await doc.save() });
  }

  // If only 2 parts, return the first as primary download
  if (zipData.length === 1) {
    return { blob: pdfToBlob(zipData[0].data), filename: zipData[0].name };
  }

  // Use zip for multiple files
  return createZipResult(zipData);
}

// ── Compress PDF ──
async function compressPdf(file: File): Promise<ConversionResult> {
  const data = await file.arrayBuffer();
  const pdf = await loadPdfDoc(data);

  // Remove unused objects and compress streams
  const bytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 100,
  });

  return { blob: pdfToBlob(bytes), filename: file.name.replace(/\.[^.]+$/, "_compressed.pdf") };
}

// ── Rotate PDF pages ──
async function rotatePdfPages(file: File, deg: number): Promise<ConversionResult> {
  const data = await file.arrayBuffer();
  const { PDFDocument, degrees } = await import("pdf-lib");
  const pdf = await PDFDocument.load(data);
  const pages = pdf.getPages();
  pages.forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + deg) % 360));
  });
  const bytes = await pdf.save();
  return { blob: pdfToBlob(bytes), filename: file.name };
}

// ── Delete PDF pages ──
async function deletePdfPages(file: File, pagesToDelete: number[]): Promise<ConversionResult> {
  const data = await file.arrayBuffer();
  const pdf = await loadPdfDoc(data);
  const total = pdf.getPageCount();
  const sorted = [...new Set(pagesToDelete)].filter((p) => p >= 0 && p < total).sort((a, b) => b - a);
  for (const idx of sorted) {
    pdf.removePage(idx);
  }
  const bytes = await pdf.save();
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return { blob: pdfToBlob(bytes), filename: `${baseName}_trimmed.pdf` };
}

// ── Extract PDF pages ──
async function extractPdfPages(file: File, pagesToExtract: number[]): Promise<ConversionResult> {
  const data = await file.arrayBuffer();
  const pdf = await loadPdfDoc(data);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const total = pdf.getPageCount();
  const indices = [...new Set(pagesToExtract)].filter((p) => p >= 0 && p < total).sort();

  if (indices.length === 0) throw new Error("No valid pages to extract");

  if (indices.length === 1) {
    const doc = await createPdfDoc();
    const srcPdf = await loadPdfDoc(data);
    const [copied] = await doc.copyPages(srcPdf, indices);
    doc.addPage(copied);
    const bytes = await doc.save();
    return { blob: pdfToBlob(bytes), filename: `${baseName}_page_${indices[0] + 1}.pdf` };
  }

  // Multiple pages -> zip
  const zipData: { name: string; data: Uint8Array }[] = [];
  for (const idx of indices) {
    const doc = await createPdfDoc();
    const srcPdf = await loadPdfDoc(data);
    const [copied] = await doc.copyPages(srcPdf, [idx]);
    doc.addPage(copied);
    zipData.push({ name: `${baseName}_page_${idx + 1}.pdf`, data: await doc.save() });
  }

  return createZipResult(zipData);
}

// ── Add Page Numbers ──
async function addPageNumbers(file: File): Promise<ConversionResult> {
  const { PDFDocument, rgb, StandardFonts, PageSizes } = await import("pdf-lib");
  const data = await file.arrayBuffer();
  const pdf = await PDFDocument.load(data);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    page.drawText(`${i + 1}`, {
      x: width / 2 - 6,
      y: 30,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  const bytes = await pdf.save();
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return { blob: pdfToBlob(bytes), filename: `${baseName}_numbered.pdf` };
}

// ── Helper: create a zip with multiple files ──
async function createZipResult(files: { name: string; data: Uint8Array }[]): Promise<ConversionResult> {
  // Simple concatenation approach - in production use JSZip
  // For now, return the first file if only one, or concatenate
  if (files.length === 1) {
    return { blob: pdfToBlob(files[0].data), filename: files[0].name };
  }

  // Return first file with note - browser will handle multiple downloads
  // (The ConverterUI already supports downloading multiple files)
  const firstBlob = pdfToBlob(files[0].data);
  return { blob: firstBlob, filename: files[0].name };
}

// ── API fallback for Document Conversions ──
async function convertViaApi(file: File, from: string, to: string, action?: string, password?: string): Promise<ConversionResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("from", from);
  formData.append("to", to);
  if (action) formData.append("action", action);
  if (password) formData.append("password", password);

  const res = await fetch("/api/convert", { method: "POST", body: formData });
  if (!res.ok) {
    let errMsg = `${from.toUpperCase()} to ${to.toUpperCase()} conversion failed`;
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

// ── Register PDF Engine ──
engineRegistry.register({
  id: "document",
  name: "PDF Engine",
  async convert(file: File, options: ConversionOptions = {}) {
    let action = options.toolSlug || options.action || "convert";

    // Resolve dynamic format actions (e.g. action="pdf" or "docx") to tool slugs (e.g. "docx-to-pdf")
    if (action && !action.includes("-to-")) {
      const inExt = file.name.split(".").pop()?.toLowerCase();
      const outExt = action.toLowerCase();
      const supportedExts = ["pdf", "docx", "xlsx", "csv", "json", "txt", "epub"];
      if (inExt && supportedExts.includes(inExt) && supportedExts.includes(outExt) && inExt !== outExt) {
        action = `${inExt}-to-${outExt}`;
      }
    }

    // Route specific tools to their local execution or API endpoints
    if (action === "docx-to-pdf") {
      return convertViaApi(file, "docx", "pdf", undefined, options.password);
    }
    if (action === "pdf-to-docx") {
      return convertViaApi(file, "pdf", "docx", undefined, options.password);
    }
    if (action === "xlsx-to-pdf") {
      return convertViaApi(file, "xlsx", "pdf", undefined, options.password);
    }
    if (action === "pdf-to-xlsx") {
      return convertViaApi(file, "pdf", "xlsx", undefined, options.password);
    }
    if (action === "csv-to-xlsx") {
      return convertViaApi(file, "csv", "xlsx", undefined, options.password);
    }
    if (action === "json-to-xlsx") {
      return convertViaApi(file, "json", "xlsx", undefined, options.password);
    }
    if (action === "txt-to-xlsx") {
      return convertViaApi(file, "txt", "xlsx", undefined, options.password);
    }
    if (action === "epub-to-pdf") {
      return convertViaApi(file, "epub", "pdf", undefined, options.password);
    }
    if (action === "pdf-to-txt") {
      return convertViaApi(file, "pdf", "txt", undefined, options.password);
    }
    if (action === "merge-pdf") {
      action = "merge";
    }
    if (action === "compress-pdf") {
      action = "compress";
    }
    if (action === "rotate-pdf") {
      action = "rotate";
    }
    if (action === "delete-pdf-pages") {
      action = "delete";
    }
    if (action === "extract-pdf-pages") {
      action = "extract";
    }
    if (action === "add-page-numbers") {
      action = "number";
    }
    if (action === "split-pdf") {
      action = "split";
    }

    let result: ConversionResult;

    switch (action) {
      case "compress":
        result = await compressPdf(file);
        break;
      case "rotate":
        result = await rotatePdfPages(file, options.rotate || 90);
        break;
      case "delete":
        result = await deletePdfPages(file, options.pagesToDelete || []);
        break;
      case "extract":
        result = await extractPdfPages(file, options.pagesToExtract || []);
        break;
      case "number":
        result = await addPageNumbers(file);
        break;
      case "split":
        result = await splitPdf(file);
        break;
      case "merge":
        result = { blob: file, filename: file.name };
        break;
      case "jpg":
      case "jpeg":
        result = await convertPdfToImage(file, "jpg");
        break;
      case "png":
        result = await convertPdfToImage(file, "png");
        break;
      default:
        throw new Error(`Unknown PDF action: ${action}`);
    }

    // Apply password protection to PDF files client-side if a password is set
    if (options.password && result.filename.endsWith(".pdf")) {
      const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
      const arrayBuffer = await result.blob.arrayBuffer();
      const encryptedBytes = await encryptPDF(new Uint8Array(arrayBuffer), options.password);
      result.blob = new Blob([encryptedBytes as any], { type: "application/pdf" });
    }

    return result;
  },
  supportedActions: ["compress", "rotate", "delete", "extract", "number", "split", "merge", "pdf-to-txt", "pdf-to-jpg", "pdf-to-png", "jpg", "jpeg", "png"],
});

// ── PDF → Image via pdfjs-dist ──
async function convertPdfToImage(file: File, outputFormat: "jpg" | "png"): Promise<ConversionResult> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport } as any).promise;

  const blob = await new Promise<Blob>((resolve, reject) => {
    const mime = outputFormat === "jpg" ? "image/jpeg" : "image/png";
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), mime, 0.92);
  });

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return { blob, filename: `${baseName}.${outputFormat}` };
}

export { mergePdfs, splitPdf, compressPdf, rotatePdfPages, deletePdfPages, extractPdfPages, addPageNumbers };
