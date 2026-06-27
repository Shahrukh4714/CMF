"use client";

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

export function PopularConversions() {
  const router = useRouter();

  return (
    <section className="section-reveal" style={{
      marginTop: 60,
      width: "100%",
      maxWidth: 640,
      marginLeft: "auto",
      marginRight: "auto",
      padding: "0 20px",
    }}>
      <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, color: "var(--ink3)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>
        Popular conversions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {POPULAR.map((pair) => (
          <div
            key={pair.from + "-" + pair.to}
            className="tag"
            onClick={() => router.push("/convert/" + pair.from + "-to-" + pair.to)}
            style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}
          >
            <span style={{ color: "var(--ink)", fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, fontWeight: 500 }}>{pair.from.toUpperCase()}</span>
            <span style={{ color: "var(--border)", fontSize: 11 }}>&rarr;</span>
            <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11 }}>{pair.to.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
