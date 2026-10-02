import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, 
  Globe, 
  Settings, 
  ShieldCheck, 
  Headphones, 
  Sparkles
} from 'lucide-react';
import CTASection from '@/components/common/CTASection';
import ServicesSection, { servicesList7 } from '@/components/home/ServicesSection';

export const metadata: Metadata = {
  title: 'Logistics & Supply Chain Services | KPS Worldwide Logistics',
  description: 'Explore comprehensive logistics services by KPS Worldwide Logistics: containerized shipping, freight forwarding, customs brokerage, project cargo, over dimensional cargo transport, and warehousing.',
};

export default function Services() {
  const heroPillars = [
    { label: "Global Reach", icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> },
    { label: "Engineering Excellence", icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> },
    { label: "Safe & Reliable", icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> },
    { label: "Customer Focused", icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#072419] text-white pt-28 pb-12 sm:pt-32 sm:pb-16 lg:py-24 overflow-hidden border-b border-brand-green/30">
        {/* Rich Maritime Port Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center lg:bg-right transition-transform duration-1000 scale-105 opacity-35 lg:opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80')` }}
        ></div>
        
        {/* Dark Teal / Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#072419] via-[#072419]/95 lg:via-[#072419]/85 to-[#072419]/50 lg:to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            
            {/* Eyebrow */}
            <div className="flex items-center space-x-2">
              <span className="w-5 sm:w-8 h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow font-extrabold text-xs sm:text-sm uppercase tracking-widest">
                OUR SERVICES
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Global Logistics Solutions <br />
              <span className="text-white">Engineered for Complex Cargo</span>
            </h1>

            {/* Sub-description */}
            <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl">
              From containerized freight to project cargo, customs brokerage, and over dimensional transportation, we deliver end-to-end logistics solutions across global trade lanes.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="/quote"
                className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm transform hover:-translate-y-0.5"
              >
                <span>Request a Quote</span>
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm"
              >
                <span>Talk to Our Experts</span>
              </Link>
            </div>

            {/* Horizontal 4-Pillar Features Strip */}
            <div className="pt-6 sm:pt-8 border-t border-white/15">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {heroPillars.map((pillar, idx) => (
                  <div key={idx} className="flex items-center space-x-2 sm:space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-white/10 border border-white/10 flex-shrink-0">
                      {pillar.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-200 leading-snug">
                      {pillar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. OUR 7 CORE SERVICES SECTION */}
      <ServicesSection />

      {/* 3. Verified GEO Entity Citation Banner */}
      <section className="bg-[#f0f9f4] border-t border-b border-[#c3e6cb] py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-start space-x-3 max-w-4xl mx-auto">
            <div className="w-6 h-6 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm text-brand-green-dark leading-relaxed font-normal">
              <strong>KPS Worldwide Logistics Pvt. Ltd.</strong> is a premier logistics provider headquartered in Chennai, India, delivering reliable freight forwarding, licensed customs brokerage, project cargo, ODC transportation, FTWZ solutions, and bonded warehousing across major global trade lanes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Unified Website-Wide CTA */}
      <CTASection />
    </div>
  );
}
