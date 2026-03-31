"use client";
import { useState } from "react";

type ExpiryEvent = {
  id: number;
  contractor: string;
  trade: string;
  docType: string;
  level: "company" | "site" | "worker";
  site?: string;
  worker?: string;
  day: number;
  month: number;
  year: number;
  status: "expiring" | "expired";
};

const events: ExpiryEvent[] = [
  { id: 1, contractor: "XYZ Electrical", trade: "Electrical", docType: "Public liability insurance", level: "company", day: 28, month: 3, year: 2025, status: "expiring" },
  { id: 2, contractor: "SEQ Concreting", trade: "Concreting", docType: "Workers compensation", level: "company", day: 30, month: 3, year: 2025, status: "expiring" },
  { id: 3, contractor: "ABC Plumbing", trade: "Plumbing", docType: "Trade licence", level: "company", day: 5, month: 4, year: 2025, status: "expiring" },
  { id: 4, contractor: "Rapid Demo Co", trade: "Demolition", docType: "Working at Heights cert", level: "worker", worker: "James Hartley", site: "Paddington", day: 8, month: 4, year: 2025, status: "expiring" },
  { id: 5, contractor: "Brisbane Frames", trade: "Framing", docType: "Public liability insurance", level: "company", day: 12, month: 4, year: 2025, status: "expiring" },
  { id: 6, contractor: "ABC Plumbing", trade: "Plumbing", docType: "SWMS", level: "site", site: "Bulimba Apartments", day: 14, month: 4, year: 2025, status: "expiring" },
  { id: 7, contractor: "North Build Co", trade: "Labourer", docType: "Workers compensation", level: "company", day: 18, month: 4, year: 2025, status: "expiring" },
  { id: 8, contractor: "SEQ Concreting", trade: "Concreting", docType: "Dogging DG licence", level: "worker", worker: "Paul Brown", site: "Paddington", day: 20, month: 4, year: 2025, status: "expiring" },
  { id: 9, contractor: "XYZ Electrical", trade: "Electrical", docType: "Workers compensation", level: "company", day: 3, month: 5, year: 2025, status: "expiring" },
  { id: 10, contractor: "ABC Plumbing", trade: "Plumbing", docType: "Public liability insurance", level: "company", day: 15, month: 5, year: 2025, status: "expiring" },
  { id: 11, contractor: "Rapid Demo Co", trade: "Demolition", docType: "Trade licence", level: "company", day: 22, month: 5, year: 2025, status: "expiring" },
  { id: 12, contractor: "Brisbane Frames", trade: "Framing", docType: "SWMS", level: "site", site: "Newstead Commercial", day: 28, month: 5, year: 2025, status: "expiring" },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(null);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const eventsThisMonth = events.filter((e) => e.month === viewMonth + 1 && e.year === viewYear);

  const eventsForDay = (day: number) => eventsThisMonth.filter((e) => e.day === day);

  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : [];

  const levelTag = (e: ExpiryEvent) => {
    if (e.level === "company") return <span style={{ fontSize: "10px", padding: "1px 5px", background: "#f5f5f5", color: "#555", border: "1px solid #ddd", borderRadius: "2px" }}>Company</span>;
    if (e.level === "site") return <span style={{ fontSize: "10px", padding: "1px 5px", background: "#E6F1FB", color: "#0C447C", border: "1px solid #85B7EB", borderRadius: "2px" }}>{e.site}</span>;
    if (e.level === "worker") return <span style={{ fontSize: "10px", padding: "1px 5px", background: "#EEEDFE", color: "#3C3489", border: "1px solid #AFA9EC", borderRadius: "2px" }}>{e.worker}</span>;
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day: number) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div>
      <div style={{ padding: "14px 32px", borderBottom: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#111" }}>Expiry calendar</div>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>Monthly view of all upcoming document expirations</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={prevMonth} style={{ padding: "6px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>←</button>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#111", minWidth: "140px", textAlign: "center" }}>{months[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} style={{ padding: "6px 12px", border: "1px solid #d0d0d0", background: "#fff", color: "#111", fontSize: "12px", borderRadius: "2px", cursor: "pointer", fontFamily: "Roboto, sans-serif" }}>→</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedDay ? "1fr 320px" : "1fr", gap: "0" }}>

        <div style={{ padding: "24px 32px" }}>
          {eventsThisMonth.length === 0 && (
            <div style={{ padding: "10px 0 16px", fontSize: "12px", color: "#888" }}>No expirations this month.</div>
          )}
          {eventsThisMonth.length > 0 && (
            <div style={{ padding: "8px 0 16px", fontSize: "12px", color: "#888" }}>
              <span style={{ fontWeight: 500, color: "#c0392b" }}>{eventsThisMonth.length} document{eventsThisMonth.length > 1 ? "s" : ""}</span> expiring this month — click a date to see details
            </div>
          )}

          <div style={{ border: "1px solid #d0d0d0", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#fafafa", borderBottom: "1px solid #d0d0d0" }}>
              {days.map((d) => (
                <div key={d} style={{ padding: "8px 0", textAlign: "center", fontSize: "11px", fontWeight: 500, color: "#888" }}>{d}</div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {cells.map((day, i) => {
                const dayEvents = day ? eventsForDay(day) : [];
                const isSelected = day === selectedDay;
                const isTod = day ? isToday(day) : false;

                return (
                  <div
                    key={i}
                    onClick={() => day && dayEvents.length > 0 && setSelectedDay(isSelected ? null : day)}
                    style={{
                      minHeight: "80px",
                      padding: "6px 8px",
                      borderRight: (i + 1) % 7 !== 0 ? "1px solid #ebebeb" : "none",
                      borderBottom: i < cells.length - 7 ? "1px solid #ebebeb" : "none",
                      background: isSelected ? "#f5f5f5" : "#fff",
                      cursor: day && dayEvents.length > 0 ? "pointer" : "default",
                    }}
                  >
                    {day && (
                      <>
                        <div style={{ fontSize: "12px", fontWeight: isTod ? 500 : 400, color: isTod ? "#fff" : "#111", background: isTod ? "#111" : "transparent", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
                          {day}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          {dayEvents.slice(0, 2).map((e) => (
                            <div key={e.id} style={{ fontSize: "10px", padding: "2px 4px", background: "#ffebee", color: "#b71c1c", borderRadius: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {e.contractor}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div style={{ fontSize: "10px", color: "#888" }}>+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {selectedDay && selectedEvents.length > 0 && (
          <div style={{ borderLeft: "1px solid #d0d0d0", padding: "24px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{selectedDay} {months[viewMonth]}</div>
              <span onClick={() => setSelectedDay(null)} style={{ fontSize: "16px", color: "#aaa", cursor: "pointer" }}>×</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedEvents.map((e) => (
                <div key={e.id} style={{ border: "1px solid #ef9a9a", borderRadius: "2px", padding: "10px 12px", background: "#fff8f8" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111", marginBottom: "4px" }}>{e.contractor}</div>
                  <div style={{ fontSize: "12px", color: "#555", marginBottom: "6px" }}>{e.docType}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {levelTag(e)}
                  </div>
                  <a href="/contractor" style={{ display: "inline-block", marginTop: "8px", fontSize: "11px", padding: "4px 10px", background: "#111", color: "#fff", borderRadius: "2px", textDecoration: "none", fontWeight: 500 }}>View contractor →</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}