'use client';

import { useState } from 'react';
import { companyDetails } from '@/data/company';

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = companyDetails.contact.whatsappUrl || 'https://wa.me/919884388099?text=Hello%20KPS%20Worldwide%20Logistics%2C%20I%20would%20like%20to%20inquire%20about%20your%20logistics%20services.';

  return (
    <div className="fixed bottom-18 right-4 sm:bottom-22 sm:right-6 z-40 flex items-center flex-row-reverse">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 sm:p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
        aria-label="Chat with KPS Worldwide Logistics on WhatsApp (9884388099)"
      >
        {/* Pulse ring animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
          className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300 group-hover:rotate-12 drop-shadow-sm"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.69C7.02 10.9 7.9 12.07 8.02 12.23C8.14 12.39 9.75 14.88 12.21 15.94C12.8 16.19 13.25 16.34 13.61 16.46C14.2 16.65 14.74 16.62 15.16 16.56C15.63 16.49 16.61 15.97 16.82 15.39C17.02 14.8 17.02 14.3 16.96 14.2C16.9 14.1 16.74 14.04 16.5 13.92C16.26 13.8 15.08 13.22 14.86 13.14C14.64 13.06 14.48 13.02 14.32 13.26C14.16 13.51 13.7 14.1 13.56 14.26C13.42 14.42 13.28 14.44 13.04 14.32C12.8 14.2 11.79 13.87 10.59 12.8C9.66 11.97 9.03 10.94 8.91 10.74C8.79 10.53 8.9 10.42 9.02 10.3C9.13 10.19 9.26 10.01 9.38 9.87C9.5 9.73 9.54 9.63 9.62 9.47C9.7 9.31 9.66 9.17 9.6 9.05C9.54 8.93 9.08 7.79 8.89 7.33H8.53Z" />
        </svg>

        {/* Online Status Green Dot */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white"></span>
        </span>
      </a>

      {/* Floating Tooltip / Label */}
      <div
        className={`hidden sm:flex items-center mr-3 bg-slate-900/95 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xl backdrop-blur-xs transition-all duration-300 pointer-events-none whitespace-nowrap border border-slate-700/50 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span>Chat on WhatsApp</span>
        <span className="text-[#25D366] ml-1.5 font-bold">+91 9884388099</span>
      </div>
    </div>
  );
}
