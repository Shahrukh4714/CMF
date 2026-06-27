"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { PricingModal } from "./PricingModal";
import { SearchBar } from "./SearchBar";
import { CATEGORIES, getCuratedTools } from "@/data/tools";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "#", isDropdown: true },
  { label: "APIs", href: "/tools" },
  { label: "Pricings", href: "#pricing" },
  { label: "About", href: "/about" },
];

function ToolSvgIcon({ slug }: { slug: string }) {
  if (slug === "merge-pdf") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginRight: 8 }}>
        <rect x="2" y="2" width="14" height="18" rx="2.5" fill="#EF4444" />
        <rect x="8" y="6" width="14" height="18" rx="2.5" fill="#EF4444" stroke="var(--card)" strokeWidth="1.5" />
        <path d="M12 15L15 12L12 9" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="9" y1="12" x2="15" y2="12" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  
  if (slug === "split-pdf") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginRight: 8 }}>
        <rect x="3" y="3" width="18" height="18" rx="3.5" fill="#EF4444" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="#FFF" strokeWidth="2.2" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (slug.startsWith("compress-")) {
    const isImg = slug.includes("image");
    const color = isImg ? "#10B981" : "#EF4444";
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginRight: 8 }}>
        <rect x="3" y="3" width="18" height="18" rx="3.5" fill={color} />
        {/* Compress inward chevrons/arrows */}
        <path d="M7 12H12M12 12L10 10M12 12L10 14" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 12H12M12 12L14 10M12 12L14 14" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (slug.includes("-to-")) {
    const [from, to] = slug.split("-to-");
    
    const getFormatMeta = (fmt: string) => {
      switch (fmt) {
        case "pdf": 
          return {
            color: "#EF4444",
            graphic: (
              <g fill="#FFF">
                <rect x="2" y="5" width="9" height="1" rx="0.5" />
                <rect x="2" y="8" width="9" height="1" rx="0.5" />
                <rect x="2" y="11" width="6" height="1" rx="0.5" />
                <rect x="2" y="14" width="9" height="1" rx="0.5" />
              </g>
            )
          };
        case "docx":
        case "doc": 
          return {
            color: "#3B82F6",
            graphic: (
              <g fill="#FFF">
                <path d="M2.5 5H4.2L6 11L7.8 5H9.5L7 13.5H5L2.5 5Z" />
              </g>
            )
          };
        case "xlsx":
        case "xls": 
          return {
            color: "#10B981",
            graphic: (
              <g stroke="#FFF" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3.5 5.5L9.5 12.5M9.5 5.5L3.5 12.5" />
              </g>
            )
          };
        case "jpg":
        case "jpeg":
        case "png":
        case "webp": 
          return {
            color: "#10B981",
            graphic: (
              <g>
                <circle cx="9.5" cy="6.5" r="1.2" fill="#FFF" />
                <path d="M2 13.5L5 9L7 11.5L9.5 7.5L11.5 10V13.5H2Z" fill="#FFF" />
              </g>
            )
          };
        case "gif": 
          return {
            color: "#F59E0B",
            graphic: (
              <g fill="#FFF">
                <rect x="2" y="7.5" width="7" height="6.5" rx="1" />
                <rect x="5.5" y="4.5" width="7" height="6.5" rx="1" stroke="#F59E0B" strokeWidth="1" />
              </g>
            )
          };
        case "mp4":
        case "mov": 
          return {
            color: "#8B5CF6",
            graphic: (
              <g fill="#FFF">
                <rect x="2" y="7.5" width="6" height="5" rx="0.8" />
                <path d="M8.5 8.7L11 7v6l-2.5-1.7V8.7z" />
              </g>
            )
          };
        case "mp3":
        case "wav": 
          return {
            color: "#06B6D4",
            graphic: (
              <g fill="#FFF">
                <path d="M5.5 5v5.5a2 2 0 1 1-1.5-1.9H5.5V6.2h3V5H5.5z" />
              </g>
            )
          };
        default: 
          return {
            color: "#6B7280",
            graphic: (
              <circle cx="6.5" cy="11.5" r="3" fill="#FFF" />
            )
          };
      }
    };

    const fromMeta = getFormatMeta(from);
    const toMeta = getFormatMeta(to);

    return (
      <svg width="22" height="16" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginRight: 8 }}>
        <rect x="0" y="3" width="13" height="18" rx="2.5" fill={fromMeta.color} />
        {fromMeta.graphic}
        <rect x="19" y="3" width="13" height="18" rx="2.5" fill={toMeta.color} />
        {toMeta.graphic}
        <path d="M14.5 12H17.5" stroke="var(--ink3)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.5 10L18.5 12L16.5 14" stroke="var(--ink3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Fallback for standard operations (crop, rotate, delete, etc.)
  const getOpColor = () => {
    if (slug.includes("pdf")) return "#EF4444";
    if (slug.includes("image")) return "#10B981";
    return "#3B82F6";
  };

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginRight: 8 }}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill={getOpColor()} />
      <circle cx="12" cy="12" r="4" stroke="#FFF" strokeWidth="2.2" />
    </svg>
  );
}




export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const curatedTools = getCuratedTools();
  const toolsByCategory = CATEGORIES.map(cat => ({
    category: cat,
    tools: curatedTools.filter(t => t.categoryId === cat.id)
  }));


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
          overflow: "visible",
          flex: 1,
          justifyContent: "center",
        }}>
          {NAV_ITEMS.map((item) => {
            if (item.isDropdown) {
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                  style={{ display: "flex", alignItems: "center", height: "100%", position: "relative" }}
                >
                  <a
                    href={item.href}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: menuOpen ? "var(--accent)" : "var(--ink2)",
                      background: menuOpen ? "var(--accentbg)" : "transparent",
                      textDecoration: "none",
                      padding: "6px 14px",
                      borderRadius: 6,
                      transition: "color 0.15s, background 0.15s",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {item.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                      <polyline points="1 1 5 5 9 1" />
                    </svg>
                  </a>

                  {/* Mega Menu Dropdown */}
                  {menuOpen && (
                    <div 
                      style={{
                        position: "absolute",
                        top: "calc(100% + 14px)", // align with bottom of header nav
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "90vw",
                        maxWidth: 820,
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-lg)",
                        borderRadius: 12,
                        padding: "20px 24px 24px",
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 16,
                        zIndex: 999,
                      }}
                    >
                      {toolsByCategory.map(({ category, tools }) => (
                        <div key={category.id} style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
                          <div style={{
                            fontFamily: "var(--font-dm-mono), monospace",
                            fontSize: 10,
                            color: "var(--ink3)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            borderBottom: "1px solid var(--border)",
                            paddingBottom: 6,
                            fontWeight: 600,
                          }}>
                            {category.name}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {tools.slice(0, 10).map((tool) => (
                              <a
                                key={tool.slug}
                                href={`/convert/${tool.slug}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "5px 6px",
                                  borderRadius: 6,
                                  fontSize: 12,
                                  color: "var(--ink2)",
                                  textDecoration: "none",
                                  transition: "all 0.15s ease",
                                  whiteSpace: "nowrap",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "var(--ink)";
                                  e.currentTarget.style.background = "var(--bg2)";
                                }}
                                  onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "var(--ink2)";
                                  e.currentTarget.style.background = "transparent";
                                }}
                              >
                                <ToolSvgIcon slug={tool.slug} />
                                <span>{tool.name}</span>

                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
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
            );
          })}
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
