export function TrustBar() {
  const items = [
    {
      svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
      label: "No upload",
    },
    {
      svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      label: "100% private",
    },
    {
      svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      label: "No account",
    },
    {
      svg: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      label: "Works offline",
    },
  ];

  return (
    <section className="section-reveal" style={{
      maxWidth: 640,
      margin: "96px auto 0",
      padding: "0 20px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        flexWrap: "wrap",
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--ink3)",
            padding: "6px 0",
          }}>
            <span style={{ color: "var(--accent)", opacity: 0.7 }}>{item.svg}</span>
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}
