'use client';

import { useState, useRef } from 'react';
import { 
  CheckCircle, Calculator, MapPin, ArrowRight, ArrowLeft, 
  User, Mail, Phone, Building2, Package, ShieldCheck, Sparkles, 
  Check, AlertCircle, Lock, ChevronDown, FileText, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Robust Validation Helpers
export const validateField = (name, value, allValues = {}) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  switch (name) {
    case 'name':
      if (!trimmed) return 'Contact name is required';
      if (trimmed.length < 2) return 'Name must be at least 2 characters';
      if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name should only contain letters and spaces';
      return '';

    case 'email':
      if (!trimmed) return 'Email address is required';
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. name@company.com)';
      return '';

    case 'phone':
      if (!trimmed) return 'Phone number is required';
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (digitsOnly.length === 0) return 'Phone number is required';
      if (digitsOnly.length < 10) return `Enter 10 digits (${digitsOnly.length}/10 entered)`;
      if (digitsOnly.length > 10) return 'Phone number must be exactly 10 digits';
      if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
        return 'Please enter a valid 10-digit mobile number';
      }
      return '';

    case 'company':
      if (trimmed && trimmed.length > 100) return 'Company name cannot exceed 100 characters';
      return '';

    case 'service':
      if (!trimmed) return 'Please select a required logistics service';
      return '';

    case 'origin':
      if (!trimmed) return 'Origin location (City or Port) is required';
      if (trimmed.length < 2) return 'Origin location must be at least 2 characters';
      return '';

    case 'destination':
      if (!trimmed) return 'Destination location (City or Port) is required';
      if (trimmed.length < 2) return 'Destination location must be at least 2 characters';
      if (allValues.origin && trimmed.toLowerCase() === allValues.origin.trim().toLowerCase()) {
        return 'Destination cannot be identical to Origin location';
      }
      return '';

    case 'cargoWeight':
      if (trimmed && trimmed.length > 80) return 'Weight/Volume text is too long';
      return '';

    case 'cargoDetails':
      if (trimmed && trimmed.length > 1000) return 'Cargo specifications cannot exceed 1000 characters';
      return '';

    default:
      return '';
  }
};

