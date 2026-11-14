import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronRight, FileText, Home, MessageCircle, Phone, Anchor, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Customs House Agent in Chennai (CHA) | Import & Export | KPS',
  description: 'Customs house agent in Chennai (CHA) for import and export clearance at the port and airport. ICEGATE filing, duty guidance. Get a quote.',
  alternates: { canonical: 'https://kpsgroups.net/customs-house-agent-chennai' },
};

// `provider: { '@id': 'https://kpsgroups.net/#org' }` intentionally omitted: no Organization entity
// with that @id is defined anywhere on the site yet. Add it back once the Organization schema exists.
// The FAQ text matches the visible answers below. If you edit the answers, edit the schema too.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Customs House Agent (CHA) Services in Chennai',
      serviceType: 'Customs clearance',
      url: 'https://kpsgroups.net/customs-house-agent-chennai',
      areaServed: [{ '@type': 'City', name: 'Chennai' }, { '@type': 'Country', name: 'India' }],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Customs House Agent in Chennai', item: 'https://kpsgroups.net/customs-house-agent-chennai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a customs house agent in Chennai?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "A CHA is a licensed professional or firm that files customs declarations and handles clearance formalities for importers and exporters at Chennai's ports, airport and cargo facilities. The term is the traditional name for a customs broker.",
          },
        },
        {
          '@type': 'Question',
          name: 'Is a CHA the same as a freight forwarder?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. A CHA handles customs clearance. A freight forwarder arranges transport, bookings and documents for the journey. KPS provides both, so they can be coordinated.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I have to appoint a CHA?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most importers and exporters appoint one because customs filing is technical and errors are costly. Whether you may file for yourself depends on your business and the customs rules, so ask us if you are unsure.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, origin, destination and target date, and we will reply with a plan and a quote.',
          },
        },
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

const chaTasks = [
  'Filing the Bill of Entry (imports) or Shipping Bill (exports) through ICEGATE',
  'Classifying goods under the correct HS code and working out duty',
  'Submitting documents and answering customs queries',
  'Arranging examination when customs asks for it',
  'Coordinating with the terminal, container freight station, shipping line or airline',
  'Arranging delivery or loading once the cargo is released',
];

const documentSets = [
  {
    label: 'Imports',
    text: 'commercial invoice, packing list, bill of lading or air waybill, Importer Exporter Code (IEC), and any licence, certificate or test report the product requires.',
  },
  {
    label: 'Exports',
    text: 'commercial invoice, packing list, shipping bill details, IEC, and a certificate of origin or other certificates if the buyer or product requires them.',
  },
];

