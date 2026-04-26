"use client";
import { useState } from "react";

const sites = [
  { name: "Paddington Townhouses", sub: "Stage 2 — active" },
  { name: "Bulimba Apartments", sub: "Stage 1 — active" },
  { name: "Newstead Commercial", sub: "Fitout — planning" },
];

const companyDocOptions = [
  { name: "Public liability insurance", note: "Minimum $20M cover" },
  { name: "Workers compensation insurance", note: "Required for all contractors with employees" },
  { name: "Contractor licence", note: "State-issued building or trade contractor licence" },
  { name: "Professional indemnity insurance", note: "Required for design, engineering and fire protection trades" },
  { name: "Accident and illness insurance", note: "Required for sole traders not covered by workers compensation" },
];

const siteDocOptions = [
  { name: "SWMS", note: "Safe Work Method Statement — required for high risk work" },
  { name: "Site induction", note: "Completed before first day on site" },
];

const tradeConditionalDocs: Record<string, { name: string; note: string }[]> = {
  electrician: [{ name: "Electrical Contractor Licence", note: "Required for all electrical trades" }],
  plumber: [{ name: "Plumbing Contractor Licence", note: "Required for all plumbing trades" }],
  gasfitter: [{ name: "Gas Fitting Contractor Licence", note: "Required for gas fitting trades" }],
  hvac: [
    { name: "Refrigeration and Air Conditioning Licence", note: "Required for all HVAC trades — issued by state licensing authority" },
    { name: "Gas Fitting Contractor Licence", note: "Required only if work involves gas-fired equipment" },
    { name: "Electrical Contractor Licence", note: "Required only if work involves electrical connections" },
  ],
  demolition: [
    { name: "Asbestos Removal Licence — Class A (friable)", note: "Required for friable asbestos removal" },
    { name: "Asbestos Removal Licence — Class B (non-friable)", note: "Required for non-friable asbestos removal" },
  ],
  scaffolder: [{ name: "SafeWork High Risk Work Licence — Scaffolding/Rigging", note: "Required for scaffolding and rigging trades" }],
  crane: [{ name: "SafeWork High Risk Work Licence — Crane Operation", note: "Required for crane operators" }],
};

type Subcontractor = {
  id: number;
  name: string;
  trade: string;
  contactFirst: string;
  contactLast: string;
  email: string;
  mobile: string;
};

