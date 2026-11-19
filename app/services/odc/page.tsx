import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, FileText, Home, MessageCircle, Phone, Package, ShieldCheck, Scale, Truck, Anchor, Ship, Box, Layers, MapPin, Compass, HardHat, Cog, AlertTriangle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import ServiceSidebar from '@/components/services/ServiceSidebar';

export const metadata: Metadata = {
  title: 'ODC Transport in Chennai | Over Dimensional Cargo | KPS',
  description: 'ODC transport in Chennai: route survey, permits, escorts and trailers for over dimensional cargo from port to site. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/services/odc',
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
      name: 'ODC Transport in Chennai',
      serviceType: 'Over dimensional cargo transport',
      url: 'https://kpsgroups.net/services/odc',
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
          name: 'ODC Transport',
          item: 'https://kpsgroups.net/services/odc',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is ODC?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ODC stands for over dimensional cargo. It is cargo carried as a single piece that exceeds the legal dimension limits for road vehicles, so it needs special equipment, a planned route and usually special permission.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need permission to move ODC by road?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Usually yes. Cargo that exceeds the legal dimension or weight limits generally needs permission from the relevant transport or highway authorities, and it may need pilot or escort vehicles. We coordinate the permissions and tell you what applies to your route.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does ODC transport in Chennai cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "There is no single price. The cost depends on the cargo's size and weight, the route and distance, the equipment, permissions, escorts and timing. We give a written quote once we have the cargo details.",
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share the cargo dimensions, weight, origin, destination and target date, and we will reply with a plan and a quote.',
          },
        },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-lg font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-green space-y-2.5';

const odcCapabilities = [
  {
    title: 'Route Survey & Feasibility Check',
    desc: 'Detailed physical checks of bridges, overhead lines, toll plazas, turns and pinch points before trailers are deployed.',
    icon: Compass,
  },
  {
    title: 'Trailer & Equipment Selection',
    desc: 'Matching cargo specifications with hydraulic multi-axle trailers, drop decks, low-bed and semi-low-bed prime movers.',
    icon: Truck,
  },
  {
    title: 'Permission Assistance & Escort Coordination',
    desc: 'Coordinating required road permits with transport and highway authorities, and arranging pilot vehicles or escorts as mandated.',
    icon: ShieldCheck,
  },
  {
    title: 'Loading Supervision & Lashing',
    desc: 'Engineered weight distribution across axles, certified heavy-duty chain lashing, and continuous securing checks.',
    icon: Scale,
  },
  {
    title: 'Port-to-Site & Plant Movements',
    desc: 'First-mile carting from Chennai ports to regional factories, industrial parks, EPC sites, and inland destinations.',
    icon: MapPin,
  },
  {
    title: 'ODC in Specialized Containers',
    desc: 'Arranging flat rack and open top container shipping through our sea freight services for out-of-gauge ocean cargo.',
    linkText: 'See sea freight services',
    href: '/services/containerized-cargo',
    icon: Box,
  },
  {
    title: 'Customs Clearance Integration',
    desc: 'Import and export customs documentation handled alongside heavy haulage so cargo moves out of the port without delay.',
    linkText: 'See import customs clearance',
    href: '/import-customs-clearance-chennai',
    icon: FileText,
  },
  {
    title: 'Project Cargo Logistics',
    desc: 'End-to-end planning for break bulk, RoRo and heavy lift movements when cargo forms part of a larger industrial project.',
    linkText: 'See project cargo logistics',
    href: '/services/project-logistics',
    icon: Ship,
  },
];

const movementSteps = [
  {
    num: '1',
    title: 'Cargo details',
    text: 'Length, width, height, weight, drawings and lifting points.',
  },
  {
    num: '2',
    title: 'Route survey',
    text: 'The planned route is checked for bridges, road width, turns and overhead obstructions.',
  },
  {
    num: '3',
    title: 'Equipment selection',
    text: 'The right trailer and prime movers are chosen for the load.',
  },
  {
    num: '4',
    title: 'Permissions and escorts',
    text: 'The required approvals and pilot vehicles are arranged.',
  },
  {
    num: '5',
    title: 'Loading and securing',
    text: 'The cargo is loaded, balanced and lashed under supervision.',
  },
  {
    num: '6',
    title: 'Movement',
    text: 'The load travels the approved route with escorts.',
  },
  {
    num: '7',
    title: 'Delivery and offloading',
    text: 'The cargo is positioned at site and the paperwork is closed out.',
  },
];

