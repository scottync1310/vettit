"use client";
import { useState } from "react";

type ContractorRow = {
  id: number;
  company: string;
  contact: string;
  email: string;
  mobile: string;
  trade: string;
  status: "ready" | "error" | "sent";
  error?: string;
};

const sampleCSV = `Company Name,Contact Name,Email,Mobile,Trade
ABC Plumbing,Dave Smith,dave@abcplumbing.com.au,0400 111 222,Plumbing
XYZ Electrical,Mike Jones,mike@xyzelectrical.com.au,0400 333 444,Electrical
SEQ Concreting,Paul Brown,paul@seqconcreting.com.au,0400 555 666,Concreting
Brisbane Frames,Tom White,tom@brisframes.com.au,0400 777 888,Framing
North Build Co,Steve Green,,0400 999 000,Labourer`;

const sites = [
  { name: "Paddington Townhouses", sub: "Stage 2 — active" },
  { name: "Bulimba Apartments", sub: "Stage 1 — active" },
  { name: "Newstead Commercial", sub: "Fitout — planning" },
];

export default function BulkInvite() {
  const [step, setStep] = useState<"upload" | "review" | "sent">("upload");
  const [rows, setRows] = useState<ContractorRow[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const data = lines.slice(1).map((line, i) => {
      const [company, contact, email, mobile, trade] = line.split(",").map((s) => s.trim());
      const hasError = !email || !email.includes("@");
      return {
        id: i + 1,
        company: company || "",
        contact: contact || "",
        email: email || "",
        mobile: mobile || "",
        trade: trade || "",
        status: hasError ? "error" as const : "ready" as const,
        error: !email ? "Email missing" : !email.includes("@") ? "Invalid email" : undefined,
      };
    });
    setRows(data);
    setStep("review");
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => parseCSV(e.target?.result as string);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const toggleSite = (name: string) => {
    setSelectedSites((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const updateRow = (id: number, field: Partial<ContractorRow>) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, ...field } : r));
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const readyCount = rows.filter((r) => r.status === "ready").length;
  const errorCount = rows.filter((r) => r.status === "error").length;

  const sendInvites = () => {
    setRows((prev) => prev.map((r) => r.status === "ready" ? { ...r, status: "sent" as const } : r));
    setStep("sent");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "6px 8px", border: "1px solid #d0d0d0",
    fontSize: "12px", color: "#111", borderRadius: "2px", fontFamily: "Montserrat, sans-serif",
  };

  return (
    <div>
      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Bulk invite</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>Upload a CSV to invite multiple contractors at once</div>
        </div>
        <a href="/" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>← Back to dashboard</a>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {step === "upload" && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px" }}>Step 1 — upload your CSV file</div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{ border: `2px dashed ${dragOver ? "#111" : "#d0d0d0"}`, borderRadius: "2px", padding: "48px 32px", textAlign: "center", background: dragOver ? "#fafafa" : "#fff" }}
              >
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Drop your CSV here</div>
                <div style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>or click to browse</div>
                <label style={{ padding: "8px 20px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                  Choose file
                  <input type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>CSV format required</div>
              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ padding: "8px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", fontSize: "11px", color: "#555" }}>Required columns — Company Name, Contact Name, Email, Mobile, Trade</div>
                <pre style={{ padding: "12px 14px", fontSize: "11px", color: "#555", margin: 0, fontFamily: "monospace", background: "#fff", overflowX: "auto" }}>{sampleCSV}</pre>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={() => parseCSV(sampleCSV)} style={{ fontSize: "12px", color: "#555", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "Montserrat, sans-serif" }}>
                Use sample data to preview
              </button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Step 2 — review and fix errors</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500 }}>{readyCount} ready</span>
                {errorCount > 0 && <span style={{ fontSize: "11px", padding: "3px 8px", background: "#ffebee", color: "#b71c1c", border: "1px solid #ef9a9a", borderRadius: "2px", fontWeight: 500 }}>{errorCount} errors</span>}
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr style={{ background: "#fafafa" }}>
                    <th style={{ width: "20%", fontSize: "11px", fontWeight: 500, color: "#555", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Company</th>
                    <th style={{ width: "16%", fontSize: "11px", fontWeight: 500, color: "#555", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Contact</th>
                    <th style={{ width: "22%", fontSize: "11px", fontWeight: 500, color: "#555", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Email</th>
                    <th style={{ width: "18%", fontSize: "11px", fontWeight: 500, color: "#555", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Mobile</th>
                    <th style={{ width: "14%", fontSize: "11px", fontWeight: 500, color: "#555", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Trade</th>
                    <th style={{ width: "10%", fontSize: "11px", fontWeight: 500, color: "#555", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} style={{ borderBottom: "1px solid #ebebeb", background: row.status === "error" ? "#fff8f8" : "#fff" }}>
                      <td style={{ padding: "8px 12px" }}>
                        <input value={row.company} onChange={(e) => updateRow(row.id, { company: e.target.value })} style={inputStyle} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <input value={row.contact} onChange={(e) => updateRow(row.id, { contact: e.target.value })} style={inputStyle} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <input
                          value={row.email}
                          onChange={(e) => {
                            const email = e.target.value;
                            const hasError = !email || !email.includes("@");
                            updateRow(row.id, { email, status: hasError ? "error" : "ready", error: hasError ? "Invalid email" : undefined });
                          }}
                          style={{ ...inputStyle, borderColor: row.status === "error" ? "#ef9a9a" : "#d0d0d0" }}
                        />
                        {row.error && <div style={{ fontSize: "10px", color: "#c0392b", marginTop: "2px" }}>{row.error}</div>}
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <input value={row.mobile} onChange={(e) => updateRow(row.id, { mobile: e.target.value })} style={inputStyle} />
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <input value={row.trade} onChange={(e) => updateRow(row.id, { trade: e.target.value })} style={inputStyle} />
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <span onClick={() => removeRow(row.id)} style={{ fontSize: "14px", color: "#555", cursor: "pointer" }}>×</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Vetting for which sites</div>
              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                {sites.map((s, i) => (
                  <label key={s.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: i < sites.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer", background: selectedSites.includes(s.name) ? "#f5f5f5" : "#fff" }}>
                    <input type="checkbox" checked={selectedSites.includes(s.name)} onChange={() => toggleSite(s.name)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                    <div>
                      <div style={{ fontSize: "13px", color: "#111", fontWeight: selectedSites.includes(s.name) ? 500 : 400 }}>{s.name}</div>
                      <div style={{ fontSize: "11px", color: "#555" }}>{s.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => { setStep("upload"); setRows([]); }} style={{ padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", borderRadius: "2px", fontSize: "13px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                ← Start over
              </button>
              <button
                onClick={sendInvites}
                disabled={readyCount === 0 || selectedSites.length === 0}
                style={{ padding: "9px 20px", background: readyCount === 0 || selectedSites.length === 0 ? "#aaa" : "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 500, cursor: readyCount === 0 || selectedSites.length === 0 ? "not-allowed" : "pointer", fontFamily: "Montserrat, sans-serif" }}
              >
                Send {readyCount} invite{readyCount !== 1 ? "s" : ""} — Vettit handles the rest
              </button>
            </div>
            {selectedSites.length === 0 && <div style={{ fontSize: "11px", color: "#c0392b", marginTop: "8px", textAlign: "right" }}>Select at least one site before sending</div>}
          </div>
        )}

        {step === "sent" && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px", color: "#3a7d44" }}>✓</div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>{readyCount} invites sent</div>
            <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "24px" }}>
              Vettit has sent invites to all {readyCount} contractors.<br />
              Automated reminders will fire on day 2, 5 and 7 if incomplete.
            </div>
            <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", overflow: "hidden", display: "inline-block", textAlign: "left", marginBottom: "24px", minWidth: "300px" }}>
              <div style={{ padding: "8px 14px", background: "#fafafa", borderBottom: "1px solid #ebebeb", fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".07em" }}>Invites sent to</div>
              {rows.filter((r) => r.status === "sent").map((r) => (
                <div key={r.id} style={{ padding: "9px 14px", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{r.company}</div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{r.email} · {r.mobile}</div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "2px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500 }}>Sent</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <a href="/" style={{ padding: "9px 20px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>Back to dashboard</a>
              <button onClick={() => { setStep("upload"); setRows([]); setSelectedSites([]); }} style={{ padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", borderRadius: "2px", fontSize: "13px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Send another batch</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}