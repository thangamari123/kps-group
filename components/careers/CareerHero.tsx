// Career page hero: presentation only (no data fetching or application logic).
import { ArrowDown } from 'lucide-react';
import { companyDetails } from '@/data/company';

// Existing project asset (port operations: quay cranes, heavy-lift cargo, crew in safety gear)
const HERO_IMAGE = '/images/project-cargo-logistics.webp';

export default function CareerHero() {
  const office = companyDetails.contact.corporateOffice;

  const facts = [
    { label: 'Established', value: String(companyDetails.foundedYear) },
    { label: 'Headquarters', value: `${office.city}, ${office.country}` },
    { label: 'Expertise', value: 'Customs · Freight · Project Cargo' },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-green-dark text-white">
      {/* Fine grid texture, as used on the other page heroes */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 pt-32 pb-12 sm:pt-40 sm:pb-14 lg:pt-44 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Message */}
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2.5 text-brand-yellow text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em]">
              <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
              Careers at KPS Worldwide Logistics
            </span>

            <h1 className="mt-4 text-[32px] leading-[1.1] sm:text-5xl lg:text-[52px] font-black tracking-tight text-white">
              Build Your Career.
              <span className="block text-brand-yellow">Move Global Trade Forward.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] sm:text-base text-gray-100 font-normal leading-relaxed">
              Explore career opportunities in customs brokerage, freight forwarding and project cargo logistics with a
              people-first team at KPS Worldwide Logistics.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="#open-positions"
                className="inline-flex items-center justify-center gap-2 min-h-12 px-7 rounded-lg bg-brand-yellow hover:bg-[#ffd54f] active:bg-[#e0a800] text-brand-green-dark text-sm font-extrabold shadow-lg shadow-black/20 transition-colors duration-250 focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>View Open Positions</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href="#why-kps"
                className="inline-flex items-center justify-center min-h-12 px-7 rounded-lg border border-white/30 hover:border-white hover:bg-white/10 text-white text-sm font-bold transition-colors duration-250 focus-visible:ring-2 focus-visible:ring-brand-yellow"
              >
                Why Join KPS
              </a>
            </div>
          </div>

          {/* Imagery */}
          <div className="lg:col-span-5">
            <figure className="relative">
              {/* Offset corner accents */}
              <span aria-hidden="true" className="absolute -top-2 -left-2 h-10 w-10 border-t-2 border-l-2 border-brand-yellow" />
              <span aria-hidden="true" className="absolute -bottom-2 -right-2 h-10 w-10 border-b-2 border-r-2 border-brand-yellow" />

              <div className="relative overflow-hidden border border-white/15 bg-black/20 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[5/4]">
                <img
                  src={HERO_IMAGE}
                  alt="Port operations team directing a heavy-lift cargo load beside quay cranes at sunset"
                  width={1254}
                  height={1254}
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-[50%_42%]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#04251a]/90 to-transparent px-4 pt-10 pb-3.5 sm:px-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-yellow">Project Cargo &amp; Heavy Lift</span>
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </div>

      {/* Company facts (existing company data) */}
      <div className="relative z-10 border-t border-white/10 bg-[#073B2C]/70">
        <div className="container mx-auto px-4 sm:px-6">
          <dl className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-white/10">
            {facts.map((fact) => (
              <div key={fact.label} className="py-4 sm:py-5 sm:px-6 sm:first:pl-0 flex items-baseline justify-between sm:block gap-4">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">{fact.label}</dt>
                <dd className="sm:mt-1 text-sm sm:text-base font-semibold text-white text-right sm:text-left">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
