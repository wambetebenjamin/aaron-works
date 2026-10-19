import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "How Aaron Works uses cookies and local storage, and how to manage your consent under the Kenya Data Protection Act 2019.",
  alternates: { canonical: "/legal/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="This policy explains how Aaron Works uses cookies and similar browser storage, and how you can change your choices at any time."
    >
      <h2>1. What cookies are</h2>
      <p>
        Cookies are small files stored on your device. We also use local storage to
        remember your cookie choice without sending it to our servers on every
        request. Neither is a virus, and neither can read other files on your device.
      </p>

      <h2>2. Your consent</h2>
      <p>
        When you first visit, a banner asks whether to accept all cookies or manage
        preferences by category. Your decision is saved in local storage under the
        key <code>aaron_works_consent</code> together with the time you made it.
        You can reopen the preferences dialog from the &ldquo;Cookie settings&rdquo;
        link in the footer, or by clearing this storage.
      </p>
      <p>
        Necessary cookies are always active because the service cannot function
        without them. Optional categories remain off until you enable them. We do
        not use dark patterns, pre-ticked marketing cookies or cookie walls.
      </p>

      <h2>3. Categories we use</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Purpose</th>
            <th>Examples</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Necessary</td>
            <td>Sign-in, security, load balancing, escrow session integrity</td>
            <td>
              <code>next-auth.session-token</code>, CSRF token, Vercel routing
              cookies
            </td>
            <td>Always on</td>
          </tr>
          <tr>
            <td>Functional</td>
            <td>Remember filters, language, saved freelancers and dashboard layout</td>
            <td>Saved search preferences, display settings</td>
            <td>Off until enabled</td>
          </tr>
          <tr>
            <td>Analytics</td>
            <td>Understand which pages and job categories are useful</td>
            <td>Aggregated page views and performance timings</td>
            <td>Off until enabled</td>
          </tr>
          <tr>
            <td>Marketing</td>
            <td>Measure campaigns that bring clients and freelancers to Aaron Works</td>
            <td>Campaign attribution parameters</td>
            <td>Off until enabled</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Third-party services</h2>
      <ul>
        <li>
          <strong>Google reCAPTCHA v3</strong> runs invisibly on forms to distinguish
          people from bots. It may set Google cookies and receives a score signal;
          it is used for security, not advertising.
        </li>
        <li>
          <strong>Google OAuth</strong> is used only if you choose &ldquo;Continue
          with Google&rdquo;.
        </li>
        <li>
          <strong>Vercel</strong> hosts the site and processes aggregated traffic
          logs. <strong>Vercel Analytics and Speed Insights</strong> are used for
          aggregate performance measurement when analytics is enabled.
        </li>
      </ul>

      <h2>5. Retention</h2>
      <p>
        Session cookies expire when you sign out or after 30 days. Preference
        storage persists until you clear it. Analytics data is aggregated and kept
        for up to 26 months.
      </p>

      <h2>6. Managing cookies</h2>
      <ul>
        <li>Use the &ldquo;Cookie settings&rdquo; link in the site footer.</li>
        <li>
          Clear site data in your browser settings (Chrome, Safari, Firefox or Edge)
          to remove <code>aaron_works_consent</code> and any stored preferences.
        </li>
        <li>
          Blocking necessary cookies will prevent sign-in, proposal submission and
          messaging from working.
        </li>
      </ul>

      <h2>7. Your data protection rights</h2>
      <p>
        Cookie data may constitute personal data under the Kenya Data Protection Act
        2019. You have the right to be informed, to object to processing and to
        withdraw consent. See our{" "}
        <a href="/legal/privacy-policy" className="aw-link">
          privacy policy
        </a>{" "}
        or contact <a href="mailto:privacy@aaronworks.co.ke" className="aw-link">privacy@aaronworks.co.ke</a>.
      </p>

      <h2>8. Changes</h2>
      <p>
        If we introduce a new cookie category we will update this policy and ask for
        consent again where required.
      </p>
    </LegalPage>
  );
}
