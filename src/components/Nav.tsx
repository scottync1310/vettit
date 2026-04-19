"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (pathname === "/upload" || pathname === "/onboarding") return null;

  const linkStyle = (href: string): React.CSSProperties => ({
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: ".12em",
    padding: "8px 16px",
    color: pathname === href ? "#111" : "#888",
    textDecoration: "none",
    borderBottom: pathname === href ? "2px solid #111" : "2px solid transparent",
    fontFamily: "Montserrat, sans-serif",
    whiteSpace: "nowrap",
  });

  return (
    <>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <img src="/logo.png" alt="Vettit" style={{ height: "60px", width: "auto", display: "block" }} />
        <div style={{ fontSize: "11px", fontWeight: 500, color: "#888", letterSpacing: ".15em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>
          One email. We handle the rest.
        </div>
      </div>

      <nav style={{ background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <a href="/" style={linkStyle("/")}>DASHBOARD</a>
            <a href="/sites" style={linkStyle("/sites")}>SITES</a>
            <a href="/calendar" style={linkStyle("/calendar")}>CALENDAR</a>
            <a href="/vault" style={linkStyle("/vault")}>VAULT</a>
            <a href="/bulk-invite" style={linkStyle("/bulk-invite")}>BULK INVITE</a>

            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  fontSize: "12px", fontWeight: 600, letterSpacing: ".12em",
                  padding: "8px 16px", border: "none", background: "none",
                  color: pathname.startsWith("/contractor/invite") || pathname.startsWith("/contractor/add") ? "#111" : "#888",
                  borderBottom: pathname.startsWith("/contractor/invite") || pathname.startsWith("/contractor/add") ? "2px solid #111" : "2px solid transparent",
                  cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                  whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                + ADD CONTRACTOR
                <span style={{ fontSize: "9px" }}>&#9660;</span>
              </button>

              {showDropdown && (
                <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", background: "#fff", border: "1px solid #d0d0d0", borderRadius: "2px", zIndex: 100, minWidth: "220px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                  <a href="/contractor/invite" onClick={() => setShowDropdown(false)} style={{ display: "block", padding: "12px 16px", cursor: "pointer", textDecoration: "none", borderBottom: "1px solid #ebebeb" }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111", marginBottom: "2px" }}>Invite contractor</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>Send magic link — they upload their own docs</div>
                  </a>
                  <a href="/contractor/add" onClick={() => setShowDropdown(false)} style={{ display: "block", padding: "12px 16px", cursor: "pointer", textDecoration: "none" }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111", marginBottom: "2px" }}>Add manually</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>Builder uploads docs on the contractor behalf</div>
                  </a>
                </div>
              )}
            </div>

            <a href="/settings" style={linkStyle("/settings")}>SETTINGS</a>
          </div>
        </div>
      </nav>
    </>
  );
}