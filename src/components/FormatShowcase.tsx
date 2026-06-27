const CATEGORIES = [
  {
    id: "video",
    title: "Video",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    desc: "MP4, MOV, AVI, MKV, WebM, GIF, and more",
    count: "18 formats",
    link: "/tools/video-tools",
  },
  {
    id: "audio",
    title: "Audio",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    desc: "MP3, WAV, FLAC, AAC, OGG, WMA, and more",
    count: "17 formats",
    link: "/tools/audio-tools",
  },
  {
    id: "image",
    title: "Image",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    desc: "JPG, PNG, WebP, GIF, SVG, AVIF, and more",
    count: "11 formats",
    link: "/tools/image-tools",
  },
  {
    id: "document",
    title: "Document",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    desc: "PDF, DOCX, TXT, HTML, MD, CSV, and more",
    count: "12 formats",
    link: "/tools/pdf-tools",
  },
];

export function FormatShowcase() {
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
          Supported formats
        </div>
        <h2 style={{
          fontSize: "clamp(24px, 3.5vw, 32px)",
          fontWeight: 650,
          letterSpacing: "-0.8px",
          color: "var(--ink)",
          lineHeight: 1.2,
        }}>
          Everything you need. <span style={{ color: "var(--ink2)", fontWeight: 450 }}>Nothing you don&rsquo;t.</span>
        </h2>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 20,
      }}>
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={cat.link}
            className="card-interactive"
            style={{
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
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
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}>
              {cat.icon}
            </div>
            <div>
              <div style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                {cat.title}
                <span style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--accent)",
                  background: "var(--accentbg)",
                  border: "1px solid var(--accentbd)",
                  padding: "1px 8px",
                  borderRadius: 100,
                  fontFamily: "var(--font-dm-mono), monospace",
                }}>
                  {cat.count}
                </span>
              </div>
              <div style={{ fontSize: 13.5, color: "var(--ink2)", lineHeight: 1.6 }}>{cat.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
