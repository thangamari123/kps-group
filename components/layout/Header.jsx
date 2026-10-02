'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationData } from '@/data/navigation';
import { companyDetails } from '@/data/company';

const kpsLogo = '/images/kpslogo.webp';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const isTicking = useRef(false);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Disable body scroll when mobile menu is open
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

  // Close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Premium, jitter-free scroll detection
  useEffect(() => {
    const threshold = 10;

    const handleScroll = () => {
      if (!isTicking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Always show at top of page
          if (currentScrollY <= 60) {
            setIsVisible(true);
          } else {
            const diff = currentScrollY - lastScrollY.current;
            if (Math.abs(diff) > threshold) {
              if (diff > 0 && currentScrollY > 100) {
                // Scrolling down -> hide navbar
                setIsVisible(false);
                setActiveDropdown(null);
              } else if (diff < 0) {
                // Scrolling up -> show navbar
                setIsVisible(true);
              }
              lastScrollY.current = currentScrollY;
            }
          }
          isTicking.current = false;
        });
        isTicking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const isActive = (path, dropdown) => {
    if (path === '/') {
      return pathname === '/';
    }
    if (dropdown) {
      return dropdown.some((item) => pathname === item.path);
    }
    return pathname.startsWith(path);
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const secondaryNavItems = navigationData.secondary || [
    { name: 'TESTIMONIALS', path: '/testimonial' },
    { name: 'CAREERS', path: '/career' },
    { name: 'AWARDS & RECOGNITIONS', path: '/awards' },
    { name: 'CSR INITIATIVES', path: '/csr' }
  ];

  return (
    <header
      className={`fixed top-2 sm:top-3 md:top-4 inset-x-0 z-50 flex flex-col items-center pointer-events-none transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? 'translate-y-0' : '-translate-y-[160%]'
      }`}
    >
      {/* 1. MAIN NAVBAR (Pill Shaped White Container) */}
      <div className="w-[95%] max-w-[1360px] bg-white rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-slate-100/90 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 flex items-center justify-between relative z-20 pointer-events-auto">
        
        {/* Left Side: K.P.S Logo + DELIVERY SMILE */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center shrink-0 group select-none mr-3 sm:mr-6"
          aria-label="KPS Worldwide Logistics Home"
        >
          <img
            src={kpsLogo}
            alt="KPS"
            className="h-8 sm:h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-[6px] sm:text-[6.5px] md:text-[7.5px] font-extrabold text-[#073B2C] tracking-[0.2em] uppercase mt-0.5 leading-none group-hover:text-brand-green transition-colors">
            DELIVERY SMILE
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navigationData.header.map((link) => {
            if (link.dropdown) {
              const dropdownActive = isActive(link.path, link.dropdown);
              const isDropdownOpen = activeDropdown === link.name;
              return (
                <div
                  key={link.name}
                  className="relative group py-2"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`flex items-center space-x-1 font-semibold text-[14.5px] xl:text-[15px] transition-all duration-200 hover:text-[#0F5B44] focus:outline-none cursor-pointer ${
                      dropdownActive ? 'text-[#0F5B44] font-bold' : 'text-[#1f2937]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Active bottom yellow underline indicator */}
                  {dropdownActive && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-[#f59e0b] rounded-full"></span>
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl py-2.5 px-1.5 border border-slate-100 overflow-hidden z-30"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.path}
                            className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                              pathname === item.path
                                ? 'text-[#0F5B44] bg-[#eaf4ef] font-bold'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#0F5B44]'
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const linkActive = isActive(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`relative font-semibold text-[14.5px] xl:text-[15px] transition-colors duration-200 hover:text-[#0F5B44] py-2 ${
                  linkActive ? 'text-[#0F5B44] font-bold' : 'text-[#1f2937]'
                }`}
              >
                <span>{link.name}</span>
                {linkActive && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2.5px] bg-[#f59e0b] rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Get Quote Button + Arrow & Mobile Hamburger */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Get Quote Pill Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-quote-modal'))}
            className="group flex items-center bg-[#073B2C] hover:bg-[#0A4D3A] text-white rounded-full pl-4 sm:pl-5 pr-1.5 sm:pr-1.5 py-1.5 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none cursor-pointer select-none"
            aria-label="Get Quote"
          >
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white mr-2.5 sm:mr-3">
              Get Quote
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f59e0b] group-hover:bg-[#fbbf24] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
              <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.5]" />
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-[#073B2C] rounded-full focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      </div>

      {/* 2. SECONDARY NAVBAR (Warm Yellow Pill Attached Underneath) */}
      <div className="hidden md:flex items-center justify-center bg-[#FFC107] text-[#073B2C] rounded-b-[28px] lg:rounded-b-[34px] shadow-lg px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 relative z-10 -mt-2.5 sm:-mt-3 pointer-events-auto border-b border-x border-[#e0a800]/60 select-none transition-all duration-300">
        {secondaryNavItems.map((item, idx) => {
          const itemActive = pathname === item.path;
          return (
            <div key={item.name} className="flex items-center">
              <Link
                href={item.path}
                className={`text-[12px] sm:text-[12.5px] md:text-[13px] lg:text-[13.5px] font-bold tracking-[0.06em] sm:tracking-[0.08em] transition-colors uppercase whitespace-nowrap px-1.5 py-0.5 ${
                  itemActive ? 'text-[#051f16] font-black underline decoration-2 underline-offset-4' : 'text-[#073B2C] hover:text-black'
                }`}
              >
                {item.name}
              </Link>
              {idx < secondaryNavItems.length - 1 && (
                <span className="h-3.5 sm:h-4 w-[1.5px] bg-[#073B2C]/25 mx-3 sm:mx-5 md:mx-6 lg:mx-8 inline-block"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden w-[95%] max-w-[1360px] bg-white text-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 mt-2 pointer-events-auto max-h-[82vh] flex flex-col z-20"
          >
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
              
              {/* Main Links */}
              <div className="space-y-1 pb-2">
                {navigationData.header.map((link) => {
                  if (link.dropdown) {
                    const dropdownActive = isActive(link.path, link.dropdown);
                    const isDropdownOpen = activeDropdown === link.name;
                    return (
                      <div key={link.name} className="space-y-1">
                        <button
                          onClick={() => toggleMobileDropdown(link.name)}
                          className={`flex items-center justify-between w-full py-2.5 px-3 rounded-xl font-bold text-left transition-colors ${
                            dropdownActive ? 'text-[#0F5B44] bg-[#eaf4ef]' : 'text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span>{link.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-xl mt-1"
                            >
                              {link.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.path}
                                  className={`block py-2 px-3 rounded-lg text-sm font-medium ${
                                    pathname === subItem.path ? 'text-[#0F5B44] font-bold bg-white shadow-xs' : 'text-slate-600 hover:text-[#0F5B44]'
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const linkActive = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      className={`block py-2.5 px-3 rounded-xl font-bold text-sm transition-colors ${
                        linkActive ? 'text-[#0F5B44] bg-[#eaf4ef]' : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Secondary Navigation Section in Mobile */}
              <div className="pt-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 block mb-2">
                  Corporate & Highlights
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {secondaryNavItems.map((item) => {
                    const itemActive = pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`block py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                          itemActive
                            ? 'bg-[#FFC107] text-[#073B2C] font-black'
                            : 'bg-slate-100 text-[#073B2C] hover:bg-[#FFC107] hover:text-[#073B2C]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Contact Support & Action */}
              <div className="pt-4 space-y-3">
                <a
                  href={`tel:${companyDetails.contact.phone}`}
                  className="flex items-center justify-center space-x-2 text-[#073B2C] py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0F5B44]" />
                  <span>24/7 Support: {companyDetails.contact.phone}</span>
                </a>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new CustomEvent('open-quote-modal'));
                  }}
                  className="w-full flex items-center justify-center bg-[#073B2C] hover:bg-[#0A4D3A] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <span>Get Quote</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5 text-brand-yellow stroke-[2.5]" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
