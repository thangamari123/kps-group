import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Check, ChevronDown, ChevronRight, FileText, Home, MessageCircle, Phone } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Customs Broker in Chennai | Import & Export Clearance | KPS',
  description: 'Customs broker in Chennai for import and export clearance. Learn what a broker does, what to check and how KPS can help. Get a quote.',
  alternates: { canonical: 'https://kpsgroups.net/customs-broker-chennai' },
};

// `provider: { '@id': 'https://kpsgroups.net/#org' }` intentionally omitted: no Organization entity
// with that @id is defined anywhere on the site yet. Add it back once the Organization schema exists.
// The FAQ text matches the visible answers below. If you edit the answers, edit the schema too.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Customs Broker in Chennai',
      serviceType: 'Customs brokerage',
      url: 'https://kpsgroups.net/customs-broker-chennai',
      areaServed: [{ '@type': 'City', name: 'Chennai' }, { '@type': 'Country', name: 'India' }],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Customs Broker in Chennai', item: 'https://kpsgroups.net/customs-broker-chennai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I find a reliable customs broker in Chennai?', acceptedAnswer: { '@type': 'Answer', text: 'Check the licence, ask for similar clearances they have handled, request a written quote and confirm who your contact will be. Avoid any broker that cannot show a valid licence.' } },
        { '@type': 'Question', name: 'Is a customs broker the same as a CHA?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. CHA (Customs House Agent) is the older name for a customs broker. Both refer to a licensed professional who files customs declarations for importers and exporters.' } },
        { '@type': 'Question', name: 'Can one broker handle both imports and exports?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We handle import and export clearance, and we can arrange freight and transport as well.' } },
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

const brokerTasks = [
  'Prepares and files the Bill of Entry (imports) or Shipping Bill (exports) electronically',
  'Classifies your goods under the right HS code and works out the applicable duty',
  'Checks invoices, packing lists and certificates for gaps before filing',
  'Deals with customs officers on queries, examination and release',
  'Coordinates with the terminal, shipping line or airline and arranges onward transport',
];

const checklist = [
  { title: 'Licence', text: 'ask for the licence number, the issuing customs office and its validity.' },
  { title: 'Experience with your cargo', text: 'has the broker cleared similar goods and values?' },
  { title: 'Named contact', text: 'you should know who handles your file and how to reach them.' },
  { title: 'Written quote', text: 'it should state what is included and what is charged extra.' },
  { title: 'Communication', text: 'ask how and when you will be updated during clearance.' },
  { title: 'Problem handling', text: 'find out how they deal with a query, an examination or a classification dispute.' },
];

