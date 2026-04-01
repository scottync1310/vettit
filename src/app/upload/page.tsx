"use client";
import { useState } from "react";
import { getCoveredLicences, isLicenceCovered } from "../../lib/licences";

const licenceOptions: Record<string, string[]> = {
  plumber: [
    "Plumbing Licence — Unrestricted",
    "Plumbing Licence — Restricted",
    "Drainage Licence",
    "Gas Fitting Licence",
    "Irrigation Licence",
  ],
  electrician: [
    "Electrical Contractor Licence",
    "Electrical Worker Licence — Grade A (Unrestricted)",
    "Electrical Worker Licence — Grade B (Restricted)",
    "Electrical Worker Licence — Provisional",
    "Air Conditioning & Refrigeration Licence",
    "Aerial & Data Licence",
  ],
  scaffolder: [
    "Dogging DG",
    "Basic Rigging RB",
    "Intermediate Rigging RI",
    "Advanced Rigging RA",
    "Basic Scaffolding SB",
    "Intermediate Scaffolding SI",
    "Advanced Scaffolding SA",
  ],
  crane: [
    "Slewing Mobile Crane C2 (up to 20t)",
    "Slewing Mobile Crane C6 (up to 60t)",
    "Slewing Mobile Crane C1 (up to 100t)",
    "Slewing Mobile Crane C0 (open/over 100t)",
    "Non-Slewing Mobile Crane CN",
    "Tower Crane CT",
    "Self-Erecting Tower Crane CS",
    "Vehicle Loading Crane CV",
    "Bridge and Gantry Crane CB",
  ],
  forklift: [
    "Forklift Truck LF",
    "Order-Picking Forklift LO",
    "Reach Stacker RS",
    "Telehandler TV",
  ],
  ewp: [
    "Boom-type EWP WP (11m+)",
    "Materials Hoist HM",
    "Personnel and Materials Hoist HP",
    "Concrete Placing Boom PB",
  ],
  demolition: [
    "Demolition Licence",
    "Asbestos Removal Class A (friable)",
    "Asbestos Removal Class B (non-friable)",
  ],
  heavyvehicle: [
    "Light Rigid LR",
    "Medium Rigid MR",
    "Heavy Rigid HR",
    "Heavy Combination HC",
    "Multi-Combination MC",
  ],
  carpentry: ["Carpentry & Joinery Licence", "Building & Construction Licence"],
  hvac: ["Air Conditioning & Refrigeration Licence", "Gas Fitting Licence", "Electrical Worker Licence (Restricted — A/C)"],
  gasfitter: ["Gas Fitting Licence — Type A", "Gas Fitting Licence — Type B", "Gas Fitting Licence — LP Gas"],
  painting: ["Painting & Decorating Licence", "Lead Paint Removal Certification"],
  tiling: ["Wall & Floor Tiling Licence"],
  concretor: ["Concreting Licence", "Concrete Placing Boom PB"],
};

type ParseState = "idle" | "reading" | "verified" | "error" | "expired";

type DocState = {
  name: string;
  fileName: string;
  parseState: ParseState;
  parsedInsurer?: string;
  parsedExpiry?: string;
  errorMsg?: string;
};

type Worker = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  whiteCardFile: string;
  whiteCardState: ParseState;
  citizen: boolean;
  heights: boolean;
  heightsFile: string;
  heightsState: ParseState;
  licences: string[];
  done: boolean;
};

type Sub = {
  id: number;
  name: string;
  trade: string;
  contactFirst: string;
  contactLast: string;
  email: string;
};

const steps = ["Company docs", "Your documents", "Your workers", "Subcontractors"];

const emptyWorker: Omit<Worker, "id"> = {
  firstName: "",
  lastName: "",
  role: "",
  whiteCardFile: "",
  whiteCardState: "idle",
  citizen: true,
  heights: false,
  heightsFile: "",
  heightsState: "idle",
  licences: [],
  done: false,
};

const emptySub = { name: "", trade: "", contactFirst: "", contactLast: "", email: "" };

