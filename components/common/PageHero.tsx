'use client';

import React from 'react';

export interface PageHeroProps {
  title: string;
  description?: string;
  bgImage?: string;
  badge?: string | null;
}

export default function PageHero({
  title,
  description = '',
  bgImage = '',
  badge = null,
}: PageHeroProps) {
  return (
    <section className="relative min-h-[190px] sm:min-h-[220px] md:min-h-[250px] flex items-center justify-center bg-brand-green-dark text-white overflow-hidden pt-28 pb-8 sm:pt-32 sm:pb-9 md:pt-36 md:pb-11 text-center">
      {/* Background Image with Deep Gradient Overlay */}
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url('${bgImage}')` }}
        ></div>
      )}
      
      {/* Gradient & Lighting Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#073B2C]/90 via-[#073B2C]/80 to-[#073B2C]/95"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none"></div>

      {/* Centered Content Container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-2 sm:space-y-2.5">
          
          {badge && (
            <span className="inline-block bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1">
              {badge}
            </span>
          )}

          {/* Centered Name Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight text-white leading-tight">
            {title}
          </h1>

          {/* Yellow Decorative Accent Bar */}
          <div className="w-10 sm:w-12 h-[3px] bg-brand-yellow rounded-full mx-auto my-1"></div>

          {/* Centered Compact Description */}
          {description && (
            <p className="text-xs sm:text-sm md:text-base text-gray-200/90 font-light leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}

        </div>
      </div>
    </section>
  );
}
