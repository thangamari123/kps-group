import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Globe, 
  Settings, 
  ShieldCheck, 
  Headphones, 
  Package, 
  Plane, 
  Ship, 
  Truck, 
  FileCheck, 
  Warehouse, 
  Layers,
  Sparkles
} from 'lucide-react';
import CTASection from '../components/common/CTASection';
import SEO from '../components/common/SEO';
import { servicesData } from '../data/services';
import { companyDetails } from '../data/company';

export default function Services() {
  const coreServices = [
    {
      num: "01",
      title: "Containerized Cargo",
      path: "/services/containerized-cargo",
      tags: "FCL • LCL • Specialized Equipment",
      description: "Reliable and cost-effective container shipping solutions tailored to your cargo type, volume, and destination.",
      icon: <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    },
    {
      num: "02",
      title: "Freight Forwarding",
      path: "/services/freight-forwarding",
      tags: "Multimodal • Air Freight • Inland Transport",
      description: "Integrated ocean, air, and inland transportation solutions for efficient end-to-end logistics.",
      icon: <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    },
    {
      num: "03",
      title: "Project Cargo",
      path: "/services/project-logistics",
      tags: "Break Bulk • RoRo • Heavy Machinery • Static Cargo • Port Handling",
      description: "Specialized logistics for heavy lift, oversized, and industrial cargo with end-to-end project management.",
      icon: <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    },
    {
      num: "04",
      title: "Over Dimensional Cargo",
      path: "/services/odc",
      tags: "Route Feasibility • Specialized Fleet",
      description: "Engineered solutions for out-of-gauge and over dimensional cargo with detailed route surveys and planning.",
      icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    },
    {
      num: "05",
      title: "Customs Brokerage",
      path: "/services/customs-brokerage",
      tags: "Import & Export • Classification • Specialized Clearances",
      description: "Compliant customs clearance and documentation support to ensure smooth cross-border trade.",
      icon: <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    },
    {
      num: "06",
      title: "Warehousing & Logistics",
      path: "/services/warehousing",
      tags: "Industrial Warehousing • Bonded Storage • Value Added Logistics",
      description: "Secure storage, cargo handling, and value-added services to support your supply chain and projects.",
      icon: <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    }
  ];

  const heroPillars = [
    { label: "Global Reach", icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> },
    { label: "Engineering Excellence", icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> },
    { label: "Safe & Reliable", icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> },
    { label: "Customer Focused", icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" /> }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* SEO Metadata */}
      <SEO 
        title="Global Logistics & Freight Forwarding Services | KPS Worldwide Logistics"
        description="KPS Worldwide Logistics provides end-to-end containerized cargo shipping, multimodal freight forwarding, project cargo, RoRo, ODC transportation, licensed customs brokerage, and industrial warehousing."
        keywords={[
          "logistics company in Chennai",
          "freight forwarding company India",
          "container shipping services",
          "containerized cargo shipping services",
          "project cargo logistics services",
          "over dimensional cargo transportation",
          "licensed customs brokerage services",
          "industrial warehousing services",
          "customs broker Chennai",
          "ODC transport Chennai"
        ]}
      />

      {/* 1. HERO SECTION (Exact Matching Visual Layout) */}
      <section className="relative bg-[#072419] text-white pt-24 pb-12 sm:pt-28 sm:pb-16 lg:py-24 overflow-hidden border-b border-brand-green/30">
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
              From containerized freight to project cargo and over dimensional transportation, we deliver end-to-end logistics solutions across global trade lanes.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                to="/lead-form"
                className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm transform hover:-translate-y-0.5"
              >
                <span>Request a Quote</span>
              </Link>
              <Link
                to="/contact-us"
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

      {/* 2. OUR CORE SERVICES SECTION (Exact 3-Column Card Grid) */}
      <section className="py-10 sm:py-16 md:py-20 bg-[#fafcfb] text-brand-gray-dark">
        <div className="container mx-auto px-4 sm:px-6 space-y-6 sm:space-y-10">
          
          {/* Section Eyebrow Header */}
          <div className="flex items-center space-x-2">
            <span className="w-5 sm:w-8 h-[2px] bg-brand-yellow"></span>
            <h2 className="text-[#072419] font-black text-xs sm:text-sm md:text-base uppercase tracking-widest">
              OUR CORE SERVICES
            </h2>
          </div>

          {/* 6 Core Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {coreServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e5e9e7] hover:border-brand-yellow/60 rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Top Row: Big Number & Dark Icon Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-300 font-mono tracking-tight group-hover:text-brand-yellow/40 transition-colors">
                      {service.num}
                    </span>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#072419] group-hover:bg-brand-yellow text-white group-hover:text-brand-green-dark transition-colors duration-300 flex items-center justify-center shadow-xs">
                      {service.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#072419] tracking-tight leading-snug">
                    {service.title}
                  </h3>

                  {/* Sub-services Tagline */}
                  <p className="text-xs sm:text-[13px] font-bold text-brand-yellow-dark leading-snug">
                    {service.tags}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Explore Link */}
                <div className="pt-4 sm:pt-6 mt-4 border-t border-gray-100">
                  <Link
                    to={service.path}
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-brand-green hover:text-brand-green-light group-hover:translate-x-1 transition-all duration-200"
                  >
                    <span>Explore Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* FTWZ Special Solutions Card Callout */}
          <div className="bg-gradient-to-br from-[#072419] to-brand-green-dark text-white rounded-2xl p-5 sm:p-7 shadow-md border border-brand-green/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 bg-brand-yellow/20 text-brand-yellow px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Specialized Free Trade Zone Hub</span>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-white">
                Free Trade & Warehousing Zone (FTWZ) Solutions
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                Customs duty deferment, international trading, foreign currency billing, and consolidation hub within notified FTWZ zones in India.
              </p>
            </div>
            <Link
              to="/services/ftwz"
              className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-xs transition-all text-xs sm:text-sm flex-shrink-0"
            >
              <span>Explore FTWZ Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. Verified GEO Entity Citation Banner */}
      <section className="bg-[#f0f9f4] border-t border-b border-[#c3e6cb] py-4 sm:py-5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-start space-x-3 max-w-4xl mx-auto">
            <div className="w-6 h-6 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm text-brand-green-dark leading-relaxed font-normal">
              <strong>KPS Worldwide Logistics Pvt. Ltd.</strong> is a premier logistics provider headquartered in Chennai, India, delivering reliable freight forwarding, licensed customs brokerage, project cargo, ODC transportation, and bonded warehousing across major global trade lanes.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Unified Website-Wide CTA */}
      <CTASection />
    </div>
  );
}


