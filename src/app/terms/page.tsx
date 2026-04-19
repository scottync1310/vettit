export default function Terms() {
  const section = (title: string, content: string) => (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "#444", lineHeight: 1.8 }}>{content}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px 64px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "22px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>Terms of Service</div>
        <div style={{ fontSize: "13px", color: "#666" }}>Last updated: 1 April 2025</div>
      </div>

      {section("1. Acceptance of terms", "By accessing or using the Vettit platform you agree to be bound by these Terms of Service. If you do not agree to these terms do not use the platform. These terms apply to all users including building companies and contractors.")}
      {section("2. Description of service", "Vettit is a contractor compliance management platform that automates the collection, verification and tracking of compliance documents for the construction industry. The platform sends automated email and SMS reminders and uses AI to read and verify uploaded documents.")}
      {section("3. Account responsibilities", "You are responsible for maintaining the confidentiality of your account credentials. You must ensure that all information provided is accurate and up to date. You must not share your account with others or allow unauthorised access.")}
      {section("4. Contractor obligations", "Contractors using the platform must upload genuine, current and unaltered compliance documents. Uploading fraudulent or expired documents is a breach of these terms and may constitute a criminal offence. Vettit reserves the right to flag and report suspected document fraud.")}
      {section("5. Builder obligations", "Building companies using Vettit are responsible for ensuring contractors are appropriately vetted before allowing site access. Vettit is a compliance management tool and does not replace the building company's own WHS obligations and duties of care.")}
      {section("6. AI document verification", "Vettit uses AI to read and extract information from uploaded documents. While we strive for accuracy, AI verification is not infallible. Building companies should conduct their own checks for high-risk activities. Vettit accepts no liability for errors in AI document reading.")}
      {section("7. Subscription and payment", "Access to Vettit requires a paid subscription. Subscription fees are billed monthly in advance. All prices are in Australian dollars and include GST where applicable. Subscriptions auto-renew unless cancelled before the renewal date.")}
      {section("8. Cancellation and refunds", "You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. We do not provide refunds for partial months. On cancellation your data is retained for 90 days before deletion.")}
      {section("9. Limitation of liability", "To the maximum extent permitted by Australian law, Vettit's liability for any claim arising from use of the platform is limited to the amount paid in the 3 months preceding the claim. Vettit is not liable for indirect, consequential or punitive damages.")}
      {section("10. Intellectual property", "All intellectual property in the Vettit platform including software, design and content belongs to Vettit Pty Ltd. You may not copy, modify or distribute any part of the platform without written permission.")}
      {section("11. Governing law", "These terms are governed by the laws of Queensland, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of Queensland.")}
      {section("12. Changes to terms", "We may update these terms from time to time. We will notify you of material changes by email with 14 days notice. Continued use after the notice period constitutes acceptance.")}
      {section("13. Contact us", "For terms-related enquiries contact legal@vettit.com.au or write to Vettit Pty Ltd, GPO Box 0000, Brisbane QLD 4000.")}
    </div>
  );
}