import { HomeConverter } from "./HomeConverter";

export function Hero() {
  return (
    <section className="section-reveal" style={{
      textAlign: "center",
      padding: "40px 20px 32px",
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

      <div style={{ position: "relative", maxWidth: 680, margin: "0 auto 20px" }}>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 44px)",
          fontWeight: 800,
          letterSpacing: "-1.2px",
          lineHeight: 1.15,
          color: "var(--ink)",
          marginBottom: 10,
        }}>
          Private Browser File Converter
        </h1>

        <p style={{
          fontSize: 15,
          color: "var(--ink2)",
          lineHeight: 1.6,
          marginBottom: 0,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Convert your audio, video, images, and documents 100% privately in your browser. All conversions run locally using WebAssembly — files never leave your device.
        </p>
      </div>

      <HomeConverter />
    </section>
  );
}
