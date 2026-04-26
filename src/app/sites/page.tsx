"use client";
import { useState } from "react";
import StatusBadge from "../../components/StatusBadge";

type Site = {
  id: number;
  name: string;
  sub: string;
  total: number;
  cleared: number;
  notCleared: number;
  archived: boolean;
};

const initialSiteList: Site[] = [
  { id: 1, name: "Paddington Townhouses", sub: "Stage 2 — active", total: 7, cleared: 5, notCleared: 2, archived: false },
  { id: 2, name: "Bulimba Apartments", sub: "Stage 1 — active", total: 3, cleared: 2, notCleared: 1, archived: false },
  { id: 3, name: "Newstead Commercial", sub: "Fitout — active", total: 4, cleared: 4, notCleared: 0, archived: false },
];

const siteData: Record<number, {
  notCleared: { name: string; trade: string; reason: string; status: "non-compliant" | "expiring" | "unresponsive" }[];
  cleared: { name: string; trade: string; nextExpiry: string }[];
}> = {
  1: {
    notCleared: [
      { name: "XYZ Electrical", trade: "Electrical", reason: "Public liability expires in 5 days", status: "expiring" },
      { name: "Rapid Demo Co", trade: "Demolition", reason: "SWMS not submitted for this site", status: "non-compliant" },
    ],
    cleared: [
      { name: "ABC Plumbing", trade: "Plumbing", nextExpiry: "30 Nov 2025" },
      { name: "SEQ Concreting", trade: "Concreting", nextExpiry: "15 Jun 2025" },
      { name: "Brisbane Frames", trade: "Framing", nextExpiry: "20 Aug 2025" },
      { name: "Steel Fix QLD", trade: "Structural Steel", nextExpiry: "12 Dec 2025" },
      { name: "North Build Co", trade: "Labourer", nextExpiry: "1 Oct 2025" },
    ],
  },
  2: {
    notCleared: [
      { name: "North Build Co", trade: "Labourer", reason: "No uploads after 3 reminders", status: "unresponsive" },
    ],
    cleared: [
      { name: "ABC Plumbing", trade: "Plumbing", nextExpiry: "30 Nov 2025" },
      { name: "SEQ Concreting", trade: "Concreting", nextExpiry: "15 Jun 2025" },
    ],
  },
  3: {
    notCleared: [],
    cleared: [
      { name: "Brisbane Frames", trade: "Framing", nextExpiry: "20 Aug 2025" },
      { name: "XYZ Electrical", trade: "Electrical", nextExpiry: "14 Mar 2026" },
      { name: "Steel Fix QLD", trade: "Structural Steel", nextExpiry: "12 Dec 2025" },
      { name: "SEQ Concreting", trade: "Concreting", nextExpiry: "15 Jun 2025" },
    ],
  },
};

const scoreColor = (score: number) => {
  if (score >= 80) return "#3a7d44";
  if (score >= 60) return "#b8860b";
  return "#c0392b";
};

const scoreBg = (score: number) => {
  if (score >= 80) return "#f9fdf9";
  if (score >= 60) return "#fffbf0";
  return "#fff8f8";
};

