import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms that govern use of the Aaron Works freelancer marketplace, including escrow, fees and disputes.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="These terms govern your use of Aaron Works, a Kenyan freelancer marketplace operated from Nairobi. By creating an account or using the platform you agree to them."
    >
      <h2>1. Who we are</h2>
      <p>
        Aaron Works provides a venue that connects businesses (&ldquo;clients&rdquo;)
        with independent professionals (&ldquo;freelancers&rdquo;). We are not the
        employer of any freelancer and we do not provide the services listed on the
        platform. Our role includes verification, escrow administration and dispute
        mediation.
      </p>

      <h2>2. Eligibility and accounts</h2>
      <ul>
        <li>You must be at least 18 and legally able to enter contracts in Kenya.</li>
        <li>Provide accurate information and keep it current.</li>
        <li>
          You are responsible for activity under your account. Do not share your
          password or sign-in links.
        </li>
        <li>
          One person or business may hold one client account and one freelancer
          account. Duplicate accounts may be merged or closed.
        </li>
      </ul>

      <h2>3. Posting jobs and proposals</h2>
      <ul>
        <li>
          Job posts must describe real work with a budget and deadline. Misleading,
          discriminatory or unlawful listings are removed.
        </li>
        <li>
          Freelancers must submit their own work history and may not misrepresent
          skills, qualifications or portfolio ownership.
        </li>
        <li>
          Proposals are non-binding until a contract is formed in the platform and
          escrow is funded.
        </li>
      </ul>

      <h2>4. Escrow and payments</h2>
      <ul>
        <li>
          Clients fund the agreed amount before work begins. Funds are held by Aaron
          Works and released when milestones are approved or after the review window
          expires without objection.
        </li>
        <li>
          Platform fees are shown before a contract is formed. Fees are inclusive of
          applicable taxes unless stated otherwise.
        </li>
        <li>
          Freelancer payouts are made to M-Pesa or a Kenyan bank account within two
          working days of release.
        </li>
        <li>
          Payments made outside escrow are at your own risk and are not covered by
          our dispute process.
        </li>
      </ul>

      <h2>5. Client obligations</h2>
      <ul>
        <li>Provide clear briefs, timely feedback and reasonable access to information.</li>
        <li>Approve or query milestones within five working days.</li>
        <li>
          Do not ask freelancers to work off-platform to avoid fees, or to hand over
          passwords, PINs or unnecessary personal data.
        </li>
      </ul>

      <h2>6. Freelancer obligations</h2>
      <ul>
        <li>Deliver work with reasonable skill and care, on the agreed timeline.</li>
        <li>Communicate delays before the deadline, not after.</li>
        <li>
          Keep client information confidential and use it only for the contracted
          work.
        </li>
        <li>
          Hold the rights needed to grant the licence you promise. Third-party
          assets must be properly licensed.
        </li>
      </ul>

      <h2>7. Prohibited activity</h2>
      <p>
        No illegal goods or services, academic fraud, impersonation, malware,
        harassment, spam, scraping of personal data, or circumvention of escrow.
        Accounts may be suspended while we investigate reports.
      </p>

      <h2>8. Disputes</h2>
      <ol>
        <li>Either party may raise a dispute from the contract page within 14 days of a milestone.</li>
        <li>Both sides upload evidence (brief, deliverable, messages) within five working days.</li>
        <li>
          Our Nairobi-based team reviews the record and issues a decision within five
          working days of receiving complete evidence. Decisions may release, split
          or refund escrow.
        </li>
        <li>
          Both parties agree to attempt good-faith resolution before pursuing
          external proceedings.
        </li>
      </ol>

      <h2>9. Intellectual property and confidentiality</h2>
      <p>
        Freelancers retain ownership until full payment, then grant the client a
        worldwide, perpetual licence to use the delivered work as described in the
        job post. Aaron Works retains all rights in the platform, brand and
        underlying software. Feedback may be used to improve the service.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by Kenyan law, Aaron Works is not liable for
        indirect losses, lost profits or deleted data, and our aggregate liability is
        limited to the platform fees received on the contract giving rise to the
        claim. Nothing excludes liability that cannot lawfully be excluded.
      </p>

      <h2>11. Suspension and termination</h2>
      <p>
        We may suspend or close accounts that breach these terms, present fraud risk
        or attract repeated substantiated disputes. You may close your account at any
        time; obligations under active contracts and record-keeping requirements
        survive.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of Kenya. Courts in Nairobi have
        exclusive jurisdiction, without prejudice to mandatory consumer protections.
      </p>

      <h2>13. Changes</h2>
      <p>
        We may amend these terms with at least 14 days&rsquo; notice for material
        changes. Continued use after the effective date constitutes acceptance.
      </p>
    </LegalPage>
  );
}
