import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronRight, Home, Phone } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar.

export const metadata: Metadata = {
  title: 'FCL Shipping from Chennai | Full Container Load | KPS',
  description: 'FCL shipping from Chennai with 20ft and 40ft containers, customs clearance and port handling. 40+ years of experience. Get a quote today.',
  alternates: { canonical: 'https://kpsgroups.net/fcl-shipping-chennai' },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'FCL Shipping from Chennai',
      serviceType: 'Full container load (FCL) shipping',
      url: 'https://kpsgroups.net/fcl-shipping-chennai',
      provider: { '@id': 'https://kpsgroups.net/#org' },
      areaServed: [{ '@type': 'City', name: 'Chennai' }, { '@type': 'Country', name: 'India' }],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'FCL Shipping from Chennai', item: 'https://kpsgroups.net/fcl-shipping-chennai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is FCL shipping from Chennai?', acceptedAnswer: { '@type': 'Answer', text: 'It means booking a whole container for your cargo at a Chennai-area port, instead of sharing space with other shippers. The container is loaded and sealed at your premises or a container freight station, and moves to the destination port as a single unit.' } },
        { '@type': 'Question', name: 'How do I choose between FCL and LCL?', acceptedAnswer: { '@type': 'Answer', text: 'Compare your cargo volume and risk tolerance. Larger, fragile or high-value shipments usually suit FCL, while smaller consignments often cost less as LCL. We can quote both.' } },
        { '@type': 'Question', name: 'Can you ship cargo that does not fit a standard container?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. We arrange open top and flat rack containers, and for very heavy or oversized cargo our project team plans break bulk or RoRo moves.' } },
        { '@type': 'Question', name: 'How do I get a quote?', acceptedAnswer: { '@type': 'Answer', text: 'Call 044 4508 8099, message us on WhatsApp at +91 98843 88099, or use the quote form with your cargo details, destination and target date.' } },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80';

const linkClass = 'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';

const processSteps = [
  { title: 'Enquiry and quote', text: 'share the cargo type, weight, volume, destination port and target date. We review the details and send a clear quote.' },
  { title: 'Booking', text: 'we book space with the carrier and arrange the release of an empty container.' },
  { title: 'Loading and sealing', text: 'the container is delivered to your premises or a container freight station, where the cargo is loaded, secured and sealed.' },
  { title: 'Documentation and customs', text: 'we prepare the shipping documents and handle export clearance through our customs brokerage team.' },
  { title: 'Port handling and loading', text: 'the container moves to the port, is gated in and is loaded onto the vessel.' },
  { title: 'Bill of lading and tracking', text: 'we arrange the bill of lading and keep you updated until the cargo reaches its destination.' },
];

const reasons = [
  { title: 'Experience since 1985', text: 'more than four decades in Indian trade.' },
  { title: 'One team', text: 'booking, customs, transport and documentation are coordinated together.' },
  { title: 'Specialist equipment', text: 'open top, flat rack and reefer options, plus project cargo support for heavy lifts.' },
  { title: 'Clear communication', text: 'a single point of contact for FCL shipping from Chennai, with status updates until delivery.' },
];

