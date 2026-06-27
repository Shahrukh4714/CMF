import type { FormatDefinition } from "@/data/registry";

export interface HowToStep {
  step: number;
  title: string;
  description: string;
}

export interface BenefitItem {
  title: string;
  description: string;
}

export interface UseCaseItem {
  title: string;
  description: string;
}

export interface ToolContent {
  h1: string;
  introduction: string;
  howToGuide: HowToStep[];
  benefits: BenefitItem[];
  useCases: UseCaseItem[];
}

// ── Deterministic template selector ──

function pick<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return items[Math.abs(hash) % items.length];
}

// ── Format characteristic maps ──

const formatTech: Record<string, { compression: string; bestFor: string; limitation: string }> = {
  png:   { compression: "lossless", bestFor: "screenshots, logos, and graphics with sharp edges or transparency", limitation: "larger file sizes compared to lossy formats" },
  jpg:   { compression: "lossy",   bestFor: "photographs and complex images with smooth color gradients",        limitation: "does not support transparency and compression artifacts appear at low quality" },
  jpeg:  { compression: "lossy",   bestFor: "photographs and complex images with smooth color gradients",        limitation: "does not support transparency and compression artifacts appear at low quality" },
  webp:  { compression: "both lossy and lossless", bestFor: "web images where smaller file sizes are critical",  limitation: "limited support in older software and operating systems" },
  gif:   { compression: "lossy (palette-based)", bestFor: "simple animations and graphics with limited colors",  limitation: "restricted to 256 colors, resulting in poor quality for photographs" },
  bmp:   { compression: "uncompressed", bestFor: "raw image data where no quality loss is acceptable",           limitation: "extremely large file sizes, impractical for web use" },
  svg:   { compression: "vector (mathematical)", bestFor: "icons, logos, and illustrations at any resolution",   limitation: "not suitable for complex photographic images" },
  ico:   { compression: "varies", bestFor: "website favicons and application icons",                              limitation: "small resolution caps and limited color support in legacy variants" },
  avif:  { compression: "lossy and lossless", bestFor: "next-generation web images with superior compression",    limitation: "limited browser support compared to WebP or JPEG" },
  tiff:  { compression: "lossless (LZW)", bestFor: "professional photography and print publishing workflows",     limitation: "large file sizes and limited web browser support" },
  pdf:   { compression: "lossless with optional lossy", bestFor: "documents that need consistent formatting across devices", limitation: "editing requires specialized software compared to plain text" },
  doc:   { compression: "binary", bestFor: "word processing documents in legacy environments",                   limitation: "outdated format with compatibility issues in modern software" },
  docx:  { compression: "ZIP-based", bestFor: "modern word processing with rich formatting",                     limitation: "larger than plain text and requires compatible software for full editing" },
  txt:   { compression: "none", bestFor: "plain text content, source code, and data files",                      limitation: "no formatting, images, or rich content support" },
  html:  { compression: "text-based", bestFor: "web pages and email templates",                                  limitation: "renders differently across browsers without CSS normalization" },
  md:    { compression: "text-based", bestFor: "documentation, README files, and note-taking",                   limitation: "limited formatting options compared to HTML or DOCX" },
  rtf:   { compression: "text-based", bestFor: "cross-platform formatted documents",                             limitation: "limited support for modern formatting features" },
  csv:   { compression: "none", bestFor: "tabular data exchange between different applications",                 limitation: "no data type enforcement, prone to encoding issues" },
  json:  { compression: "text-based", bestFor: "API data exchange and configuration files",                      limitation: "no comments, trailing comma errors, less readable than YAML for configs" },
  xml:   { compression: "text-based", bestFor: "document-centric data with complex hierarchies",                 limitation: "verbose syntax with significant overhead compared to JSON" },
  mp4:   { compression: "lossy (H.264/H.265)", bestFor: "streaming and sharing video across platforms",           limitation: "lossy compression may reduce quality at high compression ratios" },
  webm:  { compression: "lossy (VP8/VP9)", bestFor: "web video with open standards",                              limitation: "less hardware decoder support than MP4 on older devices" },
  avi:   { compression: "uncompressed or lossy", bestFor: "video editing and archival with minimal quality loss", limitation: "very large file sizes, limited streaming support" },
  mov:   { compression: "varies", bestFor: "Apple ecosystem video editing and playback",                          limitation: "less universal compatibility outside of Apple products" },
  mkv:   { compression: "varies (container)", bestFor: "high-definition video with multiple audio tracks",        limitation: "not natively supported by many media players and smart TVs" },
  mp3:   { compression: "lossy", bestFor: "music and audio playback with broad compatibility",                   limitation: "lower quality at low bitrates compared to modern codecs like AAC" },
  wav:   { compression: "uncompressed PCM", bestFor: "professional audio recording and editing",                  limitation: "very large file sizes, impractical for streaming or portable use" },
  ogg:   { compression: "lossy (Vorbis)", bestFor: "open-source audio projects and games",                        limitation: "less hardware support than MP3 on portable devices" },
  flac:  { compression: "lossless", bestFor: "archiving and audiophile music collections",                        limitation: "larger files than lossy formats like MP3 or AAC" },
  aac:   { compression: "lossy", bestFor: "modern audio streaming and Apple ecosystem",                          limitation: "not as universally compatible as MP3" },
  m4a:   { compression: "lossy (AAC)", bestFor: "Apple Music and iTunes audio files",                             limitation: "limited playback support on non-Apple devices" },
  opus:  { compression: "lossy", bestFor: "real-time communication and voice applications",                      limitation: "not as widely supported in hardware players as MP3" },
  wma:   { compression: "lossy", bestFor: "Windows Media ecosystem compatibility",                                limitation: "limited cross-platform support compared to MP3" },
  epub:  { compression: "ZIP-based", bestFor: "reflowable e-books for various e-reader devices",                 limitation: "complex layouts may not render consistently across devices" },
  mobi:  { compression: "PalmDoc", bestFor: "Amazon Kindle e-reader compatibility",                               limitation: "outdated format with limited support for modern e-book features" },
  fb2:   { compression: "XML-based", bestFor: "fiction e-books in Russian-language publishing",                  limitation: "limited global adoption and reader support" },
  ttf:   { compression: "outline (TrueType)", bestFor: "screen display and print with consistent rendering",     limitation: "limited typographic features compared to OpenType" },
  otf:   { compression: "outline (OpenType)", bestFor: "professional typography with advanced features",          limitation: "larger file sizes than WOFF for web use" },
  woff:  { compression: "compressed (zlib)", bestFor: "web fonts with fast loading",                              limitation: "limited to web use, not suitable for desktop installation" },
  woff2: { compression: "compressed (Brotli)", bestFor: "optimized web font delivery",                            limitation: "limited to web use, older browser versions may not support it" },
  zip:   { compression: "lossless (DEFLATE)", bestFor: "general-purpose file archiving and distribution",         limitation: "weaker compression ratio compared to 7z for similar settings" },
  tar:   { compression: "none (archive only)", bestFor: "combining multiple files into one without compression",  limitation: "no compression by itself, typically paired with gzip" },
  gz:    { compression: "lossless (DEFLATE)", bestFor: "compressing single files on Unix-like systems",           limitation: "cannot archive multiple files by itself, used with tar" },
  "7z":  { compression: "lossless (LZMA)", bestFor: "maximum compression for archiving",                          limitation: "slower compression speed compared to ZIP" },
  stl:   { compression: "binary or ASCII", bestFor: "3D printing and CAD model exchange",                         limitation: "no color, texture, or material information" },
  obj:   { compression: "text-based", bestFor: "3D model interchange with material and texture references",       limitation: "large file sizes for complex meshes" },
  glb:   { compression: "binary (glTF)", bestFor: "efficient 3D model delivery on the web",                       limitation: "relatively new format, limited tool support" },
  gltf:  { compression: "JSON-based", bestFor: "3D asset pipeline with embedded textures",                        limitation: "JSON overhead compared to binary glTF" },
};

