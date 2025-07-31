const PagePrivacyStatement = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Privacy Statement
              </h1>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="mt-8 prose prose-gray max-w-none">
              <h2>1. Introduction</h2>
              <p>
                TT3 ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Statement explains how we collect, use,
                disclose, and safeguard your information when you use our team
                scheduling and leave management platform.
              </p>

              <h2>2. Information We Collect</h2>

              <h3>2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li>
                  Name and contact information (email address, phone number)
                </li>
                <li>Company and job title information</li>
                <li>Account credentials and authentication data</li>
                <li>Profile information and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3>2.2 Usage Information</h3>
              <p>
                We automatically collect certain information about your use of
                the Service:
              </p>
              <ul>
                <li>
                  Log data (IP address, browser type, access times, pages
                  viewed)
                </li>
                <li>Device information (device type, operating system)</li>
                <li>Usage patterns and interactions with the Service</li>
                <li>Performance data and error reports</li>
              </ul>

              <h3>2.3 Business Data</h3>
              <p>As part of the Service, we may process:</p>
              <ul>
                <li>Employee schedules and shift information</li>
                <li>Leave requests and approvals</li>
                <li>Team and organizational structure data</li>
                <li>Work-related communications and notes</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the collected information for the following purposes:
              </p>
              <ul>
                <li>Providing and maintaining the Service</li>
                <li>Processing and managing your account</li>
                <li>Facilitating team scheduling and leave management</li>
                <li>Sending important service-related communications</li>
                <li>Improving and optimizing the Service</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties except in the following
                circumstances:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with trusted third-party service providers who assist us in
                  operating the Service
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law or to protect our rights and
                  safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of assets, your information may be
                  transferred
                </li>
                <li>
                  <strong>Consent:</strong> We may share information with your
                  explicit consent
                </li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                However, no method of transmission over the internet or
                electronic storage is 100% secure.
              </p>

              <h2>6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to
                provide the Service and fulfill the purposes outlined in this
                Privacy Statement, unless a longer retention period is required
                or permitted by law.
              </p>

              <h2>7. Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul>
                <li>
                  <strong>Access:</strong> Request access to your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Request a copy of your data in a
                  portable format
                </li>
                <li>
                  <strong>Restriction:</strong> Request restriction of
                  processing
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of
                  processing
                </li>
              </ul>

              <h2>8. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your
                experience, analyze usage patterns, and provide personalized
                content. You can control cookie settings through your browser
                preferences.
              </p>

              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your information in accordance with this
                Privacy Statement.
              </p>

              <h2>10. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you believe we have collected such information,
                please contact us immediately.
              </p>

              <h2>11. Changes to This Privacy Statement</h2>
              <p>
                We may update this Privacy Statement from time to time. We will
                notify you of any material changes by posting the new Privacy
                Statement on this page and updating the "Last updated" date.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Statement or our
                privacy practices, please contact us through the Service or at
                our designated contact address.
              </p>

              <h2>13. California Privacy Rights</h2>
              <p>
                California residents have additional rights under the California
                Consumer Privacy Act (CCPA). If you are a California resident,
                you may have the right to know what personal information we
                collect, use, and disclose, and to request deletion of your
                personal information.
              </p>

              <h2>14. European Privacy Rights</h2>
              <p>
                If you are located in the European Economic Area (EEA), you have
                additional rights under the General Data Protection Regulation
                (GDPR), including the right to lodge a complaint with a
                supervisory authority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePrivacyStatement;
