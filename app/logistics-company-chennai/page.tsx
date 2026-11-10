import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight, Home, MessageCircle, Phone } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Logistics Company in Chennai | Freight, Customs, Cargo | KPS',
  description: 'Logistics company in Chennai since 1985: freight forwarding, customs clearance, project cargo and warehousing. Call 044 4508 8099 for a quote.',
  alternates: { canonical: 'https://kpsgroups.net/logistics-company-chennai' },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Logistics Company in Chennai', item: 'https://kpsgroups.net/logistics-company-chennai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What does a logistics company in Chennai do?', acceptedAnswer: { '@type': 'Answer', text: 'It plans and manages the movement of goods between suppliers, ports, warehouses and customers. At KPS, this includes sea and air freight, customs clearance, project cargo, ODC transport and warehousing.' } },
        { '@type': 'Question', name: 'Do you handle both import and export clearance?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We clear both import and export consignments and coordinate with the port, shipping line and transporter.' } },
        { '@type': 'Question', name: 'Can you move oversized or heavy cargo?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We handle project cargo, break bulk, RoRo and over dimensional cargo, including heavy machinery and static units, with route and port planning done before the cargo moves.' } },
        { '@type': 'Question', name: 'How do I get a quote?', acceptedAnswer: { '@type': 'Answer', text: 'Call 044 4508 8099, message us on WhatsApp at +91 98843 88099, or fill in the quote form. Share the cargo details, origin, destination and target date, and we will come back to you with a plan and a quote.' } },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-xl sm:text-2xl font-bold text-brand-green-dark tracking-tight';
const serviceTitleClass = 'text-lg sm:text-xl font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs border-t-4 border-t-brand-yellow space-y-3';

const reasons = [
  { title: 'Experience since 1985', text: 'four decades of handling import, export and domestic cargo.' },
  { title: 'One accountable team', text: 'freight, customs, transport and warehousing are coordinated together, so you are not chasing several vendors.' },
  { title: 'Specialist capability', text: 'project cargo, break bulk, RoRo and over dimensional cargo handled with proper planning, not improvisation.' },
  { title: 'Regional network', text: 'offices in Chennai, Bengaluru, Tuticorin, Visakhapatnam and Kochi support cargo moving across South India.' },
  { title: 'Clear communication', text: 'you get a point of contact and regular status updates until delivery.' },
];

const processSteps = [
  { title: 'Enquiry', text: 'tell us what you are shipping, from where to where, and by when.' },
  { title: 'Planning and quote', text: 'we review the cargo, choose the route and mode, and give you a clear quote.' },
  { title: 'Documentation and customs', text: 'we prepare the paperwork and clear the cargo.' },
  { title: 'Transport and tracking', text: 'we move the cargo and keep you updated.' },
  { title: 'Delivery and follow-up', text: 'we confirm delivery and close out the paperwork.' },
];

