"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, Check, X, Trash2, Plus, RefreshCw, Archive, Settings, Shield } from "lucide-react";
import { cn, formatFileSize, downloadBlob } from "@/lib/utils";
import { engineRegistry, convertImage, preloadFFmpeg, getFFmpegStatus } from "@/lib/converters";
import type { ToolDefinition } from "@/data/tools";
import { trackError } from "@/lib/telemetry";

// ── Types ──────────────────────────────────────────────────────────────────

type ItemStatus = "idle" | "converting" | "done" | "error" | "engine-loading";

interface BatchItem {
  id: string;
  file: File;
  status: ItemStatus;
  progress: number;
  resultBlob?: Blob;
  resultName?: string;
  errorMsg?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Component ──────────────────────────────────────────────────────────────

export function BatchConverterUI({ tool }: { tool: ToolDefinition }) {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outFmt = tool.outputFormats[0];
  const inFmt = tool.inputFormats[0];

  // Settings options state
  const [quality, setQuality] = useState(
    tool.processingType === "image" ? 92 : 80
  );
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [flip, setFlip] = useState<"none" | "horizontal" | "vertical">("none");
  const [rotate, setRotate] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Preload FFmpeg for video/audio tools
  useEffect(() => {
    if ((tool.engine === "video" || tool.engine === "audio") && getFFmpegStatus() === "unloaded") {
      preloadFFmpeg();
    }
  }, [tool.engine]);

  // ── File Acceptance ──

  const accept = tool.inputFormats.map((f) => "." + f).join(",");

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const valid = arr.filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      return tool.inputFormats.includes(ext);
    });
    if (valid.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...valid.map((f) => ({
        id: uid(),
        file: f,
        status: "idle" as ItemStatus,
        progress: 0,
      })),
    ]);
  }, [tool.inputFormats]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const clearAll = () => setItems([]);

  // ── Conversion Logic ──

  const convertItem = async (item: BatchItem): Promise<BatchItem> => {
    const update = (patch: Partial<BatchItem>) =>
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));

    update({ status: "converting", progress: 0 });

    try {
      // Pre-load FFmpeg engine if needed
      if ((tool.engine === "video" || tool.engine === "audio") && getFFmpegStatus() !== "loaded") {
        update({ status: "engine-loading" });
        await preloadFFmpeg();
        update({ status: "converting" });
      }

      const engine = engineRegistry.get(tool.engine);
      const opts: any = {
        action: outFmt,
        toolSlug: tool.slug,
        onProgress: (p: number) => update({ progress: Math.round(p * 100) }),
      };

      // Quality setting format normalization
      if (tool.engine === "image") {
        opts.quality = quality / 100;
      } else {
        opts.quality = quality;
      }

      // Optional settings
      if (width) opts.width = parseInt(width, 10);
      if (height) opts.height = parseInt(height, 10);
      if (flip !== "none") opts.flip = flip;
      if (rotate) opts.rotate = rotate;
      if (password) opts.password = password;

      let result;
      if (engine) {
        result = await engine.convert(item.file, opts);
      } else if (tool.processingType === "image") {
        result = await convertImage(item.file, outFmt, {
          quality: quality / 100,
          width: width ? parseInt(width, 10) : undefined,
          height: height ? parseInt(height, 10) : undefined,
          flip: flip !== "none" ? flip : undefined,
          rotate: rotate || undefined,
          onProgress: (p) => update({ progress: p }),
        });
      } else {
        throw new Error("No engine available for this format");
      }

      update({
        status: "done",
        progress: 100,
        resultBlob: result.blob,
        resultName: result.filename,
      });
      return { ...item, status: "done", resultBlob: result.blob, resultName: result.filename };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Conversion failed";
      const errorObj = err instanceof Error ? err : new Error(msg);
      trackError(errorObj, { toolSlug: tool.slug, fileName: item.file.name, fileSize: item.file.size });
      update({ status: "error", errorMsg: msg });
      return { ...item, status: "error", errorMsg: msg };
    }
  };

  const convertAll = async () => {
    if (running) return;
    const pending = items.filter((i) => i.status === "idle" || i.status === "error");
    if (pending.length === 0) return;
    setRunning(true);
    // Run conversions sequentially to avoid WASM memory contention
    for (const item of pending) {
      await convertItem(item);
    }
    setRunning(false);

    // Trigger confetti on successful batch conversion
    try {
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn("Failed to trigger confetti: ", e);
    }
  };

  // ── Download All ──

  const downloadAll = async () => {
    const done = items.filter((i) => i.status === "done" && i.resultBlob);
    if (done.length === 0) return;
    if (done.length === 1) {
      downloadBlob(done[0].resultBlob!, done[0].resultName!);
      return;
    }
    // Multiple files → bundle into a ZIP
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const item of done) {
      zip.file(item.resultName!, item.resultBlob!);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, `converted_${outFmt}_files.zip`);
  };

  // ── Derived State ──

  const doneCount = items.filter((i) => i.status === "done").length;
  const errorCount = items.filter((i) => i.status === "error").length;
  const pendingCount = items.filter((i) => i.status === "idle").length;
  const allDone = items.length > 0 && doneCount === items.length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="card" style={{ overflow: "hidden" }}>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: items.length > 0 ? "20px 24px" : "52px 36px",
          cursor: "pointer",
          background: dragOver ? "var(--accentbg)" : "transparent",
          transition: "background 0.15s",
          borderBottom: items.length > 0 ? "1px solid var(--border)" : "none",
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: "1.5px dashed",
          borderColor: dragOver ? "var(--accent)" : "var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 10,
          background: "var(--bg2)",
          transition: "border-color 0.15s",
          color: dragOver ? "var(--accent)" : "var(--ink3)",
        }}>
          <Plus className="h-4 w-4" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
          {items.length > 0 ? `Add more .${inFmt} files` : `Drop .${inFmt} files here`}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink3)" }}>
          {items.length > 0 ? "Multiple files supported" : "or click to browse — multiple files supported"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {/* File Queue */}
      {items.length > 0 && (
        <div>
          {/* Queue Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg2)",
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink2)", fontFamily: "var(--font-dm-mono), monospace" }}>
              {items.length} file{items.length !== 1 ? "s" : ""} · {doneCount} done{errorCount > 0 ? ` · ${errorCount} failed` : ""}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button 
                onClick={() => setSettingsOpen(!settingsOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  border: "1px solid " + (settingsOpen ? "var(--accent)" : "var(--border)"),
                  borderRadius: 6,
                  background: settingsOpen ? "var(--accentbg)" : "var(--bg2)",
                  color: settingsOpen ? "var(--accent)" : "var(--ink2)",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 500,
                  transition: "all 0.15s"
                }}
              >
                <Settings className="h-3 w-3" />
                Settings
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); clearAll(); }}
                style={{ fontSize: 11, color: "var(--ink3)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              >
                <Trash2 className="h-3 w-3" /> Clear all
              </button>
            </div>
          </div>

          {/* Item List */}
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {items.map((item) => (
              <FileRow key={item.id} item={item} outFmt={outFmt} onRemove={removeItem} />
            ))}
          </div>

          {/* Settings Panel */}
          {settingsOpen && (
            <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Quality Settings */}
              {(tool.processingType === "image" || tool.engine === "video" || tool.engine === "audio") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Quality / Compression (Apply to all)</label>
                    <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>{quality}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={quality} 
                    onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                    style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 10, color: "var(--ink3)" }}>
                    {tool.engine === "audio" 
                      ? `Target Bitrate: ${Math.max(64, Math.round((quality / 100) * 320))} kbps` 
                      : tool.engine === "video" 
                        ? `Target CRF: ${Math.round(51 - (quality / 100) * 51)} (lower is higher quality)` 
                        : "Adjust compression level (applied to all files in queue)"}
                  </span>
                </div>
              )}

              {/* Image Dimensions & Adjustments */}
              {tool.processingType === "image" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>Width (px)</label>
                      <input 
                        type="number" 
                        placeholder="Original" 
                        value={width} 
                        onChange={(e) => setWidth(e.target.value)}
                        style={{ padding: "6px 10px", fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--ink)", outline: "none" }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>Height (px)</label>
                      <input 
                        type="number" 
                        placeholder="Original" 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)}
                        style={{ padding: "6px 10px", fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--ink)", outline: "none" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>Flip</label>
                      <select 
                        value={flip} 
                        onChange={(e: any) => setFlip(e.target.value)}
                        style={{ padding: "6px 10px", fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--ink)", outline: "none", cursor: "pointer" }}
                      >
                        <option value="none">None</option>
                        <option value="horizontal">Horizontal (Mirror)</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>Rotate</label>
                      <select 
                        value={rotate} 
                        onChange={(e: any) => setRotate(parseInt(e.target.value, 10))}
                        style={{ padding: "6px 10px", fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--ink)", outline: "none", cursor: "pointer" }}
                      >
                        <option value="0">0°</option>
                        <option value="90">90° Clockwise</option>
                        <option value="180">180°</option>
                        <option value="270">270° Counter-Clockwise</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Settings (Rotation on PDF Rotate tool, Password Lock on any PDF Output) */}
              {tool.slug === "rotate-pdf" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>PDF Page Rotation</label>
                  <select 
                    value={rotate || "90"} 
                    onChange={(e: any) => setRotate(parseInt(e.target.value, 10))}
                    style={{ padding: "8px 12px", fontSize: 13, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--ink)", outline: "none", cursor: "pointer" }}
                  >
                    <option value="90">90° Clockwise</option>
                    <option value="180">180° Half Turn</option>
                    <option value="270">270° Counter-Clockwise</option>
                  </select>
                </div>
              )}

              {outFmt === "pdf" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Shield className="h-3.5 w-3.5 text-success" style={{ color: "var(--success)" }} />
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>PDF Lock (Password Protection)</label>
                  </div>
                  <input 
                    type="password" 
                    placeholder="Enter password to encrypt PDF (applied to all output PDFs)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--ink)", outline: "none" }}
                  />
                  <span style={{ fontSize: 10, color: "var(--ink3)" }}>
                    Locks all generated output PDFs with this password.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div style={{
            display: "flex", gap: 10, padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            background: "var(--bg2)",
            flexWrap: "wrap",
          }}>
            {/* Convert Button */}
            {pendingCount > 0 || errorCount > 0 ? (
              <button
                onClick={convertAll}
                disabled={running}
                className="btn-primary"
                style={{ fontSize: 13, padding: "8px 20px", opacity: running ? 0.7 : 1 }}
              >
                {running ? (
                  <><RefreshCw className="h-3.5 w-3.5 animate-spin inline mr-1.5" /> Converting...</>
                ) : (
                  <>Convert {pendingCount > 0 ? pendingCount : errorCount} file{(pendingCount || errorCount) !== 1 ? "s" : ""} → {outFmt.toUpperCase()}</>
                )}
              </button>
            ) : null}

            {/* Download Button */}
            {doneCount > 0 && (
              <button
                onClick={downloadAll}
                className={cn("btn-secondary", allDone ? "btn-success" : "")}
                style={{ fontSize: 13, padding: "8px 20px", display: "flex", alignItems: "center", gap: 6 }}
              >
                {doneCount > 1 ? (
                  <><Archive className="h-3.5 w-3.5" /> Download all as ZIP ({doneCount} files)</>
                ) : (
                  <><Download className="h-3.5 w-3.5" /> Download {outFmt.toUpperCase()}</>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      {/* Privacy Disclosure Banner */}
      {(() => {
        const isClient = tool.slug !== "image-to-text" && (tool.engine !== "document" || ![
          "docx-to-pdf", "pdf-to-docx", 
          "xlsx-to-pdf", "pdf-to-xlsx", 
          "csv-to-xlsx", "json-to-xlsx", "txt-to-xlsx", 
          "epub-to-pdf", "pdf-to-txt"
        ].includes(tool.slug));
        
        return (
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderTop: "1px solid var(--border)",
              background: isClient ? "var(--successbg)" : "var(--accentbg)",
              color: isClient ? "var(--success)" : "var(--accent)",
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            <Shield className="h-3.5 w-3.5 shrink-0" />
            <span style={{ lineHeight: 1.4 }}>
              {isClient 
                ? "100% Private: Files processed entirely in your web browser. No files are uploaded to any server." 
                : "Secure Cloud API: Processed in-memory via our secure API. Files are permanently deleted immediately after conversion."}
            </span>
          </div>
        );
      })()}
    </div>
  );
}

// ── File Row ──────────────────────────────────────────────────────────────

function FileRow({
  item,
  outFmt,
  onRemove,
}: {
  item: BatchItem;
  outFmt: string;
  onRemove: (id: string) => void;
}) {
  const statusColor = {
    idle: "var(--ink3)",
    converting: "var(--accent)",
    "engine-loading": "var(--accent)",
    done: "var(--success)",
    error: "var(--danger, #dc2626)",
  }[item.status];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 20px",
      borderBottom: "1px solid var(--border)",
      transition: "background 0.1s",
    }}>
      {/* Status Icon */}
      <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: statusColor }}>
        {item.status === "done" && <Check className="h-3.5 w-3.5" />}
        {(item.status === "converting" || item.status === "engine-loading") && (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        )}
        {item.status === "error" && <X className="h-3.5 w-3.5" />}
        {item.status === "idle" && (
          <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 9, fontWeight: 600 }}>
            {item.file.name.split(".").pop()?.toUpperCase()}
          </span>
        )}
      </div>

      {/* File Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item.status === "done" ? item.resultName : item.file.name}
        </div>
        <div style={{ fontSize: 10, color: "var(--ink3)", fontFamily: "var(--font-dm-mono), monospace", marginTop: 2 }}>
          {item.status === "idle" && formatFileSize(item.file.size)}
          {item.status === "converting" && (
            <span style={{ color: "var(--accent)" }}>
              {item.progress > 0 ? `${item.progress}%` : "Starting..."}
            </span>
          )}
          {item.status === "engine-loading" && (
            <span style={{ color: "var(--accent)" }}>Loading engine (~25MB)...</span>
          )}
          {item.status === "done" && (
            <span style={{ color: "var(--success)" }}>
              ✓ Converted · {item.resultBlob ? formatFileSize(item.resultBlob.size) : ""}
            </span>
          )}
          {item.status === "error" && (
            <span style={{ color: "var(--danger, #dc2626)" }}>{item.errorMsg}</span>
          )}
        </div>

        {/* Progress bar */}
        {item.status === "converting" && item.progress > 0 && (
          <div style={{ height: 2, background: "var(--border)", borderRadius: 100, marginTop: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: item.progress + "%", background: "var(--accent)", borderRadius: 100, transition: "width 0.3s ease" }} />
          </div>
        )}
      </div>

      {/* Download single */}
      {item.status === "done" && item.resultBlob && (
        <button
          onClick={() => downloadBlob(item.resultBlob!, item.resultName!)}
          title="Download"
          style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "var(--bg3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--success)", flexShrink: 0 }}
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Remove button */}
      {item.status !== "converting" && item.status !== "engine-loading" && (
        <button
          onClick={() => onRemove(item.id)}
          title="Remove"
          style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "var(--bg3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink3)", flexShrink: 0 }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
