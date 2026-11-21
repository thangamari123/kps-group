import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Scale,
  FileCheck,
  Building2,
  Award,
  Clock,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar or footer.

export const metadata: Metadata = {
  title: 'Customs Brokerage in Chennai | Compliance & Clearance | KPS',
  description:
    'Customs brokerage in Chennai covering classification, compliance advice, ICEGATE filing and clearance for regular and project cargo. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/customs-brokerage-chennai',
  },
};

// `provider: { '@id': 'https://kpsgroups.net/#org' }` intentionally omitted: no Organization entity
// with that @id is defined on the site.
// The FAQ text in schema matches the visible answers below verbatim.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Customs Brokerage in Chennai',
      serviceType: 'Customs brokerage',
      url: 'https://kpsgroups.net/customs-brokerage-chennai',
      areaServed: [
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'Country', name: 'India' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Customs Brokerage in Chennai',
          item: 'https://kpsgroups.net/customs-brokerage-chennai',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is customs brokerage?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Customs brokerage is the service of preparing and filing customs declarations and handling clearance formalities on behalf of importers and exporters.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between customs brokerage and freight forwarding?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Customs brokerage deals with customs filings, duty and clearance. Freight forwarding arranges the transport. KPS offers both, so they can be coordinated.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use customs brokerage in Chennai for just one shipment?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can appoint us for a single shipment or for regular consignments, and we will quote accordingly.',
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

const linkClass =
  'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-lg font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs border-t-4 border-t-brand-yellow space-y-2.5';

const brokerageScope = [
  {
    title: 'Pre-Filing Document Review',
    desc: 'Review of your documents before filing, so gaps or discrepancies are caught and corrected early.',
  },
  {
    title: 'HS Classification & Valuation Support',
    desc: 'HS code classification guidance and valuation assessment aligned with Indian customs regulations.',
  },
  {
    title: 'Licence & Regulatory Checks',
    desc: 'Checks for mandatory partner government agency (PGA) licences, certificates, BIS standards, or test reports.',
  },
  {
    title: 'ICEGATE Declaration Filing',
    desc: 'Electronic filing of the Bill of Entry for imports or Shipping Bill for exports through the ICEGATE portal.',
  },
  {
    title: 'Duty Calculation & Payment Support',
    desc: 'Assessment of basic customs duty, IGST, cess, and guidance on transparent electronic duty payments via ICEGATE.',
  },
  {
    title: 'Customs Queries & Examination',
    desc: 'Handling of customs clarifications, open queries, document submissions, and physical dock or CFS examinations.',
  },
  {
    title: 'Terminal & Line Coordination',
    desc: 'Active coordination with port terminals, Container Freight Stations (CFS), Inland Container Depots (ICD), and carriers.',
  },
  {
    title: 'Release & Delivery / Loading',
    desc: 'Securing Out of Charge (OOC) or Let Export Order (LEO), followed by seamless port dispatch, loading, or delivery.',
  },
  {
    title: 'Records & Audit Trail',
    desc: 'Orderly retention of clearance documents, signed assessments, and gate passes for your commercial accounts and future audits.',
  },
];

const compliancePillars = [
  {
    title: 'Classification',
    detail: 'The HS code, which decides the duty rate and the relevant statutory rules and restrictions that apply to the product.',
  },
  {
    title: 'Valuation',
    detail: 'Whether the declared transaction value agrees with the commercial invoice, payment terms, freight charges, and applicable customs valuation rules.',
  },
  {
    title: 'Product Rules',
    detail: 'Whether the product requires a licence, BIS certificate, EPR approval, phytosanitary clearance, or laboratory test report.',
  },
  {
    title: 'Origin and Duty Benefits',
    detail: 'Whether a valid Certificate of Origin supports a preferential duty claim under bilateral or regional trade agreements and origin rules.',
  },
  {
    title: 'Document Consistency',
    detail: 'Ensuring the commercial invoice, packing list, transport document (BL/AWB), and declaration agree seamlessly with each other.',
  },
];

const userGroups = [
  {
    title: 'First-Time Importers',
    desc: 'Businesses new to cross-border trade who need end-to-end guidance through customs documentation and clearance protocols.',
  },
  {
    title: 'Regular Importers',
    desc: 'Established trading and manufacturing companies wanting one dedicated team that thoroughly understands their product lines and recurring paperwork.',
  },
  {
    title: 'Exporters on Tight Timelines',
    desc: 'Manufacturers and traders working against strict shipping line vessel cut-offs, flight connections, and port gate-in deadlines.',
  },
  {
    title: 'Regulated Cargo Consignees',
    desc: 'Importers of chemicals, machinery, electronics, and food products requiring partner agency approvals, certificates, or testing.',
  },
  {
    title: 'Project Cargo Shippers',
    desc: 'Capital equipment, engineering, and infrastructure teams managing complex consignments with extensive project paperwork and multi-axle trailers.',
  },
];

const workflowSteps = [
  {
    step: '1',
    title: 'Briefing',
    desc: 'You tell us about your product, origin or destination, expected delivery timeline, and trade terms.',
  },
  {
    step: '2',
    title: 'Document and Compliance Check',
    desc: 'We review your commercial invoice, packing list, and transport documents to identify and resolve paperwork gaps before declaration.',
  },
  {
    step: '3',
    title: 'Classification and Duty Estimate',
    desc: 'We review the proposed HS classification and estimate applicable duties and taxes based on verified trade rules before cargo lands.',
  },
  {
    step: '4',
    title: 'Filing',
    desc: 'The official customs declaration (Bill of Entry or Shipping Bill) is prepared and submitted through the ICEGATE portal.',
  },
  {
    step: '5',
    title: 'Assessment, Examination and Release',
    desc: 'We manage customs officer queries, arrange physical examination where ordered, and coordinate with terminal staff until formal release is granted.',
  },
  {
    step: '6',
    title: 'Delivery or Loading',
    desc: 'Released cargo is loaded for export or dispatched to your facility by road, and your clearance file is closed with full electronic records.',
  },
];

export default function CustomsBrokerageChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero
        title="Customs Brokerage in Chennai: Compliance, Classification and Clearance"
        bgImage={bgImage}
      />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">
              Customs Brokerage in Chennai
            </span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction Lead */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                KPS Worldwide Logistics provides customs brokerage in Chennai for importers and exporters who want their cargo cleared correctly the first time and their paperwork kept in order over the long run. Our customs team checks documents before filing, advises on classification and valuation, files through ICEGATE and follows each consignment to release, while our freight and transport teams move the cargo. Since 1985, we have handled cargo for Indian trade, and that experience goes into every file. For the full service overview, see our{' '}
                <Link href="/services/customs-brokerage" className={linkClass}>
                  customs clearance services
                </Link>.
              </p>

              {/* Quick Action Bar */}
              <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-brand-green-dark">Need Customs Clearance or HS Code Guidance?</h3>
                    <p className="text-xs sm:text-sm text-brand-gray">Consult with our customs desk before your consignment arrives.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    href="/quote"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-brand-green hover:bg-brand-green-light text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
                  >
                    <span>Get a Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center justify-center gap-1.5 border border-brand-green/30 text-brand-green-dark hover:bg-white text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-green" />
                    <span>044 4508 8099</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Section 1: What Customs Brokerage in Chennai Covers */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Customs Brokerage in Chennai Covers</h2>
              <p className={pClass}>
                A customs broker acts for you in your dealings with customs, from the first document check to final release. With KPS, that includes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brokerageScope.map((item, idx) => (
                  <div key={idx} className={cardClass}>
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                      <h3 className="text-sm sm:text-[15px] font-bold text-brand-green-dark leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Compliance and Advisory */}
            <section className="space-y-5">
              <h2 className={h2Class}>Compliance and Advisory</h2>
              <p className={pClass}>
                Good customs brokerage in Chennai is as much about getting the facts right before filing as about filing itself. Before a consignment is declared, our team looks at:
              </p>
              <div className="space-y-3.5">
                {compliancePillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-brand-gray-muted bg-white p-4 sm:p-5 flex items-start gap-3.5 shadow-xs"
                  >
                    <span className="w-8 h-8 rounded-xl bg-brand-green text-brand-yellow flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark">
                        {pillar.title}
                      </h3>
                      <p className={pClass}>{pillar.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-4 sm:p-5 border-l-4 border-l-brand-green space-y-2">
                <div className="flex items-center gap-2 text-brand-green-dark font-bold text-sm sm:text-base">
                  <Scale className="w-4 h-4 text-brand-green" />
                  <span>Transparent Fee & Statutory Separation</span>
                </div>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                  Customs duty is paid directly to the government via ICEGATE and is separate from our customs brokerage service fee, so every quote clearly itemises statutory duties and professional handling costs separately. Official assessment and examination decisions remain subject to customs authorities.
                </p>
              </div>
            </section>

            {/* Section 3: Who Uses Customs Brokerage in Chennai? */}
            <section className="space-y-5">
              <h2 className={h2Class}>Who Uses Customs Brokerage in Chennai?</h2>
              <p className={pClass}>
                Businesses turn to customs brokerage in Chennai for different reasons:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userGroups.map((group, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs space-y-2 ${
                      idx === userGroups.length - 1 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 text-brand-green-dark">
                      <Building2 className="w-4 h-4 text-brand-green shrink-0" />
                      <h3 className="font-bold text-sm sm:text-base">{group.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">{group.desc}</p>
                  </div>
                ))}
              </div>
              <p className={pClass}>
                If you are not sure which group you are in, send us a typical shipment and we will tell you what to expect.
              </p>
            </section>

            {/* Section 4: How Our Customs Brokerage in Chennai Works */}
            <section className="space-y-5">
              <h2 className={h2Class}>How Our Customs Brokerage in Chennai Works</h2>
              <p className={pClass}>
                We follow a structured six-step workflow to ensure predictable, compliant customs clearance through Chennai ports, airports, and CFS terminals:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflowSteps.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs relative overflow-hidden space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-lg bg-brand-green text-brand-yellow font-black text-xs flex items-center justify-center">
                        {item.step}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gray-muted">
                        Phase {item.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-brand-green-dark">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-brand-gray italic border-l-2 border-brand-gray-muted pl-3">
                Note: While our team proactively manages filing and document resolution, statutory assessment, physical cargo examination, and clearance release remain subject to the jurisdiction of Indian Customs authorities.
              </p>
            </section>

            {/* Section 5: Engagement Options */}
            <section className="space-y-5">
              <h2 className={h2Class}>Engagement Options</h2>
              <p className={pClass}>
                Customs brokerage in Chennai can be arranged shipment by shipment or on an ongoing basis for regular importers and exporters:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs border-t-4 border-t-brand-green space-y-3">
                  <div className="flex items-center gap-2 text-brand-green-dark">
                    <Clock className="w-5 h-5 text-brand-green shrink-0" />
                    <h3 className="text-base font-bold">Single-Shipment Clearance</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                    Designed for one-off consignments, seasonal orders, or trial imports. We review the specific commercial invoice and shipping documents, provide an upfront duty estimate and quote, and clear the consignment cleanly through customs.
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs border-t-4 border-t-brand-yellow space-y-3">
                  <div className="flex items-center gap-2 text-brand-green-dark">
                    <Layers className="w-5 h-5 text-brand-yellow-dark shrink-0" />
                    <h3 className="text-base font-bold">Ongoing Account Arrangement</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                    An ongoing arrangement gives you a dedicated team that already knows your products, your documents and your preferences, so each new consignment starts faster and fewer questions come up at filing.
                  </p>
                </div>
              </div>
              <p className={pClass}>
                Tell us your usual volume and we will suggest the right set-up for your operational schedule.
              </p>
            </section>

            {/* Section 6: Brokerage and Freight Together */}
            <section className="space-y-5">
              <h2 className={h2Class}>Brokerage and Freight Together</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] p-5 sm:p-6 space-y-4">
                <p className={pClass}>
                  When customs and freight sit with different vendors, delays tend to happen at the handover. We handle both under one team, so documents, cargo and deadlines stay aligned.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/services/freight-forwarding"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Freight Forwarding
                      </h3>
                      <p className="text-xs text-brand-gray">Air & ocean multimodal transport coordination</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>

                  <Link
                    href="/services/containerized-cargo"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Sea Freight Services
                      </h3>
                      <p className="text-xs text-brand-gray">FCL, LCL, and container liner bookings</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>

                  <Link
                    href="/services/project-logistics"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Project Cargo Logistics
                      </h3>
                      <p className="text-xs text-brand-gray">Break bulk, heavy lift, and industrial plants</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>

                  <Link
                    href="/services/ftwz"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        FTWZ Warehousing
                      </h3>
                      <p className="text-xs text-brand-gray">Duty deferment and free trade warehousing</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-brand-gray-dark pt-1">
                  For step-by-step processes in each trade direction, explore our dedicated guides for{' '}
                  <Link href="/import-customs-clearance-chennai" className={linkClass}>
                    import customs clearance
                  </Link>{' '}
                  and{' '}
                  <Link href="/export-customs-clearance-chennai" className={linkClass}>
                    export customs clearance
                  </Link>.
                </p>
              </div>
            </section>

            {/* Section 7: Information We Need to Start */}
            <section className="space-y-5">
              <h2 className={h2Class}>Information We Need to Start</h2>
              <p className={pClass}>
                To quote and plan customs brokerage in Chennai, we usually ask for:
              </p>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <ul className="space-y-2.5">
                  {[
                    'Product description and HS code (if known)',
                    'Commercial invoice value and trade currency',
                    'Country of origin and final destination',
                    'Importer Exporter Code (IEC) of the shipper/consignee',
                    'Specific licences, certificates, or standards already held',
                    'Target shipment dispatch or port arrival date',
                    'Cargo weight, volume (CBM), and packaging type (pallets, crates, containers)',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-gray-dark">
                      <span className="w-5 h-5 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs sm:text-sm text-brand-gray pt-2 border-t border-brand-gray-muted">
                  We confirm anything else once we see the cargo details. We do not ask for confidential credentials or unnecessary proprietary records.
                </p>
              </div>
            </section>

            {/* Section 8: Why Choose KPS */}
            <section className="space-y-4">
              <h2 className={h2Class}>Why Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-yellow shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-brand-green-dark">
                  <ShieldCheck className="w-5 h-5 text-brand-green shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Coordinated Customs, Freight & Inland Transport
                  </span>
                </div>
                <p className={pClass}>
                  Clients choose KPS for customs brokerage in Chennai because compliance, filing, freight and transport are coordinated by one team, with 40+ years of experience in Indian trade behind it. You get a named contact, early warnings about problems and regular updates until the cargo is released.
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-brand-gray-light p-4 border border-brand-gray-muted">
                  <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-brand-gray-dark leading-relaxed">
                    Recognised with the <strong>“Best Performer – CHA” Award</strong> by Chennai Port Authority at the 145th Port Day celebration for consistent operational excellence and trade partnership.
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                  Our regional offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru support cargo moving through other South Indian gateways, ensuring connected coverage across sea, air, and dry ports.
                </p>
              </div>
            </section>

            {/* Section 9: Frequently Asked Questions */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What is customs brokerage?" defaultOpen>
                  Customs brokerage is the service of preparing and filing customs declarations and handling clearance formalities on behalf of importers and exporters.
                </FaqItem>
                <FaqItem question="What is the difference between customs brokerage and freight forwarding?">
                  Customs brokerage deals with customs filings, duty and clearance. Freight forwarding arranges the transport. KPS offers both, so they can be coordinated.
                </FaqItem>
                <FaqItem question="Can I use customs brokerage in Chennai for just one shipment?">
                  Yes. You can appoint us for a single shipment or for regular consignments, and we will quote accordingly.
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
                Request a Quote for Customs Brokerage in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you import or export and how often, and we will recommend the right set-up.{' '}
                <Link href="/quote" className={ctaLinkClass}>
                  Request a quote
                </Link>{' '}
                or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>
                  044 4508 8099
                </a>.{' '}
                <Link href="/about-us" className={ctaLinkClass}>
                  Learn more about KPS
                </Link>
                , explore our{' '}
                <Link href="/services" className={ctaLinkClass}>
                  full range of services
                </Link>{' '}
                or read about us as a{' '}
                <Link href="/logistics-company-chennai" className={ctaLinkClass}>
                  logistics company in Chennai
                </Link>.
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
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-gray-light text-brand-gray group-open:bg-brand-green group-open:text-brand-yellow group-open:rotate-180 transition-transform"
          aria-hidden="true"
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </summary>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="text-[13.5px] sm:text-[15px] text-brand-gray-dark leading-relaxed">{children}</p>
      </div>
    </details>
  );
}
