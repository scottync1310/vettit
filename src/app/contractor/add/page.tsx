"use client";
import { useState, useEffect } from "react";
import { isLicenceCovered } from "../../../lib/licences";

const licenceOptions: Record<string, string[]> = {
  plumber: ["Plumbing Licence — Unrestricted", "Plumbing Licence — Restricted", "Drainage Licence", "Gas Fitting Licence", "Irrigation Licence"],
  electrician: ["Electrical Contractor Licence", "Electrical Worker Licence — Grade A (Unrestricted)", "Electrical Worker Licence — Grade B (Restricted)", "Electrical Worker Licence — Provisional", "Air Conditioning & Refrigeration Licence", "Aerial & Data Licence"],
  scaffolder: ["Dogging DG", "Basic Rigging RB", "Intermediate Rigging RI", "Advanced Rigging RA", "Basic Scaffolding SB", "Intermediate Scaffolding SI", "Advanced Scaffolding SA"],
  crane: ["Slewing Mobile Crane C2 (up to 20t)", "Slewing Mobile Crane C6 (up to 60t)", "Slewing Mobile Crane C1 (up to 100t)", "Slewing Mobile Crane C0 (open/over 100t)", "Non-Slewing Mobile Crane CN", "Tower Crane CT", "Self-Erecting Tower Crane CS", "Vehicle Loading Crane CV", "Bridge and Gantry Crane CB"],
  forklift: ["Forklift Truck LF", "Order-Picking Forklift LO", "Reach Stacker RS", "Telehandler TV"],
  ewp: ["Boom-type EWP WP (11m+)", "Materials Hoist HM", "Personnel and Materials Hoist HP", "Concrete Placing Boom PB"],
  demolition: ["Demolition Licence", "Asbestos Removal Class A (friable)", "Asbestos Removal Class B (non-friable)"],
  heavyvehicle: ["Light Rigid LR", "Medium Rigid MR", "Heavy Rigid HR", "Heavy Combination HC", "Multi-Combination MC"],
  carpentry: ["Carpentry & Joinery Licence", "Building & Construction Licence"],
  hvac: ["Air Conditioning & Refrigeration Licence", "Gas Fitting Licence", "Electrical Worker Licence (Restricted — A/C)"],
  gasfitter: ["Gas Fitting Licence — Type A", "Gas Fitting Licence — Type B", "Gas Fitting Licence — LP Gas"],
  painting: ["Painting & Decorating Licence", "Lead Paint Removal Certification"],
  tiling: ["Wall & Floor Tiling Licence"],
  concretor: ["Concreting Licence", "Concrete Placing Boom PB"],
};

const tradeConditionalDocs: Record<string, string[]> = {
  electrician: ["Electrical Contractor Licence"],
  plumber: ["Plumbing Contractor Licence"],
  gasfitter: ["Gas Fitting Contractor Licence"],
  hvac: ["Gas Fitting Contractor Licence"],
  demolition: ["Asbestos Removal Licence — Class A (friable)", "Asbestos Removal Licence — Class B (non-friable)"],
  scaffolder: ["SafeWork High Risk Work Licence — Scaffolding/Rigging"],
  crane: ["SafeWork High Risk Work Licence — Crane Operation"],
};

type ParseState = "idle" | "reading" | "verified" | "error" | "expired";

type DocState = {
  name: string;
  fileName: string;
  parseState: ParseState;
  parsedInsurer?: string;
  parsedExpiry?: string;
  errorMsg?: string;
  required: boolean;
  note?: string;
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
  licences: string[];
};

const sites = ["Paddington Townhouses", "Bulimba Apartments", "Newstead Commercial"];

