import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown, MessageCircle, Phone, Plane, Ship } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import ServiceSidebar from '@/components/services/ServiceSidebar';

export const metadata: Metadata = {
  title: 'Freight Forwarder in Chennai | International Sea & Air | KPS',
  description: 'International freight forwarding in Chennai by sea, air and road, with customs clearance and tracking, for exporters and importers since 1985. Get a quote.',
  alternates: { canonical: 'https://kpsgroups.net/services/freight-forwarding' },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'International Freight Forwarding in Chennai',
      serviceType: 'International freight forwarding',
      url: 'https://kpsgroups.net/services/freight-forwarding',
      provider: { '@id': 'https://kpsgroups.net/#org' },
      areaServed: [{ '@type': 'City', name: 'Chennai' }, { '@type': 'Country', name: 'India' }],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://kpsgroups.net/services' },
        { '@type': 'ListItem', position: 3, name: 'Freight Forwarding', item: 'https://kpsgroups.net/services/freight-forwarding' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What does international freight forwarding in Chennai include?', acceptedAnswer: { '@type': 'Answer', text: 'It includes booking cargo space with carriers, preparing shipping documents, export or import clearance, inland transport to the port or airport and shipment tracking until delivery.' } },
        { '@type': 'Question', name: 'How is a freight forwarder different from a shipping line?', acceptedAnswer: { '@type': 'Answer', text: 'A shipping line owns and operates the vessels. A freight forwarder arranges the whole journey on your behalf, including booking space, documents, customs and transport.' } },
        { '@type': 'Question', name: 'Can you handle both imports and exports?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We arrange freight and clearance for both import and export consignments, by sea or air.' } },
        { '@type': 'Question', name: 'How do I get a quote?', acceptedAnswer: { '@type': 'Answer', text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo details, origin, destination and target date, and we will reply with a plan and a quote.' } },
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
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-yellow space-y-2.5';

const processSteps = [
  { title: 'Enquiry and quote', text: 'share the cargo details, origin, destination and target date, and we send a written quote.' },
  { title: 'Mode and route', text: 'we recommend sea, air or a combination based on cost, speed and risk.' },
  { title: 'Booking and pickup', text: 'we book space with the carrier and collect the cargo from your premises.' },
  { title: 'Customs and documentation', text: 'we prepare the paperwork and handle clearance.' },
  { title: 'Transit and tracking', text: 'you receive updates as the cargo moves.' },
  { title: 'Destination handover', text: 'the cargo is delivered or handed to your consignee or agent, and we close out the paperwork.' },
];

const reasons = [
  { title: 'Experience since 1985', text: 'more than four decades in Indian trade.' },
  { title: 'One team', text: 'freight, customs, transport and documentation are coordinated together.' },
  { title: 'Specialist capability', text: 'project cargo, break bulk, RoRo and ODC alongside standard containers.' },
  { title: 'Regional network', text: 'offices in Chennai, Bengaluru, Tuticorin, Visakhapatnam and Kochi.' },
  { title: 'Clear communication', text: 'a single point of contact and regular updates until delivery.' },
];

export default function FreightForwardingPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="International Freight Forwarding in Chennai: Sea, Air and Road" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-brand-gray mb-8">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">Services</Link>
            <span>/</span>
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">Freight Forwarding</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left Sidebar (existing service directory + consultation card) */}
            <aside className="lg:col-span-4">
              <ServiceSidebar currentPath="/services/freight-forwarding" bgImage={bgImage} />
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-8 min-w-0 space-y-12">
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                KPS Worldwide Logistics provides international freight forwarding in Chennai for exporters, importers and manufacturers who need cargo moved reliably across borders. As a freight forwarding company in Chennai since 1985, we plan the full journey: booking space with carriers, preparing documents, clearing customs, arranging transport to and from the port or airport, and tracking the shipment until it reaches your buyer or your warehouse. You deal with one accountable team instead of coordinating shipping lines, airlines, truckers and customs agents yourself.
              </p>

              <section className="space-y-4">
                <h2 className={h2Class}>What Is International Freight Forwarding?</h2>
                <p className={pClass}>
                  A freight forwarder organises the movement of goods between countries on your behalf. It usually does not own the ships or aircraft. Instead, it books space with carriers, chooses the route and mode, handles the paperwork and coordinates every handover along the way. Businesses that use international freight forwarding in Chennai save time on bookings and documentation, avoid common customs mistakes and get a single point of contact when schedules change.
                </p>
              </section>

              <section className="space-y-5">
                <h2 className={h2Class}>International Freight Forwarding in Chennai: What We Handle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={cardClass}>
                    <h3 className={h3Class}>Sea Freight</h3>
                    <p className={pClass}>
                      We arrange full container load (FCL) and less than container load (LCL) shipping, which suits larger, heavier or cost-sensitive cargo. Our team handles container bookings, port handling and documentation, with open top, flat rack and reefer options for cargo that does not fit a standard box. See our{' '}
                      <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link> and{' '}
                      <Link href="/fcl-shipping-chennai" className={linkClass}>FCL shipping from Chennai</Link>.
                    </p>
                  </div>
                  <div className={cardClass}>
                    <h3 className={h3Class}>Air Freight</h3>
                    <p className={pClass}>
                      For urgent, high-value or time-sensitive cargo, we book air freight and coordinate pickup, airport handling and customs. Air is the right choice when speed matters more than cost per kilogram, and we will tell you honestly when sea freight is the better fit.
                    </p>
                  </div>
                  <div className={cardClass}>
                    <h3 className={h3Class}>Inland Transportation</h3>
                    <p className={pClass}>
                      We arrange first-mile pickup from your plant, container trucking between ports and warehouses, and last-mile delivery by road to the final site, so cargo keeps moving between modes.
                    </p>
                  </div>
                  <div className={cardClass}>
                    <h3 className={h3Class}>Customs Clearance</h3>
                    <p className={pClass}>
                      Export and import clearance is handled by our customs team, including ICEGATE filing and HS classification, so documents and cargo move together. As a licensed customs broker, we help avoid delays at the port. See our{' '}
                      <Link href="/services/customs-brokerage" className={linkClass}>customs clearance services</Link>.
                    </p>
                  </div>
                  <div className={cardClass}>
                    <h3 className={h3Class}>Project and Heavy Cargo</h3>
                    <p className={pClass}>
                      When cargo is too large or heavy for a standard container, we plan break bulk, RoRo or over dimensional movements as part of the same shipment. See our{' '}
                      <Link href="/services/project-logistics" className={linkClass}>project cargo logistics</Link>.
                    </p>
                  </div>
                  <div className={cardClass}>
                    <h3 className={h3Class}>Tracking and Documentation</h3>
                    <p className={pClass}>
                      You receive booking confirmations, bills of lading or air waybills, invoices and status updates, with a named contact for questions.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <h2 className={h2Class}>How It Works</h2>
                <p className={pClass}>Here is how international freight forwarding in Chennai works with KPS:</p>
                <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processSteps.map((step, idx) => (
                    <li key={step.title} className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5">
                      <span className="w-9 h-9 rounded-full bg-brand-green text-brand-yellow font-extrabold text-sm flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        {idx + 1}
                      </span>
                      <p className="text-sm sm:text-[15px] text-brand-gray leading-relaxed">
                        <span className="font-bold text-brand-green-dark">{step.title}:</span> {step.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="space-y-4">
                <h2 className={h2Class}>Documents You Will Need</h2>
                <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5 sm:p-6">
                  <p className={pClass}>
                    The paperwork for international freight forwarding in Chennai depends on your cargo and destination, but most export shipments need a commercial invoice, packing list, shipping bill and either a bill of lading (sea) or an air waybill (air), along with your Importer Exporter Code (IEC). Some cargo also needs a certificate of origin, quality or phytosanitary certificates, or special permits. We confirm the exact list before the cargo moves.
                  </p>
                </div>
              </section>

              <section className="space-y-5">
                <h2 className={h2Class}>Sea Freight or Air Freight?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs">
                    <span className="w-10 h-10 rounded-xl bg-brand-green-bg text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Ship className="w-5 h-5" />
                    </span>
                    <p className={pClass}>Choose sea freight for heavy, bulky or cost-sensitive cargo where a longer transit time is acceptable.</p>
                  </div>
                  <div className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs">
                    <span className="w-10 h-10 rounded-xl bg-brand-green-bg text-brand-green flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Plane className="w-5 h-5" />
                    </span>
                    <p className={pClass}>Choose air freight for urgent, high-value, perishable or lightweight goods.</p>
                  </div>
                </div>
                <p className={pClass}>
                  Many shippers combine the two, for example air for samples and sea for the bulk order. When you ask us about international freight forwarding in Chennai, we compare both options for your cargo and recommend the one that balances cost, speed and risk.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className={h2Class}>Cargo and Industries We Handle</h2>
                <p className={pClass}>
                  We move general cargo, engineering goods, machinery, automotive components and project equipment for automotive, energy, infrastructure and mining clients, as well as manufacturers, importers and exporters. Each cargo type has its own handling and documentation needs, and we plan around them.
                </p>
              </section>

              <section className="space-y-5">
                <h2 className={h2Class}>Why Businesses Choose KPS</h2>
                <p className={pClass}>Here is why clients rely on KPS for international freight forwarding in Chennai:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reasons.map((reason) => (
                    <li key={reason.title} className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5">
                      <p className="text-sm sm:text-[15px] text-brand-gray leading-relaxed">
                        <span className="block text-base font-bold text-brand-green-dark mb-1">{reason.title}:</span>
                        {reason.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-5">
                <h2 className={h2Class}>Frequently Asked Questions</h2>
                <div className="space-y-3">
                  <FaqItem question="What does international freight forwarding in Chennai include?" defaultOpen>
                    It includes booking cargo space with carriers, preparing shipping documents, export or import clearance, inland transport to the port or airport and shipment tracking until delivery.
                  </FaqItem>
                  <FaqItem question="How is a freight forwarder different from a shipping line?">
                    A shipping line owns and operates the vessels. A freight forwarder arranges the whole journey on your behalf, including booking space, documents, customs and transport.
                  </FaqItem>
                  <FaqItem question="Can you handle both imports and exports?">
                    Yes. We arrange freight and clearance for both import and export consignments, by sea or air.
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

      {/* Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote for International Freight Forwarding in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you are shipping, where it is going and when it must arrive, and we will build the plan.{' '}
                <Link href="/quote" className={ctaLinkClass}>Request a quote</Link> or call{' '}
                <a href={PHONE_HREF} className={`${ctaLinkClass} whitespace-nowrap`}>044 4508 8099</a>. Explore our{' '}
                <Link href="/services" className={ctaLinkClass}>full range of logistics services</Link> or learn more about KPS as a{' '}
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
  children: React.ReactNode;
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
