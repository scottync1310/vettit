"use client";
import { useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import ArchiveModal from "../../components/ArchiveModal";
import { isLicenceCovered, getCoveredLicences, progressiveMap } from "../../lib/licences";

const licences: Record<string, string[]> = {
  scaffolder: ["Dogging DG", "Basic Rigging RB", "Intermediate Rigging RI", "Advanced Rigging RA", "Basic Scaffolding SB", "Intermediate Scaffolding SI", "Advanced Scaffolding SA"],
  crane: ["Slewing Mobile Crane C2 (up to 20t)", "Slewing Mobile Crane C6 (up to 60t)", "Slewing Mobile Crane C1 (up to 100t)", "Slewing Mobile Crane C0 (open/over 100t)", "Non-Slewing Mobile Crane CN", "Tower Crane CT", "Vehicle Loading Crane CV", "Bridge and Gantry Crane CB"],
  forklift: ["Forklift Truck LF", "Order-Picking Forklift LO", "Reach Stacker RS", "Telehandler TV"],
  ewp: ["Boom-type EWP WP (11m+)", "Materials Hoist HM", "Personnel and Materials Hoist HP", "Concrete Placing Boom PB"],
  demolition: ["Demolition Licence", "Asbestos Removal Class A", "Asbestos Removal Class B"],
  heavyvehicle: ["Light Rigid LR", "Medium Rigid MR", "Heavy Rigid HR", "Heavy Combination HC", "Multi-Combination MC"],
};

const roleLabel: Record<string, string> = {
  labourer: "Labourer", plumber: "Plumber", electrician: "Electrician",
  scaffolder: "Scaffolder / Rigger", crane: "Crane Operator",
  forklift: "Forklift / Plant Operator", ewp: "EWP / Hoist Operator",
  demolition: "Demolition / Asbestos", heavyvehicle: "Heavy Vehicle Driver",
  supervisor: "Supervisor / Manager",
};

const teamMembers = ["Mila Hartley", "James Foreman", "Sarah Admin", "Chris Site Manager", "Unassigned"];

type Worker = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  citizen: boolean;
  heights: boolean;
  selectedLicences: string[];
  whiteCard: boolean;
  isContact?: boolean;
};

type Subcontractor = {
  id: number;
  name: string;
  trade: string;
  contact: string;
  email: string;
  status: "pending" | "compliant" | "non-compliant";
};

const initialWorkers: Worker[] = [
  { id: 1, firstName: "Tom", lastName: "Richards", role: "supervisor", citizen: true, heights: false, selectedLicences: [], whiteCard: true, isContact: true },
  { id: 2, firstName: "James", lastName: "Hartley", role: "demolition", citizen: true, heights: true, selectedLicences: ["Demolition Licence"], whiteCard: true },
  { id: 3, firstName: "Miguel", lastName: "Santos", role: "crane", citizen: false, heights: false, selectedLicences: ["Slewing Mobile Crane C0 (open/over 100t)"], whiteCard: true },
];

const initialSubcontractors: Subcontractor[] = [
  { id: 1, name: "QLD Pipe Specialists", trade: "Plumbing", contact: "Steve Moore", email: "steve@qldpipe.com.au", status: "pending" },
];

const contractor = {
  name: "Rapid Demo Co",
  trade: "Demolition",
  email: "tom@rapiddemo.com.au",
  contactName: "Tom Richards",
  invited: "10 March 2025",
  sites: ["Paddington Townhouses", "Newstead Commercial"],
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
    { label: "Invite sent", detail: "10 Mar — upload link delivered to Tom Richards", done: true },
    { label: "Reminder 1", detail: "12 Mar — documents still required", done: true },
    { label: "Reminder 2", detail: "15 Mar — SWMS and induction listed as missing", done: true },
    { label: "Final warning", detail: "17 Mar — marked non-compliant on Newstead", done: false },
  ],
};

const emptyWorker = {
  firstName: "", lastName: "", role: "", citizen: true,
  heights: false, selectedLicences: [] as string[], whiteCard: false,
};