function getTech(ext: string) {
  return formatTech[ext] || { compression: "varies", bestFor: "general use", limitation: "varies by implementation" };
}

// ── Generate H1 ──

function generateH1(
  name: string,
  slug: string,
  input: FormatDefinition,
  output: FormatDefinition | null,
  isSame: boolean,
): string {
  const templates = isSame
    ? [
        `${name} — Online Tool`,
        `Free ${name} Online`,
        `${name} — Beautify and Clean Your ${input.name} Files`,
      ]
    : [
        `${name} — Free Online Converter`,
        `Free ${name} — Online File Converter`,
        `Convert ${input.name} to ${output?.name || output} — Free Online`,
      ];
  return pick(templates, slug + "h1");
}

// ── Generate Introduction (2-3 paragraphs) ──

function generateIntroduction(
  input: FormatDefinition,
  output: FormatDefinition | null,
  slug: string,
  name: string,
  isSame: boolean,
  isOperation: boolean,
  isUtility: boolean,
): string {
  const inTech = getTech(input.ext);
  const inputName = input.name;
  const inputFull = input.fullName;
  const inputExt = input.ext.toUpperCase();

  if (isSame) {
    const template = pick([
      [
        `Working with ${inputFull} (${inputExt}) files often requires cleaning up formatting, validating structure, or transforming the data for better readability. Our ${name} tool helps you do exactly that — directly in your browser with no file uploads required.`,
        `${inputExt} is ${inTech.bestFor}. ${inputName} uses ${inTech.compression} compression, making it ${input.description}. Whether you need to beautify messy output, validate correctness, or prepare files for further processing, this tool handles it instantly on your device.`,
        `Unlike desktop software that requires installation or online services that send your data to remote servers, our tool processes everything locally. Your ${inputName} files remain private, and results are ready in milliseconds. No accounts, no limits, no tracking.`,
      ],
      [
        `Our ${name} tool makes it simple to process and transform ${inputFull} files without leaving your browser. Whether you are cleaning up exported data or preparing files for analysis, this tool provides instant results while keeping your data completely private.`,
        `${inputFull} is a ${input.description} format commonly used for ${inTech.bestFor}. With ${inTech.compression} compression, ${inputExt} files ${inTech.limitation}. This tool helps you format, validate, and transform your ${inputName} content with precision.`,
        `Everything runs in your browser using client-side technology. Your files never touch a server, meaning sensitive ${inputName} data stays completely secure. Simply load your file, apply the desired transformation, and download the result.`,
      ],
      [
        `Transform and beautify your ${inputFull} files with our ${name} tool. Designed for speed and privacy, this browser-based utility processes everything locally on your device.`,
        `${inputName} (${inputExt}) is a ${input.description} format. It is primarily used for ${inTech.bestFor}. The format uses ${inTech.compression} compression, which ${inTech.limitation ? "means " + inTech.limitation : "affects file size and quality characteristics"}.`,
        `Our tool processes your files entirely in the browser using modern web APIs. There are no server uploads, no file size limits imposed by external infrastructure, and no privacy concerns. Your data stays on your device from start to finish.`,
      ],
    ], slug + "intro");

    return template.join("\n\n");
  }

  // Conversion (A → B)
  const outTech = output ? getTech(output.ext) : null;
  const outputName = output?.name || "";
  const outputFull = output?.fullName || "";
  const outputExt = output?.ext.toUpperCase() || "";

  const whyTemplate = pick([
    `Converting ${inputName} (${inputExt}) to ${outputName} (${outputExt}) is a common need for professionals and casual users alike. ${inputFull} uses ${inTech.compression} compression and is ideal for ${inTech.bestFor}. ${outputFull} uses ${outTech?.compression || "its own"} compression and is designed for ${outTech?.bestFor || "general use"}. Understanding the differences between these formats helps you choose the right one for your specific needs.`,
    `The ${inputExt} to ${outputExt} conversion is one of the most requested file transformations online. ${inputFull} excels at ${inTech.bestFor}, while ${outputFull} is optimized for ${outTech?.bestFor || "different use cases"}. This tool bridges the gap, letting you switch between formats instantly without compromising on quality.`,
    `Need to convert ${inputExt} to ${outputExt}? Our free online tool makes it seamless. ${inputFull} is characterized by ${inTech.compression} compression and ${input.description}. ${outputFull} uses ${outTech?.compression || "different"} compression and ${output?.description || ""}. This conversion is essential when your workflow requires compatibility with tools or platforms that prefer ${outputName}.`,
  ], slug + "conv-why");

  const limitationNote = inTech.limitation ? `However, ${inTech.limitation}. ` : "";
  const outLimitationNote = outTech?.limitation ? `${outputName} has its own considerations: ${outTech.limitation}.` : "";

  const para2 = pick([
    `${limitationNote}Converting to ${outputName} addresses these limitations while ${outTech ? `providing ${outTech.compression} compression` : "optimizing for your target use case"}. ${outLimitationNote}`,
    `${limitationNote}By converting to ${outputName}, you gain ${outTech ? `the benefits of ${outTech.compression} compression and suitability for ${outTech.bestFor}` : "format compatibility for your target application"}. ${outLimitationNote}`,
    `${outputName} offers ${outTech ? `${outTech.compression} compression and is built for ${outTech.bestFor}` : "a different set of characteristics suited to various workflows"}. ${limitationNote}${outLimitationNote}`,
  ], slug + "conv-para2");

  const para3 = `All processing happens directly in your browser using client-side technology. Your files never leave your device, ensuring complete privacy. Simply upload, convert, and download — no accounts, no upload queues, no hidden limitations.`;

  return [pick([`${whyTemplate}`, `${whyTemplate}`], slug + "conv-w"), para2, para3].join("\n\n");
}

