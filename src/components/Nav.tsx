"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import InviteModal from "./InviteModal";

export default function Nav() {
  const [showInvite, setShowInvite] = useState(false);
  const pathname = usePathname();

  if (pathname === "/upload") return null;

  return (
    <>
      <nav style={{ borderBottom: "1px solid #d0d0d0", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "52px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span style={{ fontSize: "17px", fontWeight: 500, color: "#111", letterSpacing: "-0.3px" }}>
              vett<span style={{ color: "#3a7d44" }}>it</span>
            </span>
            <div style={{ display: "flex", border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <a href="/" style={{ fontSize: "12px", padding: "6px 14px", color: pathname === "/" ? "#fff" : "#888", background: pathname === "/" ? "#111" : "#fff", textDecoration: "none", fontWeight: pathname === "/" ? 500 : 400, borderRight: "1px solid #d0d0d0" }}>Dashboard</a>
              <a href="/sites" style={{ fontSize: "12px", padding: "6px 14px", color: pathname === "/sites" ? "#fff" : "#888", background: pathname === "/sites" ? "#111" : "#fff", textDecoration: "none", fontWeight: pathname === "/sites" ? 500 : 400, borderRight: "1px solid #d0d0d0" }}>Sites</a>
              <a href="/calendar" style={{ fontSize: "12px", padding: "6px 14px", color: pathname === "/calendar" ? "#fff" : "#888", background: pathname === "/calendar" ? "#111" : "#fff", textDecoration: "none", fontWeight: pathname === "/calendar" ? 500 : 400, borderRight: "1px solid #d0d0d0" }}>Calendar</a>
              <a href="/vault" style={{ fontSize: "12px", padding: "6px 14px", color: pathname === "/vault" ? "#fff" : "#888", background: pathname === "/vault" ? "#111" : "#fff", textDecoration: "none", fontWeight: pathname === "/vault" ? 500 : 400 }}>Vault</a>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a href="/bulk-invite" style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: pathname === "/bulk-invite" ? "#111" : "#fff", color: pathname === "/bulk-invite" ? "#fff" : "#111", fontSize: "12px", fontWeight: 500, borderRadius: "2px", fontFamily: "Roboto, sans-serif", textDecoration: "none" }}>Bulk invite</a>
            <a href="/settings" style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: pathname === "/settings" ? "#111" : "#fff", color: pathname === "/settings" ? "#fff" : "#111", fontSize: "12px", fontWeight: 500, borderRadius: "2px", fontFamily: "Roboto, sans-serif", textDecoration: "none" }}>Settings</a>
            <button onClick={() => setShowInvite(true)} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: "pointer", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>+ Invite contractor</button>
          </div>
        </div>
      </nav>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </>
  );
}