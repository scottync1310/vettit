"use client";
import { useState } from "react";

const ownerSteps = ["Welcome", "Your company", "Primary user"];
const primarySteps = ["Your site", "First contractor"];

export default function Onboarding() {
  const [ownerStep, setOwnerStep] = useState(0);
  const [primaryStep, setPrimaryStep] = useState(0);
  const [isSameUser, setIsSameUser] = useState(false);
  const [journey, setJourney] = useState<"owner" | "primary">("owner");
  const [ownerDone, setOwnerDone] = useState(false);
  const [primaryDone, setPrimaryDone] = useState(false);

  const [company, setCompany] = useState({
    name: "", abn: "", ownerName: "", ownerEmail: "", billingEmail: "",
  });

  const [primaryUser, setPrimaryUser] = useState({
    firstName: "", lastName: "", email: "", mobile: "", role: "Office Manager",
  });

  const [site, setSite] = useState({
    name: "", address: "", suburb: "", state: "QLD", postcode: "",
    supervisorFirst: "", supervisorLast: "", supervisorMobile: "", supervisorEmail: "",
  });

  const [contractor, setContractor] = useState({
    company: "", trade: "", contactFirst: "", contactLast: "", email: "",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0",
    fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif",
  };

  const label = (text: string, sub?: string) => (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#444", marginTop: "1px" }}>{sub}</div>}
    </div>
  );

  const btnPrimary = (disabled: boolean, green?: boolean): React.CSSProperties => ({
    padding: "9px 24px",
    background: disabled ? "#aaa" : green ? "#3a7d44" : "#111",
    color: "#fff", border: "none", fontSize: "13px", fontWeight: 500,
    borderRadius: "2px", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "Roboto, sans-serif",
  });

  const btnOutline: React.CSSProperties = {
    padding: "9px 20px", border: "1px solid #d0d0d0", background: "#fff",
    color: "#111", fontSize: "13px", borderRadius: "2px", cursor: "pointer",
    fontFamily: "Roboto, sans-serif",
  };

  const handleSameUser = (checked: boolean) => {
    setIsSameUser(checked);
    if (checked) {
      setPrimaryUser((prev) => ({
        ...prev,
        firstName: company.ownerName.split(" ")[0] || "",
        lastName: company.ownerName.split(" ").slice(1).join(" ") || "",
        email: company.ownerEmail,
      }));
    }
  };

  const handlePrimaryUserNext = () => {
    if (isSameUser) {
      setJourney("primary");
      setOwnerStep(3);
    } else {
      setOwnerDone(true);
    }
  };

  // OWNER HANDOFF SCREEN
  if (ownerDone) {
    return (
      <div style={{ fontFamily: "Roboto, sans-serif", minHeight: "100vh", background: "#fff" }}>
        <div style={{ borderBottom: "1px solid #d0d0d0", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "17px", fontWeight: 500, color: "#111", letterSpacing: "-.3px" }}>vett<span style={{ color: "#3a7d44" }}>it</span></span>
        </div>
        <div style={{ maxWidth: "520px", margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px", color: "#3a7d44" }}>✓</div>
          <div style={{ fontSize: "20px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>Account set up — handed off to {primaryUser.firstName}</div>
          <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.8, marginBottom: "28px" }}>
            <strong style={{ color: "#111" }}>{company.name}</strong> is registered on Vettit.<br />
            {primaryUser.firstName} {primaryUser.lastName} has been sent an activation email at <strong style={{ color: "#111" }}>{primaryUser.email}</strong>.<br />
            They will complete the site and contractor setup from there.
          </div>

          <div style={{ border: "1px solid #ffe082", background: "#fff8e1", borderRadius: "2px", padding: "14px 16px", marginBottom: "24px", textAlign: "left" }}>
            <div style={{ fontSize: "12px", color: "#7c4e00", lineHeight: 1.7 }}>
              <strong>What {primaryUser.firstName} sees:</strong> An email with a secure activation link. Once they set their password they will be guided through adding the first site and inviting the first contractor. You will be notified when setup is complete.
            </div>
          </div>

          <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "14px 16px", marginBottom: "28px", textAlign: "left" }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" }}>Account summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#333" }}>Company</div>
                <div style={{ color: "#111", fontWeight: 500 }}>{company.name}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#333" }}>Account owner</div>
                <div style={{ color: "#111" }}>{company.ownerName} · {company.ownerEmail}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#333" }}>Primary user</div>
                <div style={{ color: "#111" }}>{primaryUser.firstName} {primaryUser.lastName} · {primaryUser.role}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#333" }}>Activation sent to</div>
                <div style={{ color: "#111" }}>{primaryUser.email}</div>
              </div>
            </div>
          </div>

          <a href="/" style={{ display: "inline-block", padding: "11px 32px", background: "#111", color: "#fff", fontSize: "13px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
            Go to your dashboard →
          </a>
          <div style={{ fontSize: "11px", color: "#444", marginTop: "12px" }}>You have full access as account owner — sites and contractors will appear once {primaryUser.firstName} completes setup</div>
        </div>
      </div>
    );
  }

  // PRIMARY USER ALL DONE SCREEN
  if (primaryDone) {
    return (
      <div style={{ fontFamily: "Roboto, sans-serif", minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "480px", padding: "0 24px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#e8f5e9", border: "2px solid #3a7d44", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px", color: "#3a7d44" }}>✓</div>
          <div style={{ fontSize: "20px", fontWeight: 500, color: "#111", marginBottom: "8px" }}>All set — you're live.</div>
          <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.8, marginBottom: "28px" }}>
            {company.name || "Your company"} is fully set up on Vettit.<br />
            <strong style={{ color: "#111" }}>{contractor.company}</strong> has been invited to <strong style={{ color: "#111" }}>{site.name}</strong>.<br />
            Vettit handles all reminders and follow-up automatically from here.
          </div>
          <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "14px 16px", marginBottom: "28px", textAlign: "left" }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: "10px" }}>Setup summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#333" }}>First site</div>
                <div style={{ color: "#111", fontWeight: 500 }}>{site.name}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#333" }}>First invite</div>
                <div style={{ color: "#111" }}>{contractor.company} — sent to {contractor.email}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", fontSize: "12px" }}>
                <div style={{ color: "#333" }}>Weekly digest</div>
                <div style={{ color: "#111" }}>Every Monday at 7am to {primaryUser.email}</div>
              </div>
            </div>
          </div>
          <a href="/" style={{ display: "inline-block", padding: "11px 32px", background: "#111", color: "#fff", fontSize: "13px", fontWeight: 500, textDecoration: "none", borderRadius: "2px", fontFamily: "Roboto, sans-serif" }}>
            Go to dashboard →
          </a>
        </div>
      </div>
    );
  }

  const isOwnerJourney = journey === "owner" && ownerStep < 3;
  const steps = isOwnerJourney ? ownerSteps : primarySteps;
  const currentStep = isOwnerJourney ? ownerStep : primaryStep;

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <div style={{ borderBottom: "1px solid #d0d0d0", padding: "0 32px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "17px", fontWeight: 500, color: "#111", letterSpacing: "-.3px" }}>vett<span style={{ color: "#3a7d44" }}>it</span></span>
        <span style={{ fontSize: "11px", color: "#333" }}>
          {isOwnerJourney ? "Account setup — takes 2 minutes" : `Setting up ${company.name || "your account"}`}
        </span>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* PROGRESS */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, background: i < currentStep ? "#3a7d44" : i === currentStep ? "#111" : "#f0f0f0", color: i < currentStep ? "#fff" : i === currentStep ? "#fff" : "#aaa", flexShrink: 0 }}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: "12px", color: i === currentStep ? "#111" : i < currentStep ? "#3a7d44" : "#aaa", fontWeight: i === currentStep ? 500 : 400, whiteSpace: "nowrap" }}>{s}</div>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: i < currentStep ? "#3a7d44" : "#d0d0d0", margin: "0 8px", marginBottom: "16px" }} />}
            </div>
          ))}
        </div>

        {/* OWNER STEP 0 — WELCOME */}
        {journey === "owner" && ownerStep === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 500, color: "#111", marginBottom: "12px", letterSpacing: "-.3px" }}>
              Welcome to vett<span style={{ color: "#3a7d44" }}>it</span>
            </div>
            <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.8, marginBottom: "32px" }}>
              Contractor compliance — done automatically.<br />
              One email to your subcontractor. Vettit handles everything else.
            </div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "32px", textAlign: "left" }}>
              {[
                { num: "1", title: "Set up your company", sub: "Business name, ABN and account owner" },
                { num: "2", title: "Nominate your primary user", sub: "Who manages compliance — you or someone on your team" },
                { num: "3", title: "Add first site + invite first contractor", sub: "Done by you or your primary user — Vettit guides them through it" },
              ].map((item, i) => (
                <div key={item.num} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderBottom: i < 2 ? "1px solid #ebebeb" : "none" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, flexShrink: 0 }}>{item.num}</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{item.title}</div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setOwnerStep(1)} style={{ padding: "11px 32px", background: "#111", color: "#fff", border: "none", fontSize: "13px", fontWeight: 500, borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>
              Get started →
            </button>
          </div>
        )}

        {/* OWNER STEP 1 — COMPANY */}
        {journey === "owner" && ownerStep === 1 && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "#111", marginBottom: "4px" }}>Your company</div>
              <div style={{ fontSize: "13px", color: "#333" }}>Account and billing details</div>
            </div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "24px" }}>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  {label("Company name")}
                  <input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} placeholder="e.g. Hartley Constructions" style={inputStyle} />
                </div>
                <div>
                  {label("ABN")}
                  <input value={company.abn} onChange={(e) => setCompany({ ...company, abn: e.target.value })} placeholder="e.g. 51 824 753 556" style={inputStyle} />
                </div>
                <div>
                  {label("Your name", "Account owner — receives billing and account emails")}
                  <input value={company.ownerName} onChange={(e) => setCompany({ ...company, ownerName: e.target.value })} placeholder="e.g. Mila Hartley" style={inputStyle} />
                </div>
                <div>
                  {label("Your email")}
                  <input value={company.ownerEmail} onChange={(e) => setCompany({ ...company, ownerEmail: e.target.value })} placeholder="mila@hartleyconstructions.com.au" style={inputStyle} />
                </div>
                <div>
                  {label("Billing email", "If different from your email")}
                  <input value={company.billingEmail} onChange={(e) => setCompany({ ...company, billingEmail: e.target.value })} placeholder="accounts@hartleyconstructions.com.au" style={inputStyle} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setOwnerStep(0)} style={btnOutline}>← Back</button>
              <button onClick={() => setOwnerStep(2)} disabled={!company.name || !company.ownerEmail} style={btnPrimary(!company.name || !company.ownerEmail)}>
                Next — primary user →
              </button>
            </div>
          </div>
        )}

        {/* OWNER STEP 2 — PRIMARY USER */}
        {journey === "owner" && ownerStep === 2 && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "#111", marginBottom: "4px" }}>Who manages compliance day to day?</div>
              <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.7 }}>
                This person receives the weekly digest, compliance alerts and unresponsive contractor notifications.
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", border: "1px solid #d0d0d0", borderRadius: "2px", cursor: "pointer", marginBottom: "16px", background: isSameUser ? "#f5f5f5" : "#fff" }}>
              <input type="checkbox" checked={isSameUser} onChange={(e) => handleSameUser(e.target.checked)} style={{ accentColor: "#111", width: "14px", height: "14px" }} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>This is me — I manage compliance myself</div>
                <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>I will complete the site and contractor setup now</div>
              </div>
            </label>

            {!isSameUser && (
              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
                <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                  <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".07em" }}>Primary user details</div>
                  <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>They will receive an activation email to set their password and complete setup</div>
                </div>
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      {label("First name")}
                      <input value={primaryUser.firstName} onChange={(e) => setPrimaryUser({ ...primaryUser, firstName: e.target.value })} placeholder="Sarah" style={inputStyle} />
                    </div>
                    <div>
                      {label("Last name")}
                      <input value={primaryUser.lastName} onChange={(e) => setPrimaryUser({ ...primaryUser, lastName: e.target.value })} placeholder="Jones" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    {label("Email")}
                    <input value={primaryUser.email} onChange={(e) => setPrimaryUser({ ...primaryUser, email: e.target.value })} placeholder="sarah@hartleyconstructions.com.au" style={inputStyle} />
                  </div>
                  <div>
                    {label("Mobile", "For urgent compliance alerts")}
                    <input value={primaryUser.mobile} onChange={(e) => setPrimaryUser({ ...primaryUser, mobile: e.target.value })} placeholder="0400 000 000" style={inputStyle} />
                  </div>
                  <div>
                    {label("Role")}
                    <select value={primaryUser.role} onChange={(e) => setPrimaryUser({ ...primaryUser, role: e.target.value })} style={{ ...inputStyle, background: "#fff" }}>
                      <option>Office Manager</option>
                      <option>Contracts Administrator</option>
                      <option>Site Manager</option>
                      <option>Project Manager</option>
                      <option>Admin</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {!isSameUser && primaryUser.firstName && (
              <div style={{ padding: "12px 14px", border: "1px solid #ffe082", background: "#fff8e1", borderRadius: "2px", marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: "#7c4e00", lineHeight: 1.7 }}>
                  <strong>Handoff:</strong> {primaryUser.firstName} will receive an activation email. They set their password and complete the site and contractor setup. Your account is ready — you go straight to your owner dashboard.
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setOwnerStep(1)} style={btnOutline}>← Back</button>
              <button
                onClick={handlePrimaryUserNext}
                disabled={!isSameUser && (!primaryUser.firstName || !primaryUser.email)}
                style={btnPrimary(!isSameUser && (!primaryUser.firstName || !primaryUser.email))}
              >
                {isSameUser ? "Next — add your first site →" : "Send activation & finish →"}
              </button>
            </div>
          </div>
        )}

        {/* PRIMARY USER STEP 0 — FIRST SITE */}
        {journey === "primary" && primaryStep === 0 && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "#111", marginBottom: "4px" }}>Add your first site</div>
              <div style={{ fontSize: "13px", color: "#333" }}>Add the project you want to vet contractors for first</div>
            </div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "14px" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".07em" }}>Site details</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  {label("Site / project name")}
                  <input value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} placeholder="e.g. Paddington Townhouses — Stage 2" style={inputStyle} />
                </div>
                <div>
                  {label("Street address")}
                  <input value={site.address} onChange={(e) => setSite({ ...site, address: e.target.value })} placeholder="e.g. 42 Given Terrace" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    {label("Suburb")}
                    <input value={site.suburb} onChange={(e) => setSite({ ...site, suburb: e.target.value })} placeholder="Paddington" style={inputStyle} />
                  </div>
                  <div>
                    {label("State")}
                    <select value={site.state} onChange={(e) => setSite({ ...site, state: e.target.value })} style={{ ...inputStyle, background: "#fff" }}>
                      <option>QLD</option><option>NSW</option><option>VIC</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option>
                    </select>
                  </div>
                  <div>
                    {label("Postcode")}
                    <input value={site.postcode} onChange={(e) => setSite({ ...site, postcode: e.target.value })} placeholder="4064" style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "24px" }}>
              <div style={{ padding: "10px 14px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".07em" }}>Site supervisor</div>
                <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>Receives compliance alerts for this site</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    {label("First name")}
                    <input value={site.supervisorFirst} onChange={(e) => setSite({ ...site, supervisorFirst: e.target.value })} placeholder="James" style={inputStyle} />
                  </div>
                  <div>
                    {label("Last name")}
                    <input value={site.supervisorLast} onChange={(e) => setSite({ ...site, supervisorLast: e.target.value })} placeholder="Foreman" style={inputStyle} />
                  </div>
                </div>
                <div>
                  {label("Mobile")}
                  <input value={site.supervisorMobile} onChange={(e) => setSite({ ...site, supervisorMobile: e.target.value })} placeholder="0400 000 000" style={inputStyle} />
                </div>
                <div>
                  {label("Email")}
                  <input value={site.supervisorEmail} onChange={(e) => setSite({ ...site, supervisorEmail: e.target.value })} placeholder="james@hartleyconstructions.com.au" style={inputStyle} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setPrimaryStep(1)} disabled={!site.name || !site.address} style={btnPrimary(!site.name || !site.address)}>
                Next — invite a contractor →
              </button>
            </div>
          </div>
        )}

        {/* PRIMARY USER STEP 1 — FIRST CONTRACTOR */}
        {journey === "primary" && primaryStep === 1 && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "18px", fontWeight: 500, color: "#111", marginBottom: "4px" }}>Invite your first contractor</div>
              <div style={{ fontSize: "13px", color: "#333", lineHeight: 1.7 }}>
                They receive a secure link to submit their documents. Vettit reads, verifies and chases automatically.
              </div>
            </div>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  {label("Company name")}
                  <input value={contractor.company} onChange={(e) => setContractor({ ...contractor, company: e.target.value })} placeholder="e.g. Rapid Demo Co" style={inputStyle} />
                </div>
                <div>
                  {label("Trade")}
                  <select value={contractor.trade} onChange={(e) => setContractor({ ...contractor, trade: e.target.value })} style={{ ...inputStyle, background: "#fff" }}>
                    <option value="">Select trade...</option>
                    <option>Plumbing</option><option>Electrical</option><option>Carpentry</option><option>Painting</option><option>Tiling</option><option>Concreting</option><option>Demolition</option><option>Scaffolding</option><option>HVAC</option><option>Gas Fitting</option><option>Labourer</option><option>Structural Steel</option><option>Framing</option><option>Roofing</option><option>Other</option>
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    {label("Contact first name")}
                    <input value={contractor.contactFirst} onChange={(e) => setContractor({ ...contractor, contactFirst: e.target.value })} placeholder="Tom" style={inputStyle} />
                  </div>
                  <div>
                    {label("Contact last name")}
                    <input value={contractor.contactLast} onChange={(e) => setContractor({ ...contractor, contactLast: e.target.value })} placeholder="Richards" style={inputStyle} />
                  </div>
                </div>
                <div>
                  {label("Contact email")}
                  <input value={contractor.email} onChange={(e) => setContractor({ ...contractor, email: e.target.value })} placeholder="tom@rapiddemo.com.au" style={inputStyle} />
                </div>
              </div>
            </div>
            <div style={{ padding: "12px 14px", border: "1px solid #a5d6a7", background: "#f9fdf9", borderRadius: "2px", marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", color: "#3a7d44", lineHeight: 1.7 }}>
                <strong>What happens next:</strong> {contractor.contactFirst || "Your contractor"} receives an email with a secure link. They upload their company docs, personal tickets and workers. Vettit reads and verifies everything automatically.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setPrimaryStep(0)} style={btnOutline}>← Back</button>
              <button
                onClick={() => setPrimaryDone(true)}
                disabled={!contractor.company || !contractor.email}
                style={{ ...btnPrimary(!contractor.company || !contractor.email), background: !contractor.company || !contractor.email ? "#aaa" : "#3a7d44" }}
              >
                Send invite — finish setup →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
