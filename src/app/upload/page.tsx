"use client";
import { useState } from "react";

const required = [
  { name: "Public liability insurance", type: "company", expiry: "14 Mar 2026", uploaded: true },
  { name: "Workers compensation", type: "company", expiry: "", uploaded: false },
  { name: "Trade licence", type: "company", expiry: "", uploaded: false },
  { name: "SWMS", type: "site", expiry: "", uploaded: false },
  { name: "Site induction", type: "site", expiry: "", uploaded: false, optional: true },
];

export default function UploadPortal() {
  const [docs, setDocs] = useState(required);

  const uploaded = docs.filter((d) => d.uploaded).length;
  const total = docs.filter((d) => !d.optional).length;
  const progress = Math.round((uploaded / total) * 100);

  const toggleUpload = (name: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.name === name ? { ...d, uploaded: !d.uploaded } : d))
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Roboto, sans-serif" }}>
      <div style={{ borderBottom: "1px solid #d0d0d0", padding: "0 32px", height: "52px", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: "17px", fontWeight: 500, color: "#111", letterSpacing: "-0.3px" }}>
          vett<span style={{ color: "#3a7d44" }}>it</span>
        </span>
      </div>

      <div style={{ maxWidth: "520px", margin: "40px auto", padding: "0 24px" }}>
        
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#111", marginBottom: "2px" }}>Rapid Plumbing Pty Ltd</div>
          <div style={{ fontSize: "12px", color: "#888" }}>Requested by Hartley Constructions · Paddington Townhouses</div>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>Link expires in 14 days · no account needed</div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <div style={{ fontSize: "12px", color: "#555" }}>{uploaded} of {total} required documents submitted</div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: progress === 100 ? "#3a7d44" : "#111" }}>{progress}%</div>
          </div>
          <div style={{ height: "4px", background: "#ebebeb", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#3a7d44" : "#111", borderRadius: "2px", transition: "width 0.3s ease" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {docs.map((doc) => (
            <div key={doc.name} style={{ border: doc.uploaded ? "1px solid #a5d6a7" : "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", background: doc.uploaded ? "#f9fdf9" : "#fff" }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: doc.uploaded ? "#1b5e20" : "#111" }}>
                    {doc.name}
                    {doc.optional && <span style={{ fontSize: "11px", color: "#aaa", fontWeight: 400, marginLeft: "6px" }}>optional</span>}
                  </div>
                  {doc.uploaded && doc.expiry && (
                    <div style={{ fontSize: "11px", color: "#3a7d44", marginTop: "2px" }}>Uploaded · expires {doc.expiry}</div>
                  )}
                  {!doc.uploaded && (
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>
                      {doc.type === "company" ? "Company-level · verified once" : "Required for this site"}
                    </div>
                  )}
                </div>
                {doc.uploaded ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500 }}>Uploaded</span>
                    <button onClick={() => toggleUpload(doc.name)} style={{ fontSize: "11px", color: "#aaa", background: "none", border: "none", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Remove</button>
                  </div>
                ) : (
                  <button onClick={() => toggleUpload(doc.name)} style={{ fontSize: "12px", padding: "6px 12px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", cursor: "pointer", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>
                    Upload
                  </button>
                )}
              </div>
              {!doc.uploaded && (
                <div style={{ borderTop: "1px solid #ebebeb", padding: "10px 14px", background: "#fafafa" }}>
                  <div style={{ fontSize: "12px", color: "#aaa", textAlign: "center" }}>Drop PDF here or click Upload</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", border: "1px solid #ebebeb", borderRadius: "2px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#888" }}>Already have docs on file with another builder? <span style={{ color: "#3a7d44", cursor: "pointer", fontWeight: 500 }}>Reuse existing docs</span></div>
        </div>

      </div>
    </div>
  );
}