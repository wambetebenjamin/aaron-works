import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Aaron Works collects, uses and protects personal data under the Kenya Data Protection Act 2019.",
  alternates: { canonical: "/legal/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="Aaron Works is a Kenyan freelancer marketplace. This policy explains what personal data we collect, why we collect it, and the rights you have under the Kenya Data Protection Act 2019."
    >
      <p>
        Aaron Works (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller for
        personal data processed through aaronworks.co.ke and related services. Our
        registered place of business is Westlands, Nairobi, Kenya.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> name, email address, password hash, role
          (client or freelancer), profile photo and username.
        </li>
        <li>
          <strong>Profile and marketplace data:</strong> skills, bio, portfolio
          images, rates, availability, proposals, contracts and messages exchanged
          through the platform.
        </li>
        <li>
          <strong>Payment and escrow data:</strong> invoices, milestone amounts,
          payout method (M-Pesa number or bank details) and transaction references.
          We do not store full card numbers.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, device and browser type,
          pages visited, referring URL and cookie preferences.
        </li>
        <li>
          <strong>Verification data:</strong> where required, a copy of an ID
          document or business registration used to verify identity. These records
          are access-restricted.
        </li>
      </ul>

      <h2>2. Why we process it</h2>
      <ul>
        <li>To create and operate your account and the marketplace.</li>
        <li>To facilitate escrow payments, invoicing, tax and accounting records.</li>
        <li>To verify identities and reduce fraud, money laundering and abuse.</li>
        <li>To provide support, resolve disputes and enforce our terms.</li>
        <li>
          To send service messages (proposal alerts, contract updates, security
          notices). Marketing messages are opt-in and can be withdrawn at any time.
        </li>
        <li>To improve the product using aggregated, non-identifying analytics.</li>
      </ul>
      <p>
        Our lawful bases are performance of a contract, compliance with legal
        obligations (including the Data Protection Act 2019 and tax law), our
        legitimate interests in operating a safe marketplace, and consent where we
        rely on it (for example marketing cookies).
      </p>

      <h2>3. Cookies and consent</h2>
      <p>
        We use necessary cookies to keep you signed in and secure, and optional
        functional, analytics and marketing cookies only when you allow them. Your
        choice is stored in your browser under the key{" "}
        <code>aaron_works_consent</code>. See the{" "}
        <a href="/legal/cookie-policy" className="aw-link">
          cookie policy
        </a>{" "}
        for the full list.
      </p>

      <h2>4. Who we share data with</h2>
      <ul>
        <li>
          <strong>Other marketplace users:</strong> your public profile, proposals
          and messages are visible to the client or freelancer you engage with.
        </li>
        <li>
          <strong>Service providers:</strong> hosting (Vercel), file storage (Vercel
          Blob), email delivery (SMTP provider), analytics, and payment or escrow
          partners — each bound by confidentiality and data-processing terms.
        </li>
        <li>
          <strong>Authorities:</strong> where required by Kenyan law, a court order
          or a lawful request from the Office of the Data Protection Commissioner.
        </li>
      </ul>
      <p>
        We do not sell personal data. Where a provider processes data outside Kenya,
        we require appropriate safeguards consistent with section 48 of the Data
        Protection Act 2019.
      </p>

      <h2>5. How long we keep data</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Account and profile</td>
            <td>While your account is active, then 12 months after closure</td>
          </tr>
          <tr>
            <td>Contracts, invoices and escrow records</td>
            <td>7 years (tax and anti-fraud obligations)</td>
          </tr>
          <tr>
            <td>Support and dispute records</td>
            <td>3 years after resolution</td>
          </tr>
          <tr>
            <td>Analytics (aggregated)</td>
            <td>26 months</td>
          </tr>
          <tr>
            <td>Cookie preferences</td>
            <td>Until you clear browser storage</td>
          </tr>
        </tbody>
      </table>

      <h2>6. Security</h2>
      <p>
        Passwords are stored as salted scrypt hashes. Traffic is encrypted in
        transit. Access to verification and payment records is limited to named
        staff, logged and reviewed. No system is perfectly secure, but we notify
        affected users and the ODPC within 72 hours of becoming aware of a
        reportable breach.
      </p>

      <h2>7. Your rights</h2>
      <p>Under the Data Protection Act 2019 you may:</p>
      <ul>
        <li>access a copy of the personal data we hold about you;</li>
        <li>correct inaccurate or incomplete data;</li>
        <li>request deletion where there is no continuing legal basis;</li>
        <li>object to or restrict certain processing;</li>
        <li>withdraw consent for optional cookies or marketing at any time;</li>
        <li>request portability of data you provided to us.</li>
      </ul>
      <p>
        Email <a href="mailto:privacy@aaronworks.co.ke" className="aw-link">privacy@aaronworks.co.ke</a>.
        We respond within 30 days. If you are unsatisfied, you may complain to the
        Office of the Data Protection Commissioner (ODPC), Nairobi.
      </p>

      <h2>8. Children</h2>
      <p>
        Aaron Works is for users aged 18 and over. We do not knowingly collect data
        from children. If you believe a minor has created an account, contact us and
        we will remove it.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update this policy as the marketplace evolves. Material changes are
        announced by email or in-product notice at least 14 days before they take
        effect.
      </p>
    </LegalPage>
  );
}