// ── Generate How-To Guide ──

function generateHowTo(
  input: FormatDefinition,
  output: FormatDefinition | null,
  slug: string,
  name: string,
  isSame: boolean,
  isOperation: boolean,
  isUtility: boolean,
): HowToStep[] {
  const inputName = input.name;
  const outputName = output?.name || inputName;
  const inputExt = input.ext.toUpperCase();

  if (isUtility) {
    return [
      { step: 1, title: `Upload your ${inputName} file`, description: `Drag and drop your ${inputExt} file into the upload area, or click to browse and select it from your device. The tool accepts standard ${inputExt} files.` },
      { step: 2, title: "Choose the operation", description: `Select what you want to do: format, validate, minify, or transform your ${inputName} content. Each option is optimized for different use cases.` },
      { step: 3, title: "Process your file", description: `Click the action button to start processing. Since everything runs locally, results appear instantly — no upload delay, no waiting in a queue.` },
      { step: 4, title: "Download the result", description: `Review the processed output, then download it to your device. The result is ready for immediate use in your workflow or application.` },
    ];
  }

  if (isSame) {
    return [
      { step: 1, title: `Upload your ${inputName} file`, description: `Drag and drop your ${inputExt} file onto the upload area, or click to browse your device. The tool accepts ${inputExt} files of any size.` },
      { step: 2, title: `Configure settings`, description: `Adjust quality, dimensions, or other parameters using the settings panel. These controls let you fine-tune the output to match your requirements.` },
      { step: 3, title: `Process your file`, description: `Click the action button to start processing. Your browser handles everything locally, so the operation completes in milliseconds.` },
      { step: 4, title: `Save the result`, description: `Preview the processed ${inputName} file and download it to your device. The original file remains untouched on your system.` },
    ];
  }

  return [
    { step: 1, title: `Upload your ${inputName} file`, description: `Drag and drop your ${inputExt} file into the upload zone, or click to browse your computer. You can also select multiple files if batch conversion is supported.` },
    { step: 2, title: `Select ${outputName} as output`, description: `The output format defaults to ${outputName}. You can adjust conversion settings like quality or dimensions using the settings panel.` },
    { step: 3, title: "Convert instantly", description: `Click the Convert button. Your browser processes the file locally using optimized client-side code — no server upload means instant results.` },
    { step: 4, title: "Download your file", description: `Once conversion completes, preview the result and click Download. Your converted ${outputName} file is saved to your device, ready to use.` },
  ];
}

