export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
        background: "var(--bg)",
      }}
    >
      <style>{`a.footer-link:hover{color:var(--ink)!important}`}</style>
      <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, color: "var(--ink3)" }}>
        &copy; 2026 Convertmyfiles
      </span>
      <div style={{ display: "flex", gap: 16 }}>
        <a href="/privacy" className="footer-link" style={{ fontSize: 12, color: "var(--ink3)", textDecoration: "none", transition: "color 0.15s" }}>
          Privacy
        </a>
        <a href="/about" className="footer-link" style={{ fontSize: 12, color: "var(--ink3)", textDecoration: "none", transition: "color 0.15s" }}>
          About
        </a>
        <a href="/tools" className="footer-link" style={{ fontSize: 12, color: "var(--ink3)", textDecoration: "none", transition: "color 0.15s" }}>
          All tools
        </a>
      </div>
    </footer>
  );
}
