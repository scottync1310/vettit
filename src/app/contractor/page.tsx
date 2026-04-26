"use client";
import { useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import ArchiveModal from "../../components/ArchiveModal";
import { isLicenceCovered, getCoveredLicences, progressiveMap } from "../../lib/licences";

export const dynamic = "force-dynamic";

const licenceOptions: Record<string, string[]> = {
  plumber: ["Plumbing Licence — Unrestricted", "Plumbing Licence — Restricted", "Drainage Licence", "Gas Fitting Licence", "Irrigation Licence"],
  electrician: ["Electrical Contractor Licence", "Electrical Worker Licence — Grade A (Unrestricted)", "Electrical Worker Licence — Grade B (Restricted)", "Electrical Worker Licence — Provisional"],
  scaffolder: ["Dogging DG", "Basic Rigging RB", "Intermediate Rigging RI", "Advanced Rigging RA", "Basic Scaffolding SB", "Intermediate Scaffolding SI", "Advanced Scaffolding SA"],
  crane: ["Slewing Mobile Crane C2 (up to 20t)", "Slewing Mobile Crane C6 (up to 60t)", "Slewing Mobile Crane C1 (up to 100t)", "Slewing Mobile Crane C0 (open/over 100t)", "Non-Slewing Mobile Crane CN", "Tower Crane CT", "Self-Erecting Tower Crane CS", "Vehicle Loading Crane CV", "Bridge and Gantry Crane CB"],
  forklift: ["Forklift Truck LF", "Order-Picking Forklift LO", "Reach Stacker RS", "Telehandler TV"],
  ewp: ["Boom-type EWP WP (11m+)", "Materials Hoist HM", "Personnel and Materials Hoist HP", "Concrete Placing Boom PB"],
  demolition: ["Demolition Licence", "Asbestos Removal Class A (friable)", "Asbestos Removal Class B (non-friable)"],
  heavyvehicle: ["Light Rigid LR", "Medium Rigid MR", "Heavy Rigid HR", "Heavy Combination HC", "Multi-Combination MC"],
  hvac: ["Refrigeration and Air Conditioning Licence", "Gas Fitting Licence", "Electrical Worker Licence (Restricted — A/C)"],
  gasfitter: ["Gas Fitting Licence — Type A", "Gas Fitting Licence — Type B", "Gas Fitting Licence — LP Gas"],
  painting: ["Contractor Licence — Painting", "Lead Paint Removal Certification"],
  tiling: ["Contractor Licence — Tiling"],
  concreting: ["Contractor Licence — Concreting"],
  bricklayer: ["Contractor Licence — Bricklaying"],
  cabinetmaker: ["Contractor Licence — Joinery and Cabinetmaking"],
  carpenter: ["Contractor Licence — Carpentry"],
  ceilingfixer: ["Contractor Licence — Plastering"],
  damproofer: ["Contractor Licence — Waterproofing"],
  elevatorinstaller: ["Contractor Licence — Mechanical Services (Lifts)"],
  excavator: ["High Risk Work Licence — Excavator EW (wheeled)", "High Risk Work Licence — Excavator ET (tracked)"],
  facadeengineer: ["Engineering Registration — Structural/Façade"],
  fencer: ["Contractor Licence — Fencing"],
  fireprotection: ["Contractor Licence — Fire Protection"],
  floorlayer: ["Contractor Licence — Floor Covering"],
  glazier: ["Contractor Licence — Glazing"],
  joiner: ["Contractor Licence — Joinery"],
  landscaper: ["Contractor Licence — Landscaping"],
  locksmith: ["Security Licence — Locksmith"],
  plasterer: ["Contractor Licence — Plastering"],
  refrigeration: ["Contractor Licence — Refrigeration and Air Conditioning"],
  renderer: ["Contractor Licence — Rendering"],
  rigger: ["High Risk Work Licence — Dogging DG", "High Risk Work Licence — Basic Rigging RB", "High Risk Work Licence — Intermediate Rigging RI", "High Risk Work Licence — Advanced Rigging RA"],
  roofer: ["Contractor Licence — Roofing"],
  stonemason: ["Contractor Licence — Stonemasonry"],
  swimmingpool: ["Contractor Licence — Swimming Pool and Spa"],
  waterproofer: ["Contractor Licence — Waterproofing"],
};

const roleLabel: Record<string, string> = {
  supervisor: "Supervisor / Manager",
  boilermaker: "Boilermaker",
  bricklayer: "Bricklayer",
  cabinetmaker: "Cabinetmaker",
  carpenter: "Carpenter",
  carpetlayer: "Carpet Layer",
  ceilingfixer: "Ceiling Fixer",
  concreting: "Concreter",
  crane: "Crane Operator",
  damproofer: "Damp Proofer",
  demolition: "Demolition / Asbestos",
  electrician: "Electrician",
  elevatorinstaller: "Elevator Installer",
  excavator: "Excavator Operator",
  ewp: "EWP / Hoist Operator",
  facadeengineer: "Façade Engineer",
  fencer: "Fencer",
  fireprotection: "Fire Protection",
  floorlayer: "Floor Layer",
  forklift: "Forklift / Plant Operator",
  formworker: "Formworker",
  gasfitter: "Gas Fitter",
  glazier: "Glazier",
  heavyvehicle: "Heavy Vehicle Driver",
  hvac: "HVAC Technician",
  insulation: "Insulation Installer",
  joiner: "Joiner",
  labourer: "Labourer",
  landscaper: "Landscaper",
  locksmith: "Locksmith",
  painting: "Painter and Decorator",
  plasterer: "Plasterer",
  plumber: "Plumber",
  refrigeration: "Refrigeration Mechanic",
  renderer: "Renderer",
  rigger: "Rigger",
  roofer: "Roofer",
  scaffolder: "Scaffolder",
  signwriter: "Signwriter",
  stonemason: "Stonemason",
  structural: "Structural Steel",
  swimmingpool: "Swimming Pool Builder",
  tiling: "Tiler",
  waterproofer: "Waterproofer",
  welder: "Welder",
};

const tradeConditionalDocs: Record<string, string[]> = {
  bricklayer: ["Contractor Licence — Bricklaying"],
  cabinetmaker: ["Contractor Licence — Joinery and Cabinetmaking"],
  carpenter: ["Contractor Licence — Carpentry"],
  ceilingfixer: ["Contractor Licence — Plastering"],
  concreting: ["Contractor Licence — Concreting"],
  crane: ["High Risk Work Licence — Crane Operation"],
  damproofer: ["Contractor Licence — Waterproofing"],
  demolition: ["Contractor Licence — Demolition", "Asbestos Removal Licence — Class A (friable)", "Asbestos Removal Licence — Class B (non-friable)"],
  electrician: ["Contractor Licence — Electrical"],
  elevatorinstaller: ["Contractor Licence — Mechanical Services (Lifts)"],
  excavator: ["High Risk Work Licence — Excavator"],
  facadeengineer: ["Engineering Registration — Structural/Façade"],
  fencer: ["Contractor Licence — Fencing"],
  fireprotection: ["Contractor Licence — Fire Protection"],
  floorlayer: ["Contractor Licence — Floor Covering"],
  gasfitter: ["Contractor Licence — Gas Fitting"],
  glazier: ["Contractor Licence — Glazing"],
  heavyvehicle: ["Driver Licence — Heavy Vehicle"],
  hvac: ["Contractor Licence — Refrigeration and Air Conditioning", "Contractor Licence — Gas Fitting", "Contractor Licence — Electrical"],
  joiner: ["Contractor Licence — Joinery"],
  landscaper: ["Contractor Licence — Landscaping"],
  locksmith: ["Security Licence — Locksmith"],
  painting: ["Contractor Licence — Painting"],
  plasterer: ["Contractor Licence — Plastering"],
  plumber: ["Contractor Licence — Plumbing"],
  refrigeration: ["Contractor Licence — Refrigeration and Air Conditioning"],
  renderer: ["Contractor Licence — Rendering"],
  rigger: ["High Risk Work Licence — Rigging"],
  roofer: ["Contractor Licence — Roofing"],
  scaffolder: ["High Risk Work Licence — Scaffolding"],
  stonemason: ["Contractor Licence — Stonemasonry"],
  swimmingpool: ["Contractor Licence — Swimming Pool and Spa"],
  tiling: ["Contractor Licence — Tiling"],
  waterproofer: ["Contractor Licence — Waterproofing"],
};

const workerRoleOptions = (
  <>
    <option value="">Select role...</option>
    <option value="supervisor">Supervisor / Manager</option>
    <option value="boilermaker">Boilermaker</option>
    <option value="bricklayer">Bricklayer</option>
    <option value="cabinetmaker">Cabinetmaker</option>
    <option value="carpenter">Carpenter</option>
    <option value="carpetlayer">Carpet Layer</option>
    <option value="ceilingfixer">Ceiling Fixer</option>
    <option value="concreting">Concreter</option>
    <option value="crane">Crane Operator</option>
    <option value="damproofer">Damp Proofer</option>
    <option value="demolition">Demolition / Asbestos</option>
    <option value="electrician">Electrician</option>
    <option value="elevatorinstaller">Elevator Installer</option>
    <option value="excavator">Excavator Operator</option>
    <option value="ewp">EWP / Hoist Operator</option>
    <option value="facadeengineer">Façade Engineer</option>
    <option value="fencer">Fencer</option>
    <option value="fireprotection">Fire Protection</option>
    <option value="floorlayer">Floor Layer</option>
    <option value="forklift">Forklift / Plant Operator</option>
    <option value="formworker">Formworker</option>
    <option value="gasfitter">Gas Fitter</option>
    <option value="glazier">Glazier</option>
    <option value="heavyvehicle">Heavy Vehicle Driver</option>
    <option value="hvac">HVAC Technician</option>
    <option value="insulation">Insulation Installer</option>
    <option value="joiner">Joiner</option>
    <option value="labourer">Labourer</option>
    <option value="landscaper">Landscaper</option>
    <option value="locksmith">Locksmith</option>
    <option value="painting">Painter and Decorator</option>
    <option value="plasterer">Plasterer</option>
    <option value="plumber">Plumber</option>
    <option value="refrigeration">Refrigeration Mechanic</option>
    <option value="renderer">Renderer</option>
    <option value="rigger">Rigger</option>
    <option value="roofer">Roofer</option>
    <option value="scaffolder">Scaffolder</option>
    <option value="signwriter">Signwriter</option>
    <option value="stonemason">Stonemason</option>
    <option value="structural">Structural Steel</option>
    <option value="swimmingpool">Swimming Pool Builder</option>
    <option value="tiling">Tiler</option>
    <option value="waterproofer">Waterproofer</option>
    <option value="welder">Welder</option>
  </>
);

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
  invited?: boolean;
  email?: string;
  mobile?: string;
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
  mobile: "0400 000 456",
  contactName: "Tom Richards",
  invited: "10 March 2025",
  sites: ["Paddington Townhouses", "Newstead Commercial"],
  status: "non-compliant" as const,
  companyDocs: [
    { name: "Public liability insurance", expiry: "30 Nov 2025", status: "compliant" as const },
    { name: "Workers compensation insurance", expiry: "30 Jun 2025", status: "compliant" as const },
    { name: "Contractor licence", expiry: "15 Nov 2025", status: "compliant" as const },
    { name: "Professional indemnity insurance", expiry: "Not provided", status: "non-compliant" as const },
    { name: "Accident and illness insurance", expiry: "Not provided", status: "non-compliant" as const },
    { name: "Asbestos Removal Licence — Class A (friable)", expiry: "30 Jun 2025", status: "compliant" as const },
    { name: "Asbestos Removal Licence — Class B (non-friable)", expiry: "Not provided", status: "non-compliant" as const },
    { name: "Contractor Statement", expiry: "Declared 10 Mar 2025", status: "compliant" as const },
  ],
  siteDocs: [
    {
      site: "Paddington Townhouses", cleared: true,
      docs: [
        { name: "SWMS", expiry: "No expiry", status: "compliant" as const },
        { name: "Site induction", expiry: "No expiry", status: "compliant" as const },
      ],
    },
    {
      site: "Newstead Commercial", cleared: false,
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
  email: "", mobile: "",
};

export default function ContractorDetail() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(initialSubcontractors);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [workerMode, setWorkerMode] = useState<"manual" | "invite">("manual");
  const [showAddSub, setShowAddSub] = useState(false);
  const [newWorker, setNewWorker] = useState(emptyWorker);
  const [newSub, setNewSub] = useState({ name: "", trade: "", contact: "", email: "" });
  const [workerInviteSent, setWorkerInviteSent] = useState(false);
  const [assignedTo, setAssignedTo] = useState("Mila Hartley");
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archived, setArchived] = useState(false);
  const [archivedSites, setArchivedSites] = useState<string[]>([]);
  const [reminderSent, setReminderSent] = useState(false);

  const sendReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 3000);
  };

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
    setWorkerMode("manual");
  };

  const sendWorkerInvite = () => {
    if (!newWorker.firstName || !newWorker.email) return;
    setWorkers((prev) => [...prev, { ...newWorker, id: Date.now(), invited: true }]);
    setWorkerInviteSent(true);
    setTimeout(() => {
      setWorkerInviteSent(false);
      setNewWorker(emptyWorker);
      setShowAddWorker(false);
      setWorkerMode("manual");
    }, 2000);
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
    fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Montserrat, sans-serif",
  };

  const sectionHead = (text: string, sub?: string) => (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", textTransform: "uppercase" as const, letterSpacing: ".08em" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{sub}</div>}
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
            <div key={row.lic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < allRows.length - 1 ? "1px solid #ebebeb" : "none" }}>
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
        <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.7, marginBottom: "24px" }}>Removed from all active sites. All compliance records and documents are preserved for audit purposes.</div>
        <a href="/" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}>Back to dashboard</a>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>
      {showArchiveModal && (
        <ArchiveModal contractorName={contractor.name} sites={activeSites} onConfirm={handleArchive} onClose={() => setShowArchiveModal(false)} />
      )}

      {archived && archivedSites.length > 0 && activeSites.length > 0 && (
        <div style={{ padding: "10px 32px", background: "#f5f5f5", borderBottom: "1px solid #d0d0d0", fontSize: "12px", color: "#555" }}>
          Archived from: {archivedSites.join(", ")} · Still active on: {activeSites.join(", ")}
        </div>
      )}

      <div style={{ padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/" style={{ fontSize: "12px", color: "#333", textDecoration: "none" }}>← All contractors</a>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{contractor.name}</span>
          <span style={{ fontSize: "11px", padding: "1px 6px", border: "1px solid #d0d0d0", borderRadius: "2px", color: "#555" }}>{contractor.trade}</span>
          <StatusBadge status={contractor.status} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={sendReminder} style={{ padding: "6px 12px", border: "1px solid #111", background: reminderSent ? "#3a7d44" : "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "background 0.2s" }}>
            {reminderSent ? "✓ Reminder sent" : "Resend reminder"}
          </button>
          <button onClick={() => setShowArchiveModal(true)} style={{ padding: "6px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Archive contractor</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid #d0d0d0" }}>
        <div style={{ padding: "14px 32px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "4px" }}>Contact</div>
          <div style={{ fontSize: "13px", color: "#111", fontWeight: 500 }}>{contractor.contactName}</div>
          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{contractor.email}</div>
          <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{contractor.mobile}</div>
        </div>
        <div style={{ padding: "14px 20px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "4px" }}>Invited</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{contractor.invited}</div>
        </div>
        <div style={{ padding: "14px 20px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "4px" }}>Active sites</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{activeSites.length} sites</div>
        </div>
        <div style={{ padding: "14px 20px", borderRight: "1px solid #d0d0d0" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "4px" }}>Workers on site</div>
          <div style={{ fontSize: "13px", color: "#111" }}>{workers.length} workers</div>
        </div>
        <div style={{ padding: "14px 20px", position: "relative" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "4px" }}>Assigned to</div>
          <div onClick={() => setShowAssignDropdown(!showAssignDropdown)} style={{ fontSize: "13px", color: "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 500, flexShrink: 0 }}>
              {assignedTo.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            {assignedTo}
            <span style={{ fontSize: "12px", color: "#888" }}>▼</span>
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
          <button onClick={sendReminder} style={{ padding: "5px 12px", border: reminderSent ? "1px solid #3a7d44" : "1px solid #b71c1c", background: "#fff", color: reminderSent ? "#3a7d44" : "#b71c1c", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
            {reminderSent ? "✓ Sent" : "Send manual reminder"}
          </button>
        </div>
      )}

      <div style={{ padding: "20px 32px" }}>
        {sectionHead("Company documents", "Verified once — applies across all sites")}
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th style={{ width: "45%", fontSize: "11px", fontWeight: 600, color: "#111", textAlign: "left", padding: "8px 14px", borderBottom: "1px solid #d0d0d0" }}>Document</th>
                <th style={{ width: "25%", fontSize: "11px", fontWeight: 600, color: "#111", textAlign: "left", padding: "8px 14px", borderBottom: "1px solid #d0d0d0" }}>Expiry</th>
                <th style={{ width: "30%", fontSize: "11px", fontWeight: 600, color: "#111", textAlign: "left", padding: "8px 14px", borderBottom: "1px solid #d0d0d0" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {contractor.companyDocs.map((doc, i) => (
                <tr key={doc.name} style={{ borderBottom: i < contractor.companyDocs.length - 1 ? "1px solid #ebebeb" : "none" }}>
                  <td style={{ padding: "10px 14px", fontSize: "13px", color: "#111" }}>{doc.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: "12px", color: doc.status === "non-compliant" ? "#b71c1c" : "#555" }}>{doc.expiry}</td>
                  <td style={{ padding: "10px 14px" }}><StatusBadge status={doc.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ padding: "20px 32px" }}>
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
                {site.docs.map((doc, i) => (
                  <tr key={doc.name} style={{ borderBottom: i < site.docs.length - 1 ? "1px solid #ebebeb" : "none" }}>
                    <td style={{ width: "45%", padding: "10px 14px", fontSize: "13px", color: "#111" }}>{doc.name}</td>
                    <td style={{ width: "25%", padding: "10px 14px", fontSize: "12px", color: doc.status === "non-compliant" ? "#b71c1c" : "#555" }}>{doc.expiry}</td>
                    <td style={{ width: "15%", padding: "10px 14px" }}><StatusBadge status={doc.status} /></td>
                    <td style={{ width: "15%", padding: "10px 14px" }}>
                      {doc.status === "non-compliant" && !archivedSites.includes(site.site) && (
                        <button style={{ padding: "4px 10px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Request</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          {sectionHead("Workers on site", "Individual tickets per person")}
          <div style={{ display: "flex", gap: "8px", marginTop: "-10px" }}>
            <button onClick={() => { setShowAddWorker(true); setWorkerMode("invite"); }} style={{ padding: "5px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>+ Invite worker</button>
            <button onClick={() => { setShowAddWorker(true); setWorkerMode("manual"); }} style={{ padding: "5px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>+ Add manually</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {workers.map((w) => (
            <div key={w.id} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: w.invited ? "#f5a623" : workerCleared(w) ? "#3a7d44" : "#c0392b" }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{w.firstName} {w.lastName}</div>
                      {w.isContact && <span style={{ fontSize: "11px", padding: "1px 6px", background: "#f0f0f0", border: "1px solid #d0d0d0", borderRadius: "2px", color: "#555" }}>Company contact</span>}
                      {w.invited && <span style={{ fontSize: "11px", padding: "1px 6px", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "2px", color: "#7c4e00" }}>Invite sent</span>}
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{roleLabel[w.role] || w.role} · {w.citizen ? "Australian citizen" : "Non-citizen — right to work required"}</div>
                  </div>
                </div>
                <StatusBadge status={w.invited ? "expiring" : workerCleared(w) ? "compliant" : "non-compliant"} />
              </div>
              {!w.invited && (
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
              )}
              {w.invited && (
                <div style={{ padding: "10px 14px", fontSize: "12px", color: "#7c4e00" }}>
                  Invite sent to {w.email} — awaiting submission of White Card and licences
                </div>
              )}
            </div>
          ))}
        </div>

        {showAddWorker && (
          <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginTop: "12px" }}>
            <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{workerMode === "invite" ? "Invite a worker" : "Add a worker manually"}</div>
              <span style={{ fontSize: "18px", color: "#444", cursor: "pointer", lineHeight: 1 }} onClick={() => { setShowAddWorker(false); setWorkerMode("manual"); }}>×</span>
            </div>

            {workerMode === "invite" ? (
              <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "12px", color: "#555", padding: "10px 12px", background: "#f9fdf9", border: "1px solid #a5d6a7", borderRadius: "2px" }}>
                  Vettit will send this worker a secure link to upload their White Card, licences and personal compliance documents.
                </div>
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
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Role on site — determines which licences are requested</div>
                  <select value={newWorker.role} onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value, selectedLicences: [] })} style={{ ...inputStyle, background: "#fff" }}>{workerRoleOptions}</select>
                </div>
                {newWorker.role && licenceOptions[newWorker.role] && (
                  <div style={{ padding: "10px 12px", background: "#fafafa", border: "1px solid #ebebeb", borderRadius: "2px", fontSize: "12px", color: "#555" }}>
                    ✓ Invite will request: White Card + {licenceOptions[newWorker.role].slice(0, 2).join(", ")}{licenceOptions[newWorker.role].length > 2 ? ` and ${licenceOptions[newWorker.role].length - 2} more` : ""}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Email</div>
                  <input value={newWorker.email} onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })} placeholder="dave@rapiddemo.com.au" style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Mobile</div>
                  <input value={newWorker.mobile} onChange={(e) => setNewWorker({ ...newWorker, mobile: e.target.value })} placeholder="0400 000 000" style={inputStyle} />
                </div>
                {workerInviteSent ? (
                  <div style={{ padding: "10px 12px", background: "#f9fdf9", border: "1px solid #a5d6a7", borderRadius: "2px", fontSize: "13px", color: "#3a7d44", fontWeight: 500, textAlign: "center" }}>✓ Invite sent to {newWorker.firstName}</div>
                ) : (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => { setShowAddWorker(false); setWorkerMode("manual"); }} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Cancel</button>
                    <button onClick={sendWorkerInvite} disabled={!newWorker.firstName || !newWorker.email} style={{ padding: "7px 14px", border: "none", background: !newWorker.firstName || !newWorker.email ? "#aaa" : "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: !newWorker.firstName || !newWorker.email ? "not-allowed" : "pointer", fontFamily: "Montserrat, sans-serif" }}>Send invite</button>
                  </div>
                )}
              </div>
            ) : (
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
                  <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Role on site — licences appear automatically based on role</div>
                  <select value={newWorker.role} onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value, selectedLicences: [] })} style={{ ...inputStyle, background: "#fff" }}>{workerRoleOptions}</select>
                </div>
                <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #ebebeb", cursor: "pointer" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#111" }}>White Card</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>Construction Induction Training — mandatory</div>
                    </div>
                    <input type="checkbox" checked={newWorker.whiteCard} onChange={(e) => setNewWorker({ ...newWorker, whiteCard: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #ebebeb", cursor: "pointer" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#111" }}>Australian citizen or permanent resident</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>If no, proof of right to work required</div>
                    </div>
                    <input type="checkbox" checked={newWorker.citizen} onChange={(e) => setNewWorker({ ...newWorker, citizen: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", cursor: "pointer" }}>
                    <div>
                      <div style={{ fontSize: "13px", color: "#111" }}>Working at heights on this site</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>Requires Working at Heights certification</div>
                    </div>
                    <input type="checkbox" checked={newWorker.heights} onChange={(e) => setNewWorker({ ...newWorker, heights: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  </label>
                </div>
                {licenceOptions[newWorker.role] && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "6px" }}>Licences held — tick all that apply</div>
                    <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                      {licenceOptions[newWorker.role].map((lic, i) => {
                        const coveredBy = isLicenceCovered(lic, newWorker.selectedLicences);
                        const isSelected = newWorker.selectedLicences.includes(lic);
                        return (
                          <div key={lic} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: i < licenceOptions[newWorker.role].length - 1 ? "1px solid #f0f0f0" : "none", background: coveredBy ? "#f9fdf9" : "#fff" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: coveredBy ? "default" : "pointer", flex: 1, fontSize: "12px", color: coveredBy ? "#3a7d44" : "#111" }}>
                              <input type="checkbox" checked={isSelected || !!coveredBy} disabled={!!coveredBy} onChange={() => !coveredBy && toggleLicence(lic)} style={{ accentColor: "#3a7d44", width: "13px", height: "13px" }} />
                              {lic}
                            </label>
                            {coveredBy && <span style={{ fontSize: "11px", padding: "1px 6px", background: "#e8f5e9", color: "#3a7d44", border: "1px solid #a5d6a7", borderRadius: "2px", flexShrink: 0, marginLeft: "8px" }}>Covered by {coveredBy.split(" ").slice(-1)[0]}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button onClick={() => { setShowAddWorker(false); setWorkerMode("manual"); }} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Cancel</button>
                  <button onClick={addWorker} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Add worker</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          {sectionHead("Subcontractors", "Brought on site by this contractor")}
          <button onClick={() => setShowAddSub(!showAddSub)} style={{ padding: "5px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", marginTop: "-10px" }}>+ Add subcontractor</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {subcontractors.map((sub) => (
            <div key={sub.id} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: sub.status === "compliant" ? "#3a7d44" : "#aaa" }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{sub.name}</div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{sub.trade} · {sub.contact}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 8px", background: sub.status === "pending" ? "#f5f5f5" : "#e8f5e9", color: sub.status === "pending" ? "#555" : "#1b5e20", border: `1px solid ${sub.status === "pending" ? "#ddd" : "#a5d6a7"}`, borderRadius: "2px", fontWeight: 500 }}>
                    {sub.status === "pending" ? "Invite sent" : "Compliant"}
                  </span>
                  <button style={{ padding: "4px 10px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>View</button>
                </div>
              </div>
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {sub.status === "pending" ? `Invite sent to ${sub.email} — awaiting submission` : "All documents submitted and verified"}
                </div>
                {sub.status === "pending" && (
                  <button style={{ marginTop: "8px", padding: "4px 10px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Resend invite</button>
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
              <div style={{ fontSize: "12px", color: "#555" }}>Vettit will send this subcontractor their own invite to submit company docs and worker tickets separately.</div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Company name</div>
                <input value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} placeholder="e.g. QLD Pipe Specialists" style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Trade — determines which documents they must submit</div>
                <select value={newSub.trade} onChange={(e) => setNewSub({ ...newSub, trade: e.target.value })} style={{ ...inputStyle, background: "#fff" }}>
                  <option value="">Select trade...</option>
                  <option value="boilermaker">Boilermaker</option>
                  <option value="bricklayer">Bricklayer</option>
                  <option value="cabinetmaker">Cabinetmaker</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="carpetlayer">Carpet Layer</option>
                  <option value="ceilingfixer">Ceiling Fixer</option>
                  <option value="concreting">Concreting</option>
                  <option value="crane">Crane Operation</option>
                  <option value="damproofer">Damp Proofer</option>
                  <option value="demolition">Demolition</option>
                  <option value="electrician">Electrical</option>
                  <option value="elevatorinstaller">Elevator Installation</option>
                  <option value="excavator">Excavator Operation</option>
                  <option value="facadeengineer">Façade Engineering</option>
                  <option value="fencer">Fencing</option>
                  <option value="fireprotection">Fire Protection</option>
                  <option value="floorlayer">Floor Laying</option>
                  <option value="formworker">Formwork</option>
                  <option value="gasfitter">Gas Fitting</option>
                  <option value="glazier">Glazing</option>
                  <option value="heavyvehicle">Heavy Vehicle</option>
                  <option value="hvac">HVAC</option>
                  <option value="insulation">Insulation</option>
                  <option value="joiner">Joinery</option>
                  <option value="landscaper">Landscaping</option>
                  <option value="locksmith">Locksmith</option>
                  <option value="painting">Painting</option>
                  <option value="plasterer">Plastering</option>
                  <option value="plumber">Plumbing</option>
                  <option value="refrigeration">Refrigeration and Air Conditioning</option>
                  <option value="renderer">Rendering</option>
                  <option value="rigger">Rigging</option>
                  <option value="roofer">Roofing</option>
                  <option value="scaffolder">Scaffolding</option>
                  <option value="signwriter">Signwriting</option>
                  <option value="stonemason">Stonemasonry</option>
                  <option value="structural">Structural Steel</option>
                  <option value="swimmingpool">Swimming Pool</option>
                  <option value="tiling">Tiling</option>
                  <option value="waterproofer">Waterproofing</option>
                  <option value="welder">Welding</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {newSub.trade && tradeConditionalDocs[newSub.trade] && (
                <div style={{ padding: "10px 12px", background: "#fafafa", border: "1px solid #ebebeb", borderRadius: "2px", fontSize: "12px", color: "#555" }}>
                  ✓ Invite will also request: {tradeConditionalDocs[newSub.trade].join(", ")}
                </div>
              )}
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
                <button onClick={() => setShowAddSub(false)} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Cancel</button>
                <button onClick={addSubcontractor} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Send invite</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          {sectionHead("Private notes", "Only visible to your team — not shared with the contractor")}
          <button onClick={() => setShowNotes(!showNotes)} style={{ padding: "5px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", marginTop: "-10px" }}>
            {showNotes ? "Done" : notes ? "Edit note" : "+ Add note"}
          </button>
        </div>
        {showNotes ? (
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Reliable contractor — always submits on time." style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Montserrat, sans-serif", minHeight: "80px", resize: "vertical" }} />
        ) : notes ? (
          <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, padding: "10px 12px", background: "#fafafa", border: "1px solid #ebebeb", borderRadius: "2px" }}>{notes}</div>
        ) : (
          <div style={{ fontSize: "12px", color: "#888" }}>No notes yet.</div>
        )}
      </div>

      <div style={{ padding: "20px 32px" }}>
        {sectionHead("Autopilot reminder history")}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "4px", top: "10px", bottom: "10px", width: "1px", background: "#ebebeb" }} />
          {contractor.timeline.map((t) => (
            <div key={t.label} style={{ display: "flex", gap: "12px", paddingBottom: "14px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: t.done ? "#3a7d44" : "#b8860b", marginTop: "4px", flexShrink: 0, zIndex: 1 }} />
              <div>
                <div style={{ fontSize: "13px", color: "#111" }}>{t.label}</div>
                <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}