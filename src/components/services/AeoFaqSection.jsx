import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Check, Copy } from 'lucide-react';

export default function AeoFaqSection({ faqs = [], serviceTitle = "" }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const handleCopy = (text, idx, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 pt-10 border-t border-brand-gray-muted">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-yellow-dark font-bold text-xs uppercase tracking-widest mb-1.5">
            <HelpCircle className="w-4 h-4 text-brand-yellow-dark" />
            <span>Answer Engine Optimization (AEO)</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-brand-gray mt-1 max-w-2xl font-light">
            Direct, authoritative answers regarding {serviceTitle.toLowerCase() || "this service"}, structured for fast retrieval and enterprise evaluation.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'border-brand-green/40 shadow-sm bg-white' 
                  : 'border-brand-gray-muted/80 bg-[#fbfcfc] hover:border-brand-green/30'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className={`w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors duration-200 ${
                  isOpen ? 'bg-gradient-to-r from-[#f0f9f4] to-white text-brand-green-dark' : 'hover:bg-white text-brand-green-dark'
                }`}
              >
                <div className="flex items-center space-x-3.5 pr-4 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isOpen ? 'bg-brand-green text-brand-yellow' : 'bg-brand-gray-light text-brand-gray'
                  }`}>
                    Q{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold leading-snug">
                    {faq.question}
                  </span>
                </div>
                
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'bg-brand-green text-brand-yellow rotate-180' : 'bg-brand-gray-light text-brand-gray'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="p-4 sm:p-5 pt-1 sm:pt-2 border-t border-[#e9ecef]/60 text-xs sm:text-sm text-brand-gray-dark leading-relaxed">
                      <div className="bg-[#f8f9fa] rounded-xl p-4 border border-brand-gray-muted/60 relative">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-normal text-brand-green-dark leading-relaxed text-xs sm:text-sm pr-6">
                            {faq.answer}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(faq.answer, idx, e)}
                            className="text-brand-gray hover:text-brand-green transition-colors p-1 rounded hover:bg-white"
                            title="Copy Answer"
                          >
                            {copiedIdx === idx ? (
                              <Check className="w-3.5 h-3.5 text-brand-green" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