export default function LeadForm({ isModal = false, onClose = null }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    origin: '',
    destination: '',
    cargoWeight: '',
    cargoDetails: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');

  // Input refs for auto-focusing invalid inputs
  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    company: useRef(null),
    service: useRef(null),
    origin: useRef(null),
    destination: useRef(null),
    cargoWeight: useRef(null),
    cargoDetails: useRef(null)
  };

  // Validate entire Step 1
  const validateStep1 = () => {
    const step1Fields = ['name', 'email', 'phone', 'company'];
    const newErrors = {};
    const newTouched = { ...touched };

    step1Fields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors((prev) => ({ ...prev, ...newErrors }));

    // Focus first invalid input
    if (Object.keys(newErrors).length > 0) {
      const firstInvalid = step1Fields.find((f) => newErrors[f]);
      if (firstInvalid && inputRefs[firstInvalid]?.current) {
        inputRefs[firstInvalid].current.focus();
      }
      return false;
    }

    return true;
  };

  // Validate entire Step 2
  const validateStep2 = () => {
    const step2Fields = ['service', 'origin', 'destination', 'cargoWeight', 'cargoDetails'];
    const newErrors = {};
    const newTouched = { ...touched };

    step2Fields.forEach((field) => {
      newTouched[field] = true;
      const error = validateField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });

    setTouched(newTouched);
    setErrors((prev) => ({ ...prev, ...newErrors }));

    // Focus first invalid input
    if (Object.keys(newErrors).length > 0) {
      const firstInvalid = step2Fields.find((f) => newErrors[f]);
      if (firstInvalid && inputRefs[firstInvalid]?.current) {
        inputRefs[firstInvalid].current.focus();
      }
      return false;
    }

    return true;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field], formData);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Strict 10-digit number-only restriction for Phone input
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    const newFormData = { ...formData, [name]: formattedValue };
    setFormData(newFormData);

    // If field was already touched or has an existing error, revalidate in real time
    if (touched[name] || errors[name]) {
      const error = validateField(name, formattedValue, newFormData);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // Revalidate destination if origin changes
    if (name === 'origin' && touched.destination) {
      const destError = validateField('destination', formData.destination, newFormData);
      setErrors((prev) => ({ ...prev, destination: destError }));
    }
  };

  const handleNextStep = (e) => {
    e?.preventDefault?.();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const handleReset = () => {
    setStatus('idle');
    setStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      origin: '',
      destination: '',
      cargoWeight: '',
      cargoDetails: ''
    });
    setErrors({});
    setTouched({});
  };

  // Helper for input styling based on exact UI screenshot
  const getInputWrapperClass = (fieldName) => {
    const isInvalid = touched[fieldName] && errors[fieldName];
    const isValid = touched[fieldName] && !errors[fieldName] && formData[fieldName]?.trim?.();

    if (isInvalid) {
      return 'border-red-400 bg-red-50/20 ring-1 ring-red-400';
    }
    if (isValid) {
      return 'border-emerald-500/80 bg-emerald-50/10 ring-1 ring-emerald-500/30';
    }
    return 'border-gray-200 bg-white hover:border-gray-300 focus-within:border-[#14533d] focus-within:ring-2 focus-within:ring-[#14533d]/15';
  };

  return (
    <div className="w-full">
      {/* Step Indicator (Exact Match to User UI Reference - Compact) */}
      {status !== 'success' && (
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 select-none">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center space-x-1.5 transition-all ${step > 1 ? 'cursor-pointer' : ''}`}
          >
            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors ${
              step === 1 
                ? 'bg-[#14533d] text-white shadow-xs' 
                : 'bg-[#14533d] text-white'
            }`}>
              {step > 1 ? <Check className="w-3 h-3 text-white" /> : '1'}
            </span>
            <span className={`text-[11px] sm:text-xs font-bold ${
              step === 1 ? 'text-[#0f3c2d]' : 'text-[#0f3c2d]/80'
            }`}>
              Contact Information
            </span>
          </button>

          {/* Divider Line */}
          <div className="w-6 sm:w-10 h-[1.5px] bg-gray-200 rounded-full"></div>

          {/* Step 2 Pill */}
          <div className="flex items-center space-x-1.5">
            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors ${
              step === 2 
                ? 'bg-[#14533d] text-white shadow-xs' 
                : 'bg-[#e2e8f0] text-gray-500'
            }`}>
              2
            </span>
            <span className={`text-[11px] sm:text-xs ${
              step === 2 ? 'font-bold text-[#0f3c2d]' : 'font-medium text-gray-500'
            }`}>
              Shipment Details
            </span>
          </div>
        </div>
      )}

      {/* Success View */}
      {status === 'success' ? (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 sm:p-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#14533d] text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-[#0f3c2d] mb-1">Quote Request Submitted!</h4>
          <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
            Thank you, <strong className="text-[#0f3c2d]">{formData.name}</strong>. Your request has been received. Our team will review your shipment details and respond within 24 hours.
          </p>

          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100 text-left text-[11px] sm:text-xs max-w-xs sm:max-w-sm mx-auto space-y-1 text-gray-700 shadow-xs">
            <p><span className="font-semibold text-[#0f3c2d]">Service:</span> {formData.service}</p>
            <p><span className="font-semibold text-[#0f3c2d]">Route:</span> {formData.origin} &rarr; {formData.destination}</p>
            <p><span className="font-semibold text-[#0f3c2d]">Phone:</span> +91 {formData.phone}</p>
            <p><span className="font-semibold text-[#0f3c2d]">Email:</span> {formData.email}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button 
              onClick={handleReset}
              className="inline-flex items-center space-x-1 bg-[#14533d] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#0e3f2e] transition-all shadow-xs cursor-pointer"
            >
              <span>Submit Another Quote</span>
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="inline-flex items-center space-x-1 bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-xs px-3.5 py-2 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
              >
                <span>Close</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} noValidate className="space-y-2.5 sm:space-y-3">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Contact Information (Compact & Clean) */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.16 }}
                className="space-y-2.5 sm:space-y-3"
              >
                {/* 1. Full Name */}
                <div>
                  <label htmlFor="lead-name" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('name')}`}>
                    <div className="pl-2.5 pr-1 text-gray-400 pointer-events-none flex items-center">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      ref={inputRefs.name}
                      type="text"
                      id="lead-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      disabled={status === 'loading'}
                      className="w-full pl-1.5 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal"
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </div>
                  {touched.name && errors.name && (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* 2. Email Address */}
                <div>
                  <label htmlFor="lead-email" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('email')}`}>
                    <div className="pl-2.5 pr-1 text-gray-400 pointer-events-none flex items-center">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      ref={inputRefs.email}
                      type="email"
                      id="lead-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      disabled={status === 'loading'}
                      className="w-full pl-1.5 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal"
                      placeholder="name@company.com"
                      autoComplete="email"
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* 3. Phone Number with +91 selector */}
                <div>
                  <label htmlFor="lead-phone" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('phone')}`}>
                    {/* Left Icon + +91 indicator */}
                    <div className="pl-2.5 pr-1.5 flex items-center space-x-1 border-r border-gray-200 text-gray-700 select-none">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-bold text-gray-800">+91</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                    
                    <input
                      ref={inputRefs.phone}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      id="lead-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      disabled={status === 'loading'}
                      className="w-full pl-2 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal"
                      placeholder="Enter your number"
                      autoComplete="tel-national"
                    />
                  </div>
                  {touched.phone && errors.phone ? (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[10px] text-gray-400 font-normal">
                      10 digits mobile number
                    </p>
                  )}
                </div>

                {/* 4. Company Name (Optional) */}
                <div>
                  <label htmlFor="lead-company" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                    Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('company')}`}>
                    <div className="pl-2.5 pr-1 text-gray-400 pointer-events-none flex items-center">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      ref={inputRefs.company}
                      type="text"
                      id="lead-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onBlur={() => handleBlur('company')}
                      disabled={status === 'loading'}
                      className="w-full pl-1.5 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal"
                      placeholder="Company / Enterprise Name"
                      autoComplete="organization"
                    />
                  </div>
                  {touched.company && errors.company && (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{errors.company}</span>
                    </p>
                  )}
                </div>

                {/* Submit / Next Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-[#14533d] hover:bg-[#0e3f2e] text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all flex items-center justify-center space-x-1.5 group cursor-pointer"
                  >
                    <span>Next: Shipment Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center space-x-1 text-[10px] sm:text-[11px] text-gray-500 mt-2 font-normal">
                    <Lock className="w-3 h-3 text-gray-400" />
                    <span>100% confidential & secure.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Shipment Details (Compact & Clean) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.16 }}
                className="space-y-2.5 sm:space-y-3"
              >
                {/* 1. Service Required */}
                <div>
                  <label htmlFor="lead-service" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('service')}`}>
                    <div className="pl-2.5 pr-1 text-gray-400 pointer-events-none flex items-center">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <select
                      ref={inputRefs.service}
                      id="lead-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      onBlur={() => handleBlur('service')}
                      disabled={status === 'loading'}
                      className="w-full pl-1.5 pr-7 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 font-normal appearance-none cursor-pointer"
                    >
                      <option value="">Select a service...</option>
                      <option value="Containerized Cargo (FCL / LCL)">Containerized Cargo (FCL / LCL)</option>
                      <option value="Multimodal Freight Forwarding">Multimodal Freight Forwarding</option>
                      <option value="Customs Brokerage">Licensed Customs Brokerage</option>
                      <option value="Project Cargo & Heavy Lift">Project Cargo & Heavy Lift</option>
                      <option value="Over Dimensional Cargo (ODC)">Over Dimensional Cargo (ODC)</option>
                      <option value="FTWZ Solutions">Free Trade & Warehousing Zone (FTWZ)</option>
                      <option value="Industrial Warehousing">Strategic Industrial Warehousing</option>
                      <option value="First & Last Mile Transportation">First & Last Mile Transportation</option>
                    </select>
                    <div className="absolute right-2.5 pointer-events-none text-gray-400">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  {touched.service && errors.service && (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{errors.service}</span>
                    </p>
                  )}
                </div>

                {/* 2. Approx Cargo Weight / Volume */}
                <div>
                  <label htmlFor="lead-weight" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                    Approx. Cargo Weight / Volume <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('cargoWeight')}`}>
                    <div className="pl-2.5 pr-1 text-gray-400 pointer-events-none flex items-center">
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      ref={inputRefs.cargoWeight}
                      type="text"
                      id="lead-weight"
                      name="cargoWeight"
                      value={formData.cargoWeight}
                      onChange={handleChange}
                      onBlur={() => handleBlur('cargoWeight')}
                      disabled={status === 'loading'}
                      className="w-full pl-1.5 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal"
                      placeholder="e.g. 15 Tons / 40 CBM"
                    />
                  </div>
                  {touched.cargoWeight && errors.cargoWeight && (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{errors.cargoWeight}</span>
                    </p>
                  )}
                </div>

                {/* 3. Origin & Destination in 2 cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* Origin */}
                  <div>
                    <label htmlFor="lead-origin" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                      Origin Location <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('origin')}`}>
                      <div className="pl-2.5 pr-1 text-gray-400 pointer-events-none flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        ref={inputRefs.origin}
                        type="text"
                        id="lead-origin"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        onBlur={() => handleBlur('origin')}
                        disabled={status === 'loading'}
                        className="w-full pl-1.5 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal"
                        placeholder="Origin (City/Port)"
                      />
                    </div>
                    {touched.origin && errors.origin && (
                      <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                        <span>{errors.origin}</span>
                      </p>
                    )}
                  </div>

                  {/* Destination */}
                  <div>
                    <label htmlFor="lead-destination" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                      Destination Location <span className="text-red-500">*</span>
                    </label>
                    <div className={`relative flex items-center rounded-lg border transition-all ${getInputWrapperClass('destination')}`}>
                      <div className="pl-2.5 pr-1 text-gray-400 pointer-events-none flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        ref={inputRefs.destination}
                        type="text"
                        id="lead-destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        onBlur={() => handleBlur('destination')}
                        disabled={status === 'loading'}
                        className="w-full pl-1.5 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal"
                        placeholder="Destination (City/Port)"
                      />
                    </div>
                    {touched.destination && errors.destination && (
                      <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                        <span>{errors.destination}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Cargo Specifications */}
                <div>
                  <label htmlFor="lead-cargoDetails" className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-1">
                    Cargo Specifications <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className={`relative rounded-lg border transition-all ${getInputWrapperClass('cargoDetails')}`}>
                    <textarea
                      ref={inputRefs.cargoDetails}
                      id="lead-cargoDetails"
                      name="cargoDetails"
                      value={formData.cargoDetails}
                      onChange={handleChange}
                      onBlur={() => handleBlur('cargoDetails')}
                      disabled={status === 'loading'}
                      rows={2}
                      className="w-full p-2 sm:p-2.5 text-xs sm:text-[13px] bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 font-normal resize-y"
                      placeholder="Describe cargo type (machinery, hazmat, etc.) or specific requirements..."
                    />
                  </div>
                  {touched.cargoDetails && errors.cargoDetails && (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>{errors.cargoDetails}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons: Back & Submit */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={status === 'loading'}
                    className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 sm:py-3 px-3 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-2/3 bg-[#14533d] hover:bg-[#0e3f2e] text-white font-bold py-2.5 sm:py-3 px-3 rounded-lg text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all flex items-center justify-center space-x-1.5 group cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Get My Custom Quote</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-1 text-[10px] sm:text-[11px] text-gray-500 mt-2 font-normal">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span>100% confidential & secure.</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      )}
    </div>
  );
}
