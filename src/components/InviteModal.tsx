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
};

export default function InviteModal({ onClose }: { onClose: () => void }) {
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>(["Public liability insurance", "Workers compensation", "Trade licence", "SWMS"]);
  const [hasSubs, setHasSubs] = useState(false);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [showAddSub, setShowAddSub] = useState(false);
  const [newSub, setNewSub] = useState({ name: "", trade: "", contactFirst: "", contactLast: "", email: "" });

  const toggleSite = (name: string) => {
    setSelectedSites((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);
  };

  const toggleDoc = (name: string) => {
    setSelectedDocs((prev) => prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]);
  };

  const addSub = () => {
    if (!newSub.name || !newSub.email) return;
    setSubcontractors((prev) => [...prev, { ...newSub, id: Date.now() }]);
    setNewSub({ name: "", trade: "", contactFirst: "", contactLast: "", email: "" });
    setShowAddSub(false);
  };

  const removeSub = (id: number) => {
    setSubcontractors((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", width: "100%", maxWidth: "500px", borderRadius: "2px", border: "1px solid #d0d0d0", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Invite a contractor</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>One email sent. Vettit handles the follow-up.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "18px", color: "#888", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "0", overflowY: "auto", flex: 1 }}>

          {/* SECTION 1 — COMPANY */}
          <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px" }}>Company details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Company name</label>
                <input type="text" placeholder="e.g. Rapid Demo Co Pty Ltd" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Trade category</label>
                <select style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif", background: "#fff" }}>
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

          {/* SECTION 2 — CONTACT PERSON */}
          <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "4px" }}>Contact person</div>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "12px" }}>This person receives the invite and is added as a worker automatically</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>First name</label>
                  <input type="text" placeholder="Tom" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Last name</label>
                  <input type="text" placeholder="Richards" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Email</label>
                <input type="email" placeholder="tom@rapiddemo.com.au" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "5px" }}>Role on site</label>
                <select style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif", background: "#fff" }}>
                  <option value="">Select role...</option>
                  <option>Labourer</option>
                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>Scaffolder / Rigger</option>
                  <option>Crane Operator</option>
                  <option>Forklift / Plant Operator</option>
                  <option>EWP / Hoist Operator</option>
                  <option>Demolition / Asbestos</option>
                  <option>Heavy Vehicle Driver</option>
                  <option>Supervisor / Manager</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3 — SITES */}
          <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px" }}>Vetting for which sites</div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              {sites.map((s, i) => (
                <label key={s.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: i < sites.length - 1 ? "1px solid #ebebeb" : "none", cursor: "pointer", background: selectedSites.includes(s.name) ? "#f5f5f5" : "#fff" }}>
                  <input type="checkbox" checked={selectedSites.includes(s.name)} onChange={() => toggleSite(s.name)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  <div>
                    <div style={{ fontSize: "13px", color: "#111", fontWeight: selectedSites.includes(s.name) ? 500 : 400 }}>{s.name}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{s.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* SECTION 4 — COMPANY DOCS */}
          <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "4px" }}>Company documents</div>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "12px" }}>Verified once — applies across all sites</div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", padding: "8px 12px" }}>
              {companyDocs.map((doc, i) => (
                <label key={doc} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: i < companyDocs.length - 1 ? "1px solid #f0f0f0" : "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                  <input type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => toggleDoc(doc)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  {doc}
                </label>
              ))}
            </div>
          </div>

          {/* SECTION 5 — SITE DOCS */}
          <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "4px" }}>Site documents</div>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "12px" }}>Required per site — collected for each engagement</div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", padding: "8px 12px" }}>
              {siteDocs.map((doc, i) => (
                <label key={doc} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: i < siteDocs.length - 1 ? "1px solid #f0f0f0" : "none", cursor: "pointer", fontSize: "13px", color: "#111" }}>
                  <input type="checkbox" checked={selectedDocs.includes(doc)} onChange={() => toggleDoc(doc)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
                  {doc}
                </label>
              ))}
            </div>
          </div>

          {/* SECTION 6 — SUBCONTRACTORS */}
          <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #ebebeb" }}>
            <div style={{ fontSize: "10px", fontWeight: 500, color: "#999", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "4px" }}>Subcontractors</div>
            <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "12px" }}>Does this contractor bring subbies on site? Add them here and Vettit will invite them separately</div>

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
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{sub.trade} · {sub.contactFirst} {sub.contactLast} · {sub.email}</div>
                    </div>
                    <button onClick={() => removeSub(sub.id)} style={{ background: "none", border: "none", fontSize: "16px", color: "#aaa", cursor: "pointer", lineHeight: 1 }}>×</button>
                  </div>
                ))}

                {showAddSub ? (
                  <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "4px" }}>Subcontractor company name</label>
                      <input value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} placeholder="e.g. QLD Pipe Specialists" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "4px" }}>Trade</label>
                      <input value={newSub.trade} onChange={(e) => setNewSub({ ...newSub, trade: e.target.value })} placeholder="e.g. Plumbing" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "4px" }}>Contact first name</label>
                        <input value={newSub.contactFirst} onChange={(e) => setNewSub({ ...newSub, contactFirst: e.target.value })} placeholder="Steve" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "4px" }}>Contact last name</label>
                        <input value={newSub.contactLast} onChange={(e) => setNewSub({ ...newSub, contactLast: e.target.value })} placeholder="Moore" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 500, color: "#555", display: "block", marginBottom: "4px" }}>Contact email</label>
                      <input value={newSub.email} onChange={(e) => setNewSub({ ...newSub, email: e.target.value })} placeholder="steve@qldpipe.com.au" style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }} />
                    </div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => setShowAddSub(false)} style={{ padding: "6px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Cancel</button>
                      <button onClick={addSub} style={{ padding: "6px 12px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Add subcontractor</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddSub(true)} style={{ width: "100%", padding: "8px", border: "1px dashed #d0d0d0", background: "#fafafa", color: "#555", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>
                    + Add a subcontractor
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SEND */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button style={{ width: "100%", padding: "10px", background: "#111", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
              Send invite{subcontractors.length > 0 ? `s — ${subcontractors.length + 1} emails going out` : " — Vettit handles the rest"}
            </button>
            <div style={{ fontSize: "11px", color: "#aaa", textAlign: "center" }}>
              {subcontractors.length > 0
                ? `Rapid Demo Co + ${subcontractors.length} subcontractor${subcontractors.length > 1 ? "s" : ""} will each receive their own invite`
                : "Reminders sent automatically on day 2, 5 and 7 if incomplete"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}