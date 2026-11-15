import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronRight, FileText, Home, MessageCircle, Phone, Box, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Container Shipping Services in Chennai | Types & Sizes | KPS',
  description: 'Container shipping services in Chennai: 20 ft, 40 ft, open top, flat rack and reefer containers with customs and port handling. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/container-shipping-chennai',
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
      name: 'Container Shipping Services in Chennai',
      serviceType: 'Container shipping',
      url: 'https://kpsgroups.net/container-shipping-chennai',
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
          name: 'Container Shipping Services in Chennai',
          item: 'https://kpsgroups.net/container-shipping-chennai',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What container sizes are available?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Standard 20 ft and 40 ft containers, plus 40 ft high cube, open top, flat rack and reefer options for cargo that needs them. We recommend the right one once we know the cargo.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between a standard and a high cube container?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A high cube container is taller than a standard one, giving more internal height for tall or bulky cargo.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which container should I book for container shipping services in Chennai?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "It depends on the cargo's size, weight and handling needs. Dense, heavy goods usually suit a 20 ft container, lighter bulky goods a 40 ft or high cube, tall or heavy pieces an open top or flat rack, and temperature-sensitive goods a reefer. Send us the details and we will recommend one.",
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, destination and target date, and we will reply with a plan and a quote.',
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

const containerTypes = [
  {
    type: '20 ft standard',
    bestFor: 'Heavy, dense cargo such as machinery parts, where weight limits matter more than volume',
  },
  {
    type: '40 ft standard',
    bestFor: 'Lighter, bulkier cargo that needs more floor space',
  },
  {
    type: '40 ft high cube',
    bestFor: 'Tall or bulky cargo that needs extra height',
  },
  {
    type: 'Open top',
    bestFor: 'Tall cargo loaded from above, such as machinery',
  },
  {
    type: 'Flat rack',
    bestFor: 'Heavy or oversized pieces that do not fit inside a closed container',
  },
  {
    type: 'Reefer',
    bestFor: 'Temperature-controlled goods',
  },
];

const checklistItems = [
  {
    title: 'Dimensions',
    desc: 'The length, width and height of the largest piece or pallet.',
  },
  {
    title: 'Weight',
    desc: 'The total cargo weight, and whether it is concentrated in a small area.',
  },
  {
    title: 'Fragility and value',
    desc: 'Fragile or high-value cargo may need extra packing or a dedicated container.',
  },
  {
    title: 'Temperature',
    desc: 'Perishable or sensitive goods need a reefer.',
  },
  {
    title: 'Loading method',
    desc: 'Cargo that must be loaded from above or the side may need an open top or flat rack.',
  },
  {
    title: 'Volume',
    desc: 'If the cargo does not fill a container, LCL shipping from Chennai may cost less than a full container.',
  },
];

const serviceIncludes = [
  'Container booking and release of the empty container',
  'Delivery to your premises or a container freight station for loading',
  'Loading and sealing coordination',
  'Documentation, including the bill of lading',
  'Customs clearance: export and import clearance handled together with the freight',
  'Port handling and vessel loading',
  'Inland transport between your plant, the port and the warehouse',
  'Tracking from booking to delivery',
];

const usualDocuments = [
  'Commercial invoice',
  'Packing list',
  'Importer Exporter Code (IEC), where applicable',
  'Bill of lading',
  'Customs filing',
  'Any certificate or permit required for the cargo',
];

