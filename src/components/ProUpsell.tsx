export function ProUpsell() {
  return (
    <section className="section-reveal" style={{
      maxWidth: 640,
      margin: "96px auto 48px",
      padding: "0 20px",
    }}>
      <div style={{
        padding: "40px 36px",
        borderRadius: 16,
        border: "1.5px solid var(--accentbd)",
        background: "var(--accentbg)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--accent)",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            marginBottom: 8,
          }}>
            Pro
          </div>
          <h2 style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            fontWeight: 650,
            letterSpacing: "-0.6px",
            color: "var(--ink)",
            marginBottom: 10,
          }}>
            Need more power?
          </h2>
          <p style={{
            fontSize: 14,
            color: "var(--ink2)",
            lineHeight: 1.65,
            marginBottom: 24,
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            Larger files, uncapped conversions, multi-threaded speeds, and an ad-free workspace. Upgrade for the heavy lifting.
          </p>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            flexWrap: "wrap",
            marginBottom: 28,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink2)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Files up to 1GB+
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink2)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Uncapped conversions
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink2)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Multi-threaded speed
            </div>
          </div>
          <button className="btn-primary" style={{
            fontSize: 14,
            padding: "10px 28px",
            borderRadius: 8,
          }}>
            Coming soon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
