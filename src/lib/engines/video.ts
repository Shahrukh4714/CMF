import type { ConversionOptions, ConversionResult } from "./engine";
import { engineRegistry } from "./engine";

let ffmpegInstance: any = null;
let ffmpegLoaded = false;
let ffmpegStatus: "unloaded" | "loading" | "loaded" | "error" = "unloaded";
let ffmpegLoadPromise: Promise<any> | null = null;

export function getFFmpegStatus() {
  return ffmpegStatus;
}

export async function preloadFFmpeg() {
  if (ffmpegStatus === "loaded") return;
  if (ffmpegStatus === "loading" && ffmpegLoadPromise) return ffmpegLoadPromise;
  ffmpegStatus = "loading";
  ffmpegLoadPromise = getFFmpeg().then(() => { ffmpegStatus = "loaded"; }).catch(() => { ffmpegStatus = "error"; });
  return ffmpegLoadPromise;
}

async function getFFmpeg() {
  if (ffmpegLoaded && ffmpegInstance) return ffmpegInstance;

  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { toBlobURL } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
  } catch {
    const altBase = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${altBase}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${altBase}/ffmpeg-core.wasm`, "application/wasm"),
    });
  }

  ffmpegInstance = ffmpeg;
  ffmpegLoaded = true;
  return ffmpeg;
}

function generateOutputFilename(input: string, outputExt: string): string {
  return input.replace(/\.[^.]+$/, "") + "." + outputExt;
}

// ── Convert video format ──
async function convertVideo(file: File, outputExt: string, options: ConversionOptions = {}): Promise<ConversionResult> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + (file.name.match(/\.[^.]+$/)?.[0] || "");
  const outputName = "output." + outputExt;

  const onProgress = options.onProgress;
  if (onProgress) ffmpeg.on("progress", ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  await ffmpeg.writeFile(inputName, await file.bytes());

  const args = ["-i", inputName];

  if (options.quality) {
    const crf = Math.round(51 - (options.quality / 100) * 51);
    args.push("-crf", String(crf));
  }

  if (options.width || options.height) {
    const scale = options.width && options.height
      ? `${options.width}:${options.height}`
      : options.width
        ? `${options.width}:-2`
        : `-2:${options.height}`;
    args.push("-vf", `scale=${scale}`);
  }

  args.push("-y", outputName);

  await ffmpeg.exec(args);
  const data = await ffmpeg.readFile(outputName);
  ffmpeg.deleteFile(inputName);
  ffmpeg.deleteFile(outputName);

  return {
    blob: new Blob([data], { type: `video/${outputExt}` }),
    filename: generateOutputFilename(file.name, outputExt),
  };
}

// ── Extract audio from video ──
async function extractAudio(file: File, outputExt: string, options: ConversionOptions = {}): Promise<ConversionResult> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + (file.name.match(/\.[^.]+$/)?.[0] || "");
  const outputName = "output." + outputExt;

  const onProgress = options.onProgress;
  if (onProgress) ffmpeg.on("progress", ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  await ffmpeg.writeFile(inputName, await file.bytes());
  await ffmpeg.exec(["-i", inputName, "-vn", "-acodec", getAudioCodec(outputExt), "-y", outputName]);
  const data = await ffmpeg.readFile(outputName);
  ffmpeg.deleteFile(inputName);
  ffmpeg.deleteFile(outputName);

  return {
    blob: new Blob([data], { type: `audio/${outputExt}` }),
    filename: generateOutputFilename(file.name, outputExt),
  };
}

function getAudioCodec(ext: string): string {
  switch (ext) {
    case "mp3": return "libmp3lame";
    case "aac": return "aac";
    case "ogg": return "libvorbis";
    case "oga": return "libvorbis";
    case "wav": return "pcm_s16le";
    case "flac": return "flac";
    case "opus": return "libopus";
    case "aiff": return "pcm_s16be";
    case "alac": return "alac";
    case "amr": return "amr_nb";
    case "m4b": return "aac";
    case "mp2": return "mp2";
    case "wma": return "wmav2";
    default: return "copy";
  }
}

// ── Create GIF from video ──
async function createGif(file: File, fps = 10, options: ConversionOptions = {}): Promise<ConversionResult> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + (file.name.match(/\.[^.]+$/)?.[0] || "");
  const outputName = "output.gif";

  const onProgress = options.onProgress;
  if (onProgress) ffmpeg.on("progress", ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  await ffmpeg.writeFile(inputName, await file.bytes());
  await ffmpeg.exec([
    "-i", inputName,
    "-vf", `fps=${fps},scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
    "-y", outputName,
  ]);
  const data = await ffmpeg.readFile(outputName);
  ffmpeg.deleteFile(inputName);
  ffmpeg.deleteFile(outputName);

  return {
    blob: new Blob([data], { type: "image/gif" }),
    filename: generateOutputFilename(file.name, "gif"),
  };
}

// ── Convert audio format ──
async function convertAudio(file: File, outputExt: string, options: ConversionOptions = {}): Promise<ConversionResult> {
  const ffmpeg = await getFFmpeg();
  const inputName = "input" + (file.name.match(/\.[^.]+$/)?.[0] || "");
  const outputName = "output." + outputExt;

  const onProgress = options.onProgress;
  if (onProgress) ffmpeg.on("progress", ({ progress }: { progress: number }) => {
    onProgress(Math.round(progress * 100));
  });

  await ffmpeg.writeFile(inputName, await file.bytes());

  const args = ["-i", inputName];

  // Audio bitrate based on quality
  if (options.quality) {
    const bitrate = Math.max(64, Math.round((options.quality / 100) * 320));
    args.push("-b:a", `${bitrate}k`);
  }

  // Trim
  if (options.trimStart !== undefined) {
    args.push("-ss", String(options.trimStart));
  }
  if (options.trimEnd !== undefined) {
    args.push("-to", String(options.trimEnd));
  }

  args.push("-acodec", getAudioCodec(outputExt), "-y", outputName);

  await ffmpeg.exec(args);
  const data = await ffmpeg.readFile(outputName);
  ffmpeg.deleteFile(inputName);
  ffmpeg.deleteFile(outputName);

  return {
    blob: new Blob([data], { type: `audio/${outputExt}` }),
    filename: generateOutputFilename(file.name, outputExt),
  };
}

const VIDEO_OPERATION_ACTIONS = new Set(["compress", "resize"]);

// ── Register Video Engine ──
engineRegistry.register({
  id: "video",
  name: "Video Engine",
  async convert(file: File, options: ConversionOptions = {}) {
    const action = options.action || "mp4";
    const outputExt = VIDEO_OPERATION_ACTIONS.has(action) ? "mp4" : action;
    return convertVideo(file, outputExt, options);
  },
  supportedActions: ["mp4", "webm", "avi", "mov", "mkv", "m4v", "mpeg", "ogv", "3gp", "flv", "wmv", "asf", "m2ts", "mts", "ts", "vob", "3g2", "swf", "gif", "mp3", "compress", "resize"],
});

// ── Register Audio Engine ──
engineRegistry.register({
  id: "audio",
  name: "Audio Engine",
  async convert(file: File, options: ConversionOptions = {}) {
    const outputExt = options.action || "mp3";
    if (outputExt === "gif") return createGif(file, options.fps, options);
    return convertAudio(file, outputExt, options);
  },
  supportedActions: ["mp3", "wav", "ogg", "flac", "aac", "m4a", "opus", "wma", "aiff", "alac", "amr", "ape", "m4b", "mid", "mp2", "oga", "caf"],
});

export { convertVideo, extractAudio, createGif, convertAudio, getFFmpeg };