export default function ContainerShippingChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Container Shipping Services in Chennai: Types, Sizes and How to Choose" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Container Shipping Services in Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                KPS Worldwide Logistics provides container shipping services in Chennai for exporters, importers and manufacturers who want cargo moved safely in the right container. Choosing the right container affects cost, safety and whether the cargo is accepted at the port, so we help you pick it before you book.
              </p>
              <p className={pClass}>
                Since 1985, we have arranged the container, the loading, the documents, customs clearance and the port handling, so one team looks after the move. For an overview of our ocean services, see our{' '}
                <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link>.
              </p>
            </div>

            {/* Section 2: Container Types Used in Container Shipping Services in Chennai */}
            <section className="space-y-6">
              <h2 className={h2Class}>Container Types Used in Container Shipping Services in Chennai</h2>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-brand-gray-muted shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-green-dark text-white text-sm">
                      <th className="py-3.5 px-5 font-bold w-1/3">Container</th>
                      <th className="py-3.5 px-5 font-bold w-2/3">Best for</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gray-muted bg-white text-[14.5px] sm:text-base">
                    {containerTypes.map((item, idx) => (
                      <tr key={item.type} className={idx % 2 === 0 ? 'bg-white' : 'bg-brand-gray-light/60'}>
                        <td className="py-3.5 px-5 font-bold text-brand-green-dark whitespace-nowrap">
                          {item.type}
                        </td>
                        <td className="py-3.5 px-5 text-brand-gray leading-relaxed">
                          {item.bestFor}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-3.5 md:hidden">
                {containerTypes.map((item) => (
                  <div key={item.type} className="rounded-xl border border-brand-gray-muted bg-white p-4 shadow-xs border-l-4 border-l-brand-green space-y-1">
                    <span className="font-extrabold text-brand-green-dark text-[15px] block">
                      {item.type}
                    </span>
                    <p className="text-sm text-brand-gray leading-relaxed">
                      {item.bestFor}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5 space-y-2">
                <p className={pClass}>
                  If the cargo does not fit any of these, our team can plan break bulk or RoRo shipping instead. See our{' '}
                  <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link> and{' '}
                  <Link href="/services/odc" className={linkClass}>over dimensional cargo services</Link>.
                </p>
              </div>
            </section>

            {/* Section 3: Container Sizes and Capacity */}
            <section className="space-y-4">
              <h2 className={h2Class}>Container Sizes and Capacity</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-3.5">
                <p className={pClass}>
                  Most container shipping services in Chennai use 20 ft and 40 ft containers. As a rough guide, a 20 ft container holds around 33 cubic metres and a 40 ft container around 67 cubic metres, and a 40 ft high cube adds extra height.
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-brand-gray-light p-4 border border-brand-gray-muted">
                  <Box className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm sm:text-[14.5px] text-brand-gray-dark leading-relaxed">
                    These capacity figures represent approximate internal volume rather than guaranteed usable cargo volume, as practical packing efficiency, pallet layouts and cargo shapes dictate actual loaded space.
                  </p>
                </div>
                <p className={pClass}>
                  Weight limits often matter as much as volume, especially for dense goods, which is why heavy cargo often goes in a 20 ft container even though it looks half empty. The usable weight depends on the container tare, carrier specifications and road highway axle restrictions, so we confirm it before booking.
                </p>
              </div>
            </section>

            {/* Section 4: How to Choose the Right Container */}
            <section className="space-y-5">
              <div className="space-y-2">
                <h2 className={h2Class}>How to Choose the Right Container</h2>
                <p className={pClass}>Before you book container shipping services in Chennai, check these points:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklistItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-green space-y-1.5">
                    <h3 className="font-bold text-brand-green-dark text-[15px] sm:text-base leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-[14.5px] text-brand-gray leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-brand-gray-muted bg-[#f2f8f4] p-4 sm:p-5 text-brand-gray-dark">
                <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed">
                  If you are not sure, send us the cargo details and our ocean logistics engineers will recommend the most cost-effective and secure container setup.
                </p>
              </div>
            </section>

            {/* Section 5: What Our Container Shipping Services in Chennai Include */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Our Container Shipping Services in Chennai Include</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-3.5">
                <ul className="space-y-3">
                  {serviceIncludes.map((service) => (
                    <li key={service} className="flex gap-3 text-[15px] sm:text-base text-brand-gray-dark leading-relaxed">
                      <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-brand-gray-muted/60">
                  <p className={pClass}>
                    For a dedicated full container, see{' '}
                    <Link href="/fcl-shipping-chennai" className={linkClass}>FCL shipping from Chennai</Link>.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Loading, Weight and Documents */}
            <section className="space-y-5">
              <h2 className={h2Class}>Loading, Weight and Documents</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <p className={pClass}>
                  For container shipping services in Chennai, the cargo must be packed, secured and weighed correctly. Poorly loaded cargo can shift in transit, and an inaccurate declared weight can cause delays at the port, so we advise on loading and bracing.
                </p>

                <div className="flex items-start gap-3 rounded-xl bg-[#fff8e1] p-4 border border-brand-yellow/60 text-brand-gray-dark">
                  <Scale className="w-5 h-5 text-brand-yellow-dark flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm sm:text-[14.5px] leading-relaxed">
                    Under International Maritime Organization (IMO) SOLAS regulations, export containers require a Verified Gross Mass (VGM) declaration prior to vessel stowage planning. We guide exporters in compliant weight recording and coordinate prompt electronic VGM submission with carriers and terminal gates.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className={h3Class}>The usual documents are:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {usualDocuments.map((doc) => (
                      <li key={doc} className="flex gap-2.5 text-sm sm:text-[15px] text-brand-gray leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-brand-green mt-2 flex-shrink-0" aria-hidden="true" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm sm:text-[14.5px] text-brand-gray pt-1">
                  We confirm the exact list before the cargo moves.
                </p>
              </div>
            </section>

            {/* Section 7: Why Businesses Choose KPS */}
            <section className="space-y-4">
              <h2 className={h2Class}>Why Businesses Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-yellow shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-brand-green-dark">
                  <ShieldCheck className="w-5 h-5 text-brand-green flex-shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base">Coordinated Ocean Freight, Customs & Transport</span>
                </div>
                <p className={pClass}>
                  Clients choose KPS for container shipping services in Chennai because the container, the customs work and the transport are coordinated by one team, with 40+ years of experience in Indian trade behind it. We handle standard containers, specialised equipment and project cargo, and you get a named contact and regular updates until delivery.
                </p>
                <p className={pClass}>
                  Our offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru help us route cargo through other South Indian ports when that suits your cargo better.
                </p>
              </div>
            </section>

            {/* Section 8: Frequently Asked Questions */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What container sizes are available?" defaultOpen>
                  Standard 20 ft and 40 ft containers, plus 40 ft high cube, open top, flat rack and reefer options for cargo that needs them. We recommend the right one once we know the cargo.
                </FaqItem>
                <FaqItem question="What is the difference between a standard and a high cube container?">
                  A high cube container is taller than a standard one, giving more internal height for tall or bulky cargo.
                </FaqItem>
                <FaqItem question="Which container should I book for container shipping services in Chennai?">
                  It depends on the cargo&apos;s size, weight and handling needs. Dense, heavy goods usually suit a 20 ft container, lighter bulky goods a 40 ft or high cube, tall or heavy pieces an open top or flat rack, and temperature-sensitive goods a reefer. Send us the details and we will recommend one.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo details, destination and target date, and we will reply with a plan and a quote.
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
                Request a Quote for Container Shipping Services in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are shipping, where it is going and when it must arrive, and we will recommend the container and build the plan.{' '}
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

