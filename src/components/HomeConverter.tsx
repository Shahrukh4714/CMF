"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { DAILY_LIMIT } from "@/lib/limits";
import { 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileText, 
  File as FileIcon,
  Trash2, 
  Download, 
  Settings as SettingsIcon, 
  Plus, 
  ArrowRight,
  Check,
  AlertCircle,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { engineRegistry, preloadFFmpeg, getFFmpegStatus } from "@/lib/converters";
import { PricingModal } from "./PricingModal";

const FMT: Record<string, { cat: string; out: string[] }> = {
  // video
  mp4:  { cat: "video",    out: ["mp3","wav","gif","webm","avi","mov"] },
  mov:  { cat: "video",    out: ["mp4","mp3","gif","webm","avi"] },
  avi:  { cat: "video",    out: ["mp4","mp3","gif","webm","mov"] },
  mkv:  { cat: "video",    out: ["mp4","mp3","webm","avi"] },
  webm: { cat: "video",    out: ["mp4","mp3","gif","avi"] },
  // audio
  mp3:  { cat: "audio",    out: ["wav","aac","ogg","flac"] },
  wav:  { cat: "audio",    out: ["mp3","aac","ogg","flac"] },
  aac:  { cat: "audio",    out: ["mp3","wav","ogg"] },
  ogg:  { cat: "audio",    out: ["mp3","wav","aac"] },
  flac: { cat: "audio",    out: ["mp3","wav","aac"] },
  m4a:  { cat: "audio",    out: ["mp3","wav","aac","ogg"] },
  // image
  jpg:  { cat: "image",    out: ["png","webp","bmp","gif"] },
  jpeg: { cat: "image",    out: ["png","webp","bmp","gif"] },
  png:  { cat: "image",    out: ["jpg","webp","bmp","gif"] },
  webp: { cat: "image",    out: ["jpg","png","bmp","gif"] },
  gif:  { cat: "image",    out: ["jpg","png","webp","bmp"] },
  bmp:  { cat: "image",    out: ["jpg","png","webp","gif"] },
  svg:  { cat: "image",    out: ["png","jpg"] },
  // document
  pdf:  { cat: "document", out: ["docx","txt","jpg","png"] },
  txt:  { cat: "document", out: ["html"] },
  docx: { cat: "document", out: ["pdf","txt","html"] },
  xlsx: { cat: "document", out: ["pdf"] },
  csv:  { cat: "document", out: ["xlsx"] },
  json: { cat: "document", out: ["xlsx"] },
  epub: { cat: "document", out: ["pdf"] },
};

const LABELS: Record<string, string> = {
  mp3:"MP3", wav:"WAV", aac:"AAC", ogg:"OGG", flac:"FLAC", m4a:"M4A",
  mp4:"MP4", webm:"WebM", avi:"AVI", mov:"MOV", gif:"GIF",
  jpg:"JPG", png:"PNG", webp:"WebP", bmp:"BMP", svg:"SVG",
  pdf:"PDF", txt:"TXT", html:"HTML", docx:"DOCX", xlsx:"XLSX", csv:"CSV", json:"JSON", epub:"EPUB"
};

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  ext: string;
  cat: string;
  toFmt: string;
  status: "idle" | "converting" | "done" | "error" | "loading-engine";
  progress: number;
  resultBlob?: Blob;
  resultName?: string;
  resultSize?: number;
  errorMsg?: string;
  
  // Options
  settingsOpen: boolean;
  quality: number; // 0-100
  width: string;
  height: string;
  password?: string;
}

function fmtSz(b: number) { 
  return b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB"; 
}

function getExt(name: string) { 
  return name.split(".").pop()?.toLowerCase() || ""; 
}

