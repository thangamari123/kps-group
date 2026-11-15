import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, FileText, Home, MessageCircle, Phone, Package, ShieldCheck, Scale, Truck, Anchor, Ship, Box, Layers, MapPin, Compass, HardHat, Cog } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import ServiceSidebar from '@/components/services/ServiceSidebar';

export const metadata: Metadata = {
  title: 'Project Cargo Logistics in India | Break Bulk, RoRo | KPS',
  description: 'Project cargo logistics in India from Chennai: break bulk, RoRo, heavy lift, port handling and heavy machinery transport for industry. Get a quote.',
  alternates: {
    canonical: 'https://kpsgroups.net/services/project-logistics',
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
      name: 'Project Cargo Logistics in India',
      serviceType: 'Project cargo and break bulk logistics',
      description: 'Planning and movement of heavy, oversized and high-value cargo, including break bulk, RoRo, port handling and heavy machinery transport.',
      url: 'https://kpsgroups.net/services/project-logistics',
      areaServed: [
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'Country', name: 'India' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Project Cargo Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Break Bulk Operations' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Port Handling & Stevedoring' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'RoRo Shipping' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Heavy Machinery Transportation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Static Cargo Transportation' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Route and Move Planning' } },
        ],
      },
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
          name: 'Project Cargo Logistics',
          item: 'https://kpsgroups.net/services/project-logistics',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What counts as project cargo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cargo that is too large, heavy, valuable or complex for standard shipping, usually as part of an industrial or infrastructure project. Examples include machinery, transformers, turbines and large fabricated units.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between break bulk and container shipping?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Container cargo travels inside a standard container. Break bulk cargo is loaded piece by piece because it is too large or heavy for a container.',
          },
        },
        {
          '@type': 'Question',
          name: 'What affects the cost of project cargo logistics in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "The main factors are the cargo's weight and dimensions, the route and distance, the equipment needed, port handling and lashing, permits and escorts, timing and any insurance you choose. We give a written quote once we have the cargo details.",
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
const bgImage = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const h3Class = 'text-lg font-bold text-brand-green-dark';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-green space-y-2.5';

const projectServices = [
  {
    title: 'Break Bulk Operations',
    desc: 'Cargo that does not fit a container moves as break bulk, loaded and discharged piece by piece. We plan the vessel, the stowage and the port handling around the cargo’s size and weight.',
    icon: Ship,
  },
  {
    title: 'Port Handling and Stevedoring',
    desc: 'We coordinate loading, discharge, lashing and securing at the port, with supervision on site so heavy pieces are handled safely in cooperation with certified stevedores and port terminal operators.',
    icon: Anchor,
  },
  {
    title: 'RoRo Shipping',
    desc: 'Wheeled and self-propelled cargo, such as vehicles and some heavy equipment, can be driven or towed on and off a RoRo vessel. We arrange the booking, the port formalities and the handling.',
    icon: Truck,
  },
  {
    title: 'Heavy Machinery Transportation',
    desc: 'We move heavy machinery between the port, the warehouse and the project site, arranging the right hydraulic axles, low-bed and semi-low-bed trailers for the weight and dimensions.',
    icon: Cog,
  },
  {
    title: 'Static Cargo Transportation',
    desc: 'Large static units that cannot be driven or towed are moved on specialised trailers such as Mafi trailers arranged through carrier partners, with route planning done in advance. See also our over dimensional cargo service.',
    icon: Box,
    linkText: 'See over dimensional cargo (ODC) service',
    href: '/services/odc',
  },
  {
    title: 'Route and Move Planning',
    desc: 'Before cargo moves, we review the dimensions, weight and lifting points, check the route and port, and prepare the method and equipment plan.',
    icon: Compass,
  },
];

const planningSteps = [
  {
    num: '1',
    title: 'Cargo review',
    text: 'Dimensions, weight, centre of gravity, lifting points and drawings.',
  },
  {
    num: '2',
    title: 'Route and port survey',
    text: 'Road, bridge, clearance and port constraints are checked before the equipment is chosen.',
  },
  {
    num: '3',
    title: 'Method and equipment plan',
    text: 'Vessel, cranes, trailers and lashing are selected for the cargo.',
  },
  {
    num: '4',
    title: 'Permits and customs',
    text: 'Road permissions and escorts where required, and customs clearance handled alongside.',
  },
  {
    num: '5',
    title: 'Port handling and securing',
    text: 'Loading, lashing and supervision at the port.',
  },
  {
    num: '6',
    title: 'Transport to site',
    text: 'The cargo moves on the planned route with the agreed equipment.',
  },
  {
    num: '7',
    title: 'Delivery and handover',
    text: 'The cargo is delivered, and the documentation is closed out.',
  },
];

const industries = [
  {
    title: 'Automotive & Heavy Assembly',
    desc: 'Stamping presses, body assembly lines, industrial dies, and tooling equipment.',
  },
  {
    title: 'Power & Energy Infrastructure',
    desc: 'Turbines, generators, power transformers, substations, and boiler modules.',
  },
  {
    title: 'Industrial Manufacturing & EPC',
    desc: 'Pressure vessels, heat exchangers, distillation columns, and chemical reactors.',
  },
  {
    title: 'Mining & Heavy Construction',
    desc: 'Excavators, crushers, conveyors, milling units, and structural fabrication components.',
  },
];

const chennaiPorts = [
  {
    name: 'Chennai Port',
    desc: 'Offers dedicated heavy-lift crane capabilities, deep-water berths, and direct access for break bulk, project vessels, and heavy industrial machinery.',
  },
  {
    name: 'Kamarajar Port (Ennore)',
    desc: 'Modern deep-draft ocean terminal north of Chennai handling project cargo, break bulk, and specialized RoRo carriers with direct arterial highway connectivity.',
  },
  {
    name: 'Kattupalli Port',
    desc: 'Deep-draft multipurpose port terminal suited for heavy machinery discharge, staging, and coastal barging connections.',
  },
];

const whyChooseKps = [
  {
    title: 'Experience Since 1985',
    desc: 'More than four decades of continuous presence in Indian foreign trade and industrial logistics coordination.',
  },
  {
    title: 'One Accountable Team',
    desc: 'Planning, port handling, customs brokerage, and inland transport coordinated together under single-point responsibility.',
  },
  {
    title: 'Containerized & Non-Containerized',
    desc: 'We handle both containerized freight (standard, open top, flat rack) and break bulk or RoRo moves so hybrid project shipments stay together.',
  },
  {
    title: 'Named Contact & Status Updates',
    desc: 'You receive a designated project logistics manager and regular milestone tracking updates from origin survey to on-site delivery.',
  },
];

export default function ProjectLogisticsPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Project Cargo Logistics in India: Planning and Moving Heavy, Oversized and High-Value Cargo" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-brand-gray mb-8">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">Services</Link>
            <span>/</span>
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Project Cargo Logistics</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Sidebar (service directory & support card) */}
            <aside className="lg:col-span-4">
              <ServiceSidebar currentPath="/services/project-logistics" bgImage={bgImage} />
            </aside>

            {/* Right Main Content */}
            <article className="lg:col-span-8 min-w-0 space-y-12">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                  KPS Worldwide Logistics provides project cargo logistics in India for industrial and infrastructure projects that depend on heavy, oversized or high-value equipment arriving safely and on schedule. From our base in Chennai, we plan the whole movement before the cargo leaves: the route, the equipment, the port handling, the customs clearance and the transport to site.
                </p>
                <p className={pClass}>
                  Since 1985, we have handled cargo for Indian trade, and our project team brings that experience to cargo that standard container shipping cannot take.
                </p>

                {/* Top Quick-Action Quote CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/quote"
                    className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-dark text-brand-yellow font-bold px-5 py-2.5 rounded-xl shadow-xs text-sm transition-colors"
                  >
                    <span>Request a project cargo quote</span>
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

              {/* Section 1: What Is Project Cargo Logistics in India? */}
              <section className="space-y-4">
                <h2 className={h2Class}>What Is Project Cargo Logistics in India?</h2>
                <p className={pClass}>
                  Project cargo is cargo that is too large, too heavy, too valuable or too complex to move as ordinary freight. It is usually part of a larger project, where a delay on one piece holds up the rest.
                </p>
                <p className={pClass}>
                  Typical examples include industrial machinery, transformers, turbines, boilers, pressure vessels, mining equipment and large fabricated structures.
                </p>
                <p className={pClass}>
                  Project cargo logistics in India means planning each of these moves in detail, from the first survey to final delivery at site, so the cargo arrives intact and in the right sequence.
                </p>
              </section>

              {/* Section 2: Our Project Cargo Logistics in India Services */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Our Project Cargo Logistics in India Services</h2>
                  <p className={pClass}>
                    We coordinate comprehensive technical and transport solutions for complex, oversized, and heavy-lift consignments:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectServices.map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div key={idx} className={cardClass}>
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                            <Icon className="w-5 h-5 text-brand-green" />
                          </span>
                          <h3 className={h3Class}>{service.title}</h3>
                        </div>
                        <p className={pClass}>{service.desc}</p>
                        {service.href && (
                          <div className="pt-1">
                            <Link href={service.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light">
                              <span>{service.linkText}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-brand-gray-muted bg-[#fbfcfc] p-4 text-xs sm:text-sm text-brand-gray space-y-1">
                  <p className="font-semibold text-brand-green-dark">Operations Scope Clarification:</p>
                  <p>
                    KPS Worldwide Logistics acts as a project freight forwarder and logistics coordinator. Heavy lift cranes, specialized hydraulic trailers, Mafi trailers, stevedoring, and vessel space are coordinated and arranged in partnership with certified port operators, equipment leasing providers, and marine carriers under our direct on-site supervision.
                  </p>
                </div>
              </section>

              {/* Section 3: How We Plan a Project Move */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>How We Plan a Project Move</h2>
                  <p className={pClass}>
                    Every project cargo logistics in India move starts with planning, because mistakes with heavy cargo are costly. Our process:
                  </p>
                </div>

                <div className="space-y-3.5">
                  {planningSteps.map((step) => (
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
                  Note: Statutory road transit permissions, Ministry of Road Transport and Highways (MoRTH) clearances, and state police escorts are coordinated on your behalf subject to route constraints, bridge load ratings, and local administrative requirements.
                </p>
              </section>

              {/* Section 4: Industries We Serve */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Industries We Serve</h2>
                  <p className={pClass}>
                    Project cargo logistics in India supports automotive, energy, infrastructure and mining projects, along with manufacturers and contractors who need heavy equipment moved to a plant or project site. Each sector has its own handling, timing and documentation requirements, and we plan around them:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {industries.map((ind, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <HardHat className="w-4 h-4 text-brand-green flex-shrink-0" />
                        <h3 className="text-base font-bold text-brand-green-dark">{ind.title}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">{ind.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 5: Customs and Documentation */}
              <section className="space-y-6">
                <h2 className={h2Class}>Customs and Documentation</h2>
                <div className="space-y-4">
                  <p className={pClass}>
                    Project shipments often need detailed cargo specifications, drawings, packing lists, invoices and the usual transport documents, along with the customs filing.
                  </p>
                  <p className={pClass}>
                    We handle{' '}
                    <Link href="/import-customs-clearance-chennai" className={linkClass}>import customs clearance</Link>{' '}
                    and{' '}
                    <Link href="/export-customs-clearance-chennai" className={linkClass}>export customs clearance</Link>{' '}
                    together with the movement, so documents and cargo stay aligned. Our{' '}
                    <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link>{' '}
                    team can also arrange sea and air legs when a project needs them.
                  </p>
                  <p className={pClass}>
                    For cargo that fits within standard or specialized container equipment before or alongside break bulk moves, see our{' '}
                    <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link>.
                  </p>
                </div>
              </section>

              {/* Section 6: Ports and Coverage */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Ports and Coverage</h2>
                  <p className={pClass}>
                    We arrange project cargo logistics in India through the ports serving Chennai, providing direct access to heavy lift berths, ro-ro ramps, and multimodal connectivity:
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
                  <h3 className="font-bold text-brand-green-dark text-base">South India Network &amp; Site Inland Movement</h3>
                  <p className={pClass}>
                    Our offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru let us handle cargo through other South Indian gateways and move it inland to site. Tell us the origin, the destination and the site address, and we will propose the route.
                  </p>
                </div>
              </section>

              {/* Section 7: Why Choose KPS */}
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className={h2Class}>Why Choose KPS</h2>
                  <p className={pClass}>
                    Clients choose KPS for project cargo logistics in India because planning, port handling, customs and transport are coordinated by one team, with 40+ years of experience in Indian trade behind it.
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
                  <FaqItem question="What counts as project cargo?" defaultOpen>
                    Cargo that is too large, heavy, valuable or complex for standard shipping, usually as part of an industrial or infrastructure project. Examples include machinery, transformers, turbines and large fabricated units.
                  </FaqItem>
                  <FaqItem question="What is the difference between break bulk and container shipping?">
                    Container cargo travels inside a standard container. Break bulk cargo is loaded piece by piece because it is too large or heavy for a container.
                  </FaqItem>
                  <FaqItem question="What affects the cost of project cargo logistics in India?">
                    The main factors are the cargo&apos;s weight and dimensions, the route and distance, the equipment needed, port handling and lashing, permits and escorts, timing and any insurance you choose. We give a written quote once we have the cargo details.
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

      {/* Section 9: Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote for Project Cargo Logistics in India
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you need to move, where it is going and when it must arrive, and we will build the plan.{' '}
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
