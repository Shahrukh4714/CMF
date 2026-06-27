import type { ConversionResult } from "./engines/engine";

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      `image/${format}`,
      quality
    );
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export async function convertToPdf(
  imageFiles: File[]
): Promise<ConversionResult> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "png");
    const arrayBuffer = await blob.arrayBuffer();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";

    let image;
    if (ext === "jpg" || ext === "jpeg") {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else {
      image = await pdfDoc.embedPng(arrayBuffer);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0 });
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([new Uint8Array(pdfBytes).buffer], { type: "application/pdf" });

  return {
    blob: pdfBlob,
    filename: "converted.pdf",
  };
}

export async function convertPdfToImages(
  file: File,
  outputFormat: string
): Promise<ConversionResult[]> {
  const { PDFDocument } = await import("pdf-lib");
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const results: ConversionResult[] = [];
  const baseName = file.name.replace(/\.[^.]+$/, "");

  for (let i = 0; i < pages.length; i++) {
    const { width, height } = pages[i].getSize();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    const blob = await canvasToBlob(canvas, outputFormat);
    results.push({
      blob,
      filename: `${baseName}_page_${i + 1}.${outputFormat}`,
    });
  }

  return results;
}
