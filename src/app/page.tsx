"use client";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import SiteTag from "../components/SiteTag";

const pendingSubDeclarations = [
  { id: 1, declaredBy: "Rapid Demo Co", subName: "QLD Pipe Specialists", subTrade: "Plumbing", subContact: "Steve Moore", subEmail: "steve@qldpipe.com.au", site: "Paddington Townhouses", declaredDate: "Today, 9:14am" },
  { id: 2, declaredBy: "ABC Plumbing", subName: "Brisbane Drainage Co", subTrade: "Drainage", subContact: "Paul Harris", subEmail: "paul@brisbanedrainage.com.au", site: "Bulimba Apartments", declaredDate: "Yesterday, 2:30pm" },
];

const initialContractors = [
  { name: "ABC Plumbing", trade: "Plumbing", invited: "14 Mar", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington" }, { name: "Bulimba" }], archived: false },
  { name: "XYZ Electrical", trade: "Electrical", invited: "2 Mar", docs: "4 docs", status: "expiring" as const, issue: "Liability expires in 5 days", sites: [{ name: "Paddington" }, { name: "Newstead" }], archived: false },
  { name: "Rapid Demo Co", trade: "Demolition", invited: "10 Mar", docs: "2 of 4 docs", status: "non-compliant" as const, issue: "SWMS missing — Newstead", sites: [{ name: "Paddington" }, { name: "Newstead" }], archived: false },
  { name: "North Build Co", trade: "Labourer", invited: "8 Mar", docs: "0 docs", status: "unresponsive" as const, issue: "No uploads · 3 reminders sent", sites: [{ name: "Bulimba" }], archived: false },
  { name: "SEQ Concreting", trade: "Concreting", invited: "1 Mar", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington" }, { name: "Bulimba" }], archived: false },
  { name: "Brisbane Frames", trade: "Framing", invited: "20 Feb", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Newstead" }], archived: false },
  { name: "QLD Scaffolding", trade: "Scaffolding", invited: "10 Jan", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Bulimba" }], archived: true },
  { name: "Ace Painting", trade: "Painting", invited: "5 Jan", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington" }], archived: true },
];

type Tab = { label: string; status: string | null; bg: string; color: string; border: string; activeBg: string; activeColor: string; activeBorder: string; };

const tabs: Tab[] = [
  { label: "All", status: null, bg: "#f5f5f5", color: "#555", border: "1px solid #ddd", activeBg: "#f5f5f5", activeColor: "#555", activeBorder: "1px solid #bdbdbd" },
  { label: "Compliant", status: "compliant", bg: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", activeBg: "#e8f5e9", activeColor: "#1b5e20", activeBorder: "1px solid #a5d6a7" },
  { label: "Expiring soon", status: "expiring", bg: "#fff8e1", color: "#7c4e00", border: "1px solid #ffe082", activeBg: "#fff8e1", activeColor: "#7c4e00", activeBorder: "1px solid #ffe082" },
  { label: "Non-compliant", status: "non-compliant", bg: "#ffebee", color: "#b71c1c", border: "1px solid #ef9a9a", activeBg: "#ffebee", activeColor: "#b71c1c", activeBorder: "1px solid #ef9a9a" },
  { label: "Unresponsive", status: "unresponsive", bg: "#f6e8ff", color: "#6a0dad", border: "1px solid #ce93d8", activeBg: "#f6e8ff", activeColor: "#6a0dad", activeBorder: "1px solid #ce93d8" },
  { label: "Archived", status: "archived", bg: "#d1eaff", color: "#008cff", border: "1px solid #91bcf5", activeBg: "#d1eaff", activeColor: "#008cff", activeBorder: "1px solid #91bcf5" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [declarations, setDeclarations] = useState(pendingSubDeclarations);
  const [contractors, setContractors] = useState(initialContractors);

  const active = contractors.filter((c) => !c.archived);
  const archived = contractors.filter((c) => c.archived);

  const getCount = (tab: Tab) => {
    if (tab.label === "All") return active.length;
    if (tab.label === "Archived") return archived.length;
    return active.filter((c) => c.status === tab.status).length;
  };

  const filtered = activeTab === "All"
    ? active
    : activeTab === "Archived"
    ? archived
    : active.filter((c) => c.status === tabs.find((t) => t.label === activeTab)?.status);

  const dismiss = (id: number) => setDeclarations((prev) => prev.filter((d) => d.id !== id));

  const unarchive = (name: string) => {
    setContractors((prev) => prev.map((c) => c.name === name ? { ...c, archived: false } : c));
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 700 }}>{active.length}</div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Active contractors</div>
        </div>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#3a7d44" }}>{active.filter(c => c.status === "compliant").length}</div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Compliant</div>
        </div>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#b8860b" }}>{active.filter(c => c.status === "expiring").length}</div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Expiring soon</div>
        </div>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#c0392b" }}>{active.filter(c => c.status === "non-compliant" || c.status === "unresponsive").length}</div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Action required</div>
        </div>
        <div style={{ padding: "16px 32px" }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#111" }}>3</div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Active sites</div>
        </div>
      </div>

      {declarations.length > 0 && (
        <div style={{ margin: "20px 32px", border: "1px solid #ffe082", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", background: "#fff8e1", borderBottom: "1px solid #ffe082", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#b8860b" }} />
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#7c4e00", textTransform: "uppercase", letterSpacing: ".07em" }}>
              Subcontractors pending your approval — {declarations.length} declaration{declarations.length > 1 ? "s" : ""}
            </div>
          </div>
          {declarations.map((d, i) => (
            <div key={d.id} style={{ padding: "12px 16px", background: "#fff", borderBottom: i < declarations.length - 1 ? "1px solid #ffe082" : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#111", marginBottom: "3px" }}>
                  <strong>{d.declaredBy}</strong> wants to bring <strong>{d.subName}</strong> ({d.subTrade}) on to <strong>{d.site}</strong>
                </div>
                <div style={{ fontSize: "11px", color: "#555" }}>{d.declaredDate} · Contact: {d.subContact} · {d.subEmail}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "20px" }}>
                <a href="/contractor/invite" style={{ padding: "5px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", fontWeight: 500, borderRadius: "2px", fontFamily: "Montserrat, sans-serif", textDecoration: "none", display: "inline-block" }}>Invite</a>
                <button onClick={() => dismiss(d.id)} style={{ padding: "5px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#333", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: "6px", padding: "16px 32px", borderBottom: "1px solid #d0d0d0", flexWrap: "wrap" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.label;
          const count = getCount(tab);
          return (
            <div key={tab.label} onClick={() => setActiveTab(tab.label)} style={{ fontSize: "12px", fontWeight: isActive ? 700 : 500, padding: "4px 10px", borderRadius: "2px", cursor: "pointer", whiteSpace: "nowrap" as const, fontFamily: "Montserrat, sans-serif", background: isActive ? tab.activeBg : tab.bg, color: isActive ? tab.activeColor : tab.color, border: isActive ? tab.activeBorder : tab.border, display: "flex", alignItems: "center", gap: "5px", boxShadow: isActive ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : "none" }}>
              {tab.label}
              <span style={{ fontSize: "11px", color: "inherit", opacity: 0.75 }}>({count})</span>
            </div>
          );
        })}
      </div>

      <div style={{ margin: "20px 32px", border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
        {active.length === 0 && activeTab === "All" ? (
          <div style={{ padding: "64px 32px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>📋</div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>No active contractors</div>
            <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "24px" }}>
              All contractors have been archived or you haven't invited anyone yet.<br />
              Invite your first contractor to get started.
            </div>
            <a href="/contractor/invite" style={{ display: "inline-block", padding: "9px 24px", background: "#111", color: "#fff", fontSize: "13px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}>
              Invite a contractor
            </a>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th style={{ width: "28%", fontSize: "11px", fontWeight: 700, color: "#111", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Contractor</th>
                <th style={{ width: "14%", fontSize: "11px", fontWeight: 700, color: "#111", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Status</th>
                <th style={{ width: "26%", fontSize: "11px", fontWeight: 700, color: "#111", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>{activeTab === "Archived" ? "Last active" : "Issue"}</th>
                <th style={{ width: "22%", fontSize: "11px", fontWeight: 700, color: "#111", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Sites</th>
                <th style={{ width: "10%", fontSize: "11px", fontWeight: 700, color: "#111", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "#555" }}>No contractors in this category</td></tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.name} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #ebebeb" : "none", opacity: c.archived ? 0.7 : 1 }}>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontWeight: 500, fontSize: "13px", color: "#111" }}>{c.name}</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{c.trade} · Invited {c.invited} · {c.docs}</div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      {c.archived
                        ? <span style={{ fontSize: "11px", padding: "2px 8px", background: "#d1eaff", color: "#008cff", border: "1px solid #91bcf5", borderRadius: "2px" }}>Archived</span>
                        : <StatusBadge status={c.status} />
                      }
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: "12px", color: c.status === "non-compliant" ? "#b71c1c" : c.status === "expiring" ? "#7c4e00" : "#888" }}>
                      {c.archived ? `Archived ${c.invited}` : c.issue}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      {c.sites.map((s) => <SiteTag key={s.name} name={s.name} fail={false} />)}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      {c.archived ? (
                        <button
                          onClick={() => unarchive(c.name)}
                          style={{ display: "inline-block", fontSize: "11px", padding: "5px 10px", background: "#fff", color: "#008cff", border: "1px solid #91bcf5", borderRadius: "2px", cursor: "pointer", fontWeight: 500, fontFamily: "Montserrat, sans-serif" }}
                        >
                          Unarchive
                        </button>
                      ) : (
                        <a href="/contractor" style={{ display: "inline-block", fontSize: "11px", padding: "5px 10px", background: "#3a7d44", color: "#fff", borderRadius: "2px", textDecoration: "none", fontWeight: 500, fontFamily: "Montserrat, sans-serif" }}>
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}