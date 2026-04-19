"use client";
import { useState } from "react";

const sites = [
  { name: "Paddington Townhouses", sub: "Stage 2 — active" },
  { name: "Bulimba Apartments", sub: "Stage 1 — active" },
  { name: "Newstead Commercial", sub: "Fitout — planning" },
];

const companyDocs = ["Public liability insurance", "Workers compensation", "Trade licence"];
const siteDocs = ["SWMS", "Site induction"];

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
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>(["Public liability insurance", "Workers compensation", "Trade licence", "SWMS"]);
  const [hasSubs, setHasSubs] = useState(false);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [showAddSub, setShowAddSub] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", trade: "", contactFirst: "", contactLast: "", email: "", mobile: "" });
  const [sent, setSent] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactFirst, setContactFirst] = useState("");

  const toggleSite = (name: string) => {
    setSelectedSites((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);
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

  const label = (text: string, sub?: string) => (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#666", marginTop: "1px" }}>{sub}</div>}
    </div>
  );

  if (sent) {
    return (
      <div style={{ maxWidth: "480px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px", color: "#3a7d44" }}>✓</div>
        <div style={{ fontSize: "16px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Invite sent to {companyName}</div>
        <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "24px" }}>
          {contactFirst} will receive a secure link to submit their compliance documents.<br />
          Vettit will send automated reminders on day 2, 5 and 7 if incomplete.
          {subcontractors.length > 0 && <><br />Invites also sent to {subcontractors.length} subcontractor{subcontractors.length > 1 ? "s" : ""}.</>}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <a href="/" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}>Back to dashboard</a>
          <button onClick={() => { setSent(false); setCompanyName(""); setContactFirst(""); setSelectedSites([]); setSubcontractors([]); }} style={{ padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Invite another</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Invite a contractor</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>One email sent — Vettit handles all follow-up automatically</div>
        </div>
        <a href="/" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>← Back to dashboard</a>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* COMPANY */}
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ padding: "10px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Company details</div>
          </div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              {label("Company name")}
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Rapid Demo Co Pty Ltd" style={inputStyle} />
            </div>
            <div>
              {label("Trade category")}
              <select style={{ ...inputStyle, background: "#fff" }}>
                <option value="">Select trade...</option>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Concreting</option>
                <option>Framing</option>
                <option>Scaffolding / Rigging</option>
                <option>Demolition</option>
                <option>Crane Operation</option>
                <option>Earthworks</option>
                <option>Painting</option>
                <option>Tiling</option>
                <option>Carpentry</option>
                <option>HVAC</option>
                <option>Structural Steel</option>
                <option>Heavy Vehicle</option>
                <option>Labourer</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ padding: "10px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Contact person</div>
            <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Receives the invite — added automatically as first worker</div>
          </div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                {label("First name")}
                <input value={contactFirst} onChange={(e) => setContactFirst(e.target.value)} placeholder="Tom" style={inputStyle} />
              </div>
              <div>
                {label("Last name")}
                <input placeholder="Richards" style={inputStyle} />
              </div>
            </div>
            <div>
              {label("Email")}
              <input type="email" placeholder="tom@rapiddemo.com.au" style={inputStyle} />
            </div>
            <div>
              {label("Mobile")}
              <input type="tel" placeholder="0400 000 000" style={inputStyle} />
            </div>
            <div>
              {label("Role on site")}
              <select style={{ ...inputStyle, background: "#fff" }}>
                <option value="">Select role...</option>
                <option>Supervisor / Manager</option>
                <option>Labourer</option>
                <option>Plumber</option>
                <option>Electrician</option>
                <option>Scaffolder / Rigger</option>
                <option>Crane Operator</option>
                <option>Forklift / Plant Operator</option>
                <option>EWP / Hoist Operator</option>
                <option>Demolition / Asbestos</option>
                <option>Heavy Vehicle Driver</option>
              </select>
            </div>
          </div>
        </div>

        {/* SITES */}
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ padding: "10px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Vetting for which sites</div>
          </div>
          <div>
            {sites.map((s, i) => (
              <label key={s.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: i < sites.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer", background: selectedSites.includes(s.name) ? "#f5f5f5" : "#fff" }}>
                <input type="checkbox" checked={selectedSites.includes(s.name)} onChange={() => toggleSite(s.name)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                <div>
                  <div style={{ fontSize: "13px", color: "#111", fontWeight: selectedSites.includes(s.name) ? 500 : 400 }}>{s.name}</div>
                  <div style={{ fontSize: "11px", color: "#666" }}>{s.sub}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* COMPANY DOCS */}
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ padding: "10px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Company documents required</div>
            <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Verified once — applies across all sites</div>
          </div>
          <div style={{ padding: "8px 16px" }}>
            {companyDocs.map((doc, i) => (
              <label key={doc} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", borderBottom: i < companyDocs.length - 1 ? "1px solid #f0f0f0" : "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                <input type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => toggleDoc(doc)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                {doc}
              </label>
            ))}
          </div>
        </div>

        {/* SITE DOCS */}
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ padding: "10px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Site documents required</div>
            <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Required per site — collected for each engagement</div>
          </div>
          <div style={{ padding: "8px 16px" }}>
            {siteDocs.map((doc, i) => (
              <label key={doc} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", borderBottom: i < siteDocs.length - 1 ? "1px solid #f0f0f0" : "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                <input type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => toggleDoc(doc)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                {doc}
              </label>
            ))}
          </div>
        </div>

        {/* SUBCONTRACTORS */}
        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "32px" }}>
          <div style={{ padding: "10px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: ".08em" }}>Subcontractors</div>
            <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Does this contractor bring subbies on site? Add them here and Vettit will invite them separately</div>
          </div>
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
                      {label("Company name")}
                      <input value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} placeholder="e.g. QLD Pipe Specialists" style={inputStyle} />
                    </div>
                    <div>
                      {label("Trade")}
                      <input value={newSub.trade} onChange={(e) => setNewSub({ ...newSub, trade: e.target.value })} placeholder="e.g. Plumbing" style={inputStyle} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        {label("Contact first name")}
                        <input value={newSub.contactFirst} onChange={(e) => setNewSub({ ...newSub, contactFirst: e.target.value })} placeholder="Steve" style={inputStyle} />
                      </div>
                      <div>
                        {label("Contact last name")}
                        <input value={newSub.contactLast} onChange={(e) => setNewSub({ ...newSub, contactLast: e.target.value })} placeholder="Moore" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      {label("Email")}
                      <input value={newSub.email} onChange={(e) => setNewSub({ ...newSub, email: e.target.value })} placeholder="steve@qldpipe.com.au" style={inputStyle} />
                    </div>
                    <div>
                      {label("Mobile")}
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

        {/* SEND */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setSent(true)}
            disabled={!companyName || !contactFirst || selectedSites.length === 0}
            style={{ width: "100%", padding: "12px", background: !companyName || !contactFirst || selectedSites.length === 0 ? "#aaa" : "#111", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: !companyName || !contactFirst || selectedSites.length === 0 ? "not-allowed" : "pointer", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}
          >
            Send invite{subcontractors.length > 0 ? `s — ${subcontractors.length + 1} emails going out` : " — Vettit handles the rest"}
          </button>
          <div style={{ fontSize: "11px", color: "#666", textAlign: "center" }}>
            Reminders sent automatically on day 2, 5 and 7 if incomplete
          </div>
        </div>

      </div>
    </div>
  );
}