export default function FclShippingChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero title="FCL Shipping from Chennai: Your Own Container, Planned End to End" bgImage={bgImage} />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail (mirrors BreadcrumbList schema) */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">FCL Shipping from Chennai</span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction */}
            <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
              KPS Worldwide Logistics arranges FCL shipping from Chennai for exporters, manufacturers and importers who want a full container for their own cargo. With full container load (FCL), no one else’s goods share your container, so there is less handling, a lower risk of damage and a sealed box from your loading point to the destination port. We have been moving cargo since 1985, and our team manages the booking, documentation, customs clearance and port handling, so you deal with one accountable team. Whether you ship a single container or a regular programme, we plan each move around your cargo and your delivery date.
            </p>

            <section className="space-y-4">
              <h2 className={h2Class}>What Is FCL Shipping?</h2>
              <p className={pClass}>
                FCL stands for full container load. You book an entire 20 ft or 40 ft container, load it at your factory or warehouse, and it is sealed and moves to the port without being opened or shared with other shippers. You pay for the container whether it is completely full or not, which makes FCL the natural choice when your cargo fills most of a container, when it is fragile or high in value, or when you want a predictable schedule.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>When to Choose FCL Shipping from Chennai</h2>
              <p className={pClass}>
                As a rough guide, FCL starts to make sense once a shipment reaches around 15 cubic metres, though the break-even point depends on current rates and the type of cargo. Many businesses choose FCL shipping from Chennai for machinery, automotive components, electronics, textiles, engineering goods and packaged industrial products. FCL is also the better option when cargo should not be mixed with other goods, when you want control over loading and sealing, or when your buyer requires a dedicated container.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Container Types We Arrange</h2>
              <p className={pClass}>
                Different cargo needs different equipment. Through KPS you can book standard 20 ft and 40 ft containers, open top containers for tall cargo loaded from above, flat racks for heavy or oversized pieces, and reefer containers for temperature-controlled goods. If your cargo is too large or heavy for a standard box, our team can plan break bulk or RoRo movements instead. See our{' '}
                <Link href="/services/project-logistics" className={linkClass}>project cargo logistics service</Link> for details.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>How FCL Shipping from Chennai Works</h2>
              <p className={pClass}>Our process is simple and transparent:</p>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processSteps.map((step, idx) => (
                  <li key={step.title} className="flex gap-4 rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-5">
                    <span className="w-9 h-9 rounded-full bg-brand-green text-brand-yellow font-extrabold text-sm flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <p className="text-sm sm:text-[15px] text-brand-gray leading-relaxed">
                      <span className="font-bold text-brand-green-dark">{step.title}:</span>{' '}
                      {step.title === 'Documentation and customs' ? (
                        <>
                          we prepare the shipping documents and handle export clearance through our{' '}
                          <Link href="/services/customs-brokerage" className={linkClass}>customs brokerage team</Link>.
                        </>
                      ) : (
                        step.text
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Documents You Will Need</h2>
              <p className={pClass}>
                For export, the usual documents are the commercial invoice, packing list, shipping bill and bill of lading, along with your Importer Exporter Code (IEC). Some cargo also needs a certificate of origin, a quality or phytosanitary certificate, or a specific permit. For imports, we prepare the bill of entry and handle clearance through our{' '}
                <Link href="/services/customs-brokerage" className={linkClass}>customs clearance team</Link>. Tell us what you are shipping and we will confirm the exact list before the cargo moves.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>Ports and Coverage</h2>
              <p className={pClass}>
                We arrange shipments through the ports serving Chennai, and our offices in Bengaluru, Tuticorin, Visakhapatnam and Kochi help us move cargo from across South India. This network lets us offer FCL shipping from Chennai as well as from other South Indian ports when your cargo, schedule or cost makes that the better route.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>What Affects the Cost of FCL Shipping from Chennai</h2>
              <p className={pClass}>
                There is no single price, because several factors apply: container size and type, destination port, shipping line and season, cargo weight, port and terminal charges, customs and documentation, inland transport to the port, and optional cargo insurance. We give you a written quote that shows what is included, so there are fewer surprises later.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className={h2Class}>FCL or LCL: Which Is Better?</h2>
              <p className={pClass}>
                If your cargo does not fill a container, less than container load (LCL) lets you share space and pay for the volume you use. The trade-off is more handling and a consolidation schedule that depends on other shippers’ cargo. FCL costs more in total but gives you exclusive use, simpler handling and a lower risk of damage. Not sure which suits you? Send us your cargo details and we will compare both options. Read more about our{' '}
                <Link href="/services/containerized-cargo" className={linkClass}>sea freight services</Link> and{' '}
                <Link href="/services/freight-forwarding" className={linkClass}>freight forwarding</Link>.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className={h2Class}>Why Ship with KPS</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reasons.map((reason) => (
                  <li key={reason.title} className="rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs border-t-4 border-t-brand-yellow">
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
                <FaqItem question="What is FCL shipping from Chennai?" defaultOpen>
                  It means booking a whole container for your cargo at a Chennai-area port, instead of sharing space with other shippers. The container is loaded and sealed at your premises or a container freight station, and moves to the destination port as a single unit.
                </FaqItem>
                <FaqItem question="How do I choose between FCL and LCL?">
                  Compare your cargo volume and risk tolerance. Larger, fragile or high-value shipments usually suit FCL, while smaller consignments often cost less as LCL. We can quote both.
                </FaqItem>
                <FaqItem question="Can you ship cargo that does not fit a standard container?">
                  Yes. We arrange open top and flat rack containers, and for very heavy or oversized cargo our project team plans break bulk or RoRo moves.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message us on WhatsApp at{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a>, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link> with your cargo details, destination and target date.
                </FaqItem>
              </div>
            </section>
          </article>
        </div>
      </section>

      {/* Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">Request a Quote</h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Planning FCL shipping from Chennai? Tell us what you are shipping, where it is going and when it needs to arrive, and we will build the plan.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/quote"
                  className="group inline-flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFD54F] active:bg-[#e0a800] text-[#073B2C] font-extrabold px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all text-sm"
                >
                  <span>Request a quote</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </Link>
                <span className="text-sm text-gray-200">or call</span>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 bg-[#073B2C]/50 hover:bg-[#ffc107] hover:text-[#073B2C] border border-[#FFC107]/40 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>044 4508 8099</span>
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
        <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-gray-light text-brand-gray group-open:bg-brand-green group-open:text-brand-yellow group-open:rotate-180 transition-transform">
          <ChevronDown className="w-4 h-4" />
        </span>
      </summary>
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="text-[13.5px] sm:text-[15px] text-brand-gray-dark leading-relaxed">{children}</p>
      </div>
    </details>
  );
}