export default function Sites() {
  const [siteList, setSiteList] = useState<Site[]>(initialSiteList);
  const [activeSite, setActiveSite] = useState<number | null>(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const data = activeSite ? siteData[activeSite] : null;
  const site = siteList.find((s) => s.id === activeSite);

  const activeSites = siteList.filter((s) => !s.archived);
  const archivedSites = siteList.filter((s) => s.archived);

  const handleArchiveSite = () => {
    setSiteList((prev) => prev.map((s) => s.id === activeSite ? { ...s, archived: true } : s));
    setActiveSite(null);
    setShowArchiveConfirm(false);
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>
      {showArchiveConfirm && site && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", width: "100%", maxWidth: "400px", borderRadius: "2px", border: "1px solid #d0d0d0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>Archive site</div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{site.name}</div>
              </div>
              <button onClick={() => setShowArchiveConfirm(false)} style={{ background: "none", border: "none", fontSize: "18px", color: "#555", cursor: "pointer" }}>×</button>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "16px" }}>
                Archiving this site will mark the project as complete. It will be removed from active views but all compliance records, documents and contractor history will be preserved permanently for audit purposes.
              </div>
              <div style={{ padding: "10px 12px", background: "#fafafa", border: "1px solid #ebebeb", borderRadius: "2px", marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
                  {site.total} contractors on this site will be moved to archived status. Their records remain accessible in the document vault.
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowArchiveConfirm(false)} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Cancel</button>
                <button onClick={handleArchiveSite} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Archive site</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>SITES</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>Select a site to see who is cleared to work today</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {archivedSites.length > 0 && (
            <button onClick={() => setShowArchived(!showArchived)} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: showArchived ? "#111" : "#fff", color: showArchived ? "#fff" : "#888", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
              {showArchived ? "Hide archived" : `Show archived (${archivedSites.length})`}
            </button>
          )}
          <a href="/sites/new" style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, borderRadius: "2px", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            + Add site
          </a>
        </div>
      </div>

      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: activeSite ? "24px" : "0" }}>
          {activeSites.map((s) => {
            const score = Math.round((s.cleared / s.total) * 100);
            return (
              <div
                key={s.id}
                onClick={() => setActiveSite(activeSite === s.id ? null : s.id)}
                style={{ border: activeSite === s.id ? "1px solid #111" : "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", cursor: "pointer" }}
              >
                <div style={{ padding: "16px", borderBottom: "1px solid #ebebeb" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{s.name}</div>
                </div>
                <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #ebebeb" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: 500, color: "#111" }}>{s.total}</div>
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "1px" }}>Total</div>
                  </div>
                  <div style={{ textAlign: "center", borderLeft: "1px solid #ebebeb", borderRight: "1px solid #ebebeb" }}>
                    <div style={{ fontSize: "18px", fontWeight: 500, color: "#3a7d44" }}>{s.cleared}</div>
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "1px" }}>Cleared</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: 500, color: s.notCleared > 0 ? "#c0392b" : "#111" }}>{s.notCleared}</div>
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "1px" }}>Not cleared</div>
                  </div>
                </div>
                <div style={{ padding: "10px 16px", background: scoreBg(score) }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ fontSize: "11px", color: scoreColor(score), fontWeight: 500 }}>
                      {score === 100 ? "All contractors cleared" : `${s.notCleared} contractor${s.notCleared > 1 ? "s" : ""} not cleared`}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: scoreColor(score) }}>{score}%</div>
                  </div>
                  <div style={{ height: "4px", background: "#e0e0e0", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${score}%`, background: scoreColor(score), borderRadius: "2px" }} />
                  </div>
                </div>
              </div>
            );
          })}

          <a href="/sites/new" style={{ border: "1px dashed #d0d0d0", borderRadius: "2px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px", minHeight: "160px", textDecoration: "none" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#fff", marginBottom: "8px" }}>+</div>
            <div style={{ fontSize: "12px", color: "#555" }}>Add a new site</div>
          </a>
        </div>

        {showArchived && archivedSites.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Archived sites</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {archivedSites.map((s) => (
                <div key={s.id} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", opacity: 0.6 }}>
                  <div style={{ padding: "16px", borderBottom: "1px solid #ebebeb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{s.name}</div>
                      <span style={{ fontSize: "11px", padding: "1px 6px", background: "#d1eaff", color: "#008cff", border: "1px solid #91bcf5", borderRadius: "2px" }}>Archived</span>
                    </div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "11px", color: "#555" }}>{s.total} contractors · records preserved</div>
                    <span style={{ fontSize: "11px", color: "#3a7d44", cursor: "pointer" }}>View records</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSite && data && site && (
          <div style={{ borderTop: "1px solid #d0d0d0", paddingTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{site.name}</div>
              <button
                onClick={() => setShowArchiveConfirm(true)}
                style={{ padding: "6px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", fontWeight: 500, borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
              >
                Archive site
              </button>
            </div>

            {data.notCleared.length > 0 ? (
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#b71c1c", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Not cleared — do not allow site access</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {data.notCleared.map((c) => (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", border: "1px solid #ef9a9a", borderRadius: "2px", background: "#fff" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#c0392b", flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{c.name}</div>
                          <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{c.trade}</div>
                          <div style={{ fontSize: "11px", color: "#c0392b", marginTop: "2px" }}>{c.reason}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <StatusBadge status={c.status} />
                        <a href="/contractor" style={{ fontSize: "11px", padding: "5px 10px", background: "#111", color: "#fff", borderRadius: "2px", textDecoration: "none", fontWeight: 500 }}>View</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: "12px 14px", background: "#f9fdf9", border: "1px solid #a5d6a7", borderRadius: "2px", marginBottom: "20px", fontSize: "12px", color: "#3a7d44", fontWeight: 500 }}>
                All contractors cleared — safe to proceed
              </div>
            )}

            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#3a7d44", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Cleared to work</div>
              {data.cleared.map((c, i) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < data.cleared.length - 1 ? "1px solid #ebebeb" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3a7d44", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{c.name}</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{c.trade} · next expiry {c.nextExpiry}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500 }}>Cleared</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}