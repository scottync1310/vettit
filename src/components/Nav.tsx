"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import InviteModal from "./InviteModal";

export default function Nav() {
  const [showInvite, setShowInvite] = useState(false);
  const pathname = usePathname();

  if (pathname === "/upload" || pathname === "/onboarding") return null;

  const linkStyle = (href: string): React.CSSProperties => ({
    fontSize: "12px", fontWeight: 600, letterSpacing: ".1em", padding: "6px 14px",
    color: pathname === href ? "#111" : "#888", textDecoration: "none",
    borderBottom: pathname === href ? "2px solid #111" : "2px solid transparent",
    fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap",
  });

  return (
    <>
      <div style={{ padding: "16px 0" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px", borderBottom: "1px solid #d0d0d0", paddingBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/logo.png" alt="Vettit" style={{ height: "60px", width: "auto", display: "block" }} />
        </div>
      </div>

      <nav style={{ background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px", borderBottom: "1px solid #d0d0d0", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                fontSize: "12px", fontWeight: 600, letterSpacing: ".1em",
                padding: "6px 14px", border: "none", background: "none",
                color: "#333", borderBottom: "2px solid transparent",
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
