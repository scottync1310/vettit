"use client";
import { useState } from "react";

type TeamMember = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "Owner" | "Admin" | "Site Manager" | "Foreman" | "Office";
  alerts: string[];
};

const alertTypes = [
  "Expiry warnings",
  "Non-compliant contractor",
  "Unresponsive contractor",
  "New document uploaded",
  "Weekly digest",
  "Subcontractor declared",
];

const roleDescriptions: Record<string, string> = {
  Owner: "Full access — all settings, billing, team management",
  Admin: "Full access except billing",
  "Site Manager": "Can view and manage assigned sites and contractors",
  Foreman: "Can view site compliance and cleared contractor list",
  Office: "Can view dashboard and receive digest emails",
};

const initialTeam: TeamMember[] = [
  { id: 1, firstName: "Mila", lastName: "Hartley", email: "mila@hartleyconstructions.com.au", role: "Owner", alerts: ["Expiry warnings", "Non-compliant contractor", "Unresponsive contractor", "Weekly digest", "Subcontractor declared"] },
  { id: 2, firstName: "James", lastName: "Foreman", email: "james@hartleyconstructions.com.au", role: "Foreman", alerts: ["Non-compliant contractor", "Weekly digest"] },
  { id: 3, firstName: "Sarah", lastName: "Admin", email: "sarah@hartleyconstructions.com.au", role: "Admin", alerts: ["Expiry warnings", "Non-compliant contractor", "Unresponsive contractor", "New document uploaded", "Weekly digest", "Subcontractor declared"] },
];

