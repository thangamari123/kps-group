import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronRight, FileText, Home, MessageCircle, Phone, Anchor, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Export Customs Clearance in Chennai | Documents & LEO | KPS',
  description: 'Export customs clearance in Chennai: Shipping Bill filing, documents, Let Export Order and port coordination. Get a quote from KPS.',
  alternates: { canonical: 'https://kpsgroups.net/export-customs-clearance-chennai' },
};

// `provider: { '@id': 'https://kpsgroups.net/#org' }` intentionally omitted: no Organization entity
// with that @id is defined anywhere on the site yet. Add it back once the Organization schema exists.
// The FAQ text matches the visible answers below. If you edit the answers, edit the schema too.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Export Customs Clearance in Chennai',
      serviceType: 'Export customs clearance',
      url: 'https://kpsgroups.net/export-customs-clearance-chennai',
      areaServed: [{ '@type': 'City', name: 'Chennai' }, { '@type': 'Country', name: 'India' }],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Export Customs Clearance in Chennai', item: 'https://kpsgroups.net/export-customs-clearance-chennai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a Let Export Order (LEO)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "It is customs' final permission for export cargo to be loaded onto the vessel or aircraft. Without it, the carrier cannot load the cargo.",
          },
        },
        {
          '@type': 'Question',
          name: 'What documents do I need for export clearance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Usually the commercial invoice, packing list, IEC, bank (AD) code details, GST details and transport details, plus any certificate or permit the product needs. We confirm the exact list once we know the cargo and destination.',
          },
        },
        {
          '@type': 'Question',
          name: 'How early should I start export customs clearance in Chennai?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'As early as you can, ideally before the cargo reaches the port, so the documents can be checked against the vessel or flight cut-off. Tell us the shipment date when you enquire and we will plan backwards from it.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, destination and shipment date, and we will reply with a plan and a quote.',
          },
        },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-lg font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';

const processSteps = [
  {
    step: 1,
    title: 'Registration',
    text: 'You need a valid Importer Exporter Code (IEC), and your bank (AD) code registered with customs for shipping bills.',
  },
  {
    step: 2,
    title: 'Documents prepared',
    text: 'Commercial invoice, packing list and the export order or contract.',
  },
  {
    step: 3,
    title: 'Shipping Bill filed on ICEGATE',
    text: 'This is filed by the exporter or a customs agent, with supporting documents uploaded electronically.',
  },
  {
    step: 4,
    title: 'Assessment and risk check',
    text: 'Customs reviews the declaration. Some consignments pass without examination, while others are selected for checking.',
  },
  {
    step: 5,
    title: 'Gate-in and examination',
    text: 'The cargo reaches the port or container freight station, and is examined if customs orders it.',
  },
  {
    step: 6,
    title: 'Duty, if applicable',
    text: 'A few products attract export duty or cess, and where that applies it must be paid before the order is issued.',
  },
  {
    step: 7,
    title: 'Let Export Order (LEO)',
    text: 'Customs gives final permission, and without it the carrier cannot load the cargo.',
  },
  {
    step: 8,
    title: 'Loading and transport document',
    text: 'The cargo is loaded and the carrier issues the bill of lading or air waybill.',
  },
];

const documentsList = [
  'Commercial invoice and packing list',
  'Importer Exporter Code (IEC) and bank (AD) code details',
  'GST details',
  'Bill of lading or air waybill details',
  'Export order, purchase order or contract',
  'Certificate of origin, if your buyer or the destination country requires it',
  'Licences, permits or quality certificates for regulated products',
];

