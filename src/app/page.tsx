"use client";
import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import SiteTag from "../components/SiteTag";

const contractors = [
  { name: "ABC Plumbing", invited: "14 Mar", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington", fail: false }, { name: "Bulimba", fail: false }] },
  { name: "XYZ Electrical", invited: "2 Mar", docs: "4 docs", status: "expiring" as const, issue: "Liability expires in 5 days", sites: [{ name: "Paddington", fail: true }, { name: "Newstead", fail: true }] },
  { name: "Rapid Demo Co", invited: "10 Mar", docs: "2 of 4 docs", status: "non-compliant" as const, issue: "SWMS missing — Newstead", sites: [{ name: "Paddington", fail: false }, { name: "Newstead", fail: true }] },
  { name: "North Build Co", invited: "8 Mar", docs: "0 docs", status: "unresponsive" as const, issue: "No uploads · 3 reminders sent", sites: [{ name: "Bulimba", fail: false }] },
  { name: "SEQ Concreting", invited: "1 Mar", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Paddington", fail: false }, { name: "Bulimba", fail: false }] },
  { name: "Brisbane Frames", invited: "20 Feb", docs: "4 docs", status: "compliant" as const, issue: "—", sites: [{ name: "Newstead", fail: false }] },
];

const tabs = ["All", "Compliant", "Expiring soon", "Missing docs", "Unresponsive"];

const statusMap: Record<string, string> = {
  "Compliant": "compliant",
  "Expiring soon": "expiring",
  "Missing docs": "non-compliant",
  "Unresponsive": "unresponsive",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? contractors
    : contractors.filter((c) => c.status === statusMap[activeTab]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 500 }}>{contractors.length}</div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Total contractors</div>
        </div>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 500, color: "#3a7d44" }}>{contractors.filter(c => c.status === "compliant").length}</div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Compliant</div>
        </div>
        <div style={{ padding: "16px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "22px", fontWeight: 500, color: "#b8860b" }}>{contractors.filter(c => c.status === "expiring").length}</div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Expiring soon</div>
        </div>
        <div style={{ padding: "16px 32px" }}>
          <div style={{ fontSize: "22px", fontWeight: 500, color: "#c0392b" }}>{contractors.filter(c => c.status === "non-compliant" || c.status === "unresponsive").length}</div>
          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Action required</div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #d0d0d0", padding: "0 32px" }}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ fontSize: "12px", color: activeTab === tab ? "#111" : "#555", padding: "12px 14px", borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent", fontWeight: activeTab === tab ? 500 : 400, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {tab}
          </div>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th style={{ width: "22%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px 10px 32px", borderBottom: "1px solid #d0d0d0" }}>Contractor</th>
            <th style={{ width: "14%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Status</th>
            <th style={{ width: "26%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Issue</th>
            <th style={{ width: "24%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>Sites</th>
            <th style={{ width: "14%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.name} style={{ borderBottom: "1px solid #ebebeb" }}>
              <td style={{ padding: "11px 16px 11px 32px" }}>
                <div style={{ fontWeight: 500, fontSize: "13px" }}>{c.name}</div>
                <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>Invited {c.invited} · {c.docs}</div>
              </td>
              <td style={{ padding: "11px 16px" }}>
                <StatusBadge status={c.status} />
              </td>
              <td style={{ padding: "11px 16px", fontSize: "12px", color: c.status === "non-compliant" ? "#b71c1c" : c.status === "expiring" ? "#7c4e00" : "#999" }}>
                {c.issue}
              </td>
              <td style={{ padding: "11px 16px" }}>
                {c.sites.map((s) => (
                  <SiteTag key={s.name} name={s.name} fail={s.fail} />
                ))}
              </td>
              <td style={{ padding: "11px 16px" }}>
                <a href="/contractor" style={{ display: "inline-block", fontSize: "11px", padding: "5px 10px", background: "#3a7d44", color: "#fff", borderRadius: "2px", textDecoration: "none", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>
                  View →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}