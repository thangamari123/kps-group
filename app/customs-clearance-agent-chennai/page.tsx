import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronRight, FileText, Home, MessageCircle, Phone } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Customs Clearance Agent in Chennai | Import & Export | KPS',
  description: 'Customs clearance agent in Chennai for imports and exports: ICEGATE filing, HS classification, duty guidance. 40+ years in trade. Get a quote.',
  alternates: { canonical: 'https://kpsgroups.net/customs-clearance-agent-chennai' },
};

// `provider: { '@id': 'https://kpsgroups.net/#org' }` intentionally omitted: no Organization entity
// with that @id is defined anywhere on the site yet. Add it back once the Organization schema exists.
// The FAQ text matches the visible answers below. If you edit the answers, edit the schema too.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Customs Clearance Services in Chennai',
      serviceType: 'Customs brokerage and clearance',
      url: 'https://kpsgroups.net/customs-clearance-agent-chennai',
      areaServed: [{ '@type': 'City', name: 'Chennai' }, { '@type': 'Country', name: 'India' }],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Customs Services', item: 'https://kpsgroups.net/services' },
        { '@type': 'ListItem', position: 3, name: 'Customs Clearance Agent in Chennai', item: 'https://kpsgroups.net/customs-clearance-agent-chennai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What does a customs clearance agent in Chennai charge?', acceptedAnswer: { '@type': 'Answer', text: 'Charges depend on the type of shipment, the number of documents, whether physical examination is needed and any port or terminal costs. We give a written quote that shows what is included.' } },
        { '@type': 'Question', name: 'Do you clear both imports and exports?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We handle import clearance through the Bill of Entry and export clearance through the Shipping Bill, and coordinate with the terminal and shipping line.' } },
        { '@type': 'Question', name: 'What documents do I need to start?', acceptedAnswer: { '@type': 'Answer', text: 'At minimum, the commercial invoice, packing list and transport document (bill of lading or air waybill), plus your IEC. We confirm anything extra once we know the cargo.' } },
        { '@type': 'Question', name: 'How do I get a quote?', acceptedAnswer: { '@type': 'Answer', text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, origin, destination and target date, and we will reply with a plan and a quote.' } },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-lg font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-yellow space-y-2.5';

const agentTasks = [
  'prepares and files the Bill of Entry for imports or the Shipping Bill for exports',
  'classifies goods under the correct HS code and calculates duty',
  'submits declarations and supporting documents electronically',
  'coordinates inspection, examination and release with customs officers',
  'arranges onward transport once the cargo is cleared',
];

const documentSets = [
  { label: 'Imports', text: 'commercial invoice, packing list, bill of lading or air waybill, Importer Exporter Code (IEC), and any licence, certificate or test report the product requires.' },
  { label: 'Exports', text: 'commercial invoice, packing list, shipping bill, IEC, and a certificate of origin or other certificates if the buyer or product requires them.' },
];

const processSteps = [
  { title: 'Share the shipment details', text: 'cargo, value, origin, destination and timelines.' },
  { title: 'Document check', text: 'we review your papers and flag gaps early.' },
  { title: 'Classification and duty', text: 'we confirm the HS code and estimate the duty.' },
  { title: 'Filing', text: 'we file the Bill of Entry or Shipping Bill through ICEGATE.' },
  { title: 'Examination and release', text: 'we coordinate with customs and the terminal until the cargo is released.' },
  { title: 'Delivery or loading', text: 'the cargo is delivered to you, or loaded for export.' },
];

const reasons = [
  '40+ years of experience in Indian trade and logistics.',
  'Customs and freight under one roof, so documents and cargo stay aligned.',
  'Specialist cargo experience, including project cargo, break bulk and ODC.',
  'A regional network with offices in Chennai, Bengaluru, Tuticorin, Visakhapatnam and Kochi.',
  'Clear communication from a named contact until clearance is complete.',
];

export default function CustomsClearanceAgentChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Customs Clearance Agent in Chennai: Import and Export Clearance, Handled End to End" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <Link href="/services" className="hover:text-brand-green flex-shrink-0 transition-colors">Customs Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Customs Clearance Agent in Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
              KPS Worldwide Logistics works as a customs clearance agent in Chennai for importers, exporters and manufacturers who want their cargo cleared without delays or paperwork errors. With more than 40 years of experience in Indian trade, our customs team prepares the documents, files them through ICEGATE, advises on classification and duty, and coordinates with the port or airport so your cargo keeps moving toward its destination. Because we also run freight and transport, customs work stays in step with the shipment instead of sitting with a separate vendor.
            </p>

            <section className="space-y-5">
              <h2 className={h2Class}>What Does a Customs Clearance Agent in Chennai Do?</h2>
              <p className={pClass}>
                A customs clearance agent, also known as a customs broker or Customs House Agent (CHA), represents you before Indian customs. In practice, the agent:
              </p>
              <ul className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5 sm:p-6 space-y-3">
                {agentTasks.map((task) => (
                  <li key={task} className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <p className={pClass}>
                Mistakes in any of these steps can lead to penalties, storage charges and missed delivery dates, which is why many businesses hand customs work to a specialist.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Our Customs Clearance Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cardClass}>
                  <h3 className={h3Class}>Import Customs Clearance in Chennai</h3>
                  <p className={pClass}>
                    Importers who appoint us as their customs clearance agent in Chennai receive Bill of Entry filing, duty calculation and payment support, coordination with the shipping line and terminal, and delivery arrangements once the cargo is released. We tell you in advance which documents are needed, so cargo is not left waiting at the port for a missing paper.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>Export Customs Clearance in Chennai</h3>
                  <p className={pClass}>
                    For exporters, we prepare the Shipping Bill, check invoices and packing lists, coordinate stuffing and gate-in, and make sure the cargo is cleared in time for the vessel or flight. Documentation requirements depend on your product and destination, and we confirm them before the cargo moves.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>HS Classification and Duty Guidance</h3>
                  <p className={pClass}>
                    Correct classification decides the duty you pay and the compliance risk you carry. Our team reviews your product details, suggests the classification and explains the customs duty and IGST that apply, so there are fewer surprises at assessment.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>Clearance for Project and Oversized Cargo</h3>
                  <p className={pClass}>
                    Heavy machinery and project shipments often need extra documentation and planning. We combine clearance with our{' '}
                    <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link> and{' '}
                    <Link href="/services/odc" className={linkClass}>over dimensional cargo</Link> capability, so one team plans the paperwork, port handling and transport.
                  </p>
                </div>
                <div className={`${cardClass} md:col-span-2`}>
                  <h3 className={h3Class}>Clearance Together with Freight</h3>
                  <p className={pClass}>
                    <Link href="/services/customs-brokerage" className={linkClass}>Customs clearance</Link> is part of our{' '}
                    <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding service</Link>. When freight and clearance are managed together, documents, cargo and deadlines stay aligned. See also our{' '}
                    <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link> and{' '}
                    <Link href="/fcl-shipping-chennai" className={linkClass}>FCL shipping from Chennai</Link>.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Documents Required for Customs Clearance</h2>
              <p className={pClass}>
                The documents your customs clearance agent in Chennai needs depend on your cargo, but the usual set includes:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documentSets.map((set) => (
                  <li key={set.label} className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs">
                    <span className="w-10 h-10 rounded-xl bg-brand-green-bg text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <FileText className="w-5 h-5" />
                    </span>
                    <p className={pClass}>
                      <span className="block font-bold text-brand-green-dark mb-1">{set.label}:</span>
                      {set.text}
                    </p>
                  </li>
                ))}
              </ul>
              <p className={pClass}>
                Send us your cargo details and we will confirm the exact list before the shipment moves.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>How Customs Clearance Works</h2>
              <p className={pClass}>Here is how clearance works when KPS is your customs clearance agent in Chennai:</p>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>How to Choose a Customs Clearance Agent</h2>
              <p className={pClass}>
                Before you appoint a customs clearance agent in Chennai, ask a few direct questions. Is the agent licensed for customs work, and can they show it? Have they cleared your type of cargo before? Who will be your point of contact, and how will they keep you updated? What does the quote include, and what is charged extra? A reliable agent answers these clearly and in writing.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Why Businesses Choose KPS</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reasons.map((reason) => (
                  <li key={reason} className="flex gap-3 rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-yellow">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span className="text-sm sm:text-[15px] text-brand-gray-dark leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What does a customs clearance agent in Chennai charge?" defaultOpen>
                  Charges depend on the type of shipment, the number of documents, whether physical examination is needed and any port or terminal costs. We give a written quote that shows what is included.
                </FaqItem>
                <FaqItem question="Do you clear both imports and exports?">
                  Yes. We handle import clearance through the Bill of Entry and export clearance through the Shipping Bill, and coordinate with the terminal and shipping line.
                </FaqItem>
                <FaqItem question="What documents do I need to start?">
                  At minimum, the commercial invoice, packing list and transport document (bill of lading or air waybill), plus your IEC. We confirm anything extra once we know the cargo.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo details, origin, destination and target date, and we will reply with a plan and a quote.
                </FaqItem>
              </div>
            </section>
          </article>
        </div>
      </section>

      {/* Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote from a Customs Clearance Agent in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                If you need a customs clearance agent in Chennai who plans around your cargo and your deadline, tell us what you are shipping and we will take it from there.{' '}
                <Link href="/quote" className={ctaLinkClass}>Request a quote</Link> or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>044 4508 8099</a>.{' '}
                <Link href="/about-us" className={ctaLinkClass}>Learn more about KPS</Link>, see our{' '}
                <Link href="/logistics-services-chennai" className={ctaLinkClass}>full range of logistics services</Link>, or read about us as a{' '}
                <Link href="/logistics-company-chennai" className={ctaLinkClass}>logistics company in Chennai</Link>.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/quote"
                  className="group inline-flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFD54F] active:bg-[#e0a800] text-[#073B2C] font-extrabold px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all text-sm"
                >
                  <span>Request a quote</span>
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
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] open:bg-white open:border-brand-green/40 open:shadow-sm transition-colors overflow-hidden"
    >
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-4 sm:p-5 text-brand-green-dark [&::-webkit-details-marker]:hidden">
        <h3 className="text-sm sm:text-base font-bold leading-snug">{question}</h3>
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
