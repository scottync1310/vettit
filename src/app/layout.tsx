import type { Metadata } from "next";
import "./globals.css";
import Nav from "../components/Nav";

export const metadata: Metadata = {
  title: "Vettit",
  description: "Contractor compliance autopilot for builders",
};

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
      </body>
    </html>
  );
}
