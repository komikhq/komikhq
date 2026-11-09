import type { Route } from "./+types/privacy";
import { LegalShell } from "./legal-shell";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Privacy Policy | ${SITE_NAME}` },
    {
      name: "description",
      content:
        "How KomikHQ collects, uses, and protects your information, including Google Analytics, Microsoft Clarity, and third-party advertising cookie disclosures.",
    },
  ];
}

export default function PrivacyRoute() {
  return (
    <LegalShell
      title="Privacy Policy"
      description="How KomikHQ collects, uses, and protects your information, including Google Analytics, Microsoft Clarity, and third-party advertising cookie disclosures."
      lastUpdated="October 8, 2026"
      currentSlug="privacy"
    >
      <p>
        Welcome to <strong>KomikHQ</strong> ("we", "our", or "us"). We are committed to protecting your personal information and respecting your privacy. This Privacy Policy explains what information we collect, how we use it, your rights, and how third-party technologies (including Google Analytics, Microsoft Clarity, and advertising networks) operate on our platform.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>A. Information You Provide Directly</h3>
      <ul>
        <li>
          <strong>Account Credentials</strong>: Email address, display name, and securely hashed passwords (managed via Better Auth).
        </li>
        <li>
          <strong>User Preferences</strong>: Reading history, bookmarks, favorite manga, and theme preferences.
        </li>
        <li>
          <strong>Communications</strong>: If you contact us directly at <a href="mailto:contact@komikhq.com">contact@komikhq.com</a>, we receive your email and message contents.
        </li>
      </ul>

      <h3>B. Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Device and Browser Data</strong>: Browser type, operating system, device model, screen resolution.
        </li>
        <li>
          <strong>Log and Usage Data</strong>: Pages viewed, manga chapters read, time spent, referral sources, and IP address.
        </li>
      </ul>

      <h2>2. Cookies and Tracking Technologies</h2>
      <p>
        KomikHQ uses cookies and similar storage technologies (such as <code>localStorage</code>) to maintain essential site functionality and analyze user engagement.
      </p>
      <ul>
        <li>
          <strong>Strictly Necessary Cookies</strong>: Required for core authentication, session security, and theme storage.
        </li>
        <li>
          <strong>Analytics Cookies (Google Analytics 4)</strong>: Measures anonymous visitor traffic and system performance.
        </li>
        <li>
          <strong>Experience Cookies (Microsoft Clarity)</strong>: Captures anonymous behavioral metrics and heatmaps to improve usability.
        </li>
      </ul>

      <h2>3. Managing Cookie Preferences</h2>
      <p>
        You have full control over non-essential cookies. You can review or change your preferences at any time by clicking the <strong>"Cookie Settings"</strong> button in the footer or in the callout above.
      </p>

      <h2>4. Data Retention and Security</h2>
      <p>
        We retain your personal information only as long as necessary. We implement industry-standard security safeguards (HTTPS encryption, hashed passwords) to protect your information.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        If you have questions regarding this Privacy Policy, please reach out to: <a href="mailto:contact@komikhq.com">contact@komikhq.com</a>.
      </p>
    </LegalShell>
  );
}

