"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const POPULAR = [
  { from: "mp4", to: "mp3" },
  { from: "pdf", to: "jpg" },
  { from: "jpg", to: "png" },
  { from: "png", to: "webp" },
  { from: "mov", to: "mp4" },
  { from: "mp4", to: "gif" },
  { from: "wav", to: "mp3" },
  { from: "webp", to: "jpg" },
];

function ToolSvgIcon({ slug }: { slug: string }) {
  if (slug.includes("-to-")) {
    const [from, to] = slug.split("-to-");
    
    const getFormatMeta = (fmt: string) => {
      switch (fmt) {
        case "pdf": 
          return {
            color: "#EF4444",
            graphic: (
              <g fill="#FFF">
                <rect x="2" y="5" width="9" height="1" rx="0.5" />
                <rect x="2" y="8" width="9" height="1" rx="0.5" />
                <rect x="2" y="11" width="6" height="1" rx="0.5" />
                <rect x="2" y="14" width="9" height="1" rx="0.5" />
              </g>
            )
          };
        case "docx":
        case "doc": 
          return {
            color: "#3B82F6",
            graphic: (
              <g fill="#FFF">
                <path d="M2.5 5H4.2L6 11L7.8 5H9.5L7 13.5H5L2.5 5Z" />
              </g>
            )
          };
        case "xlsx":
        case "xls": 
          return {
            color: "#10B981",
            graphic: (
              <g stroke="#FFF" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3.5 5.5L9.5 12.5M9.5 5.5L3.5 12.5" />
              </g>
            )
          };
        case "jpg":
        case "jpeg":
        case "png":
        case "webp": 
          return {
            color: "#10B981",
            graphic: (
              <g>
                <circle cx="9.5" cy="6.5" r="1.2" fill="#FFF" />
                <path d="M2 13.5L5 9L7 11.5L9.5 7.5L11.5 10V13.5H2Z" fill="#FFF" />
              </g>
            )
          };
        case "gif": 
          return {
            color: "#F59E0B",
            graphic: (
              <g fill="#FFF">
                <rect x="2" y="7.5" width="7" height="6.5" rx="1" />
                <rect x="5.5" y="4.5" width="7" height="6.5" rx="1" stroke="#F59E0B" strokeWidth="1" />
              </g>
            )
          };
        case "mp4":
        case "mov": 
          return {
            color: "#8B5CF6",
            graphic: (
              <g fill="#FFF">
                <rect x="2" y="7.5" width="6" height="5" rx="0.8" />
                <path d="M8.5 8.7L11 7v6l-2.5-1.7V8.7z" />
              </g>
            )
          };
        case "mp3":
        case "wav": 
          return {
            color: "#06B6D4",
            graphic: (
              <g fill="#FFF">
                <path d="M5.5 5v5.5a2 2 0 1 1-1.5-1.9H5.5V6.2h3V5H5.5z" />
              </g>
            )
          };
        default: 
          return {
            color: "#6B7280",
            graphic: (
              <circle cx="6.5" cy="11.5" r="3" fill="#FFF" />
            )
          };
      }
    };

    const fromMeta = getFormatMeta(from);
    const toMeta = getFormatMeta(to);

    return (
      <svg width="22" height="16" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <rect x="0" y="3" width="13" height="18" rx="2.5" fill={fromMeta.color} />
        {fromMeta.graphic}
        <rect x="19" y="3" width="13" height="18" rx="2.5" fill={toMeta.color} />
        {toMeta.graphic}
        <path d="M14.5 12H17.5" stroke="var(--ink3)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.5 10L18.5 12L16.5 14" stroke="var(--ink3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return null;
}


export function PopularConversions() {
  const router = useRouter();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="section-reveal" style={{
      marginTop: 44,
      width: "100%",
      maxWidth: 760,
      marginLeft: "auto",
      marginRight: "auto",
      padding: "0 16px",
    }}>
      <div style={{ 
        fontFamily: "var(--font-dm-mono), monospace", 
        fontSize: 10.5, 
        color: "var(--ink3)", 
        letterSpacing: "0.08em", 
        textTransform: "uppercase", 
        marginBottom: 12,
        fontWeight: 600,
      }}>
        Popular conversions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
        {POPULAR.map((pair, idx) => {
          const isHovered = hoveredIdx === idx;
          
          return (
            <div
              key={pair.from + "-" + pair.to}
              onClick={() => router.push("/convert/" + pair.from + "-to-" + pair.to)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 8, 
                padding: "8px 12px",
                borderRadius: 8,
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                transform: isHovered ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {/* Left custom SVG converter icon */}
              <ToolSvgIcon slug={`${pair.from}-to-${pair.to}`} />
              
              {/* Right text label */}
              <span style={{ 
                fontFamily: "var(--font-dm-sans), sans-serif", 
                fontSize: 12.5, 
                fontWeight: 600, 
                color: isHovered ? "var(--accent)" : "var(--ink2)",
                transition: "color 0.15s"
              }}>
                {pair.from.toUpperCase()} to {pair.to.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}