export default function ExportCustomsClearanceChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Export Customs Clearance in Chennai: Process, Documents and Let Export Order" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Export Customs Clearance in Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
              KPS Worldwide Logistics handles export customs clearance in Chennai for manufacturers, traders and project exporters shipping goods out of India by sea or air. We prepare and file the Shipping Bill, check your documents for consistency, coordinate gate-in and port formalities, and follow the consignment until customs gives the Let Export Order, so your cargo makes its vessel or flight. This page covers the process, the documents and the common causes of delay. For the wider service, see our{' '}
              <Link href="/services/customs-brokerage" className={linkClass}>customs clearance services</Link>.
            </p>

            {/* Section 2: How Export Customs Clearance in Chennai Works */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className={h2Class}>How Export Customs Clearance in Chennai Works</h2>
                <p className={pClass}>The sequence is similar for most exports:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processSteps.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-green hover:shadow-md transition-shadow"
                  >
                    <span className="w-9 h-9 rounded-full bg-brand-green text-brand-yellow font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-xs" aria-hidden="true">
                      {item.step}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-bold text-brand-green-dark text-[15px] sm:text-base leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-[14.5px] text-brand-gray leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Documents Needed */}
            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className={h2Class}>Documents Needed</h2>
                <p className={pClass}>The documents for export customs clearance in Chennai normally include:</p>
              </div>

              <ul className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5 sm:p-6 space-y-3">
                {documentsList.map((doc) => (
                  <li key={doc} className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-brand-gray-muted bg-white p-4 sm:p-5 shadow-xs">
                <p className={pClass}>
                  Customs checks that these documents agree with each other, so even a small mismatch in value, quantity or description can raise a query. Send us your cargo details and we will confirm the list for your product and destination.
                </p>
              </div>
            </section>

            {/* Section 4: What Slows Exports Down */}
            <section className="space-y-4">
              <h2 className={h2Class}>What Slows Exports Down</h2>
              <div className="flex gap-4 rounded-2xl border border-brand-yellow/60 bg-[#fff8e1] p-5 sm:p-6 shadow-xs">
                <AlertTriangle className="w-6 h-6 text-brand-yellow-dark flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-2">
                  <p className="text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    Most delays in export customs clearance in Chennai come from a few causes: documents that do not match, a missing certificate, an IEC or bank code problem, cargo reaching the port after the cut-off, or an examination that was not planned for. A missed vessel can mean waiting for the next sailing, and sometimes extra storage charges. We check documents before filing, plan around the cut-off and keep you informed.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: What We Handle for Export Customs Clearance in Chennai */}
            <section className="space-y-5">
              <h2 className={h2Class}>What We Handle for Export Customs Clearance in Chennai</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 space-y-3.5 shadow-xs">
                <ul className="space-y-3">
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>Shipping Bill filing through ICEGATE, with document upload</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>Document checks for consistency before filing</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>Coordination of stuffing, gate-in and vessel or flight cut-offs</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>Examination support if customs selects the consignment</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>Let Export Order follow-up and handover to the carrier</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>
                      Container exports: see our{' '}
                      <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link> and{' '}
                      <Link href="/fcl-shipping-chennai" className={linkClass}>FCL shipping from Chennai</Link>
                    </span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>
                      Freight with clearance: our{' '}
                      <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link> team works alongside the customs desk
                    </span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>
                      Heavy and project cargo: clearance combined with{' '}
                      <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link> and{' '}
                      <Link href="/services/odc" className={linkClass}>over dimensional cargo</Link> handling
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6: Chennai’s Sea and Air Gateways */}
            <section className="space-y-5">
              <h2 className={h2Class}>Chennai’s Sea and Air Gateways</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 space-y-4 shadow-xs border-l-4 border-l-brand-green">
                <p className={pClass}>
                  For export customs clearance in Chennai, cargo leaves through the city’s seaports and airport cargo terminal: Chennai Port, Kamarajar Port (Ennore), Kattupalli Port, the Chennai Airport air cargo terminal, and the notified container freight stations (CFS) and inland container depots (ICD) KPS works with. Each gateway has its own gate-in timings and cut-offs, so planning has to start from the facility your cargo will use.
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-brand-gray-light p-4 border border-brand-gray-muted">
                  <Anchor className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm sm:text-[15px] text-brand-gray-dark leading-relaxed">
                    Our regional offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru cover other South Indian gateways, ensuring seamless clearance for consignments routed through regional maritime and dry port hubs.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Why Exporters Choose KPS */}
            <section className="space-y-4">
              <h2 className={h2Class}>Why Exporters Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-yellow shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-brand-green-dark">
                  <ShieldCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base">Coordinated Customs, Freight & Transport</span>
                </div>
                <p className={pClass}>
                  Exporters choose KPS for export customs clearance in Chennai because customs, freight and transport are handled by one team, with 40+ years of experience in Indian trade behind it. We handle containerized and non-containerized cargo, including heavy machinery and project shipments, and you get a named contact and regular updates until the cargo is on its way.
                </p>
              </div>
            </section>

            {/* Section 8: Frequently Asked Questions */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What is a Let Export Order (LEO)?" defaultOpen>
                  It is customs’ final permission for export cargo to be loaded onto the vessel or aircraft. Without it, the carrier cannot load the cargo.
                </FaqItem>
                <FaqItem question="What documents do I need for export clearance?">
                  Usually the commercial invoice, packing list, IEC, bank (AD) code details, GST details and transport details, plus any certificate or permit the product needs. We confirm the exact list once we know the cargo and destination.
                </FaqItem>
                <FaqItem question="How early should I start export customs clearance in Chennai?">
                  As early as you can, ideally before the cargo reaches the port, so the documents can be checked against the vessel or flight cut-off. Tell us the shipment date when you enquire and we will plan backwards from it.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo details, destination and shipment date, and we will reply with a plan and a quote.
                </FaqItem>
              </div>
            </section>
          </article>
        </div>
      </section>

      {/* Section 9: Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote for Export Customs Clearance in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are exporting and when it must ship, and we will send a clear plan and quote.{' '}
                <Link href="/quote" className={ctaLinkClass}>Request a quote</Link> or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>044 4508 8099</a>.{' '}
                <Link href="/about-us" className={ctaLinkClass}>Learn more about KPS</Link>, explore our{' '}
                <Link href="/services" className={ctaLinkClass}>full range of services</Link>, see how we handle{' '}
                <Link href="/customs-clearance-agent-chennai" className={ctaLinkClass}>import customs clearance</Link> or read about us as a{' '}
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

