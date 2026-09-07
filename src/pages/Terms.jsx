import PageHero from '../components/common/PageHero';

export default function Terms() {
  return (
    <div className="bg-white">
      {/* Page Hero */}
      <PageHero 
        title="Terms of Service" 
        description="Effective Date: 17/07/2025"
        bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Terms of Service Content */}
      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-brand-gray-light border border-brand-gray-muted rounded-xl p-8 md:p-12 shadow-sm space-y-6 font-light text-sm text-brand-gray leading-relaxed">
            
            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing and using the website of K.P.S & Co. (www.kpsgroups.net), you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our online resources.
            </p>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              2. Scope of Services
            </h3>
            <p>
              Our website provides information regarding customs brokerage, first/last mile transportation, warehousing, FTWZ solutions, and project logistics services in India. Any quotes or contract agreements initiated through our online forms are subject to formal confirmation by K.P.S & Co. representatives.
            </p>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              3. User Responsibilities
            </h3>
            <p>
              Users are responsible for ensuring that all data submitted via contact, career, or quote forms is accurate and truthful. Submitting fraudulent documentation, resumes, or cargo descriptions is strictly prohibited.
            </p>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              4. Liability & Disclaimers
            </h3>
            <p>
              While we strive to maintain high system uptime, K.P.S & Co. does not guarantee that our website will be uninterrupted or error-free. Information regarding trade policies or tax schemes is provided as general guidelines and does not substitute for formal regulatory advisory services.
            </p>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              5. Governing Law
            </h3>
            <p>
              These terms are governed by and construed in accordance with the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu, India.
            </p>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              6. Contact Information
            </h3>
            <p>
              For questions regarding our terms, please email us at <a href="mailto:info@kpsgroups.net" className="text-brand-green hover:underline">info@kpsgroups.net</a>.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}