const mockParse = (fileName: string, onDone: (state: ParseState, insurer?: string, expiry?: string, error?: string) => void) => {
  setTimeout(() => {
    if (fileName.toLowerCase().includes("expired")) {
      onDone("expired", undefined, undefined, "This document expired — please upload a current certificate");
    } else if (fileName.toLowerCase().includes("bad")) {
      onDone("error", undefined, undefined, "Could not read this document — please upload a clear PDF or photo");
    } else {
      const insurers = ["CGU Insurance", "QBE Insurance", "Allianz", "Guild Insurance", "WorkCover QLD"];
      const insurer = insurers[Math.floor(Math.random() * insurers.length)];
      const year = 2025 + Math.floor(Math.random() * 2);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      onDone("verified", insurer, `${month}/${year}`);
    }
  }, 2000);
};

const buildDocs = (trade: string, entityType: string): DocState[] => {
  const docs: DocState[] = [
    { name: "Public liability insurance", fileName: "", parseState: "idle", required: true, note: "Minimum $20M cover" },
    { name: "Workers compensation insurance", fileName: "", parseState: "idle", required: entityType !== "sole_trader", note: "Required for all contractors with employees" },
    { name: "Contractor licence", fileName: "", parseState: "idle", required: true, note: "State-issued building or trade contractor licence" },
    { name: "Professional indemnity insurance", fileName: "", parseState: "idle", required: false, note: "Required for design, engineering and fire protection trades" },
    { name: "Accident and illness insurance", fileName: "", parseState: "idle", required: entityType === "sole_trader", note: entityType === "sole_trader" ? "Required — sole traders are not covered by workers compensation" : "Recommended for sole traders and working directors" },
  ];
  if (trade && tradeConditionalDocs[trade]) {
    tradeConditionalDocs[trade].forEach((name) => {
      docs.push({ name, fileName: "", parseState: "idle", required: true });
    });
  }
  return docs;
};

const emptyWorker: Omit<Worker, "id"> = {
  firstName: "", lastName: "", role: "", whiteCardFile: "",
  whiteCardState: "idle", citizen: true, heights: false, licences: [],
};

