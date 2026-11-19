import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, FileText, Home, MessageCircle, Phone, Package, ShieldCheck, Scale, Truck, Anchor, Ship, Box, Layers, Thermometer, Snowflake, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import ServiceSidebar from '@/components/services/ServiceSidebar';

export const metadata: Metadata = {
  title: 'Cold Storage Solutions in Chennai | Cold Chain | KPS',
  description: 'Cold storage solutions in Chennai for chilled and frozen goods, with temperature monitoring, handling and transport. Call KPS for a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/services/cold-storage',
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
      name: 'Cold Storage Solutions in Chennai',
      serviceType: 'Cold storage and cold chain logistics',
      url: 'https://kpsgroups.net/services/cold-storage',
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
          name: 'Cold Storage',
          item: 'https://kpsgroups.net/services/cold-storage',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is cold storage?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cold storage is temperature-controlled storage that keeps perishable or sensitive goods within a set range, such as chilled or frozen, so they stay safe and keep their quality.',
          },
        },
        {
          '@type': 'Question',
          name: 'What temperature ranges do your cold storage solutions in Chennai cover?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The range depends on the product and the chamber. Tell us the temperature your goods need and we will confirm which chamber fits.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you store imported cargo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We can coordinate the import shipment, the customs clearance and the movement into storage, so the goods stay in the cold chain from the port.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your product, the temperature range, volume and storage period, and we will reply with a plan and a quote.',
          },
        },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-lg font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-green space-y-2.5';

const coldStorageOfferings = [
  {
    title: 'Chilled & Frozen Storage',
    desc: 'Temperature-controlled chambers coordinated with verified facility partners for chilled products (+2°C to +8°C) and frozen goods (-18°C to -25°C).',
    icon: Snowflake,
  },
  {
    title: 'Inbound Receiving & Inspection',
    desc: 'Systematic receiving procedures, temperature probe validation at dock-in, seal verification, and documented consignment condition logging.',
    icon: ShieldCheck,
  },
  {
    title: 'Pallet Storage & Inventory Records',
    desc: 'Organized pallet racking, batch and lot tracking, FIFO stock rotation, and real-time inventory visibility so you know what is held and for how long.',
    icon: Layers,
  },
  {
    title: 'Picking, Packing & Dispatch',
    desc: 'Case-level or pallet-level order assembly, protective packaging, shrink-wrapping, and refrigerated dock staging for scheduled dispatches.',
    icon: Package,
  },
  {
    title: 'Temperature-Controlled Transport',
    desc: 'Reefer vehicle transport and container drayage arranged with calibrated data logging to maintain unbroken thermal continuity during road transit.',
    icon: Truck,
  },
  {
    title: 'Reefer Shipping & Customs Clearance',
    desc: 'Seamless ocean freight booking, port plug-in monitoring, and import customs clearance for food and perishable cargo arriving at Chennai ports.',
    linkText: 'See sea freight services',
    href: '/services/containerized-cargo',
    icon: Anchor,
  },
  {
    title: 'Import Clearance Integration',
    desc: 'In-house customs clearance, FSSAI statutory coordination, and port health inspection handled directly alongside cold storage transfers.',
    linkText: 'See import customs clearance',
    href: '/import-customs-clearance-chennai',
    icon: FileText,
  },
  {
    title: 'Value-Added Cold Chain Handling',
    desc: 'Secondary packaging, temperature-compliant relabelling, barcode application, and pallet sorting coordinated where authorized by product regulations.',
    icon: Box,
  },
];

const processSteps = [
  {
    num: '1',
    title: 'Enquiry',
    text: 'Share the product, the required temperature range, the volume and the storage period.',
  },
  {
    num: '2',
    title: 'Fit check and quote',
    text: 'We confirm the right chamber and partner facility, and send a clear written quote.',
  },
  {
    num: '3',
    title: 'Inbound',
    text: 'Goods arrive by reefer container or temperature-controlled vehicle and are checked on receipt.',
  },
  {
    num: '4',
    title: 'Storage',
    text: 'The goods are stored in the right chamber and monitored according to verified facility protocols.',
  },
  {
    num: '5',
    title: 'Order handling',
    text: 'We pick, pack and prepare dispatches against your orders, where this service is required.',
  },
  {
    num: '6',
    title: 'Dispatch',
    text: 'Goods leave in temperature-controlled transport arranged for the delivery route.',
  },
  {
    num: '7',
    title: 'Reporting',
    text: 'You receive stock and movement updates confirming dispatch and remaining inventory.',
  },
];

