import type { Route } from "./+types/dmca";
import { LegalShell } from "./legal-shell";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `DMCA & Copyright Policy | ${SITE_NAME}` },
    {
      name: "description",
      content:
        "Digital Millennium Copyright Act (DMCA) compliance notice, copyright disclaimers, and takedown notice procedures for KomikHQ.",
    },
  ];
}

export default function DmcaRoute() {
  return (
    <LegalShell
      title="DMCA & Copyright Policy"
      description="Digital Millennium Copyright Act (DMCA) compliance notice, copyright disclaimers, and takedown notice procedures for KomikHQ."
      lastUpdated="October 8, 2026"
      currentSlug="dmca"
    >
      <p>
        <strong>KomikHQ</strong> ("we", "us", "our") respects the intellectual property rights of creators, authors, artists, and publishers, and expects its users to do the same. It is our policy to respond promptly to clear notices of alleged copyright infringement that comply with the <strong>Digital Millennium Copyright Act (DMCA)</strong> and international copyright frameworks.
      </p>

      <h2>1. General Disclaimer</h2>
      <ul>
        <li>
          KomikHQ operates as an index and reader interface for digital comic and manga content.
        </li>
        <li>
          We do not assert ownership over any comics, manga, manhwa, or manhua displayed on the platform. All copyrights, trademarks, and intellectual property belong strictly to their respective authors, artists, and publishers.
        </li>
        <li>
          None of the comic materials are hosted directly with commercial licensing on our core servers; content is fetched via decentralized CDN pipelines and indexing streams.
        </li>
      </ul>

      <h2>2. Notice and Takedown Procedure</h2>
      <p>
        If you are a copyright owner, or authorized to act on behalf of one, and you believe in good faith that any content accessible on or through <strong>https://komikhq.com</strong> infringes upon your copyright, please send a written notification to our Designated Copyright Agent at <strong>contact@komikhq.com</strong> containing the following required information:
      </p>

      <h3>Required Information for DMCA Notice:</h3>
      <ol>
        <li>
          <strong>Identification of the Work</strong>: The title(s) of the copyrighted comic, manga, or work claimed to have been infringed, or a representative list of works.
        </li>
        <li>
          <strong>Identification of the Infringing Material</strong>: The exact URL(s) on KomikHQ where the allegedly infringing material is located (e.g., <code>https://komikhq.com/komik/manga-slug/chapter-1</code>).
        </li>
        <li>
          <strong>Contact Information</strong>: Your full legal name, company or organization name, mailing address, telephone number, and official email address.
        </li>
        <li>
          <strong>Statement of Good Faith</strong>: A statement that you have a good faith belief that the disputed use of the material is not authorized by the copyright owner, its agent, or the law.
        </li>
        <li>
          <strong>Statement of Accuracy and Authority</strong>: A statement made under penalty of perjury that the information in your notification is accurate and that you are the copyright owner or authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
        </li>
        <li>
          <strong>Physical or Electronic Signature</strong>: A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.
        </li>
      </ol>

      <h2>3. Designated Copyright Agent Contact</h2>
      <p>Please send all copyright notices to:</p>
      <ul>
        <li><strong>Attn</strong>: KomikHQ DMCA & Copyright Agent</li>
        <li><strong>Email</strong>: <a href="mailto:contact@komikhq.com">contact@komikhq.com</a></li>
        <li><strong>Subject Line</strong>: <code>[DMCA Takedown Request] - [Comic Title]</code></li>
      </ul>

      <h2>4. Processing and Response Time</h2>
      <ul>
        <li>
          Upon receipt of a valid and complete DMCA notice at <strong>contact@komikhq.com</strong>, we will take expeditious action to remove or disable access to the identified material (typically within <strong>24 to 48 business hours</strong>).
        </li>
        <li>
          We may notify the user or contributor who posted or requested the material, providing them with a copy of the notification.
        </li>
      </ul>

      <h2>5. Counter-Notification Procedure</h2>
      <p>
        If you believe that your content was removed or disabled by mistake or misidentification, you may submit a written counter-notification to our Designated Agent containing:
      </p>
      <ol>
        <li>Identification of the material that has been removed or disabled.</li>
        <li>Your name, address, phone number, and email.</li>
        <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.</li>
        <li>Your physical or electronic signature.</li>
      </ol>

      <h2>6. Repeat Infringers Policy</h2>
      <p>
        KomikHQ maintains a strict policy to terminate user accounts and ban network access for individuals who are repeatedly found to be infringing upon third-party copyrights or violating intellectual property terms.
      </p>
    </LegalShell>
  );
}

