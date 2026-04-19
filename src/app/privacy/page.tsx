export default function Privacy() {
  const section = (title: string, content: string) => (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "#444", lineHeight: 1.8 }}>{content}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px 64px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "22px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>Privacy Policy</div>
        <div style={{ fontSize: "13px", color: "#666" }}>Last updated: 1 April 2025</div>
      </div>

      {section("1. Who we are", "Vettit Pty Ltd (ABN 00 000 000 000) operates the Vettit platform, a contractor compliance management service for the Australian construction industry. We are committed to protecting your personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.")}
      {section("2. What information we collect", "We collect information you provide directly, including company name, ABN, contact names and email addresses, mobile numbers, and compliance documents uploaded through our platform. We also collect usage data including login timestamps, pages visited and actions taken within the platform.")}
      {section("3. How we use your information", "We use your information to provide the Vettit service, send compliance-related emails and SMS notifications, verify contractor documents, generate automated reminders, and improve our platform. We do not sell your personal information to third parties.")}
      {section("4. Document storage and AI processing", "Documents uploaded to Vettit are stored securely in encrypted cloud storage. Our AI system reads uploaded documents to extract expiry dates and verify document types. Document contents are not used for any purpose other than compliance verification.")}
      {section("5. Who we share your information with", "We share your information only with your building company (if you are a contractor), third-party service providers who help us operate the platform (including cloud storage, email and SMS providers), and where required by law.")}
      {section("6. Data retention", "We retain your data for as long as your account is active and for 7 years after account closure for audit purposes, consistent with Australian construction industry record-keeping requirements.")}
      {section("7. Security", "We use industry-standard encryption and security practices to protect your data. All data is stored in Australian data centres. We conduct regular security reviews and penetration testing.")}
      {section("8. Your rights", "You have the right to access, correct or delete your personal information at any time. To exercise these rights contact us at privacy@vettit.com.au. We will respond within 30 days.")}
      {section("9. Cookies", "We use essential cookies to keep you logged in and maintain your session. We do not use advertising or tracking cookies.")}
      {section("10. Changes to this policy", "We may update this policy from time to time. We will notify you of material changes by email. Continued use of the platform after notification constitutes acceptance of the updated policy.")}
      {section("11. Contact us", "For privacy-related enquiries contact privacy@vettit.com.au or write to Vettit Pty Ltd, GPO Box 0000, Brisbane QLD 4000.")}
    </div>
  );
}