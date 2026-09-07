import { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    serviceRequired: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone is required';
    } else {
      const phoneRegex = /^[0-9\s\-+()]{7,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        tempErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    
    // Simulate API integration
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        serviceRequired: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-brand-green/10">
      <h3 className="text-2xl font-bold text-brand-green-dark mb-6">
        Send Us a Message
      </h3>
      
      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-emerald-800 mb-2">Message Sent Successfully!</h4>
          <p className="text-sm text-emerald-600">
            Thank you for contacting K.P.S & Co. Our team will get back to you shortly.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 text-sm font-semibold text-brand-green hover:text-brand-green-light underline"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                }`}
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                }`}
                placeholder="your.email@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                }`}
                placeholder="+91 XXXXX XXXXX"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-md text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:ring-offset-2 transition-all"
                placeholder="Your Company Ltd."
              />
            </div>
          </div>

          {/* Service Required */}
          <div>
            <label htmlFor="serviceRequired" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
              Service Required
            </label>
            <select
              id="serviceRequired"
              name="serviceRequired"
              value={formData.serviceRequired}
              onChange={handleChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-md text-sm border border-brand-gray-muted bg-white focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:ring-offset-2 transition-all"
            >
              <option value="">Select a service...</option>
              <option value="customs-clearance">Customs Brokerage</option>
              <option value="transportation">First/Last Mile Transport</option>
              <option value="express-delivery">Express Delivery</option>
              <option value="project-logistics">Project Logistics</option>
              <option value="ftwz">Free Trade & Warehousing Zone</option>
              <option value="general-logistics">End-To-End Logistics</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={status === 'loading'}
              rows={4}
              className="w-full px-4 py-3 rounded-md text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:ring-offset-2 transition-all resize-y"
              placeholder="Tell us about your logistics requirements..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-green hover:bg-brand-green-light text-white font-bold py-3.5 px-6 rounded-md text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
