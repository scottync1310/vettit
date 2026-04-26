"use client";
import { useState } from "react";

type Doc = {
  id: number;
  contractor: string;
  trade: string;
  docType: string;
  level: "company" | "site" | "worker";
  site?: string;
  worker?: string;
  fileName: string;
  uploadedDate: string;
  expiry: string;
  status: "valid" | "expiring" | "expired";
};

const allDocs: Doc[] = [
  { id: 1, contractor: "ABC Plumbing", trade: "Plumbing", docType: "Public liability insurance", level: "company", fileName: "ABC_Liability_2025.pdf", uploadedDate: "14 Mar 2025", expiry: "14 Mar 2026", status: "valid" },
  { id: 2, contractor: "ABC Plumbing", trade: "Plumbing", docType: "Workers compensation", level: "company", fileName: "ABC_WorkersComp_2025.pdf", uploadedDate: "14 Mar 2025", expiry: "30 Jun 2025", status: "expiring" },
  { id: 3, contractor: "ABC Plumbing", trade: "Plumbing", docType: "Trade licence", level: "company", fileName: "ABC_TradeLicence.pdf", uploadedDate: "14 Mar 2025", expiry: "30 Nov 2025", status: "valid" },
  { id: 4, contractor: "ABC Plumbing", trade: "Plumbing", docType: "SWMS", level: "site", site: "Paddington Townhouses", fileName: "ABC_SWMS_Paddington.pdf", uploadedDate: "14 Mar 2025", expiry: "No expiry", status: "valid" },
  { id: 5, contractor: "ABC Plumbing", trade: "Plumbing", docType: "White Card", level: "worker", worker: "James Smith", fileName: "JSmith_WhiteCard.pdf", uploadedDate: "14 Mar 2025", expiry: "No expiry", status: "valid" },
  { id: 6, contractor: "XYZ Electrical", trade: "Electrical", docType: "Public liability insurance", level: "company", fileName: "XYZ_Liability_2025.pdf", uploadedDate: "2 Mar 2025", expiry: "28 Mar 2025", status: "expired" },
  { id: 7, contractor: "XYZ Electrical", trade: "Electrical", docType: "Workers compensation", level: "company", fileName: "XYZ_WorkersComp.pdf", uploadedDate: "2 Mar 2025", expiry: "30 Jun 2025", status: "valid" },
  { id: 8, contractor: "XYZ Electrical", trade: "Electrical", docType: "Electrical Worker Licence — Grade A", level: "worker", worker: "Mike Chen", fileName: "MChen_ElecLicence.pdf", uploadedDate: "2 Mar 2025", expiry: "15 Aug 2026", status: "valid" },
  { id: 9, contractor: "Rapid Demo Co", trade: "Demolition", docType: "Public liability insurance", level: "company", fileName: "RapidDemo_Liability.pdf", uploadedDate: "10 Mar 2025", expiry: "30 Nov 2025", status: "valid" },
  { id: 10, contractor: "Rapid Demo Co", trade: "Demolition", docType: "Demolition Licence", level: "worker", worker: "Tom Richards", fileName: "TRichards_DemoLicence.pdf", uploadedDate: "10 Mar 2025", expiry: "15 Nov 2025", status: "valid" },
  { id: 11, contractor: "SEQ Concreting", trade: "Concreting", docType: "Public liability insurance", level: "company", fileName: "SEQ_Liability.pdf", uploadedDate: "1 Mar 2025", expiry: "30 Nov 2025", status: "valid" },
  { id: 12, contractor: "SEQ Concreting", trade: "Concreting", docType: "SWMS", level: "site", site: "Bulimba Apartments", fileName: "SEQ_SWMS_Bulimba.pdf", uploadedDate: "1 Mar 2025", expiry: "No expiry", status: "valid" },
];

const contractors = ["All contractors", "ABC Plumbing", "XYZ Electrical", "Rapid Demo Co", "SEQ Concreting"];
const levels = ["All levels", "Company", "Site", "Worker"];
const statuses = ["All statuses", "Valid", "Expiring", "Expired"];

