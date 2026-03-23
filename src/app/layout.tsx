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
      <body>
        <Nav />
        <main
          style={{
            maxWidth: "var(--page-max)",
            margin: "0 auto",
            paddingBottom: "48px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}