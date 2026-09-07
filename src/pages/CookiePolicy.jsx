import PageHero from '../components/common/PageHero';

export default function CookiePolicy() {
  return (
    <div className="bg-white">
      {/* Page Hero */}
      <PageHero 
        title="Cookie Policy" 
        description="Effective Date: 17/07/2025"
        bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Cookie Policy Content */}
      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-brand-gray-light border border-brand-gray-muted rounded-xl p-8 md:p-12 shadow-sm space-y-6 font-light text-sm text-brand-gray leading-relaxed">
            
            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              1. What are Cookies?
            </h3>
            <p>
              Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, keep track of form drafts, and analyze site traffic to improve user experiences.
            </p>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              2. How We Use Cookies
            </h3>
            <p>
              We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted). These cookies serve the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-brand-green-dark">Essential Cookies:</strong> Required to enable navigation, security filters, and custom form inputs.</li>
              <li><strong className="text-brand-green-dark">Analytical Cookies:</strong> Used to aggregate visitor volume and page metrics to evaluate site performance.</li>
              <li><strong className="text-brand-green-dark">Functional Cookies:</strong> Stores user choices, such as dismissing the newsletter subscription pop-up.</li>
            </ul>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              3. Managing Cookie Preferences
            </h3>
            <p>
              You can configure your web browser to block or delete cookies. Please note that disabling essential cookies may impact your ability to submit quote requests or job application forms correctly.
            </p>

            <h3 className="text-lg font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
              4. Contact Us
            </h3>
            <p>
              For questions regarding our use of cookies, please email us at <a href="mailto:info@kpsgroups.net" className="text-brand-green hover:underline">info@kpsgroups.net</a>.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}