export default function Vault() {
  const [search, setSearch] = useState("");
  const [filterContractor, setFilterContractor] = useState("All contractors");
  const [filterLevel, setFilterLevel] = useState("All levels");
  const [filterStatus, setFilterStatus] = useState("All statuses");

  const filtered = allDocs.filter((d) => {
    if (filterContractor !== "All contractors" && d.contractor !== filterContractor) return false;
    if (filterLevel !== "All levels" && d.level !== filterLevel.toLowerCase()) return false;
    if (filterStatus !== "All statuses" && d.status !== filterStatus.toLowerCase()) return false;
    if (search && !d.contractor.toLowerCase().includes(search.toLowerCase()) && !d.docType.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusBadge = (status: string) => {
    if (status === "valid") return <span style={{ fontSize: "11px", padding: "2px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500 }}>Valid</span>;
    if (status === "expiring") return <span style={{ fontSize: "11px", padding: "2px 8px", background: "#fff8e1", color: "#7c4e00", border: "1px solid #ffe082", borderRadius: "2px", fontWeight: 500 }}>Expiring</span>;
    if (status === "expired") return <span style={{ fontSize: "11px", padding: "2px 8px", background: "#ffebee", color: "#b71c1c", border: "1px solid #ef9a9a", borderRadius: "2px", fontWeight: 500 }}>Expired</span>;
  };

  const levelBadge = (level: string, site?: string, worker?: string) => {
    if (level === "company") return <span style={{ fontSize: "11px", padding: "2px 8px", background: "#f5f5f5", color: "#555", border: "1px solid #ddd", borderRadius: "2px" }}>Company</span>;
    if (level === "site") return <span style={{ fontSize: "11px", padding: "2px 8px", background: "#E6F1FB", color: "#0C447C", border: "1px solid #85B7EB", borderRadius: "2px" }}>{site}</span>;
    if (level === "worker") return <span style={{ fontSize: "11px", padding: "2px 8px", background: "#EEEDFE", color: "#3C3489", border: "1px solid #AFA9EC", borderRadius: "2px" }}>{worker}</span>;
  };

  const selectStyle: React.CSSProperties = { fontSize: "12px", padding: "6px 10px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif", cursor: "pointer" };

  return (
    <div>
      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>DOCUMENT VAULT</div>
          <div style={{ fontSize: "12px", color: "#333", marginTop: "2px" }}>Every document uploaded by every contractor — searchable and downloadable</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#333" }}>{filtered.length} documents</span>
          <button style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: "pointer", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
            Export all
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search contractor or document..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "6px 10px", border: "1px solid #d0d0d0", fontSize: "12px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif", width: "220px" }}
        />
        <select value={filterContractor} onChange={(e) => setFilterContractor(e.target.value)} style={selectStyle}>
          {contractors.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} style={selectStyle}>
          {levels.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyle}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(search || filterContractor !== "All contractors" || filterLevel !== "All levels" || filterStatus !== "All statuses") && (
          <button
            onClick={() => { setSearch(""); setFilterContractor("All contractors"); setFilterLevel("All levels"); setFilterStatus("All statuses"); }}
            style={{ fontSize: "12px", color: "#333", background: "none", border: "none", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}
          >
            Clear filters
          </button>
        )}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th style={{ width: "18%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "10px 16px 10px 32px", borderBottom: "1px solid #d0d0d0" }}>Contractor</th>
            <th style={{ width: "22%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Document</th>
            <th style={{ width: "20%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Level</th>
            <th style={{ width: "14%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Uploaded</th>
            <th style={{ width: "14%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Expiry</th>
            <th style={{ width: "7%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Status</th>
            <th style={{ width: "5%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "#333" }}>No documents match your filters</td>
            </tr>
          ) : (
            filtered.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: "1px solid #ebebeb" }}>
                <td style={{ padding: "11px 16px 11px 32px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{doc.contractor}</div>
                  <div style={{ fontSize: "11px", color: "#444", marginTop: "1px" }}>{doc.trade}</div>
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <div style={{ fontSize: "13px", color: "#111" }}>{doc.docType}</div>
                  <div style={{ fontSize: "11px", color: "#444", marginTop: "1px" }}>{doc.fileName}</div>
                </td>
                <td style={{ padding: "11px 16px" }}>
                  {levelBadge(doc.level, doc.site, doc.worker)}
                </td>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: "#333" }}>{doc.uploadedDate}</td>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: doc.status === "expired" ? "#b71c1c" : doc.status === "expiring" ? "#7c4e00" : "#888" }}>{doc.expiry}</td>
                <td style={{ padding: "11px 16px" }}>{statusBadge(doc.status)}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ fontSize: "12px", color: "#3a7d44", cursor: "pointer", fontWeight: 500 }}>↓</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
