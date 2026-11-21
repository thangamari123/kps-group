import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Phone, MessageCircle, ArrowRight, ShieldCheck, Box, Layers, Scale } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import ContainerLoadCalculator from '@/components/calculator/ContainerLoadCalculator';

export const metadata: Metadata = {
  title: '3D Container Load Calculator | 20ft & 40ft Cargo Planning | KPS',
  description:
    "Free 3D container load calculator by KPS Worldwide Logistics. Calculate how many cartons fit in 20' GP, 40' GP, and 40' HC containers with interactive 3D packing simulation.",
  alternates: {
    canonical: 'https://www.kpsgroups.net/container-load-calculator',
  },
};

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'KPS 3D Container Load Calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      url: 'https://www.kpsgroups.net/container-load-calculator',
      description:
        "Interactive 3D container load planning calculator for 20' GP, 40' GP, and 40' HC sea containers with real-time carton orientation, volume utilisation, and weight payload optimization.",
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.kpsgroups.net/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.kpsgroups.net/services' },
        {
          '@type': 'ListItem',
          position: 3,
          name: '3D Container Load Calculator',
          item: 'https://www.kpsgroups.net/container-load-calculator',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: "How many cartons fit in a 20' and 40' shipping container?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "The number of cartons depends on individual carton dimensions, orientation, stacking limits, and weight. A standard 20' GP container has approximately 33.2 CBM internal volume with a 28,200 kg payload limit, while a 40' GP offers 67.7 CBM and 40' HC offers 76.3 CBM. Use our interactive 3D calculator above to simulate your exact carton packing.",
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between 40ft GP and 40ft High Cube containers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Both containers share the same length (12.03 m) and width (2.35 m), but a 40ft High Cube is 1 foot taller (2.70 m internal height vs. 2.39 m for a 40ft GP). This adds approximately 8.6 CBM of extra volume, making 40' HC ideal for voluminous, lightweight cargo.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does the calculator account for pallet loading and lashing space?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'This calculator computes rigid carton hand-loading (floor-loaded cartons) using maximum internal container envelope. For palletized cargo, slip-sheets, dunnage, or specialized lashing, contact KPS Worldwide Logistics for an engineered container load survey.',
          },
        },
      ],
    },
  ],
};

const PHONE_HREF = 'tel:04445088099';
const WHATSAPP_HREF = 'https://wa.me/919884388099';
const bgImage = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80';

