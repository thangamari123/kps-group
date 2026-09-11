import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';

export const metadata: Metadata = {
  title: 'Privacy Policy | KPS Worldwide Logistics',
  description: 'Learn how KPS Worldwide Logistics collects, secures, uses, and safeguards client and logistics information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <PageHero 
        title="Privacy Policy" 
        description="Effective Date: 17/07/2025"
        bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-brand-gray-light border border-brand-gray-muted rounded-xl p-8 md:p-12 shadow-sm space-y-8 font-light text-sm text-brand-gray leading-relaxed">
            
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

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                5. Cookies & Tracking
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cookies are used to enhance site functionality and analytics.</li>
                <li>Users may manage or disable cookies via their browser settings.</li>
              </ul>
            </div>

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

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                7. Retention Policy
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Data is retained as required by Indian customs and tax laws (typically up to 5 to 7 years for shipping and financial records).</li>
                <li>Non-essential inquiry data is purged after 12 months of inactivity.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                8. Policy Updates
              </h3>
              <p className="pl-1">
                We reserve the right to update this policy periodically to reflect statutory amendments or organizational process shifts. Any changes will be announced on this page with an updated effective date.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
