import type { Route } from "./+types/contact";
import { LegalShell } from "./legal-shell";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Contact Us | ${SITE_NAME}` },
    {
      name: "description",
      content:
        "Get in touch with the KomikHQ team for support, bug reports, legal inquiries, or partnership discussions.",
    },
  ];
}

export default function ContactRoute() {
  return (
    <LegalShell
      title="Contact Us"
      description="Get in touch with the KomikHQ team for support, bug reports, legal inquiries, or partnership discussions."
      lastUpdated="October 8, 2026"
      currentSlug="contact"
    >
      <p>
        We welcome your inquiries, feedback, bug reports, and partnership proposals. The KomikHQ team is dedicated to providing a fast, clean, and enjoyable reading experience for manga and comic enthusiasts.
      </p>

      <h2>1. Primary Contact Channels</h2>

      <h3>A. General & Technical Support</h3>
      <p>
        For questions about your account, reporting broken chapters or image loading errors, feature suggestions, or general inquiries:
      </p>
      <ul>
        <li>
          <strong>Email</strong>:{" "}
          <a href="mailto:contact@komikhq.com">contact@komikhq.com</a>
        </li>
        <li>
          <strong>Response Time</strong>: Typically within 24 to 48 hours on business days.
        </li>
      </ul>

      <h3>B. Legal & DMCA Inquiries</h3>
      <p>
        For copyright notices, takedown requests, or privacy inquiries:
      </p>
      <ul>
        <li>
          <strong>Email</strong>:{" "}
          <a href="mailto:contact@komikhq.com">contact@komikhq.com</a>
        </li>
        <li>
          <strong>Subject Line</strong>: <code>[DMCA Request]</code> or <code>[Privacy Inquiry]</code>
        </li>
        <li>
          <strong>Processing Time</strong>: Expeditiously handled within 24 to 48 business hours.
        </li>
      </ul>

      <h3>C. Partnerships & Advertising</h3>
      <p>
        For business inquiries, collaboration, or Ad network communication:
      </p>
      <ul>
        <li>
          <strong>Email</strong>:{" "}
          <a href="mailto:contact@komikhq.com">contact@komikhq.com</a>
        </li>
        <li>
          <strong>Subject Line</strong>: <code>[Partnership Inquiry]</code>
        </li>
      </ul>

      <h2>2. Reporting Issues Efficiently</h2>
      <p>
        To help our technical team investigate and resolve issues swiftly, please include the following details in your email:
      </p>
      <ol>
        <li>
          <strong>URL</strong>: The specific web address where the issue occurred (e.g., <code>https://komikhq.com/komik/solo-leveling/chapter-10</code>).
        </li>
        <li>
          <strong>Device & Browser</strong>: Device model, operating system (e.g. Android, iOS, Windows, macOS), and browser type/version.
        </li>
        <li>
          <strong>Description</strong>: A brief explanation of the problem (e.g., blank image, login error, layout overflow).
        </li>
        <li>
          <strong>Screenshots</strong>: Optional, but highly appreciated for rapid debugging.
        </li>
      </ol>

      <h2>3. Cookie & Privacy Choices</h2>
      <p>
        If you wish to change your privacy settings or manage cookies for Google Analytics and Microsoft Clarity, you can do so directly on our website without sending an email by clicking the <strong>"Cookie Settings"</strong> button in the footer of any page.
      </p>
    </LegalShell>
  );
}

