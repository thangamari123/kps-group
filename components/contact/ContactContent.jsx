'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Building2, ArrowRight, Headphones, Cog, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import ContactForm from '@/components/forms/ContactForm';
import { officesData } from '@/data/offices';
import { companyDetails } from '@/data/company';

export default function ContactContent() {
  const [selectedOffice, setSelectedOffice] = useState(null);

  const handleViewDetails = (office) => {
    let details = {};
    if (office.id === 'bengaluru') {
      details = { manager: "Branch Operations Head", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    } else if (office.id === 'tuticorin') {
      details = { manager: "Port Clearance Officer", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    } else if (office.id === 'visakhapatnam') {
      details = { manager: "Regional Customs Manager", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    } else if (office.id === 'kochi') {
      details = { manager: "Coastal Logistics Supervisor", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    }
    setSelectedOffice({ ...office, ...details });
  };

  return (
    <div className="bg-white">
      <PageHero 
        title="Contact Us" 
        description="Get in touch with KPS Worldwide Logistics for expert freight forwarding, customs clearance, and heavy project logistics."
        bgImage="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Redesigned Contact Us Section matching reference design */}
      <section className="relative overflow-hidden bg-white text-[#102B25] py-8 sm:py-10 md:py-12 lg:py-16">
        {/* Subtle pale-green decorative concentric curves in top right */}
        <div 
          aria-hidden="true" 
          className="absolute -top-28 -right-28 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full border-[28px] sm:border-[34px] border-[#E8F5EE] pointer-events-none opacity-85 select-none" 
        />
        <div 
          aria-hidden="true" 
          className="absolute -top-48 -right-48 w-[560px] sm:w-[680px] h-[560px] sm:h-[680px] rounded-full border-[32px] sm:border-[40px] border-[#F2F8F4] pointer-events-none opacity-65 select-none" 
        />
        {/* Soft pale green radial aura in bottom left */}
        <div 
          aria-hidden="true" 
          className="absolute -bottom-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-tr from-[#EBF6F0] via-[#F3F9F5] to-transparent pointer-events-none opacity-80 blur-2xl select-none" 
        />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* A. Section Heading */}
          <div className="mb-6 sm:mb-8 text-left">
            <span className="text-[#006B4F] font-bold text-xs uppercase tracking-wider block mb-1">
              GET IN TOUCH
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#102B25] tracking-tight leading-tight mb-2">
              KPS Worldwide Logistics
            </h2>
            <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed max-w-3xl">
              Simplifying Global Trade, One Shipment at a Time. Experience seamless logistics with KPS Worldwide Logistics.
            </p>
          </div>

          {/* B. Contact Information Cards (Responsive 2-column grid on mobile, 4 columns on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            
            {/* Card 1: Phone Hotline */}
            <div className="group bg-[#F0F8F3] hover:bg-[#FFFDF0] border border-[#E2EFE7] hover:border-[#ffc107] rounded-2xl sm:rounded-[20px] p-3 sm:p-5 lg:p-5.5 text-center flex flex-col items-center justify-start h-full shadow-2xs hover:shadow-lg hover:shadow-[#ffc107]/25 hover:-translate-y-1 focus-within:border-[#ffc107] focus-within:ring-2 focus-within:ring-[#ffc107]/40 focus-within:-translate-y-1 transition-all duration-300 ease-in-out motion-reduce:hover:translate-y-0 motion-reduce:transition-none cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#073B2C] group-hover:bg-[#ffc107] text-white group-hover:text-[#073B2C] flex items-center justify-center mb-2.5 sm:mb-3 shadow-xs shrink-0 transition-colors duration-300">
                <Phone className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white group-hover:text-[#073B2C] transition-colors duration-300" />
              </div>
              <span className="block text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#586779] group-hover:text-[#073B2C] mb-1 sm:mb-1.5 transition-colors duration-300 leading-tight">
                PHONE HOTLINE
              </span>
              <a 
                href={`tel:${companyDetails.contact.phone.replace(/[\s-]/g, '')}`}
                className="text-xs sm:text-[15px] lg:text-[17px] font-extrabold text-[#073B2C] group-hover:text-[#073B2C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffc107] focus:ring-offset-2 rounded-md px-0.5 sm:px-1"
              >
                {companyDetails.contact.phone}
              </a>
            </div>

            {/* Card 2: Direct Email Inquiries */}
            <div className="group bg-[#F0F8F3] hover:bg-[#FFFDF0] border border-[#E2EFE7] hover:border-[#ffc107] rounded-2xl sm:rounded-[20px] p-3 sm:p-5 lg:p-5.5 text-center flex flex-col items-center justify-start h-full shadow-2xs hover:shadow-lg hover:shadow-[#ffc107]/25 hover:-translate-y-1 focus-within:border-[#ffc107] focus-within:ring-2 focus-within:ring-[#ffc107]/40 focus-within:-translate-y-1 transition-all duration-300 ease-in-out motion-reduce:hover:translate-y-0 motion-reduce:transition-none cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#073B2C] group-hover:bg-[#ffc107] text-white group-hover:text-[#073B2C] flex items-center justify-center mb-2.5 sm:mb-3 shadow-xs shrink-0 transition-colors duration-300">
                <Mail className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white group-hover:text-[#073B2C] transition-colors duration-300" />
              </div>
              <span className="block text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#586779] group-hover:text-[#073B2C] mb-1 sm:mb-1.5 transition-colors duration-300 leading-tight">
                DIRECT EMAIL INQUIRIES
              </span>
              <div className="space-y-0.5 w-full">
                <a 
                  href="mailto:Rajeswari.s@kpsgroups.net" 
                  className="block text-[9.5px] sm:text-xs lg:text-[13px] font-bold text-[#006B4F] group-hover:text-[#073B2C] hover:underline transition-colors break-all focus:outline-none focus:ring-2 focus:ring-[#ffc107] focus:ring-offset-2 rounded-md px-0.5 sm:px-1"
                >
                  Rajeswari.s@kpsgroups.net
                </a>
                <a 
                  href="mailto:Jaikumar@kpsgroups.net" 
                  className="block text-[9.5px] sm:text-xs lg:text-[13px] font-bold text-[#006B4F] group-hover:text-[#073B2C] hover:underline transition-colors break-all focus:outline-none focus:ring-2 focus:ring-[#ffc107] focus:ring-offset-2 rounded-md px-0.5 sm:px-1"
                >
                  Jaikumar@kpsgroups.net
                </a>
              </div>
            </div>

            {/* Card 3: Corporate Office (Parrys) */}
            <div className="group bg-[#F0F8F3] hover:bg-[#FFFDF0] border border-[#E2EFE7] hover:border-[#ffc107] rounded-2xl sm:rounded-[20px] p-3 sm:p-5 lg:p-5.5 text-center flex flex-col items-center justify-start h-full shadow-2xs hover:shadow-lg hover:shadow-[#ffc107]/25 hover:-translate-y-1 focus-within:border-[#ffc107] focus-within:ring-2 focus-within:ring-[#ffc107]/40 focus-within:-translate-y-1 transition-all duration-300 ease-in-out motion-reduce:hover:translate-y-0 motion-reduce:transition-none cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#073B2C] group-hover:bg-[#ffc107] text-white group-hover:text-[#073B2C] flex items-center justify-center mb-2.5 sm:mb-3 shadow-xs shrink-0 transition-colors duration-300">
                <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white group-hover:text-[#073B2C] transition-colors duration-300" />
              </div>
              <span className="block text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#586779] group-hover:text-[#073B2C] mb-1 sm:mb-1.5 transition-colors duration-300 leading-tight">
                CORPORATE OFFICE (PARRYS)
              </span>
              <p className="text-[9.5px] sm:text-[11px] lg:text-xs text-[#586779] group-hover:text-[#102B25] leading-relaxed font-normal transition-colors duration-300">
                No. 14, 6th Floor, A.K. Nayak Bhavan, Jahangir Street, Second Line Beach, Parrys, Chennai - 600 001.
              </p>
            </div>

            {/* Card 4: Regional Office (Guindy) */}
            <div className="group bg-[#F0F8F3] hover:bg-[#FFFDF0] border border-[#E2EFE7] hover:border-[#ffc107] rounded-2xl sm:rounded-[20px] p-3 sm:p-5 lg:p-5.5 text-center flex flex-col items-center justify-start h-full shadow-2xs hover:shadow-lg hover:shadow-[#ffc107]/25 hover:-translate-y-1 focus-within:border-[#ffc107] focus-within:ring-2 focus-within:ring-[#ffc107]/40 focus-within:-translate-y-1 transition-all duration-300 ease-in-out motion-reduce:hover:translate-y-0 motion-reduce:transition-none cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#073B2C] group-hover:bg-[#ffc107] text-white group-hover:text-[#073B2C] flex items-center justify-center mb-2.5 sm:mb-3 shadow-xs shrink-0 transition-colors duration-300">
                <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white group-hover:text-[#073B2C] transition-colors duration-300" />
              </div>
              <span className="block text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#586779] group-hover:text-[#073B2C] mb-1 sm:mb-1.5 transition-colors duration-300 leading-tight">
                REGIONAL OFFICE (GUINDY)
              </span>
              <p className="text-[9.5px] sm:text-[11px] lg:text-xs text-[#586779] group-hover:text-[#102B25] leading-relaxed font-normal transition-colors duration-300">
                Flat No. 5B, 5th Floor, Kences Towers, No. 1, Ramakrishna Street, North Usman Road, T. Nagar, Chennai - 600 017.
              </p>
            </div>

          </div>

          {/* C. Main Contact Form & Information Panel */}
          <div className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Dark Forest Green Contact Form (~60-62%) */}
            <div className="lg:col-span-7 xl:col-span-7 w-full order-1">
              <ContactForm />
            </div>

            {/* Right Column: Information Panel (~38-40%) */}
            <div className="lg:col-span-5 xl:col-span-5 w-full flex flex-col justify-center order-2 lg:pt-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#102B25] tracking-tight">
                Send Us a Message
              </h3>
              {/* Green horizontal accent bar matching design reference */}
              <div className="w-11 h-1 bg-[#006B4F] rounded-full mt-2.5 mb-4" />
              
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed mb-6 font-normal">
                Our team of logistics professionals is ready to assist you with tailored solutions for your supply chain, freight, and global movement needs. Share your requirements with us and we will get back to you shortly.
              </p>

              {/* 3 Benefit Rows */}
              <div className="space-y-4 sm:space-y-4.5">
                {/* Benefit 1: Quick Response */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E2F3EB] text-[#073B2C] flex items-center justify-center shrink-0 shadow-2xs">
                    <Headphones className="w-5 h-5 text-[#073B2C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#102B25] leading-snug">
                      Quick Response
                    </h4>
                    <p className="text-xs text-[#586779]">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                {/* Benefit 2: Customized Solutions */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E2F3EB] text-[#073B2C] flex items-center justify-center shrink-0 shadow-2xs">
                    <Cog className="w-5 h-5 text-[#073B2C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#102B25] leading-snug">
                      Customized Solutions
                    </h4>
                    <p className="text-xs text-[#586779]">
                      Tailored to your business needs
                    </p>
                  </div>
                </div>

                {/* Benefit 3: Trusted Partner */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E2F3EB] text-[#073B2C] flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 text-[#073B2C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#102B25] leading-snug">
                      Trusted Partner
                    </h4>
                    <p className="text-xs text-[#586779]">
                      Reliable & professional support
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Pan-India Branch Network Section */}
      <section 
        aria-labelledby="branch-network-heading"
        className="relative overflow-hidden bg-gradient-to-b from-[#F2FBF6]/80 via-white to-[#F4FAF7]/90 py-12 sm:py-16 md:py-20 border-t border-[#D8EAE1]"
      >
        {/* Faint maritime port illustration on the left */}
        <div 
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] lg:w-[480px] pointer-events-none select-none overflow-hidden opacity-90 z-0"
          style={{
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)'
          }}
        >
          <svg 
            viewBox="0 0 480 340" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover object-left opacity-[0.20]"
          >
            {/* Birds in flight */}
            <path d="M60 40 Q70 32 80 38 Q90 32 100 40" stroke="#006B4F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M85 54 Q93 48 101 53 Q109 48 117 54" stroke="#006B4F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M115 36 Q122 30 129 35 Q136 30 143 36" stroke="#006B4F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M130 68 Q136 63 142 67 Q148 63 154 68" stroke="#006B4F" strokeWidth="1" strokeLinecap="round" fill="none" />

            {/* Front Gantry Crane 1 */}
            <path d="M35 310 L70 135 L110 135 L140 310" stroke="#006B4F" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M43 260 L132 260" stroke="#006B4F" strokeWidth="1.8" />
            <path d="M53 210 L122 210" stroke="#006B4F" strokeWidth="1.8" />
            <path d="M63 160 L113 160" stroke="#006B4F" strokeWidth="1.8" />
            <path d="M43 260 L122 210" stroke="#006B4F" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M132 260 L53 210" stroke="#006B4F" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M53 210 L113 160" stroke="#006B4F" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M122 210 L63 160" stroke="#006B4F" strokeWidth="1.2" strokeDasharray="3 3" />
            {/* Machinery Cab & Mast */}
            <rect x="73" y="110" width="34" height="25" fill="#006B4F" fillOpacity="0.25" stroke="#006B4F" strokeWidth="1.8" />
            <path d="M90 110 L90 60 L110 110" stroke="#006B4F" strokeWidth="2" />
            <path d="M90 60 L70 110" stroke="#006B4F" strokeWidth="2" />
            {/* Horizontal Crane Boom */}
            <path d="M0 115 L260 115" stroke="#006B4F" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M25 105 L230 105" stroke="#006B4F" strokeWidth="1.8" />
            <path d="M90 60 L220 115" stroke="#006B4F" strokeWidth="1.4" />
            <path d="M90 60 L160 115" stroke="#006B4F" strokeWidth="1.2" />
            <path d="M90 60 L35 115" stroke="#006B4F" strokeWidth="1.4" />
            <path d="M125 105 L135 115 L145 105 L155 115 L165 105 L175 115 L185 105 L195 115" stroke="#006B4F" strokeWidth="1" />
            {/* Trolley & Suspended Cargo */}
            <rect x="170" y="115" width="16" height="8" fill="#006B4F" fillOpacity="0.4" />
            <line x1="174" y1="123" x2="174" y2="160" stroke="#006B4F" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="182" y1="123" x2="182" y2="160" stroke="#006B4F" strokeWidth="1" strokeDasharray="2 2" />
            <rect x="168" y="160" width="20" height="12" fill="#006B4F" fillOpacity="0.3" stroke="#006B4F" strokeWidth="1.2" />

            {/* Rear Gantry Crane 2 */}
            <path d="M150 290 L175 155 L205 155 L228 290" stroke="#006B4F" strokeWidth="1.8" />
            <path d="M158 245 L220 245" stroke="#006B4F" strokeWidth="1.4" />
            <path d="M164 205 L214 205" stroke="#006B4F" strokeWidth="1.4" />
            <path d="M178 155 L190 95 L202 155" stroke="#006B4F" strokeWidth="1.5" />
            <path d="M110 140 L310 140" stroke="#006B4F" strokeWidth="2" strokeLinecap="round" />
            <path d="M190 95 L290 140" stroke="#006B4F" strokeWidth="1.2" />
            <path d="M190 95 L130 140" stroke="#006B4F" strokeWidth="1.2" />

            {/* Cargo Ship Hull & Sea Waterline */}
            <path d="M0 250 L18 245 L58 245 L80 275 L0 275 Z" fill="#006B4F" fillOpacity="0.15" stroke="#006B4F" strokeWidth="1.5" />
            <rect x="10" y="230" width="18" height="15" fill="#006B4F" fillOpacity="0.2" stroke="#006B4F" strokeWidth="1" />
            <rect x="29" y="230" width="18" height="15" fill="#006B4F" fillOpacity="0.25" stroke="#006B4F" strokeWidth="1" />
            <rect x="15" y="215" width="18" height="15" fill="#006B4F" fillOpacity="0.2" stroke="#006B4F" strokeWidth="1" />
            <path d="M0 275 Q50 270 100 275 T200 275 T300 275" stroke="#006B4F" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M0 285 Q60 280 120 285 T240 285" stroke="#006B4F" strokeWidth="1" strokeOpacity="0.3" fill="none" />
          </svg>
        </div>

        {/* Faint world map & logistics network graphic on the right */}
        <div 
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-[240px] sm:w-[320px] md:w-[420px] lg:w-[480px] pointer-events-none select-none overflow-hidden opacity-90 z-0"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)'
          }}
        >
          <svg 
            viewBox="0 0 480 340" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover object-right opacity-[0.20]"
          >
            {/* Dotted Global Grid */}
            <g fill="#006B4F" opacity="0.45">
              <circle cx="190" cy="75" r="1.5" /><circle cx="205" cy="78" r="1.5" /><circle cx="220" cy="74" r="1.5" />
              <circle cx="185" cy="90" r="1.5" /><circle cx="200" cy="92" r="1.5" /><circle cx="215" cy="88" r="1.5" />
              <circle cx="230" cy="85" r="1.5" /><circle cx="245" cy="86" r="1.5" /><circle cx="260" cy="82" r="1.5" />
              <circle cx="195" cy="110" r="1.5" /><circle cx="210" cy="107" r="1.5" /><circle cx="225" cy="105" r="1.5" />
              <circle cx="240" cy="102" r="1.5" /><circle cx="255" cy="100" r="1.5" /><circle cx="270" cy="98" r="1.5" />
              {/* India Peninsula */}
              <circle cx="220" cy="125" r="2" /><circle cx="230" cy="122" r="2" /><circle cx="240" cy="126" r="2" />
              <circle cx="225" cy="138" r="2" /><circle cx="235" cy="135" r="2" />
              <circle cx="230" cy="152" r="2.5" />
              {/* East Asia */}
              <circle cx="290" cy="90" r="1.5" /><circle cx="305" cy="88" r="1.5" /><circle cx="320" cy="84" r="1.5" />
              <circle cx="300" cy="105" r="1.5" /><circle cx="315" cy="102" r="1.5" /><circle cx="330" cy="100" r="1.5" />
              {/* Southeast Asia & Australia */}
              <circle cx="280" cy="142" r="1.5" /><circle cx="295" cy="148" r="1.5" /><circle cx="310" cy="152" r="1.5" />
              <circle cx="320" cy="180" r="1.5" /><circle cx="335" cy="185" r="1.5" /><circle cx="350" cy="190" r="1.5" />
              <circle cx="315" cy="202" r="1.5" /><circle cx="330" cy="206" r="1.5" /><circle cx="345" cy="210" r="1.5" />
              <circle cx="360" cy="205" r="1.5" /><circle cx="340" cy="225" r="1.5" /><circle cx="355" cy="230" r="1.5" />
              {/* Middle East & Africa */}
              <circle cx="140" cy="125" r="1.5" /><circle cx="155" cy="120" r="1.5" /><circle cx="170" cy="122" r="1.5" />
              <circle cx="135" cy="142" r="1.5" /><circle cx="150" cy="138" r="1.5" /><circle cx="165" cy="140" r="1.5" />
              <circle cx="145" cy="162" r="1.5" /><circle cx="160" cy="160" r="1.5" /><circle cx="155" cy="182" r="1.5" />
            </g>

            {/* Maritime Trade Routes / Flight Lines */}
            <path d="M230 152 Q265 132 300 155" stroke="#006B4F" strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M230 152 Q190 108 150 112" stroke="#006B4F" strokeWidth="1.5" strokeDasharray="4 3" />
            <path d="M230 152 Q280 192 335 206" stroke="#006B4F" strokeWidth="1.2" strokeDasharray="4 3" />
            <path d="M315 102 Q340 152 335 206" stroke="#006B4F" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M150 112 Q220 78 300 102" stroke="#006B4F" strokeWidth="1" strokeDasharray="3 3" />

            {/* Network Nodes */}
            <circle cx="230" cy="152" r="4.5" fill="#006B4F" fillOpacity="0.8" />
            <circle cx="230" cy="152" r="8" stroke="#006B4F" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="300" cy="155" r="3.5" fill="#006B4F" fillOpacity="0.7" />
            <circle cx="300" cy="155" r="6.5" stroke="#006B4F" strokeWidth="0.8" strokeOpacity="0.4" />
            <circle cx="150" cy="112" r="3.5" fill="#006B4F" fillOpacity="0.7" />
            <circle cx="150" cy="112" r="6.5" stroke="#006B4F" strokeWidth="0.8" strokeOpacity="0.4" />
            <circle cx="315" cy="102" r="3.5" fill="#006B4F" fillOpacity="0.7" />
            <circle cx="335" cy="206" r="3.5" fill="#006B4F" fillOpacity="0.7" />
          </svg>
        </div>

        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Centered Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14">
            <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3 mb-2.5">
              <span className="w-8 sm:w-12 h-px bg-[#006B4F]/35" aria-hidden="true" />
              <span className="text-[#006B4F] font-bold text-xs sm:text-[13px] tracking-[0.18em] uppercase">
                PAN-INDIA BRANCH NETWORK
              </span>
              <span className="w-8 sm:w-12 h-px bg-[#006B4F]/35" aria-hidden="true" />
            </div>
            
            <h2 
              id="branch-network-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-extrabold text-[#073B2C] tracking-tight leading-tight mb-2.5"
            >
              Regional Operations Across Major Maritime Hubs
            </h2>
            
            <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed max-w-2xl mx-auto">
              Direct presence and dedicated liaison counters across key commercial corridors and sea ports in India.
            </p>
          </div>

          {/* Branch Cards Responsive Grid */}
          <div className="branch-grid">
            {officesData.map((office) => (
              <div 
                key={office.id}
                className="group relative bg-white border border-[#D8EAE1] hover:border-[#ffc107] rounded-[20px] p-4 sm:p-5 md:p-5.5 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(7,59,44,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(7,59,44,0.12),0_0_0_1px_rgba(255,193,7,0.3)] hover:-translate-y-1 transition-all duration-300 ease-in-out motion-reduce:hover:translate-y-0 motion-reduce:transition-none"
              >
                {/* Decorative Mint-Green Corner Pill Shape in Top-Right */}
                <span 
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 w-6 sm:w-7 h-1 sm:h-1.5 rounded-full bg-[#B2E4CF] opacity-80 group-hover:bg-[#ffc107] transition-colors duration-300 pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Card Top: Location Icon & Branch Heading */}
                <div>
                  <div className="flex items-center gap-2.5 sm:gap-3.5 pr-6 sm:pr-8">
                    {/* Mint-Green Circular Location Icon */}
                    <div 
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0 border border-[#D8EAE1]/70 group-hover:bg-[#E0F4EA] transition-colors duration-300"
                    >
                      <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-[#006B4F]" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path 
                          fillRule="evenodd" 
                          clipRule="evenodd" 
                          d="M12 2C7.58172 2 4 5.58172 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58172 16.4183 2 12 2ZM12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 11.6569 13.6569 13 12 13Z" 
                        />
                      </svg>
                    </div>

                    {/* Branch Name & Short Accent Line */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-[#073B2C] text-xs sm:text-sm md:text-[15px] tracking-wider uppercase leading-tight truncate">
                        {office.city}
                      </h3>
                      <div 
                        className="w-6 sm:w-7 md:w-8 h-[2.5px] bg-[#006B4F] rounded-full mt-1 sm:mt-1.5 group-hover:w-10 group-hover:bg-[#073B2C] transition-all duration-300" 
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Card Middle: Building Icon & Address */}
                  <div className="mt-3.5 sm:mt-4 md:mt-4.5 flex items-start gap-2 sm:gap-2.5">
                    <Building2 
                      className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#64748B] shrink-0 mt-0.5" 
                      strokeWidth={1.75} 
                      aria-hidden="true"
                    />
                    <p className="text-[11px] sm:text-xs md:text-[13px] text-[#586779] leading-relaxed font-normal break-words">
                      {office.address}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Subtle Divider & View Details Button */}
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-3.5 border-t border-[#EBF3EF] flex items-center justify-end">
                  <button 
                    type="button"
                    onClick={() => handleViewDetails(office)}
                    className="inline-flex items-center gap-1.5 sm:gap-2 group/btn cursor-pointer py-1 px-1 -mr-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107] focus-visible:ring-offset-2 transition-all"
                    aria-label={`View details for ${office.city} branch`}
                  >
                    <span className="text-[11px] sm:text-xs md:text-[13px] font-bold text-[#073B2C] group-hover/btn:text-[#006B4F] transition-colors">
                      View Details
                    </span>
                    <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#073B2C] text-white flex items-center justify-center shadow-xs transition-colors duration-200 group-hover:bg-[#ffc107] group-hover:text-[#073B2C] group-hover/btn:bg-[#ffc107] group-hover/btn:text-[#073B2C] shrink-0">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover/btn:translate-x-0.5" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Details Modal */}
      <AnimatePresence>
        {selectedOffice && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="office-modal-title"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-[#D8EAE1] space-y-4"
            >
              <button 
                onClick={() => setSelectedOffice(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#F2F8F4] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] text-[#073B2C] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                aria-label="Close office details"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2.5 border-b border-[#EBF3EF] pb-3.5 pr-8">
                <div className="w-8 h-8 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#006B4F]" />
                </div>
                <h4 id="office-modal-title" className="text-lg font-bold text-[#073B2C]">
                  {selectedOffice.city} Branch Office
                </h4>
              </div>

              <div className="space-y-3 text-xs sm:text-[13px] text-[#586779] leading-relaxed">
                <div>
                  <strong className="text-[#073B2C] font-bold block mb-0.5">Address:</strong>
                  <p>{selectedOffice.address}</p>
                </div>
                {selectedOffice.manager && (
                  <div>
                    <strong className="text-[#073B2C] font-bold block mb-0.5">Operations Lead:</strong>
                    <p>{selectedOffice.manager}</p>
                  </div>
                )}
                {selectedOffice.hours && (
                  <div>
                    <strong className="text-[#073B2C] font-bold block mb-0.5">Working Hours:</strong>
                    <p>{selectedOffice.hours}</p>
                  </div>
                )}
                <div>
                  <strong className="text-[#073B2C] font-bold block mb-0.5">Central Support Desk:</strong>
                  <p>044 - 45088099 | info@kpsgroups.net</p>
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#EBF3EF] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOffice(null)}
                  className="bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