const costDrivers = [
  { label: 'Cargo Dimensions & Weight', desc: 'Total length, width, height, gross weight and axle load requirements.' },
  { label: 'Distance & Route Geometry', desc: 'Terrain, gradients, bypass requirements, and toll or bypass surcharges.' },
  { label: 'Trailer & Prime Mover Fleet', desc: 'Number of hydraulic axles, modular combinations, low-bed or drop-deck equipment.' },
  { label: 'Statutory Permissions & Escorts', desc: 'Road authority application fees, pilot vehicles, civil escorts, and police coordination.' },
  { label: 'Time & Speed Restrictions', desc: 'Night-movement mandates, regulated travel windows, and peak-hour city bypass rules.' },
  { label: 'Loading & Rigging Coordination', desc: 'Heavy mobile cranes, jacking/skidding requirements at origin and destination site.' },
  { label: 'Marine & Transit Insurance', desc: 'Comprehensive transit risk coverage selected based on cargo declared valuation.' },
];

const whyChooseKps = [
  {
    title: 'Experience Since 1985',
    desc: 'Four decades of expertise in Indian foreign trade, port logistics, and specialized road transport.',
  },
  {
    title: 'Coordinated Single Team',
    desc: 'Route survey, trailer selection, statutory permissions, customs brokerage, and transport managed by one accountable team.',
  },
  {
    title: 'Containerized & Non-Containerized',
    desc: 'We handle both flat rack / open top containers and multi-axle modular hydraulic road moves under one roof.',
  },
  {
    title: 'Named Contact & Status Updates',
    desc: 'A dedicated project coordinator provides regular milestone tracking until your load is delivered and positioned at site.',
  },
];

