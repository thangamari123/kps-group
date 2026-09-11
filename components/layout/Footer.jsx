'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Ship, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from '@/components/common/SocialIcons';
import { navigationData } from '@/data/navigation';
import { companyDetails } from '@/data/company';
const kpsLogo = '/images/kpslogo.webp';

export default function Footer() {
  const [openSections, setOpenSections] = useState({
    services: false,
    quickLinks: false,
    connect: false,
    offices: false
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <footer className="bg-brand-green-dark text-white pt-10 sm:pt-14 pb-8 border-t border-brand-green-light/40">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Main Footer Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-10 mb-8 sm:mb-12">
          
          {/* Column 1: Company Branding & Summary (Always Visible) */}
          <div className="lg:col-span-2 space-y-3.5 pb-4 md:pb-0 border-b md:border-b-0 border-white/10">
            <Link href="/" className="inline-block group" aria-label="KPS Worldwide Logistics Home">
              <div className="inline-block bg-white/95 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl shadow-md border border-white/20 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={kpsLogo} 
                  alt="KPS Worldwide Logistics Logo" 
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
            </Link>
            
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm font-light">
              <strong className="text-white font-semibold block mb-0.5">Global Supply Chains. Engineered to Scale.</strong>
              Your premier partner for containerized freight, global break bulk, RoRo operations, and complex over dimensional cargo.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-2.5 pt-1">
              <a
                href={companyDetails.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-brand-green border border-brand-green-light flex items-center justify-center text-gray-300 hover:text-brand-yellow hover:bg-white transition-all duration-200 shadow-2xs"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={companyDetails.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-brand-green border border-brand-green-light flex items-center justify-center text-gray-300 hover:text-brand-yellow hover:bg-white transition-all duration-200 shadow-2xs"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={companyDetails.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-brand-green border border-brand-green-light flex items-center justify-center text-gray-300 hover:text-brand-yellow hover:bg-white transition-all duration-200 shadow-2xs"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Core Services (Fold on Mobile, Open Grid on Desktop) */}
          <div className="border-b md:border-b-0 border-white/10 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('services')}
              className="w-full md:cursor-default flex items-center justify-between text-left py-1.5 md:py-0 group"
            >
              <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider relative inline-block">
                Core Services
                <span className="hidden md:block absolute -bottom-2 left-0 w-6 h-[2px] bg-brand-yellow"></span>
              </h3>
              <span className="md:hidden p-1 rounded bg-white/10 text-brand-yellow transition-transform duration-200">
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.services ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* Content: Collapsible on mobile, block on desktop */}
            <div className={`${openSections.services ? 'block' : 'hidden'} md:block pt-3 md:pt-4`}>
              <ul className="space-y-2">
                {navigationData.footer.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-gray-300 hover:text-brand-yellow text-xs transition-colors duration-150 flex items-center group py-0.5"
                    >
                      <span className="w-1 h-1 bg-brand-yellow rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Column 3: Quick Links (Fold on Mobile, Open Grid on Desktop) */}
          <div className="border-b md:border-b-0 border-white/10 pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('quickLinks')}
              className="w-full md:cursor-default flex items-center justify-between text-left py-1.5 md:py-0 group"
            >
              <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider relative inline-block">
                Quick Links
                <span className="hidden md:block absolute -bottom-2 left-0 w-6 h-[2px] bg-brand-yellow"></span>
              </h3>
              <span className="md:hidden p-1 rounded bg-white/10 text-brand-yellow transition-transform duration-200">
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.quickLinks ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* Content: Collapsible on mobile, block on desktop */}
            <div className={`${openSections.quickLinks ? 'block' : 'hidden'} md:block pt-3 md:pt-4`}>
              <ul className="space-y-2">
                {navigationData.footer.quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-gray-300 hover:text-brand-yellow text-xs transition-colors duration-150 flex items-center group py-0.5"
                    >
                      <span className="w-1 h-1 bg-brand-yellow rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Column 4: Connect & Support (Fold on Mobile, Open Grid on Desktop) */}
          <div className="pb-3 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('connect')}
              className="w-full md:cursor-default flex items-center justify-between text-left py-1.5 md:py-0 group"
            >
              <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider relative inline-block">
                Connect With Us
                <span className="hidden md:block absolute -bottom-2 left-0 w-6 h-[2px] bg-brand-yellow"></span>
              </h3>
              <span className="md:hidden p-1 rounded bg-white/10 text-brand-yellow transition-transform duration-200">
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSections.connect ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* Content: Collapsible on mobile, block on desktop */}
            <div className={`${openSections.connect ? 'block' : 'hidden'} md:block pt-3 md:pt-4`}>
              <ul className="space-y-3.5 text-xs">
                <li className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                  <a href="tel:044-45088099" className="text-gray-200 hover:text-brand-yellow font-medium transition-colors">
                    044 - 45088099
                  </a>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                  <a href="mailto:info@kpsgroups.net" className="text-gray-200 hover:text-brand-yellow font-medium transition-colors">
                    info@kpsgroups.net
                  </a>
                </li>
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 leading-relaxed text-xs">
                    No:14, 6th Floor, A.K. Nayak Bhavan<br />
                    Jahangir Street, Second Line Beach, Parrys,<br />
                    Chennai - 600 001,<br />
                    Tamil Nadu, India
                  </p>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
        
        {/* Footer Bottom Legal Bar */}
        <div className="border-t border-brand-green/40 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-gray-400 text-[11px] sm:text-xs">
            &copy; 2026 KPS Worldwide Logistics Pvt. Ltd. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {navigationData.footer.legal.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-gray-400 hover:text-brand-yellow text-[11px] sm:text-xs transition-colors duration-150"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

