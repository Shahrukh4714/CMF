export interface ConversionResult {
  blob: Blob;
  filename: string;
}

export interface ConversionOptions {
  quality?: number;
  width?: number;
  height?: number;
  /** Crop region: { x, y, width, height } as percentages or pixels */
  crop?: { x: number; y: number; width: number; height: number };
  /** Rotation in degrees */
  rotate?: number;
  /** Flip direction */
  flip?: "horizontal" | "vertical";
  /** For PDF operations */
  pageRange?: string;
  pagesToDelete?: number[];
  pagesToExtract?: number[];
  /** For audio/video trimming in seconds */
  trimStart?: number;
  trimEnd?: number;
  /** For GIF creation */
  fps?: number;
  /** For hash */
  algorithm?: string;
  /** Action name for the engine (e.g. "compress", "rotate", "encode", "json-format") */
  action?: string;
  /** The tool slug (e.g. "json-to-csv") to allow engines to resolve correct actions */
  toolSlug?: string;
  /** Password for PDF encryption / locking */
  password?: string;
  /** Progress callback (0-100) for real-time progress tracking */
  onProgress?: (progress: number) => void;
}

export interface Engine {
  id: string;
  name: string;
  convert(file: File, options?: ConversionOptions): Promise<ConversionResult>;
  supportedActions?: string[];
}

class EngineRegistry {
  private engines = new Map<string, Engine>();

  register(engine: Engine): void {
    this.engines.set(engine.id, engine);
  }

  get(id: string): Engine | undefined {
    return this.engines.get(id);
  }

  getAll(): Engine[] {
    return Array.from(this.engines.values());
  }
}

export const engineRegistry = new EngineRegistry();
