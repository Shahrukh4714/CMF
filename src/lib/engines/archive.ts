import { engineRegistry, type ConversionResult, type ConversionOptions, type Engine } from "./engine";

class ArchiveEngine implements Engine {
  id = "archive";
  name = "Archive";
  supportedActions = ["create-zip", "extract-zip"];

  async convert(file: File, options?: ConversionOptions): Promise<ConversionResult> {
    const action = options?.action || "create-zip";
    if (action === "create-zip") return this.createArchive(file, options);
    if (action === "extract-zip") return this.extractArchive(file);
    throw new Error(`Unknown archive action: ${action}`);
  }

  private async createArchive(_file: File, _options?: ConversionOptions): Promise<ConversionResult> {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    zip.file(_file.name, _file);
    const blob = await zip.generateAsync({ type: "blob" });
    return { blob, filename: `${_file.name.replace(/\.[^.]+$/, "")}.zip` };
  }

  private async extractArchive(file: File): Promise<ConversionResult> {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(file);
    const entries: { name: string; data: Blob }[] = [];
    zip.forEach((path, entry) => {
      if (!entry.dir) {
        entries.push({ name: path, data: null as unknown as Blob });
      }
    });
    for (const e of entries) {
      const entry = zip.file(e.name);
      if (entry) {
        e.data = await entry.async("blob");
      }
    }
    if (entries.length === 1) {
      return { blob: entries[0].data, filename: entries[0].name };
    }
    const { default: JSZip2 } = await import("jszip");
    const outZip = new JSZip2();
    for (const e of entries) {
      outZip.file(e.name, e.data);
    }
    const blob = await outZip.generateAsync({ type: "blob" });
    return { blob, filename: `${file.name.replace(/\.[^.]+$/, "")}_extracted.zip` };
  }
}

engineRegistry.register(new ArchiveEngine());