const checklistItems = [
  { label: 'Temperature Range & Stability', desc: 'Confirm the facility holds your exact required range (chilled or frozen) and can provide continuous historical temperature logs.' },
  { label: 'Capacity & Scalability', desc: 'Check whether the facility can accommodate your current pallet positions and scale during seasonal production or import spikes.' },
  { label: 'Monitoring, Alarms & Power Backup', desc: 'Ensure dual-sensor electronic telemetry, 24/7 excursion alarm alerts, and dedicated backup power generators are in place.' },
  { label: 'Hygiene & Sanitary Standards', desc: 'Review regular sanitization routines, rodent/pest control documentation, and insulated loading bay airlocks.' },
  { label: 'Licences & Regulatory Approvals', desc: 'Verify necessary compliance certificates (such as FSSAI registration or statutory cold storage licences) relevant to your cargo.' },
  { label: 'Strategic Gateway Location', desc: 'Assess road proximity to Chennai Port, Kamarajar Port (Ennore), Chennai Airport, and primary arterial distribution corridors.' },
  { label: 'Dock Facilities & Turnaround Time', desc: 'Ensure sealed, temperature-controlled loading bays and adequate forklift/dock leveller infrastructure for quick turnarounds.' },
  { label: 'Transparent Pricing Structure', desc: 'Require a written quote detailing storage fees per pallet/CBM, handling in/out, electricity surcharges, and value-added services.' },
  { label: 'Transit & Cold Chain Insurance', desc: 'Confirm insurance terms, spoilage liability limits, and coverage for equipment failure or unexpected delays.' },
];

const costDrivers = [
  { label: 'Pallet Positions & Volume', desc: 'Total pallet count, cubic capacity, and stackability dictate allocated chamber floor footprint.' },
  { label: 'Required Temperature Regime', desc: 'Deep-frozen storage (-18°C to -25°C) requires higher refrigeration power than chilled storage (+2°C to +8°C).' },
  { label: 'Storage Duration & Commitment', desc: 'Flexible short-term transit storage versus dedicated monthly or annual volume allocations.' },
  { label: 'Handling Operations (In / Out)', desc: 'Cross-docking, pallet de-stuffing, container carting, and warehouse labor for handling.' },
  { label: 'Value-Added Processing', desc: 'Sorting, repacking, specialized labeling, barcode scanning, and customized order fulfillment.' },
  { label: 'Refrigerated Transport Drayage', desc: 'Reefer container trucking from port terminals and dedicated reefer delivery to regional distribution centers.' },
];

const whyChooseKps = [
  {
    title: 'Experience Since 1985',
    desc: 'Four decades of expertise in Indian foreign trade, port logistics, customs procedures, and multimodal transport.',
  },
  {
    title: 'Integrated Cold Chain Planning',
    desc: 'We coordinate ocean reefer booking, port plug-in monitoring, customs brokerage, reefer transport, and warehouse storage as one plan.',
  },
  {
    title: 'Customs & Port Synchronization',
    desc: 'Our in-house customs brokerage team expedites Bill of Entry filings and FSSAI clearances to minimize dwell time at the port.',
  },
  {
    title: 'Single Point of Contact',
    desc: 'You deal with a dedicated logistics specialist who manages container releases, transport scheduling, and delivery status updates.',
  },
];