export default function AddContractorManually() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entityType, setEntityType] = useState<"company" | "sole_trader">("company");
  const [contractorStatement, setContractorStatement] = useState(false);
  const [company, setCompany] = useState({ name: "", abn: "", trade: "", contactFirst: "", contactLast: "", email: "", mobile: "" });
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [companyDocs, setCompanyDocs] = useState<DocState[]>(buildDocs("", "company"));
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [newWorker, setNewWorker] = useState<Omit<Worker, "id">>(emptyWorker);

  useEffect(() => { setMounted(true); }, []);

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" };

  const lbl = (text: string, sub?: string) => (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#666", marginTop: "1px" }}>{sub}</div>}
    </div>
  );

  const btnPrimary = (disabled: boolean, green?: boolean): React.CSSProperties => ({
    padding: "9px 24px", background: disabled ? "#aaa" : green ? "#3a7d44" : "#111", color: "#fff",
    border: "none", fontSize: "13px", fontWeight: 500, borderRadius: "2px",
    cursor: disabled ? "not-allowed" : "pointer", fontFamily: "Montserrat, sans-serif",
  });

  const btnOutline: React.CSSProperties = { padding: "9px 20px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "13px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" };

  const handleEntityChange = (newEntity: "company" | "sole_trader") => {
    setEntityType(newEntity);
    setCompanyDocs(buildDocs(company.trade, newEntity));
  };

  const handleTradeChange = (newTrade: string) => {
    setCompany((prev) => ({ ...prev, trade: newTrade }));
    setCompanyDocs(buildDocs(newTrade, entityType));
  };

  const handleCompanyFile = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompanyDocs((prev) => prev.map((d) => d.name === name ? { ...d, fileName: file.name, parseState: "reading" } : d));
    mockParse(file.name, (state, insurer, expiry, error) => {
      setCompanyDocs((prev) => prev.map((d) => d.name === name ? { ...d, parseState: state, parsedInsurer: insurer, parsedExpiry: expiry, errorMsg: error } : d));
    });
  };

  const handleWhiteCardFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewWorker((prev) => ({ ...prev, whiteCardFile: file.name, whiteCardState: "reading" }));
    mockParse(file.name, (state) => { setNewWorker((prev) => ({ ...prev, whiteCardState: state })); });
  };

  const toggleLicence = (lic: string) => {
    setNewWorker((prev) => ({ ...prev, licences: prev.licences.includes(lic) ? prev.licences.filter((l) => l !== lic) : [...prev.licences, lic] }));
  };

  const addWorker = () => {
    if (!newWorker.firstName || !newWorker.role) return;
    setWorkers((prev) => [...prev, { ...newWorker, id: Date.now() }]);
    setNewWorker(emptyWorker);
    setShowAddWorker(false);
  };

  const requiredDocsVerified = companyDocs.filter((d) => d.required).every((d) => d.parseState === "verified");
  const canProceed = requiredDocsVerified && contractorStatement;

  const ParseStatus = ({ state, insurer, expiry, error }: { state: ParseState; insurer?: string; expiry?: string; error?: string }) => {
    if (state === "idle") return null;
    if (state === "reading") return <div style={{ fontSize: "11px", color: "#888", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}><span style={{ display: "inline-block", width: "10px", height: "10px", border: "2px solid #d0d0d0", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Reading document...</div>;
    if (state === "verified") return <div style={{ fontSize: "11px", color: "#3a7d44", marginTop: "6px", fontWeight: 500 }}>✓ Verified — {insurer}{expiry ? ` · expires ${expiry}` : ""}</div>;
    if (state === "expired") return <div style={{ fontSize: "11px", color: "#c0392b", marginTop: "6px", fontWeight: 500 }}>✗ {error}</div>;
    if (state === "error") return <div style={{ fontSize: "11px", color: "#c0392b", marginTop: "6px" }}>✗ {error}</div>;
    return null;
  };

  const DocUploadCard = ({ doc, onChange }: { doc: DocState; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div style={{ border: doc.parseState === "verified" ? "1px solid #a5d6a7" : doc.parseState === "expired" || doc.parseState === "error" ? "1px solid #ef9a9a" : "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", background: doc.parseState === "verified" ? "#f9fdf9" : "#fff", marginBottom: "8px" }}>
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: doc.parseState === "verified" ? "#1b5e20" : "#111" }}>{doc.name}</div>
            {doc.required
              ? <span style={{ fontSize: "10px", padding: "1px 6px", background: "#fff3e0", color: "#e65100", border: "1px solid #ffcc80", borderRadius: "2px", flexShrink: 0 }}>Required</span>
              : <span style={{ fontSize: "10px", padding: "1px 6px", background: "#f5f5f5", color: "#888", border: "1px solid #e0e0e0", borderRadius: "2px", flexShrink: 0 }}>Optional</span>
            }
          </div>
          {doc.note && <div style={{ fontSize: "11px", color: "#666", marginBottom: "2px" }}>{doc.note}</div>}
          <ParseStatus state={doc.parseState} insurer={doc.parsedInsurer} expiry={doc.parsedExpiry} error={doc.errorMsg} />
        </div>
        {doc.parseState === "verified" ? (
          <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500, flexShrink: 0, marginLeft: "12px" }}>Done</span>
        ) : doc.parseState === "reading" ? (
          <span style={{ fontSize: "11px", color: "#888", flexShrink: 0, marginLeft: "12px" }}>Checking...</span>
        ) : (
          <label style={{ padding: "5px 12px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Montserrat, sans-serif", flexShrink: 0, marginLeft: "12px" }}>
            Upload
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={onChange} />
          </label>
        )}
      </div>
      {doc.parseState === "idle" && (
        <div style={{ borderTop: "1px solid #ebebeb", padding: "8px 14px", background: "#fafafa" }}>
          <div style={{ fontSize: "11px", color: "#666", textAlign: "center" }}>PDF, JPG or PNG · Vettit reads the document automatically</div>
        </div>
      )}
    </div>
  );

  const steps = ["Company details", "Documents", "Workers", "Review"];

  if (!mounted) return null;

  if (done) {
    return (
      <div style={{ maxWidth: "480px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px", color: "#3a7d44" }}>✓</div>
        <div style={{ fontSize: "16px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>{company.name} added</div>
        <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "24px" }}>
          {company.name} has been added to your contractor register and is now active on {selectedSites.join(", ")}.
        </div>
        <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "14px 16px", marginBottom: "24px", textAlign: "left" }}>
          <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" }}>Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Company</div>
              <div style={{ color: "#111", fontWeight: 500 }}>{company.name}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Entity type</div>
              <div style={{ color: "#111" }}>{entityType === "sole_trader" ? "Sole trader / Working director" : "Company / Partnership"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Trade</div>
              <div style={{ color: "#111" }}>{company.trade || "Not specified"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Contact</div>
              <div style={{ color: "#111" }}>{company.contactFirst} {company.contactLast}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Active on</div>
              <div style={{ color: "#111" }}>{selectedSites.join(", ")}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Documents</div>
              <div style={{ color: "#111" }}>{companyDocs.filter((d) => d.parseState === "verified").length} of {companyDocs.length} verified</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Contractor Statement</div>
              <div style={{ color: "#3a7d44", fontWeight: 500 }}>✓ Declared and date stamped</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
              <div style={{ color: "#666" }}>Workers</div>
              <div style={{ color: "#111" }}>{workers.length} added</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <a href="/" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}>Back to dashboard</a>
          <a href="/contractor/add" style={{ display: "inline-block", padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", fontSize: "12px", textDecoration: "none", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}>Add another</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>ADD CONTRACTOR MANUALLY</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>Builder uploads docs on the contractor behalf — no invite email sent</div>
        </div>
        <a href="/" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>← Back to dashboard</a>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 24px 64px" }}>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, background: i < step ? "#3a7d44" : i === step ? "#111" : "#f0f0f0", color: i < step ? "#fff" : i === step ? "#fff" : "#aaa", flexShrink: 0 }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: "10px", color: i === step ? "#111" : i < step ? "#3a7d44" : "#aaa", fontWeight: i === step ? 500 : 400, whiteSpace: "nowrap" }}>{s}</div>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: i < step ? "#3a7d44" : "#d0d0d0", margin: "0 8px", marginBottom: "16px" }} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Business structure</div>
              </div>
              <div style={{ padding: "12px 14px", display: "flex", gap: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                  <input type="radio" name="entity" checked={entityType === "company"} onChange={() => handleEntityChange("company")} style={{ accentColor: "#111" }} />
                  Company / Partnership
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                  <input type="radio" name="entity" checked={entityType === "sole_trader"} onChange={() => handleEntityChange("sole_trader")} style={{ accentColor: "#111" }} />
                  Sole trader / Working director
                </label>
              </div>
              {entityType === "sole_trader" && (
                <div style={{ margin: "0 14px 12px", padding: "10px 12px", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "2px", fontSize: "12px", color: "#7c4e00", lineHeight: 1.6 }}>
                  Sole traders are not covered by their own workers compensation policy. Accident and illness insurance is required.
                </div>
              )}
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Company details</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  {lbl("Company name")}
                  <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} placeholder="e.g. Rapid Demo Co Pty Ltd" style={inputStyle} />
                </div>
                <div>
                  {lbl("ABN", "Optional")}
                  <input value={company.abn} onChange={(e) => setCompany({ ...company, abn: e.target.value })} placeholder="e.g. 51 824 753 556" style={inputStyle} />
                </div>
                <div>
                  {lbl("Trade", "Selecting a trade adds the relevant licence documents on the next step automatically")}
                  <select value={company.trade} onChange={(e) => handleTradeChange(e.target.value)} style={{ ...inputStyle, background: "#fff" }}>
                    <option value="">Select trade...</option>
                    <option value="plumber">Plumbing</option>
                    <option value="electrician">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="tiling">Tiling</option>
                    <option value="concretor">Concreting</option>
                    <option value="demolition">Demolition</option>
                    <option value="scaffolder">Scaffolding / Rigging</option>
                    <option value="hvac">HVAC</option>
                    <option value="gasfitter">Gas Fitting</option>
                    <option value="labourer">Labourer</option>
                    <option value="crane">Crane Operation</option>
                    <option value="forklift">Forklift / Plant Operation</option>
                    <option value="heavyvehicle">Heavy Vehicle</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Contact person</div>
                <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Added automatically as first worker</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    {lbl("First name")}
                    <input value={company.contactFirst} onChange={(e) => setCompany({ ...company, contactFirst: e.target.value })} placeholder="Tom" style={inputStyle} />
                  </div>
                  <div>
                    {lbl("Last name")}
                    <input value={company.contactLast} onChange={(e) => setCompany({ ...company, contactLast: e.target.value })} placeholder="Richards" style={inputStyle} />
                  </div>
                </div>
                <div>
                  {lbl("Email")}
                  <input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} placeholder="tom@rapiddemo.com.au" style={inputStyle} />
                </div>
                <div>
                  {lbl("Mobile")}
                  <input value={company.mobile} onChange={(e) => setCompany({ ...company, mobile: e.target.value })} placeholder="0400 000 000" style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "24px" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Active on which sites</div>
              </div>
              <div>
                {sites.map((s, i) => (
                  <label key={s} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderBottom: i < sites.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer", background: selectedSites.includes(s) ? "#f5f5f5" : "#fff" }}>
                    <input type="checkbox" checked={selectedSites.includes(s)} onChange={() => setSelectedSites((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                    <div style={{ fontSize: "13px", color: "#111", fontWeight: selectedSites.includes(s) ? 500 : 400 }}>{s}</div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setStep(1)} disabled={!company.name || !company.contactFirst || selectedSites.length === 0} style={btnPrimary(!company.name || !company.contactFirst || selectedSites.length === 0)}>
                Next — upload documents →
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Company documents</div>
              <div style={{ fontSize: "11px", color: "#666", marginTop: "3px" }}>
                {company.trade ? `Documents required for ${company.trade} — upload each one` : "Upload each document — Vettit reads and verifies automatically"}
              </div>
            </div>

            {companyDocs.map((doc) => (
              <DocUploadCard key={doc.name} doc={doc} onChange={(e) => handleCompanyFile(doc.name, e)} />
            ))}

            <div style={{ border: contractorStatement ? "1px solid #a5d6a7" : "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginTop: "16px", marginBottom: "8px", background: contractorStatement ? "#f9fdf9" : "#fff" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#111" }}>Contractor Statement — Statutory Declaration</div>
                <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Required by law before payment can be made</div>
              </div>
              <div style={{ padding: "14px" }}>
                <div style={{ fontSize: "12px", color: "#333", lineHeight: 1.8, marginBottom: "14px", padding: "12px 14px", background: "#f9f9f9", borderRadius: "2px", border: "1px solid #ebebeb" }}>
                  I declare that as at today's date: all workers compensation insurance premiums have been paid in full; all wages and entitlements payable to workers engaged under this contract have been paid in full; all superannuation contributions required by law have been paid; and all payroll tax obligations have been met. I understand that making a false or misleading statutory declaration is an offence under Australian law.
                </div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: requiredDocsVerified ? "pointer" : "not-allowed", opacity: requiredDocsVerified ? 1 : 0.5 }}>
                  <input type="checkbox" checked={contractorStatement} disabled={!requiredDocsVerified} onChange={(e) => setContractorStatement(e.target.checked)} style={{ accentColor: "#3a7d44", width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }} />
                  <div style={{ fontSize: "13px", color: "#111", fontWeight: contractorStatement ? 500 : 400 }}>
                    I confirm the above declaration is true and correct as at {new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </label>
                {!requiredDocsVerified && <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>Upload all required documents above before confirming this declaration</div>}
                {contractorStatement && <div style={{ fontSize: "11px", color: "#3a7d44", marginTop: "8px", fontWeight: 500 }}>✓ Declaration recorded — date and time stamped</div>}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button onClick={() => setStep(0)} style={btnOutline}>← Back</button>
              <button onClick={() => setStep(2)} disabled={!canProceed} style={btnPrimary(!canProceed)}>
                Next — add workers →
              </button>
            </div>
            {!canProceed && (
              <div style={{ fontSize: "11px", color: "#c0392b", textAlign: "right", marginTop: "6px" }}>
                {!requiredDocsVerified ? "Upload all required documents to continue" : "Confirm the Contractor Statement to continue"}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Workers on site</div>
              <div style={{ fontSize: "11px", color: "#666", marginTop: "3px" }}>Add each worker and upload their White Card and licences</div>
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
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      {lbl("First name")}
                      <input value={newWorker.firstName} onChange={(e) => setNewWorker({ ...newWorker, firstName: e.target.value })} placeholder="Dave" style={inputStyle} />
                    </div>
                    <div>
                      {lbl("Last name")}
                      <input value={newWorker.lastName} onChange={(e) => setNewWorker({ ...newWorker, lastName: e.target.value })} placeholder="Smith" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    {lbl("Role on site")}
                    <select value={newWorker.role} onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value, licences: [] })} style={{ ...inputStyle, background: "#fff" }}>
                      <option value="">Select role...</option>
                      <option value="supervisor">Supervisor / Manager</option>
                      <option value="labourer">Labourer</option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="carpentry">Carpenter</option>
                      <option value="scaffolder">Scaffolder / Rigger</option>
                      <option value="crane">Crane Operator</option>
                      <option value="forklift">Forklift Operator</option>
                      <option value="demolition">Demolition / Asbestos</option>
                      <option value="heavyvehicle">Heavy Vehicle Driver</option>
                    </select>
                  </div>
                  <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #ebebeb", cursor: "pointer" }}>
                      <div>
                        <div style={{ fontSize: "13px", color: "#111" }}>Australian citizen or permanent resident</div>
                        <div style={{ fontSize: "11px", color: "#666", marginTop: "1px" }}>If no, proof of right to work required</div>
                      </div>
                      <input type="checkbox" checked={newWorker.citizen} onChange={(e) => setNewWorker({ ...newWorker, citizen: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", cursor: "pointer" }}>
                      <div>
                        <div style={{ fontSize: "13px", color: "#111" }}>Working at heights on this site</div>
                        <div style={{ fontSize: "11px", color: "#666", marginTop: "1px" }}>Requires Working at Heights certification</div>
                      </div>
                      <input type="checkbox" checked={newWorker.heights} onChange={(e) => setNewWorker({ ...newWorker, heights: e.target.checked })} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                    </label>
                  </div>
                  <div>
                    {lbl("White Card")}
                    <div style={{ border: newWorker.whiteCardState === "verified" ? "1px solid #a5d6a7" : "1px solid #d0d0d0", borderRadius: "2px", padding: "10px 12px", background: newWorker.whiteCardState === "verified" ? "#f9fdf9" : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: "12px", color: "#555" }}>{newWorker.whiteCardFile || "No file selected"}</div>
                      {newWorker.whiteCardState !== "verified" && newWorker.whiteCardState !== "reading" && (
                        <label style={{ padding: "4px 10px", background: "#111", color: "#fff", border: "none", borderRadius: "2px", fontSize: "11px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                          Upload
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={handleWhiteCardFile} />
                        </label>
                      )}
                      {newWorker.whiteCardState === "verified" && <span style={{ fontSize: "11px", padding: "3px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px", fontWeight: 500 }}>Verified</span>}
                    </div>
                  </div>
                  {licenceOptions[newWorker.role] && (
                    <div>
                      {lbl("Licences held")}
                      <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                        {licenceOptions[newWorker.role].map((lic, i) => {
                          const coveredBy = isLicenceCovered(lic, newWorker.licences);
                          return (
                            <div key={lic} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: i < licenceOptions[newWorker.role].length - 1 ? "1px solid #f0f0f0" : "none", background: coveredBy ? "#f9fdf9" : "#fff" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: coveredBy ? "default" : "pointer", flex: 1, fontSize: "12px", color: coveredBy ? "#3a7d44" : "#111" }}>
                                <input type="checkbox" checked={newWorker.licences.includes(lic) || !!coveredBy} disabled={!!coveredBy} onChange={() => !coveredBy && toggleLicence(lic)} style={{ accentColor: "#3a7d44", width: "13px", height: "13px" }} />
                                {lic}
                              </label>
                              {coveredBy && <span style={{ fontSize: "10px", padding: "1px 6px", background: "#e8f5e9", color: "#3a7d44", border: "1px solid #a5d6a7", borderRadius: "2px" }}>Covered by {coveredBy.split(" ").slice(-1)[0]}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => setShowAddWorker(false)} style={btnOutline}>Cancel</button>
                    <button onClick={addWorker} disabled={!newWorker.firstName || !newWorker.role} style={btnPrimary(!newWorker.firstName || !newWorker.role)}>Add worker</button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddWorker(true)} style={{ width: "100%", padding: "9px", border: "1px dashed #d0d0d0", background: "#fafafa", color: "#555", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", marginBottom: "16px" }}>
                + Add a worker
              </button>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)} style={btnOutline}>← Back</button>
              <button onClick={() => setStep(3)} style={btnPrimary(false)}>Next — review →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px" }}>Review before saving</div>

              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".07em" }}>Company</div>
                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
                    <div style={{ color: "#666" }}>Company name</div>
                    <div style={{ color: "#111", fontWeight: 500 }}>{company.name}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
                    <div style={{ color: "#666" }}>Entity type</div>
                    <div style={{ color: "#111" }}>{entityType === "sole_trader" ? "Sole trader / Working director" : "Company / Partnership"}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
                    <div style={{ color: "#666" }}>Trade</div>
                    <div style={{ color: "#111" }}>{company.trade || "Not specified"}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
                    <div style={{ color: "#666" }}>Contact</div>
                    <div style={{ color: "#111" }}>{company.contactFirst} {company.contactLast} · {company.email} · {company.mobile}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", fontSize: "12px" }}>
                    <div style={{ color: "#666" }}>Active on</div>
                    <div style={{ color: "#111" }}>{selectedSites.join(", ")}</div>
                  </div>
                </div>
              </div>

              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "12px" }}>
                <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".07em" }}>Documents</div>
                <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {companyDocs.map((doc) => (
                    <div key={doc.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <div style={{ color: "#555" }}>{doc.name}</div>
                      <div style={{ color: doc.parseState === "verified" ? "#3a7d44" : doc.required ? "#c0392b" : "#888", fontWeight: 500 }}>
                        {doc.parseState === "verified" ? `Verified · expires ${doc.parsedExpiry}` : doc.required ? "Not uploaded" : "Not provided"}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "4px", paddingTop: "8px", borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ color: "#555" }}>Contractor Statement</div>
                    <div style={{ color: "#3a7d44", fontWeight: 500 }}>✓ Declared and date stamped</div>
                  </div>
                </div>
              </div>

              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "24px" }}>
                <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".07em" }}>Workers</div>
                <div style={{ padding: "12px 14px" }}>
                  {workers.length === 0 ? (
                    <div style={{ fontSize: "12px", color: "#666" }}>No workers added</div>
                  ) : (
                    workers.map((w) => (
                      <div key={w.id} style={{ fontSize: "12px", color: "#111", padding: "4px 0", borderBottom: "1px solid #f5f5f5" }}>
                        {w.firstName} {w.lastName} — {w.role}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(2)} style={btnOutline}>← Back</button>
              <button onClick={() => setDone(true)} style={{ ...btnPrimary(false), background: "#3a7d44" }}>
                Save contractor →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}