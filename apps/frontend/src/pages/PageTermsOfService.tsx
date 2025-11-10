const PageTermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Terms of Service
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
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using TimeClout (&quot;the Service&quot;), you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                TimeClout is a team scheduling and leave management platform
                that provides tools for managing employee schedules, leave
                requests, and team coordination. The Service includes web-based
                applications and related services.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must create an
                account. You are responsible for:
              </p>
              <ul>
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>
                  Notifying us immediately of any unauthorized use of your
                  account
                </li>
                <li>
                  Ensuring that your account information is accurate and
                  up-to-date
                </li>
              </ul>

              <h2>4. Acceptable Use</h2>
              <p>You agree not to use the Service to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>
                  Attempt to gain unauthorized access to the Service or other
                  users&apos; accounts
                </li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>
                  Use the Service for any commercial purpose without our express
                  written consent
                </li>
              </ul>

              <h2>5. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Please review our Privacy
                Statement, which also governs your use of the Service, to
                understand our practices regarding the collection and use of
                your information.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of TT3
                and its licensors. The Service is protected by copyright,
                trademark, and other laws.
              </p>

              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                In no event shall TT3, nor its directors, employees, partners,
                agents, suppliers, or affiliates, be liable for any indirect,
                incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from your use of
                the Service.
              </p>

              <h2>9. Disclaimer</h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS
                AVAILABLE&quot; basis. TT3 makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties
                including without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property.
              </p>

              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>

              <h2>11. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the
                jurisdiction in which TT3 operates, without regard to its
                conflict of law provisions.
              </p>

              <h2>12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us through the Service or at our designated contact
                address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTermsOfService;
