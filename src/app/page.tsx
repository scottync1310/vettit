"use client";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import SiteTag from "../components/SiteTag";
import InviteModal from "../components/InviteModal";

const pendingSubDeclarations = [
  {
    id: 1,
    declaredBy: "Rapid Demo Co",
    subName: "QLD Pipe Specialists",
    subTrade: "Plumbing",
    subContact: "Steve Moore",
    subEmail: "steve@qldpipe.com.au",
    site: "Paddington Townhouses",
    declaredDate: "Today, 9:14am",
  },
  {
    id: 2,
    declaredBy: "ABC Plumbing",
    subName: "Brisbane Drainage Co",
    subTrade: "Drainage",
    subContact: "Paul Harris",
    subEmail: "paul@brisbanedrainage.com.au",
    site: "Bulimba Apartments",
    declaredDate: "Yesterday, 2:30pm",
  },
];

const contractors = [
  { name: "ABC Plumbing", trade: "Plumbing", invited: "14 Mar", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington", fail: false }, { name: "Bulimba", fail: false }], archived: false },
  { name: "XYZ Electrical", trade: "Electrical", invited: "2 Mar", docs: "4 docs", status: "expiring" as const, issue: "Liability expires in 5 days", sites: [{ name: "Paddington", fail: true }, { name: "Newstead", fail: true }], archived: false },
  { name: "Rapid Demo Co", trade: "Demolition", invited: "10 Mar", docs: "2 of 4 docs", status: "non-compliant" as const, issue: "SWMS missing — Newstead", sites: [{ name: "Paddington", fail: false }, { name: "Newstead", fail: true }], archived: false },
  { name: "North Build Co", trade: "Labourer", invited: "8 Mar", docs: "0 docs", status: "unresponsive" as const, issue: "No uploads · 3 reminders sent", sites: [{ name: "Bulimba", fail: false }], archived: false },
  { name: "SEQ Concreting", trade: "Concreting", invited: "1 Mar", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington", fail: false }, { name: "Bulimba", fail: false }], archived: false },
  { name: "Brisbane Frames", trade: "Framing", invited: "20 Feb", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Newstead", fail: false }], archived: false },
  { name: "QLD Scaffolding", trade: "Scaffolding", invited: "10 Jan", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Bulimba", fail: false }], archived: true },
  { name: "Ace Painting", trade: "Painting", invited: "5 Jan", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington", fail: false }], archived: true },
];

const tabs = ["All", "Compliant", "Expiring soon", "Missing docs", "Unresponsive", "Archived"];

const statusMap: Record<string, string> = {
  "Compliant": "compliant",
  "Expiring soon": "expiring",
  "Missing docs": "non-compliant",
  "Unresponsive": "unresponsive",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [declarations, setDeclarations] = useState(pendingSubDeclarations);
  const [showInvite, setShowInvite] = useState(false);

  const active = contractors.filter((c) => !c.archived);
  const archived = contractors.filter((c) => c.archived);

  const filtered = activeTab === "All"
    ? active
    : activeTab === "Archived"
    ? archived
    : active.filter((c) => c.status === statusMap[activeTab]);

  const dismiss = (id: number) => {
    setDeclarations((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 500 }}>{active.length}</div>
          <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>Active contractors</div>
        </div>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 500, color: "#3a7d44" }}>{active.filter(c => c.status === "compliant").length}</div>
          <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>Compliant</div>
        </div>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 500, color: "#b8860b" }}>{active.filter(c => c.status === "expiring").length}</div>
          <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>Expiring soon</div>
        </div>
        <div style={{ padding: "16px 32px" }}>
          <div style={{ fontSize: "22px", fontWeight: 500, color: "#c0392b" }}>{active.filter(c => c.status === "non-compliant" || c.status === "unresponsive").length}</div>
          <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>Action required</div>
        </div>
      </div>

      {/* SUBCONTRACTOR DECLARATIONS */}
      {declarations.length > 0 && (
        <div style={{ margin: "20px 32px", border: "1px solid #ffe082", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", background: "#fff8e1", borderBottom: "1px solid #ffe082", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#b8860b" }} />
              <div style={{ fontSize: "11px", fontWeight: 500, color: "#7c4e00", textTransform: "uppercase", letterSpacing: ".07em" }}>
                Subcontractors pending your approval — {declarations.length} declaration{declarations.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
          {declarations.map((d, i) => (
            <div key={d.id} style={{ padding: "12px 16px", background: "#fff", borderBottom: i < declarations.length - 1 ? "1px solid #ffe082" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#111", marginBottom: "3px" }}>
                  <strong>{d.declaredBy}</strong> wants to bring <strong>{d.subName}</strong> ({d.subTrade}) on to <strong>{d.site}</strong>
                </div>
                <div style={{ fontSize: "11px", color: "#333" }}>
                  {d.declaredDate} · Contact: {d.subContact} · {d.subEmail}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "20px" }}>
                <button
                  onClick={() => setShowInvite(true)}
                  style={{ padding: "5px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", fontWeight: 500, borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}
                >
                  Invite →
                </button>
                <button
                  onClick={() => dismiss(d.id)}
                  style={{ padding: "5px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#333", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FILTER TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid #d0d0d0", padding: "0 32px" }}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ fontSize: "12px", color: activeTab === tab ? "#111" : "#555", padding: "12px 14px", borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent", fontWeight: activeTab === tab ? 500 : 400, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {tab}
            {tab === "Archived" && (
              <span style={{ marginLeft: "5px", fontSize: "12px", padding: "1px 5px", background: "#f0f0f0", color: "#333", border: "1px solid #ddd", borderRadius: "2px" }}>
                {archived.length}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CONTRACTOR TABLE */}
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
<thead>
  <tr style={{ background: "#fafafa" }}>
    <th style={{ width: "28%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px 10px 32px", borderBottom: "1px solid #d0d0d0" }}>Contractor</th>
    <th style={{ width: "14%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Status</th>
    <th style={{ width: "26%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>{activeTab === "Archived" ? "Last active" : "Issue"}</th>
    <th style={{ width: "22%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Sites</th>
    <th style={{ width: "10%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}></th>
  </tr>
</thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "#333" }}>No contractors in this category</td>
            </tr>
          ) : (
            filtered.map((c) => (
              <tr key={c.name} style={{ borderBottom: "1px solid #ebebeb", opacity: c.archived ? 0.6 : 1 }}>
                <td style={{ padding: "11px 16px 11px 32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontWeight: 500, fontSize: "13px" }}>{c.name}</div>
                    {c.archived && <span style={{ fontSize: "12px", padding: "1px 6px", background: "#f5f5f5", color: "#333", border: "1px solid #ddd", borderRadius: "2px" }}>Archived</span>}
                  </div>
                  <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>
                    {c.trade} · Invited {c.invited} · {c.docs}
                  </div>
                </td>
                <td style={{ padding: "11px 16px" }}>
                  {c.archived ? (
                    <span style={{ fontSize: "11px", padding: "2px 8px", background: "#f5f5f5", color: "#333", border: "1px solid #ddd", borderRadius: "2px" }}>Archived</span>
                  ) : (
                    <StatusBadge status={c.status} />
                  )}
                </td>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: c.status === "non-compliant" ? "#b71c1c" : c.status === "expiring" ? "#7c4e00" : "#999" }}>
                  {c.archived ? `Archived ${c.invited}` : c.issue}
                </td>
                <td style={{ padding: "11px 16px" }}>
                  {c.sites.map((s) => (
                    <SiteTag key={s.name} name={s.name} fail={c.archived ? false : s.fail} />
                  ))}
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <a href="/contractor" style={{ display: "inline-block", fontSize: "11px", padding: "5px 10px", background: c.archived ? "#888" : "#3a7d44", color: "#fff", borderRadius: "2px", textDecoration: "none", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>
                    {c.archived ? "View records" : "View →"}
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
