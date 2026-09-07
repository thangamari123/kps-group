import { useState } from 'react';
import { CheckCircle, Calculator, Package, MapPin, ArrowRight } from 'lucide-react';

export default function LeadForm() {
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
  const [status, setStatus] = useState('idle');

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) tempErrors.phone = 'Phone is required';
    if (!formData.service) tempErrors.service = 'Please select a service';
    if (!formData.origin.trim()) tempErrors.origin = 'Origin is required';
    if (!formData.destination.trim()) tempErrors.destination = 'Destination is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
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
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-brand-green/10">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-brand-yellow text-brand-green-dark rounded-lg">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-brand-green-dark">Request a Custom Quote</h3>
          <p className="text-xs text-brand-gray mt-1">Get specialized logistics solutions matching your cargo requirements.</p>
        </div>
      </div>
      
      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold text-emerald-800 mb-2">Quote Request Submitted!</h4>
          <p className="text-sm text-emerald-600 max-w-md mx-auto">
            Your custom quote request has been received. Our supply chain consultants will calculate the rates and respond within 24 hours.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 inline-flex items-center space-x-2 bg-brand-green text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-green-light transition-all"
          >
            <span>Request Another Quote</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-brand-green uppercase tracking-wider mb-4 pb-1 border-b border-brand-gray-muted flex items-center">
              <span className="w-2 h-2 bg-brand-yellow rounded-full mr-2"></span>
              1. Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lead-name" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lead-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                  }`}
                  placeholder="Full Name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="lead-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                  }`}
                  placeholder="name@company.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label htmlFor="lead-phone" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lead-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                  }`}
                  placeholder="Phone Number"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="lead-company" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="lead-company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-md text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:ring-offset-2 transition-all"
                  placeholder="Company Name"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Logistics requirements */}
          <div>
            <h4 className="text-sm font-bold text-brand-green uppercase tracking-wider mb-4 pb-1 border-b border-brand-gray-muted flex items-center">
              <span className="w-2 h-2 bg-brand-yellow rounded-full mr-2"></span>
              2. Shipment details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="lead-service" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Service Required <span className="text-red-500">*</span>
                </label>
                <select
                  id="lead-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className={`w-full px-4 py-3 rounded-md text-sm border bg-white focus:ring-2 focus:ring-offset-2 transition-all ${
                    errors.service ? 'border-red-500 focus:ring-red-500' : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                  }`}
                >
                  <option value="">Select a service...</option>
                  <option value="Customs Brokerage">Customs Brokerage</option>
                  <option value="First/Last Mile Transport">First/Last Mile Transport</option>
                  <option value="Express Delivery">Express Delivery</option>
                  <option value="Project Logistics">Project Logistics</option>
                  <option value="FTWZ">Free Trade & Warehousing Zone (FTWZ)</option>
                  <option value="Warehousing">Strategic Warehousing</option>
                  <option value="End-to-End Logistics">End-To-End Logistics</option>
                </select>
                {errors.service && <p className="mt-1 text-xs text-red-500 font-medium">{errors.service}</p>}
              </div>

              <div>
                <label htmlFor="lead-weight" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Approx. Cargo Weight / Volume
                </label>
                <input
                  type="text"
                  id="lead-weight"
                  name="cargoWeight"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-md text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:ring-offset-2 transition-all"
                  placeholder="e.g. 15 Tons / 40 CBM"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div>
                <label htmlFor="lead-origin" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Origin Location (City/Port) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="lead-origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className={`w-full pl-10 pr-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                      errors.origin ? 'border-red-500 focus:ring-red-500' : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                    }`}
                    placeholder="Origin Location"
                  />
                </div>
                {errors.origin && <p className="mt-1 text-xs text-red-500 font-medium">{errors.origin}</p>}
              </div>

              <div>
                <label htmlFor="lead-destination" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                  Destination Location (City/Port) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gray">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="lead-destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    className={`w-full pl-10 pr-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                      errors.destination ? 'border-red-500 focus:ring-red-500' : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                    }`}
                    placeholder="Destination Location"
                  />
                </div>
                {errors.destination && <p className="mt-1 text-xs text-red-500 font-medium">{errors.destination}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="lead-cargoDetails" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                Cargo Specifications / Special Handling Requirements
              </label>
              <textarea
                id="lead-cargoDetails"
                name="cargoDetails"
                value={formData.cargoDetails}
                onChange={handleChange}
                disabled={status === 'loading'}
                rows={3}
                className="w-full px-4 py-3 rounded-md text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:ring-offset-2 transition-all resize-y"
                placeholder="Describe your cargo type (e.g. machinery, perishables, hazmat) or specific warehousing requirements..."
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-green hover:bg-brand-green-light text-white font-bold py-4 px-6 rounded-md text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Calculating Rates & Submitting...</span>
              </>
            ) : (
              <>
                <span>Get My Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