export default function ContainerLoadCalculatorPage() {
  return (
    <div className="bg-[#f4f7fb] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero
        title="3D Container Load Calculator"
        bgImage={bgImage}
      />

      <div className="max-w-[1340px] mx-auto px-3 sm:px-5 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5e6b7a] overflow-x-auto">
          <Link href="/" className="hover:text-[#0b2e59] flex items-center gap-1 shrink-0 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#d9e1ec] shrink-0" />
          <Link href="/services" className="hover:text-[#0b2e59] shrink-0 transition-colors">
            <span>Services</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#d9e1ec] shrink-0" />
          <span className="text-[#0b2e59] font-bold truncate" aria-current="page">
            3D Container Load Calculator
          </span>
        </nav>

        {/* Intro Tagline */}
        <div className="bg-white border border-[#d9e1ec] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-[#0b2e59] tracking-tight">
              3D Container Load & Carton Packing Calculator
            </h1>
            <p className="text-xs sm:text-sm text-[#5e6b7a]">
              Simulate container stuffing, calculate maximum carton capacity, verify weight limits, and inspect 3D packing orientation for 20&apos; GP, 40&apos; GP, and 40&apos; High Cube containers.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/quote"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#1f9d4c] hover:bg-[#157a39] text-white text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <span>Get Freight Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-1.5 border border-[#0b2e59]/30 text-[#0b2e59] hover:bg-slate-50 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#0b2e59]" />
              <span>044 4508 8099</span>
            </a>
          </div>
        </div>

        {/* Interactive 3D Calculator */}
        <ContainerLoadCalculator />

        {/* Educational / Container Specs Section */}
        <section className="bg-white border border-[#d9e1ec] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-black text-[#0b2e59] tracking-tight">
              Standard Ocean Container Specifications
            </h2>
            <p className="text-xs sm:text-sm text-[#5e6b7a] leading-relaxed">
              Container dimensions vary marginally by shipping line and manufacturer. The dimensions below represent standard ISO internal measurements used across global container lines:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#d9e1ec] bg-[#f8fafc] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0b2e59] text-base">20&apos; General Purpose (GP)</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Standard</span>
              </div>
              <ul className="text-xs text-[#5e6b7a] space-y-1">
                <li><b>Internal Length:</b> 5,898 mm (5.90 m / 19.35 ft)</li>
                <li><b>Internal Width:</b> 2,352 mm (2.35 m / 7.72 ft)</li>
                <li><b>Internal Height:</b> 2,393 mm (2.39 m / 7.85 ft)</li>
                <li><b>Nominal Volume:</b> ~33.2 CBM (1,172 CFT)</li>
                <li><b>Max Payload:</b> ~28,200 kg (62,170 lbs)</li>
              </ul>
              <p className="text-[11.5px] text-[#1b2430] pt-1 border-t border-[#d9e1ec]">
                Best for dense, heavy cargo such as metals, machinery parts, minerals, and stone.
              </p>
            </div>

            <div className="rounded-xl border border-[#d9e1ec] bg-[#f8fafc] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0b2e59] text-base">40&apos; General Purpose (GP)</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Standard</span>
              </div>
              <ul className="text-xs text-[#5e6b7a] space-y-1">
                <li><b>Internal Length:</b> 12,032 mm (12.03 m / 39.47 ft)</li>
                <li><b>Internal Width:</b> 2,352 mm (2.35 m / 7.72 ft)</li>
                <li><b>Internal Height:</b> 2,393 mm (2.39 m / 7.85 ft)</li>
                <li><b>Nominal Volume:</b> ~67.7 CBM (2,390 CFT)</li>
                <li><b>Max Payload:</b> ~26,700 kg (58,863 lbs)</li>
              </ul>
              <p className="text-[11.5px] text-[#1b2430] pt-1 border-t border-[#d9e1ec]">
                Best for general volumetric cargo, consumer goods, apparel, and electronic appliances.
              </p>
            </div>

            <div className="rounded-xl border border-[#d9e1ec] bg-[#f8fafc] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0b2e59] text-base">40&apos; High Cube (HC)</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Extra Height</span>
              </div>
              <ul className="text-xs text-[#5e6b7a] space-y-1">
                <li><b>Internal Length:</b> 12,032 mm (12.03 m / 39.47 ft)</li>
                <li><b>Internal Width:</b> 2,352 mm (2.35 m / 7.72 ft)</li>
                <li><b>Internal Height:</b> 2,698 mm (2.70 m / 8.85 ft)</li>
                <li><b>Nominal Volume:</b> ~76.3 CBM (2,694 CFT)</li>
                <li><b>Max Payload:</b> ~26,500 kg (58,422 lbs)</li>
              </ul>
              <p className="text-[11.5px] text-[#1b2430] pt-1 border-t border-[#d9e1ec]">
                Offers 1 extra foot of ceiling clearance. Ideal for light, bulky, and tall cargo.
              </p>
            </div>
          </div>

          <div className="text-[11.5px] text-[#5e6b7a] leading-relaxed pt-3 border-t border-[#d9e1ec]">
            <b>Indicative Planning Tool:</b> Results assume uniform, rigid cartons loaded by hand without pallets, dunnage or lashing gaps, using standard internal dimensions. Actual loading can vary with carton bulging, door header clearance, floor weight distribution, and road transport axle limits. For critical industrial consignments, <Link href="/contact-us" className="text-[#1557a8] font-bold underline">KPS can arrange a professional cargo survey or load plan</Link>.
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="rounded-2xl sm:rounded-[30px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              Need Help Planning Your Sea Container Shipments?
            </h2>
            <p className="text-xs sm:text-sm text-gray-100 leading-relaxed">
              KPS Worldwide Logistics has managed international container shipping, port carting, and customs clearance since 1985. Whether you need single container FCL bookings, LCL consolidation, open top, or reefer transport, our freight desk provides competitive rates and end-to-end documentation.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 bg-[#FFC107] hover:bg-[#FFD54F] text-[#073B2C] font-black px-5 py-2.5 rounded-xl shadow-xs transition-all text-xs sm:text-sm"
              >
                <span>Request Container Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 bg-[#073B2C]/50 hover:bg-[#FFC107] hover:text-[#073B2C] border border-[#FFC107]/40 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-xs sm:text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>044 4508 8099</span>
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#073B2C]/50 hover:bg-[#25D366] hover:border-[#25D366] border border-[#FFC107]/40 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
