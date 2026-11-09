import { Link } from "react-router";
import type { Route } from "./+types/terms";
import { LegalShell } from "./legal-shell";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Terms of Service | ${SITE_NAME}` },
    {
      name: "description",
      content:
        "Terms and conditions governing the access and use of the KomikHQ web platform and related services.",
    },
  ];
}

export default function TermsRoute() {
  return (
    <LegalShell
      title="Terms of Service"
      description="Terms and conditions governing the access and use of the KomikHQ web platform and related services."
      lastUpdated="October 8, 2026"
      currentSlug="terms"
    >
      <p>
        Welcome to <strong>KomikHQ</strong>. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and <strong>KomikHQ</strong> ("we", "us", "our") regarding your access to and use of <a href="https://komikhq.com">https://komikhq.com</a> and associated services.
      </p>

      <h2>1. Acceptance and Eligibility</h2>
      <ul>
        <li>
          <strong>Age Requirement</strong>: You must be at least 13 years of age (or the minimum legal age required in your country) to use KomikHQ. If you are under the age of majority, you may use KomikHQ only under the supervision of a parent or legal guardian.
        </li>
        <li>
          <strong>Account Registration</strong>: To access certain features (such as bookmarks, history synchronization, and custom profile settings), you may create an account. You agree to provide accurate information and keep your credentials confidential.
        </li>
      </ul>

      <h2>2. Platform Usage & License</h2>
      <p>
        KomikHQ grants you a non-exclusive, non-transferable, revocable, limited license to access and use the platform strictly for personal, non-commercial reading and entertainment purposes.
      </p>

      <h3>Prohibited Conduct:</h3>
      <p>You agree <strong>not</strong> to:</p>
      <ol>
        <li>Use automated scripts, spiders, bots, or scrapers to bulk download, crawl, or index comic images and site assets.</li>
        <li>Interfere with or disrupt the integrity, performance, or security of our servers, Cloudflare edge networks, or database systems.</li>
        <li>Post unlawful, abusive, harassing, defamatory, vulgar, or hateful content in comments or user profiles.</li>
        <li>Attempt to reverse engineer, decompile, or bypass security barriers or authentication mechanisms.</li>
        <li>Exploit the platform for unauthorized commercial gain, advertising, or mass spamming.</li>
      </ol>

      <h2>3. Intellectual Property Rights & Content</h2>
      <ul>
        <li>
          <strong>Platform Assets</strong>: The KomikHQ name, logo, UI/UX designs, code, stylesheets, and custom algorithms are protected by copyright, trademark, and intellectual property laws.
        </li>
        <li>
          <strong>Comic Material</strong>: All comics, manga, manhwa, and manhua displayed on the platform are the property of their respective creators, publishers, and copyright holders. KomikHQ acts as a content index and reader interface.
        </li>
        <li>
          If you are a copyright owner and believe your work is displayed without authorization, please refer to our <Link to="/dmca">DMCA & Copyright Policy</Link> for takedown procedures.
        </li>
      </ul>

      <h2>4. User Accounts & Termination</h2>
      <ul>
        <li>You are responsible for all activities that occur under your account.</li>
        <li>We reserve the right to suspend or terminate accounts that violate these Terms, engage in malicious activities, or compromise server stability without prior notice.</li>
        <li>You may delete your account and personal data at any time by contacting <a href="mailto:contact@komikhq.com">contact@komikhq.com</a>.</li>
      </ul>

      <h2>5. Third-Party Links & Services</h2>
      <p>
        KomikHQ may include links to third-party services, tools, or advertisements (such as Google AdSense). We do not control and are not responsible for the content, privacy practices, or accuracy of external websites. Your interactions with third parties are solely between you and the respective provider.
      </p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        KomikHQ is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, KomikHQ and its maintainers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your access to or inability to access or use the platform.
      </p>

      <h2>8. Inquiries & Contact Information</h2>
      <p>
        For questions or legal notices regarding these Terms, please contact us at: <a href="mailto:contact@komikhq.com">contact@komikhq.com</a>.
      </p>
    </LegalShell>
  );
}

