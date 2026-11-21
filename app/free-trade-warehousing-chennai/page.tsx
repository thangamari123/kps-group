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
  Layers,
  ArrowUpRight,
  Warehouse,
  Boxes,
  TrendingUp,
  RotateCcw,
  PackageCheck,
  Globe2,
  FileCheck2,
} from 'lucide-react';
import PageHero from '@/components/common/PageHero';

// SEO landing page — reachable by direct URL and sitemap only; intentionally not linked from the Navbar or footer.

export const metadata: Metadata = {
  title: 'Free Trade Warehousing in Chennai | FTWZ vs Bonded | KPS',
  description:
    'Free trade warehousing in Chennai explained: duty deferral, FTWZ vs bonded warehouse, who benefits and how to start. Get a quote from KPS.',
  alternates: {
    canonical: 'https://kpsgroups.net/free-trade-warehousing-chennai',
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
      name: 'Free Trade Warehousing in Chennai',
      serviceType: 'Free Trade Warehousing Zone (FTWZ) warehousing',
      url: 'https://kpsgroups.net/free-trade-warehousing-chennai',
      areaServed: [
        { '@type': 'City', name: 'Chennai' },
        { '@type': 'Country', name: 'India' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kpsgroups.net/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Free Trade Warehousing in Chennai',
          item: 'https://kpsgroups.net/free-trade-warehousing-chennai',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is free trade warehousing?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It is warehousing inside a Free Trade Warehousing Zone, where imported goods can be stored without customs duty until they are released into the domestic market, or re-exported.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is free trade warehousing in Chennai the same as a bonded warehouse?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Both let you defer customs duty, but an FTWZ is a special category of SEZ set up for trading and re-export, and it allows value-added handling such as repacking and relabelling. A customs bonded warehouse is mainly for storing imported goods until duty is paid, and storage time limits apply. Which suits you depends on your goods and plans.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who can use a Free Trade Warehousing Zone?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Importers, traders and distributors can use one, subject to the approvals and terms of the facility. We confirm what applies to your business before you commit.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get a quote?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call 044 4508 8099, message +91 98843 88099 on WhatsApp, or use the quote form. Share your cargo type, volumes, origin and expected storage period, and we will reply with a plan and a quote.',
          },
        },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80';

const linkClass =
  'text-brand-green font-semibold underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green-light transition-colors';
const ctaLinkClass = 'font-bold text-[#FFC107] underline underline-offset-4 hover:text-[#FFD54F]';
const h2Class = 'text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight';
const pClass = 'text-[15px] sm:text-base text-brand-gray leading-relaxed';
const cardClass = 'rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs border-t-4 border-t-brand-yellow space-y-2.5';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Better Cash Flow',
    desc: 'Customs duty is paid when goods are released to the domestic market, not when the ship arrives at the port, preserving vital working capital.',
  },
  {
    icon: Boxes,
    title: 'Part Release on Demand',
    desc: 'You can release stock to the domestic market in partial consignments as your commercial sales or manufacturing orders require.',
  },
  {
    icon: RotateCcw,
    title: 'Duty-Free Re-Export',
    desc: 'Goods can be shipped on to other international countries without payment of Indian customs duties, subject to standard re-export procedures.',
  },
  {
    icon: PackageCheck,
    title: 'Value-Added Handling',
    desc: 'Repacking, relabelling, kitting, sorting, quality inspection, and consolidation can be carried out while goods remain duty-deferred.',
  },
  {
    icon: Globe2,
    title: 'Strategic Regional Hub',
    desc: 'Establish a cost-efficient Indian distribution base for supplying neighbouring South Asian, Middle Eastern, and Southeast Asian markets.',
  },
];

const whoItSuits = [
  {
    title: 'Importers with Phased or Uncertain Demand',
    desc: 'Businesses holding inventory where domestic demand or consumption timing fluctuates, avoiding upfront duty lock-ins.',
  },
  {
    title: 'Regional Cross-Border Distributors',
    desc: 'International trading houses and distributors supplying other Asian and Middle Eastern countries from a centralized Indian transit hub.',
  },
  {
    title: 'High-Value & Capital-Intensive Importers',
    desc: 'Companies importing expensive components, industrial machinery, or slow-moving raw materials that would otherwise tie up substantial duty cash.',
  },
  {
    title: 'Traders Needing Packaging & Localisation',
    desc: 'Businesses that need to inspect, sort, repack, relabel, or kit products to meet Indian market requirements before domestic commercial release.',
  },
];

