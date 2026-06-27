const FEATURES = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: "100% Private",
    desc: "Your files never leave your device. Every conversion runs locally using WebAssembly — nothing is uploaded to any server.",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    title: "100+ Formats",
    desc: "Video, audio, images, documents — MP4, MP3, JPG, PNG, PDF, DOCX, GIF, WebP, MOV, WAV, and many more.",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: "Lightning Fast",
    desc: "Powered by WebAssembly. Large files convert in seconds, not minutes. Optimized for speed on any modern device.",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    title: "No Account Needed",
    desc: "No sign-ups, no logins, no limits. Just drag your file, choose a format, and download. It's really that simple.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-reveal" style={{
      maxWidth: 920,
      margin: "96px auto 0",
      padding: "0 24px",
    }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 11,
          fontWeight: 500,
          color: "var(--accent)",
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          Why Convertmyfiles
        </div>
        <h2 style={{
          fontSize: "clamp(24px, 3.5vw, 32px)",
          fontWeight: 650,
          letterSpacing: "-0.8px",
          color: "var(--ink)",
          lineHeight: 1.2,
        }}>
          Built for privacy.<br />
          <span style={{ color: "var(--ink2)", fontWeight: 450 }}>Designed for speed.</span>
        </h2>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 20,
      }}>
        {FEATURES.map((f) => (
          <div key={f.title} className="card-interactive" style={{
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "var(--accentbg)",
              border: "1px solid var(--accentbd)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              flexShrink: 0,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: "var(--ink2)", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        flexWrap: "wrap",
        marginTop: 40,
        paddingTop: 28,
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, fontWeight: 500, color: "var(--ink3)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          No upload
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, fontWeight: 500, color: "var(--ink3)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          100% private
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, fontWeight: 500, color: "var(--ink3)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          No account
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, fontWeight: 500, color: "var(--ink3)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Works offline
        </div>
      </div>
    </section>
  );
}