// ── Generate Benefits ──

function generateBenefits(
  input: FormatDefinition,
  output: FormatDefinition | null,
  slug: string,
  name: string,
  isSame: boolean,
  isOperation: boolean,
  categoryId: string,
): BenefitItem[] {
  const inputName = input.name;
  const outputName = output?.name || inputName;

  const privacy = { title: "Complete Privacy", description: `Your files never leave your device. Unlike cloud-based converters that upload to remote servers, all processing happens locally in your browser. Your ${inputName} data stays completely private — once you close the page, everything is permanently deleted.` };
  const speed = { title: "Lightning Fast", description: "No upload queues, no server processing delays. Because everything runs on your device, conversions complete in milliseconds. Results are instant, regardless of file size." };
  const free = { title: "100% Free", description: "No hidden fees, no premium tiers, no credit card required. Every tool on Convertmyfiles is completely free with unlimited usage." };
  const noSignup = { title: "No Signup Required", description: "We don't ask for your email, name, or any personal information. Just visit the page, upload your file, and convert. No accounts, no barriers." };
  const quality = output
    ? { title: `High-Quality ${outputName} Output`, description: `Our conversion engine preserves the integrity of your data. You can adjust quality settings for formats that support it, giving you full control over the output quality.` }
    : { title: "High-Quality Output", description: "Our processing engine preserves the integrity of your files. You can adjust quality settings for compatible formats, giving you full control over the result." };
  const compatible = { title: "Works Everywhere", description: "Access our tools from any modern browser on any device — desktop, tablet, or phone. No apps to install, no platform restrictions." };

  const categoryBenefits: Record<string, BenefitItem[]> = {
    image: [
      { title: "Lossless Processing", description: `Our image engine uses the Canvas API to process your ${inputName} files without degrading quality. Unlike re-encoding approaches, we preserve as much detail as possible during conversion.` },
      { title: "Transparency Support", description: "When converting between formats that support transparency (PNG, WebP, GIF), we preserve alpha channel information so your images maintain their transparent backgrounds." },
    ],
    document: [
      { title: "PDF Standards Compliant", description: "Our PDF engine generates standards-compliant PDF files that work across all major PDF readers including Adobe Acrobat, Preview, and web browsers." },
      { title: "No File Size Limits", description: "Unlike online PDF tools that cap file sizes, our browser-based engine handles documents of any size limited only by your device's memory." },
    ],
    video: [
      { title: "Powered by FFmpeg WASM", description: "We use FFmpeg compiled to WebAssembly, bringing professional-grade video processing to your browser. The same engine used by industry professionals, running locally on your device." },
      { title: "No File Size Restrictions", description: `Since video files never upload to a server, there are no arbitrary size limits. Your device's available memory is the only constraint.` },
    ],
    audio: [
      { title: "High Fidelity Conversion", description: "Our audio engine preserves audio quality during conversion. For lossy formats, you can adjust the bitrate to balance file size against audio fidelity." },
      { title: "Batch Processing", description: "Convert multiple audio files in sequence. Each file is processed independently, and you can download them as they complete." },
    ],
  };

  const items: BenefitItem[] = [privacy, speed, free, noSignup, quality, compatible];
  const catBenefits = categoryBenefits[categoryId];
  if (catBenefits) {
    items.splice(2, 0, ...catBenefits);
  }

  return items;
}

