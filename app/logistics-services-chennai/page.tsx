import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight, Home, MessageCircle, Phone } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import {
  ContainerizedCargoIcon,
  FreightForwardingIcon,
  ProjectMaritimeIcon,
  OverDimensionalCargoIcon,
  CustomsBrokerageIcon,
  IndustrialWarehousingIcon,
  FTWZSolutionsHubIcon,
} from '@/components/icons/ServiceLogisticsIcons';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'Logistics Services in Chennai | Sea, Air, Customs, ODC | KPS',
  description: 'Logistics services in Chennai: sea and air freight, customs clearance, project cargo, ODC and warehousing under one team. Get a quote.',
  alternates: { canonical: 'https://kpsgroups.net/logistics-services-chennai' },
};

// `about: { '@id': 'https://kpsgroups.net/#org' }` intentionally omitted: no Organization entity
// with that @id is defined anywhere on the site yet. Add it back once the Organization schema exists.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Logistics Services in Chennai',
      url: 'https://kpsgroups.net/logistics-services-chennai',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Sea Freight and Container Shipping', url: 'https://kpsgroups.net/services/containerized-cargo' },
          { '@type': 'ListItem', position: 2, name: 'Freight Forwarding', url: 'https://kpsgroups.net/services/freight-forwarding' },
          { '@type': 'ListItem', position: 3, name: 'Customs Clearance', url: 'https://kpsgroups.net/services/customs-brokerage' },
          { '@type': 'ListItem', position: 4, name: 'Project Cargo and Break Bulk', url: 'https://kpsgroups.net/services/project-logistics' },
          { '@type': 'ListItem', position: 5, name: 'Over Dimensional Cargo', url: 'https://kpsgroups.net/services/odc' },
          { '@type': 'ListItem', position: 6, name: 'Industrial Warehousing', url: 'https://kpsgroups.net/services/warehousing' },
          { '@type': 'ListItem', position: 7, name: 'FTWZ Solutions', url: 'https://kpsgroups.net/services/ftwz' },
        ],
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Logistics Services in Chennai', item: 'https://kpsgroups.net/logistics-services-chennai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What logistics services in Chennai does KPS offer?', acceptedAnswer: { '@type': 'Answer', text: 'We offer sea freight (FCL and LCL), freight forwarding, customs clearance, project cargo, over dimensional cargo, industrial warehousing and FTWZ solutions.' } },
        { '@type': 'Question', name: 'Can I book just one service?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can book a single service, such as customs clearance, or combine several on one shipment.' } },
        { '@type': 'Question', name: 'Do you handle heavy or oversized cargo?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Our project cargo and ODC teams plan the route, equipment and port handling before the cargo moves.' } },
        { '@type': 'Question', name: 'How do I get a quote?', acceptedAnswer: { '@type': 'Answer', text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, destination and target date, and we will reply with a plan and a quote.' } },
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
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const iconClass = 'w-8 h-8 sm:w-9 sm:h-9';

const services: { title: string; icon: ReactNode; body: ReactNode }[] = [
  {
    title: 'Sea Freight and Container Shipping',
    icon: <ContainerizedCargoIcon className={iconClass} />,
    body: (
      <>
        We ship full container load (FCL) and less than container load (LCL) cargo, with open top, flat rack and reefer options for cargo that does not suit a standard box. Port handling, documentation and inland delivery are coordinated by one team. Read about our{' '}
        <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link> or{' '}
        <Link href="/fcl-shipping-chennai" className={linkClass}>FCL shipping from Chennai</Link>.
      </>
    ),
  },
  {
    title: 'Freight Forwarding',
    icon: <FreightForwardingIcon className={iconClass} />,
    body: (
      <>
        We combine sea, air and road transport into a single plan, with documentation, customs coordination and shipment tracking included. We help you choose between speed and cost, and we manage every handover between modes so your cargo keeps moving. See our{' '}
        <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding service</Link>.
      </>
    ),
  },
  {
    title: 'Customs Clearance',
    icon: <CustomsBrokerageIcon className={iconClass} />,
    body: (
      <>
        As a licensed customs broker, our team handles import and export clearance, ICEGATE filing, HS classification and duty guidance. Because customs work sits next to freight operations, documents and cargo stay in step and fewer shipments are held up at the port. See our{' '}
        <Link href="/services/customs-brokerage" className={linkClass}>customs clearance services</Link>.
      </>
    ),
  },
  {
    title: 'Project Cargo and Break Bulk',
    icon: <ProjectMaritimeIcon className={iconClass} />,
    body: (
      <>
        For heavy, high-value or non-containerized cargo, we plan the full movement in advance: break bulk shipping, RoRo, port handling, lashing supervision and heavy haulage to site. This service suits energy, infrastructure, mining and automotive projects. See our{' '}
        <Link href="/services/project-logistics" className={linkClass}>project cargo logistics service</Link>.
      </>
    ),
  },
  {
    title: 'Over Dimensional Cargo (ODC)',
    icon: <OverDimensionalCargoIcon className={iconClass} />,
    body: (
      <>
        Oversized and heavy units that exceed standard road or container dimensions need route planning, the right trailers and careful coordination. We plan the route and equipment before the cargo moves, including Mafi trailers for static units. See our{' '}
        <Link href="/services/odc" className={linkClass}>over dimensional cargo service</Link>.
      </>
    ),
  },
  {
    title: 'Industrial Warehousing',
    icon: <IndustrialWarehousingIcon className={iconClass} />,
    body: (
      <>
        We provide storage, inventory handling and distribution for industrial cargo, so goods can wait safely between arrival and onward delivery. It works well alongside freight and customs when your cargo does not move straight to the end user. See our{' '}
        <Link href="/services/warehousing" className={linkClass}>warehousing service</Link>.
      </>
    ),
  },
  {
    title: 'FTWZ Solutions',
    icon: <FTWZSolutionsHubIcon className={iconClass} />,
    body: (
      <>
        Free Trade Warehousing Zone (FTWZ) facilities let eligible businesses store and distribute imported goods with duty-efficient handling. We help you decide whether FTWZ suits your cargo and manage the movements in and out. See our{' '}
        <Link href="/services/ftwz" className={linkClass}>FTWZ solutions</Link>.
      </>
    ),
  },
];

const serviceGuide = [
  { need: 'A full container of goods to export or import', service: 'FCL sea freight.' },
  { need: 'A smaller shipment that does not fill a container', service: 'LCL sea freight.' },
  { need: 'Urgent or time-sensitive cargo', service: 'air freight through freight forwarding.' },
  { need: 'Machinery, turbines or other heavy or oversized equipment', service: 'project cargo or ODC.' },
  { need: 'New to importing, or cargo waiting at the port', service: 'customs clearance.' },
  { need: 'Goods that need storage before distribution', service: 'warehousing or FTWZ.' },
];

const steps = [
  'Contact us with your cargo type, weight or volume, origin, destination and target date.',
  'We review the details, suggest the right services and send a written quote.',
  'We handle booking, documentation, customs clearance and transport.',
  'You receive updates until delivery.',
];

export default function LogisticsServicesChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="Logistics Services in Chennai: Freight, Customs, Project Cargo and Warehousing" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Logistics Services in Chennai</span>
          </nav>

          <div className="max-w-6xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <p className="max-w-4xl mx-auto text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
              KPS Worldwide Logistics offers a complete range of logistics services in Chennai for importers, exporters, manufacturers and project teams. Since 1985, we have handled sea freight, air freight, customs clearance, over dimensional cargo and warehousing from our head office in Parrys, with one team coordinating each move. This page gives you an overview of every service, who it suits and how to choose between them.
            </p>

            {/* Services at a glance */}
            <section className="space-y-6">
              <h2 className={h2Class}>Our Logistics Services in Chennai at a Glance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {services.map((service, idx) => (
                  <div
                    key={service.title}
                    className={`rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs border-t-4 border-t-brand-yellow ${
                      idx === services.length - 1 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-brand-green-bg text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        {service.icon}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-brand-green-dark leading-snug">{service.title}</h3>
                    </div>
                    <p className={pClass}>{service.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#FAFDFB] border-t border-b border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            <section className="space-y-5">
              <h2 className={h2Class}>Which Service Do You Need?</h2>
              <p className={pClass}>Use this as a quick guide:</p>
              <ul className="rounded-2xl border border-brand-gray-muted bg-white divide-y divide-brand-gray-muted overflow-hidden">
                {serviceGuide.map((row) => (
                  <li key={row.need} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-1 sm:gap-6 px-5 py-4 text-[15px] sm:text-base">
                    <span className="text-brand-gray">{row.need}:</span>
                    <span className="font-bold text-brand-green-dark sm:text-right">{row.service}</span>
                  </li>
                ))}
              </ul>
              <p className={pClass}>
                Most clients combine two or more logistics services in Chennai on the same shipment, for example sea freight with customs clearance and inland transport. If you are not sure which fits, send us your cargo details and we will recommend a route and a plan.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Why Use One Provider</h2>
              <p className={pClass}>
                Splitting a shipment across several vendors means more handovers, more paperwork and more people to chase when something changes. When your logistics services in Chennai are planned by one team, documents match the cargo, deadlines are shared across departments and you have a single point of contact until delivery. KPS has more than 40 years of experience in Indian trade, and we plan heavy and specialist cargo before it moves, not after problems appear.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Industries We Serve</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-green">
                <p className={pClass}>
                  Our logistics services in Chennai support automotive, energy, infrastructure and mining projects, as well as manufacturers, importers and exporters who ship containerized and non-containerized cargo. Each sector has its own documentation, handling and timing needs, and we plan around them. Our offices in Bengaluru, Tuticorin, Visakhapatnam and Kochi extend that coverage across South India.
                </p>
              </div>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>How to Get Started</h2>
              <p className={pClass}>Getting started with our logistics services in Chennai takes four steps:</p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {steps.map((step, idx) => (
                  <li key={step} className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-white p-5">
                    <span className="w-9 h-9 rounded-full bg-brand-green text-brand-yellow font-extrabold text-sm flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-[15px] text-brand-gray leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto space-y-5">
            <h2 className={h2Class}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem question="What logistics services in Chennai does KPS offer?" defaultOpen>
                We offer sea freight (FCL and LCL), freight forwarding, customs clearance, project cargo, over dimensional cargo, industrial warehousing and FTWZ solutions.
              </FaqItem>
              <FaqItem question="Can I book just one service?">
                Yes. You can book a single service, such as customs clearance, or combine several on one shipment.
              </FaqItem>
              <FaqItem question="Do you handle heavy or oversized cargo?">
                Yes. Our project cargo and ODC teams plan the route, equipment and port handling before the cargo moves.
              </FaqItem>
              <FaqItem question="How do I get a quote?">
                Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo details, destination and target date, and we will reply with a plan and a quote.
              </FaqItem>
            </div>
          </div>
        </div>
      </section>

      {/* Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote for Logistics Services in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                If you are comparing logistics services in Chennai, tell us what you are shipping and where it needs to go, and we will build a plan around it.{' '}
                <Link href="/quote" className={ctaLinkClass}>Request a quote</Link> or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>044 4508 8099</a>.{' '}
                <Link href="/about-us" className={ctaLinkClass}>Learn more about KPS</Link> and our work as a logistics provider based in Chennai since 1985.
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