export default function CustomsBrokerChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Customs Broker in Chennai for Import and Export Clearance" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Customs Broker in Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
              KPS Worldwide Logistics is a customs broker in Chennai, and our business has handled cargo for Indian trade since 1985. We prepare your documents, file them with customs, advise on classification and duty, and coordinate release at the port or airport, so your cargo moves on schedule. This page explains what a broker does, how to choose one and what to expect when you work with KPS. For the full service breakdown, see our{' '}
              <Link href="/services/customs-brokerage" className={linkClass}>customs clearance services</Link>.
            </p>

            <section className="space-y-5">
              <h2 className={h2Class}>What a Customs Broker in Chennai Does for You</h2>
              <p className={pClass}>
                Indian customs rules are detailed, and errors are costly. A customs broker acts for you before customs and takes care of the technical work:
              </p>
              <ul className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5 sm:p-6 space-y-3">
                {brokerTasks.map((task) => (
                  <li key={task} className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
              <p className={pClass}>
                The aim is simple: your cargo is cleared once, correctly, without storage charges or penalties building up.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Customs Broker, CHA or Clearing Agent?</h2>
              <p className={pClass}>
                These names describe the same job. “Customs House Agent” (CHA) is the traditional term, “customs broker” is the term used in current regulations, and “clearing agent” is the everyday label. Many importers search for a CHA when what they need is a licensed customs broker in Chennai who can file on their behalf. What matters is the licence, not the label.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Our Customs Broker Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cardClass}>
                  <h3 className={h3Class}>Import Clearance</h3>
                  <p className={pClass}>
                    Importers use us as their customs broker in Chennai to file the Bill of Entry, calculate and pay duty, coordinate with the terminal and arrange delivery after release. We flag missing documents early, so cargo is not left waiting at the port.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>Export Clearance</h3>
                  <p className={pClass}>
                    We prepare the Shipping Bill, check export documents, coordinate gate-in and make sure cargo is cleared in time for the vessel or flight.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>Classification and Duty Advice</h3>
                  <p className={pClass}>
                    We review your product details, suggest the HS classification and explain how duty and IGST apply, so fewer surprises come up at assessment.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>Heavy and Project Cargo</h3>
                  <p className={pClass}>
                    Heavy machinery and project cargo need extra planning. We combine clearance with{' '}
                    <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link> and{' '}
                    <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link>, so documents, port handling and transport are planned together.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Common Customs Delays and How a Broker Helps</h2>
              <p className={pClass}>
                Most delays come from a small set of causes: an incorrect HS classification, a mismatch between the invoice and the packing list, a missing certificate, a delay in paying duty, or a query that nobody answers quickly. A good broker catches these before filing, replies to customs queries the same day and keeps you informed, so a small problem does not turn into days of storage charges at the port.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>How to Choose a Customs Broker in Chennai</h2>
              <p className={pClass}>
                Appointing the wrong broker can cost you time and money. Check these points before you decide:
              </p>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklist.map((item, idx) => (
                  <li key={item.title} className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5">
                    <span className="w-9 h-9 rounded-full bg-brand-green text-brand-yellow font-extrabold text-sm flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-[15px] text-brand-gray leading-relaxed">
                      <span className="font-bold text-brand-green-dark">{item.title}:</span> {item.text}
                    </p>
                  </li>
                ))}
              </ol>
              <div className="flex gap-3 rounded-2xl border border-brand-yellow/60 bg-[#fff8e1] p-5">
                <AlertTriangle className="w-5 h-5 text-brand-yellow-dark flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                  Warning signs include a broker who will not show a licence, gives only a verbal price or cannot tell you which documents are needed.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>What Affects Customs Broker Fees</h2>
              <p className={pClass}>
                The fee charged by a customs broker in Chennai depends on the type and complexity of the shipment, the number of documents and line items, whether examination is needed, port or terminal charges, and any extra services such as transport or warehousing. Customs duty is paid to the government and is separate from the broker’s service fee, so a good quote shows both clearly.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Documents to Have Ready</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs">
                  <span className="w-10 h-10 rounded-xl bg-brand-green-bg text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <FileText className="w-5 h-5" />
                  </span>
                  <p className={pClass}>
                    For imports, have the commercial invoice, packing list, bill of lading or air waybill, your Importer Exporter Code (IEC) and any licence or certificate the product requires.
                  </p>
                </div>
                <div className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs">
                  <span className="w-10 h-10 rounded-xl bg-brand-green-bg text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <FileText className="w-5 h-5" />
                  </span>
                  <p className={pClass}>
                    For exports, have the commercial invoice, packing list, shipping bill details, IEC and any certificate the buyer or product requires.
                  </p>
                </div>
              </div>
              <p className={pClass}>
                Send us your cargo details and we will confirm the exact list before the shipment moves.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Why Clients Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-green">
                <p className={pClass}>
                  Clients choose KPS as their customs broker in Chennai because customs work sits alongside freight and transport. One team plans the paperwork, the cargo movement and the deadlines, backed by 40+ years of experience in Indian trade. We handle containerized and non-containerized cargo, and our offices in Bengaluru, Tuticorin, Visakhapatnam and Kochi support cargo across South India.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="How do I find a reliable customs broker in Chennai?" defaultOpen>
                  Check the licence, ask for similar clearances they have handled, request a written quote and confirm who your contact will be. Avoid any broker that cannot show a valid licence.
                </FaqItem>
                <FaqItem question="Is a customs broker the same as a CHA?">
                  Yes. CHA (Customs House Agent) is the older name for a customs broker. Both refer to a licensed professional who files customs declarations for importers and exporters.
                </FaqItem>
                <FaqItem question="Can one broker handle both imports and exports?">
                  Yes. We handle import and export clearance, and we can arrange freight and transport as well.
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
                Request a Quote from a Customs Broker in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are importing or exporting and when it needs to move, and we will give you a clear plan and quote.{' '}
                <Link href="/quote" className={ctaLinkClass}>Request a quote</Link> or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>044 4508 8099</a>.{' '}
                <Link href="/about-us" className={ctaLinkClass}>Learn more about KPS</Link>, explore our{' '}
                <Link href="/logistics-services-chennai" className={ctaLinkClass}>full range of services</Link> or read about us as a{' '}
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
