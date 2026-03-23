import StatusBadge from "../../components/StatusBadge";

const urgent = [
  { name: "XYZ Electrical", issue: "Public liability expires in 5 days", status: "expiring" as const },
  { name: "Rapid Demo Co", issue: "SWMS missing — Newstead Commercial", status: "non-compliant" as const },
];

const unresponsive = [
  { name: "North Build Co", issue: "Bulimba Apartments — manual follow-up needed", status: "unresponsive" as const },
];

export default function Digest() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Roboto, sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto", border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", background: "#fff" }}>

        <div style={{ background: "#111", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "16px", fontWeight: 500, color: "#fff", letterSpacing: "-0.3px" }}>
            vett<span style={{ color: "#3a7d44" }}>it</span>
          </span>
          <span style={{ fontSize: "11px", color: "#888" }}>Monday 23 March 2025</span>
        </div>

        <div style={{ padding: "20px 24px", borderBottom: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#111", marginBottom: "3px" }}>Good morning, Mila.</div>
          <div style={{ fontSize: "12px", color: "#888" }}>2 items need your attention today. Everything else is compliant.</div>
        </div>

        <div style={{ padding: "16px 24px", borderBottom: "1px solid #d0d0d0", background: "#fff8f8" }}>
          <div style={{ fontSize: "10px", fontWeight: 500, color: "#b71c1c", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Action required</div>
          {urgent.map((c, i) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < urgent.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{c.name}</div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{c.issue}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 24px", borderBottom: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>No response after 3 reminders</div>
          {unresponsive.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#111" }}>{c.name}</div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{c.issue}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>

        <div style={{ padding: "16px 24px", borderBottom: "1px solid #d0d0d0", background: "#f9fdf9" }}>
          <div style={{ fontSize: "12px", color: "#3a7d44" }}>
            <span style={{ fontWeight: 500 }}>9 contractors</span> are fully compliant across all sites — no action needed.
          </div>
        </div>

        <div style={{ padding: "20px 24px", textAlign: "center" }}>
          <a href="/" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
            Open Vettit dashboard →
          </a>
          <div style={{ fontSize: "11px", color: "#bbb", marginTop: "12px" }}>
            Vettit · <span style={{ cursor: "pointer", textDecoration: "underline" }}>Unsubscribe from daily digest</span>
          </div>
        </div>

      </div>
    </div>
  );
}