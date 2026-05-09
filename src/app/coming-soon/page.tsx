"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LAUNCH_DATE = new Date("2027-01-01T00:00:00");
const PASSCODE = "gizmo";

export default function ComingSoon() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = LAUNCH_DATE.getTime() - now.getTime();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (code.toLowerCase().trim() === PASSCODE) {
      window.location.href = "/";
    } else {
      setError(true);
      setCode("");
      setTimeout(() => setError(false), 2000);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "Montserrat, sans-serif" }}>
      <img src="/logo.png" alt="Vettit" style={{ height: "44px", width: "auto", marginBottom: "40px" }} />

      <div style={{ fontSize: "13px", fontWeight: 500, color: "#555", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: "12px" }}>
        Launching in
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "12px", marginBottom: "48px" }}>
        {[
          { val: timeLeft.days, label: "Days", raw: true },
          { val: timeLeft.hours, label: "Hours" },
          { val: timeLeft.minutes, label: "Mins" },
          { val: timeLeft.seconds, label: "Secs" },
        ].map((unit, i) => (
          <div key={unit.label} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ fontSize: "52px", fontWeight: 700, color: "#111", lineHeight: 1, letterSpacing: "-2px" }}>
                {unit.raw ? unit.val : pad(unit.val)}
              </div>
              <div style={{ fontSize: "10px", fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: ".12em" }}>
                {unit.label}
              </div>
            </div>
            {i < 3 && <div style={{ fontSize: "40px", fontWeight: 300, color: "#d0d0d0", lineHeight: 1, marginTop: "6px" }}>:</div>}
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #ebebeb", paddingTop: "40px", textAlign: "center", width: "100%", maxWidth: "480px" }}>
        <div style={{ fontSize: "13px", color: "#555", marginBottom: "16px" }}>
          Have early access? Enter your passcode below.
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Passcode"
            type="password"
            style={{ padding: "10px 14px", border: error ? "1px solid #c0392b" : "1px solid #d0d0d0", fontSize: "14px", color: "#111", borderRadius: "2px", fontFamily: "Montserrat, sans-serif", width: "200px", background: error ? "#fff8f8" : "#fff", letterSpacing: ".1em", outline: "none" }}
          />
          <button onClick={handleSubmit} style={{ padding: "10px 20px", border: "1px solid #111", background: "#111", color: "#fff", fontSize: "13px", fontWeight: 500, borderRadius: "2px", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
            Enter
          </button>
        </div>
        {error && <div style={{ fontSize: "12px", color: "#c0392b", marginTop: "10px" }}>Incorrect passcode — try again</div>}
      </div>
    </div>
  );
}