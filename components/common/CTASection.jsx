'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const containerImg = '/images/KPS%20Green%20Shipping%20Container.png';

export default function CTASection() {
  return (
    <section className="py-6 sm:py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Rounded CTA Container — Compact & Sleek on Mobile */}
        <div className="relative rounded-2xl sm:rounded-[30px] md:rounded-[36px] bg-gradient-to-r from-[#05291E] via-[#084830] to-[#127E4B] text-white shadow-[0_12px_35px_rgba(7,59,44,0.18)] overflow-hidden border border-emerald-800/40">
          
          {/* Subtle Decorative Background Arcs */}
          <div className="absolute -bottom-24 left-1/3 sm:left-1/2 -translate-x-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full border-[18px] border-white/5 pointer-events-none"></div>
          <div className="absolute -bottom-16 left-1/3 sm:left-1/2 -translate-x-1/2 w-56 h-56 sm:w-64 sm:h-64 rounded-full border-[14px] border-white/5 pointer-events-none"></div>
          <div className="absolute -bottom-8 left-1/3 sm:left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-[10px] border-white/5 pointer-events-none"></div>

          {/* Dot Matrix at Top Right */}
          <div className="hidden sm:block absolute top-6 right-1/4 sm:right-1/3 w-32 h-20 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none"></div>
          
          {/* Right Vibrant Green Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#22c55e]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Grid Layout — Ultra Compact on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-6 items-center px-4 sm:px-8 md:px-12 lg:px-14 py-5 sm:py-9 md:py-12 lg:py-14 relative z-10">
            
            {/* Left Column: Text + Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="lg:col-span-7 space-y-2 sm:space-y-3.5 md:space-y-5 text-left"
            >
              {/* Pill Badge: GLOBAL LOGISTICS SOLUTIONS */}
              <div className="inline-flex items-center space-x-1.5 bg-black/20 border border-[#FFC107]/50 px-2.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full shadow-xs">
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFC107]" />
                <span className="text-[#FFC107] font-extrabold text-[8.5px] xs:text-[9px] sm:text-[11px] tracking-[0.14em] uppercase">
                  GLOBAL LOGISTICS SOLUTIONS
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[42px] font-black text-white leading-tight sm:leading-[1.16] tracking-tight">
                Let’s Build Smarter, Faster,<br />
                <span className="text-[#FFC107]">Greener Logistics</span> Together
              </h2>

              {/* Description */}
              <p className="text-[11px] xs:text-xs sm:text-sm md:text-base text-gray-200/90 font-light max-w-xl leading-normal sm:leading-relaxed">
                Empowering the future of logistics with speed, efficiency, and eco-conscious practices.
              </p>

              {/* Action Buttons — Horizontal & Compact on Mobile */}
              <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3.5 pt-1 sm:pt-2">
                {/* Primary CTA: Request A Quote */}
                <Link
                  href="/quote"
                  className="group inline-flex items-center justify-center space-x-1.5 bg-[#FFC107] hover:bg-[#FFD54F] text-[#073B2C] font-extrabold px-3.5 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-3 md:px-7 md:py-3.5 rounded-lg sm:rounded-xl shadow-xs hover:shadow-md transition-all duration-300 text-[11px] xs:text-xs sm:text-sm transform hover:-translate-y-0.5 select-none"
                >
                  <span>Request A Quote</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#073B2C] transform group-hover:translate-x-1 transition-transform duration-200 stroke-[2.5]" />
                </Link>

                {/* Secondary CTA: Explore Our Services */}
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center bg-[#073B2C]/50 hover:bg-[#073B2C]/80 border border-[#FFC107]/40 hover:border-[#FFC107] text-white font-bold px-3 py-1.5 xs:px-3.5 xs:py-2 sm:px-6 sm:py-3 md:px-7 md:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 text-[11px] xs:text-xs sm:text-sm backdrop-blur-sm transform hover:-translate-y-0.5 select-none"
                >
                  <span>Explore Services</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Realistic 3D Green Shipping Container Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
              className="lg:col-span-5 flex items-center justify-center lg:justify-end relative mt-1 sm:mt-2 lg:mt-0"
            >
              <div className="relative w-full max-w-[210px] xs:max-w-[240px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-none lg:w-[115%] lg:-mr-4">
                <img
                  src={containerImg}
                  alt="KPS Green Shipping Container — DELIVERY SMILE LOGISTICS"
                  className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)] transform hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
