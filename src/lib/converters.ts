// ── Engine System ──
// All conversion engines are in src/lib/engines/
// This file re-exports for backward compatibility

export { engineRegistry } from "./engines";
export type { ConversionResult, ConversionOptions } from "./engines";

// Image
export { convertImage, compressImage, convertToIco } from "./engines/image";

// PDF
export { mergePdfs, splitPdf, compressPdf, rotatePdfPages, deletePdfPages, extractPdfPages, addPageNumbers } from "./engines/pdf";

// Developer
export { formatJson, minifyJson, validateJson, formatXml, formatHtml, formatCss, generateHash } from "./engines/developer";

// Video / Audio
export { convertVideo, extractAudio, createGif, convertAudio, getFFmpeg, preloadFFmpeg, getFFmpegStatus } from "./engines/video";

// ── Legacy converters kept for backward compatibility ──
export type { ConversionResult as LegacyConversionResult } from "./engines/engine";
export { convertToPdf } from "./legacy";
