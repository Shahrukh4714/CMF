"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, Check, X, Settings, Shield } from "lucide-react";
import { Button } from "./ui/Button";
import { cn, formatFileSize, downloadBlob } from "@/lib/utils";
import { engineRegistry, convertImage, preloadFFmpeg, getFFmpegStatus } from "@/lib/converters";
import type { ConversionResult, ConversionOptions } from "@/lib/converters";
import type { ToolDefinition } from "@/data/tools";
import { trackError } from "@/lib/telemetry";

type ConvState = "drop" | "selected" | "progress" | "result" | "error";

export function ConverterUI({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ConvState>("drop");
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
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
  const [engineLoading, setEngineLoading] = useState(false);

  const outFmt = tool.outputFormats[0];
  const inFmt = tool.inputFormats[0];

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.name.endsWith("." + inFmt) || f.name.toLowerCase().endsWith("." + inFmt.toLowerCase()))) {
      setFile(f);
      setState("selected");
    } else if (f) {
      setErrorMsg("Please drop a ." + inFmt + " file");
      setState("error");
    }
  }, [inFmt]);

  const handleConvert = useCallback(async () => {
    if (!file || converting) return;
    setConverting(true);
    setState("progress");
    setProgress(0);

    // If dynamic video/audio compiler engines are downloading, show loading status
    if (tool.engine === "video" || tool.engine === "audio") {
      if (getFFmpegStatus() !== "loaded") {
        setEngineLoading(true);
        try {
          await preloadFFmpeg();
        } catch (e) {
          console.error("FFmpeg preloading error in UI: ", e);
        } finally {
          setEngineLoading(false);
        }
      }
    }

    try {
      const engine = engineRegistry.get(tool.engine);
      let result: ConversionResult;
      
      const convOptions: ConversionOptions = {
        action: outFmt,
        toolSlug: tool.slug,
        onProgress: (p: number) => setProgress(Math.round(p * 100)),
      };

      // Quality setting format normalization
      if (tool.engine === "image") {
        convOptions.quality = quality / 100;
      } else {
        convOptions.quality = quality;
      }

      // Optional settings
      if (width) convOptions.width = parseInt(width, 10);
      if (height) convOptions.height = parseInt(height, 10);
      if (flip !== "none") convOptions.flip = flip;
      if (rotate) convOptions.rotate = rotate;
      if (password) convOptions.password = password;

      if (engine) {
        result = await engine.convert(file, convOptions);
      } else if (tool.processingType === "image") {
        const r = await convertImage(file, outFmt, {
          quality: quality / 100,
          width: width ? parseInt(width, 10) : undefined,
          height: height ? parseInt(height, 10) : undefined,
          flip: flip !== "none" ? flip : undefined,
          rotate: rotate || undefined,
          onProgress: (p: number) => setProgress(p)
        });
        result = r;
      } else {
        throw new Error("No engine available for this format");
      }
      setProgress(100);
      setResultBlob(result.blob);
      setResultName(result.filename);
      setState("result");

      // Trigger confetti on successful conversion
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn("Failed to trigger confetti: ", e);
      }
    } catch (err: any) {
      trackError(err, { toolSlug: tool.slug, fileName: file.name, fileSize: file.size });
      setErrorMsg(err.message || "Conversion failed");
      setState("error");
    } finally {
      setConverting(false);
    }
  }, [file, converting, tool, outFmt, quality, width, height, flip, rotate, password]);

  useEffect(() => {
    if ((tool.engine === "video" || tool.engine === "audio") && getFFmpegStatus() === "unloaded") {
      preloadFFmpeg();
    }
  }, [tool.engine]);

  const accept = "." + inFmt;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {state === "drop" && (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 36px", cursor: "pointer", minHeight: 240, background: dragOver ? "var(--accentbg)" : "transparent", transition: "background 0.15s" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1.5px dashed", borderColor: dragOver ? "var(--accent)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, background: "var(--bg2)", transition: "border-color 0.15s", color: dragOver ? "var(--accent)" : "var(--ink3)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Drop a .{inFmt} file here</div>
          <div style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 18, textAlign: "center" }}>or click to browse</div>
          <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setState("selected"); } }} />
        </div>
      )}

      {state === "selected" && file && (
        <div style={{ display: "flex", flexDirection: "column", minHeight: 240 }}>
          {/* File Row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 24px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 6, background: "var(--accentbg)", border: "1px solid var(--accentbd)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, fontWeight: 500, color: "var(--accent)", flexShrink: 0 }}>
              {inFmt.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, color: "var(--ink3)", marginTop: 2 }}>{formatFileSize(file.size)}</div>
            </div>
            
            {/* Settings Toggle Cog Button */}
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                border: "1px solid " + (settingsOpen ? "var(--accent)" : "var(--border)"),
                borderRadius: 6,
                background: settingsOpen ? "var(--accentbg)" : "var(--bg2)",
                color: settingsOpen ? "var(--accent)" : "var(--ink2)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                transition: "all 0.15s"
              }}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </button>

            {/* Clear Button */}
            <button onClick={() => { setFile(null); setState("drop"); }}
              style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "var(--bg3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink3)" }}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Settings Panel */}
          {settingsOpen && (
            <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Quality Settings */}
              {(tool.processingType === "image" || tool.engine === "video" || tool.engine === "audio") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Quality / Compression</label>
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
                        : "Adjust compression level (lower percentages yield smaller file sizes but reduced quality)"}
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
                    placeholder="Enter password to encrypt PDF (leave blank for unlocked)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: 12, border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg)", color: "var(--ink)", outline: "none" }}
                  />
                  <span style={{ fontSize: 10, color: "var(--ink3)" }}>
                    Locks the output PDF. Users will be prompted for this password to view the document.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div style={{ padding: "20px 24px", display: "flex", justifyContent: "flex-end", background: "var(--bg2)" }}>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleConvert}
            >
              Convert to {outFmt.toUpperCase()}
            </Button>
          </div>
        </div>
      )}

      {state === "progress" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 36px", gap: 14, minHeight: 240 }}>
          <div className="spinner" />
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", textAlign: "center" }}>
            {engineLoading ? "Downloading conversion engine..." : `Converting to ${outFmt.toUpperCase()}`}
          </div>
          <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, color: "var(--ink3)", textAlign: "center" }}>
            {engineLoading ? "This happens only on your first conversion (~25MB)" : "Processing on your device"}
          </div>
          <div style={{ width: "100%", maxWidth: 260, height: 2, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--accent)", borderRadius: 100, width: (engineLoading ? 0 : progress) + "%", transition: "width 0.3s ease" }} />
          </div>
        </div>
      )}

      {state === "result" && resultBlob && (
        <div>
          <div style={{ padding: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--successbg)", border: "1.5px solid var(--successbd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check className="h-5 w-5" style={{ color: "var(--success)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 13, color: "var(--ink)", fontWeight: 500, wordBreak: "break-all" }}>{resultName}</div>
            <div style={{ fontSize: 12, color: "var(--ink3)" }}>{formatFileSize(resultBlob.size)} &middot; converted on your device</div>
            <Button variant="primary" size="lg"
              onClick={() => downloadBlob(resultBlob, resultName)}
              icon={<Download className="h-4 w-4" />}>
              Download
            </Button>
            <button className="btn-ghost" onClick={() => { setFile(null); setResultBlob(null); setState("drop"); }}>
              Convert another
            </button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div style={{ padding: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--accentbg)", border: "1.5px solid var(--accentbd)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "var(--accent)" }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Conversion failed</div>
          <div style={{ fontSize: 13, color: "var(--ink2)", maxWidth: 360, lineHeight: 1.6 }}>{errorMsg}</div>
          <button className="btn-secondary" onClick={() => { setFile(null); setState("drop"); setErrorMsg(""); }}>
            Try again
          </button>
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
                ? "100% Private: File processed entirely in your web browser. No files are uploaded to any server." 
                : "Secure Cloud API: Processed in-memory via our secure API. Files are permanently deleted immediately after conversion."}
            </span>
          </div>
        );
      })()}
    </div>
  );
}
