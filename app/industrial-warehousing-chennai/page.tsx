import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Building2,
  Clock,
  ArrowUpRight,
  Warehouse,
  Boxes,
  PackageCheck,
  Truck,
  Wrench,
  Shield,
  FileText,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar or footer.

export const metadata: Metadata = {
  title: 'Industrial Warehousing in Chennai | Storage & Handling | KPS',
  description:
    'Industrial warehousing in Chennai for machinery, components and project cargo: storage, inventory handling and dispatch. Get a quote from KPS.',
  alternates: {
    canonical: 'https://kpsgroups.net/industrial-warehousing-chennai',
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
      name: 'Industrial Warehousing in Chennai',
      serviceType: 'Industrial warehousing and storage',
      url: 'https://kpsgroups.net/industrial-warehousing-chennai',
      areaServed: [
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'Country', name: 'India' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://kpsgroups.net/services' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Industrial Warehousing in Chennai',
          item: 'https://kpsgroups.net/industrial-warehousing-chennai',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What types of cargo suit industrial warehousing in Chennai?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Heavy, bulky and high-value goods such as machinery, spare parts, engineering and automotive components, project equipment and imported stock. Send us your cargo details and we will confirm whether we can store it.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you store project cargo and heavy machinery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, subject to the weight, size and handling needs of the cargo. We plan the space and the equipment before the goods arrive.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you offer storage for imported goods?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We can coordinate the import shipment, customs clearance and movement into storage, so the goods are received, recorded and held until you need them.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo type, dimensions, weight, storage period and dispatch plan, and we will reply with a plan and a quote.',
          },
        },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1920&q=80';

const linkClass =
  'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs border-t-4 border-t-brand-yellow space-y-2.5';

const warehousingScope = [
  {
    icon: Warehouse,
    title: 'Covered Industrial Storage',
    desc: 'Weather-tight, secure covered storage space for sensitive industrial goods, spare parts, and machinery requiring environmental protection.',
  },
  {
    icon: Boxes,
    title: 'Heavy and Bulky Goods',
    desc: 'Reinforced floor capacity and open staging space for machinery, structural equipment, and large items that general commercial warehouses cannot accommodate.',
  },
  {
    icon: Building2,
    title: 'Pallet and Rack Storage',
    desc: 'Selective pallet racking and organized floor stacking where packaging, dimensions, and operational turnover suit it.',
  },
  {
    icon: CheckCircle2,
    title: 'Receiving and Inspection',
    desc: 'Goods are verified against commercial invoices and packing lists upon arrival, with package conditions and any visible transit damage documented.',
  },
  {
    icon: FileText,
    title: 'Inventory Records & Stock Updates',
    desc: 'Accurate stock records and movement summaries maintained so you can track held items, batch lots, and storage durations.',
  },
  {
    icon: PackageCheck,
    title: 'Picking, Packing & Dispatch',
    desc: 'Order picking, export crating, shrink-wrapping, kitting, and staged loading executed according to your specific delivery instructions.',
  },
  {
    icon: Wrench,
    title: 'Certified Handling Equipment',
    desc: 'Loading and unloading supported with heavy forklifts, reach trucks, and mobile cranes selected to match cargo weight and center of gravity.',
  },
  {
    icon: Shield,
    title: 'Security and Safety Measures',
    desc: '24/7 security monitoring, controlled perimeter access, and industrial fire prevention measures suited for high-value industrial inventory.',
  },
  {
    icon: Truck,
    title: 'Customs-Linked Storage Coordination',
    desc: 'Seamless coordination for imported goods, connecting port discharge, import customs clearance, and road transport into storage under one team.',
  },
];

const workflowSteps = [
  {
    step: '1',
    title: 'Enquiry',
    desc: 'Share your cargo type, physical dimensions, total weight, packaging format, estimated storage duration, and outbound dispatch schedule.',
  },
  {
    step: '2',
    title: 'Space and Handling Plan',
    desc: 'We evaluate the cargo footprint, required floor loading capacity, handling equipment (forklift or crane), and staging requirements.',
  },
  {
    step: '3',
    title: 'Quote',
    desc: 'You receive a transparent written quote detailing storage rental, in/out handling charges, and any value-added services.',
  },
  {
    step: '4',
    title: 'Receiving',
    desc: 'Goods arrive from the port, manufacturing plant, or supplier, followed by physical inspection, verification, and formal receiving records.',
  },
  {
    step: '5',
    title: 'Storage',
    desc: 'Cargo is placed in designated covered bays or open yards, labeled with identification markers, and tracked in inventory logs.',
  },
  {
    step: '6',
    title: 'Order Handling and Dispatch',
    desc: 'We pick, pack, lash, and load cargo onto road vehicles as instructed, with onward transport arranged where required.',
  },
  {
    step: '7',
    title: 'Reporting',
    desc: 'You receive periodic stock summaries and movement records for your internal operations and commercial accounts.',
  },
];

const selectionChecklist = [
  {
    title: 'Location & Corridor Connectivity',
    desc: 'Distance to your manufacturing plant, Chennai Port, Ennore Port, Kattupalli, and your buyers. Key Chennai industrial belts like Sriperumbudur and Oragadam connect in different directions, directly influencing turnaround times and road freight costs.',
  },
  {
    title: 'Capacity & Scalability',
    desc: 'Ensure the facility can handle your current consignment volume with room to absorb seasonal surges or expanding production runs.',
  },
  {
    title: 'Floor Loading, Ceiling Height & Access',
    desc: 'Verify that floor load-bearing capacity (tonnes/sqm) and clear ceiling heights can support heavy industrial machinery, and that gates accommodate multi-axle trailers.',
  },
  {
    title: 'Handling Equipment',
    desc: 'Confirm the availability of suitable capacity forklifts, overhead/mobile cranes, and certified operators capable of handling heavy or delicate engineering goods.',
  },
  {
    title: 'Security and Fire Safety',
    desc: 'Review 24/7 manned security, perimeter fencing, CCTV surveillance, access logs, and industrial fire detection and sprinkler systems.',
  },
  {
    title: 'Inventory Visibility & Records',
    desc: 'Confirm that regular stock movement logs and verified inventory reports are provided so your operational teams have visibility over held cargo.',
  },
  {
    title: 'Insurance & Liability Coverage',
    desc: 'Understand storage liability terms, risk allocation, and ensure comprehensive warehouse insurance covers your goods while in storage.',
  },
  {
    title: 'Operating Hours & Gate Turnaround',
    desc: 'Check receiving and dispatch hours to ensure the facility aligns with port vessel cut-offs, factory delivery shifts, and regional transit timings.',
  },
  {
    title: 'Contract Terms & Billing Transparency',
    desc: 'Review minimum commitment periods, notice terms, handling rates, and clear itemisation of any potential ancillary charges.',
  },
];

const costFactors = [
  'Floor space area (sq. ft.) or pallet positions occupied',
  'Cargo weight, dimensions, and specialized handling complexity',
  'Storage tenure (short-term project staging vs. long-term industrial holding)',
  'Inbound unloading, uncrating, and outbound dock loading operations',
  'Value-added activities (repacking, industrial crating, kitting, lashing, relabelling)',
  'First-mile port carting or last-mile delivery transport to site',
];

export default function IndustrialWarehousingChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero
        title="Industrial Warehousing in Chennai: Storage, Handling and Dispatch for Industrial Cargo"
        bgImage={bgImage}
      />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema: Home -> Services -> Industrial Warehousing in Chennai) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <Link href="/services" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <span>Services</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">
              Industrial Warehousing in Chennai
            </span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction Lead */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                KPS Worldwide Logistics offers and coordinates industrial warehousing in Chennai for manufacturers, importers and project contractors who need a safe place to hold heavy, bulky or high-value goods between arrival and delivery. Operating across strategic industrial belts in Chennai (connecting Sriperumbudur, Oragadam, and port corridors), we combine storage with the freight, customs clearance and transport around it, so your cargo moves from the port to the warehouse to site under one team. Since 1985, we have handled cargo for Indian trade, and the same planning applies to what you store with us. For our wider range, see our{' '}
                <Link href="/services" className={linkClass}>
                  logistics services
                </Link>.
              </p>

              {/* Quick Action Bar */}
              <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                    <Warehouse className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-brand-green-dark">Need Industrial Storage or Staging in Chennai?</h3>
                    <p className="text-xs sm:text-sm text-brand-gray">Share your cargo specifications and storage schedule for a detailed plan.</p>
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

            {/* Section 1: What Industrial Warehousing in Chennai Includes */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Industrial Warehousing in Chennai Includes</h2>
              <p className={pClass}>
                Industrial storage demands infrastructure built for weight, size, and specialized handling. Our services cover:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {warehousingScope.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className={cardClass}>
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm sm:text-[15px] font-bold text-brand-green-dark leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 2: Cargo We Store */}
            <section className="space-y-5">
              <h2 className={h2Class}>Cargo We Store</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <p className={pClass}>
                  Industrial warehousing in Chennai differs from general retail storage because the cargo is heavier, larger and more valuable, and it needs the right equipment, floor space and handling.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    { label: 'Machinery and Spare Parts', sub: 'Industrial plant components, motors, pumps, tooling, and replacement spares.' },
                    { label: 'Automotive and Engineering Components', sub: 'Sub-assemblies, precision castings, chassis components, and engineering materials.' },
                    { label: 'Staged Project Equipment', sub: 'Capital equipment, electrical transformers, and structural modules held prior to site erection.' },
                    { label: 'Raw Materials & Imported Stock', sub: 'Industrial consumables, alloys, polymers, and imported inventory awaiting production or distribution.' },
                  ].map((cargo, idx) => (
                    <div key={idx} className="rounded-xl border border-brand-gray-muted bg-brand-gray-light/60 p-4 space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark">{cargo.label}</h3>
                      <p className="text-xs sm:text-sm text-brand-gray">{cargo.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-brand-green/5 border border-brand-green/20 p-4 text-xs sm:text-sm text-brand-gray-dark space-y-1">
                  <p>
                    <strong>Need customs duty deferral or temperature control?</strong> If your imported goods require duty-free holding or bonded re-export, explore our{' '}
                    <Link href="/services/ftwz" className={linkClass}>FTWZ warehousing services</Link> or dedicated{' '}
                    <Link href="/free-trade-warehousing-chennai" className={linkClass}>free trade warehousing in Chennai</Link>. For perishable and cold-chain cargo, ask about our cold storage solutions.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: How Industrial Warehousing in Chennai Works */}
            <section className="space-y-5">
              <h2 className={h2Class}>How Industrial Warehousing in Chennai Works</h2>
              <p className={pClass}>
                Here is how industrial warehousing in Chennai works with KPS, structured across seven clear phases:
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
            </section>

            {/* Section 4: How to Choose Industrial Warehousing in Chennai */}
            <section className="space-y-5">
              <h2 className={h2Class}>How to Choose Industrial Warehousing in Chennai</h2>
              <p className={pClass}>
                Before committing to an industrial storage facility, evaluate these practical criteria carefully:
              </p>
              <div className="space-y-3.5">
                {selectionChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-brand-gray-muted bg-white p-4 sm:p-5 flex items-start gap-3.5 shadow-xs"
                  >
                    <span className="w-8 h-8 rounded-xl bg-brand-green text-brand-yellow flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark">
                        {item.title}
                      </h3>
                      <p className={pClass}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-brand-gray italic border-l-2 border-brand-gray-muted pl-3">
                Ask any warehouse provider to demonstrate these operational capabilities in practice, not just describe them on paper.
              </p>
            </section>

            {/* Section 5: What Affects the Cost */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Affects the Cost</h2>
              <p className={pClass}>
                The cost of industrial warehousing in Chennai depends on measurable operational variables:
              </p>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <ul className="space-y-2.5">
                  {costFactors.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-gray-dark">
                      <span className="w-5 h-5 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs sm:text-sm text-brand-gray pt-2 border-t border-brand-gray-muted">
                  We give a written quote that shows storage, handling, and value-added extras separately, so you can evaluate options on a transparent, like-for-like basis without unexpected accessorial charges.
                </p>
              </div>
            </section>

            {/* Section 6: Warehousing with Freight, Customs and Transport */}
            <section className="space-y-5">
              <h2 className={h2Class}>Warehousing with Freight, Customs and Transport</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] p-5 sm:p-6 space-y-4">
                <p className={pClass}>
                  Storage works best when it is planned with the cargo movement on either side of it. KPS coordinates freight forwarding, sea freight, import customs clearance and transport to site, including project cargo logistics and over dimensional cargo movements for heavy equipment. One team plans the whole chain, which means fewer handovers and a single point of contact.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/services/containerized-cargo"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Sea Freight Services
                      </h3>
                      <p className="text-xs text-brand-gray">FCL and LCL container shipping into Chennai</p>
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
                      <p className="text-xs text-brand-gray">Break bulk, heavy lift, and staging operations</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>

                  <Link
                    href="/services/odc"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        ODC Transport in Chennai
                      </h3>
                      <p className="text-xs text-brand-gray">Multi-axle hydraulic trailers and route surveys</p>
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
                      <p className="text-xs text-brand-gray">Duty-deferred hubbing and re-export zones</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Section 7: Why Choose KPS */}
            <section className="space-y-4">
              <h2 className={h2Class}>Why Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-yellow shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-brand-green-dark">
                  <ShieldCheck className="w-5 h-5 text-brand-green shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Integrated Warehousing, Customs, Freight & Transport
                  </span>
                </div>
                <p className={pClass}>
                  Clients choose KPS for industrial warehousing in Chennai because storage, freight, customs and transport are coordinated by one team, with 40+ years of experience in Indian trade behind it (since 1985). We handle containerized and non-containerized cargo, including heavy and project shipments, and you get a named contact and regular updates.
                </p>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                  Our regional offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru support cargo moving through other South Indian gateways, ensuring connected coverage across sea, air, and inland industrial corridors.
                </p>
              </div>
            </section>

            {/* Section 8: Frequently Asked Questions */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What types of cargo suit industrial warehousing in Chennai?" defaultOpen>
                  Heavy, bulky and high-value goods such as machinery, spare parts, engineering and automotive components, project equipment and imported stock. Send us your cargo details and we will confirm whether we can store it.
                </FaqItem>
                <FaqItem question="Can you store project cargo and heavy machinery?">
                  Yes, subject to the weight, size and handling needs of the cargo. We plan the space and the equipment before the goods arrive.
                </FaqItem>
                <FaqItem question="Do you offer storage for imported goods?">
                  Yes. We can coordinate the import shipment, customs clearance and movement into storage, so the goods are received, recorded and held until you need them.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo type, dimensions, weight, storage period and dispatch plan, and we will reply with a plan and a quote.
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
                Request a Quote for Industrial Warehousing in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you need to store, for how long and how it will be dispatched, and we will recommend a plan.{' '}
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
