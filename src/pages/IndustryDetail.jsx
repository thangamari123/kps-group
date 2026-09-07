import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, 
  Layers, Package, Phone, Mail, FileText, Check, ChevronDown, Award, Globe, Cpu 
} from 'lucide-react';
import { industriesData } from '../data/industries';
import SEO from '../components/common/SEO';
import { companyDetails } from '../data/company';

export default function IndustryDetail() {
  const { industrySlug } = useParams();
  const [openFaq, setOpenFaq] = useState(0);

  const industry = industriesData[industrySlug];

  if (!industry) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-white min-h-screen text-brand-gray-dark">
      <SEO
        title={`${industry.title} | KPS Worldwide Logistics`}
        description={industry.shortDesc}
        keywords={[
          industry.title,
          `${industry.title} India`,
          "automotive logistics Chennai",
          "FMCG distribution logistics",
          "healthcare pharmaceutical logistics",
          "project cargo logistics India",
          "industrial machinery transport"
        ]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative bg-[#072419] text-white py-16 sm:py-24 md:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('${industry.image}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#072419] via-[#072419]/90 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs text-gray-300">
              <Link to="/" className="hover:text-brand-yellow transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span>Industries</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-brand-yellow font-medium">{industry.title}</span>
            </div>

            {/* Small Eyebrow */}
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-brand-yellow text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-brand-yellow" />
              <span>{industry.eyebrow}</span>
            </div>

            {/* Main H1 */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {industry.heroH1}
            </h1>

            {/* Sub-description */}
            <p className="text-xs sm:text-base text-gray-200 leading-relaxed font-light max-w-2xl">
              {industry.fullDesc}
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                to="/lead-form"
                className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-xs sm:text-sm transform hover:-translate-y-0.5"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact-us"
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-xs sm:text-sm backdrop-blur-sm"
              >
                <span>Consult Industry Engineers</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. INDUSTRY CHALLENGES VS KPS SOLUTION */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#fafcfb] border-b border-brand-gray-muted">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Industry Challenges */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
                  INDUSTRY CHALLENGES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight leading-tight">
                  Overcoming Supply Chain Bottlenecks in {industry.title}
                </h2>
              </div>

              <div className="space-y-4">
                {industry.challenges.map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#e5e9e7] rounded-xl p-4 sm:p-5 shadow-2xs space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        !
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-brand-green-dark">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light pl-8">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: KPS Engineered Solution Callout Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#072419] to-brand-green-dark text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 border border-brand-green/40">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-yellow block">
                  THE KPS FORMULA
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  How We Engineer Success
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
                {industry.kpsSolution}
              </p>

              {/* Core Feature Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                {industry.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/lead-form"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold py-3 rounded-xl transition-colors text-xs sm:text-sm"
                >
                  <span>Get Started for Your Sector</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP EXECUTION PROCESS */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
              STANDARDIZED WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight leading-tight">
              Our 4-Stage Operational Process
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {industry.process.map((step, idx) => (
              <div key={idx} className="bg-[#fafcfb] border border-[#e5e9e7] rounded-xl p-5 shadow-2xs space-y-2.5 relative">
                <span className="text-3xl font-mono font-black text-gray-200 block">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-brand-green-dark">
                  {step.title}
                </h3>
                <p className="text-xs text-brand-gray leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTEGRATED SERVICES USED */}
      <section className="py-12 sm:py-16 bg-[#f4f7f5] border-t border-brand-gray-muted">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-6 text-center">
            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-green-dark">
              Integrated Logistics Services Powering This Sector
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {industry.servicesUsed.map((srv, idx) => (
                <Link
                  key={idx}
                  to={srv.path}
                  className="bg-white border border-[#e5e9e7] hover:border-brand-green rounded-xl p-4 shadow-2xs text-left group transition-all"
                >
                  <span className="text-xs font-bold text-brand-green-dark group-hover:text-brand-green transition-colors block leading-tight">
                    {srv.name}
                  </span>
                  <span className="text-[10px] text-brand-yellow-dark font-medium mt-1 inline-flex items-center space-x-1">
                    <span>Explore Service</span>
                    <ArrowRight className="w-2.5 h-2.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      {industry.faqs && industry.faqs.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white border-t border-brand-gray-muted">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="text-center mb-8 sm:mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark">
                Got Questions About {industry.title}?
              </h2>
            </div>

            <div className="space-y-3">
              {industry.faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#e5e9e7] rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-brand-green-dark hover:bg-gray-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-brand-gray leading-relaxed border-t border-gray-100 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BOTTOM ACTION STRIP */}
      <section className="py-12 bg-[#072419] text-white text-center border-t border-brand-green/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-4">
          <h2 className="text-xl sm:text-3xl font-black text-white">
            Need Tailored Logistics for Your {industry.title} Operations?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-light">
            Contact our senior logistics engineers for customized routing, customs duty advisory, and rate estimations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/lead-form"
              className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-6 py-3 rounded-xl shadow-md text-xs sm:text-sm"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
