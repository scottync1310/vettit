import StatusBadge from "../../components/StatusBadge";

const expiringDocs = [
  {
    contractor: "XYZ Electrical",
    trade: "Electrical",
    docType: "Public liability insurance",
    level: "Company",
    site: null,
    worker: null,
    expiry: "28 Mar 2025",
    daysLeft: 5,
  },
  {
    contractor: "SEQ Concreting",
    trade: "Concreting",
    docType: "Workers compensation",
    level: "Company",
    site: null,
    worker: null,
    expiry: "30 Mar 2025",
    daysLeft: 7,
  },
  {
    contractor: "ABC Plumbing",
    trade: "Plumbing",
    docType: "Trade licence",
    level: "Company",
    site: null,
    worker: null,
    expiry: "5 Apr 2025",
    daysLeft: 13,
  },
  {
    contractor: "Rapid Demo Co",
    trade: "Demolition",
    docType: "Working at Heights certification",
    level: "Worker",
    site: "Paddington Townhouses",
    worker: "James Hartley",
    expiry: "8 Apr 2025",
    daysLeft: 16,
  },
  {
    contractor: "Brisbane Frames",
    trade: "Framing",
    docType: "Public liability insurance",
    level: "Company",
    site: null,
    worker: null,
    expiry: "12 Apr 2025",
    daysLeft: 20,
  },
  {
    contractor: "ABC Plumbing",
    trade: "Plumbing",
    docType: "SWMS",
    level: "Site",
    site: "Bulimba Apartments",
    worker: null,
    expiry: "14 Apr 2025",
    daysLeft: 22,
  },
  {
    contractor: "North Build Co",
    trade: "Labourer",
    docType: "Workers compensation",
    level: "Company",
    site: null,
    worker: null,
    expiry: "18 Apr 2025",
    daysLeft: 26,
  },
  {
    contractor: "SEQ Concreting",
    trade: "Concreting",
    docType: "Dogging DG licence",
    level: "Worker",
    site: "Paddington Townhouses",
    worker: "Paul Brown",
    expiry: "20 Apr 2025",
    daysLeft: 28,
  },
];

const thisWeek = expiringDocs.filter((d) => d.daysLeft <= 7);
const twoWeeks = expiringDocs.filter((d) => d.daysLeft > 7 && d.daysLeft <= 14);
const threeToFour = expiringDocs.filter((d) => d.daysLeft > 14 && d.daysLeft <= 30);

const levelTag = (level: string, site: string | null, worker: string | null) => {
  if (level === "Company") return <span style={{ fontSize: "10px", padding: "2px 6px", background: "#f5f5f5", color: "#555", border: "1px solid #ddd", borderRadius: "2px" }}>Company</span>;
  if (level === "Site") return <span style={{ fontSize: "10px", padding: "2px 6px", background: "#E6F1FB", color: "#0C447C", border: "1px solid #85B7EB", borderRadius: "2px" }}>{site}</span>;
  if (level === "Worker") return <span style={{ fontSize: "10px", padding: "2px 6px", background: "#EEEDFE", color: "#3C3489", border: "1px solid #AFA9EC", borderRadius: "2px" }}>{worker}</span>;
};

const DocRow = ({ doc }: { doc: typeof expiringDocs[0] }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f0f0f0" }}>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{doc.contractor}</span>
        {levelTag(doc.level, doc.site, doc.worker)}
      </div>
      <div style={{ fontSize: "11px", color: "#888" }}>{doc.docType}</div>
    </div>
    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
      <div style={{ fontSize: "12px", fontWeight: 500, color: doc.daysLeft <= 7 ? "#c0392b" : doc.daysLeft <= 14 ? "#b8860b" : "#555" }}>{doc.daysLeft} days</div>
      <div style={{ fontSize: "11px", color: "#aaa", marginTop: "1px" }}>{doc.expiry}</div>
    </div>
  </div>
);

const Section = ({ title, color, docs }: { title: string; color: string; docs: typeof expiringDocs }) => {
  if (docs.length === 0) return null;
  return (
    <div style={{ padding: "14px 24px", borderBottom: "1px solid #ebebeb" }}>
      <div style={{ fontSize: "10px", fontWeight: 500, color, textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: "10px" }}>{title}</div>
      {docs.map((doc, i) => (
        <div key={i} style={{ borderBottom: i < docs.length - 1 ? "1px solid #f5f5f5" : "none" }}>
          <DocRow doc={doc} />
        </div>
      ))}
    </div>
  );
};

export default function Digest() {
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Roboto, sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", background: "#fff" }}>

        <div style={{ background: "#111", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "16px", fontWeight: 500, color: "#fff", letterSpacing: "-.3px" }}>
            vett<span style={{ color: "#3a7d44" }}>it</span>
          </span>
          <span style={{ fontSize: "11px", color: "#888" }}>Weekly expiry report — Mon 24 Mar 2025</span>
        </div>

        <div style={{ padding: "20px 24px", borderBottom: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#111", marginBottom: "3px" }}>Good morning, Mila.</div>
          <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.6 }}>
            Here are the documents expiring in the next 30 days across all your contractors and sites.
            {thisWeek.length > 0 && <span style={{ color: "#c0392b", fontWeight: 500 }}> {thisWeek.length} expire this week — action needed.</span>}
          </div>
        </div>

        <div style={{ padding: "10px 24px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 500, color: "#c0392b" }}>{thisWeek.length}</div>
            <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>This week</div>
          </div>
          <div style={{ textAlign: "center", borderLeft: "1px solid #ebebeb", borderRight: "1px solid #ebebeb" }}>
            <div style={{ fontSize: "20px", fontWeight: 500, color: "#b8860b" }}>{twoWeeks.length}</div>
            <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>Within 2 weeks</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 500, color: "#555" }}>{threeToFour.length}</div>
            <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>Within 30 days</div>
          </div>
        </div>

        <Section title="Expiring this week — action needed" color="#b71c1c" docs={thisWeek} />
        <Section title="Expiring within 2 weeks" color="#854F0B" docs={twoWeeks} />
        <Section title="Expiring within 30 days" color="#555" docs={threeToFour} />

        <div style={{ padding: "16px 24px", borderBottom: "1px solid #d0d0d0", background: "#f9fdf9" }}>
          <div style={{ fontSize: "12px", color: "#3a7d44" }}>
            Vettit has already sent renewal reminders to all affected contractors. No action needed unless a contractor remains unresponsive.
          </div>
        </div>

        <div style={{ padding: "20px 24px", textAlign: "center" }}>
          <a href="/" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
            Open Vettit dashboard →
          </a>
          <div style={{ fontSize: "11px", color: "#bbb", marginTop: "12px" }}>
            Vettit · Weekly expiry report · <span style={{ textDecoration: "underline", cursor: "pointer" }}>Unsubscribe</span>
          </div>
        </div>

      </div>
    </div>
  );
}