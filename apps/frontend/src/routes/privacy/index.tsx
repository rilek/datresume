import PageFooter from "@/components/layout/footer";
import PageHeader from "@/components/layout/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader />
      <PrivacyPolicy />
      <PageFooter />
    </>
  );
}

function PrivacyPolicy() {
  return (
    <div className="prose mx-auto max-w-2xl p-6">
      <h1 className="text-center">Privacy Policy</h1>
      <p>
        <strong>Effective Date:</strong> 02.2025
      </p>

      <p>
        Thank you for choosing to use <strong>Datresume</strong> (the “App”). We value your privacy and want to be
        transparent about how we collect, use, and protect your data. This Privacy Policy explains the types of
        information we may collect from you, how we use it, and the measures we take to keep it secure.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Personal Data You Provide</h3>
      <ul>
        <li>
          <strong>Contact Form Information:</strong> When you use the contact form, we collect your{" "}
          <strong>name</strong>, <strong>email address</strong>, and <strong>message</strong> to allow us to respond to
          your inquiry.
        </li>
        <li>
          <strong>Resume Content (via Local Storage):</strong> The App allows you to input and edit your resume content.
          This data is
          <strong> stored in your device’s local storage</strong> (and not on our servers) so that only you have access
          to it.
        </li>
      </ul>

      <h3>1.2 Automatically Collected Information</h3>
      <p>
        We use <strong>Umami Cloud analytics</strong> to collect basic usage information about how you interact with the
        App, such as page views, referring URLs, and approximate location based on IP address. This data helps us
        understand how the App is being used and improve our services. For more details on Umami’s data practices,
        please refer to their documentation or privacy information.
      </p>

      <h2>2. How We Use Your Information</h2>

      <h3>2.1 Local Storage of Resume Data</h3>
      <p>
        All resume data you enter into the App is stored locally on your device. We do not have direct access to this
        information, nor do we store it on our servers.
      </p>

      <h3>2.2 Using GPT API for Resume Adjustments</h3>
      <p>
        When you use the “Chat with AI” feature, relevant content may be sent to the OpenAI GPT API. This is done
        through our account with OpenAI.
      </p>
      <ul>
        <li>
          <strong>Purpose:</strong> To generate suggestions and improvements for your resume.
        </li>
        <li>
          <strong>Disclaimer:</strong> While we strive to protect your data, sending your information to a third-party
          API means it is subject to OpenAI’s data handling practices as well. Please refer to{" "}
          <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">
            OpenAI’s Privacy Policy
          </a>{" "}
          for more details on how they handle data.
        </li>
      </ul>

      <h3>2.3 Contact Form Submissions</h3>
      <p>
        We use <strong>Mailjet</strong> (a third-party email service) to process and send emails from the contact form.
        The name, email, and message you provide are transmitted via Mailjet’s services directly to our personal email
        inbox. We use this information solely to respond to your inquiry or request.
      </p>

      <h3>2.4 Analytics Data</h3>
      <p>
        The analytics data collected via Umami Cloud (e.g., page views, referring URLs, approximate location, etc.) is
        used to:
      </p>
      <ul>
        <li>Understand how users interact with our App</li>
        <li>Improve the App’s features and user experience</li>
        <li>Monitor and analyze performance</li>
      </ul>
      <p>This data is generally processed in an aggregated or pseudonymized format.</p>

      <h2>3. Legal Bases for Processing (GDPR-specific)</h2>
      <p>
        If you are located in the European Economic Area (EEA), we process your personal data under the following legal
        bases:
      </p>
      <ul>
        <li>
          <strong>Consent:</strong> By providing your personal data through the contact form or using the resume feature
          with GPT, you consent to our processing of that data for the purposes described in this Privacy Policy.
        </li>
        <li>
          <strong>Legitimate Interests:</strong> For improving our services, communicating with users, analyzing how the
          App is used, and ensuring the safety and security of the App.
        </li>
      </ul>

      <h2>4. How We Share Your Information</h2>
      <h3>4.1 Third-Party Service Providers</h3>
      <ul>
        <li>
          <strong>OpenAI GPT:</strong> Data you enter for resume adjustment will be shared with OpenAI’s service.
        </li>
        <li>
          <strong>Mailjet:</strong> Contact form submissions (including personal data) are sent via Mailjet to our
          personal email.
        </li>
        <li>
          <strong>Umami Cloud:</strong> Usage data is collected and processed via Umami Cloud analytics.
        </li>
      </ul>

      <h3>4.2 No Sale of Personal Information</h3>
      <p>
        We do <strong>not</strong> sell or rent your personal information to any third parties.
      </p>

      <h3>4.3 Legal Compliance</h3>
      <p>
        We may disclose personal information if required to do so by law or in response to valid requests by public
        authorities (e.g., a court or a government agency).
      </p>

      <h2>5. Data Retention</h2>
      <ul>
        <li>
          <strong>Local Storage:</strong> Resume data is retained on your device until you choose to delete it or clear
          your browser’s local storage. We do not control this data or how long it remains on your device.
        </li>
        <li>
          <strong>Contact Form Data:</strong> Emails received from you are retained in our email inbox for as long as
          necessary to respond to and resolve your request, or as required by applicable law.
        </li>
        <li>
          <strong>Analytics Data:</strong> Usage data may be retained by Umami Cloud in accordance with their retention
          policies. This data is often aggregated or pseudonymized.
        </li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have certain rights regarding your personal data:</p>
      <ul>
        <li>
          <strong>Access:</strong> Request a copy of the personal information we hold about you.
        </li>
        <li>
          <strong>Rectification:</strong> Request that we correct any inaccuracies in your personal data.
        </li>
        <li>
          <strong>Erasure:</strong> Request that we delete the personal information we hold about you.
        </li>
        <li>
          <strong>Objection:</strong> Object to certain types of data processing (if applicable under local law).
        </li>
        <li>
          <strong>Withdrawal of Consent:</strong> Where we rely on your consent, you have the right to withdraw it at
          any time.
        </li>
      </ul>
      <p>To exercise any of these rights, please contact us using contact form.</p>

      <h2>7. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal data. However, no method
        of transmission over the internet or electronic storage is entirely secure.
      </p>
      <ul>
        <li>
          <strong>Local Storage:</strong> Because your resume data is stored locally in your browser/device, you are
          responsible for keeping your device secure from unauthorized access.
        </li>
      </ul>

      <h2>8. International Data Transfers</h2>
      <p>
        If you are using our App from outside the country where our servers or third-party providers are located, please
        be aware that your information may be transferred across international borders. We will ensure adequate
        safeguards for any such transfers in compliance with applicable data protection laws.
      </p>

      <h2>9. Children’s Privacy</h2>
      <p>
        Our App is not intended for children under the age of 13 (or under the applicable age of majority in certain
        jurisdictions). We do not knowingly collect personal data from children without appropriate parental or guardian
        consent. If you believe we have collected information from a child under the relevant age, please contact us so
        we can take appropriate action.
      </p>

      <h2>10. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will post the revised policy here with a new{" "}
        <strong>Effective Date</strong>. We encourage you to review this Privacy Policy periodically to stay informed
        about our data practices.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us
        using contact form.
      </p>

      <p>
        <strong>By using Datresume, you acknowledge that you have read and understood this Privacy Policy.</strong>
      </p>
    </div>
  );
}
