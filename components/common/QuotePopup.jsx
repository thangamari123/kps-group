'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadForm from '@/components/forms/LeadForm';

const kpsLogo = '/images/kpslogo.webp';

export default function QuotePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Listen for manual trigger events from header / CTA buttons
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-quote-modal', handleOpenModal);

    // Auto-open when visiting the website if not already on /quote page
    if (pathname !== '/quote') {
      const alreadyShown = sessionStorage.getItem('kps_quote_popup_shown');
      if (!alreadyShown) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('kps_quote_popup_shown', 'true');
        }, 1200); // 1.2s delay on first visit

        return () => {
          clearTimeout(timer);
          window.removeEventListener('open-quote-modal', handleOpenModal);
        };
      }
    }

    return () => window.removeEventListener('open-quote-modal', handleOpenModal);
  }, [pathname]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    sessionStorage.setItem('kps_quote_popup_shown', 'true');
  };

  return (
    <>
      {/* Floating Action Launcher Button (Compact on Mobile, Full on Desktop) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2 bg-[#14533d] hover:bg-[#0e3f2e] text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl border-2 border-brand-yellow hover:border-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-yellow cursor-pointer"
          aria-label="Request Instant Quote"
        >
          <div className="w-6 h-6 rounded-full bg-brand-yellow text-brand-green-dark flex items-center justify-center font-bold text-xs group-hover:rotate-12 transition-transform shadow-xs">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline font-extrabold text-xs tracking-wide">
            Request a Quote
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
          </span>
        </button>
      </div>

      {/* Popup Modal (Matches UI Design Screenshot - Small & Compact) */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-h-[94vh] flex flex-col p-3 sm:p-4 md:p-5"
            >
              {/* Close Button Top-Right (Compact & Clean) */}
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-20 cursor-pointer"
                aria-label="Close Quote Popup"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-gray-800" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto pr-0.5">
                {/* Top Header with Compact Logo & Small Typography */}
                <div className="text-center mb-2.5 sm:mb-3">
                  {/* Logo */}
                  <div className="flex justify-center mb-0.5">
                    <img
                      src={kpsLogo}
                      alt="KPS Worldwide Logistics Logo"
                      className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                    />
                  </div>
                  
                  {/* Tagline under Logo */}
                  <span className="block text-[8px] sm:text-[9px] font-bold text-gray-600 tracking-[0.16em] uppercase mb-0.5 sm:mb-1">
                    KPS WORLDWIDE LOGISTICS
                  </span>

                  {/* Heading - Compact & Small Size for mobile and desktop */}
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-[#0f3c2d] tracking-tight leading-snug">
                    Get a Custom Logistics Quote
                  </h3>
                </div>

                {/* Form Body */}
                <LeadForm isModal={true} onClose={closeModal} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
