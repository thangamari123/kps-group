import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, ChevronRight, FileText, Home, MessageCircle, Phone, Package, ShieldCheck, Scale, Truck, Anchor, Warehouse, ArrowDown } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'LCL Shipping from Chennai | Less Than Container Load | KPS',
  description: 'LCL shipping from Chennai for smaller consignments: shared container space, CFS handling, customs clearance and tracking. Get a quote from KPS.',
  alternates: {
    canonical: 'https://kpsgroups.net/lcl-shipping-chennai',
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
      name: 'LCL Shipping from Chennai',
      serviceType: 'Less than container load (LCL) shipping',
      url: 'https://kpsgroups.net/lcl-shipping-chennai',
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
          name: 'LCL Shipping from Chennai',
          item: 'https://kpsgroups.net/lcl-shipping-chennai',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does LCL mean?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "LCL means less than container load. Your cargo shares a container with other shippers' goods, and you pay for the space you use instead of a full container.",
          },
        },
        {
          '@type': 'Question',
          name: 'How long does LCL shipping from Chennai take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Transit depends on the destination, the route and the consolidation schedule. LCL often takes longer than FCL because cargo is consolidated before sailing and separated after arrival. We give you a likely timeline with the quote.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I ship fragile or high-value cargo as LCL?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, but pack it carefully because it is handled more than in FCL. For very fragile or high-value consignments, we can also quote FCL.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, dimensions, weight, destination and ready date, and we will reply with a plan and a quote.',
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

const visualFlowSteps = [
  { step: '1', title: 'Cargo Pickup', desc: 'Collected from your facility or received at gateway', icon: Truck },
  { step: '2', title: 'Origin CFS', desc: 'Received, weighed and staged at container freight station', icon: Warehouse },
  { step: '3', title: 'Consolidation', desc: 'Combined securely with consignments to same port', icon: Package },
  { step: '4', title: 'Ocean Transit', desc: 'Vessel voyage with active milestone tracking', icon: Anchor },
  { step: '5', title: 'Destination CFS', desc: 'Container destuffed and items sorted for release', icon: Warehouse },
  { step: '6', title: 'Cargo Delivery', desc: 'Delivered to consignee or cleared for pickup', icon: Check },
];

const rightChoiceItems = [
  'Smaller consignments that do not fill a 20 ft or 40 ft container',
  'Sample, trial and prototype shipments before full production runs',
  'Regular small orders where inventory turns matter more than bulk volume',
  'Buyers who order in smaller lots to manage cash flow and warehouse space',
  'Shipments where waiting to fill a whole container would cause commercial delays or miss contract deadlines',
];

const processSteps = [
  {
    num: '1',
    title: 'Enquiry',
    text: 'Share the cargo type, dimensions, weight, number of packages, destination and ready date.',
  },
  {
    num: '2',
    title: 'Quote and booking',
    text: 'We confirm the route and the consolidation schedule, and book your space.',
  },
  {
    num: '3',
    title: 'Pickup and gate-in',
    text: 'We collect the cargo from your premises and deliver it to the CFS before the cut-off.',
  },
  {
    num: '4',
    title: 'Documentation and customs',
    text: 'We prepare the paperwork, file the Shipping Bill and handle export customs clearance.',
  },
  {
    num: '5',
    title: 'Consolidation and loading',
    text: 'Your cargo is consolidated into a container and loaded onto the vessel.',
  },
  {
    num: '6',
    title: 'Transit and tracking',
    text: 'You receive updates while the cargo is at sea.',
  },
  {
    num: '7',
    title: 'Destination handover',
    text: 'The container is opened at the destination CFS, and the cargo is released to your consignee or agent.',
  },
];

const packingRules = [
  'Use sturdy, export-worthy outer packaging (double-wall cartons, wooden crates or reinforced drums).',
  'Palletise and shrink-wrap cargo where possible to ensure safe forklift handling during consolidation.',
  'Label every package clearly with consignee details, destination port, package number and handling marks.',
  'Record dimensions (length × width × height) and gross weight accurately, as they determine the chargeable volume.',
];

const usualDocuments = [
  'Commercial invoice',
  'Packing list with itemized package dimensions and weights',
  'Importer Exporter Code (IEC), where applicable',
  'Bill of lading (or house bill of lading)',
  'Customs filing (Shipping Bill for exports / Bill of Entry for imports)',
];

const comparisonData = [
  {
    factor: 'Container space',
    lcl: 'Shared with other shippers',
    fcl: 'Dedicated container',
  },
  {
    factor: 'Best suited for',
    lcl: 'Smaller consignments',
    fcl: 'Larger consignments',
  },
  {
    factor: 'Cost structure',
    lcl: 'Pay for chargeable cargo space, subject to minimum charges',
    fcl: 'Pay for the container',
  },
  {
    factor: 'Cargo handling',
    lcl: 'More handling during consolidation and deconsolidation',
    fcl: 'Generally fewer cargo-handling stages',
  },
  {
    factor: 'Scheduling',
    lcl: 'Depends on consolidation schedule',
    fcl: 'Depends on container booking and vessel schedule',
  },
  {
    factor: 'Cargo suitability',
    lcl: 'Suitable for many smaller general cargo shipments',
    fcl: 'Suitable for larger shipments and cargo needing dedicated space',
  },
];

const whyChooseKps = [
  {
    title: '40+ Years of Experience',
    desc: 'Moving cargo through Indian ports since 1985, navigating carrier tariffs, port customs and consolidation schedules.',
  },
  {
    title: 'Integrated Single-Team Coordination',
    desc: 'Booking, origin carting, customs brokerage, documentation and port handling are managed together by one accountable team.',
  },
  {
    title: 'South India Branch Presence',
    desc: 'Operational offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru back our Chennai headquarters to move cargo seamlessly across the region.',
  },
  {
    title: 'Beyond Standard Containers',
    desc: 'When cargo outgrows standard containers, our project cargo and ODC teams arrange break bulk, open top, flat rack and oversized transport.',
  },
  {
    title: 'Dedicated Contact & Status Updates',
    desc: 'You receive a named specialist and milestone updates from CFS gate-in through consolidation, ocean sailing and destination handover.',
  },
];

export default function LclShippingChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="LCL Shipping from Chennai: Ship Smaller Loads Without Paying for a Full Container" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">LCL Shipping from Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                KPS Worldwide Logistics arranges LCL shipping from Chennai for exporters and importers whose cargo does not fill a container. Your goods share a container with other shippers’ cargo, so you pay for the space you use instead of a whole 20 ft or 40 ft box.
              </p>
              <p className={pClass}>
                We have been moving cargo since 1985, and our team handles the booking, documentation, customs clearance and port formalities, so one team looks after the consignment from pickup to the destination port.
              </p>
              <p className={pClass}>
                If your cargo is larger, see our{' '}
                <Link href="/fcl-shipping-chennai" className={linkClass}>FCL shipping from Chennai</Link>{' '}
                option.
              </p>
            </div>

            {/* Section 1: What Is LCL Shipping from Chennai? */}
            <section className="space-y-6">
              <h2 className={h2Class}>What Is LCL Shipping from Chennai?</h2>
              <div className="space-y-4">
                <p className={pClass}>
                  LCL stands for less than container load.
                </p>
                <p className={pClass}>
                  Your cargo is delivered to a container freight station (CFS), where it is consolidated with other shippers’ consignments into one container bound for the same destination.
                </p>
                <p className={pClass}>
                  At the destination, the container is opened at a CFS, the cargo is separated, and each consignee collects or receives their own.
                </p>
                <p className={pClass}>
                  You share the container and the freight cost, but your cargo is handled more times than in FCL.
                </p>
              </div>

              {/* Visual Flow */}
              <div className="mt-8 rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] p-5 sm:p-6 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-green-dark mb-4">
                  LCL Cargo Movement Cycle
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {visualFlowSteps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.step} className="relative flex flex-col items-center text-center p-3 rounded-xl bg-white border border-brand-gray-muted/80 shadow-xs space-y-2">
                        <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold text-sm">
                          <Icon className="w-5 h-5 text-brand-green" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider">Step {step.step}</span>
                          <h4 className="text-xs sm:text-sm font-bold text-brand-green-dark leading-tight">{step.title}</h4>
                        </div>
                        <p className="text-[11px] text-brand-gray leading-tight">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Section 2: When LCL Is the Right Choice */}
            <section className="space-y-5">
              <h2 className={h2Class}>When LCL Is the Right Choice</h2>
              <p className={pClass}>
                LCL shipping from Chennai is usually the better fit for:
              </p>
              <ul className="space-y-2.5 pl-2 sm:pl-4">
                {rightChoiceItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center" aria-hidden="true">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-[14.5px] sm:text-base text-brand-gray-dark leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border-l-4 border-brand-green bg-brand-gray-light/60 p-4 sm:p-5 text-[14.5px] sm:text-base text-brand-gray-dark leading-relaxed space-y-2">
                <p>
                  Depending on current rates, cargo volume and destination, FCL may become more economical as shipment volume increases. Ask us to quote both options and compare.
                </p>
                <p className="font-semibold text-brand-green-dark">
                  Ask us to quote both and compare.
                </p>
              </div>
            </section>

            {/* Section 3: How LCL Shipping from Chennai Works */}
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className={h2Class}>How LCL Shipping from Chennai Works</h2>
                <p className={pClass}>
                  We guide each shipment through a systematic sequence to ensure accurate consolidation and on-time sailing:
                </p>
              </div>

              <div className="space-y-3.5">
                {processSteps.map((step) => (
                  <div
                    key={step.num}
                    className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] hover:bg-white hover:border-brand-green/40 hover:shadow-xs transition-all"
                  >
                    <span className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-green text-brand-yellow font-extrabold text-sm sm:text-base flex items-center justify-center shadow-xs">
                      {step.num}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-bold text-brand-green-dark">
                        {step.title}
                      </h3>
                      <p className="text-[14.5px] sm:text-base text-brand-gray leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-brand-gray italic border-l-2 border-brand-gray-muted pl-3">
                Note: Consolidation frequency, cutoff days and transit duration vary depending on the destination port, carrier sailing schedule and local container freight station operations.
              </p>
            </section>

            {/* Section 4: Packing, Marking and Documents */}
            <section className="space-y-6">
              <h2 className={h2Class}>Packing, Marking and Documents</h2>
              <div className="space-y-4">
                <p className={pClass}>
                  Because the container is shared and the cargo is handled more than once, LCL shipping from Chennai needs careful packing.
                </p>
                <p className={pClass}>
                  Use sturdy, export-worthy packaging, palletise where possible, and label each package with the consignee, destination and package number.
                </p>
                <p className={pClass}>
                  Record the dimensions and weight accurately, since they decide your charge.
                </p>
              </div>

              {/* Packing Guidelines Card */}
              <div className="rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] p-5 sm:p-6 space-y-4">
                <h3 className={h3Class}>Best Practices for LCL Packaging</h3>
                <ul className="space-y-2.5">
                  {packingRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-yellow/20 text-brand-green-dark flex items-center justify-center" aria-hidden="true">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                      <span className="text-[14.5px] sm:text-base text-brand-gray-dark leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documentation List */}
              <div className="space-y-3">
                <h3 className={h3Class}>Required Shipping Documents</h3>
                <p className={pClass}>
                  The usual documents are:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {usualDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] sm:text-base text-brand-gray-dark">
                      <FileText className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
                <p className={pClass}>
                  Some cargo also needs a certificate of origin, a quality certificate or a permit.
                </p>
                <p className={pClass}>
                  For imports, we prepare the Bill of Entry and handle{' '}
                  <Link href="/import-customs-clearance-chennai" className={linkClass}>import customs clearance</Link>. For exports, we prepare the Shipping Bill and coordinate{' '}
                  <Link href="/export-customs-clearance-chennai" className={linkClass}>export customs clearance</Link>. We confirm the exact list before the cargo moves.
                </p>
              </div>
            </section>

            {/* Section 5: What Affects LCL Costs */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Affects LCL Costs</h2>
              <p className={pClass}>
                The cost of LCL shipping from Chennai is usually worked out on the cargo’s volume or weight, whichever gives the higher chargeable figure, plus:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 sm:pl-4">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-gray-muted bg-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-brand-gray-dark">CFS charges at origin and destination</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-gray-muted bg-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-brand-gray-dark">Documentation &amp; customs processing</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-gray-muted bg-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-brand-gray-dark">Customs duties &amp; port examination</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-gray-muted bg-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow flex-shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-brand-gray-dark">Inland transport &amp; applicable surcharges</span>
                </div>
              </div>
              <p className={pClass}>
                LCL often carries a minimum charge, so very small shipments can cost more per cubic metre.
              </p>
              <div className="rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] p-4 sm:p-5 text-[14.5px] sm:text-base text-brand-gray-dark space-y-2">
                <p>
                  The chargeable basis depends on the carrier, route and applicable tariff. We confirm the calculation in your quotation.
                </p>
                <p className="font-semibold text-brand-green-dark">
                  We give a written quote that shows what is included.
                </p>
              </div>
            </section>

            {/* Section 6: LCL or FCL? */}
            <section className="space-y-6">
              <h2 className={h2Class}>LCL or FCL?</h2>

              {/* Desktop Comparison Table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-brand-gray-muted shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-green-dark text-white text-sm">
                      <th className="py-3.5 px-5 font-bold w-1/4">Factor</th>
                      <th className="py-3.5 px-5 font-bold w-3/8 text-brand-yellow">LCL (Less than Container Load)</th>
                      <th className="py-3.5 px-5 font-bold w-3/8">FCL (Full Container Load)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gray-muted bg-white text-[14.5px] sm:text-base">
                    {comparisonData.map((item, idx) => (
                      <tr key={item.factor} className={idx % 2 === 0 ? 'bg-white' : 'bg-brand-gray-light/60'}>
                        <td className="py-3.5 px-5 font-bold text-brand-green-dark">
                          {item.factor}
                        </td>
                        <td className="py-3.5 px-5 text-brand-gray leading-relaxed font-medium">
                          {item.lcl}
                        </td>
                        <td className="py-3.5 px-5 text-brand-gray leading-relaxed">
                          {item.fcl}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Comparison Cards */}
              <div className="grid grid-cols-1 gap-3.5 md:hidden">
                {comparisonData.map((item) => (
                  <div key={item.factor} className="rounded-xl border border-brand-gray-muted bg-white p-4 shadow-xs space-y-2.5">
                    <span className="font-extrabold text-brand-green-dark text-[15px] block border-b border-brand-gray-muted/60 pb-1.5">
                      {item.factor}
                    </span>
                    <div className="space-y-1 text-sm">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider">LCL</span>
                        <p className="text-brand-gray-dark font-medium">{item.lcl}</p>
                      </div>
                      <div className="flex flex-col pt-1">
                        <span className="text-[11px] font-bold text-brand-gray uppercase tracking-wider">FCL</span>
                        <p className="text-brand-gray">{item.fcl}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <p className={pClass}>
                  LCL lets you ship a smaller load and pay for the space you use.
                </p>
                <p className={pClass}>
                  The trade-offs are more handling, a consolidation schedule that depends on other shippers’ cargo, and transit that is often longer.
                </p>
                <p className={pClass}>
                  FCL gives you a container to yourself, simpler handling and a lower risk of damage, but costs more in total.
                </p>
                <p className={pClass}>
                  Not sure which suits you? Send us your cargo details and we will compare both. See our{' '}
                  <Link href="/fcl-shipping-chennai" className={linkClass}>FCL shipping from Chennai</Link>,{' '}
                  <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link> and{' '}
                  <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link> for the wider picture.
                </p>
              </div>
            </section>

            {/* Section 7: Why Choose KPS */}
            <section className="space-y-6">
              <h2 className={h2Class}>Why Choose KPS</h2>
              <p className={pClass}>
                Clients choose KPS for LCL shipping from Chennai because booking, customs, transport and documentation are coordinated by one team, backed by 40+ years of experience in Indian trade.
              </p>
              <p className={pClass}>
                We also handle{' '}
                <Link href="/services/project-logistics" className={linkClass}>project cargo</Link>, break bulk and{' '}
                <Link href="/services/odc" className={linkClass}>oversized shipments (ODC)</Link> when cargo outgrows a container.
              </p>
              <p className={pClass}>
                Our offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru help us move cargo from across South India, and you get a named contact and regular updates until delivery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {whyChooseKps.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] space-y-2">
                    <h3 className="text-base font-bold text-brand-green-dark">{item.title}</h3>
                    <p className="text-sm text-brand-gray leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Frequently Asked Questions */}
            <section className="space-y-6">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What does LCL mean?" defaultOpen>
                  LCL means less than container load. Your cargo shares a container with other shippers&apos; goods, and you pay for the space you use instead of a full container.
                </FaqItem>
                <FaqItem question="How long does LCL shipping from Chennai take?">
                  Transit depends on the destination, the route and the consolidation schedule. LCL often takes longer than FCL because cargo is consolidated before sailing and separated after arrival. We give you a likely timeline with the quote.
                </FaqItem>
                <FaqItem question="Can I ship fragile or high-value cargo as LCL?">
                  Yes, but pack it carefully because it is handled more than in FCL. For very fragile or high-value consignments, we can also quote FCL.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo details, dimensions, weight, destination and ready date, and we will reply with a plan and a quote.
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
                Request a Quote for LCL Shipping from Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are shipping, where it is going and when it must be ready, and we will build the plan.{' '}
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

