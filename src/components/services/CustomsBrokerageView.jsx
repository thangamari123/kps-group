import { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomsBrokerageView({ service }) {
  const [activeTab, setActiveTab] = useState("all");
  const subServices = service.subServices || [];

  const filterSubServices = activeTab === "all" 
    ? subServices 
    : subServices.filter(s => s.id === activeTab);

  return (
    <div className="space-y-12">
      
      {/* 1. Licensed Brokerage Command Header */}
      <div className="bg-gradient-to-br from-[#0c2a1d] via-[#103827] to-brand-green-dark text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-brand-green/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-6 opacity-10 pointer-events-none">
          <FileText className="w-72 h-72 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="bg-brand-yellow text-brand-green-dark font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>40+ Years Licensed Customs Brokerage</span>
            </span>
            <span className="text-xs text-brand-yellow font-mono">
              Primary: {service.primaryKeyword}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {service.title}
          </h3>

          <p className="text-gray-200 text-sm sm:text-base font-light leading-relaxed max-w-3xl">
            {service.description}
          </p>

          {/* Compliance Gateway Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15 text-xs text-gray-200">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">ICEGATE Electronic Filing</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center space-x-2">
              <Scale className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">Tariff & HS Optimization</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center space-x-2">
              <Award className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">Project Import Clearances</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">Bonds & SEZ / FTZ Hubs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Advantages */}
      <div className="bg-[#f5fbf7] border border-brand-green/20 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-brand-green/15">
          <ShieldCheck className="w-5 h-5 text-brand-green" />
          <h4 className="text-base font-bold text-brand-green-dark">
            Why Choose KPS Customs Brokerage?
          </h4>
        </div>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {(service.whyChoose || service.bullets || []).map((bullet, idx) => (
            <li key={idx} className="flex items-start space-x-2.5">
              <div className="w-4 h-4 rounded-full bg-brand-yellow text-brand-green-dark flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[9px] shadow-xs">
                ✓
              </div>
              <span className="text-xs sm:text-sm font-semibold text-brand-green-dark leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Sub-Services Deep Dive */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-brand-green font-bold text-xs uppercase tracking-widest block">
              REGULATORY & CUSTOMS DIVISIONS
            </span>
            <h3 className="text-2xl font-extrabold text-brand-green-dark tracking-tight mt-0.5">
              Customs Brokerage Services
            </h3>
          </div>

          {/* Quick Tabs */}
          <div className="flex flex-wrap gap-1 bg-brand-gray-light p-1 rounded-xl border border-brand-gray-muted text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
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

        <div className="space-y-6">
          {filterSubServices.map((sub, idx) => (
            <motion.div 
              key={sub.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-2 border-[#e9ecef] hover:border-brand-green/50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f3f5]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green text-brand-yellow flex items-center justify-center font-extrabold text-sm shadow-xs">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-brand-green-dark">
                      {sub.title}
                    </h4>
                    <span className="text-[11px] text-brand-gray font-mono">
                      Keyword: {sub.primaryKeyword}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold bg-[#f0f9f4] text-brand-green-dark px-3 py-1 rounded-full border border-[#c3e6cb]">
                  Customs Filing Scope
                </span>
              </div>

              <p className="text-xs sm:text-sm text-brand-gray-dark leading-relaxed font-normal">
                {sub.description}
              </p>

              {/* Inclusions */}
              {sub.inclusions && (
                <div className="bg-[#f8f9fa] rounded-xl p-4 border border-[#edf0f2] space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-dark block">
                    Clearance Scope & Inclusions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sub.inclusions.map((inc, iIdx) => (
                      <div key={iIdx} className="flex items-start space-x-2 text-xs text-brand-gray-dark">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-green mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideal For */}
              {sub.idealFor && (
                <div className="pt-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-dark block mb-2">
                    Ideal Trade Scenarios:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.idealFor.map((item, idIdx) => (
                      <span 
                        key={idIdx} 
                        className="text-[11px] bg-brand-green-bg text-brand-green-dark border border-brand-green/20 px-3 py-1 rounded-md font-semibold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AEO Quick Answer */}
              {sub.aeoAnswer && (
                <div className="bg-[#fffdf5] border border-[#ffeeba] rounded-xl p-4 space-y-1.5">
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

    </div>
  );
}
