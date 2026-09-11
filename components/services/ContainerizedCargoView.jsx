'use client';

﻿import { useState } from 'react';
import { 
  Package, 
  CheckCircle2, 
  HelpCircle, 
  Anchor, 
  Ship, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Box,
  Layers,
  Thermometer,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContainerizedCargoView({ service }) {
  const [activeTab, setActiveTab] = useState("all");

  const subServices = service.subServices || [];

  const filterSubServices = activeTab === "all" 
    ? subServices 
    : subServices.filter(s => s.id === activeTab);

  return (
    <div className="space-y-12">
      
      {/* 1. Category Persona Overview Card */}
      <div className="bg-gradient-to-br from-brand-green-dark via-[#0a3925] to-[#042416] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-brand-green/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 opacity-10 pointer-events-none">
          <Ship className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="bg-brand-yellow text-brand-green-dark font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1.5">
              <Ship className="w-3.5 h-3.5" />
              <span>Maritime & Containerized Freight</span>
            </span>
            <span className="text-xs text-gray-300 font-mono">
              Primary Keyword: {service.primaryKeyword}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {service.title}
          </h3>

          <p className="text-gray-200 text-sm sm:text-base font-light leading-relaxed max-w-3xl">
            {service.description}
          </p>

          {/* Quick Carrier / Port Trust Badge Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15 text-xs text-gray-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">Direct Carrier Alliances</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">FCL & LCL Consolidation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">Specialized OOG Equipment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
              <span className="font-semibold">Chennai & Global Terminals</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Capabilities Grid */}
      <div className="bg-[#f8fbf9] border border-brand-green/20 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-brand-green/15">
          <ShieldCheck className="w-5 h-5 text-brand-green" />
          <h4 className="text-base font-bold text-brand-green-dark">
            Why Choose KPS Container Shipping?
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

      {/* 3. Interactive Sub-Services Selector */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-brand-green font-bold text-xs uppercase tracking-widest block">
              DETAILED SPECIFICATIONS & SCOPE
            </span>
            <h3 className="text-2xl font-extrabold text-brand-green-dark tracking-tight mt-0.5">
              Containerized Freight Breakdown
            </h3>
          </div>

          {/* Tab Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-brand-gray-light p-1 rounded-xl border border-brand-gray-muted">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all"
                  ? 'bg-brand-green-dark text-brand-yellow shadow-xs'
                  : 'text-brand-gray hover:text-brand-green-dark'
              }`}
            >
              All (3)
            </button>
            {subServices.map((sub, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setActiveTab(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === sub.id
                    ? 'bg-brand-green-dark text-brand-yellow shadow-xs'
                    : 'text-brand-gray hover:text-brand-green-dark'
                }`}
              >
                {sub.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Service Cards */}
        <div className="space-y-6">
          {filterSubServices.map((sub, idx) => (
            <motion.div 
              key={sub.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-2 border-[#e9ecef] hover:border-brand-green/50 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-5 relative"
            >
              {/* Card Header with Icon and Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f3f5]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green text-brand-yellow flex items-center justify-center font-extrabold text-sm shadow-xs">
                    {sub.id === 'fcl' ? <Box className="w-5 h-5" /> : sub.id === 'lcl' ? <Layers className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-brand-green-dark">
                      {sub.title}
                    </h4>
                    <span className="text-[11px] text-brand-gray font-mono">
                      Target: {sub.primaryKeyword}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold bg-[#f0f9f4] text-brand-green-dark px-3 py-1 rounded-full border border-[#c3e6cb]">
                  Sub-Service 0{idx + 1}
                </span>
              </div>

              {/* Sub-service Description */}
              <p className="text-xs sm:text-sm text-brand-gray-dark leading-relaxed font-normal">
                {sub.description}
              </p>

              {/* Inclusions List */}
              {sub.inclusions && (
                <div className="bg-[#fbfcfc] rounded-xl p-4 border border-[#edf0f2] space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-dark block">
                    Scope of Services & Inclusions:
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

              {/* Equipment Options for Specialized Containers */}
              {sub.equipmentOptions && (
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-dark block">
                    Specialized Equipment Profiles:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sub.equipmentOptions.map((eq, eIdx) => (
                      <div key={eIdx} className="bg-gradient-to-b from-[#f8fbf9] to-white p-4 rounded-xl border border-brand-green/20 space-y-1.5 shadow-2xs">
                        <div className="flex items-center space-x-1.5 text-brand-green font-bold text-xs">
                          {eq.name.toLowerCase().includes('reefer') ? <Thermometer className="w-3.5 h-3.5" /> : <Box className="w-3.5 h-3.5" />}
                          <span>{eq.name}</span>
                        </div>
                        <p className="text-[11px] text-brand-gray leading-relaxed">{eq.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideal For Badges */}
              {sub.idealFor && (
                <div className="pt-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green-dark block mb-2">
                    Ideal Cargo Categories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sub.idealFor.map((item, idIdx) => (
                      <span 
                        key={idIdx} 
                        className="text-[11px] bg-brand-yellow/15 text-brand-green-dark border border-brand-yellow/30 px-3 py-1 rounded-md font-semibold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AEO Quick Answer Box */}
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
