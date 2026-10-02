'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { 
  ContainerizedCargoIcon, 
  FreightForwardingIcon, 
  ProjectMaritimeIcon, 
  OverDimensionalCargoIcon, 
  CustomsBrokerageIcon, 
  IndustrialWarehousingIcon, 
  FTWZSolutionsHubIcon 
} from '@/components/icons/ServiceLogisticsIcons';

export const servicesList7 = [
  {
    num: "01",
    title: "Containerized Cargo",
    path: "/services/containerized-cargo",
    icon: <ContainerizedCargoIcon className="w-8 h-8 sm:w-9 sm:h-9" />
  },
  {
    num: "02",
    title: "Freight Forwarding",
    path: "/services/freight-forwarding",
    icon: <FreightForwardingIcon className="w-8 h-8 sm:w-9 sm:h-9" />
  },
  {
    num: "03",
    title: "Project & Maritime",
    path: "/services/project-logistics",
    icon: <ProjectMaritimeIcon className="w-8 h-8 sm:w-9 sm:h-9" />
  },
  {
    num: "04",
    title: "Over Dimensional Cargo",
    path: "/services/odc",
    icon: <OverDimensionalCargoIcon className="w-8 h-8 sm:w-9 sm:h-9" />
  },
  {
    num: "05",
    title: "Customs Brokerage",
    path: "/services/customs-brokerage",
    icon: <CustomsBrokerageIcon className="w-8 h-8 sm:w-9 sm:h-9" />
  },
  {
    num: "06",
    title: "Industrial Warehousing",
    path: "/services/warehousing",
    icon: <IndustrialWarehousingIcon className="w-8 h-8 sm:w-9 sm:h-9" />
  },
  {
    num: "07",
    title: "FTWZ Solutions Hub",
    path: "/services/ftwz",
    icon: <FTWZSolutionsHubIcon className="w-8 h-8 sm:w-9 sm:h-9" />
  }
];

export default function ServicesSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#FAFDFB] text-brand-gray-dark border-t border-brand-gray-muted relative overflow-hidden">
      
      {/* Background Subtle Dot Matrix Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#073B2C_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header Matching Reference */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          
          {/* Eyebrow: — OUR SERVICES — */}
          <div className="flex items-center justify-center space-x-2.5">
            <span className="w-6 sm:w-8 h-[1.5px] bg-brand-green"></span>
            <span className="text-brand-green font-bold text-xs sm:text-[13px] uppercase tracking-widest">
              OUR SERVICES
            </span>
            <span className="w-6 sm:w-8 h-[1.5px] bg-brand-green"></span>
          </div>

          {/* Main Title: Comprehensive Logistics Solutions */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#0F261E] leading-tight">
            Comprehensive Logistics Solutions
          </h2>
          
          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            From containerized cargo to FTWZ solutions, we provide end-to-end logistics services tailored to your business needs.
          </p>
        </div>

        {/* 7 Services Grid with Smooth Independent 450ms Hover Transition */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {servicesList7.map((service) => (
              <Link
                key={service.num}
                href={service.path}
                className="group relative bg-white hover:bg-[#073B2C] rounded-[22px] p-5 sm:p-6 border border-slate-100 hover:border-[#073B2C] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(7,59,44,0.18)] hover:-translate-y-0.5 transition-[background-color,border-color,box-shadow,transform] duration-500 ease-in-out flex items-center justify-between overflow-hidden cursor-pointer select-none"
              >
                {/* Left Vibrant Orange Accent Bar (stays visible on hover) */}
                <span className="absolute left-0 top-3.5 bottom-3.5 w-[5px] bg-[#FF6A00] group-hover:bg-[#FFA14A] rounded-r-full transition-colors duration-500 ease-in-out"></span>

                {/* Left Side: Icon + Number & Title */}
                <div className="flex items-center space-x-4 sm:space-x-5 pl-2 min-w-0 flex-1">
                  
                  {/* Square / Rounded Icon Container */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#E8F7EE] group-hover:bg-white text-[#073B2C] flex items-center justify-center flex-shrink-0 transition-colors duration-500 ease-in-out shadow-2xs">
                    <div className="transition-transform duration-500 ease-in-out">
                      {service.icon}
                    </div>
                  </div>

                  {/* Content: Number & Title */}
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs sm:text-[13px] font-bold text-[#10B981] group-hover:text-white/90 transition-colors duration-500 ease-in-out mb-0.5">
                      {service.num}
                    </span>
                    <h3 className="text-base sm:text-[17px] font-extrabold text-[#0F261E] group-hover:text-white transition-colors duration-500 ease-in-out leading-snug">
                      {service.title}
                    </h3>
                  </div>

                </div>

                {/* Right Side: Circular Chevron Button */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-400 group-hover:text-[#073B2C] border border-slate-100 group-hover:border-white shadow-xs group-hover:shadow-md flex items-center justify-center flex-shrink-0 ml-3 transition-[color,border-color,box-shadow] duration-500 ease-in-out">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-500 ease-in-out stroke-[2.5]" />
                </div>

              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
