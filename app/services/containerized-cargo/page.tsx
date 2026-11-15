import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, FileText, Home, MessageCircle, Phone, Package, ShieldCheck, Scale, Truck, Anchor, Ship, Box, Layers, Thermometer, MapPin } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import ServiceSidebar from '@/components/services/ServiceSidebar';

export const metadata: Metadata = {
  title: 'Sea Freight Services in Chennai | FCL & LCL | KPS Logistics',
  description: 'Sea freight services in Chennai: FCL and LCL shipping, open top, flat rack and reefer containers, customs and port handling. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/services/containerized-cargo',
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
      name: 'Sea Freight Services in Chennai (FCL & LCL)',
      serviceType: 'Sea freight and container shipping',
      url: 'https://kpsgroups.net/services/containerized-cargo',
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
          name: 'Services',
          item: 'https://kpsgroups.net/services',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Sea Freight',
          item: 'https://kpsgroups.net/services/containerized-cargo',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How long do sea freight services in Chennai take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Transit time depends on the destination, the route and the vessel schedule, so there is no single answer. Tell us where the cargo is going and when it needs to arrive, and we will give you a likely timeline with the quote.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you handle both FCL and LCL?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We arrange full container and less than container load shipments, and we can compare the two for your cargo.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you ship cargo that does not fit in a container?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We arrange open top and flat rack containers, and for very heavy or oversized cargo our project team plans break bulk or RoRo moves.',
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
const bgImage = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-lg font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-green space-y-2.5';

const serviceOfferings = [
  {
    title: 'Full Container Load (FCL)',
    desc: 'A dedicated 20 ft or 40 ft container exclusively for your cargo, loaded and sealed from origin to destination.',
    linkText: 'See FCL shipping from Chennai',
    href: '/fcl-shipping-chennai',
    icon: Box,
  },
  {
    title: 'Less than Container Load (LCL)',
    desc: 'Shared container space for smaller consignments, consolidated at an origin container freight station (CFS).',
    linkText: 'See LCL shipping from Chennai',
    href: '/lcl-shipping-chennai',
    icon: Layers,
  },
  {
    title: 'Specialised Containers',
    desc: 'Open top, flat rack and reefer containers for tall, heavy, out-of-gauge or temperature-sensitive cargo, coordinated via carrier networks.',
    linkText: 'Explore container types & sizes',
    href: '/container-shipping-chennai',
    icon: Thermometer,
  },
  {
    title: 'Break Bulk and RoRo',
    desc: 'For oversized machinery and heavy plant that cannot fit inside standard containers, planned with our specialist teams.',
    linkText: 'See project cargo logistics',
    href: '/services/project-logistics',
    icon: Ship,
  },
  {
    title: 'Import and Export Handling',
    desc: 'Carrier bookings, documentation, carting, and terminal coordination in both directions through Chennai gateways.',
    linkText: 'View customs clearance services',
    href: '/services/customs-brokerage',
    icon: Anchor,
  },
  {
    title: 'Customs Clearance Integration',
    desc: 'In-house customs clearance and ICEGATE filing handled alongside ocean freight so documentation and cargo stay in step.',
    linkText: 'See import customs clearance',
    href: '/import-customs-clearance-chennai',
    icon: ShieldCheck,
  },
  {
    title: 'Inland Transportation',
    desc: 'First-mile factory pickup, port carting, container trailers and last-mile delivery connecting plants and warehouses.',
    linkText: 'View transportation services',
    href: '/services/transportation',
    icon: Truck,
  },
  {
    title: 'Milestone Tracking',
    desc: 'Transparent status updates and electronic milestone tracking from booking confirmation to destination discharge.',
    linkText: 'Contact operations',
    href: '/contact-us',
    icon: Package,
  },
];

const processSteps = [
  {
    num: '1',
    title: 'Enquiry',
    text: 'Share the cargo type, weight or volume, origin, destination and target date.',
  },
  {
    num: '2',
    title: 'Route and booking',
    text: 'We propose an optimal ocean route, check carrier schedules across leading alliances, and book container space.',
  },
  {
    num: '3',
    title: 'Pickup and loading',
    text: 'The container is delivered to your premises for factory stuffing or to a container freight station (CFS), and the cargo is loaded and sealed.',
  },
  {
    num: '4',
    title: 'Documentation and customs',
    text: 'We prepare the shipping documents, coordinate the Verified Gross Mass (VGM) declaration under SOLAS for exports where applicable, and clear customs.',
  },
  {
    num: '5',
    title: 'Port handling',
    text: 'The container is gated into the maritime terminal and loaded onto the vessel in coordination with terminal operators.',
  },
  {
    num: '6',
    title: 'Tracking and delivery',
    text: 'You receive updates in transit, and at the destination port the cargo is handed over to your consignee or agent, or delivered onward.',
  },
];

const costDrivers = [
  { label: 'Container Size & Type', desc: 'Standard 20 ft / 40 ft, High Cube, or specialised reefers and flat racks, or LCL chargeable volume.' },
  { label: 'Destination Port & Route', desc: 'Direct calls versus transhipment routes, distance, and regional trade lane dynamics.' },
  { label: 'Carrier Line & Seasonality', desc: 'Shipping line tariffs, bunker adjustment factors (BAF), peak season surcharges, and general rate increases.' },
  { label: 'Cargo Weight & Characteristics', desc: 'Dense heavy cargo subject to road limits or special equipment handling requirements.' },
  { label: 'Port & Terminal Charges (THC)', desc: 'Terminal handling, wharfage, port gate formalities, and crane lift charges.' },
  { label: 'Customs & Documentation', desc: 'Regulatory filing, bill of lading documentation, customs inspection, and statutory fees.' },
  { label: 'Inland Transport & Feeder', desc: 'First-mile factory carting, container trailer haulage between CFS, port, and warehouse.' },
  { label: 'Ancillary & Storage Fees', desc: 'Origin/destination storage, equipment detention, or demurrage risk management.' },
];

const chennaiPorts = [
  {
    name: 'Chennai Port (Chennai Port Authority)',
    desc: 'The historic and central deep-water seaport serving Chennai, offering direct container terminals (CCTPL & CITPL) with extensive rail and road connectivity.',
  },
  {
    name: 'Kamarajar Port (Ennore)',
    desc: 'Located north of Chennai, providing modern container terminal facilities, deep draft berths, and congested-free access for North Chennai industrial belts.',
  },
  {
    name: 'Kattupalli Port (Adani Kattupalli)',
    desc: 'Modern deep-draft port adjacent to Ennore, handling major container shipping lines with advanced terminal infrastructure and quick turnaround times.',
  },
];

const whyChooseKps = [
  {
    title: 'Experience Since 1985',
    desc: 'More than four decades navigating Indian maritime trade, port conventions, customs procedures, and global liner alliances.',
  },
  {
    title: 'One Accountable Team',
    desc: 'Ocean booking, export/import customs brokerage, trailer transport, and port documentation managed under one coordinated roof.',
  },
  {
    title: 'Specialist Capability',
    desc: 'Project cargo, break bulk, RoRo and over dimensional cargo (ODC) planned seamlessly alongside standard container shipping.',
  },
  {
    title: 'Clear Communication',
    desc: 'A dedicated, named logistics coordinator and regular milestone updates from origin carting through to destination discharge.',
  },
];

export default function ContainerizedCargoPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Sea Freight Services in Chennai: FCL, LCL and Specialised Cargo" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-brand-gray mb-8">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">Services</Link>
            <span>/</span>
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Sea Freight</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Sidebar (shared directory & support card) */}
            <aside className="lg:col-span-4">
              <ServiceSidebar currentPath="/services/containerized-cargo" bgImage={bgImage} />
            </aside>

            {/* Right Main Content */}
            <article className="lg:col-span-8 min-w-0 space-y-12">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                  KPS Worldwide Logistics provides sea freight services in Chennai for exporters, importers and project teams who need cargo moved by container or break bulk. Since 1985, we have booked cargo space, prepared documents, cleared customs and arranged inland transport, so one team manages the shipment from your premises to the destination port.
                </p>
                <p className={pClass}>
                  This page explains what our sea freight covers, how it works and what affects the cost. For the full range of services, see our{' '}
                  <Link href="/services" className={linkClass}>logistics services</Link>.
                </p>

                {/* Top Quick-Action Quote CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-brand-yellow font-bold px-5 py-2.5 rounded-xl shadow-xs text-sm transition-colors"
                  >
                    <span>Request a sea freight quote</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center gap-2 bg-brand-gray-light hover:bg-brand-gray-muted text-brand-green-dark font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand-green" />
                    <span>044 4508 8099</span>
                  </a>
                </div>
              </div>

              {/* Section 1: What Our Sea Freight Services in Chennai Include */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>What Our Sea Freight Services in Chennai Include</h2>
                  <p className={pClass}>
                    As an experienced freight forwarder and multimodal logistics coordinator, KPS works closely with premier global shipping lines, port authorities, and terminal operators to provide complete ocean freight coverage:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceOfferings.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className={cardClass}>
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <Icon className="w-5 h-5 text-brand-green" />
                          </span>
                          <h3 className={h3Class}>{item.title}</h3>
                        </div>
                        <p className={pClass}>{item.desc}</p>
                        <div className="pt-1">
                          <Link href={item.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light">
                            <span>{item.linkText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-brand-gray-muted bg-[#fbfcfc] p-4 text-xs sm:text-sm text-brand-gray space-y-1">
                  <p className="font-semibold text-brand-green-dark">Service Scope Notice:</p>
                  <p>
                    KPS Worldwide Logistics arranges container space, specialised equipment, and vessel stowage through commercial shipping lines, container leasing operators, and port terminal operators. KPS does not claim ownership of vessels or container fleets, ensuring impartial carrier selection tailored to your route and schedule.
                  </p>
                </div>
              </section>

              {/* Section 2: FCL or LCL: A Quick Guide */}
              <section className="space-y-6">
                <h2 className={h2Class}>FCL or LCL: A Quick Guide</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border-2 border-brand-green/30 bg-[#f8fbf9] p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-green">Dedicated Container</span>
                      <Box className="w-5 h-5 text-brand-green" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-green-dark">Full Container Load (FCL)</h3>
                    <p className={pClass}>
                      FCL suits larger, fragile or high-value consignments and gives you exclusive use of the container. With a single seal and direct handling, cargo moves without consolidation delays.
                    </p>
                    <div className="pt-2">
                      <Link href="/fcl-shipping-chennai" className={linkClass}>
                        Explore FCL shipping from Chennai &rarr;
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-brand-yellow/50 bg-[#fffdf5] p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-green-dark">Shared Space</span>
                      <Layers className="w-5 h-5 text-brand-green-dark" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-green-dark">Less than Container Load (LCL)</h3>
                    <p className={pClass}>
                      LCL suits smaller consignments, where you pay for the space you use, but the cargo is handled more and the schedule depends on other shippers’ cargo being consolidated at the CFS.
                    </p>
                    <div className="pt-2">
                      <Link href="/lcl-shipping-chennai" className={linkClass}>
                        Explore LCL shipping from Chennai &rarr;
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className={pClass}>
                    Not sure which fits? Send us your cargo details and we will compare both options. Our{' '}
                    <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link>{' '}
                    team can also advise on combining sea and air freight when transit deadlines require a multimodal balance.
                  </p>
                </div>
              </section>

              {/* Section 3: How It Works */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>How It Works</h2>
                  <p className={pClass}>
                    Here is how our sea freight services in Chennai work, from enquiry to delivery:
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

                <div className="rounded-xl border border-brand-gray-muted bg-brand-gray-light/60 p-4 text-xs sm:text-sm text-brand-gray space-y-1">
                  <p className="font-semibold text-brand-green-dark">SOLAS VGM Compliance &amp; Terminal Operations:</p>
                  <p>
                    Under International Maritime Organization (IMO) SOLAS regulations, export containers require a Verified Gross Mass (VGM) declaration via certified weighbridge prior to vessel loading. KPS assists shippers in compliant tare/gross determination and electronic transmission to ocean carriers. Stevedoring and vessel loading are performed directly by port terminal operators.
                  </p>
                </div>
              </section>

              {/* Section 4: Documents for Sea Freight */}
              <section className="space-y-6">
                <h2 className={h2Class}>Documents for Sea Freight</h2>
                <div className="space-y-4">
                  <p className={pClass}>
                    The paperwork for sea freight services in Chennai depends on the cargo and the direction of the shipment, but it usually includes the commercial invoice, packing list, bill of lading, your Importer Exporter Code (IEC) and the customs filing (<Link href="/export-customs-clearance-chennai" className={linkClass}>Shipping Bill for exports</Link>, <Link href="/import-customs-clearance-chennai" className={linkClass}>Bill of Entry for imports</Link>).
                  </p>
                  <p className={pClass}>
                    Some cargo also needs a certificate of origin, a quality certificate or a permit. We confirm the exact list before the cargo moves, and we can advise on Incoterms, so you and your buyer know who pays for each stage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <FileText className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Commercial Invoice &amp; Detailed Packing List</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <FileText className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Bill of Lading (Master or House B/L)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <FileText className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Importer Exporter Code (IEC), where applicable</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <FileText className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Customs Declaration (Shipping Bill / Bill of Entry)</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-brand-gray italic border-l-2 border-brand-gray-muted pl-3">
                  Note: Documentation requirements differ based on commodity classification, destination country import rules, and applicable regulatory regimes. Our customs team verifies your specific checklist prior to booking.
                </p>
              </section>

              {/* Section 5: What Affects the Cost */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>What Affects the Cost</h2>
                  <p className={pClass}>
                    There is no single price for sea freight services in Chennai. The main factors are the container size and type (or the LCL volume), the destination port, the shipping line and season, the cargo weight, port and terminal handling, customs and documentation, inland transport, and any surcharges or storage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {costDrivers.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-brand-gray-muted bg-[#fbfcfc] space-y-1">
                      <span className="font-bold text-brand-green-dark text-sm block">{item.label}</span>
                      <p className="text-xs text-brand-gray leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border-l-4 border-brand-green bg-brand-gray-light/60 p-4 sm:p-5 text-[14.5px] sm:text-base text-brand-gray-dark">
                  <p className="font-semibold text-brand-green-dark">Transparent Freight Quotations:</p>
                  <p className="mt-1">
                    We give a written quote that shows what is included, so there are fewer surprises later. We do not invent shipping rates or offer speculative estimates without reviewing actual cargo specifications.
                  </p>
                </div>
              </section>

              {/* Section 6: Ports and Coverage */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Ports and Coverage</h2>
                  <p className={pClass}>
                    We arrange sea freight services in Chennai through the ports serving the city, providing comprehensive vessel connectivity to global trade lanes:
                  </p>
                </div>

                <div className="space-y-3">
                  {chennaiPorts.map((port, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-brand-gray-muted bg-white shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
                        <h3 className="font-bold text-brand-green-dark text-base">{port.name}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-brand-gray leading-relaxed pl-6">{port.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] space-y-2">
                  <h3 className="font-bold text-brand-green-dark text-base">South India Network &amp; Gateway Flexibility</h3>
                  <p className={pClass}>
                    Our operational branch offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru help us route cargo from across South India when another gateway suits your cargo, schedule or cost better.
                  </p>
                </div>
              </section>

              {/* Section 7: Why Choose KPS for Sea Freight Services in Chennai */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Why Choose KPS for Sea Freight Services in Chennai</h2>
                  <p className={pClass}>
                    Clients choose KPS because we combine four decades of customs expertise with reliable ocean forwarding:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whyChooseKps.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] space-y-2">
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
                  <FaqItem question="How long do sea freight services in Chennai take?" defaultOpen>
                    Transit time depends on the destination, the route and the vessel schedule, so there is no single answer. Tell us where the cargo is going and when it needs to arrive, and we will give you a likely timeline with the quote.
                  </FaqItem>
                  <FaqItem question="Do you handle both FCL and LCL?">
                    Yes. We arrange full container and less than container load shipments, and we can compare the two for your cargo.
                  </FaqItem>
                  <FaqItem question="Can you ship cargo that does not fit in a container?">
                    Yes. We arrange open top and flat rack containers, and for very heavy or oversized cargo our project team plans break bulk or RoRo moves.
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
        </div>
      </section>

      {/* Section 9: Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote for Sea Freight Services in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are shipping, where it is going and when it needs to arrive, and we will build the plan.{' '}
                <Link href="/quote" className={ctaLinkClass}>Request a quote</Link> or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>044 4508 8099</a>.{' '}
                <Link href="/about-us" className={ctaLinkClass}>Learn more about KPS</Link> or read about us as a{' '}
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
