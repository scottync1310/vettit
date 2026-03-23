"use client";
import { useState } from "react";

const sites = [
  { name: "Paddington Townhouses", sub: "Stage 2 — active" },
  { name: "Bulimba Apartments", sub: "Stage 1 — active" },
  { name: "Newstead Commercial", sub: "Fitout — planning" },
];

const companyDocs = ["Public liability insurance", "Workers compensation", "Trade licence"];
const siteDocs = ["SWMS", "Site induction (optional)"];

export default function InviteModal({ onClose }: { onClose: () => void }) {
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>(["Public liability insurance", "Workers compensation", "Trade licence", "SWMS"]);

  const toggleSite = (name: string) => {
    setSelectedSites((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);
  };

  const toggleDoc = (name: string) => {
    setSelectedDocs((prev) => prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: "480px", borderRadius: "2px", border: "1px solid #d0d0d0", overflow: "hidden" }}>
        
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Invite a contractor</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>One email sent. Vettit handles the follow-up.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "18px", color: "#888", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "70vh", overflowY: "auto" }}>
          
          <div>
            <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Company name</label>
            <input type="text" placeholder="e.g. Rapid Plumbing Pty Ltd" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Contact email</label>
            <input type="email" placeholder="e.g. dave@contractor.com.au" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Vetting for which sites</label>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              {sites.map((s, i) => (
                <label key={s.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: i < sites.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer", background: selectedSites.includes(s.name) ? "#f5f5f5" : "#fff" }}>
                  <input type="checkbox" checked={selectedSites.includes(s.name)} onChange={() => toggleSite(s.name)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  <div>
                    <div style={{ fontSize: "13px", color: "#111", fontWeight: selectedSites.includes(s.name) ? 500 : 400 }}>{s.name}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{s.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Required documents</label>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", padding: "10px 12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "6px" }}>Company-level — verified once</div>
              {companyDocs.map((doc, i) => (
                <label key={doc} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: i < companyDocs.length - 1 ? "1px solid #f0f0f0" : "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                  <input type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => toggleDoc(doc)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  {doc}
                </label>
              ))}
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".07em", margin: "10px 0 6px", paddingTop: "10px", borderTop: "1px solid #ebebeb" }}>Per-site — required per engagement</div>
              {siteDocs.map((doc) => (
                <label key={doc} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                  <input type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => toggleDoc(doc)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  {doc}
                </label>
              ))}
            </div>
          </div>

          <button style={{ width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
            Send invite — Vettit handles the rest
          </button>
          <div style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "-8px" }}>
            Reminders sent automatically on day 2, 5 and 7 if incomplete
          </div>

        </div>
      </div>
    </div>
  );
}