export default function CustomsHouseAgentChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Customs House Agent in Chennai (CHA): Import and Export Clearance" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Customs House Agent in Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
              KPS Worldwide Logistics works as a customs house agent in Chennai for importers, exporters and manufacturers who need cargo cleared at the port, airport or inland facility without delays or errors. We prepare and file your customs documents, advise on classification and duty, and coordinate release, while our freight and transport teams move the cargo, so clearance and delivery stay in step. This page explains what a CHA does, how CHA licensing works and what to expect from KPS. For the full service list, see our{' '}
              <Link href="/services/customs-brokerage" className={linkClass}>customs clearance services</Link>.
            </p>

            {/* Section 2: What Does a Customs House Agent in Chennai Do? */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Does a Customs House Agent in Chennai Do?</h2>
              <p className={pClass}>
                A CHA is a person or firm that is licensed to act for importers and exporters in their dealings with customs. In Chennai, that typically means:
              </p>
              <ul className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5 sm:p-6 space-y-3">
                {chaTasks.map((task) => (
                  <li key={task} className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3: CHA, Customs Broker and Clearing Agent: What Is the Difference? */}
            <section className="space-y-4">
              <h2 className={h2Class}>CHA, Customs Broker and Clearing Agent: What Is the Difference?</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 space-y-3">
                <p className={pClass}>
                  &ldquo;CHA&rdquo; stands for Customs House Agent, the name used under the older licensing regulations. Licensing is now governed by the Customs Brokers Licensing Regulations, 2018, which use the term &ldquo;customs broker&rdquo;, but most people in the trade still say CHA. &ldquo;Clearing agent&rdquo; is an everyday description. Whichever name you use, a customs house agent in Chennai must hold a valid licence to file declarations for others, so ask to see the licence before you appoint anyone. KPS holds a valid customs broker licence and will provide licence details and credentials upon request.
                </p>
              </div>
            </section>

            {/* Section 4: Our Services as a Customs House Agent in Chennai */}
            <section className="space-y-5">
              <h2 className={h2Class}>Our Services as a Customs House Agent in Chennai</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cardClass}>
                  <h3 className={h3Class}>Import Clearance</h3>
                  <p className={pClass}>
                    Bill of Entry filing, duty calculation and payment support, coordination with the terminal, and delivery arrangements after release. We flag missing documents early so cargo is not left waiting at the port.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>Export Clearance</h3>
                  <p className={pClass}>
                    Shipping Bill preparation, document checks, gate-in coordination and clearance in time for the vessel or flight.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>HS Classification and Duty Guidance</h3>
                  <p className={pClass}>
                    We review your product details, suggest the classification and explain how duty and IGST apply, so there are fewer surprises at assessment.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className={h3Class}>Heavy and Project Cargo</h3>
                  <p className={pClass}>
                    Heavy machinery and oversized shipments need extra planning. We combine clearance with{' '}
                    <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link> and{' '}
                    <Link href="/services/odc" className={linkClass}>over dimensional cargo</Link> handling.
                  </p>
                </div>
                <div className={`${cardClass} md:col-span-2`}>
                  <h3 className={h3Class}>Clearance with Freight and Transport</h3>
                  <p className={pClass}>
                    Our{' '}
                    <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link> and{' '}
                    <Link href="/services/containerized-cargo" className={linkClass}>sea freight</Link> teams work alongside the customs desk, so documents and cargo stay aligned.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: CHA Coverage at Chennai’s Ports, Airport and Cargo Facilities */}
            <section className="space-y-5">
              <h2 className={h2Class}>CHA Coverage at Chennai’s Ports, Airport and Cargo Facilities</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 space-y-4 shadow-xs border-l-4 border-l-brand-green">
                <p className={pClass}>
                  As a customs house agent in Chennai, we handle cargo through the city’s sea and air gateways: Chennai Port, Kamarajar Port (Ennore), Kattupalli Port, the Chennai Airport air cargo terminal, and notified Container Freight Stations (CFS) and Inland Container Depots (ICD). Procedures differ between a seaport, an airport cargo terminal and a container freight station, so documents and timing need to be planned around the right facility.
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-brand-gray-light p-4 border border-brand-gray-muted">
                  <Anchor className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm sm:text-[15px] text-brand-gray-dark leading-relaxed">
                    Our regional offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru support cargo arriving through other South Indian gateways, providing connected customs coordination across the southern corridor.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Documents Your CHA Will Ask For */}
            <section className="space-y-5">
              <h2 className={h2Class}>Documents Your CHA Will Ask For</h2>
              <p className={pClass}>
                Your customs house agent in Chennai will usually need the following:
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

            {/* Section 7: CHA or Freight Forwarder: Which Do You Need? */}
            <section className="space-y-4">
              <h2 className={h2Class}>CHA or Freight Forwarder: Which Do You Need?</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5 sm:p-6 space-y-3">
                <p className={pClass}>
                  A CHA handles customs formalities. A freight forwarder arranges the journey itself: carrier bookings, transport, documents and tracking. Many businesses need both, and KPS provides both under one team, so the paperwork and the cargo are planned together. Read more about our{' '}
                  <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding services</Link>.
                </p>
              </div>
            </section>

            {/* Section 8: Why Clients Choose KPS */}
            <section className="space-y-4">
              <h2 className={h2Class}>Why Clients Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-yellow shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-brand-green-dark">
                  <ShieldCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base">Integrated Customs, Freight & Transport</span>
                </div>
                <p className={pClass}>
                  Clients choose KPS as their customs house agent in Chennai because customs, freight and transport are coordinated by one team, backed by 40+ years of experience in Indian trade. We handle containerized and non-containerized cargo, including project and oversized shipments, and you get a named contact and regular updates until clearance is complete.
                </p>
              </div>
            </section>

            {/* Section 9: Frequently Asked Questions */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What is a customs house agent in Chennai?" defaultOpen>
                  A CHA is a licensed professional or firm that files customs declarations and handles clearance formalities for importers and exporters at Chennai’s ports, airport and cargo facilities. The term is the traditional name for a customs broker.
                </FaqItem>
                <FaqItem question="Is a CHA the same as a freight forwarder?">
                  No. A CHA handles customs clearance. A freight forwarder arranges transport, bookings and documents for the journey. KPS provides both, so they can be coordinated.
                </FaqItem>
                <FaqItem question="Do I have to appoint a CHA?">
                  Most importers and exporters appoint one because customs filing is technical and errors are costly. Whether you may file for yourself depends on your business and the customs rules, so ask us if you are unsure.
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

      {/* Section 10: Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote from a Customs House Agent in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are importing or exporting and when it needs to move, and we will send a clear plan and quote.{' '}
                <Link href="/quote" className={ctaLinkClass}>Request a quote</Link> or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>044 4508 8099</a>.{' '}
                <Link href="/about-us" className={ctaLinkClass}>Learn more about KPS</Link>, explore our{' '}
                <Link href="/services" className={ctaLinkClass}>full range of services</Link> or read about us as a{' '}
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

