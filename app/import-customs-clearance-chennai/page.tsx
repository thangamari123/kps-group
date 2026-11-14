import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronRight, FileText, Home, MessageCircle, Phone, Anchor, ShieldCheck, AlertTriangle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Import Customs Clearance in Chennai | Documents & Duty | KPS',
  description: 'Import customs clearance in Chennai: Bill of Entry filing, duty guidance, ICEGATE and port coordination. See the process and documents. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/import-customs-clearance-chennai',
  },
};

// `provider: { '@id': 'https://kpsgroups.net/#org' }` intentionally omitted: no Organization entity
// with that @id is defined anywhere on the site yet. Add it back once the Organization schema exists.
// The FAQ text matches the visible answers below. If you edit the answers, edit the schema too.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Import Customs Clearance in Chennai',
      serviceType: 'Import customs clearance',
      url: 'https://kpsgroups.net/import-customs-clearance-chennai',
      areaServed: [
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'Country', name: 'India' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://kpsgroups.net/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Import Customs Clearance in Chennai',
          item: 'https://kpsgroups.net/import-customs-clearance-chennai',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What documents do I need to clear imports?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Usually the commercial invoice, packing list, bill of lading or air waybill and your IEC, plus any licence or certificate the product needs. We confirm the exact list once we know the cargo.',
          },
        },
        {
          '@type': 'Question',
          name: 'What duties apply to imports?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Basic customs duty, IGST and a social welfare surcharge usually apply, and some goods also attract anti-dumping or other duties. The exact amount depends on the classification, the value and the current notifications.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does import customs clearance in Chennai take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There is no fixed time. It depends on whether the Bill of Entry is cleared automatically or selected for examination, how complete the documents are and when duty is paid. We give you a likely timeline once we have your documents.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, origin and expected arrival date, and we will reply with a plan and a quote.',
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

const importSteps = [
  {
    step: 1,
    title: 'Importer Exporter Code (IEC)',
    text: 'Most commercial imports need a valid IEC before anything is filed.',
  },
  {
    step: 2,
    title: 'Documents gathered',
    text: 'Invoice, packing list, transport document and any required certificates.',
  },
  {
    step: 3,
    title: 'Classification and valuation',
    text: 'The goods are classified under an HS code and valued for duty.',
  },
  {
    step: 4,
    title: 'Bill of Entry filed on ICEGATE',
    text: 'The declaration is submitted electronically.',
  },
  {
    step: 5,
    title: 'Assessment and risk check',
    text: 'Customs reviews classification, valuation and duty. Some consignments are cleared without examination, while others are selected for document checks, scanning or physical examination.',
  },
  {
    step: 6,
    title: 'Duty payment',
    text: 'The assessed duty is paid.',
  },
  {
    step: 7,
    title: 'Out of Charge (OOC)',
    text: 'Customs grants final release, and the cargo can leave customs control.',
  },
  {
    step: 8,
    title: 'Delivery',
    text: 'The cargo moves from the port, airport or warehouse to your site.',
  },
];

const documentsList = [
  'Commercial invoice and packing list',
  'Bill of lading (sea) or air waybill (air)',
  'Importer Exporter Code (IEC)',
  'Purchase order or contract, if customs asks for it',
  'Licences, certificates or test reports for regulated products',
  'Certificate of origin, if claiming a preferential duty rate',
];

export default function ImportCustomsClearanceChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Import Customs Clearance in Chennai: Process, Documents and Duty" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Import Customs Clearance in Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                KPS Worldwide Logistics handles import customs clearance in Chennai for manufacturers, traders and project teams bringing goods into India by sea or air. We prepare your documents, file the Bill of Entry, advise on classification and duty, and coordinate with the terminal until the cargo is released, so your goods reach your factory or warehouse without avoidable delay.
              </p>
              <p className={pClass}>
                This page walks through the process, the duties, the documents and the common causes of delay. For the wider service, see our{' '}
                <Link href="/services/customs-brokerage" className={linkClass}>customs clearance services</Link>.
              </p>
            </div>

            {/* Section 2: How Import Customs Clearance in Chennai Works */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className={h2Class}>How Import Customs Clearance in Chennai Works</h2>
                <p className={pClass}>The steps are broadly the same for every import:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {importSteps.map((item) => (
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

              {/* Note after process */}
              <div className="rounded-2xl border border-brand-gray-muted bg-[#f2f8f4] p-5 sm:p-6 text-brand-gray-dark border-l-4 border-l-brand-green">
                <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed">
                  <span className="font-bold text-brand-green-dark">Important Note:</span> Keep the Out of Charge copy of the Bill of Entry, because your accountant will usually need it to claim GST input tax credit. Confirm the exact documentation requirements with your accountant.
                </p>
              </div>
            </section>

            {/* Section 3: Duties and Taxes on Imports */}
            <section className="space-y-4">
              <h2 className={h2Class}>Duties and Taxes on Imports</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-3.5">
                <p className={pClass}>
                  The duty on imported goods usually includes Basic Customs Duty, IGST and a social welfare surcharge, and some products also attract anti-dumping or other duties. The exact amount depends on the HS classification, the declared value and the notifications in force on the date of filing.
                </p>
                <p className={pClass}>
                  Customs duty is paid to the government and is separate from our service fee. We review your product details before the cargo lands and give you an estimate, so the cost of import customs clearance in Chennai is not a surprise at the last minute. Actual duty liability depends on final customs assessment, product classification, valuation and current statutory notifications at the time of clearance.
                </p>
              </div>
            </section>

            {/* Section 4: Documents Needed */}
            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className={h2Class}>Documents Needed</h2>
                <p className={pClass}>The documents for import customs clearance in Chennai normally include:</p>
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
                  Send us your cargo details and we will confirm the exact list for your product before the shipment arrives.
                </p>
              </div>
            </section>

            {/* Section 5: What Slows Imports Down */}
            <section className="space-y-4">
              <h2 className={h2Class}>What Slows Imports Down</h2>
              <div className="flex gap-4 rounded-2xl border border-brand-yellow/60 bg-[#fff8e1] p-5 sm:p-6 shadow-xs">
                <AlertTriangle className="w-6 h-6 text-brand-yellow-dark flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-2">
                  <p className="text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    Most delays in import customs clearance in Chennai come from a short list of problems: a wrong HS code, an invoice that does not match the packing list, a missing certificate, a valuation query, unpaid duty or a customs query that nobody answers quickly. Each day the cargo waits can add terminal storage, demurrage and detention charges. We check documents before arrival, answer customs queries promptly and keep you informed, so small issues do not become expensive ones.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: What We Handle for Import Customs Clearance in Chennai */}
            <section className="space-y-5">
              <h2 className={h2Class}>What We Handle for Import Customs Clearance in Chennai</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 space-y-3.5 shadow-xs">
                <ul className="space-y-3">
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span><strong className="font-bold text-brand-green-dark">Bill of Entry filing</strong> through ICEGATE</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span><strong className="font-bold text-brand-green-dark">Classification and valuation support</strong>, with guidance on duty</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span><strong className="font-bold text-brand-green-dark">Duty payment support</strong> and Out of Charge follow-up</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span><strong className="font-bold text-brand-green-dark">Coordination</strong> with the terminal, container freight station, shipping line or airline</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span><strong className="font-bold text-brand-green-dark">Examination support</strong> when customs selects the consignment</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span><strong className="font-bold text-brand-green-dark">Delivery</strong> to your factory or warehouse</span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>
                      <strong className="font-bold text-brand-green-dark">Heavy and project cargo:</strong> Clearance combined with{' '}
                      <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link> and{' '}
                      <Link href="/services/odc" className={linkClass}>over-dimensional cargo</Link> handling
                    </span>
                  </li>
                  <li className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                    <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                    <span>
                      <strong className="font-bold text-brand-green-dark">Freight together with clearance:</strong> Our{' '}
                      <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link> and{' '}
                      <Link href="/services/containerized-cargo" className={linkClass}>sea freight</Link> teams work alongside the customs desk
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7: Chennai’s Sea and Air Gateways */}
            <section className="space-y-5">
              <h2 className={h2Class}>Chennai’s Sea and Air Gateways</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 space-y-4 shadow-xs border-l-4 border-l-brand-green">
                <p className={pClass}>
                  For import customs clearance in Chennai, cargo arrives through the city’s seaports and airport cargo terminal: Chennai Port, Kamarajar Port (Ennore), Kattupalli Port, the Chennai Airport air cargo terminal, and relevant container freight stations (CFS) and inland container depots (ICD) KPS works with. Each gateway has its own procedures and timings, so documents need to be planned around the facility your cargo will use.
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-brand-gray-light p-4 border border-brand-gray-muted">
                  <Anchor className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm sm:text-[15px] text-brand-gray-dark leading-relaxed">
                    Our regional offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru cover other South Indian gateways, ensuring connected import management for consignments routed through regional maritime or dry port hubs.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8: Why Importers Choose KPS */}
            <section className="space-y-4">
              <h2 className={h2Class}>Why Importers Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-yellow shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-brand-green-dark">
                  <ShieldCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base">40+ Years of Trusted Customs Experience</span>
                </div>
                <p className={pClass}>
                  KPS brings 40+ years of experience in Indian trade, with customs, freight and transport coordinated by one team. We handle containerized and non-containerized cargo, including heavy machinery and project shipments, and you get a named contact and regular updates until your goods are released.
                </p>
              </div>
            </section>

            {/* Section 9: Frequently Asked Questions */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What documents do I need to clear imports?" defaultOpen>
                  Usually the commercial invoice, packing list, bill of lading or air waybill and your IEC, plus any licence or certificate the product needs. We confirm the exact list once we know the cargo.
                </FaqItem>
                <FaqItem question="What duties apply to imports?">
                  Basic customs duty, IGST and a social welfare surcharge usually apply, and some goods also attract anti-dumping or other duties. The exact amount depends on the classification, the value and the current notifications.
                </FaqItem>
                <FaqItem question="How long does import customs clearance in Chennai take?">
                  There is no fixed time. It depends on whether the Bill of Entry is cleared automatically or selected for examination, how complete the documents are and when duty is paid. We give you a likely timeline once we have your documents.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo details, origin and expected arrival date, and we will reply with a plan and a quote.
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
                Request a Quote for Import Customs Clearance in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are importing and when it arrives, and we will send a clear plan and quote.{' '}
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