// ── Generate Use Cases ──

function generateUseCases(
  input: FormatDefinition,
  output: FormatDefinition | null,
  slug: string,
  name: string,
  isSame: boolean,
  isOperation: boolean,
  isUtility: boolean,
  categoryId: string,
): UseCaseItem[] {
  const inputName = input.name;
  const outputName = output?.name || inputName;
  const inputFull = input.fullName;
  const outputFull = output?.fullName || "";

  if (isUtility) {
    return [
      { title: "Development Workflows", description: `Use the ${name} tool during development to validate and format ${inputName} files before committing to version control. Clean, well-formatted data reduces code review friction and improves collaboration.` },
      { title: "Data Preparation", description: `Prepare ${inputFull} data for analysis or migration. Formatting and validating your data beforehand prevents errors in downstream processing pipelines.` },
      { title: "Debugging and Troubleshooting", description: `When debugging issues with ${inputName} data, use this tool to inspect and validate file contents. Quickly identify syntax errors, structural problems, or formatting inconsistencies.` },
      { title: "Learning and Exploration", description: `New to ${inputName}? Use this tool to explore how ${inputFull} files are structured. Format and experiment with sample data to understand the format's capabilities and constraints.` },
    ];
  }

  const formatFamily = input.family;

  // Image conversion use cases
  if (categoryId === "image" && output && !isSame) {
    return [
      { title: `Web Publishing`, description: `Convert ${inputName} to ${outputName} for web use. ${outputName} offers ${getTech(output.ext).compression} compression, making it ideal for reducing page load times while maintaining visual quality on your website.` },
      { title: `Print Preparation`, description: `When preparing images for print, converting to the right format ensures compatibility with publishing software and printing services. ${outputName} is widely supported in the print industry.` },
      { title: `Cross-Platform Sharing`, description: `Different platforms and applications have different format preferences. Converting ${inputName} to ${outputName} ensures your images display correctly across all devices and software.` },
      { title: `Storage Optimization`, description: `Reduce storage requirements by converting ${inputFull} to ${outputName}. ${getTech(output.ext).compression} compression significantly reduces file size while preserving acceptable quality for most use cases.` },
    ];
  }

  if (categoryId === "document" && output && output.ext === "pdf") {
    return [
      { title: "Document Archiving", description: `Convert ${inputName} to PDF for long-term document storage. PDF is the industry standard for archival documents, ensuring your files remain readable for years to come.` },
      { title: "Professional Sharing", description: `Share ${inputName} documents as PDF files for a professional presentation. PDF preserves formatting across all devices and operating systems.` },
      { title: "Print Ready Documents", description: `Prepare ${inputName} files for printing by converting to PDF. Print shops universally accept PDF, and the format ensures your document appears exactly as designed.` },
      { title: "Legal and Compliance", description: `Many legal and regulatory requirements mandate PDF format for official documents. Convert your ${inputName} files to meet compliance standards.` },
    ];
  }

  if (categoryId === "video" && output) {
    return [
      { title: "Cross-Platform Playback", description: `Convert ${inputName} to ${outputName} for consistent playback across all your devices. ${outputName} offers broad compatibility with media players, smart TVs, and mobile devices.` },
      { title: "Social Media Upload", description: `Different social platforms have preferred video formats. Convert to ${outputName} to ensure your videos upload correctly and maintain quality on your chosen platform.` },
      { title: "Video Editing Pipeline", description: `When editing video, converting to a suitable intermediate format can improve performance in your editing software. ${outputName} is optimized for ${getTech(output.ext).bestFor}.` },
      { title: "File Size Reduction", description: `Reduce large ${inputName} files by converting to ${outputName} with adjusted compression settings. Smaller files are easier to share, upload, and store.` },
    ];
  }

  if (categoryId === "audio" && output) {
    return [
      { title: "Music Playback Compatibility", description: `Convert ${inputName} to ${outputName} for playback on devices that don't support ${inputName}. ${outputName} is widely compatible with portable music players, car audio systems, and smart speakers.` },
      { title: "Streaming Optimization", description: `Prepare audio files for streaming by converting to ${outputName}. Balance file size and quality to ensure smooth playback even on slower internet connections.` },
      { title: "Audio Editing", description: `Convert to ${outputName} before editing in your digital audio workstation. Some audio editors work better with specific formats, and converting ensures optimal compatibility.` },
      { title: "Archiving and Storage", description: `Convert ${inputFull} files to ${outputName} for efficient storage. ${getTech(output.ext).compression} compression reduces storage requirements while preserving audio quality.` },
    ];
  }

  // Generic conversion use cases
  if (output && !isSame) {
    return [
      { title: "Format Compatibility", description: `Ensure your files work with software that only supports ${outputName}. Converting ${inputName} to ${outputName} guarantees compatibility without requiring additional plugins or converters.` },
      { title: "Workflow Integration", description: `Integrate ${inputFull} files into workflows that require ${outputFull}. This conversion bridges the gap between different tools and pipelines.` },
      { title: "File Size Management", description: `Convert between formats to optimize file size. Different formats use different compression methods, and choosing the right one can significantly reduce storage needs.` },
      { title: "Quality Optimization", description: `Choose the format that best preserves quality for your specific content type. Each format has strengths for different kinds of data.` },
    ];
  }

  // Same-format tools
  return [
    { title: "Data Quality Assurance", description: `Use this tool to clean up and validate your ${inputName} files before using them in production. Proper formatting prevents errors and ensures consistent data processing.` },
    { title: "Development Productivity", description: `Speed up your development workflow by formatting and minifying ${inputName} files directly in your browser without switching between multiple tools or IDE extensions.` },
    { title: "Learning and Reference", description: `Use the ${name} tool to study well-formatted ${inputName} examples. Seeing properly structured data helps you understand best practices and format conventions.` },
    { title: "Quick Fixes", description: `When you need to quickly fix formatting issues in a ${inputName} file, this tool provides instant results without launching a full development environment.` },
  ];
}

