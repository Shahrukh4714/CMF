// ── MIME Type Verification for Node.js API Routes ──

export async function validateMimeType(
  buffer: Buffer,
  fromFormat: string
): Promise<{ isValid: boolean; detectedMime?: string; error?: string }> {
  const fromClean = fromFormat.toLowerCase();

  // Differentiate known binary formats vs text-based formats
  const BINARY_MIMES: Record<string, string[]> = {
    pdf: ["application/pdf"],
    png: ["image/png"],
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
    gif: ["image/gif"],
    webp: ["image/webp"],
    bmp: ["image/bmp"],
    tiff: ["image/tiff"],
    avif: ["image/avif"],
    docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip"],
    xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip"],
    epub: ["application/epub+zip", "application/zip"],
  };

  // If it's a known binary format:
  if (fromClean in BINARY_MIMES) {
    let fileTypeResult = null;
    try {
      const { fileTypeFromBuffer } = await import("file-type");
      fileTypeResult = await fileTypeFromBuffer(buffer);
    } catch (err) {
      console.error("Failed to parse file-type signature:", err);
    }

    if (!fileTypeResult) {
      return {
        isValid: false,
        error: `Could not verify file binary structure. Expected binary format: ${fromClean.toUpperCase()}`,
      };
    }

    const allowedMimes = BINARY_MIMES[fromClean];
    if (!allowedMimes.includes(fileTypeResult.mime)) {
      return {
        isValid: false,
        detectedMime: fileTypeResult.mime,
        error: `MIME type mismatch: expected ${allowedMimes[0]}, but detected ${fileTypeResult.mime}`,
      };
    }

    return { isValid: true, detectedMime: fileTypeResult.mime };
  }

  // If it's a text-based format:
  const TEXT_FORMATS = ["txt", "csv", "json", "xml", "svg", "html", "md", "markdown"];
  if (TEXT_FORMATS.includes(fromClean)) {
    // A text format should NOT be detected as a binary type by file-type (unless SVG/XML which are text but can have mime types)
    let fileTypeResult = null;
    try {
      const { fileTypeFromBuffer } = await import("file-type");
      fileTypeResult = await fileTypeFromBuffer(buffer);
    } catch {
      // Ignored since file-type can error on raw text
    }

    if (fileTypeResult && fileTypeResult.mime !== "image/svg+xml" && fileTypeResult.mime !== "application/xml") {
      return {
        isValid: false,
        detectedMime: fileTypeResult.mime,
        error: `MIME type mismatch: expected text format, but detected binary ${fileTypeResult.mime}`,
      };
    }

    // Verify buffer has text content (no null bytes or control characters)
    const sampleSize = Math.min(buffer.length, 8192);
    for (let i = 0; i < sampleSize; i++) {
      const charCode = buffer[i];
      if (charCode === 0x00 || (charCode < 32 && charCode !== 9 && charCode !== 10 && charCode !== 13)) {
        return { isValid: false, error: "Invalid text file content: binary characters detected" };
      }
    }

    const textContent = buffer.toString("utf-8").trim();

    if (fromClean === "json") {
      try {
        JSON.parse(textContent);
      } catch {
        return { isValid: false, error: "Invalid JSON format: failed to parse" };
      }
    } else if (fromClean === "xml") {
      if (!textContent.startsWith("<")) {
        return { isValid: false, error: "Invalid XML format: must start with '<'" };
      }
    } else if (fromClean === "svg") {
      if (!textContent.toLowerCase().includes("<svg")) {
        return { isValid: false, error: "Invalid SVG format: missing '<svg' tag" };
      }
    } else if (fromClean === "html") {
      const isHtml = textContent.toLowerCase().startsWith("<!doctype") || 
                     textContent.toLowerCase().includes("<html") || 
                     textContent.toLowerCase().includes("<body") ||
                     textContent.toLowerCase().includes("<div");
      if (!isHtml) {
        return { isValid: false, error: "Invalid HTML format: missing common tags" };
      }
    }

    return { isValid: true, detectedMime: fromClean === "svg" ? "image/svg+xml" : "text/plain" };
  }

  return { isValid: false, error: `MIME verification not supported for ${fromClean.toUpperCase()}` };
}