export function HomeConverter() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [convDone, setConvDone] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [convertingAll, setConvertingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const used = Math.min(convDone, DAILY_LIMIT);
  const rem = Math.max(0, DAILY_LIMIT - convDone);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("convertit_conv_count");
        if (saved) setConvDone(Number(saved));
      } catch {}
    }
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: FileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const e = getExt(f.name);
      const cfg = FMT[e];
      if (!cfg) continue;
      
      const targets = cfg.out.filter((o) => o !== e);
      newItems.push({
        id: Math.random().toString(36).substring(7),
        file: f,
        name: f.name,
        size: f.size,
        ext: e,
        cat: cfg.cat,
        toFmt: targets[0] || "",
        status: "idle",
        progress: 0,
        settingsOpen: false,
        quality: cfg.cat === "image" ? 92 : 80,
        width: "",
        height: "",
        password: ""
      });
    }
    
    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => { 
    e.preventDefault(); 
    setDragOver(true); 
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const updateItemFormat = (id: string, fmt: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, toFmt: fmt } : item));
  };

  const updateItemOption = (id: string, key: keyof FileItem, value: any) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };

  const convertAll = async () => {
    if (convertingAll) return;
    
    if (convDone >= DAILY_LIMIT) {
      setShowPricing(true);
      return;
    }

    setConvertingAll(true);
    
    for (const item of items) {
      if (item.status !== "idle" && item.status !== "error") continue;
      
      const requiresPreload = (item.cat === "video" || item.cat === "audio") && getFFmpegStatus() !== "loaded";
      
      setItems(prev => prev.map(it => it.id === item.id ? { 
        ...it, 
        status: requiresPreload ? "loading-engine" : "converting", 
        progress: 0 
      } : it));

      if (requiresPreload) {
        try {
          await preloadFFmpeg();
        } catch (e) {
          console.error("FFmpeg preloading error in HomeConverter: ", e);
        }
        setItems(prev => prev.map(it => it.id === item.id ? { 
          ...it, 
          status: "converting" 
        } : it));
      }
      
      try {
        const engine = engineRegistry.get(item.cat);
        if (!engine) throw new Error(`No engine found for category: ${item.cat}`);
        
        const convOptions: any = {
          action: item.toFmt,
          quality: item.cat === "image" ? item.quality / 100 : item.quality,
          onProgress: (p: number) => {
            const pct = p <= 1 ? Math.round(p * 100) : Math.round(p);
            setItems(prev => prev.map(it => it.id === item.id ? { ...it, progress: Math.min(pct, 99) } : it));
          }
        };
        
        if (item.width) convOptions.width = parseInt(item.width, 10);
        if (item.height) convOptions.height = parseInt(item.height, 10);
        if (item.password) convOptions.password = item.password;
        
        const result = await engine.convert(item.file, convOptions);
        
        setItems(prev => prev.map(it => it.id === item.id ? { 
          ...it, 
          status: "done", 
          progress: 100,
          resultBlob: result.blob,
          resultName: result.filename,
          resultSize: result.blob.size
        } : it));
        
        setConvDone(prev => {
          const next = prev + 1;
          try { localStorage.setItem("convertit_conv_count", String(next)); } catch {}
          return next;
        });
        
      } catch (err: unknown) {
        // Safely extract message from any thrown value (Error, plain object, string, undefined)
        let errMsg = "Conversion failed";
        if (err instanceof Error) {
          errMsg = err.message || errMsg;
        } else if (err !== null && err !== undefined && typeof err === "object" && "message" in err) {
          errMsg = String((err as { message: unknown }).message) || errMsg;
        } else if (typeof err === "string" && err) {
          errMsg = err;
        }
        console.warn("Conversion error:", err);
        setItems(prev => prev.map(it => it.id === item.id ? { 
          ...it, 
          status: "error", 
          errorMsg: errMsg
        } : it));
      }
    }
    
    setConvertingAll(false);
  };

  const downloadAll = () => {
    let delay = 0;
    items.forEach((item) => {
      if (item.status === "done" && item.resultBlob) {
        setTimeout(() => {
          const url = URL.createObjectURL(item.resultBlob!);
          const a = document.createElement("a");
          a.href = url;
          a.download = item.resultName || "download";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, delay);
        delay += 300;
      }
    });
  };

  const downloadItem = (item: FileItem) => {
    if (!item.resultBlob) return;
    const url = URL.createObjectURL(item.resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.resultName || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderFileIcon = (cat: string) => {
    const className = "w-6 h-6 text-[#5D5FEF]";
    switch(cat) {
      case "image": return <FileImage className={className} />;
      case "video": return <FileVideo className={className} />;
      case "audio": return <FileAudio className={className} />;
      case "document": return <FileText className={className} />;
      default: return <FileIcon className={className} />;
    }
  };

  const hasConversions = items.length > 0;
  const doneItems = items.filter(it => it.status === "done");
  const hasFinished = doneItems.length > 0;

  return (
    <div style={{ maxWidth: 760, width: "100%", margin: "0 auto", padding: "0 10px" }}>
      <div className="converter-card-container" style={{ borderRadius: 12, overflow: "hidden" }}>
        {/* Session Progress Header */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          padding: "12px 20px", 
          background: "var(--bg2)", 
          borderBottom: "1px solid var(--border)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ 
              fontFamily: "var(--font-dm-sans), sans-serif", 
              fontSize: 12.5, 
              color: "var(--ink)", 
              fontWeight: 600,
              letterSpacing: "-0.2px"
            }}>
              {rem === 0 ? "No free conversions left" : `${rem} free conversions remaining`}
            </span>
            <span style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 10,
              fontWeight: 700,
              color: "white",
              background: rem < 10 ? "var(--accent)" : "#5D5FEF",
              padding: "2px 6.5px",
              borderRadius: 6,
              letterSpacing: "0.02em",
              lineHeight: 1.2
            }}>
              {rem} / {DAILY_LIMIT}
            </span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 550, fontFamily: "var(--font-dm-sans), sans-serif" }}>Usage</span>
            <div style={{ 
              width: 80, 
              height: 6, 
              borderRadius: 3, 
              background: "var(--border)", 
              overflow: "hidden", 
              position: "relative" 
            }}>
              <div style={{ 
                width: `${(used / DAILY_LIMIT) * 100}%`, 
                height: "100%", 
                background: "linear-gradient(90deg, #5D5FEF 0%, #8B5CF6 100%)", 
                borderRadius: 3,
                transition: "width 0.3s ease" 
              }} />
            </div>
          </div>
        </div>

        {/* Converter Content */}
        <div style={{
          background: "var(--card)",
          overflow: "hidden"
        }}>

        {/* Dropzone State */}
        {!hasConversions && (
          <div 
            onDragOver={handleDragOver} 
            onDragLeave={handleDragLeave} 
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              padding: "48px 24px", 
              cursor: "pointer", 
              minHeight: 220, 
              background: dragOver ? "var(--accentbg)" : "var(--card)", 
              transition: "all 0.2s ease",
              position: "relative"
            }}
          >
            {/* Background decorative target rings */}
            <div style={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "1px dashed var(--border)",
              opacity: dragOver ? 0.35 : 0.15,
              pointerEvents: "none",
              transition: "transform 0.4s ease, opacity 0.2s",
              transform: dragOver ? "scale(1.15)" : "scale(1)"
            }} />
            <div style={{
              position: "absolute",
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              opacity: dragOver ? 0.45 : 0.25,
              pointerEvents: "none",
              transition: "transform 0.4s ease, opacity 0.2s",
              transform: dragOver ? "scale(1.08)" : "scale(1)"
            }} />

            {/* Glowing Upload Circle Icon */}
            <div style={{ 
              position: "relative",
              zIndex: 1,
              width: 54, 
              height: 54, 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: 16, 
              background: dragOver ? "var(--accentbg)" : "var(--bg3)", 
              boxShadow: dragOver ? "0 0 15px rgba(93, 95, 239, 0.15)" : "0 4px 10px rgba(0,0,0,0.03)",
              border: `1px solid ${dragOver ? "#5D5FEF" : "var(--border)"}`,
              transition: "all 0.2s ease", 
              color: dragOver ? "#5D5FEF" : "var(--ink2)" 
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dragOver ? "translateY(-2px)" : "none", transition: "transform 0.2s" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>

            <div style={{ position: "relative", zIndex: 1, fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.4px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
              Click, or drop your files here
            </div>
            
            <div style={{ position: "relative", zIndex: 1, fontSize: 13, color: "var(--ink3)", marginBottom: 20, textAlign: "center", maxWidth: 360, lineHeight: 1.55, fontFamily: "var(--font-dm-sans), sans-serif" }}>
              Convert images, videos, audio, documents, spreadsheets, ebooks &amp; presentation formats safely in your browser.
            </div>

            <button 
              className="btn-primary" 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              style={{ 
                position: "relative", 
                zIndex: 1, 
                background: "linear-gradient(135deg, #5D5FEF 0%, #4749D6 100%)", 
                border: "none", 
                color: "white", 
                padding: "9px 24px", 
                borderRadius: 9, 
                fontSize: 13, 
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(93, 95, 239, 0.3)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.025)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(93, 95, 239, 0.42)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(93, 95, 239, 0.3)";
              }}
            >
              Select files
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              style={{ display: "none" }} 
              onChange={(e) => { if (e.target.files) addFiles(e.target.files); }} 
            />
          </div>
        )}






        {/* Selected Files State */}
        {hasConversions && (
          <div style={{ padding: "20px" }}>
            {/* List Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13.5, fontWeight: 650, color: "var(--ink)" }}>
                {items.length} file{items.length > 1 ? "s" : ""} selected
              </span>
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 6, 
                  background: "transparent", 
                  border: "1px solid var(--border)", 
                  padding: "6px 12px", 
                  borderRadius: 6, 
                  fontSize: 12.5, 
                  cursor: "pointer", 
                  color: "var(--ink2)",
                  fontWeight: 500,
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add More
              </button>
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                style={{ display: "none" }} 
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); }} 
              />
            </div>

            {/* List Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {items.map((item) => {
                const itemCfg = FMT[item.ext];
                const itemTargets = itemCfg ? itemCfg.out.filter((o) => o !== item.ext) : [];
                return (
                  <div 
                    key={item.id} 
                    style={{ 
                      border: "1px solid var(--border)", 
                      borderRadius: 12,
                      background: "var(--bg2)",
                      overflow: "hidden"
                    }}
                  >
                    {/* Main Row */}
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "12px 16px",
                      flexWrap: "wrap",
                      gap: 12
                    }}>
                      {/* Left: Icon and Name */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200 }}>
                        <div style={{ flexShrink: 0 }}>
                          {renderFileIcon(item.cat)}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div 
                            title={item.name}
                            style={{ 
                              fontSize: 13.5, 
                              fontWeight: 600, 
                              color: "var(--ink)", 
                              overflow: "hidden", 
                              textOverflow: "ellipsis", 
                              whiteSpace: "nowrap" 
                            }}
                          >
                            {item.name}
                          </div>
                          <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, color: "var(--ink3)" }}>
                            {fmtSz(item.size)}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Convert To selector */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {item.status === "idle" && (
                          <>
                            <span style={{ fontSize: 12.5, color: "var(--ink3)" }}>to</span>
                            <select 
                              value={item.toFmt} 
                              onChange={(e) => updateItemFormat(item.id, e.target.value)}
                              style={{ 
                                fontSize: 12.5, 
                                fontWeight: 600, 
                                color: "var(--ink)", 
                                background: "var(--card)", 
                                border: "1px solid var(--border)", 
                                borderRadius: 6, 
                                padding: "5px 24px 5px 10px", 
                                cursor: "pointer", 
                                outline: "none", 
                                appearance: "none", 
                                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E\")", 
                                backgroundRepeat: "no-repeat", 
                                backgroundPosition: "right 8px center" 
                              }}
                            >
                              {itemTargets.map((fmt) => (
                                <option key={fmt} value={fmt}>{LABELS[fmt] || fmt.toUpperCase()}</option>
                              ))}
                            </select>

                            {/* Options gear button */}
                            <button
                              onClick={() => updateItemOption(item.id, "settingsOpen", !item.settingsOpen)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: item.settingsOpen ? "1px solid #5D5FEF" : "1px solid var(--border)",
                                background: item.settingsOpen ? "var(--accentbg)" : "var(--card)",
                                color: item.settingsOpen ? "#5D5FEF" : "var(--ink2)",
                                borderRadius: 6,
                                width: 28,
                                height: 28,
                                cursor: "pointer"
                              }}
                              title="Convert Options"
                            >
                              <SettingsIcon className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {item.status !== "idle" && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            <span style={{ 
                              fontSize: 12, 
                              fontWeight: 700, 
                              color: "var(--ink)", 
                              background: "var(--border)", 
                              padding: "2px 8px", 
                              borderRadius: 4,
                              fontFamily: "var(--font-dm-mono), monospace"
                            }}>
                              {(item.resultName ? getExt(item.resultName) : item.toFmt).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right: Status / Progress / Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 140, justifyContent: "flex-end" }}>
                        {item.status === "loading-engine" && (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%", maxWidth: 120 }}>
                            <span style={{ fontSize: 10.5, color: "#5D5FEF", fontWeight: 700, whiteSpace: "nowrap" }} className="animate-pulse">
                              Loading engine (~25MB)...
                            </span>
                          </div>
                        )}

                        {item.status === "converting" && (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: "100%", maxWidth: 100 }}>
                            <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10.5, color: "#5D5FEF", fontWeight: 700 }}>
                              {item.progress}%
                            </span>
                            <div style={{ width: "100%", height: 3, background: "var(--border)", borderRadius: 100, overflow: "hidden", marginTop: 4 }}>
                              <div style={{ height: "100%", background: "#5D5FEF", width: item.progress + "%", transition: "width 0.15s ease" }} />
                            </div>
                          </div>
                        )}

                        {item.status === "done" && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fg-success)" }}>
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fg-success)" }}>Done</span>
                          </div>
                        )}

                        {item.status === "error" && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent)" }} title={item.errorMsg}>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>Failed</span>
                          </div>
                        )}

                        {item.status === "idle" && (
                          <span style={{ fontSize: 12, color: "var(--ink3)" }}>Ready</span>
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {item.status === "done" && (
                            <button
                              onClick={() => downloadItem(item)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                background: "var(--successbg)",
                                color: "var(--success)",
                                borderRadius: 6,
                                width: 28,
                                height: 28,
                                cursor: "pointer"
                              }}
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "none",
                              background: "transparent",
                              color: "var(--ink3)",
                              borderRadius: 6,
                              width: 28,
                              height: 28,
                              cursor: "pointer"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accentbg)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink3)"; e.currentTarget.style.background = "transparent"; }}
                            title="Remove"
                            disabled={convertingAll}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Options Subpanel */}
                    {item.settingsOpen && item.status === "idle" && (
                      <div style={{
                        padding: "14px 18px",
                        background: "var(--bg)",
                        borderTop: "1px solid var(--border)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>
                          <SettingsIcon className="w-3.5 h-3.5 text-[#5D5FEF]" />
                          <span>Settings Options ({LABELS[item.toFmt] || item.toFmt.toUpperCase()})</span>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                          {/* PDF lock password */}
                          {item.toFmt === "pdf" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink2)", display: "flex", alignItems: "center", gap: 4 }}>
                                <Lock className="w-3 h-3 text-slate-500" /> Lock PDF Password
                              </label>
                              <input
                                type="text"
                                placeholder="Set PDF password..."
                                value={item.password || ""}
                                onChange={(e) => updateItemOption(item.id, "password", e.target.value)}
                                style={{
                                  padding: "6px 10px",
                                  fontSize: 12,
                                  borderRadius: 5,
                                  border: "1px solid var(--border)",
                                  background: "var(--card)",
                                  color: "var(--ink)",
                                  outline: "none"
                                }}
                              />
                            </div>
                          )}

                          {/* Image Quality slider */}
                          {item.cat === "image" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink2)" }}>
                                Quality: {item.quality}%
                              </label>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={item.quality}
                                onChange={(e) => updateItemOption(item.id, "quality", parseInt(e.target.value, 10))}
                                style={{ accentColor: "#5D5FEF", height: 6 }}
                              />
                            </div>
                          )}

                          {/* Image resizing dimensions */}
                          {item.cat === "image" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink2)" }}>
                                Resize Dimension (px)
                              </label>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <input
                                  type="number"
                                  placeholder="Width"
                                  value={item.width}
                                  onChange={(e) => updateItemOption(item.id, "width", e.target.value)}
                                  style={{
                                    width: "70px",
                                    padding: "5px",
                                    fontSize: 12,
                                    borderRadius: 5,
                                    border: "1px solid var(--border)",
                                    background: "var(--card)",
                                    color: "var(--ink)",
                                    outline: "none"
                                  }}
                                />
                                <span style={{ fontSize: 11, color: "var(--ink3)" }}>×</span>
                                <input
                                  type="number"
                                  placeholder="Height"
                                  value={item.height}
                                  onChange={(e) => updateItemOption(item.id, "height", e.target.value)}
                                  style={{
                                    width: "70px",
                                    padding: "5px",
                                    fontSize: 12,
                                    borderRadius: 5,
                                    border: "1px solid var(--border)",
                                    background: "var(--card)",
                                    color: "var(--ink)",
                                    outline: "none"
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Media quality (crf/bitrate slider) */}
                          {(item.cat === "video" || item.cat === "audio") && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink2)" }}>
                                Encode Quality (CRF/Bitrate): {item.quality}
                              </label>
                              <input
                                type="range"
                                min="20"
                                max="100"
                                value={item.quality}
                                onChange={(e) => updateItemOption(item.id, "quality", parseInt(e.target.value, 10))}
                                style={{ accentColor: "#5D5FEF", height: 6 }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Row */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              paddingTop: 16, 
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
              gap: 12
            }}>
              <div>
                <button 
                  onClick={clearAll}
                  style={{ 
                    background: "transparent", 
                    border: "none", 
                    color: "var(--ink3)", 
                    fontSize: 13, 
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                  disabled={convertingAll}
                >
                  Clear all files
                </button>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {hasFinished && (
                  <button
                    onClick={downloadAll}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "var(--success)",
                      color: "white",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: 8,
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download All
                  </button>
                )}

                <button
                  onClick={convertAll}
                  disabled={convertingAll || items.filter(it => it.status === "idle" || it.status === "error").length === 0}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#5D5FEF",
                    color: "white",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: (convertingAll || items.filter(it => it.status === "idle" || it.status === "error").length === 0) ? 0.6 : 1
                  }}
                >
                  {convertingAll ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Convert All
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}

