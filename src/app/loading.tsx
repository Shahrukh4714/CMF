export default function RootLoading() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      padding: "0 20px",
      flexDirection: "column",
      gap: 16,
    }}>
      <div className="spinner" />
      <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, color: "var(--ink3)" }}>
        Loading&hellip;
      </div>
    </div>
  );
}
