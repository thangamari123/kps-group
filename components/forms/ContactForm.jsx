'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { contactsApi } from '@/lib/api';

// Crisp vector circular flags to avoid OS emoji fallback differences
function FlagIcon({ code, country }) {
  if (code === '+91' || country === 'IN') {
    return (
      <svg className="w-4.5 h-4.5 rounded-full overflow-hidden shrink-0 inline-block shadow-2xs border border-white/30" viewBox="0 0 32 32">
        <rect width="32" height="10.66" fill="#FF9933" />
        <rect y="10.66" width="32" height="10.66" fill="#FFFFFF" />
        <rect y="21.33" width="32" height="10.66" fill="#138808" />
        <circle cx="16" cy="16" r="3.4" fill="#000080" />
        <circle cx="16" cy="16" r="2.4" fill="#FFFFFF" />
        <circle cx="16" cy="16" r="1.1" fill="#000080" />
      </svg>
    );
  }
  if (code === '+971' || country === 'AE') {
    return (
      <svg className="w-4.5 h-4.5 rounded-full overflow-hidden shrink-0 inline-block shadow-2xs border border-white/30" viewBox="0 0 32 32">
        <rect width="32" height="10.66" fill="#00732F" />
        <rect y="10.66" width="32" height="10.66" fill="#FFFFFF" />
        <rect y="21.33" width="32" height="10.66" fill="#000000" />
        <rect width="10" height="32" fill="#FF0000" />
      </svg>
    );
  }
  if (code === '+1' || country === 'US') {
    return (
      <svg className="w-4.5 h-4.5 rounded-full overflow-hidden shrink-0 inline-block shadow-2xs border border-white/30" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#B22234" />
        <rect y="4.5" width="32" height="4.5" fill="#FFFFFF" />
        <rect y="13.5" width="32" height="4.5" fill="#FFFFFF" />
        <rect y="22.5" width="32" height="4.5" fill="#FFFFFF" />
        <rect width="14" height="16" fill="#3C3B6E" />
      </svg>
    );
  }
  if (code === '+65' || country === 'SG') {
    return (
      <svg className="w-4.5 h-4.5 rounded-full overflow-hidden shrink-0 inline-block shadow-2xs border border-white/30" viewBox="0 0 32 32">
        <rect width="32" height="16" fill="#ED2939" />
        <rect y="16" width="32" height="16" fill="#FFFFFF" />
      </svg>
    );
  }
  if (code === '+44' || country === 'GB') {
    return (
      <svg className="w-4.5 h-4.5 rounded-full overflow-hidden shrink-0 inline-block shadow-2xs border border-white/30" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#012169" />
        <path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" strokeWidth="2" />
        <path d="M16,0 V32 M0,16 H32" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M16,0 V32 M0,16 H32" stroke="#C8102E" strokeWidth="3" />
      </svg>
    );
  }
  return (
    <span className="w-4.5 h-4.5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[9px] font-bold border border-white/30">
      {country}
    </span>
  );
}

