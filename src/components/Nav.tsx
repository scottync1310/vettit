"use client";
import { useState } from "react";
import InviteModal from "./InviteModal";

const sites = [
  "All sites",
  "Paddington Townhouses",
  "Bulimba Apartments",
  "Newstead Commercial",
];

export default function Nav() {
  const [site, setSite] = useState("All sites");
  const [showInvite, setShowInvite] = useState(false);

  return (
    <>
      <nav style={{ borderBottom: "1px solid #d0d0d0", background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "52px" }}>
          <span style={{ fontSize: "17px", fontWeight: 500, color: "#111", letterSpacing: "-0.3px" }}>
            vett<span style={{ color: "#3a7d44" }}>it</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              style={{ fontSize: "12px", padding: "6px 10px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif", cursor: "pointer" }}
            >
              {sites.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setShowInvite(true)}
              style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: "pointer", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}
            >
              + Invite contractor
            </button>
          </div>
        </div>
      </nav>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </>
  );
}