export default function OdcPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="ODC Transport in Chennai: Moving Over Dimensional Cargo Safely" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-brand-gray mb-8">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">Services</Link>
            <span>/</span>
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">ODC Transport</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Sidebar (service directory & support card) */}
            <aside className="lg:col-span-4">
              <ServiceSidebar currentPath="/services/odc" bgImage={bgImage} />
            </aside>

            {/* Right Main Content */}
            <article className="lg:col-span-8 min-w-0 space-y-12">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                  KPS Worldwide Logistics provides ODC transport in Chennai for industrial and infrastructure projects that need oversized and heavy equipment moved by road. We survey the route, choose the trailers, coordinate permissions and escorts, supervise loading and lashing, and move the cargo from port, factory or warehouse to site, so heavy loads arrive safely and on schedule.
                </p>
                <p className={pClass}>
                  Since 1985, we have handled cargo for Indian trade, and our team brings that experience to loads that do not fit a standard truck. For the wider project service, see our{' '}
                  <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link>{' '}
                  page.
                </p>

                {/* Top Quick-Action Quote CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-brand-yellow font-bold px-5 py-2.5 rounded-xl shadow-xs text-sm transition-colors"
                  >
                    <span>Request an ODC quote</span>
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

              {/* Section 1: What Counts as ODC? */}
              <section className="space-y-4">
                <h2 className={h2Class}>What Counts as ODC?</h2>
                <p className={pClass}>
                  Over dimensional cargo (ODC) is cargo carried as a single piece that exceeds the dimension limits set under the Central Motor Vehicles Rules, or that sticks out beyond the platform of the vehicle carrying it. Overweight cargo needs similar care, with statutory gross vehicle weight and axle-load regulations applied separately.
                </p>
                <p className={pClass}>
                  Typical examples include transformers, boilers, pressure vessels, turbine and generator components, large fabricated structures and heavy machinery.
                </p>
                <p className={pClass}>
                  Because these loads cannot be split, the move has to be engineered around them.
                </p>
              </section>

              {/* Section 2: How ODC Transport in Chennai Works */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>How ODC Transport in Chennai Works</h2>
                  <p className={pClass}>
                    We execute each heavy haulage movement through an engineered seven-step sequence:
                  </p>
                </div>

                <div className="space-y-3.5">
                  {movementSteps.map((step) => (
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
                  Note: Specific permit requirements, travel curfews and escort vehicles vary based on the cargo dimensions, weight, route constraints and local highway authority conditions.
                </p>
              </section>

              {/* Section 3: Route Survey: The First Step */}
              <section className="space-y-4">
                <h2 className={h2Class}>Route Survey: The First Step</h2>
                <p className={pClass}>
                  A route survey is the first step in ODC transport in Chennai, because a load that cannot clear a bridge, turn or overhead line cannot be moved however good the equipment is.
                </p>
                <p className={pClass}>
                  The survey identifies constraints and decides whether the route works, needs temporary changes or must be replaced.
                </p>
                <div className="rounded-2xl border-l-4 border-brand-green bg-brand-gray-light/60 p-4 sm:p-5 text-[14.5px] sm:text-base text-brand-gray-dark leading-relaxed">
                  <p className="font-semibold text-brand-green-dark">Risk Mitigation &amp; Insurer Compliance:</p>
                  <p className="mt-1">
                    Insurers may also ask for a route survey report before they cover an ODC movement, so the survey protects the cargo as well as the schedule by identifying access constraints before mobilization.
                  </p>
                </div>
              </section>

              {/* Section 4: Permissions, Escorts and Safety */}
              <section className="space-y-4">
                <h2 className={h2Class}>Permissions, Escorts and Safety</h2>
                <p className={pClass}>
                  Moving ODC on public roads usually needs permission from the transport or highway authorities, and the conditions depend on the cargo and the route.
                </p>
                <p className={pClass}>
                  Pilot vehicles typically travel in front of and behind the load, and in sensitive areas a police or transport department escort may be needed. Crossing a bridge may also need supervision and controlled traffic.
                </p>
                <p className={pClass}>
                  Permissions for ODC transport in Chennai and beyond are never automatic, so we plan for the approval time in your schedule and tell you what applies to your route.
                </p>
              </section>

              {/* Section 5: What We Handle for ODC Transport in Chennai */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>What We Handle for ODC Transport in Chennai</h2>
                  <p className={pClass}>
                    We coordinate complete technical, regulatory and overland heavy-haulage capabilities:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {odcCapabilities.map((item, idx) => {
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
                  <p className="font-semibold text-brand-green-dark">Operations &amp; Equipment Notice:</p>
                  <p>
                    KPS Worldwide Logistics operates as an engineered logistics coordinator. Hydraulic multi-axle modular trailers, pullers, pilot vehicles and heavy cranes are arranged through verified equipment partners and transport providers under our direct on-site supervision and route planning.
                  </p>
                </div>
              </section>

              {/* Section 6: Port to Site Moves */}
              <section className="space-y-4">
                <h2 className={h2Class}>Port to Site Moves</h2>
                <p className={pClass}>
                  For ODC transport in Chennai from the port to a plant or project site, the planning starts before the vessel arrives. We coordinate port discharge, customs, the trailer and the route, so the cargo moves out of the port without waiting.
                </p>
                <p className={pClass}>
                  For static units that cannot be driven or towed, we use specialised trailers, including Mafi trailers for movements within port and yard areas arranged in cooperation with terminal and carrier partners.
                </p>
              </section>

              {/* Section 7: What Affects the Cost */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>What Affects the Cost</h2>
                  <p className={pClass}>
                    The cost of an ODC move depends on the cargo’s dimensions and weight, the distance and route, the trailer and equipment, permissions and escorts, the time and speed restrictions on the route, loading and unloading, and any insurance you choose.
                  </p>
                  <p className={pClass}>
                    We give a written quote once we have the cargo details and a view of the route.
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

              {/* Section 8: Why Clients Choose KPS */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Why Clients Choose KPS</h2>
                  <p className={pClass}>
                    Clients choose KPS for ODC transport in Chennai because the survey, equipment, permissions, customs and port handling are coordinated by one team, with 40+ years of experience in Indian trade behind it. We handle containerized and non-containerized cargo, and you get a named contact and regular updates until the load is delivered.
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

              {/* Section 9: Frequently Asked Questions */}
              <section className="space-y-6">
                <h2 className={h2Class}>Frequently Asked Questions</h2>
                <div className="space-y-3">
                  <FaqItem question="What is ODC?" defaultOpen>
                    ODC stands for over dimensional cargo. It is cargo carried as a single piece that exceeds the legal dimension limits for road vehicles, so it needs special equipment, a planned route and usually special permission.
                  </FaqItem>
                  <FaqItem question="Do I need permission to move ODC by road?">
                    Usually yes. Cargo that exceeds the legal dimension or weight limits generally needs permission from the relevant transport or highway authorities, and it may need pilot or escort vehicles. We coordinate the permissions and tell you what applies to your route.
                  </FaqItem>
                  <FaqItem question="How much does ODC transport in Chennai cost?">
                    There is no single price. The cost depends on the cargo&apos;s size and weight, the route and distance, the equipment, permissions, escorts and timing. We give a written quote once we have the cargo details.
                  </FaqItem>
                  <FaqItem question="How do I get a quote?">
                    Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                    <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                    <Link href="/quote" className={linkClass}>quote form</Link>. Share the cargo dimensions, weight, origin, destination and target date, and we will reply with a plan and a quote.
                  </FaqItem>
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>

      {/* Section 10: Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote for ODC Transport in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you need to move, where it is going and when it must arrive, and we will plan the route and the equipment.{' '}
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
