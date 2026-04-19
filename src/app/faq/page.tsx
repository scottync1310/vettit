"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is Vettit?",
    a: "Vettit is a contractor compliance autopilot for Australian builders. You invite a subcontractor once and Vettit handles everything — collecting their documents, verifying them automatically, sending reminders if they don't respond, and alerting you when something expires.",
  },
  {
    q: "How does the contractor invitation work?",
    a: "You enter the contractor's company name, contact person and email. Vettit sends them a secure magic link — no account or password required. They click the link and complete their compliance submission in one 10–15 minute session.",
  },
  {
    q: "What documents does Vettit collect from contractors?",
    a: "Vettit collects company-level documents including public liability insurance, workers compensation and trade licences. It also collects personal documents for each worker including White Cards, trade licences, working at heights certifications and proof of right to work for non-citizens.",
  },
  {
    q: "How does the AI document reading work?",
    a: "When a contractor uploads a document, Vettit's AI reads the PDF or image and automatically extracts the document type, issuing authority, covered entity and expiry date. The contractor does not need to manually enter any dates — the system handles it all.",
  },
  {
    q: "What happens if a contractor doesn't respond?",
    a: "Vettit's autopilot sends a sequence of escalating reminders — day 2, day 5 and day 7 after the initial invite. If the contractor still hasn't responded after the final reminder, they are marked as unresponsive and the assigned team member is alerted to follow up manually.",
  },
  {
    q: "How does Vettit handle document expiry?",
    a: "Vettit tracks expiry dates for every document. As a document approaches expiry, the system automatically sends renewal reminders to the contractor at 14 days and 7 days before expiry. You receive a weekly digest every Monday showing everything expiring in the next 30 days.",
  },
  {
    q: "Can contractors submit documents for multiple sites?",
    a: "Yes. Company-level documents such as public liability insurance are verified once and apply across all sites. Site-specific documents such as SWMS are collected per engagement. A contractor only needs to upload their company documents once regardless of how many sites they work on.",
  },
  {
    q: "What are progressive licences?",
    a: "In crane operation and rigging, higher-class licences cover all lower classes automatically. For example, a C0 (open) crane licence satisfies C1, C6 and C2 requirements. Vettit recognises this and automatically marks lower classes as covered — no false non-compliant flags.",
  },
  {
    q: "Can contractors declare their own subcontractors?",
    a: "Yes — contractors can declare subcontractors they plan to bring on site during their submission. However, the builder controls all invitations. Declared subcontractors appear as a notification on your dashboard for you to review and invite separately.",
  },
  {
    q: "What is the difference between the builder dashboard and the contractor portal?",
    a: "The builder dashboard is your full management interface — you see all contractors, all sites, compliance scores and document history. The contractor portal is a separate, simplified interface that contractors access via their magic link. They only see their own tasks and cannot access your dashboard.",
  },
  {
    q: "How does Vettit handle team roles and permissions?",
    a: "Vettit supports multiple roles including Owner, Admin, Site Manager, Foreman and Office. Each role has different access levels. The Owner has full access including billing. Foremen can view cleared contractor lists for their sites. Permissions are configured in Settings under Team and roles.",
  },
  {
    q: "What is the weekly digest?",
    a: "Every Monday morning Vettit sends a weekly expiry report to your nominated team members. It shows all documents expiring in the next 30 days, organised by urgency — this week, within 2 weeks, and within 30 days. It is designed so you can action everything before it becomes a problem.",
  },
  {
    q: "Can I archive contractors and sites?",
    a: "Yes. When a project is complete you can archive the site. When a contractor is no longer needed you can archive them from one or more sites. Archived records are preserved permanently for WHS audit purposes — nothing is deleted.",
  },
  {
    q: "Does Vettit send SMS as well as email?",
    a: "SMS chasing is on our roadmap and will be available in a future release. The autopilot sequence will run across both email and SMS with escalating tone — reminder, warning and final notice.",
  },
  {
    q: "Is my data stored in Australia?",
    a: "Yes. All Vettit data is stored in Australian data centres. We do not transfer data overseas. We comply with the Privacy Act 1988 and the Australian Privacy Principles.",
  },
  {
    q: "How secure are uploaded documents?",
    a: "All documents are encrypted in transit and at rest using industry-standard AES-256 encryption. Access is restricted to authorised users only. We conduct regular security reviews and penetration testing.",
  },
  {
    q: "Can I use Vettit for bulk contractor onboarding?",
    a: "Yes. The bulk invite feature lets you upload a CSV file with multiple contractor names, contacts and emails. Vettit validates the data, lets you fix any errors, then sends invites to all of them at once. Each contractor receives their own individual magic link.",
  },
  {
    q: "What happens when I sign up?",
    a: "Vettit's onboarding takes about 3 minutes. You enter your company details, nominate who manages compliance day to day, add your first site and invite your first contractor. After that Vettit handles everything automatically.",
  },
  {
    q: "How much does Vettit cost?",
    a: "Vettit Pro is $199 per month and supports up to 100 active contractors across unlimited sites with full autopilot. Contact us at support@vettit.com.au for enterprise pricing if you need more than 100 contractors.",
  },
  {
    q: "How do I get support?",
    a: "Email us at support@vettit.com.au and we will respond same business day. For urgent issues call us directly — our number is listed in your account settings. We are based in Brisbane and support Australian business hours.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px 64px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "22px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>Frequently asked questions</div>
        <div style={{ fontSize: "13px", color: "#666" }}>Everything you need to know about Vettit</div>
      </div>

      <div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: "1px solid #ebebeb" }}>
            <div
              onClick={() => setOpen(open === i ? null : i)}
              style={{ padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#111", paddingRight: "24px" }}>{faq.q}</div>
              <div style={{ fontSize: "18px", color: "#888", flexShrink: 0, lineHeight: 1 }}>{open === i ? "−" : "+"}</div>
            </div>
            {open === i && (
              <div style={{ paddingBottom: "16px", fontSize: "13px", color: "#444", lineHeight: 1.8 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "32px", padding: "20px 24px", border: "1px solid #d0d0d0", borderRadius: "2px", background: "#fafafa" }}>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "#111", marginBottom: "6px" }}>Still have questions?</div>
        <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
          Email us at <a href="mailto:support@vettit.com.au" style={{ color: "#111", fontWeight: 500 }}>support@vettit.com.au</a> and we will get back to you same business day. We are based in Brisbane and support Australian business hours.
        </div>
      </div>
    </div>
  );
}