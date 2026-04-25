type Status = "compliant" | "expiring" | "non-compliant" | "unresponsive";

const config: Record<Status, { label: string; color: string; bg: string; border: string; dot: string }> = {
  compliant: { label: "Compliant", color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", dot: "#3a7d44" },
  expiring: { label: "Expiring soon", color: "#7c4e00", bg: "#fff8e1", border: "#ffe082", dot: "#b8860b" },
  "non-compliant": { label: "Non-compliant", color: "#b71c1c", bg: "#ffebee", border: "#ef9a9a", dot: "#c0392b" },
  unresponsive: { label: "Unresponsive", color: "#6a0dad", bg: "#f6e8ff", border: "#ce93d8", dot: "#9c27b0" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const c = config[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "2px", background: c.bg, color: c.color, border: `1px solid ${c.border}`, whiteSpace: "nowrap" }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.dot, display: "inline-block", flexShrink: 0 }} />
      {c.label}
    </span>
  );
}