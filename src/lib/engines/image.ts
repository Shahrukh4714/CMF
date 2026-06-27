import { type ConversionResult, type ConversionOptions, engineRegistry } from "./engine";

function canvasToBlob(canvas: HTMLCanvasElement, format: string, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      mimeType,
      quality
    );
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

function getCanvas(file: File, options: ConversionOptions): Promise<HTMLCanvasElement> {
  return new Promise(async (resolve, reject) => {
    try {
      const img = await loadImage(file);
      const canvas = document.createElement("canvas");
      let w = options.width || img.naturalWidth;
      let h = options.height || img.naturalHeight;

      // Crop
      if (options.crop) {
        const c = options.crop;
        canvas.width = c.width;
        canvas.height = c.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Could not get canvas context")); return; }
        ctx.drawImage(img, c.x, c.y, c.width, c.height, 0, 0, c.width, c.height);
        resolve(canvas);
        return;
      }

      // Resize maintaining aspect ratio
      if (options.width && !options.height) {
        h = Math.round(w / (img.naturalWidth / img.naturalHeight));
      } else if (options.height && !options.width) {
        w = Math.round(h / (img.naturalHeight / img.naturalWidth));
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Could not get canvas context")); return; }

      // Flip
      if (options.flip === "horizontal") {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      } else if (options.flip === "vertical") {
        ctx.translate(0, h);
        ctx.scale(1, -1);
      }

      // Rotation
      if (options.rotate) {
        const angle = (options.rotate * Math.PI) / 180;
        canvas.width = Math.abs(Math.cos(angle)) * w + Math.abs(Math.sin(angle)) * h;
        canvas.height = Math.abs(Math.sin(angle)) * w + Math.abs(Math.cos(angle)) * h;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else {
        ctx.drawImage(img, 0, 0, w, h);
      }

      resolve(canvas);
    } catch (err) {
      reject(err);
    }
  });
}

async function convertSvg(file: File, options: ConversionOptions): Promise<HTMLCanvasElement> {
  const text = await file.text();
  const svgBlob = new Blob([text], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = options.width || size;
      canvas.height = options.height || size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Could not get canvas context")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("Failed to load SVG"));
    img.src = url;
  });
}

/** Build a minimal ICO container around a PNG blob */
async function buildIco(pngBlob: Blob): Promise<Blob> {
  const buf = await pngBlob.arrayBuffer();
  const pngBytes = new Uint8Array(buf);
  const imgSize = pngBytes.length;

  // Decode PNG to get dimensions (IHDR chunk at offset 16)
  const w = pngBytes[16] * 256 + pngBytes[17];
  const h = pngBytes[18] * 256 + pngBytes[19];

  const header = new Uint8Array(6 + 16);
  // ICO header
  header[0] = 0; header[1] = 0; // reserved
  header[2] = 1; header[3] = 0; // type = ICO
  header[4] = 1; header[5] = 0; // count = 1
  // Directory entry
  header[6] = w >= 256 ? 0 : w;
  header[7] = h >= 256 ? 0 : h;
  header[8] = 0; // colors
  header[9] = 0; // reserved
  header[10] = 1; header[11] = 0; // planes
  header[12] = 32; header[13] = 0; // bpp
  // Size
  header[14] = imgSize & 0xff;
  header[15] = (imgSize >> 8) & 0xff;
  header[16] = (imgSize >> 16) & 0xff;
  header[17] = (imgSize >> 24) & 0xff;
  // Offset
  header[18] = 22; header[19] = 0; header[20] = 0; header[21] = 0;

  const icoBytes = new Uint8Array(22 + imgSize);
  icoBytes.set(header, 0);
  icoBytes.set(pngBytes, 22);

  return new Blob([icoBytes], { type: "image/x-icon" });
}

async function convertHeic(file: File, outputFormat: string, options: ConversionOptions = {}): Promise<ConversionResult> {
  const { default: heic2any } = await import("heic2any");
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const resultBlob = await heic2any({ blob: file, toType: outputFormat === "png" ? "image/png" : "image/jpeg", quality: options.quality ?? 0.92 }) as Blob;
  return { blob: resultBlob, filename: `${baseName}.${outputFormat}` };
}

async function convertImage(
  file: File,
  outputFormat: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const ext = file.name.split(".").pop()?.toLowerCase() || "";

  // HEIC input
  if (ext === "heic") {
    return convertHeic(file, outputFormat, options);
  }

  // SVG input
  if (ext === "svg") {
    const canvas = await convertSvg(file, options);
    const quality = options.quality ?? 0.92;
    const blob = await canvasToBlob(canvas, outputFormat, quality);
    return { blob, filename: `${baseName}.${outputFormat}` };
  }

  // ICO output
  if (outputFormat === "ico") {
    const canvas = await getCanvas(file, options);
    const pngBlob = await canvasToBlob(canvas, "png", 1);
    const icoBlob = await buildIco(pngBlob);
    return { blob: icoBlob, filename: `${baseName}.ico` };
  }

  // Standard image conversion
  const canvas = await getCanvas(file, options);
  const quality = options.quality ?? 0.92;
  const mimeFormat = outputFormat === "jpeg" ? "jpg" : outputFormat;
  const blob = await canvasToBlob(canvas, mimeFormat, quality);
  return { blob, filename: `${baseName}.${outputFormat}` };
}

// ── Compress ──
async function compressImage(file: File, quality: number): Promise<ConversionResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  return convertImage(file, ext, { quality });
}

// ── ICO converter ──
async function convertToIco(file: File): Promise<ConversionResult> {
  return convertImage(file, "ico");
}

const OPERATION_ACTIONS = new Set(["compress", "crop", "rotate", "flip", "resize"]);

// ── Register Image Engine ──
engineRegistry.register({
  id: "image",
  name: "Image Engine",
  async convert(file, options = {}) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const action = options.action || "";
    const outputFormat = OPERATION_ACTIONS.has(action) ? ext : (action || ext);
    return convertImage(file, outputFormat, options);
  },
  supportedActions: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "ico", "avif", "compress", "crop", "rotate", "flip", "resize"],
});

export { convertImage, compressImage, convertToIco };
