'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  ChevronRight, 
  Sparkles,
  Package,
  Globe,
  Anchor,
  Truck,
  FileText,
  Warehouse,
  Layers
} from 'lucide-react';

export default function ServiceHero({ 
  service, 
  bgImage, 
  themeAccent = "green",
  stats = []
}) {
  return (
    <section className="relative min-h-0 sm:min-h-[360px] md:min-h-[420px] flex items-center bg-brand-green-dark text-white overflow-hidden pt-20 pb-6 sm:pt-24 sm:pb-8 md:pt-28 md:pb-12">
      {/* Background Image with Deep Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: `url('${bgImage}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green-dark via-brand-green-dark/95 to-brand-green-dark/80"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-2.5 sm:space-y-3.5">
            
            {/* Breadcrumb & Section Label */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span className="bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest text-[9.5px] sm:text-[11px] flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-brand-yellow" />
                <span>{service.sectionLabel || "KPS Core Service"}</span>
              </span>
              {service.tagline && (
                <span className="text-gray-300 font-medium text-[11px] sm:text-xs hidden sm:inline-block">
                  • {service.tagline}
                </span>
              )}
            </div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
            >
              {service.title}
            </motion.h1>

            {/* Sub-description */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-gray-200 text-xs sm:text-sm md:text-base max-w-3xl font-light leading-relaxed"
            >
              {service.shortDesc || service.description}
            </motion.p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
              <Link
                href="/quote"
                className="inline-flex items-center space-x-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xs transition-all duration-200 text-xs sm:text-sm transform hover:-translate-y-0.5"
              >
                <span>Request Custom Quote</span>
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

          {/* Compact Metric Matrix */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2 sm:gap-2.5">
            {(stats.length > 0 ? stats : [
              { label: "On-Time Delivery", value: "99.8%", sub: "Global Tracking" },
              { label: "Active Sea Lanes", value: "100+", sub: "Direct Carrier Contracts" },
              { label: "Corporate Trust", value: "40+ Yrs", sub: "Since 1985" },
              { label: "Compliance Rate", value: "100%", sub: "Customs Clearance" }
            ]).map((stat, sIdx) => (
              <div 
                key={sIdx}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2.5 sm:p-3 hover:border-brand-yellow/50 transition-all duration-200"
              >
                <div className="text-base sm:text-lg md:text-xl font-black text-brand-yellow tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-white mt-1 leading-tight">
                  {stat.label}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-300 font-light mt-0.5 truncate">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
