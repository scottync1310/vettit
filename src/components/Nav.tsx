"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import InviteModal from "./InviteModal";

export default function Nav() {
  const [showInvite, setShowInvite] = useState(false);
  const pathname = usePathname();

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
      {/* HEADER — logo + tagline */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "20px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <img src="/logo.png" alt="Vettit" style={{ height: "60px", width: "auto", display: "block" }} />
        <div style={{ fontSize: "11px", fontWeight: 500, color: "#888", letterSpacing: ".15em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>
          One email. We handle the rest.
        </div>
      </div>

      {/* NAV */}
      <nav style={{ background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <a href="/" style={linkStyle("/")}>DASHBOARD</a>
            <a href="/sites" style={linkStyle("/sites")}>SITES</a>
            <a href="/calendar" style={linkStyle("/calendar")}>CALENDAR</a>
            <a href="/vault" style={linkStyle("/vault")}>VAULT</a>
            <a href="/bulk-invite" style={linkStyle("/bulk-invite")}>BULK INVITE</a>
            <a href="/settings" style={linkStyle("/settings")}>SETTINGS</a>
            <button
              onClick={() => setShowInvite(true)}
              style={{
                fontSize: "12px", fontWeight: 600, letterSpacing: ".12em",
                padding: "8px 16px", border: "none", background: "none",
                color: "#888", borderBottom: "2px solid transparent",
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              + INVITE
            </button>
          </div>
        </div>
      </nav>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </>
  );
}