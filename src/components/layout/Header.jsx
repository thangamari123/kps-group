import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Ship, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationData } from '../../data/navigation';
import { companyDetails } from '../../data/company';
import { Facebook, Instagram, Linkedin } from '../common/SocialIcons';
import kpsLogo from '../../assets/kpslogo.webp';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

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

  const toggleMobileDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const isActive = (path, dropdown) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (dropdown) {
      return dropdown.some(item => location.pathname === item.path);
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-md">
      {/* 1. Top Utility Bar (Desktop only) */}
      <div className="hidden lg:block bg-brand-green-dark text-white py-2 px-6 border-b border-brand-green-light/20">
        <div className="container mx-auto flex items-center justify-between text-[11px] font-medium tracking-wide">
          {/* Left Info: Contact Details */}
          <div className="flex items-center space-x-6">
            <a 
              href={`tel:${companyDetails.contact.phone}`} 
              className="flex items-center space-x-2 hover:text-brand-yellow transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-yellow" />
              <span>24/7 Support: {companyDetails.contact.phone}</span>
            </a>
            <span className="text-brand-green-light/40">|</span>
            <a 
              href={`mailto:${companyDetails.contact.email}`} 
              className="flex items-center space-x-2 hover:text-brand-yellow transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-brand-yellow" />
              <span>{companyDetails.contact.email}</span>
            </a>
          </div>

          {/* Right Info: Social Media Links */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Follow Us:</span>
            <div className="flex items-center space-x-3.5">
              <a href={companyDetails.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href={companyDetails.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href={companyDetails.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Always Visible & Sticky) */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-brand-gray-muted py-2.5 sm:py-3 text-brand-gray-dark">
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center justify-between min-h-[48px] sm:min-h-[56px]">
            {/* Logo: Centered on Mobile, Left-aligned on Desktop */}
            <Link 
              to="/" 
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center group flex-shrink-0 z-10" 
              aria-label="KPS Worldwide Logistics Home"
            >
              <img 
                src={kpsLogo} 
                alt="KPS Worldwide Logistics Logo" 
                className="h-9 sm:h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navigationData.header.map((link) => {
                if (link.dropdown) {
                  const dropdownActive = isActive(link.path, link.dropdown);
                  return (
                    <div 
                      key={link.name} 
                      className="relative group py-2"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button 
                        className={`flex items-center space-x-1.5 font-bold text-sm transition-all duration-300 hover:text-brand-green focus:outline-none ${
                          dropdownActive ? 'text-brand-green' : 'text-brand-gray-dark'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-4 h-4 text-brand-gray" />
                      </button>
                      
                      {/* Active bottom underline indicator */}
                      {dropdownActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-yellow rounded-full"></span>
                      )}

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2.5 w-64 bg-white rounded-lg shadow-xl py-2 border border-brand-gray-muted overflow-hidden"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className={`block px-4 py-2.5 text-sm transition-all duration-200 hover:bg-brand-green hover:text-white ${
                                  location.pathname === item.path 
                                    ? 'text-brand-green bg-brand-green-bg font-semibold' 
                                    : 'text-brand-gray-dark'
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
                    to={link.path}
                    className={`relative font-bold text-sm transition-colors duration-300 hover:text-brand-green py-2 ${
                      linkActive ? 'text-brand-green font-bold' : 'text-brand-gray-dark'
                    }`}
                  >
                    <span>{link.name}</span>
                    {linkActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-yellow rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center">
              {/* Get a Quote Button */}
              <Link
                to="/lead-form"
                className="text-sm font-bold bg-brand-green hover:bg-brand-green-light text-white px-5 py-3 rounded-md transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
              >
                Get a Custom Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 text-brand-gray-dark hover:text-brand-green rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer (Expanded inside header layout) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white text-brand-gray-dark border-t border-brand-gray-muted overflow-hidden shadow-xl mt-3"
            >
              <div className="px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
                {navigationData.header.map((link) => {
                  if (link.dropdown) {
                    const dropdownActive = isActive(link.path, link.dropdown);
                    const isDropdownOpen = activeDropdown === link.name;
                    return (
                      <div key={link.name} className="space-y-1">
                        <button
                          onClick={() => toggleMobileDropdown(link.name)}
                          className={`flex items-center justify-between w-full py-2.5 font-bold text-left border-b border-brand-gray-muted ${
                            dropdownActive ? 'text-brand-green' : 'text-brand-gray-dark'
                          }`}
                        >
                          <span>{link.name}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 py-1 space-y-1 bg-brand-green-bg/30 rounded-md mt-1"
                            >
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.path}
                                  className={`block py-2 text-sm border-b border-brand-green/10 last:border-b-0 ${
                                    location.pathname === item.path ? 'text-brand-green font-bold' : 'text-brand-gray'
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
                      to={link.path}
                      className={`block py-2.5 font-bold border-b border-brand-gray-muted ${
                        linkActive ? 'text-brand-green' : 'text-brand-gray-dark'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Mobile Call info & Button */}
                <div className="pt-4 space-y-4">
                  <a 
                    href={`tel:${companyDetails.contact.phone}`} 
                    className="flex items-center justify-center space-x-2 text-brand-gray-dark hover:text-brand-green py-2.5 border border-brand-gray-muted rounded font-bold text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand-green" />
                    <span>{companyDetails.contact.phone}</span>
                  </a>

                  <Link
                    to="/lead-form"
                    className="block text-center bg-brand-green hover:bg-brand-green-light text-white font-bold py-3.5 rounded shadow transition-colors"
                  >
                    Get a Custom Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