export default function LogisticsCompanyChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Logistics Company in Chennai: Freight, Customs and Project Cargo Since 1985" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Logistics Company in Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
              KPS Worldwide Logistics is a logistics company in Chennai that has been moving cargo for Indian businesses since 1985. From our head office in Parrys, we handle sea freight, air freight, customs clearance, project cargo and warehousing, so one accountable team looks after your shipment from pickup to final delivery. Whether you ship a single container or a heavy machinery project, we plan the move around your cargo, your timeline and your budget.
            </p>

            <section className="space-y-4">
              <h2 className={h2Class}>Businesses Choose a Logistics Company in Chennai</h2>
              <p className={pClass}>
                Chennai sits at the centre of South India’s trade. Its port, airport and the industrial belt around the city serve automotive, engineering, electronics and infrastructure businesses that depend on reliable shipping. Choosing the right logistics company in Chennai means fewer delays at the port, cleaner customs paperwork and a single team to call when plans change. That is the standard we hold ourselves to, backed by more than 40 years of experience in Indian trade.
              </p>
            </section>

            {/* Services */}
            <section className="space-y-6">
              <h2 className={h2Class}>Our Logistics Services in Chennai</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className={`${cardClass} md:col-span-2`}>
                  <h3 className={serviceTitleClass}>Sea Freight and Container Shipping</h3>
                  <p className={pClass}>
                    We ship full container load (FCL) and less than container load (LCL) cargo, including open top, flat rack and reefer containers for cargo that does not fit a standard box. Our team coordinates port handling, documentation and inland delivery. See our{' '}
                    <Link href="/services/containerized-cargo" className={linkClass}>sea freight and containerized cargo services</Link>.
                  </p>
                </div>

                <div className={cardClass}>
                  <h4 className={serviceTitleClass}>Freight Forwarding</h4>
                  <p className={pClass}>
                    Our freight forwarding service combines sea, air and road transport under one plan, with documentation, customs coordination and shipment tracking included. Choose the fastest mode or the most economical one, and we manage the handovers between them. Read more about{' '}
                    <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding in Chennai</Link>.
                  </p>
                </div>

                <div className={cardClass}>
                  <h4 className={serviceTitleClass}>Customs Clearance</h4>
                  <p className={pClass}>
                    As a licensed customs broker, we handle import and export clearance, ICEGATE filing, HS classification and duty guidance, so your cargo is not held up at the port. Our customs team works alongside freight operations, which keeps documents and cargo moving together. Explore our{' '}
                    <Link href="/services/customs-brokerage" className={linkClass}>customs clearance services</Link>.
                  </p>
                </div>

                <div className={cardClass}>
                  <h4 className={serviceTitleClass}>Project Cargo and Over Dimensional Cargo</h4>
                  <p className={pClass}>
                    For heavy and oversized cargo, we plan the whole movement in advance: break bulk shipping, RoRo, heavy machinery transport and static units moved on Mafi trailers, with port handling and lashing supervision. Learn about our{' '}
                    <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link> and{' '}
                    <Link href="/services/odc" className={linkClass}>over dimensional cargo</Link> capabilities.
                  </p>
                </div>

                <div className={cardClass}>
                  <h4 className={serviceTitleClass}>Warehousing and FTWZ Solutions</h4>
                  <p className={pClass}>
                    We offer industrial warehousing and Free Trade Warehousing Zone (FTWZ) solutions for businesses that need storage, inventory handling and duty-efficient distribution. See our{' '}
                    <Link href="/services/warehousing" className={linkClass}>warehousing</Link> and{' '}
                    <Link href="/services/ftwz" className={linkClass}>FTWZ services</Link>.
                  </p>
                </div>
              </div>
            </section>

            {/* What Sets KPS Apart */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Sets KPS Apart</h2>
              <p className={pClass}>Customers choose KPS as their logistics company in Chennai for five main reasons:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reasons.map((reason) => (
                  <li key={reason.title} className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5">
                    <p className="text-sm sm:text-[15px] text-brand-gray leading-relaxed">
                      <span className="block text-base font-bold text-brand-green-dark mb-1">{reason.title}:</span>
                      {reason.text}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="pt-4 space-y-4">
                <h3 className={h3Class}>Industries We Serve</h3>
                <p className={pClass}>
                  We support automotive, energy, infrastructure and mining clients, along with manufacturers, importers and exporters who need dependable movement of both containerized and non-containerized cargo. Each industry has different handling, documentation and timing needs, and we plan accordingly. Every business that asks us to be its logistics company in Chennai gets a plan built around its own cargo.
                </p>
              </div>
            </section>

            {/* Process */}
            <section className="space-y-5">
              <h2 className={h2Class}>How We Work</h2>
              <p className={pClass}>Working with a logistics company in Chennai should be simple. Here is our process:</p>
              <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processSteps.map((step, idx) => (
                  <li key={step.title} className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5">
                    <span className="w-9 h-9 rounded-full bg-brand-green text-brand-yellow font-extrabold text-sm flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-[15px] text-brand-gray leading-relaxed">
                      <span className="font-bold text-brand-green-dark">{step.title}:</span> {step.text}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="pt-4 space-y-4">
                <h3 className={h3Class}>How to Choose a Logistics Company in Chennai</h3>
                <p className={pClass}>
                  Before you appoint a partner, check a few basics. Ask whether they hold the right licences for customs work, whether they have handled your type of cargo before, and who will be your point of contact. Check how they communicate delays and what is included in their quote. A good provider answers these questions clearly and in writing. For a longer checklist, read our guide on how to choose a logistics company.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What does a logistics company in Chennai do?" defaultOpen>
                  It plans and manages the movement of goods between suppliers, ports, warehouses and customers. At KPS, this includes sea and air freight, customs clearance, project cargo, ODC transport and warehousing.
                </FaqItem>
                <FaqItem question="Do you handle both import and export clearance?">
                  Yes. We clear both import and export consignments and coordinate with the port, shipping line and transporter.
                </FaqItem>
                <FaqItem question="Can you move oversized or heavy cargo?">
                  Yes. We handle project cargo, break bulk, RoRo and over dimensional cargo, including heavy machinery and static units, with route and port planning done before the cargo moves.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message us on WhatsApp at{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a>, or fill in the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share the cargo details, origin, destination and target date, and we will come back to you with a plan and a quote.
                </FaqItem>
              </div>

              {/* Request a Quote CTA */}
              <div className="!mt-10 relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12">
                <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-4 sm:space-y-5">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">Request a Quote</h3>
                  <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                    Tell us about your shipment and we will build a plan around it. If you want a logistics company in Chennai that plans each move around your cargo,{' '}
                    <Link href="/quote" className="font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]">request a quote</Link> or call{' '}
                    <a href={PHONE_HREF} className="font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F] whitespace-nowrap">044 4508 8099</a>. KPS Worldwide Logistics has served Indian importers, exporters and project teams since 1985.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link
                      href="/quote"
                      className="group inline-flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFD54F] active:bg-[#e0a800] text-[#073B2C] font-extrabold px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all text-sm"
                    >
                      <span>Request a Quote</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                    </Link>
                    <a
                      href={PHONE_HREF}
                      aria-label="Call 044 4508 8099"
                      className="inline-flex items-center justify-center gap-2 bg-[#073B2C]/50 hover:bg-[#ffc107] hover:text-[#073B2C] border border-[#FFC107]/40 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      <span>044 4508 8099</span>
                    </a>
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp +91 98843 88099"
                      className="inline-flex items-center justify-center gap-2 bg-[#073B2C]/50 hover:bg-[#25D366] hover:border-[#25D366] border border-[#FFC107]/40 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>+91 98843 88099</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </div>
  );
}

function FaqItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] open:bg-white open:border-brand-green/40 open:shadow-sm transition-colors overflow-hidden"
    >
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-4 sm:p-5 text-brand-green-dark [&::-webkit-details-marker]:hidden">
        <span className="text-sm sm:text-base font-bold leading-snug">{question}</span>
        <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-gray-light text-brand-gray group-open:bg-brand-green group-open:text-brand-yellow group-open:rotate-180 transition-transform" aria-hidden="true">
          <ChevronDown className="w-4 h-4" />
        </span>
      </summary>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="text-[13.5px] sm:text-[15px] text-brand-gray-dark leading-relaxed">{children}</p>
      </div>
    </details>
  );
}
