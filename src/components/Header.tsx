"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { PricingModal } from "./PricingModal";
import { SearchBar } from "./SearchBar";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "APIs", href: "/tools" },
  { label: "Pricings", href: "#pricing" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const t = document.documentElement.getAttribute("data-theme") as "light" | "dark" | null;
    if (t === "light" || t === "dark") setTheme(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const toggle = () => {
    const btn = document.querySelector(".theme-toggle") as HTMLElement;
    if (btn) { btn.classList.add("rotating"); setTimeout(() => btn.classList.remove("rotating"), 400); }
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("convertit-theme", next);
  };

  return (
    <>
      <nav style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.48 0-.96.06-1.41.17C13.44 8.3 10.42 7 7.5 7 4.46 7 2 9.46 2 12.5A3.5 3.5 0 0 0 5.5 16" />
              <path d="M15 13.5a3 3 0 0 0-6 0" />
              <path d="M9 14.5a3 3 0 0 0 6 0" />
              <polyline points="8 12.5 9 14.5 11 13.5" />
              <polyline points="16 15.5 15 13.5 13 14.5" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.5px" }}>
            Convertmyfiles
          </span>
        </a>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginLeft: 24,
          overflow: "auto",
          flex: 1,
          justifyContent: "center",
        }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.href === "#pricing") {
                  e.preventDefault();
                  setShowPricing(true);
                }
              }}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--ink2)",
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 6,
                transition: "color 0.15s, background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accentbg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink2)"; e.currentTarget.style.background = "transparent"; }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search tools"
            title="Search tools (Ctrl+K)"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink3)",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink3)"; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label="Toggle theme"
            title="Toggle theme"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink2)",
              transition: "border-color 0.15s, background 0.15s, transform 0.4s ease",
              visibility: mounted ? "visible" : "hidden",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink2)"; }}
          >
            {theme === "light" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowPricing(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#5D5FEF",
              color: "white",
              fontSize: 12.5,
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: 9999,
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s, transform 0.1s active",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#4b4ddb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#5D5FEF"; }}
          >
            <Star className="w-3.5 h-3.5 fill-white stroke-none" />
            Go Premium
          </button>
        </div>
      </nav>

      <PricingModal open={showPricing} onClose={() => setShowPricing(false)} />

      <SearchBar isModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
