"use client";
import { useState } from "react";

export default function NewSite() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    suburb: "",
    state: "QLD",
    postcode: "",
    supervisorFirst: "",
    supervisorLast: "",
    supervisorMobile: "",
    supervisorEmail: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0",
    fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Montserrat, sans-serif",
  };

  const lbl = (text: string, sub?: string) => (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{sub}</div>}
    </div>
  );

  const canSubmit = form.name && form.address && form.supervisorFirst && form.supervisorMobile;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "480px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "20px", color: "#3a7d44" }}>✓</div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>{form.name} created</div>
        <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, marginBottom: "24px" }}>
          Your new site is ready. You can now invite contractors to this site.
        </div>
        <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "14px 16px", marginBottom: "24px", textAlign: "left" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" }}>Site summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              ["Site name", form.name],
              ["Address", `${form.address}, ${form.suburb} ${form.state} ${form.postcode}`],
              ["Supervisor", `${form.supervisorFirst} ${form.supervisorLast}`],
              ["Mobile", form.supervisorMobile],
              ["Email", form.supervisorEmail],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "120px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#555" }}>{label}</div>
                <div style={{ color: "#111", fontWeight: label === "Site name" ? 500 : 400 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <a href="/sites" style={{ display: "inline-block", padding: "9px 20px", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Montserrat, sans-serif" }}>View all sites</a>
          <button onClick={() => setSubmitted(false)} style={{ padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Add another site</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>ADD NEW SITE</div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>Create a site to start inviting contractors</div>
        </div>
        <a href="/sites" style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}>← Back to sites</a>
      </div>

      <div style={{ maxWidth: "560px", margin: "32px auto", padding: "0 24px 64px" }}>

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".08em" }}>Site details</div>
          </div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              {lbl("Site / project name")}
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Paddington Townhouses — Stage 2" style={inputStyle} />
            </div>
            <div>
              {lbl("Street address")}
              <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="e.g. 42 Given Terrace" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
              <div>
                {lbl("Suburb")}
                <input value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="e.g. Paddington" style={inputStyle} />
              </div>
              <div>
                {lbl("State")}
                <select value={form.state} onChange={(e) => update("state", e.target.value)} style={{ ...inputStyle, background: "#fff" }}>
                  <option>QLD</option>
                  <option>NSW</option>
                  <option>VIC</option>
                  <option>WA</option>
                  <option>SA</option>
                  <option>TAS</option>
                  <option>ACT</option>
                  <option>NT</option>
                </select>
              </div>
              <div>
                {lbl("Postcode")}
                <input value={form.postcode} onChange={(e) => update("postcode", e.target.value)} placeholder="4064" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".08em" }}>Site supervisor</div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Primary contact for this site — receives compliance alerts</div>
          </div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                {lbl("First name")}
                <input value={form.supervisorFirst} onChange={(e) => update("supervisorFirst", e.target.value)} placeholder="James" style={inputStyle} />
              </div>
              <div>
                {lbl("Last name")}
                <input value={form.supervisorLast} onChange={(e) => update("supervisorLast", e.target.value)} placeholder="Foreman" style={inputStyle} />
              </div>
            </div>
            <div>
              {lbl("Mobile number")}
              <input value={form.supervisorMobile} onChange={(e) => update("supervisorMobile", e.target.value)} placeholder="0400 000 000" style={inputStyle} />
            </div>
            <div>
              {lbl("Email address")}
              <input value={form.supervisorEmail} onChange={(e) => update("supervisorEmail", e.target.value)} placeholder="james@hartleyconstructions.com.au" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <a href="/sites" style={{ padding: "9px 20px", background: "#fff", color: "#111", border: "1px solid #d0d0d0", fontSize: "13px", borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>Cancel</a>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ padding: "9px 20px", background: canSubmit ? "#111" : "#aaa", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, borderRadius: "2px", cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "Montserrat, sans-serif" }}
          >
            Create site
          </button>
        </div>

      </div>
    </div>
  );
}