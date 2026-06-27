import { HomeConverter } from "./HomeConverter";

interface FormatSvgProps {
  label: string;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

function FormatSvg({ label, color, className, style }: FormatSvgProps) {
  return (
    <div className={`floating-svg-icon ${className || ""}`} style={style}>
      <svg width="100%" height="100%" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base card container */}
        <rect x="2" y="2" width="56" height="68" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="1.2" />
        {/* Card header with top border radius only */}
        <path d="M2 10C2 5.58172 5.58172 2 10 2H50C54.4183 2 58 5.58172 58 10V18H2V10Z" fill="var(--bg2)" stroke="var(--border)" strokeWidth="1.2" />
        {/* Category color dot */}
        <circle cx="10" cy="10" r="3" fill={color} />
        {/* Skeleton text decorations inside card */}
        <rect x="8" y="28" width="44" height="3" rx="1.5" fill="var(--border)" />
        <rect x="8" y="38" width="32" height="3" rx="1.5" fill="var(--border)" />
        <rect x="8" y="48" width="24" height="3" rx="1.5" fill="var(--border)" />
        {/* Monospace format pill on bottom-right */}
        <g style={{ transform: "translate(22px, 50px)" }}>
          <rect width="30" height="14" rx="4" fill="var(--bg2)" stroke="var(--border)" strokeWidth="1" />
          <text x="15" y="10" textAnchor="middle" fill="var(--ink)" fontSize="8.5" fontWeight="700" fontFamily="monospace" letterSpacing="-0.3">{label}</text>
        </g>
      </svg>
    </div>
  );
}


export function Hero() {
  return (
    <section className="section-reveal" style={{
      textAlign: "center",
      padding: "24px 20px 20px",
      position: "relative",
      overflow: "hidden",
      background: "var(--bg)",
    }}>
      <div style={{
        position: "absolute",
        top: "-30%",
        left: "50%",
        translate: "-50% 0",
        width: 720,
        height: 720,
        borderRadius: "50%",
        background: "radial-gradient(circle, color-mix(in srgb, #5D5FEF 6%, transparent) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", maxWidth: 680, margin: "0 auto 16px" }}>
        <h1 style={{
          fontSize: "clamp(28px, 4vw, 36px)",
          fontWeight: 800,
          letterSpacing: "-1.2px",
          lineHeight: 1.15,
          color: "var(--ink)",
          marginBottom: 8,
        }}>
          Private Browser File Converter
        </h1>

        <p style={{
          fontSize: 14.5,
          color: "var(--ink2)",
          lineHeight: 1.5,
          marginBottom: 0,
          maxWidth: 580,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Convert your audio, video, images, and documents 100% privately in your browser. All conversions run locally using WebAssembly — files never leave your device.
        </p>
      </div>

      {/* Decorative Scattered SVG Format Icons */}
      <FormatSvg label="PDF" color="#EF4444" className="float-1" style={{ left: "5%", top: "45%", transform: "rotate(-12deg)" }} />
      <FormatSvg label="MP4" color="#8B5CF6" className="float-2" style={{ left: "14%", top: "66%", transform: "rotate(-8deg)" }} />
      <FormatSvg label="ZIP" color="#F97316" className="float-3" style={{ left: "6%", top: "86%", transform: "rotate(6deg)" }} />
      
      <FormatSvg label="PNG" color="#10B981" className="float-2" style={{ right: "5%", top: "42%", transform: "rotate(15deg)" }} />
      <FormatSvg label="MP3" color="#06B6D4" className="float-1" style={{ right: "12%", top: "64%", transform: "rotate(10deg)" }} />
      <FormatSvg label="DOCX" color="#3B82F6" className="float-3" style={{ right: "4%", top: "83%", transform: "rotate(-15deg)" }} />
      
      <FormatSvg label="XLSX" color="#22C55E" className="float-1" style={{ left: "18%", top: "35%", transform: "rotate(8deg)" }} />
      <FormatSvg label="SVG" color="#EC4899" className="float-2" style={{ right: "18%", top: "32%", transform: "rotate(-6deg)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <HomeConverter />
      </div>
    </section>
  );
}




