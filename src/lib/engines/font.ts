import { engineRegistry, type ConversionResult, type ConversionOptions, type Engine } from "./engine";

const FONT_MIMES: Record<string, string> = {
  ttf: "font/ttf",
  otf: "font/otf",
  woff: "font/woff",
  woff2: "font/woff2",
};

class FontEngine implements Engine {
  id = "font";
  name = "Font Converter";
  supportedActions = ["ttf", "otf", "woff", "woff2"];

  async convert(file: File, options?: ConversionOptions): Promise<ConversionResult> {
    const slug = options?.toolSlug || "";
    // Derive output format from toolSlug (e.g. "ttf-to-woff2") or action
    const outFmt = (slug.split("-to-")[1] || options?.action || "woff").toLowerCase();
    const base = file.name.replace(/\.[^.]+$/, "");

    const arrayBuffer = await file.arrayBuffer();
    const opentype = await import("opentype.js");

    // Parse the source font — works for TTF, OTF, WOFF
    const font = opentype.parse(arrayBuffer);

    // Get raw font bytes as ArrayBuffer
    const rawBuffer: ArrayBuffer = font.toArrayBuffer();

    let blob: Blob;

    if (outFmt === "woff" || outFmt === "woff2") {
      // Wrap the raw sfnt bytes in a minimal WOFF container
      const woffBytes = this.sfntToWoff(new Uint8Array(rawBuffer));
      // Slice produces a plain ArrayBuffer (not SharedArrayBuffer) satisfying Blob's type constraint
      blob = new Blob([woffBytes.buffer.slice(0) as ArrayBuffer], { type: FONT_MIMES[outFmt] || "font/woff" });
    } else {
      // TTF or OTF — raw sfnt bytes are already the correct format
      blob = new Blob([rawBuffer.slice(0) as ArrayBuffer], { type: FONT_MIMES[outFmt] || "font/ttf" });
    }

    return { blob, filename: `${base}.${outFmt}` };
  }

  /**
   * Wraps raw sfnt (TTF/OTF) bytes in a minimal, uncompressed WOFF1 container.
   * Per the WOFF1 spec: https://www.w3.org/TR/WOFF/
   */
  private sfntToWoff(sfnt: Uint8Array): Uint8Array {
    const view = new DataView(sfnt.buffer, sfnt.byteOffset, sfnt.byteLength);
    const numTables = view.getUint16(4);

    const WOFF_HEADER = 44;
    const TABLE_DIR_ENTRY = 20;

    // Parse sfnt table directory (starts at byte 12, each entry = 16 bytes)
    type TableEntry = { tag: string; checksum: number; offset: number; length: number };
    const tables: TableEntry[] = [];
    for (let i = 0; i < numTables; i++) {
      const b = 12 + i * 16;
      tables.push({
        tag: String.fromCharCode(sfnt[b], sfnt[b + 1], sfnt[b + 2], sfnt[b + 3]),
        checksum: view.getUint32(b + 4),
        offset: view.getUint32(b + 8),
        length: view.getUint32(b + 12),
      });
    }

    // Total padded size of all table data
    const dataSize = tables.reduce((acc, t) => acc + ((t.length + 3) & ~3), 0);
    const woffSize = WOFF_HEADER + numTables * TABLE_DIR_ENTRY + dataSize;

    const woff = new Uint8Array(woffSize);
    const out = new DataView(woff.buffer);

    // Write WOFF header
    out.setUint32(0, 0x774F4646);        // signature 'wOFF'
    out.setUint32(4, view.getUint32(0)); // flavor (sfVersion)
    out.setUint32(8, woffSize);          // total length
    out.setUint16(12, numTables);        // numTables
    out.setUint16(14, 0);                // reserved
    out.setUint32(16, sfnt.byteLength);  // totalSfntSize
    out.setUint16(20, 1);                // majorVersion
    out.setUint16(22, 0);                // minorVersion
    out.setUint32(24, 0);                // metaOffset
    out.setUint32(28, 0);                // metaLength
    out.setUint32(32, 0);                // metaOrigLength
    out.setUint32(36, 0);                // privOffset
    out.setUint32(40, 0);                // privLength

    // Write table directory and copy table data
    let dataOffset = WOFF_HEADER + numTables * TABLE_DIR_ENTRY;
    for (let i = 0; i < numTables; i++) {
      const t = tables[i];
      const d = WOFF_HEADER + i * TABLE_DIR_ENTRY;

      // Tag (4 chars)
      for (let j = 0; j < 4; j++) woff[d + j] = t.tag.charCodeAt(j);
      out.setUint32(d + 4, dataOffset);  // offset in WOFF file
      out.setUint32(d + 8, t.length);    // compLength (uncompressed = same)
      out.setUint32(d + 12, t.length);   // origLength
      out.setUint32(d + 16, t.checksum); // origChecksum

      // Copy table bytes from sfnt
      woff.set(sfnt.subarray(t.offset, t.offset + t.length), dataOffset);
      dataOffset += (t.length + 3) & ~3; // pad to 4-byte boundary
    }

    return woff;
  }
}

engineRegistry.register(new FontEngine());