export default function ContractorDetail() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(initialSubcontractors);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);
  const [newWorker, setNewWorker] = useState(emptyWorker);
  const [newSub, setNewSub] = useState({ name: "", trade: "", contact: "", email: "" });
  const [assignedTo, setAssignedTo] = useState("Mila Hartley");
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archived, setArchived] = useState(false);
  const [archivedSites, setArchivedSites] = useState<string[]>([]);

  const toggleLicence = (lic: string) => {
    setNewWorker((prev) => ({
      ...prev,
      selectedLicences: prev.selectedLicences.includes(lic)
        ? prev.selectedLicences.filter((l) => l !== lic)
        : [...prev.selectedLicences, lic],
    }));
  };

  const addWorker = () => {
    if (!newWorker.firstName || !newWorker.role) return;
    setWorkers((prev) => [...prev, { ...newWorker, id: Date.now() }]);
    setNewWorker(emptyWorker);
    setShowAddWorker(false);
  };

  const addSubcontractor = () => {
    if (!newSub.name || !newSub.email) return;
    setSubcontractors((prev) => [...prev, { ...newSub, id: Date.now(), status: "pending" }]);
    setNewSub({ name: "", trade: "", contact: "", email: "" });
    setShowAddSub(false);
  };

  const handleArchive = (selectedSites: string[]) => {
    setArchivedSites(selectedSites);
    setArchived(true);
    setShowArchiveModal(false);
  };

  const workerCleared = (w: Worker) => w.whiteCard && w.citizen;
  const activeSites = contractor.sites.filter((s) => !archivedSites.includes(s));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0",
    fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif",
  };

  const sectionHead = (text: string, sub?: string) => (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase" as const, letterSpacing: ".08em" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  const WorkerLicenceRows = ({ w }: { w: Worker }) => {
    const covered = getCoveredLicences(w.selectedLicences);
    const allRows = [
      ...w.selectedLicences.map((lic) => ({ lic, type: "held" as const })),
      ...covered.map((lic) => ({ lic, type: "covered" as const })),
    ];
    return (
      <>
        {allRows.map((row, i) => {
          const coveredBy = row.type === "covered"
            ? w.selectedLicences.find((h) => (progressiveMap[h] || []).includes(row.lic))
            : null;
          return (
            <div key={row.lic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < allRows.length - 1 ? "1px solid #ebebeb" : "none", background: row.type === "covered" ? "#f9fdf9" : "transparent" }}>
              <div style={{ fontSize: "12px", color: row.type === "covered" ? "#3a7d44" : "#555" }}>{row.lic}</div>
              {row.type === "covered" ? (
                <span style={{ fontSize: "12px", padding: "1px 6px", background: "#e8f5e9", color: "#3a7d44", border: "1px solid #a5d6a7", borderRadius: "2px", flexShrink: 0, marginLeft: "8px" }}>
                  Covered by {coveredBy?.split(" ").slice(-1)[0]}
                </span>
              ) : (
                <div style={{ fontSize: "12px", color: "#3a7d44", fontWeight: 500 }}>Verified</div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  if (archived && activeSites.length === 0) {
    return (
      <div style={{ maxWidth: "480px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f5f5f5", border: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "20px", color: "#333" }}>✓</div>
        <div style={{ fontSize: "15px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Rapid Demo Co archived</div>
        <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.7, marginBottom: "24px" }}>
          Removed from all active sites. All compliance records and documents are preserved for audit purposes.
        </div>
        <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "12px 16px", marginBottom: "24px", textAlign: "left" }}>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "8px" }}>Archived from</div>
          {archivedSites.map((s) => (
            <div key={s} style={{ fontSize: "12px", color: "#555", padding: "4px 0", borderBottom: "1px solid #f5f5f5" }}>✓ {s}</div>
          ))}
        </div>
        <a href="/" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
          Back to dashboard
        </a>
      </div>
    );
  }

  return (
    <div>
      {showArchiveModal && (
        <ArchiveModal
          contractorName={contractor.name}
          sites={activeSites}
          onConfirm={handleArchive}
          onClose={() => setShowArchiveModal(false)}
        />
      )}

      {archived && archivedSites.length > 0 && activeSites.length > 0 && (
        <div style={{ padding: "10px 32px", background: "#f5f5f5", borderBottom: "1px solid #d0d0d0", fontSize: "12px", color: "#555" }}>
          Archived from: {archivedSites.join(", ")} · Still active on: {activeSites.join(", ")}
        </div>
      )}

      <div style={{ padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/" style={{ fontSize: "12px", color: "#333", textDecoration: "none" }}>← All contractors</a>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>{contractor.name}</span>
          <span style={{ fontSize: "11px", padding: "1px 6px", border: "1px solid #d0d0d0", borderRadius: "2px", color: "#555" }}>{contractor.trade}</span>
          <StatusBadge status={contractor.status} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ padding: "6px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Resend reminder</button>
          <button onClick={() => setShowArchiveModal(true)} style={{ padding: "6px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#333", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>
            Archive contractor
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ padding: "14px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Contact</div>
          <div style={{ fontSize: "13px", color: "#111", fontWeight: 500 }}>{contractor.contactName}</div>
          <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>{contractor.email}</div>
        </div>
        <div style={{ padding: "14px 20px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Invited</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{contractor.invited}</div>
        </div>
        <div style={{ padding: "14px 20px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Active sites</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{activeSites.length} sites</div>
        </div>
        <div style={{ padding: "14px 20px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Workers on site</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{workers.length} workers</div>
        </div>
        <div style={{ padding: "14px 20px", position: "relative" }}>
          <div style={{ fontSize: "12px", color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "3px" }}>Assigned to</div>
          <div onClick={() => setShowAssignDropdown(!showAssignDropdown)} style={{ fontSize: "13px", color: "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 500, flexShrink: 0 }}>
              {assignedTo.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            {assignedTo}
            <span style={{ fontSize: "12px", color: "#444" }}>▼</span>
          </div>
          {showAssignDropdown && (
            <div style={{ position: "absolute", top: "100%", left: "20px", background: "#fff", border: "1px solid #d0d0d0", borderRadius: "2px", zIndex: 10, minWidth: "180px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              {teamMembers.map((member) => (
                <div key={member} onClick={() => { setAssignedTo(member); setShowAssignDropdown(false); }} style={{ padding: "9px 14px", fontSize: "13px", color: member === assignedTo ? "#111" : "#555", fontWeight: member === assignedTo ? 500 : 400, cursor: "pointer", background: member === assignedTo ? "#f5f5f5" : "#fff", borderBottom: "1px solid #f0f0f0" }}>
                  {member}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {contractor.status === "non-compliant" && (
        <div style={{ padding: "10px 32px", background: "#fff8f8", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "12px", color: "#b71c1c" }}>
            Autopilot has failed — contractor unresponsive after 3 reminders. <strong>{assignedTo}</strong> is responsible for follow-up.
          </div>
          <button style={{ padding: "5px 12px", border: "1px solid #b71c1c", background: "#fff", color: "#b71c1c", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Send manual reminder</button>
        </div>
      )}

      <div style={{ padding: "16px 32px", borderBottom: "1px solid #d0d0d0" }}>
        {sectionHead("Company documents", "Verified once — applies across all sites")}
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ width: "38%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Document</th>
              <th style={{ width: "22%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Expiry</th>
              <th style={{ width: "18%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Status</th>
              <th style={{ width: "22%", fontSize: "11px", fontWeight: 500, color: "#333", textAlign: "left", padding: "8px 12px", borderBottom: "1px solid #d0d0d0" }}>Ownership</th>
            </tr>
          </thead>
          <tbody>
            {contractor.companyDocs.map((doc) => (
              <tr key={doc.name} style={{ borderBottom: "1px solid #ebebeb" }}>
                <td style={{ padding: "10px 12px", fontSize: "13px" }}>{doc.name}</td>
                <td style={{ padding: "10px 12px", fontSize: "12px", color: "#333" }}>{doc.expiry}</td>
                <td style={{ padding: "10px 12px" }}><StatusBadge status={doc.status} /></td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 500 }}>
                      {assignedTo.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span style={{ fontSize: "11px", color: "#555" }}>{assignedTo}</span>
                    <span style={{ fontSize: "11px", color: "#444", cursor: "pointer" }}>Override</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "16px 32px", borderBottom: "1px solid #d0d0d0" }}>
        {sectionHead("Site documents", "Required per site — per engagement")}
        {contractor.siteDocs.map((site) => (
          <div key={site.site} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "10px", opacity: archivedSites.includes(site.site) ? 0.4 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500, color: "#111" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: site.cleared ? "#3a7d44" : "#c0392b", display: "inline-block" }} />
                {site.site}
                {archivedSites.includes(site.site) && <span style={{ fontSize: "12px", padding: "1px 6px", background: "#f5f5f5", color: "#333", border: "1px solid #ddd", borderRadius: "2px" }}>Archived</span>}
              </div>
              <StatusBadge status={site.cleared ? "compliant" : "non-compliant"} />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <tbody>
                {site.docs.map((doc) => (
                  <tr key={doc.name} style={{ borderBottom: "1px solid #ebebeb" }}>
                    <td style={{ width: "38%", padding: "10px 14px", fontSize: "13px" }}>{doc.name}</td>
                    <td style={{ width: "22%", padding: "10px 14px", fontSize: "12px", color: doc.status === "non-compliant" ? "#b71c1c" : "#888" }}>{doc.expiry}</td>
                    <td style={{ width: "18%", padding: "10px 14px" }}><StatusBadge status={doc.status} /></td>
                    <td style={{ width: "22%", padding: "10px 14px" }}>
                      {doc.status === "non-compliant" && !archivedSites.includes(site.site) && (
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

      <div style={{ padding: "16px 32px", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          {sectionHead("Workers on site", "Individual tickets per person")}
          <button onClick={() => setShowAddWorker(!showAddWorker)} style={{ padding: "5px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif", marginTop: "-10px" }}>
            + Add worker
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {workers.map((w) => (
            <div key={w.id} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: workerCleared(w) ? "#3a7d44" : "#c0392b" }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{w.firstName} {w.lastName}</div>
                      {w.isContact && <span style={{ fontSize: "12px", padding: "1px 6px", background: "#f0f0f0", border: "1px solid #d0d0d0", borderRadius: "2px", color: "#555" }}>Company contact</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>{roleLabel[w.role]} · {w.citizen ? "Australian citizen" : "Non-citizen — right to work required"}</div>
                  </div>
                </div>
                <StatusBadge status={workerCleared(w) ? "compliant" : "non-compliant"} />
              </div>
              <div style={{ padding: "0 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #ebebeb" }}>
                  <div style={{ fontSize: "12px", color: "#555" }}>White Card</div>
                  <div style={{ fontSize: "12px", color: w.whiteCard ? "#3a7d44" : "#c0392b", fontWeight: 500 }}>{w.whiteCard ? "Verified" : "Missing"}</div>
                </div>
                {!w.citizen && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #ebebeb" }}>
                    <div style={{ fontSize: "12px", color: "#555" }}>Proof of right to work</div>
                    <div style={{ fontSize: "12px", color: "#c0392b", fontWeight: 500 }}>Required</div>
                  </div>
                )}
                {w.heights && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #ebebeb" }}>
                    <div style={{ fontSize: "12px", color: "#555" }}>Working at Heights</div>
                    <div style={{ fontSize: "12px", color: "#3a7d44", fontWeight: 500 }}>Verified</div>
                  </div>
                )}
                <WorkerLicenceRows w={w} />
              </div>
            </div>
          ))}
        </div>
        {showAddWorker && (
          <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginTop: "12px" }}>
            <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>Add a worker</div>
              <span style={{ fontSize: "18px", color: "#444", cursor: "pointer", lineHeight: 1 }} onClick={() => setShowAddWorker(false)}>×</span>
            </div>
            <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>First name</div>
                  <input value={newWorker.firstName} onChange={(e) => setNewWorker({ ...newWorker, firstName: e.target.value })} placeholder="Dave" style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Last name</div>
                  <input value={newWorker.lastName} onChange={(e) => setNewWorker({ ...newWorker, lastName: e.target.value })} placeholder="Smith" style={inputStyle} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Role on site</div>
                <select value={newWorker.role} onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value, selectedLicences: [] })} style={inputStyle}>
                  <option value="">Select role...</option>
                  <option value="labourer">Labourer</option>
                  <option value="plumber">Plumber</option>
                  <option value="electrician">Electrician</option>
                  <option value="scaffolder">Scaffolder / Rigger</option>
                  <option value="crane">Crane Operator</option>
                  <option value="forklift">Forklift / Plant Operator</option>
                  <option value="ewp">EWP / Hoist Operator</option>
                  <option value="demolition">Demolition / Asbestos</option>
                  <option value="heavyvehicle">Heavy Vehicle Driver</option>
                  <option value="supervisor">Supervisor / Manager</option>
                </select>
              </div>
              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #ebebeb", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#111" }}>White Card</div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>Construction Induction Training — mandatory</div>
                  </div>
                  <input type="checkbox" checked={newWorker.whiteCard} onChange={(e) => setNewWorker({ ...newWorker, whiteCard: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                </label>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #ebebeb", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#111" }}>Australian citizen or permanent resident</div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>If no, proof of right to work required</div>
                  </div>
                  <input type="checkbox" checked={newWorker.citizen} onChange={(e) => setNewWorker({ ...newWorker, citizen: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                </label>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#111" }}>Working at heights on this site</div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>Requires Working at Heights certification</div>
                  </div>
                  <input type="checkbox" checked={newWorker.heights} onChange={(e) => setNewWorker({ ...newWorker, heights: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                </label>
              </div>
              {licences[newWorker.role] && (
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "6px" }}>Licences held</div>
                  <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                    {licences[newWorker.role].map((lic, i) => {
                      const coveredBy = isLicenceCovered(lic, newWorker.selectedLicences);
                      const isSelected = newWorker.selectedLicences.includes(lic);
                      return (
                        <div key={lic} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: i < licences[newWorker.role].length - 1 ? "1px solid #f0f0f0" : "none", background: coveredBy ? "#f9fdf9" : "#fff" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: coveredBy ? "default" : "pointer", flex: 1, fontSize: "12px", color: coveredBy ? "#3a7d44" : "#111" }}>
                            <input type="checkbox" checked={isSelected || !!coveredBy} disabled={!!coveredBy} onChange={() => !coveredBy && toggleLicence(lic)} style={{ accentColor: "#3a7d44", width: "13px", height: "13px" }} />
                            {lic}
                          </label>
                          {coveredBy && (
                            <span style={{ fontSize: "12px", padding: "1px 6px", background: "#e8f5e9", color: "#3a7d44", border: "1px solid #a5d6a7", borderRadius: "2px", flexShrink: 0, marginLeft: "8px" }}>
                              Covered by {coveredBy.split(" ").slice(-1)[0]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowAddWorker(false)} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Cancel</button>
                <button onClick={addWorker} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Add worker</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 32px", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          {sectionHead("Subcontractors", "Brought on site by this contractor")}
          <button onClick={() => setShowAddSub(!showAddSub)} style={{ padding: "5px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif", marginTop: "-10px" }}>
            + Add subcontractor
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {subcontractors.map((sub) => (
            <div key={sub.id} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: sub.status === "compliant" ? "#3a7d44" : "#aaa" }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{sub.name}</div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>{sub.trade} · {sub.contact}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 8px", background: sub.status === "pending" ? "#f5f5f5" : "#e8f5e9", color: sub.status === "pending" ? "#555" : "#1b5e20", border: `1px solid ${sub.status === "pending" ? "#ddd" : "#a5d6a7"}`, borderRadius: "2px", fontWeight: 500 }}>
                    {sub.status === "pending" ? "Invite sent" : "Compliant"}
                  </span>
                  <button style={{ padding: "4px 10px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>View</button>
                </div>
              </div>
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontSize: "12px", color: "#333" }}>
                  {sub.status === "pending" ? `Invite sent to ${sub.email} — awaiting submission` : "All documents submitted and verified"}
                </div>
                {sub.status === "pending" && (
                  <button style={{ marginTop: "8px", padding: "4px 10px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Resend invite</button>
                )}
              </div>
            </div>
          ))}
        </div>
        {showAddSub && (
          <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginTop: "12px" }}>
            <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>Add a subcontractor</div>
              <span style={{ fontSize: "18px", color: "#444", cursor: "pointer", lineHeight: 1 }} onClick={() => setShowAddSub(false)}>×</span>
            </div>
            <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "12px", color: "#333" }}>Vettit will send this subcontractor their own invite to submit company docs and worker tickets separately.</div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Company name</div>
                <input value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} placeholder="e.g. QLD Pipe Specialists" style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Trade</div>
                <input value={newSub.trade} onChange={(e) => setNewSub({ ...newSub, trade: e.target.value })} placeholder="e.g. Plumbing" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Contact name</div>
                  <input value={newSub.contact} onChange={(e) => setNewSub({ ...newSub, contact: e.target.value })} placeholder="Steve Moore" style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Contact email</div>
                  <input value={newSub.email} onChange={(e) => setNewSub({ ...newSub, email: e.target.value })} placeholder="steve@sub.com.au" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowAddSub(false)} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Cancel</button>
                <button onClick={addSubcontractor} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Send invite</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 32px", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          {sectionHead("Private notes", "Only visible to your team — not shared with the contractor")}
          <button onClick={() => setShowNotes(!showNotes)} style={{ padding: "5px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif", marginTop: "-10px" }}>
            {showNotes ? "Done" : notes ? "Edit note" : "+ Add note"}
          </button>
        </div>
        {showNotes ? (
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Reliable contractor — always submits on time." style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif", minHeight: "80px", resize: "vertical" }} />
        ) : notes ? (
          <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, padding: "10px 12px", background: "#fafafa", border: "1px solid #ebebeb", borderRadius: "2px" }}>{notes}</div>
        ) : (
          <div style={{ fontSize: "12px", color: "#444" }}>No notes yet.</div>
        )}
      </div>

      <div style={{ padding: "16px 32px" }}>
        {sectionHead("Autopilot reminder history")}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "4px", top: "10px", bottom: "10px", width: "1px", background: "#ebebeb" }} />
          {contractor.timeline.map((t) => (
            <div key={t.label} style={{ display: "flex", gap: "12px", paddingBottom: "14px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: t.done ? "#3a7d44" : "#b8860b", marginTop: "4px", flexShrink: 0, zIndex: 1 }} />
              <div>
                <div style={{ fontSize: "13px", color: "#111" }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
