import PageHero from '../components/common/PageHero';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      {/* Page Hero */}
      <PageHero 
        title="Privacy Policy" 
        description="Effective Date: 17/07/2025"
        bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Legal Text Layout */}
      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-brand-gray-light border border-brand-gray-muted rounded-xl p-8 md:p-12 shadow-sm space-y-8 font-light text-sm text-brand-gray leading-relaxed">
            
            {/* Section 1: Company Details */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                1. Company Details
              </h3>
              <ul className="space-y-1 pl-1">
                <li><strong className="text-brand-green-dark">Company Name:</strong> KPS & Co</li>
                <li><strong className="text-brand-green-dark">Website:</strong> <a href="http://www.kpsgroups.net" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">www.kpsgroups.net</a></li>
                <li>
                  <strong className="text-brand-green-dark block mt-1">Address:</strong>
                  <span className="block pl-4 mt-0.5">
                    No.14, 6th Floor, A.K. Nayak Bhavan,<br />
                    Jahangir Street, Second Line Beach,<br />
                    Parrys, Chennai, Tamil Nadu – 600 001, India.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 2: How We Use the Data */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                2. How We Use the Data
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitate import/export orders, documentation, customs clearance, warehousing, shipping, and last-mile delivery.</li>
                <li>Maintain legal compliance with customs and trade regulations (e.g., FTWZ and bonded warehousing).</li>
                <li>Communicate with clients (order updates, support).</li>
                <li>Optimize our operations and user experience.</li>
                <li>Send marketing information, only if consent is provided.</li>
              </ul>
            </div>

            {/* Section 3: Data Storage & Security */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                3. Data Storage & Security
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Data is stored on encrypted servers hosted in India.</li>
                <li>Access is restricted to authorized personnel only.</li>
                <li>Security protocols align with ISO/IEC 27001 standards.</li>
                <li>Regular audits and backups ensure data integrity.</li>
              </ul>
            </div>

            {/* Section 4: Data Sharing */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                4. Data Sharing
              </h3>
              <ul className="space-y-1 pl-1">
                <li><strong className="text-brand-green-dark">Shared With:</strong> Freight partners, airlines, shipping lines, customs authorities, bonded warehouse operators.</li>
                <li><strong className="text-brand-green-dark">Purpose:</strong> Shipment handling, regulatory compliance, billing fulfillment.</li>
                <li><strong className="text-brand-green-dark">Safeguards:</strong> Protected by non-disclosure and data protection agreements.</li>
              </ul>
            </div>

            {/* Section 5: Cookies & Tracking */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                5. Cookies & Tracking
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cookies are used to enhance site functionality and analytics.</li>
                <li>Users may manage or disable cookies via their browser settings.</li>
              </ul>
            </div>

            {/* Section 6: Your Rights */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                6. Your Rights
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access, correct, delete, or restrict your personal data.</li>
                <li>Withdraw consent for marketing communications at any time.</li>
                <li>Raise data concerns with India’s Data Protection Authority.</li>
                <li>Contact us at <a href="mailto:info@kpsgroups.net" className="text-brand-green hover:underline">info@kpsgroups.net</a> to exercise your rights.</li>
              </ul>
            </div>

            {/* Section 7: Retention Policy */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                7. Retention Policy
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Shipment and compliance data is retained per Indian legal mandates (customs, audit, taxation).</li>
                <li>Marketing/analytical data is deleted after 2 years of inactivity or upon request.</li>
              </ul>
            </div>

            {/* Section 8: Policy Updates */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                8. Policy Updates
              </h3>
              <p className="pl-1">
                This policy may be updated periodically. Changes will be posted on this page with a revised effective date.
              </p>
            </div>

            {/* Section 9: Contact Us */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                9. Contact Us
              </h3>
              <ul className="space-y-1 pl-1">
                <li><strong className="text-brand-green-dark">Email:</strong> <a href="mailto:info@kpsgroups.net" className="text-brand-green hover:underline">info@kpsgroups.net</a></li>
                <li><strong className="text-brand-green-dark">Phone:</strong> +91-44-4508 8099</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