const mockParse = (
  fileName: string,
  onDone: (state: ParseState, insurer?: string, expiry?: string, error?: string) => void
) => {
  setTimeout(() => {
    if (fileName.toLowerCase().includes("expired")) {
      onDone("expired", undefined, undefined, "This document expired on 12 Jan 2025 — please upload a current certificate");
    } else if (fileName.toLowerCase().includes("bad")) {
      onDone("error", undefined, undefined, "We couldn't read this document — please upload a clear PDF or photo");
    } else {
      const insurers = ["CGU Insurance", "QBE Insurance", "Allianz", "Guild Insurance", "WorkCover QLD"];
      const insurer = insurers[Math.floor(Math.random() * insurers.length)];
      const year = 2025 + Math.floor(Math.random() * 2);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      onDone("verified", insurer, `${month}/${year}`);
    }
  }, 2000);
};

export default function UploadPortal() {
  const [step, setStep] = useState(0);

  const [companyDocs, setCompanyDocs] = useState<DocState[]>([
    { name: "Public liability insurance", fileName: "", parseState: "idle" },
    { name: "Workers compensation", fileName: "", parseState: "idle" },
    { name: "Trade licence", fileName: "", parseState: "idle" },
  ]);

  const [ownerDocs, setOwnerDocs] = useState({
    whiteCardFile: "",
    whiteCardState: "idle" as ParseState,
    whiteCardInsurer: "",
    whiteCardExpiry: "",
    citizen: true,
    heights: false,
    heightsFile: "",
    heightsState: "idle" as ParseState,
    role: "",
    licences: [] as string[],
  });

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [newWorker, setNewWorker] = useState(emptyWorker);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [showAddSub, setShowAddSub] = useState(false);
  const [newSub, setNewSub] = useState(emptySub);
  const [noSubs, setNoSubs] = useState(false);

  const handleCompanyFile = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompanyDocs((prev) => prev.map((d) => d.name === name ? { ...d, fileName: file.name, parseState: "reading" } : d));
    mockParse(file.name, (state, insurer, expiry, error) => {
      setCompanyDocs((prev) => prev.map((d) => d.name === name ? { ...d, parseState: state, parsedInsurer: insurer, parsedExpiry: expiry, errorMsg: error } : d));
    });
  };

  const handleWhiteCardFile = (e: React.ChangeEvent<HTMLInputElement>, isOwner: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isOwner) {
      setOwnerDocs((prev) => ({ ...prev, whiteCardFile: file.name, whiteCardState: "reading" }));
      mockParse(file.name, (state, insurer, expiry) => {
        setOwnerDocs((prev) => ({ ...prev, whiteCardState: state, whiteCardInsurer: insurer || "", whiteCardExpiry: expiry || "" }));
      });
    } else {
      setNewWorker((prev) => ({ ...prev, whiteCardFile: file.name, whiteCardState: "reading" }));
      mockParse(file.name, (state) => {
        setNewWorker((prev) => ({ ...prev, whiteCardState: state }));
      });
    }
  };

  const handleHeightsFile = (e: React.ChangeEvent<HTMLInputElement>, isOwner: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isOwner) {
      setOwnerDocs((prev) => ({ ...prev, heightsFile: file.name, heightsState: "reading" }));
      mockParse(file.name, (state) => {
        setOwnerDocs((prev) => ({ ...prev, heightsState: state }));
      });
    } else {
      setNewWorker((prev) => ({ ...prev, heightsFile: file.name, heightsState: "reading" }));
      mockParse(file.name, (state) => {
        setNewWorker((prev) => ({ ...prev, heightsState: state }));
      });
    }
  };

  const toggleOwnerLicence = (lic: string) => {
    setOwnerDocs((prev) => ({ ...prev, licences: prev.licences.includes(lic) ? prev.licences.filter((l) => l !== lic) : [...prev.licences, lic] }));
  };

  const toggleWorkerLicence = (lic: string) => {
    setNewWorker((prev) => ({ ...prev, licences: prev.licences.includes(lic) ? prev.licences.filter((l) => l !== lic) : [...prev.licences, lic] }));
  };

  const addWorker = () => {
    if (!newWorker.firstName || !newWorker.role) return;
    setWorkers((prev) => [...prev, { ...newWorker, id: Date.now(), done: true }]);
    setNewWorker(emptyWorker);
    setShowAddWorker(false);
  };

  const addSub = () => {
    if (!newSub.name || !newSub.email) return;
    setSubs((prev) => [...prev, { ...newSub, id: Date.now() }]);
    setNewSub(emptySub);
    setShowAddSub(false);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif", background: "#fff" };
  const btnPrimary: React.CSSProperties = { padding: "9px 20px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "Roboto, sans-serif" };
  const btnOutline: React.CSSProperties = { padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", borderRadius: "2px", fontSize: "13px", cursor: "pointer", fontFamily: "Roboto, sans-serif" };

  const ParseStatus = ({ state, insurer, expiry, error }: { state: ParseState; insurer?: string; expiry?: string; error?: string }) => {
    if (state === "idle") return null;
    if (state === "reading") return (
      <div style={{ fontSize: "11px", color: "#888", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ display: "inline-block", width: "10px", height: "10px", border: "2px solid #d0d0d0", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Reading document...
      </div>
    );
    if (state === "verified") return <div style={{ fontSize: "11px", color: "#3a7d44", marginTop: "6px", fontWeight: 500 }}>✓ Verified — {insurer}{expiry ? ` · expires ${expiry}` : ""}</div>;
    if (state === "expired") return <div style={{ fontSize: "11px", color: "#c0392b", marginTop: "6px", fontWeight: 500 }}>✗ {error}</div>;
    if (state === "error") return <div style={{ fontSize: "11px", color: "#c0392b", marginTop: "6px" }}>✗ {error}</div>;
    return null;
  };

  const DocUploadCard = ({ doc, onChange }: { doc: DocState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div style={{ border: doc.parseState === "verified" ? "1px solid #a5d6a7" : doc.parseState === "expired" || doc.parseState === "error" ? "1px solid #ef9a9a" : "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", background: doc.parseState === "verified" ? "#f9fdf9" : "#fff", marginBottom: "8px" }}>
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 500, color: doc.parseState === "verified" ? "#1b5e20" : "#111" }}>{doc.name}</div>
          <ParseStatus state={doc.parseState} insurer={doc.parsedInsurer} expiry={doc.parsedExpiry} error={doc.errorMsg} />
        </div>
        {doc.parseState === "verified" ? (
          <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500, flexShrink: 0, marginLeft: "12px" }}>Done</span>
        ) : doc.parseState === "reading" ? (
          <span style={{ fontSize: "11px", color: "#888", flexShrink: 0, marginLeft: "12px" }}>Checking...</span>
        ) : (
          <label style={{ padding: "5px 12px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Roboto, sans-serif", flexShrink: 0, marginLeft: "12px" }}>
            Upload
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={onChange} />
          </label>
        )}
      </div>
      {(doc.parseState === "expired" || doc.parseState === "error") && (
        <div style={{ borderTop: "1px solid #ebebeb", padding: "8px 14px", background: "#fff8f8", display: "flex", justifyContent: "flex-end" }}>
          <label style={{ padding: "5px 12px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>
            Try again
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={onChange} />
          </label>
        </div>
      )}
      {doc.parseState === "idle" && (
        <div style={{ borderTop: "1px solid #ebebeb", padding: "8px 14px", background: "#fafafa" }}>
          <div style={{ fontSize: "11px", color: "#aaa", textAlign: "center" }}>PDF, JPG or PNG · Vettit reads the document automatically</div>
        </div>
      )}
    </div>
  );

  const WhiteCardUpload = ({ fileName, state, onChange }: { fileName: string; state: ParseState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div style={{ border: state === "verified" ? "1px solid #a5d6a7" : state === "error" ? "1px solid #ef9a9a" : "1px solid #d0d0d0", borderRadius: "2px", padding: "10px 12px", background: state === "verified" ? "#f9fdf9" : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: "12px", color: state === "verified" ? "#1b5e20" : "#555" }}>{fileName || "No file selected"}</div>
        <ParseStatus state={state} />
      </div>
      {state !== "verified" && state !== "reading" && (
        <label style={{ padding: "5px 10px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "11px", fontWeight: 500, cursor: "pointer", fontFamily: "Roboto, sans-serif", flexShrink: 0, marginLeft: "10px" }}>
          Upload
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={onChange} />
        </label>
      )}
      {state === "verified" && <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500, flexShrink: 0, marginLeft: "10px" }}>Verified</span>}
    </div>
  );

  const tickRow = (label: string, sub: string, checked: boolean, onChange: (v: boolean) => void) => (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid #ebebeb", cursor: "pointer" }}>
      <div>
        <div style={{ fontSize: "13px", color: "#111" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{sub}</div>
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ accentColor: "#111", width: "15px", height: "15px" }} />
    </label>
  );

  const roleSelect = (value: string, onChange: (val: string) => void) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      <option value="">Select role...</option>
      <option value="supervisor">Supervisor / Manager</option>
      <option value="labourer">Labourer</option>
      <option value="plumber">Plumber</option>
      <option value="electrician">Electrician</option>
      <option value="carpentry">Carpenter / Joiner</option>
      <option value="painting">Painter</option>
      <option value="tiling">Tiler</option>
      <option value="concretor">Concretor</option>
      <option value="hvac">HVAC Technician</option>
      <option value="gasfitter">Gas Fitter</option>
      <option value="scaffolder">Scaffolder / Rigger</option>
      <option value="crane">Crane Operator</option>
      <option value="forklift">Forklift / Plant Operator</option>
      <option value="ewp">EWP / Hoist Operator</option>
      <option value="demolition">Demolition / Asbestos</option>
      <option value="heavyvehicle">Heavy Vehicle Driver</option>
    </select>
  );

  const licenceChecklist = (role: string, selected: string[], toggle: (lic: string) => void) => {
    if (!licenceOptions[role]) return null;
    const covered = getCoveredLicences(selected);
    return (
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "5px" }}>Licences held — select all that apply</div>
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
          {licenceOptions[role].map((lic, i) => {
            const isSelected = selected.includes(lic);
            const coveredBy = isLicenceCovered(lic, selected);
            const isCovered = !!coveredBy;
            return (
              <div key={lic} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderBottom: i < licenceOptions[role].length - 1 ? "1px solid #f0f0f0" : "none", background: isCovered ? "#f9fdf9" : "#fff" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: isCovered ? "default" : "pointer", flex: 1, fontSize: "12px", color: isCovered ? "#3a7d44" : "#111" }}>
                  <input
                    type="checkbox"
                    checked={isSelected || isCovered}
                    disabled={isCovered}
                    onChange={() => !isCovered && toggle(lic)}
                    style={{ accentColor: "#3a7d44", width: "13px", height: "13px" }}
                  />
                  {lic}
                </label>
                {isCovered && (
                  <span style={{ fontSize: "10px", padding: "1px 6px", background: "#e8f5e9", color: "#3a7d44", border: "1px solid #a5d6a7", borderRadius: "2px", flexShrink: 0, marginLeft: "8px" }}>
                    Covered by {coveredBy.split(" ").slice(-1)[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {covered.length > 0 && (
          <div style={{ fontSize: "11px", color: "#3a7d44", marginTop: "6px" }}>
            ✓ {covered.length} lower class{covered.length > 1 ? "es" : ""} automatically covered by your higher licence
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ borderBottom: "1px solid #d0d0d0", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "17px", fontWeight: 500, color: "#111", letterSpacing: "-.3px" }}>vett<span style={{ color: "#3a7d44" }}>it</span></span>
        <span style={{ fontSize: "11px", color: "#888" }}>Link expires in 14 days · no account needed</span>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 24px 64px" }}>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "15px", fontWeight: 500, color: "#111", marginBottom: "2px" }}>Rapid Demo Co Pty Ltd</div>
          <div style={{ fontSize: "12px", color: "#888" }}>Requested by Hartley Constructions · Paddington Townhouses — Stage 2</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "28px" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, background: i < step ? "#3a7d44" : i === step ? "#111" : "#f0f0f0", color: i < step ? "#fff" : i === step ? "#fff" : "#aaa", flexShrink: 0 }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: "10px", color: i === step ? "#111" : i < step ? "#3a7d44" : "#aaa", fontWeight: i === step ? 500 : 400, whiteSpace: "nowrap" }}>{s}</div>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: i < step ? "#3a7d44" : "#d0d0d0", margin: "0 6px", marginBottom: "16px" }} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em" }}>Company documents</div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>Upload each document — Vettit reads and verifies them automatically</div>
            </div>
            {companyDocs.map((doc) => (
              <DocUploadCard key={doc.name} doc={doc} onChange={(e) => handleCompanyFile(doc.name, e)} />
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button onClick={() => setStep(1)} style={btnPrimary}>Next — your personal documents →</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em" }}>Your personal documents</div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>Tom Richards — added as a worker automatically as company contact</div>
            </div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "14px" }}>
              {tickRow("Australian citizen or permanent resident", "If no, proof of right to work will be required", ownerDocs.citizen, (v) => setOwnerDocs({ ...ownerDocs, citizen: v }))}
              {tickRow("Working at heights on this site", "If yes, upload your Working at Heights certification below", ownerDocs.heights, (v) => setOwnerDocs({ ...ownerDocs, heights: v }))}
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #ebebeb" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>White Card — Construction Induction Training</div>
                <WhiteCardUpload fileName={ownerDocs.whiteCardFile} state={ownerDocs.whiteCardState} onChange={(e) => handleWhiteCardFile(e, true)} />
              </div>
              {!ownerDocs.citizen && (
                <div style={{ padding: "12px 14px", borderBottom: "1px solid #ebebeb" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Proof of right to work</div>
                  <WhiteCardUpload fileName="" state="idle" onChange={() => {}} />
                </div>
              )}
              {ownerDocs.heights && (
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Working at Heights certification</div>
                  <WhiteCardUpload fileName={ownerDocs.heightsFile} state={ownerDocs.heightsState} onChange={(e) => handleHeightsFile(e, true)} />
                </div>
              )}
            </div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "5px" }}>Your role on site</div>
              {roleSelect(ownerDocs.role, (val) => setOwnerDocs({ ...ownerDocs, role: val, licences: [] }))}
            </div>
            {licenceChecklist(ownerDocs.role, ownerDocs.licences, toggleOwnerLicence)}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              <button onClick={() => setStep(0)} style={btnOutline}>← Back</button>
              <button onClick={() => setStep(2)} style={btnPrimary}>Next — add your workers →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em" }}>Your workers on site</div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>Add every person working on this site — upload their White Card and any licences</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {workers.map((w) => (
                <div key={w.id} style={{ border: "1px solid #a5d6a7", borderRadius: "2px", padding: "11px 14px", background: "#f9fdf9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#1b5e20" }}>{w.firstName} {w.lastName}</div>
                    <div style={{ fontSize: "11px", color: "#3a7d44", marginTop: "2px" }}>
                      {w.role} · White Card {w.whiteCardState === "verified" ? "verified" : "uploaded"}{w.licences.length > 0 ? ` · ${w.licences.length} licence${w.licences.length > 1 ? "s" : ""}` : ""}
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500 }}>Added</span>
                </div>
              ))}
            </div>
            {showAddWorker ? (
              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>Add a worker</div>
                  <span style={{ fontSize: "18px", color: "#aaa", cursor: "pointer" }} onClick={() => setShowAddWorker(false)}>×</span>
                </div>
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
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
                    {roleSelect(newWorker.role, (val) => setNewWorker({ ...newWorker, role: val, licences: [] }))}
                  </div>
                  <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                    {tickRow("Australian citizen or permanent resident", "If no, proof of right to work required", newWorker.citizen, (v) => setNewWorker({ ...newWorker, citizen: v }))}
                    {tickRow("Working at heights on this site", "If yes, upload Working at Heights certification", newWorker.heights, (v) => setNewWorker({ ...newWorker, heights: v }))}
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>White Card</div>
                      <WhiteCardUpload fileName={newWorker.whiteCardFile} state={newWorker.whiteCardState} onChange={(e) => handleWhiteCardFile(e, false)} />
                    </div>
                    {newWorker.heights && (
                      <div style={{ padding: "12px 14px", borderTop: "1px solid #ebebeb" }}>
                        <div style={{ fontSize: "12px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Working at Heights certification</div>
                        <WhiteCardUpload fileName={newWorker.heightsFile} state={newWorker.heightsState} onChange={(e) => handleHeightsFile(e, false)} />
                      </div>
                    )}
                  </div>
                  {licenceChecklist(newWorker.role, newWorker.licences, toggleWorkerLicence)}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => setShowAddWorker(false)} style={btnOutline}>Cancel</button>
                    <button onClick={addWorker} style={btnPrimary}>Add worker</button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddWorker(true)} style={{ width: "100%", padding: "9px", border: "1px dashed #d0d0d0", background: "#fafafa", color: "#555", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif", marginBottom: "16px" }}>
                + Add a worker
              </button>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)} style={btnOutline}>← Back</button>
              <button onClick={() => setStep(3)} style={btnPrimary}>Next — subcontractors →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em" }}>Subcontractors</div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>Declare any subcontractors you are bringing on site — your builder will review and send their compliance invite</div>
            </div>
            <div style={{ padding: "12px 14px", border: "1px solid #ffe082", background: "#fff8e1", borderRadius: "2px", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#7c4e00", lineHeight: 1.6 }}>
                You are not inviting subcontractors — you are declaring who you plan to bring on site. Hartley Constructions will review this information and send their compliance invite separately.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {subs.map((sub) => (
                <div key={sub.id} style={{ border: "1px solid #ffe082", borderRadius: "2px", padding: "11px 14px", background: "#fff8e1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{sub.name}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{sub.trade} · {sub.contactFirst} {sub.contactLast} · {sub.email}</div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 8px", background: "#fff8e1", color: "#7c4e00", border: "1px solid #ffe082", borderRadius: "2px", fontWeight: 500 }}>Pending builder approval</span>
                </div>
              ))}
            </div>
            {showAddSub ? (
              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>Declare a subcontractor</div>
                  <span style={{ fontSize: "18px", color: "#aaa", cursor: "pointer" }} onClick={() => setShowAddSub(false)}>×</span>
                </div>
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
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
                      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Contact first name</div>
                      <input value={newSub.contactFirst} onChange={(e) => setNewSub({ ...newSub, contactFirst: e.target.value })} placeholder="Steve" style={inputStyle} />
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Contact last name</div>
                      <input value={newSub.contactLast} onChange={(e) => setNewSub({ ...newSub, contactLast: e.target.value })} placeholder="Moore" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "4px" }}>Contact email</div>
                    <input value={newSub.email} onChange={(e) => setNewSub({ ...newSub, email: e.target.value })} placeholder="steve@qldpipe.com.au" style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => setShowAddSub(false)} style={btnOutline}>Cancel</button>
                    <button onClick={addSub} style={btnPrimary}>Add subcontractor</button>
                  </div>
                </div>
              </div>
            ) : !noSubs && (
              <button onClick={() => setShowAddSub(true)} style={{ width: "100%", padding: "9px", border: "1px dashed #d0d0d0", background: "#fafafa", color: "#555", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif", marginBottom: "12px" }}>
                + Declare a subcontractor
              </button>
            )}
            {!showAddSub && (
              <label style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", border: "1px solid #d0d0d0", borderRadius: "2px", cursor: "pointer", marginBottom: "16px" }}>
                <input type="checkbox" checked={noSubs} onChange={(e) => setNoSubs(e.target.checked)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                <div style={{ fontSize: "13px", color: "#111" }}>No subcontractors on this site</div>
              </label>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(2)} style={btnOutline}>← Back</button>
              <button
                onClick={() => setStep(4)}
                disabled={!noSubs && subs.length === 0}
                style={{ ...btnPrimary, background: (!noSubs && subs.length === 0) ? "#aaa" : "#3a7d44", cursor: (!noSubs && subs.length === 0) ? "not-allowed" : "pointer" }}
              >
                Submit everything →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px", color: "#3a7d44" }}>✓</div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>All done, Tom.</div>
            <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.7, marginBottom: "24px" }}>
              Your documents have been submitted to Hartley Constructions.<br />
              You will receive a confirmation email shortly.<br />
              {subs.length > 0 && `Hartley Constructions has been notified of ${subs.length} subcontractor${subs.length > 1 ? "s" : ""} you declared — they will send compliance invites separately.`}
            </div>
            <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "16px 20px", display: "inline-block", textAlign: "left" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" }}>Submission summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "12px", color: "#555" }}><span style={{ color: "#3a7d44", marginRight: "8px" }}>✓</span>{companyDocs.filter((d) => d.parseState === "verified").length} of {companyDocs.length} company documents verified</div>
                <div style={{ fontSize: "12px", color: "#555" }}><span style={{ color: "#3a7d44", marginRight: "8px" }}>✓</span>Your personal documents submitted</div>
                <div style={{ fontSize: "12px", color: "#555" }}><span style={{ color: "#3a7d44", marginRight: "8px" }}>✓</span>{workers.length} worker{workers.length !== 1 ? "s" : ""} added</div>
                <div style={{ fontSize: "12px", color: "#555" }}><span style={{ color: "#3a7d44", marginRight: "8px" }}>✓</span>{noSubs ? "No subcontractors on this site" : `${subs.length} subcontractor${subs.length !== 1 ? "s" : ""} declared — pending builder approval`}</div>
              </div>
            </div>
            <div style={{ marginTop: "24px", fontSize: "12px", color: "#aaa" }}>You can close this window — no further action is needed.</div>
          </div>
        )}

      </div>
    </div>
  );
}