// ── Main generator ──

export function generateToolContent(params: {
  slug: string;
  name: string;
  inputFormat: FormatDefinition;
  outputFormat: FormatDefinition | null;
  inputFormats: string[];
  outputFormats: string[];
  categoryId: string;
  engine: string;
}): ToolContent {
  const { slug, name, inputFormat: input, outputFormat: output, categoryId } = params;
  const isSame = input.ext === (output?.ext || "");
  const isOperation = slug.includes("compress") || slug.includes("crop") || slug.includes("rotate") ||
    slug.includes("flip") || slug.includes("resize") || slug.includes("merge") || slug.includes("split") ||
    slug.includes("delete") || slug.includes("extract");
  const isUtility = slug.includes("format") || slug.includes("minify") || slug.includes("validate") ||
    slug.includes("encode") || slug.includes("decode") || slug.includes("hash") || slug.includes("generator") ||
    slug.includes("counter") || slug.includes("reverser") || slug.includes("uuid") ||
    slug.includes("case-") || slug.includes("case-") || slug.startsWith("text-to-") || slug === "word-counter" ||
    slug === "text-reverser" || slug === "css-minifier" || slug === "uuid-generator";

  // Use format characteristic info from formatTech or fallback to format description
  const h1 = generateH1(name, slug, input, output, isSame);

  const introduction = generateIntroduction(input, output, slug, name, isSame, isOperation, isUtility);

  const howToGuide = generateHowTo(input, output, slug, name, isSame, isOperation, isUtility);

  const benefits = generateBenefits(input, output, slug, name, isSame, isOperation, categoryId);

  const useCases = generateUseCases(input, output, slug, name, isSame, isOperation, isUtility, categoryId);

  return { h1, introduction, howToGuide, benefits, useCases };
}
