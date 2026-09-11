'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Scale, 
  FileCheck, 
  Award, 
  Lock, 
  Building2, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Copy, 
  Package, 
  Globe, 
  Anchor, 
  Truck, 
  Warehouse, 
  Layers, 
  FileSearch, 
  CheckSquare, 
  Shield, 
  Activity, 
  ArrowUpRight 
} from 'lucide-react';
import CTASection from '@/components/common/CTASection';
import { servicesData } from '@/data/services';

export default function CustomsBrokerage() {
  const service = servicesData.customsBrokerage;
  const [activeTab, setActiveTab] = useState("all");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const subServices = service.subServices || [];

  const filterSubServices = activeTab === "all" 
    ? subServices 
    : subServices.filter(s => s.id === activeTab);

  const handleCopy = (text, idx, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Structured JSON-LD Schema
  const customsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": service.title,
        "serviceType": "Licensed Customs Brokerage and Regulatory Compliance",
        "description": service.description,
        "provider": {
          "@type": "LogisticsService",
          "name": "KPS Worldwide Logistics Pvt. Ltd.",
          "url": "https://www.kpsgroups.net",
          "telephone": "044 - 45088099",
          "email": "bsp@kpsgroups.net",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "No. 14, 6th Floor, A.K. Nayak Bhavan, Jahangir Street, Second Line Beach, Parrys",
            "addressLocality": "Chennai",
            "addressRegion": "Tamil Nadu",
            "postalCode": "600001",
            "addressCountry": "IN"
          }
        },
        "areaServed": ["Chennai", "Tamil Nadu", "India", "Global"]
      },
      {
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  const serviceNav = [
    { name: "01. Containerized Cargo", path: "/services/containerized-cargo", icon: <Package className="w-3.5 h-3.5" /> },
    { name: "02. Freight Forwarding", path: "/services/freight-forwarding", icon: <Globe className="w-3.5 h-3.5" /> },
    { name: "03. Project Cargo & Maritime", path: "/services/project-logistics", icon: <Anchor className="w-3.5 h-3.5" /> },
    { name: "04. Over Dimensional Cargo", path: "/services/odc", icon: <Truck className="w-3.5 h-3.5" /> },
    { name: "05. Customs Brokerage", path: "/services/customs-brokerage", icon: <FileText className="w-3.5 h-3.5" /> },
    { name: "06. Industrial Warehousing", path: "/services/warehousing", icon: <Warehouse className="w-3.5 h-3.5" /> },
    { name: "FTWZ Solutions Hub", path: "/services/ftwz", icon: <Layers className="w-3.5 h-3.5" /> }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Document Pre-Check",
      desc: "Comprehensive review of Commercial Invoice, Packing List, BL/AWB, and Certificate of Origin (COO)."
    },
    {
      step: "02",
      title: "Tariff Classification",
      desc: "Precise HS / HTS code determination and assessment of duty concessions & FTA / CEPA benefits."
    },
    {
      step: "03",
      title: "ICEGATE Digital Filing",
      desc: "Direct electronic submission of Bill of Entry (BE) or Shipping Bill (SB) into Indian Customs systems."
    },
    {
      step: "04",
      title: "Assessment & Duty",
      desc: "Managing online duty payment facilitation and coordinating any statutory query resolutions."
    },
    {
      step: "05",
      title: "Dock Inspection & OOC",
      desc: "Physical cargo examination coordination and securing final Out of Charge (OOC) / LEO clearance."
    }
  ];

  const alliedAgencies = [
    { name: "FSSAI", desc: "Food Safety & Standards Authority clearances for imported food products." },
    { name: "Plant Quarantine (PQ)", desc: "Phytosanitary inspection & import permit clearances for plant products & wood packaging." },
    { name: "Animal Quarantine (AQ)", desc: "Sanitary import clearances for livestock and veterinary products." },
    { name: "CDSCO", desc: "Central Drugs Standard Control clearance for pharmaceuticals and medical devices." },
    { name: "WPC & ETA", desc: "Wireless Planning & Coordination approvals for wireless and telecom equipment." },
    { name: "BIS & Legal Metrology", desc: "Bureau of Indian Standards compliance & packaged commodities labeling verification." }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Structured JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(customsSchema) }}
      />

      {/* 1. Compact Ultra-Premium Hero Section */}
      <section className="relative bg-brand-green-dark text-white pt-20 pb-6 sm:pt-24 sm:pb-8 md:pt-28 md:pb-12 overflow-hidden border-b border-brand-green/30">
        {/* Background Image & Ambient Glow */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80')` }}
        ></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
            
            {/* Main Header Copy */}
            <div className="lg:col-span-8 space-y-2.5 sm:space-y-3.5">
              
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest text-[9.5px] sm:text-[11px] flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>05. CUSTOMS BROKERAGE & COMPLIANCE</span>
                </span>
                <span className="text-gray-300 font-medium text-[11px] sm:text-xs hidden sm:inline-block">
                  • 40+ Years Licensed Customs Authority
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Licensed Customs Brokerage & Cross-Border Compliance
              </h1>

              <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-3xl">
                Navigating complex cross-border trade requirements, HTS tariff classifications, ICEGATE digital filing, and direct port liaison to ensure compliant, zero-delay customs clearance across all major ports in India.
              </p>

              {/* Dual Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                <Link
                  href="/quote"
                  className="inline-flex items-center space-x-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xs transition-all duration-200 text-xs sm:text-sm transform hover:-translate-y-0.5"
                >
                  <span>Request Customs Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="tel:04445088099"
                  className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>044 - 45088099</span>
                </a>
              </div>

            </div>

            {/* Compact 4-Metric Grid */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-2 sm:gap-2.5">
              {[
                { label: "Licensed Experience", value: "40+ Yrs", sub: "Since 1985 (Seenu & Co.)" },
                { label: "Digital ICEGATE", value: "24/7 Direct", sub: "Paperless Electronic Filing" },
                { label: "Tariff Accuracy", value: "100%", sub: "HS / HTS Optimization" },
                { label: "Port Coverage", value: "Pan-India", sub: "Sea, Air & ICD Terminals" }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 sm:p-3 hover:border-brand-yellow/50 transition-all duration-200"
                >
                  <div className="text-base sm:text-lg md:text-xl font-black text-brand-yellow tracking-tight leading-none">
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-white mt-1 leading-tight">
                    {item.label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-gray-300 font-light mt-0.5 truncate">
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. Main Content Grid & Sticky Sidebar */}
      <section className="py-8 sm:py-12 text-brand-gray-dark">
        <div className="container mx-auto px-4 sm:px-6">
          
          {/* Breadcrumb Trail */}
          <nav className="flex items-center space-x-2 text-xs text-brand-gray mb-6">
            <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">Services</Link>
            <span>/</span>
            <span className="text-brand-green-dark font-bold">Customs Brokerage</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left Column: Compact Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 h-fit">
              
              {/* Ultra-Compact Unified Services Directory */}
              <div className="bg-white border border-brand-gray-muted rounded-2xl p-3 sm:p-3.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-gray-muted/80">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                    <h4 className="text-[11px] font-extrabold text-brand-green-dark tracking-wider uppercase">
                      Services Directory
                    </h4>
                  </div>
                  <span className="text-[9px] font-bold font-mono bg-brand-gray-light text-brand-gray px-1.5 py-0.5 rounded border border-brand-gray-muted/60">
                    7 Divisions
                  </span>
                </div>

                <nav className="space-y-1">
                  {serviceNav.map((link, idx) => {
                    const active = link.path === "/services/customs-brokerage";
                    return (
                      <Link
                        key={idx}
                        href={link.path}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all duration-150 group ${
                          active
                            ? 'bg-brand-green-dark text-brand-yellow font-bold shadow-2xs'
                            : 'text-brand-gray-dark hover:bg-brand-gray-light hover:text-brand-green font-medium'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className={`flex-shrink-0 ${active ? 'text-brand-yellow' : 'text-brand-green group-hover:text-brand-green'}`}>
                            {link.icon}
                          </span>
                          <span className="truncate text-xs">{link.name}</span>
                        </div>
                        
                        <div className="flex items-center pl-1.5">
                          {active ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
                          ) : (
                            <ChevronRight className="w-3 h-3 text-brand-gray/40 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Direct Customs Compliance Consultation Desk */}
              <div className="bg-brand-green-dark text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg border border-brand-green/30 space-y-3">
                <div className="inline-flex items-center space-x-1.5 bg-brand-yellow/20 text-brand-yellow px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  <span>Licensed Broker Desk</span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                  Need Immediate Customs Clearance Support?
                </h4>
                
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  Direct liaison with Chennai Custom House, Port Terminals, Air Cargo Complex, and ICDs across India.
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                  <a 
                    href="tel:04445088099" 
                    className="flex items-center space-x-2 text-brand-yellow hover:text-white transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span className="font-semibold">044 - 45088099</span>
                  </a>
                  <a 
                    href="mailto:bsp@kpsgroups.net" 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>bsp@kpsgroups.net</span>
                  </a>
                  <div className="flex items-center space-x-2 text-gray-400 text-[11px] pt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Mon - Sat: 09:00 AM - 06:00 PM IST</span>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    href="/quote"
                    className="w-full inline-flex items-center justify-center space-x-2 text-xs font-bold bg-brand-yellow text-brand-green-dark px-4 py-2.5 rounded-xl hover:bg-white transition-colors shadow-xs"
                  >
                    <span>Request Custom Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </aside>

            {/* Right Column: Main Compact Customs Details */}
            <main className="lg:col-span-8 space-y-6 sm:space-y-8">
              
              {/* 1. Verified GEO Citation Certificate Box */}
              {service.entityPositioning && (
                <div className="relative overflow-hidden bg-gradient-to-br from-[#f0f9f4] via-[#e8f6ee] to-[#d8efe2] border border-[#a3cfbb] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-[#c3e6cb] pb-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-brand-green text-brand-yellow flex items-center justify-center shadow-xs">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green-dark">
                        Verified Customs Brokerage Entity
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-white/90 text-[#0f5132] px-2 py-0.5 rounded border border-[#a3cfbb] font-semibold">
                      GEO Entity Citation
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-green-dark font-normal leading-relaxed">
                    {service.entityPositioning}
                  </p>
                </div>
              )}

              {/* 2. Overview & Why Choose KPS (Compact 4 Pillars) */}
              <div className="bg-[#f8fbf9] border border-brand-green/20 rounded-2xl p-4 sm:p-6 space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-brand-green/15">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  <h3 className="text-xs sm:text-sm font-bold text-brand-green-dark uppercase tracking-wide">
                    Why Choose KPS Worldwide Logistics Customs Brokerage?
                  </h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {(service.whyChoose || service.bullets || []).map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-brand-yellow text-brand-green-dark flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[8px] shadow-xs">
                        ✓
                      </div>
                      <span className="text-xs font-semibold text-brand-green-dark leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Sub-Services Deep Dive with Compact Tabs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="text-brand-green font-bold text-[11px] uppercase tracking-widest block">
                      CUSTOMS CLEARANCE DIVISIONS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-brand-green-dark tracking-tight">
                      Detailed Brokerage Capabilities
                    </h3>
                  </div>

                  {/* Compact Tabs */}
                  <div className="flex flex-wrap gap-1 bg-brand-gray-light p-1 rounded-xl border border-brand-gray-muted text-xs">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                        activeTab === "all"
                          ? 'bg-brand-green-dark text-brand-yellow shadow-xs'
                          : 'text-brand-gray hover:text-brand-green-dark'
                      }`}
                    >
                      All (4)
                    </button>
                    {subServices.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setActiveTab(sub.id)}
                        className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                          activeTab === sub.id
                            ? 'bg-brand-green-dark text-brand-yellow shadow-xs'
                            : 'text-brand-gray hover:text-brand-green-dark'
                        }`}
                      >
                        {sub.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Service Cards Grid */}
                <div className="space-y-4">
                  {filterSubServices.map((sub, idx) => (
                    <motion.div 
                      key={sub.id || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border-2 border-[#e9ecef] hover:border-brand-green/40 rounded-2xl p-4 sm:p-6 shadow-2xs hover:shadow-xs transition-all space-y-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f1f3f5]">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-green text-brand-yellow flex items-center justify-center font-extrabold text-xs shadow-xs">
                            0{idx + 1}
                          </div>
                          <div>
                            <h4 className="text-base sm:text-lg font-extrabold text-brand-green-dark">
                              {sub.title}
                            </h4>
                            <span className="text-[10px] text-brand-gray font-mono">
                              Keyword: {sub.primaryKeyword}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold bg-[#f0f9f4] text-brand-green-dark px-2.5 py-0.5 rounded-full border border-[#c3e6cb]">
                          Customs Scope
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-brand-gray-dark leading-relaxed font-normal">
                        {sub.description}
                      </p>

                      {/* Inclusions */}
                      {sub.inclusions && (
                        <div className="bg-[#f8f9fa] rounded-xl p-3 sm:p-3.5 border border-[#edf0f2] space-y-1.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-dark block">
                            Scope of Clearance & Deliverables:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                            {sub.inclusions.map((inc, iIdx) => (
                              <div key={iIdx} className="flex items-start space-x-1.5 text-xs text-brand-gray-dark">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-green mt-0.5 flex-shrink-0" />
                                <span className="font-normal">{inc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ideal For */}
                      {sub.idealFor && (
                        <div>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-dark block mb-1">
                            Ideal Trade Categories:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {sub.idealFor.map((item, idIdx) => (
                              <span 
                                key={idIdx} 
                                className="text-[10px] sm:text-[11px] bg-[#f0f9f4] text-brand-green-dark border border-[#c3e6cb] px-2.5 py-0.5 rounded-md font-medium"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-Service AEO Quick Answer */}
                      {sub.aeoAnswer && (
                        <div className="bg-[#fffdf5] border border-[#ffeeba] rounded-xl p-3 sm:p-3.5 space-y-1">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#856404]">
                            <HelpCircle className="w-3.5 h-3.5 text-brand-yellow-dark flex-shrink-0" />
                            <span>{sub.aeoAnswer.question}</span>
                          </div>
                          <p className="text-xs text-[#533f03] leading-relaxed font-normal">
                            {sub.aeoAnswer.answer}
                          </p>
                        </div>
                      )}

                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 4. Compact 5-Step ICEGATE Digital Clearance Workflow */}
              <div className="bg-gradient-to-br from-[#0c2a1d] to-brand-green-dark text-white rounded-2xl p-4 sm:p-6 shadow-md border border-brand-green/40 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-brand-yellow" />
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                      ICEGATE 5-Step Digital Clearance Flow
                    </h3>
                  </div>
                  <span className="text-[10px] bg-brand-yellow text-brand-green-dark font-extrabold px-2.5 py-0.5 rounded-full">
                    Direct Paperless Gateway
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-2.5 pt-0.5">
                  {workflowSteps.map((wf, wIdx) => (
                    <div key={wIdx} className="bg-white/10 rounded-xl p-2.5 sm:p-3 border border-white/10 space-y-1">
                      <div className="text-brand-yellow font-black text-xs">{wf.step}</div>
                      <h5 className="font-bold text-xs text-white leading-snug">{wf.title}</h5>
                      <p className="text-[10px] text-gray-300 font-light leading-relaxed">{wf.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Allied Government Agencies & Compliance Matrix */}
              <div className="bg-[#fbfcfc] border border-brand-gray-muted rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-brand-gray-muted">
                  <CheckSquare className="w-4 h-4 text-brand-green" />
                  <h4 className="text-xs sm:text-sm font-bold text-brand-green-dark uppercase tracking-wide">
                    Allied Statutory Clearances (Partner Government Agencies)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {alliedAgencies.map((agency, aIdx) => (
                    <div key={aIdx} className="bg-white p-2.5 sm:p-3 rounded-xl border border-brand-gray-muted/80 space-y-0.5 shadow-2xs">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-green-dark">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
                        <span>{agency.name}</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-brand-gray leading-relaxed font-light">{agency.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Interactive AEO FAQ Accordion */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-brand-gray-muted">
                  <div>
                    <div className="flex items-center space-x-1.5 text-brand-yellow-dark font-bold text-xs uppercase tracking-widest">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>ANSWER ENGINE OPTIMIZATION (AEO)</span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-extrabold text-brand-green-dark tracking-tight mt-0.5">
                      Frequently Asked Questions (Customs Brokerage)
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {service.faqs.map((faq, fIdx) => {
                      const isOpen = openFaqIndex === fIdx;
                      return (
                        <div 
                          key={fIdx}
                          className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                            isOpen 
                              ? 'border-brand-green/40 shadow-2xs bg-white' 
                              : 'border-brand-gray-muted/80 bg-[#fbfcfc] hover:border-brand-green/30'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? -1 : fIdx)}
                            className={`w-full flex items-center justify-between p-3 sm:p-4 text-left transition-colors ${
                              isOpen ? 'bg-gradient-to-r from-[#f0f9f4] to-white text-brand-green-dark' : 'hover:bg-white text-brand-green-dark'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 pr-3 min-w-0">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                                isOpen ? 'bg-brand-green text-brand-yellow' : 'bg-brand-gray-light text-brand-gray'
                              }`}>
                                Q{fIdx + 1}
                              </span>
                              <span className="text-xs sm:text-sm font-bold leading-snug">
                                {faq.question}
                              </span>
                            </div>
                            
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'bg-brand-green text-brand-yellow rotate-180' : 'bg-brand-gray-light text-brand-gray'
                            }`}>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                              >
                                <div className="p-3 sm:p-4 pt-1 border-t border-[#e9ecef]/60 text-xs sm:text-sm text-brand-gray-dark leading-relaxed">
                                  <div className="bg-[#f8f9fa] rounded-lg p-2.5 sm:p-3 border border-brand-gray-muted/60 relative">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="font-normal text-brand-green-dark leading-relaxed text-xs sm:text-sm pr-4">
                                        {faq.answer}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={(e) => handleCopy(faq.answer, fIdx, e)}
                                        className="text-brand-gray hover:text-brand-green transition-colors p-1 rounded hover:bg-white flex-shrink-0"
                                        title="Copy Answer"
                                      >
                                        {copiedIdx === fIdx ? (
                                          <Check className="w-3.5 h-3.5 text-brand-green" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </main>

          </div>
        </div>
      </section>

      {/* 3. Website-Wide Unified CTA */}
      <CTASection />
    </div>
  );
}
