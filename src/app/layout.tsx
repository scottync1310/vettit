import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";

export const metadata: Metadata = {
  title: "Vettit",
  description: "Contractor compliance autopilot for builders",
};

const footerLinks = [
  { label: "Contact us", href: "mailto:support@vettit.com.au" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Support", href: "mailto:support@vettit.com.au" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "Montserrat, sans-serif", background: "#fff", color: "#111" }}>
        <Nav />
        <main style={{ maxWidth: "960px", margin: "0 auto", paddingBottom: "48px" }}>
          {children}
        </main>
        <footer style={{ marginTop: "48px" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 32px", borderTop: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "12px", color: "#888" }}>
              © {new Date().getFullYear()} Vettit.com.au · All rights reserved
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {footerLinks.map((item) => (
                <a key={item.label} href={item.href} style={{ fontSize: "12px", color: "#888", textDecoration: "none", fontFamily: "Montserrat, sans-serif" }}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}