const COUNTRY_OPTIONS = [
  { code: '+91', country: 'IN', name: 'India' },
  { code: '+971', country: 'AE', name: 'UAE' },
  { code: '+65', country: 'SG', name: 'Singapore' },
  { code: '+1', country: 'US', name: 'USA' },
  { code: '+44', country: 'GB', name: 'UK' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+86', country: 'CN', name: 'China' },
  { code: '+60', country: 'MY', name: 'Malaysia' },
  { code: '+94', country: 'LK', name: 'Sri Lanka' },
  { code: '+61', country: 'AU', name: 'Australia' },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    serviceRequired: '',
    message: ''
  });

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [apiError, setApiError] = useState('');

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const validate = (currentData = formData) => {
    const tempErrors = {};
    const trimmedName = currentData.name.trim();
    if (!trimmedName) {
      tempErrors.name = 'Name is required';
    } else if (trimmedName.length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }

    const trimmedEmail = currentData.email.trim();
    if (!trimmedEmail) {
      tempErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }

    const digitsOnly = currentData.phone.replace(/\D/g, '');
    if (!digitsOnly) {
      tempErrors.phone = 'Phone number is required';
    } else if (selectedCountry.code === '+91') {
      if (digitsOnly.length < 10) {
        tempErrors.phone = `Enter 10 digits (${digitsOnly.length}/10 entered)`;
      } else if (digitsOnly.length > 10) {
        tempErrors.phone = 'Enter exactly 10 digits';
      } else if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
        tempErrors.phone = 'Please enter a valid 10-digit mobile number';
      }
    } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      tempErrors.phone = 'Please enter a valid phone number';
    }

    if (!currentData.serviceRequired) {
      tempErrors.serviceRequired = 'Please select a required service';
    }

    const trimmedMessage = currentData.message.trim();
    if (!trimmedMessage) {
      tempErrors.message = 'Please provide details about your requirements';
    } else if (trimmedMessage.length < 5) {
      tempErrors.message = 'Message must be at least 5 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      const maxDigits = selectedCountry.code === '+91' ? 10 : 15;
      formattedValue = value.replace(/\D/g, '').slice(0, maxDigits);
    }

    const nextData = { ...formData, [name]: formattedValue };
    setFormData(nextData);

    // If field was already touched, revalidate dynamically
    if (touched[name]) {
      validate(nextData);
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Mark all as touched on submit attempt
    setTouched({
      name: true,
      email: true,
      phone: true,
      serviceRequired: true,
      message: true
    });

    const isValid = validate();
    if (!isValid) return;

    setStatus('loading');

    try {
      const formattedPhone = `${selectedCountry.code} ${formData.phone.trim()}`;
      await contactsApi.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formattedPhone,
        companyName: formData.companyName.trim() || undefined,
        serviceRequired: formData.serviceRequired || undefined,
        message: formData.message.trim(),
      });
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        serviceRequired: '',
        message: ''
      });
      setErrors({});
      setTouched({});
    } catch (err) {
      setStatus('error');
      setApiError(err?.message || 'Failed to submit inquiry. Please try again or call us directly.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setApiError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      companyName: '',
      serviceRequired: '',
      message: ''
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="bg-[#073B2C] rounded-[22px] md:rounded-[24px] p-5 sm:p-7 md:p-8 text-white shadow-xl shadow-[#073B2C]/20 border border-[#0d4d3a]/60 relative transition-all">
      {status === 'success' ? (
        <div className="py-10 px-4 sm:px-6 text-center space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-[#00A878]/20 border border-[#00A878]/50 text-[#00A878] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-[#00A878]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Inquiry Submitted Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-[#C2D8CF] mt-2 max-w-md mx-auto leading-relaxed">
              Thank you for contacting KPS Worldwide Logistics. Our team of logistics engineers will review your requirements and respond within 24 hours.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center bg-[#00A878] hover:bg-[#009268] text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-full transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg mt-2"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-4.5">
          {apiError && (
            <div className="p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-start space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="font-semibold block">Submission Notice</span>
                <span className="text-[11px] opacity-90">{apiError}</span>
              </div>
            </div>
          )}

          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Name */}
            <div>
              <label 
                htmlFor="contact-name" 
                className="block text-[11px] font-bold text-[#E2F3EB] uppercase tracking-wider mb-1.5"
              >
                <span className="text-red-400 font-bold mr-1">*</span>
                NAME
                <span className="text-red-400 font-bold ml-1">*</span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                disabled={status === 'loading'}
                placeholder="Your Name"
                autoComplete="name"
                className={`w-full h-[44px] px-5 bg-white text-[#102B25] placeholder-[#94A3B8] rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 focus:outline-none ${
                  touched.name && errors.name
                    ? 'border-amber-400 ring-2 ring-amber-400/40'
                    : 'border-transparent focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878]'
                }`}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-[11px] text-amber-300 font-medium flex items-center gap-1 pl-2">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="contact-email" 
                className="block text-[11px] font-bold text-[#E2F3EB] uppercase tracking-wider mb-1.5"
              >
                <span className="text-red-400 font-bold mr-1">*</span>
                EMAIL ADDRESS
                <span className="text-red-400 font-bold ml-1">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                disabled={status === 'loading'}
                placeholder="your.email@company.com"
                autoComplete="email"
                className={`w-full h-[44px] px-5 bg-white text-[#102B25] placeholder-[#94A3B8] rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 focus:outline-none ${
                  touched.email && errors.email
                    ? 'border-amber-400 ring-2 ring-amber-400/40'
                    : 'border-transparent focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878]'
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-[11px] text-amber-300 font-medium flex items-center gap-1 pl-2">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Phone & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Phone Number */}
            <div>
              <label 
                htmlFor="contact-phone" 
                className="block text-[11px] font-bold text-[#E2F3EB] uppercase tracking-wider mb-1.5"
              >
                <span className="text-red-400 font-bold mr-1">*</span>
                PHONE NUMBER
                <span className="text-red-400 font-bold ml-1">*</span>
              </label>
              <div className="flex items-center gap-2">
                {/* Country Selector Dropdown */}
                <div className="relative shrink-0" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                    disabled={status === 'loading'}
                    aria-label="Select Country Code"
                    aria-expanded={isCountryDropdownOpen}
                    className="h-[44px] px-3 sm:px-3.5 bg-white rounded-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#102B25] shadow-xs hover:bg-gray-50 hover:border-[#ffc107] focus:outline-none focus:ring-2 focus:ring-[#ffc107] transition-all cursor-pointer border border-transparent select-none"
                  >
                    <FlagIcon code={selectedCountry.code} country={selectedCountry.country} />
                    <span className="text-[12px] font-semibold">{selectedCountry.code}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Options */}
                  {isCountryDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-40 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-1 text-left">
                      <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Select Country
                      </div>
                      {COUNTRY_OPTIONS.map((c) => (
                        <button
                          key={c.code + c.country}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left hover:bg-[#ffc107]/20 transition-colors cursor-pointer ${
                            selectedCountry.code === c.code && selectedCountry.country === c.country
                              ? 'bg-[#E2F3EB] text-[#073B2C] font-bold'
                              : 'text-gray-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <FlagIcon code={c.code} country={c.country} />
                            <span className="truncate">{c.name}</span>
                          </span>
                          <span className="text-gray-500 font-medium text-[11px]">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div className="flex-1 min-w-0">
                  <input
                    type="tel"
                    inputMode="numeric"
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    disabled={status === 'loading'}
                    placeholder="Enter your number"
                    autoComplete="tel-national"
                    className={`w-full h-[44px] px-5 bg-white text-[#102B25] placeholder-[#94A3B8] rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 focus:outline-none ${
                      touched.phone && errors.phone
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-transparent focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878]'
                    }`}
                  />
                </div>
              </div>
              {touched.phone && errors.phone && (
                <p className="mt-1 text-[11px] text-amber-300 font-medium flex items-center gap-1 pl-2">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label 
                htmlFor="contact-company" 
                className="block text-[11px] font-bold text-[#E2F3EB] uppercase tracking-wider mb-1.5"
              >
                COMPANY NAME
              </label>
              <input
                type="text"
                id="contact-company"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={status === 'loading'}
                placeholder="Your Company Ltd."
                autoComplete="organization"
                className="w-full h-[44px] px-5 bg-white text-[#102B25] placeholder-[#94A3B8] rounded-full text-xs sm:text-sm font-medium border border-transparent focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878] focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Row 3: Service Required */}
          <div>
            <label 
              htmlFor="contact-service" 
              className="block text-[11px] font-bold text-[#E2F3EB] uppercase tracking-wider mb-1.5"
            >
              <span className="text-red-400 font-bold mr-1">*</span>
              SERVICE REQUIRED
            </label>
            <div className="relative">
              <select
                id="contact-service"
                name="serviceRequired"
                value={formData.serviceRequired}
                onChange={handleChange}
                onBlur={() => handleBlur('serviceRequired')}
                disabled={status === 'loading'}
                className={`w-full h-[44px] pl-5 pr-11 bg-white text-[#102B25] rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 focus:outline-none appearance-none cursor-pointer ${
                  !formData.serviceRequired ? 'text-[#94A3B8]' : 'text-[#102B25]'
                } ${
                  touched.serviceRequired && errors.serviceRequired
                    ? 'border-amber-400 ring-2 ring-amber-400/40'
                    : 'border-transparent focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878]'
                }`}
              >
                <option value="" disabled className="text-gray-400">
                  Select a service...
                </option>
                <option value="customs-clearance" className="text-gray-900">Customs Brokerage</option>
                <option value="transportation" className="text-gray-900">First/Last Mile Transport</option>
                <option value="express-delivery" className="text-gray-900">Express Delivery</option>
                <option value="project-logistics" className="text-gray-900">Project Logistics</option>
                <option value="ftwz" className="text-gray-900">Free Trade & Warehousing Zone (FTWZ)</option>
                <option value="general-logistics" className="text-gray-900">End-To-End Logistics</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {touched.serviceRequired && errors.serviceRequired && (
              <p className="mt-1 text-[11px] text-amber-300 font-medium flex items-center gap-1 pl-2">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.serviceRequired}</span>
              </p>
            )}
          </div>

          {/* Row 4: Message */}
          <div>
            <label 
              htmlFor="contact-message" 
              className="block text-[11px] font-bold text-[#E2F3EB] uppercase tracking-wider mb-1.5"
            >
              <span className="text-red-400 font-bold mr-1">*</span>
              MESSAGE
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              onBlur={() => handleBlur('message')}
              disabled={status === 'loading'}
              placeholder="Tell us about your logistics requirements..."
              className={`w-full p-4 bg-white text-[#102B25] placeholder-[#94A3B8] rounded-[18px] text-xs sm:text-sm font-medium border transition-all duration-200 focus:outline-none resize-none min-h-[88px] max-h-[140px] ${
                touched.message && errors.message
                  ? 'border-amber-400 ring-2 ring-amber-400/40'
                  : 'border-transparent focus:ring-2 focus:ring-[#00A878] focus:border-[#00A878]'
              }`}
            />
            {touched.message && errors.message && (
              <p className="mt-1 text-[11px] text-amber-300 font-medium flex items-center gap-1 pl-2">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Row 5: Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              id="contact-submit-btn"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-between gap-3 bg-[#00A878] hover:bg-[#ffc107] active:bg-[#e0a800] text-white hover:text-[#073B2C] active:text-[#073B2C] font-bold text-xs sm:text-sm py-2.5 sm:py-3 pl-6 pr-2.5 rounded-full shadow-lg shadow-black/25 hover:shadow-xl transition-all duration-250 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc107] focus-visible:ring-offset-2 focus-visible:ring-offset-[#073B2C]"
            >
              {status === 'loading' ? (
                <>
                  <span>Sending Inquiry...</span>
                  <span className="w-7 h-7 rounded-full border border-white/40 group-hover:border-[#073B2C]/40 flex items-center justify-center bg-white/10 group-hover:bg-[#073B2C] shrink-0 transition-all duration-250">
                    <Loader2 className="w-3.5 h-3.5 text-white group-hover:text-[#ffc107] animate-spin transition-colors duration-250" />
                  </span>
                </>
              ) : (
                <>
                  <span className="transition-colors duration-250">Submit Inquiry</span>
                  <span className="w-7 h-7 rounded-full border border-white/40 group-hover:border-[#073B2C]/40 flex items-center justify-center bg-white/10 group-hover:bg-[#073B2C] group-active:bg-[#073B2C] transition-all duration-250 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#ffc107] group-active:text-[#ffc107] group-hover:translate-x-0.5 transition-all duration-250" />
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
