'use client';

import Link from 'next/link';
import { PhoneCall, ArrowRight, ShieldCheck, Mail, Clock } from 'lucide-react';
import { companyDetails } from '@/data/company';

export default function CTASection() {
  return (
    <section className="relative py-12 md:py-16 bg-brand-green-dark text-white overflow-hidden border-t border-brand-green/30">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-yellow/20 text-brand-yellow px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Pan-India Logistics Infrastructure</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Ready to Optimize Your Cross-Border Supply Chain?
          </h2>

          <p className="text-xs sm:text-sm text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Partner with KPS Worldwide Logistics for reliable customs brokerage, international freight forwarding, and specialized multi-axle ODC transport across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/quote"
              className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm transform hover:-translate-y-0.5"
            >
              <span>Request Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm backdrop-blur-sm"
            >
              <span>Contact Senior Engineers</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