export default function ColdStoragePage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Cold Storage Solutions in Chennai: Temperature-Controlled Storage and Cold Chain Logistics" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-brand-gray mb-8">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">Services</Link>
            <span>/</span>
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Cold Storage</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Sidebar (service directory & support card) */}
            <aside className="lg:col-span-4">
              <ServiceSidebar currentPath="/services/cold-storage" bgImage={bgImage} />
            </aside>

            {/* Right Main Content */}
            <article className="lg:col-span-8 min-w-0 space-y-12">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                  KPS Worldwide Logistics offers cold storage solutions in Chennai for businesses that need to keep goods within a set temperature range from arrival to dispatch. We coordinate temperature-controlled storage through established cold-storage and FTWZ facility partners in Chennai, combining storage with the freight, customs clearance and transport around it, so your goods stay in the cold chain from the port to the customer.
                </p>
                <p className={pClass}>
                  Since 1985, we have handled cargo for Indian trade, and the same planning discipline applies to temperature-sensitive cargo. For our wider range, see our{' '}
                  <Link href="/services" className={linkClass}>logistics services</Link>.
                </p>

                {/* Top Quick-Action Quote CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-brand-yellow font-bold px-5 py-2.5 rounded-xl shadow-xs text-sm transition-colors"
                  >
                    <span>Request a cold storage quote</span>
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

              {/* Section 1: What Our Cold Storage Solutions in Chennai Include */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>What Our Cold Storage Solutions in Chennai Include</h2>
                  <p className={pClass}>
                    We coordinate end-to-end cold-chain logistics, connecting maritime shipping lines, port terminals, refrigerated warehouses, and inland delivery networks:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coldStorageOfferings.map((item, idx) => {
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
                        {item.href && (
                          <div className="pt-1">
                            <Link href={item.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light">
                              <span>{item.linkText}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-brand-gray-muted bg-[#fbfcfc] p-4 text-xs sm:text-sm text-brand-gray space-y-1">
                  <p className="font-semibold text-brand-green-dark">Operations &amp; Facility Arrangement Scope:</p>
                  <p>
                    KPS Worldwide Logistics operates as an integrated cold-chain logistics coordinator and freight forwarder. Temperature-controlled chambers, refrigerated trucks, and warehouse labor are arranged through vetted third-party cold storage facilities, FTWZ operators, and transport specialists under KPS&apos;s direct coordination.
                  </p>
                </div>
              </section>

              {/* Section 2: Who Uses Cold Storage Solutions in Chennai */}
              <section className="space-y-4">
                <h2 className={h2Class}>Who Uses Cold Storage Solutions in Chennai</h2>
                <p className={pClass}>
                  Cold storage solutions in Chennai serve businesses whose products spoil or lose quality if the temperature drifts. Typical industry categories include:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Food and beverage importers and distributors</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Seafood, meat, and dairy traders</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Producers of fresh and frozen agricultural goods</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Pharmaceutical, healthcare &amp; diagnostic suppliers</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-brand-gray-muted bg-white text-[14.5px] text-brand-gray-dark sm:col-span-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span>Manufacturers of specialty chemicals and temperature-sensitive industrial goods</span>
                  </div>
                </div>
                <p className={pClass}>
                  Some products also carry specific regulatory rules on how they must be stored, such as food safety (FSSAI) compliance or drug regulatory requirements. Tell us what you store and we will confirm what applies.
                </p>
              </section>

              {/* Section 3: How Our Cold Storage Solutions in Chennai Work */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>How Our Cold Storage Solutions in Chennai Work</h2>
                  <p className={pClass}>
                    Here is how our cold storage solutions in Chennai work from enquiry to dispatch:
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
              </section>

              {/* Section 4: Temperature Control and Monitoring */}
              <section className="space-y-4">
                <h2 className={h2Class}>Temperature Control and Monitoring</h2>
                <p className={pClass}>
                  Reliable cold storage solutions in Chennai depend on three things: holding the right temperature, being able to show that you did, and having a plan if something fails.
                </p>
                <p className={pClass}>
                  That usually means continuous temperature monitoring with alarms, records of temperature and stock movements, backup power for the chambers, and stock rotation so older stock moves first. Ask any provider to show how these work in practice, not just to describe them.
                </p>
                <div className="rounded-2xl border-l-4 border-brand-green bg-brand-gray-light/60 p-4 sm:p-5 text-[14.5px] sm:text-base text-brand-gray-dark leading-relaxed space-y-1">
                  <p className="font-semibold text-brand-green-dark">Cold Chain Telematics &amp; Data Logging:</p>
                  <p>
                    During reefer transport and storage transfers, KPS monitors calibrated dataloggers and genset operation to verify that thermal parameters remain within the prescribed range between port discharge and warehouse staging.
                  </p>
                </div>
              </section>

              {/* Section 5: How to Choose Cold Storage Solutions in Chennai */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>How to Choose Cold Storage Solutions in Chennai</h2>
                  <p className={pClass}>
                    Before you commit to cold storage solutions in Chennai, check these points:
                  </p>
                </div>

                <div className="space-y-3">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-brand-gray-muted bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-brand-yellow/20 text-brand-green-dark font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-brand-green-dark text-base">{item.label}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-brand-gray leading-relaxed pl-8.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 6: What Affects the Cost */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>What Affects the Cost</h2>
                  <p className={pClass}>
                    The cost of cold storage depends on the space or pallet positions you use, the temperature range (frozen storage generally costs more than chilled), the storage period, handling in and out, value-added work and the transport you need.
                  </p>
                  <p className={pClass}>
                    We give a written quote that shows what is included, so you can compare it on a like-for-like basis.
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
              </section>

              {/* Section 7: Why Choose KPS */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Why Choose KPS</h2>
                  <p className={pClass}>
                    Clients choose KPS for cold storage solutions in Chennai because freight, customs, transport and storage are planned by one team, with 40+ years of experience in Indian trade behind it. If you import perishable goods, we can coordinate the reefer shipment, the customs clearance and the move into storage as one plan, and you get a named contact and regular updates.
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
                  <FaqItem question="What is cold storage?" defaultOpen>
                    Cold storage is temperature-controlled storage that keeps perishable or sensitive goods within a set range, such as chilled or frozen, so they stay safe and keep their quality.
                  </FaqItem>
                  <FaqItem question="What temperature ranges do your cold storage solutions in Chennai cover?">
                    The range depends on the product and the chamber. Tell us the temperature your goods need and we will confirm which chamber fits.
                  </FaqItem>
                  <FaqItem question="Can you store imported cargo?">
                    Yes. We can coordinate the import shipment, the customs clearance and the movement into storage, so the goods stay in the cold chain from the port.
                  </FaqItem>
                  <FaqItem question="How do I get a quote?">
                    Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                    <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                    <Link href="/quote" className={linkClass}>quote form</Link>. Share your product, the temperature range, volume and storage period, and we will reply with a plan and a quote.
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
                Request a Quote for Cold Storage Solutions in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you store, at what temperature and for how long, and we will recommend a plan.{' '}
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