const tabs = ["Company profile", "Team & roles", "Notifications", "Billing"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Company profile");
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [showAddMember, setShowAddMember] = useState(false);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({ firstName: "", lastName: "", email: "", role: "Site Manager" as TeamMember["role"] });
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    company: "Hartley Constructions",
    abn: "51 824 753 556",
    contactName: "Mila Hartley",
    contactEmail: "mila@hartleyconstructions.com.au",
    billingEmail: "accounts@hartleyconstructions.com.au",
  });

  const [notifications, setNotifications] = useState({
    digestDay: "Monday",
    digestTime: "07:00",
    expiryWarning1: "14",
    expiryWarning2: "7",
    reminderCount: "3",
  });

  const addMember = () => {
    if (!newMember.firstName || !newMember.email) return;
    setTeam((prev) => [...prev, { ...newMember, id: Date.now(), alerts: ["Weekly digest"] }]);
    setNewMember({ firstName: "", lastName: "", email: "", role: "Site Manager" });
    setShowAddMember(false);
  };

  const removeMember = (id: number) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleAlert = (memberId: number, alert: string) => {
    setTeam((prev) => prev.map((m) => m.id === memberId ? {
      ...m,
      alerts: m.alerts.includes(alert) ? m.alerts.filter((a) => a !== alert) : [...m.alerts, alert]
    } : m));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #d0d0d0", fontSize: "13px", color: "#111", borderRadius: "2px", fontFamily: "Roboto, sans-serif" };
  const selectStyle: React.CSSProperties = { ...inputStyle, background: "#fff" };

  const label = (text: string, sub?: string) => (
    <div style={{ marginBottom: "5px" }}>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "#555" }}>{text}</div>
      {sub && <div style={{ fontSize: "11px", color: "#444", marginTop: "1px" }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Settings</div>
          <div style={{ fontSize: "12px", color: "#333", marginTop: "2px" }}>Manage your company profile, team and notification preferences</div>
        </div>
        {activeTab !== "Billing" && (
          <button
            onClick={handleSave}
            style={{ padding: "7px 20px", border: "1px solid #111", background: saved ? "#3a7d44" : "#111", color: "#fff", fontSize: "12px", fontWeight: 500, borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}
          >
            {saved ? "Saved ✓" : "Save changes"}
          </button>
        )}
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #d0d0d0", padding: "0 32px" }}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ fontSize: "12px", color: activeTab === tab ? "#111" : "#555", padding: "12px 14px", borderBottom: activeTab === tab ? "2px solid #111" : "2px solid transparent", fontWeight: activeTab === tab ? 500 : 400, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 64px" }}>

        {activeTab === "Company profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Company details</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  {label("Company name")}
                  <input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  {label("ABN")}
                  <input value={profile.abn} onChange={(e) => setProfile({ ...profile, abn: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  {label("Company logo", "Appears on contractor invite emails")}
                  <div style={{ border: "1px dashed #d0d0d0", borderRadius: "2px", padding: "20px", textAlign: "center", background: "#fafafa" }}>
                    <div style={{ fontSize: "12px", color: "#333", marginBottom: "8px" }}>No logo uploaded</div>
                    <label style={{ padding: "6px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>
                      Upload logo
                      <input type="file" accept=".png,.jpg,.svg" style={{ display: "none" }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Contact details</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  {label("Primary contact name")}
                  <input value={profile.contactName} onChange={(e) => setProfile({ ...profile, contactName: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  {label("Primary contact email")}
                  <input value={profile.contactEmail} onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  {label("Billing email", "Invoices and receipts are sent here")}
                  <input value={profile.billingEmail} onChange={(e) => setProfile({ ...profile, billingEmail: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Team & roles" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#333" }}>{team.length} team members</div>
              <button onClick={() => setShowAddMember(true)} style={{ padding: "6px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", fontWeight: 500, borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>
                + Add team member
              </button>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
              <div style={{ padding: "8px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#333" }}>Name</div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#333" }}>Email</div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#333" }}>Role</div>
                <div></div>
              </div>
              {team.map((member) => (
                <div key={member.id}>
                  <div
                    onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                    style={{ padding: "12px 16px", borderBottom: "1px solid #ebebeb", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "8px", alignItems: "center", cursor: "pointer" }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{member.firstName} {member.lastName}</div>
                      {member.role === "Owner" && <div style={{ fontSize: "12px", color: "#333", marginTop: "1px" }}>You</div>}
                    </div>
                    <div style={{ fontSize: "12px", color: "#333" }}>{member.email}</div>
                    <div>
                      <span style={{ fontSize: "11px", padding: "2px 8px", background: "#f5f5f5", color: "#555", border: "1px solid #ddd", borderRadius: "2px" }}>{member.role}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#444" }}>{expandedMember === member.id ? "▲" : "▼"}</span>
                      {member.role !== "Owner" && (
                        <span onClick={(e) => { e.stopPropagation(); removeMember(member.id); }} style={{ fontSize: "12px", color: "#444", cursor: "pointer" }}>×</span>
                      )}
                    </div>
                  </div>
                  {expandedMember === member.id && (
                    <div style={{ padding: "14px 16px", background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "6px" }}>Role</div>
                        <select
                          value={member.role}
                          disabled={member.role === "Owner"}
                          onChange={(e) => setTeam((prev) => prev.map((m) => m.id === member.id ? { ...m, role: e.target.value as TeamMember["role"] } : m))}
                          style={{ ...selectStyle, width: "auto" }}
                        >
                          {Object.keys(roleDescriptions).map((r) => <option key={r}>{r}</option>)}
                        </select>
                        <div style={{ fontSize: "11px", color: "#333", marginTop: "6px" }}>{roleDescriptions[member.role]}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 500, color: "#555", marginBottom: "8px" }}>Alert notifications</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {alertTypes.map((alert) => (
                            <label key={alert} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#111", cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={member.alerts.includes(alert)}
                                onChange={() => toggleAlert(member.id, alert)}
                                style={{ accentColor: "#111", width: "13px", height: "13px" }}
                              />
                              {alert}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showAddMember && (
              <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>Add team member</div>
                  <span onClick={() => setShowAddMember(false)} style={{ fontSize: "18px", color: "#444", cursor: "pointer" }}>×</span>
                </div>
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      {label("First name")}
                      <input value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} placeholder="James" style={inputStyle} />
                    </div>
                    <div>
                      {label("Last name")}
                      <input value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} placeholder="Foreman" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    {label("Email")}
                    <input value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="james@hartleyconstructions.com.au" style={inputStyle} />
                  </div>
                  <div>
                    {label("Role")}
                    <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value as TeamMember["role"] })} style={selectStyle}>
                      <option>Admin</option>
                      <option>Site Manager</option>
                      <option>Foreman</option>
                      <option>Office</option>
                    </select>
                    <div style={{ fontSize: "11px", color: "#444", marginTop: "4px" }}>{roleDescriptions[newMember.role]}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button onClick={() => setShowAddMember(false)} style={{ padding: "7px 14px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Cancel</button>
                    <button onClick={addMember} style={{ padding: "7px 14px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Add member</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden", marginTop: "16px" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Role permissions</div>
              </div>
              {Object.entries(roleDescriptions).map(([role, desc], i) => (
                <div key={role} style={{ padding: "10px 16px", borderBottom: i < Object.keys(roleDescriptions).length - 1 ? "1px solid #ebebeb" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{role}</div>
                  <div style={{ fontSize: "12px", color: "#333", maxWidth: "380px", textAlign: "right" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Weekly digest</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    {label("Send on")}
                    <select value={notifications.digestDay} onChange={(e) => setNotifications({ ...notifications, digestDay: e.target.value })} style={selectStyle}>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                    </select>
                  </div>
                  <div>
                    {label("Send at")}
                    <select value={notifications.digestTime} onChange={(e) => setNotifications({ ...notifications, digestTime: e.target.value })} style={selectStyle}>
                      <option value="06:00">6:00 am</option>
                      <option value="07:00">7:00 am</option>
                      <option value="08:00">8:00 am</option>
                      <option value="09:00">9:00 am</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Expiry warnings</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    {label("First warning")}
                    <select value={notifications.expiryWarning1} onChange={(e) => setNotifications({ ...notifications, expiryWarning1: e.target.value })} style={selectStyle}>
                      <option value="30">30 days before</option>
                      <option value="21">21 days before</option>
                      <option value="14">14 days before</option>
                      <option value="7">7 days before</option>
                    </select>
                  </div>
                  <div>
                    {label("Second warning")}
                    <select value={notifications.expiryWarning2} onChange={(e) => setNotifications({ ...notifications, expiryWarning2: e.target.value })} style={selectStyle}>
                      <option value="14">14 days before</option>
                      <option value="7">7 days before</option>
                      <option value="3">3 days before</option>
                      <option value="1">1 day before</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Autopilot escalation</div>
              </div>
              <div style={{ padding: "16px" }}>
                {label("Mark contractor as unresponsive after", "Vettit will alert the assigned team member after this many automated reminders")}
                <select value={notifications.reminderCount} onChange={(e) => setNotifications({ ...notifications, reminderCount: e.target.value })} style={{ ...selectStyle, width: "auto" }}>
                  <option value="2">2 reminders</option>
                  <option value="3">3 reminders</option>
                  <option value="4">4 reminders</option>
                  <option value="5">5 reminders</option>
                </select>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Alert recipients by type</div>
                <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>Configure per team member in Team & roles tab</div>
              </div>
              {alertTypes.map((alert, i) => {
                const recipients = team.filter((m) => m.alerts.includes(alert));
                return (
                  <div key={alert} style={{ padding: "10px 16px", borderBottom: i < alertTypes.length - 1 ? "1px solid #ebebeb" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "13px", color: "#111" }}>{alert}</div>
                    <div style={{ fontSize: "12px", color: "#333" }}>
                      {recipients.length === 0 ? "No recipients" : recipients.map((m) => m.firstName).join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Billing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Current plan</div>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Vettit Pro</div>
                    <div style={{ fontSize: "12px", color: "#333", marginTop: "2px" }}>Up to 100 active contractors · unlimited sites · full autopilot</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: 500, color: "#111" }}>$199<span style={{ fontSize: "12px", color: "#333", fontWeight: 400 }}>/mo</span></div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "2px" }}>Billed monthly</div>
                  </div>
                </div>
                <div style={{ padding: "10px 14px", background: "#f9fdf9", border: "1px solid #a5d6a7", borderRadius: "2px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "12px", color: "#3a7d44" }}>Next invoice — 1 May 2025 · $199.00</div>
                  <button style={{ padding: "5px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Manage plan</button>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Usage this month</div>
              </div>
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Active contractors", value: 24, limit: 100 },
                  { label: "Active sites", value: 3, limit: null },
                  { label: "Invites sent this month", value: 12, limit: null },
                  { label: "Documents processed", value: 89, limit: null },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ fontSize: "13px", color: "#555" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>
                      {item.value}{item.limit ? <span style={{ fontSize: "11px", color: "#444", fontWeight: 400 }}> / {item.limit}</span> : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Payment method</div>
              </div>
              <div style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "26px", border: "1px solid #d0d0d0", borderRadius: "2px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 500, color: "#555" }}>VISA</div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#111" }}>Visa ending in 4242</div>
                    <div style={{ fontSize: "11px", color: "#333", marginTop: "1px" }}>Expires 08/2027</div>
                  </div>
                </div>
                <button style={{ padding: "5px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "11px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>Update card</button>
              </div>
            </div>

            <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "#444", textTransform: "uppercase", letterSpacing: ".08em" }}>Invoice history</div>
              </div>
              {[
                { date: "1 Apr 2025", amount: "$199.00", status: "Paid" },
                { date: "1 Mar 2025", amount: "$199.00", status: "Paid" },
                { date: "1 Feb 2025", amount: "$199.00", status: "Paid" },
              ].map((inv, i) => (
                <div key={inv.date} style={{ padding: "10px 16px", borderBottom: i < 2 ? "1px solid #ebebeb" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", color: "#555" }}>{inv.date}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{inv.amount}</div>
                    <span style={{ fontSize: "11px", padding: "2px 8px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: "2px" }}>{inv.status}</span>
                    <span style={{ fontSize: "12px", color: "#3a7d44", cursor: "pointer" }}>↓ PDF</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ border: "1px solid #ebebeb", borderRadius: "2px", padding: "14px 16px" }}>
              <div style={{ fontSize: "12px", color: "#333", lineHeight: 1.6 }}>
                Need to cancel or change plans? Contact us at <span style={{ color: "#111", fontWeight: 500 }}>support@vettit.com.au</span> and we will sort it out same day.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