export default function InviteContractor() {
  const [trade, setTrade] = useState("");
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([
    "Public liability insurance",
    "Workers compensation insurance",
    "Contractor licence",
    "SWMS",
    "Site induction",
  ]);
  const [hasSubs, setHasSubs] = useState(false);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [showAddSub, setShowAddSub] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", trade: "", contactFirst: "", contactLast: "", email: "", mobile: "" });
  const [sent, setSent] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactFirst, setContactFirst] = useState("");

  const allTradeDocs = Object.values(tradeConditionalDocs).flat().map((x) => x.name);

  const handleTradeChange = (newTrade: string) => {
    setTrade(newTrade);
    if (newTrade && tradeConditionalDocs[newTrade]) {
      const newDocs = tradeConditionalDocs[newTrade].map((d) => d.name);
      setSelectedDocs((prev) => [...prev.filter((d) => !allTradeDocs.includes(d)), ...newDocs]);
    } else {
      setSelectedDocs((prev) => prev.filter((d) => !allTradeDocs.includes(d)));
    }
  };

  const toggleDoc = (name: string) => {
    setSelectedDocs((prev) => prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]);
  };

  const addSub = () => {
    if (!newSub.name || !newSub.email) return;
    setSubcontractors((prev) => [...prev, { ...newSub, id: Date.now() }]);
    setNewSub({ name: "", trade: "", contactFirst: "", contactLast: "", email: "", mobile: "" });
    setShowAddSub(false);
  };

  const removeSub = (id: number) => {
    setSubcontractors((prev) => prev.filter((s) => s.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0",
    fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Montserrat, sans-serif",
  };

  const lbl = (text: string, sub?: string) => (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#666", marginTop: "1px" }}>{sub}</div>}
    </div>
  );

  const SectionHead = ({ text, sub }: { text: string; sub?: string }) => (
    <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", textTransform: "uppercase" as const, letterSpacing: ".08em" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{sub}</div>}
    </div>
  );

  const DocRow = ({ name, note, checked, onChange, last }: { name: string; note?: string; checked: boolean; onChange: () => void; last?: boolean }) => (
    <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 16px", borderBottom: last ? "none" : "1px solid #f0f0f0", cursor: "pointer", background: checked ? "#fafffe" : "#fff" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: "#111", width: "14px", height: "14px", marginTop: "2px", flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: "13px", color: "#111", fontWeight: checked ? 500 : 400 }}>{name}</div>
        {note && <div style={{ fontSize: "11px", color: "#666", marginTop: "1px" }}>{note}</div>}
      </div>
    </label>
  );

  const conditionalDocs = trade && tradeConditionalDocs[trade] ? tradeConditionalDocs[trade] : [];

  if (sent) {
    return (
      <div style={{ maxWidth: "480px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px", color: "#3a7d44" }}>✓</div>
        <div style={{ fontSize: "16px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Invite sent to {companyName}</div>
        <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "24px" }}>
          {contactFirst} will receive a secure link to submit their compliance documents.<br />
          Reminders will be sent per your <a href="/settings#notifications" style={{ color: "#111", fontWeight: 500 }}>notification settings</a>.
          {subcontractors.length > 0 && <><br />Invites also sent to {subcontractors.length} subcontractor{subcontractors.length > 1 ? "s" : ""}.</>}
        </div>
        <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "14px 16px", marginBottom: "24px", textAlign: "left" }}>
          <div style={{ fontSize: "10px", fontWeight: 500, color: "#666", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" }}>Documents requested</div>
          {selectedDocs.map((d) => (
            <div key={d} style={{ fontSize: "12px", color: "#555", padding: "3px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#3a7d44" }}>✓</span>{d}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <a href="/" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}>Back to dashboard</a>
          <button onClick={() => { setSent(false); setCompanyName(""); setContactFirst(""); setSelectedSites([]); setSubcontractors([]); setTrade(""); }} style={{ padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Invite another</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>INVITE A CONTRACTOR</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>One email sent — Vettit handles all the follow-ups automatically</div>
        </div>
        <a href="/" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>← Back to dashboard</a>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px 64px" }}>

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <SectionHead text="Company details" />
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              {lbl("Company name")}
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Rapid Demo Co Pty Ltd" style={inputStyle} />
            </div>
            <div>
              {lbl("Trade category", "Selecting a trade adds the relevant licence documents automatically")}
              <select value={trade} onChange={(e) => handleTradeChange(e.target.value)} style={{ ...inputStyle, background: "#fff" }}>
                <option value="">Select trade...</option>
                <option value="plumber">Plumbing</option>
                <option value="electrician">Electrical</option>
                <option value="concreting">Concreting</option>
                <option value="framing">Framing</option>
                <option value="scaffolder">Scaffolding / Rigging</option>
                <option value="demolition">Demolition</option>
                <option value="crane">Crane Operation</option>
                <option value="earthworks">Earthworks</option>
                <option value="painting">Painting</option>
                <option value="tiling">Tiling</option>
                <option value="carpentry">Carpentry</option>
                <option value="hvac">HVAC</option>
                <option value="gasfitter">Gas Fitting</option>
                <option value="structural">Structural Steel</option>
                <option value="heavyvehicle">Heavy Vehicle</option>
                <option value="labourer">Labourer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <SectionHead text="Contact person" sub="Receives the invite — added automatically as first worker" />
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                {lbl("First name")}
                <input value={contactFirst} onChange={(e) => setContactFirst(e.target.value)} placeholder="Tom" style={inputStyle} />
              </div>
              <div>
                {lbl("Last name")}
                <input placeholder="Richards" style={inputStyle} />
              </div>
            </div>
            <div>
              {lbl("Email")}
              <input type="email" placeholder="tom@rapiddemo.com.au" style={inputStyle} />
            </div>
            <div>
              {lbl("Mobile")}
              <input type="tel" placeholder="0400 000 000" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <SectionHead text="Vetting for which sites" />
          <div>
            {sites.map((s, i) => (
              <label key={s.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: i < sites.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer", background: selectedSites.includes(s.name) ? "#f5f5f5" : "#fff" }}>
                <input type="checkbox" checked={selectedSites.includes(s.name)} onChange={() => setSelectedSites((prev) => prev.includes(s.name) ? prev.filter((x) => x !== s.name) : [...prev, s.name])} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                <div>
                  <div style={{ fontSize: "13px", color: "#111", fontWeight: selectedSites.includes(s.name) ? 500 : 400 }}>{s.name}</div>
                  <div style={{ fontSize: "11px", color: "#666" }}>{s.sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <SectionHead text="Company documents required" sub="Tick what you require from this contractor" />
          {companyDocOptions.map((doc, i) => (
            <DocRow key={doc.name} name={doc.name} note={doc.note} checked={selectedDocs.includes(doc.name)} onChange={() => toggleDoc(doc.name)} last={i === companyDocOptions.length - 1} />
          ))}
        </div>

        {conditionalDocs.length > 0 && (
          <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
            <SectionHead text="Trade-specific licences" sub="Added automatically based on the trade selected above — untick any that do not apply" />
            {conditionalDocs.map((doc, i) => (
              <DocRow key={doc.name} name={doc.name} note={doc.note} checked={selectedDocs.includes(doc.name)} onChange={() => toggleDoc(doc.name)} last={i === conditionalDocs.length - 1} />
            ))}
          </div>
        )}

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <SectionHead text="Site documents required" sub="Required per site — collected for each engagement" />
          {siteDocOptions.map((doc, i) => (
            <DocRow key={doc.name} name={doc.name} note={doc.note} checked={selectedDocs.includes(doc.name)} onChange={() => toggleDoc(doc.name)} last={i === siteDocOptions.length - 1} />
          ))}
        </div>

        <div style={{ padding: "12px 16px", border: "1px solid #a5d6a7", background: "#f9fdf9", borderRadius: "2px", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", color: "#3a7d44", fontWeight: 500, marginBottom: "3px" }}>✓ Contractor Statement collected automatically</div>
          <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.7 }}>
            Vettit collects a statutory declaration from every contractor confirming workers compensation, superannuation, wages and payroll tax obligations have been met. You do not need to request this separately.
          </div>
        </div>

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "32px" }}>
          <SectionHead text="Subcontractors" sub="Does this contractor bring subbies on site? Add them here and Vettit will invite them separately" />
          <div style={{ padding: "12px 16px" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid #d0d0d0", borderRadius: "2px", cursor: "pointer", marginBottom: hasSubs ? "12px" : "0" }}>
              <div style={{ fontSize: "13px", color: "#111" }}>This contractor brings subcontractors on site</div>
              <input type="checkbox" checked={hasSubs} onChange={(e) => { setHasSubs(e.target.checked); if (!e.target.checked) setSubcontractors([]); }} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
            </label>
            {hasSubs && (
              <div>
                {subcontractors.map((sub) => (
                  <div key={sub.id} style={{ border: "1px solid #d0d0d0", borderRadius: "2px", padding: "10px 12px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{sub.name}</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{sub.trade} · {sub.contactFirst} {sub.contactLast} · {sub.email} · {sub.mobile}</div>
                    </div>
                    <button onClick={() => removeSub(sub.id)} style={{ background: "none", border: "none", fontSize: "16px", color: "#555", cursor: "pointer" }}>×</button>
                  </div>
                ))}
                {showAddSub ? (
                  <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      {lbl("Company name")}
                      <input value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} placeholder="e.g. QLD Pipe Specialists" style={inputStyle} />
                    </div>
                    <div>
                      {lbl("Trade")}
                      <input value={newSub.trade} onChange={(e) => setNewSub({ ...newSub, trade: e.target.value })} placeholder="e.g. Plumbing" style={inputStyle} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        {lbl("Contact first name")}
                        <input value={newSub.contactFirst} onChange={(e) => setNewSub({ ...newSub, contactFirst: e.target.value })} placeholder="Steve" style={inputStyle} />
                      </div>
                      <div>
                        {lbl("Contact last name")}
                        <input value={newSub.contactLast} onChange={(e) => setNewSub({ ...newSub, contactLast: e.target.value })} placeholder="Moore" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      {lbl("Email")}
                      <input value={newSub.email} onChange={(e) => setNewSub({ ...newSub, email: e.target.value })} placeholder="steve@qldpipe.com.au" style={inputStyle} />
                    </div>
                    <div>
                      {lbl("Mobile")}
                      <input value={newSub.mobile} onChange={(e) => setNewSub({ ...newSub, mobile: e.target.value })} placeholder="0400 000 000" style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => setShowAddSub(false)} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Cancel</button>
                      <button onClick={addSub} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Add subcontractor</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddSub(true)} style={{ width: "100%", padding: "8px", border: "1px dashed #d0d0d0", background: "#fafafa", color: "#555", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
                    + Add a subcontractor
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setSent(true)}
            disabled={!companyName || !contactFirst || selectedSites.length === 0}
            style={{ width: "100%", padding: "12px", background: !companyName || !contactFirst || selectedSites.length === 0 ? "#aaa" : "#111", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: !companyName || !contactFirst || selectedSites.length === 0 ? "not-allowed" : "pointer", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}
          >
            Send invite{subcontractors.length > 0 ? `s — ${subcontractors.length + 1} emails going out` : " — Vettit handles the rest"}
          </button>
          <div style={{ fontSize: "11px", color: "#666", textAlign: "center" }}>
            Reminders sent per your <a href="/settings#notifications" style={{ color: "#111", fontWeight: 500, textDecoration: "none" }}>notification settings</a>
          </div>
        </div>

      </div>
    </div>
  );
}