const workflowSteps = [
  {
    step: '1',
    title: 'Fit Check',
    desc: 'Share what you import, the expected cargo volumes, storage duration, and how quickly your stock sells in the domestic or export market.',
  },
  {
    step: '2',
    title: 'Freight and Customs',
    desc: 'We arrange ocean or air freight into Chennai and file the requisite customs and SEZ documentation for zone transfer.',
  },
  {
    step: '3',
    title: 'Move to the Zone',
    desc: 'Cargo transfers securely from Chennai Port or Airport terminals directly into the FTWZ facility under customs supervision.',
  },
  {
    step: '4',
    title: 'Storage and Handling',
    desc: 'Goods are placed in specialized covered or temperature-controlled storage, and any required repacking, relabelling, or kitting is performed.',
  },
  {
    step: '5',
    title: 'Release or Re-Export',
    desc: 'Goods are released to the domestic market in parts with duties paid then, or re-exported overseas without Indian customs duty.',
  },
  {
    step: '6',
    title: 'Records & Compliance',
    desc: 'Detailed inventory records and customs filings are kept fully aligned for statutory SEZ audits and your corporate accounts.',
  },
];

const comparisonData = [
  {
    feature: 'Customs Duty',
    regular: 'Paid upfront when goods clear at the port',
    bonded: 'Deferred until goods are cleared for domestic use',
    ftwz: 'Deferred until goods are released to the domestic market (or tax-exempt on re-export)',
  },
  {
    feature: 'Storage Time',
    regular: 'No customs limit (commercial lease terms)',
    bonded: 'Statutory time limits apply (typically 1 year, extendable with approval)',
    ftwz: 'Flexible multi-year storage aligned with the approved operating unit’s validity',
  },
  {
    feature: 'Value-Added Work',
    regular: 'Allowed freely, but on duty-paid goods',
    bonded: 'Very limited (basic preservation & inspection only, unless under MOOWR license)',
    ftwz: 'Repacking, relabelling, kitting, sorting, assembly and consolidation permitted in-zone',
  },
  {
    feature: 'Best Suited For',
    regular: 'Goods ready for immediate domestic distribution',
    bonded: 'Simple duty deferral for raw materials or capital equipment for domestic production',
    ftwz: 'International trading, re-export, regional hubbing, and flexible phased domestic release',
  },
];

const costFactors = [
  'Space or pallet positions occupied (floor vs. racked pallet positions)',
  'Storage duration and turnover frequency',
  'Cargo characteristics, weight, and specialized storage requirements (e.g. temperature control)',
  'Inbound handling, dock de-stuffing, and outbound dispatch operations',
  'Value-added activities (repacking, labeling, kitting, shrink-wrapping, quality checks)',
  'Customs documentation, SEZ portal filings, and Bill of Entry processing',
  'Bonded transportation between Chennai port/airport terminals and the FTWZ facility',
];

export default function FreeTradeWarehousingChennaiPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero
        title="Free Trade Warehousing in Chennai: How It Works and Who It Suits"
        bgImage={bgImage}
      />

      <section className="py-12 md:py-16 text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brand-gray mb-8 overflow-x-auto">
            <Link href="/" className="hover:text-brand-green flex items-center gap-1 flex-shrink-0 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gray-muted flex-shrink-0" />
            <span className="text-brand-green-dark font-bold truncate" aria-current="page">
              Free Trade Warehousing in Chennai
            </span>
          </nav>

          <article className="max-w-4xl mx-auto space-y-12 md:space-y-14">
            {/* Introduction Lead */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed border-l-4 border-brand-yellow pl-4 sm:pl-6">
                KPS Worldwide Logistics helps importers, traders and distributors access and use free trade warehousing in Chennai to hold imported goods without paying customs duty until the goods are released to the domestic market. Working with premier authorized FTWZ infrastructure in the Chennai trade corridor, our team manages the end-to-end customs documentation, bonded transportation, and authorized value-added handling. This page explains what free trade warehousing is, who benefits, how it works and how it compares with a bonded warehouse, so you can judge whether it fits your business. For details of the service KPS offers, see our{' '}
                <Link href="/services/ftwz" className={linkClass}>
                  FTWZ warehousing services
                </Link>.
              </p>

              {/* Quick Action Bar */}
              <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                    <Warehouse className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-brand-green-dark">Evaluating FTWZ Storage in Chennai?</h3>
                    <p className="text-xs sm:text-sm text-brand-gray">Get an honest assessment of your duty deferral and space requirements.</p>
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

            {/* Section 1: What Is Free Trade Warehousing in Chennai? */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Is Free Trade Warehousing in Chennai?</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 shadow-xs space-y-3">
                <p className={pClass}>
                  Free trade warehousing takes place in a Free Trade Warehousing Zone (FTWZ), a special category of Special Economic Zone created for warehousing, trading and re-export, not manufacturing, under the SEZ Act, 2005.
                </p>
                <p className={pClass}>
                  Under Indian customs and SEZ regulations, an FTWZ is treated as a deemed foreign territory for tariff and customs purposes. Goods that enter the zone from overseas are not charged customs duty at that point. Duty and applicable statutory taxes become payable only when goods are cleared and released into the domestic market (Domestic Tariff Area or DTA), while goods that are re-exported to other countries leave without payment of Indian basic customs duty, subject to standard SEZ export documentation and procedures.
                </p>
              </div>
            </section>

            {/* Section 2: Benefits of Free Trade Warehousing */}
            <section className="space-y-5">
              <h2 className={h2Class}>Benefits of Free Trade Warehousing</h2>
              <p className={pClass}>
                Free trade warehousing in Chennai helps importers, traders, and multinational corporations manage cash flow and optimize supply chain agility:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((item, idx) => {
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
              <div className="rounded-2xl border border-brand-gray-muted bg-brand-gray-light p-4 sm:p-5 border-l-4 border-l-brand-green">
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                  <strong>Tax & Regulatory Advisory:</strong> Tax treatment, including GST applicability, reverse charge mechanisms, and corporate tax implications, depends on the exact corporate transaction structure and whether sales take place on high seas, in-zone, or into the DTA. Always confirm your specific tax position with your qualified professional tax adviser.
                </p>
              </div>
            </section>

            {/* Section 3: Who Free Trade Warehousing in Chennai Suits */}
            <section className="space-y-5">
              <h2 className={h2Class}>Who Free Trade Warehousing in Chennai Suits</h2>
              <p className={pClass}>
                Free trade warehousing in Chennai is most useful for businesses with strategic storage and international distribution requirements:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whoItSuits.map((group, idx) => (
                  <div key={idx} className="rounded-2xl border border-brand-gray-muted bg-white p-5 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-brand-green-dark">
                      <Building2 className="w-4 h-4 text-brand-green shrink-0" />
                      <h3 className="font-bold text-sm sm:text-base">{group.title}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">{group.desc}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] p-4 sm:p-5 text-brand-gray-dark space-y-2">
                <p className={pClass}>
                  It adds little if your goods move straight from the port to the customer or if your production cycles run on immediate clearance. We review your cargo, volumes and sales pattern and tell you honestly whether an FTWZ setup genuinely saves you money and time.
                </p>
              </div>
            </section>

            {/* Section 4: How Free Trade Warehousing in Chennai Works */}
            <section className="space-y-5">
              <h2 className={h2Class}>How Free Trade Warehousing in Chennai Works</h2>
              <p className={pClass}>
                Operating inside an FTWZ follows a clearly regulated customs workflow:
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

            {/* Section 5: FTWZ, Bonded Warehouse or Regular Warehouse? */}
            <section className="space-y-5">
              <h2 className={h2Class}>FTWZ, Bonded Warehouse or Regular Warehouse?</h2>
              <p className={pClass}>
                All three formats can hold imported cargo, but they treat customs duty, regulatory time limits, and value-added handling very differently. This is a general operational comparison; confirm specific licensing and approvals with a customs adviser:
              </p>

              {/* Responsive Comparison Table */}
              <div className="rounded-2xl border border-brand-gray-muted bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="bg-brand-gray-light border-b border-brand-gray-muted text-xs uppercase tracking-wider text-brand-green-dark">
                        <th className="py-3.5 px-4 font-extrabold w-1/4">Feature</th>
                        <th className="py-3.5 px-4 font-bold w-1/4">Regular Warehouse</th>
                        <th className="py-3.5 px-4 font-bold w-1/4">Customs Bonded Warehouse</th>
                        <th className="py-3.5 px-4 font-bold w-1/4 bg-brand-green/5 text-brand-green font-extrabold">
                          FTWZ (Free Trade Zone)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gray-muted text-xs sm:text-sm">
                      {comparisonData.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-brand-gray-light/40'}>
                          <td className="py-3 px-4 font-bold text-brand-green-dark align-top">{row.feature}</td>
                          <td className="py-3 px-4 text-brand-gray align-top leading-relaxed">{row.regular}</td>
                          <td className="py-3 px-4 text-brand-gray align-top leading-relaxed">{row.bonded}</td>
                          <td className="py-3 px-4 text-brand-gray-dark font-medium align-top leading-relaxed bg-brand-green/5">
                            {row.ftwz}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 6: What Affects the Cost */}
            <section className="space-y-5">
              <h2 className={h2Class}>What Affects the Cost</h2>
              <p className={pClass}>
                The cost of free trade warehousing in Chennai depends on several operational variables:
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
                  We provide a clear, itemized quote showing what is included, so you can compare operational storage costs directly against the duty you defer and evaluate regular storage options.
                </p>
              </div>
            </section>

            {/* Section 7: Warehousing with Freight, Customs and Transport */}
            <section className="space-y-5">
              <h2 className={h2Class}>Warehousing with Freight, Customs and Transport</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-[#fbfcfc] p-5 sm:p-6 space-y-4">
                <p className={pClass}>
                  Free trade warehousing works best when the inbound shipment, customs filings, and road transport are coordinated as one synchronized operation. KPS connects the entire chain:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/services/freight-forwarding"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Freight Forwarding
                      </h3>
                      <p className="text-xs text-brand-gray">Ocean & air carrier space bookings into Chennai</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>

                  <Link
                    href="/services/containerized-cargo"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Sea Freight Services
                      </h3>
                      <p className="text-xs text-brand-gray">FCL and LCL container shipping from global ports</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>

                  <Link
                    href="/import-customs-clearance-chennai"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Import Customs Clearance
                      </h3>
                      <p className="text-xs text-brand-gray">Bill of Entry filing and SEZ customs formalities</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>

                  <Link
                    href="/services/warehousing"
                    className="group rounded-xl border border-brand-gray-muted bg-white p-4 hover:border-brand-green transition-all shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-brand-green-dark group-hover:text-brand-green">
                        Industrial Warehousing
                      </h3>
                      <p className="text-xs text-brand-gray">Domestic storage and 3PL distribution facilities</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-brand-gray group-hover:text-brand-green transition-colors shrink-0" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Section 8: Why Choose KPS */}
            <section className="space-y-4">
              <h2 className={h2Class}>Why Choose KPS</h2>
              <div className="rounded-2xl border border-brand-gray-muted bg-white p-5 sm:p-6 border-l-4 border-l-brand-yellow shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-brand-green-dark">
                  <ShieldCheck className="w-5 h-5 text-brand-green shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Single-Point Responsibility Across Freight, Storage & Customs
                  </span>
                </div>
                <p className={pClass}>
                  Clients choose KPS for free trade warehousing in Chennai because freight, customs, transport and storage are coordinated by one team, backed by 40+ years of experience in Indian trade (since 1985). You deal with one named contact who understands the whole chain, from vessel discharge to domestic release or overseas re-export.
                </p>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                  Our regional offices in Tuticorin, Visakhapatnam, Kochi and Bengaluru support cargo moving through other South Indian trade corridors, giving you reliable logistics support across the region.
                </p>
              </div>
            </section>

            {/* Section 9: Frequently Asked Questions */}
            <section className="space-y-5">
              <h2 className={h2Class}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem question="What is free trade warehousing?" defaultOpen>
                  It is warehousing inside a Free Trade Warehousing Zone, where imported goods can be stored without customs duty until they are released into the domestic market, or re-exported.
                </FaqItem>
                <FaqItem question="Is free trade warehousing in Chennai the same as a bonded warehouse?">
                  No. Both let you defer customs duty, but an FTWZ is a special category of SEZ set up for trading and re-export, and it allows value-added handling such as repacking and relabelling. A customs bonded warehouse is mainly for storing imported goods until duty is paid, and storage time limits apply. Which suits you depends on your goods and plans.
                </FaqItem>
                <FaqItem question="Who can use a Free Trade Warehousing Zone?">
                  Importers, traders and distributors can use one, subject to the approvals and terms of the facility. We confirm what applies to your business before you commit.
                </FaqItem>
                <FaqItem question="How do I get a quote?">
                  Call <a href={PHONE_HREF} className={linkClass}>044 4508 8099</a>, message{' '}
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={linkClass}>+91 98843 88099</a> on WhatsApp, or use the{' '}
                  <Link href="/quote" className={linkClass}>quote form</Link>. Share your cargo type, volumes, origin and expected storage period, and we will reply with a plan and a quote.
                </FaqItem>
              </div>
            </section>
          </article>
        </div>
      </section>

      {/* Section 10: Request a Quote CTA */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto relative rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40 px-5 py-8 sm:px-10 sm:py-12 md:px-14">
            <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 sm:space-y-5 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Request a Quote for Free Trade Warehousing in Chennai
              </h2>
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed">
                Tell us what you import, how much and for how long you need to store it, and we will recommend a plan.{' '}
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
