"use client";
import StatusBadge from "../../components/StatusBadge";

const contractor = {
  name: "Rapid Demo Co",
  email: "tom@rapiddemo.com.au",
  invited: "10 March 2025",
  sites: 2,
  status: "non-compliant" as const,
  companyDocs: [
    { name: "Public liability insurance", expiry: "30 Nov 2025", status: "compliant" as const },
    { name: "Workers compensation", expiry: "30 Jun 2025", status: "compliant" as const },
    { name: "Trade licence", expiry: "15 Nov 2025", status: "compliant" as const },
  ],
  siteDocs: [
    {
      site: "Paddington Townhouses",
      cleared: true,
      docs: [
        { name: "SWMS", expiry: "No expiry", status: "compliant" as const },
        { name: "Site induction", expiry: "No expiry", status: "compliant" as const },
      ],
    },
    {
      site: "Newstead Commercial",
      cleared: false,
      docs: [
        { name: "SWMS", expiry: "Not submitted", status: "non-compliant" as const },
        { name: "Site induction", expiry: "Not submitted", status: "non-compliant" as const },
      ],
    },
  ],
  timeline: [
    { label: "Invite sent", detail: "10 Mar — upload link delivered", done: true },
    { label: "Reminder 1", detail: "12 Mar — documents still required", done: true },
    { label: "Reminder 2", detail: "15 Mar — SWMS and induction listed as missing", done: true },
    { label: "Final warning", detail: "17 Mar — marked non-compliant on Newstead", done: false },
  ],
};

export default function ContractorDetail() {
  return (
    <div>
      <div style={{ padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/" style={{ fontSize: "12px", color: "#888", cursor: "pointer" }}>← All contractors</a>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>{contractor.name}</span>
          <StatusBadge status={contractor.status} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ padding: "6px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Resend reminder</button>
          <button style={{ padding: "6px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#888", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Archive contractor</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ padding: "14px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "10px", color: "#999", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Contact</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{contractor.email}</div>
        </div>
        <div style={{ padding: "14px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "10px", color: "#999", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Invited</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{contractor.invited}</div>
        </div>
        <div style={{ padding: "14px 32px" }}>
          <div style={{ fontSize: "10px", color: "#999", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Active sites</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{contractor.sites} sites</div>
        </div>
      </div>

      <div style={{ padding: "16px 32px", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Company-level documents</div>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ width: "40%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Document</th>
              <th style={{ width: "30%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Expiry</th>
              <th style={{ width: "20%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Status</th>
              <th style={{ width: "10%", fontSize: "11px", fontWeight: 500, color: "#888", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}></th>
            </tr>
          </thead>
          <tbody>
            {contractor.companyDocs.map((doc) => (
              <tr key={doc.name} style={{ borderBottom: "1px solid #ebebeb" }}>
                <td style={{ padding: "10px 12px", fontSize: "13px" }}>{doc.name}</td>
                <td style={{ padding: "10px 12px", fontSize: "12px", color: "#888" }}>{doc.expiry}</td>
                <td style={{ padding: "10px 12px" }}><StatusBadge status={doc.status} /></td>
                <td style={{ padding: "10px 12px", fontSize: "11px", color: "#aaa", cursor: "pointer" }}>Override</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "16px 32px", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Per-site documents</div>
        {contractor.siteDocs.map((site) => (
          <div key={site.site} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500, color: "#111" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: site.cleared ? "#3a7d44" : "#c0392b", display: "inline-block" }} />
                {site.site}
              </div>
              <StatusBadge status={site.cleared ? "compliant" : "non-compliant"} />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <tbody>
                {site.docs.map((doc) => (
                  <tr key={doc.name} style={{ borderBottom: "1px solid #ebebeb" }}>
                    <td style={{ width: "40%", padding: "10px 14px", fontSize: "13px" }}>{doc.name}</td>
                    <td style={{ width: "30%", padding: "10px 14px", fontSize: "12px", color: doc.status === "non-compliant" ? "#b71c1c" : "#888" }}>{doc.expiry}</td>
                    <td style={{ width: "20%", padding: "10px 14px" }}><StatusBadge status={doc.status} /></td>
                    <td style={{ width: "10%", padding: "10px 14px" }}>
                      {doc.status === "non-compliant" && (
                        <button style={{ padding: "4px 10px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Request</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 32px" }}>
        <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px" }}>Autopilot reminder history</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "4px", top: "10px", bottom: "10px", width: "1px", background: "#ebebeb" }} />
          {contractor.timeline.map((t) => (
            <div key={t.label} style={{ display: "flex", gap: "12px", paddingBottom: "14px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: t.done ? "#3a7d44" : "#b8860b", marginTop: "4px", flexShrink: 0, zIndex: 1 }} />
              <div>
                <div style={{ fontSize: "13px", color: "#111" }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}