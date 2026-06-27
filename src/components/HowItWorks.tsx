const STEPS = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    title: "Drop your file",
    desc: "Drag & drop or browse from your device. We accept video, audio, images, and documents.",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    title: "Choose format & convert",
    desc: "Pick from 100+ output formats. Conversion happens instantly in your browser using WebAssembly.",
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    title: "Download instantly",
    desc: "Your converted file is ready immediately. No servers, no waiting, no data ever stored — just your result.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-reveal" style={{
      maxWidth: 700,
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
          How it works
        </div>
        <h2 style={{
          fontSize: "clamp(24px, 3.5vw, 32px)",
          fontWeight: 650,
          letterSpacing: "-0.8px",
          color: "var(--ink)",
          lineHeight: 1.2,
        }}>
          Three steps. <span style={{ color: "var(--ink2)", fontWeight: 450 }}>That&rsquo;s it.</span>
        </h2>
      </div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: 46,
          top: 0,
          bottom: 0,
          width: 1,
          background: "var(--border)",
          zIndex: 0,
        }} />
        {STEPS.map((s, i) => (
          <div key={i} className="step-card" style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            padding: "28px 24px",
            position: "relative",
            zIndex: 1,
            background: "var(--card)",
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
              position: "relative",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}>
              {s.icon}
              <div style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-dm-mono), monospace",
                border: "2px solid var(--bg)",
              }}>
                {i + 1}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingTop: 6 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, color: "var(--ink2)", lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
