"use client";
import { useState } from "react";

type Props = {
  contractorName: string;
  sites: string[];
  onConfirm: (selectedSites: string[]) => void;
  onClose: () => void;
};

export default function ArchiveModal({ contractorName, sites, onConfirm, onClose }: Props) {
  const [selectedSites, setSelectedSites] = useState<string[]>(sites);

  const toggleSite = (site: string) => {
    setSelectedSites((prev) =>
      prev.includes(site) ? prev.filter((s) => s !== site) : [...prev, site]
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: "420px", borderRadius: "2px", border: "1px solid #d0d0d0", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Archive contractor</div>
            <div style={{ fontSize: "12px", color: "#333", marginTop: "2px" }}>{contractorName}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "18px", color: "#333", cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#555", marginBottom: "16px", lineHeight: 1.6 }}>
            Select which sites to archive this contractor from. Their full compliance history will be preserved for audit purposes.
          </div>
          <div style={{ fontSize: "11px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "8px" }}>Remove from sites</div>
          <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
            {sites.map((site, i) => (
              <label key={site} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: i < sites.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer", background: selectedSites.includes(site) ? "#fff8f8" : "#fff" }}>
                <input type="checkbox" checked={selectedSites.includes(site)} onChange={() => toggleSite(site)} style={{ accentColor: "#c0392b", width: "14px", height: "14px" }} />
                <div style={{ fontSize: "13px", color: "#111" }}>{site}</div>
              </label>
            ))}
          </div>
          <div style={{ padding: "10px 12px", background: "#fafafa", border: "1px solid #ebebeb", borderRadius: "2px", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", color: "#333", lineHeight: 1.6 }}>
              Archived contractors are removed from active views but all compliance records, documents and reminder history are preserved permanently for WHS audit purposes.
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>
              Cancel
            </button>
            <button onClick={() => onConfirm(selectedSites)} disabled={selectedSites.length === 0} style={{ padding: "7px 14px", border: "1px solid #c0392b", background: selectedSites.length === 0 ? "#aaa" : "#c0392b", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: selectedSites.length === 0 ? "not-allowed" : "pointer", fontFamily: "Roboto, sans-serif", fontWeight: 500 }}>
              Archive from {selectedSites.length} site{selectedSites.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
