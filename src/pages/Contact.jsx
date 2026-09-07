import { useState } from 'react';
import { Phone, Mail, MapPin, Compass, Globe, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../components/common/PageHero';
import ContactForm from '../components/forms/ContactForm';
import { officesData } from '../data/offices';
import { companyDetails } from '../data/company';

import SEO from '../components/common/SEO';

export default function Contact() {
  const [selectedOffice, setSelectedOffice] = useState(null);

  const handleViewDetails = (office) => {
    // Add custom branch information for each office modal
    let details = {};
    if (office.id === 'bengaluru') {
      details = { manager: "Branch Operations Head", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    } else if (office.id === 'tuticorin') {
      details = { manager: "Port Clearance Officer", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    } else if (office.id === 'visakhapatnam') {
      details = { manager: "Regional Customs Manager", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    } else if (office.id === 'kochi') {
      details = { manager: "Coastal Logistics Supervisor", hours: "09:00 AM - 06:00 PM (Mon-Sat)", contact: "info@kpsgroups.net" };
    }
    setSelectedOffice({ ...office, ...details });
  };

  return (
    <div className="bg-white">
      {/* SEO Metadata */}
      <SEO 
        title="Contact KPS Worldwide Logistics | Chennai Corporate & Regional Offices" 
        description="Connect with KPS Worldwide Logistics Pvt. Ltd. at our Corporate Office in Parrys, Chennai or Regional Office in Guindy, Chennai. Phone: 044 - 45088099, Email: bsp@kpsgroups.net." 
        keywords={[
          "Contact KPS Worldwide Logistics",
          "logistics company in Chennai",
          "logistics services in Chennai",
          "customs broker Chennai",
          "freight forwarding company Chennai",
          "Parrys Chennai logistics office",
          "Guindy Chennai logistics office",
          "ODC transport Chennai"
        ]}
      />

      {/* Page Hero */}
      <PageHero 
        title="Contact Us" 
        description="Get in touch with KPS Worldwide Logistics for expert freight forwarding, customs clearance, and heavy project logistics."
        bgImage="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Contact Info and Contact Form Split */}
      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-brand-green font-bold text-xs uppercase tracking-wider block">
                  Get In Touch
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-green-dark mt-1">
                  KPS Worldwide Logistics
                </h2>
                <p className="text-xs sm:text-sm text-brand-gray mt-1.5 leading-relaxed font-light">
                  Partner with KPS Worldwide Logistics Today. Let our logistics engineers design your next global movement.
                </p>
              </div>

              {/* Direct Info list */}
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start space-x-3.5 p-3.5 bg-brand-gray-light rounded-xl border border-brand-gray-muted/60">
                  <div className="p-3 bg-brand-green text-white rounded-lg flex-shrink-0 shadow">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-brand-gray uppercase font-bold tracking-wider">Phone Hotline</span>
                    <a 
                      href={`tel:${companyDetails.contact.phone}`} 
                      className="text-brand-green-dark hover:text-brand-green font-bold text-base transition-colors"
                    >
                      {companyDetails.contact.phone}
                    </a>
                  </div>
                </div>

                {/* Emails */}
                <div className="flex items-start space-x-3.5 p-3.5 bg-brand-gray-light rounded-xl border border-brand-gray-muted/60">
                  <div className="p-3 bg-brand-green text-white rounded-lg flex-shrink-0 shadow">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] text-brand-gray uppercase font-bold tracking-wider">Direct Email Inquiries</span>
                    <div className="space-y-0.5">
                      <div className="text-xs">
                        <span className="text-gray-400 font-medium">Executive: </span>
                        <a href="mailto:bsp@kpsgroups.net" className="text-brand-green-dark hover:text-brand-green font-bold transition-colors">
                          bsp@kpsgroups.net
                        </a>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400 font-medium">Inquiry Hotline: </span>
                        <a href="mailto:selvamani.c@kpsgroups.net" className="text-brand-green-dark hover:text-brand-green font-bold transition-colors">
                          selvamani.c@kpsgroups.net
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corporate Office */}
                <div className="flex items-start space-x-3.5 p-3.5 bg-white rounded-xl border-2 border-brand-green/20 shadow-sm">
                  <div className="p-3 bg-brand-green text-white rounded-lg flex-shrink-0 shadow">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="block text-[10px] text-brand-green font-extrabold uppercase tracking-wider">21. Corporate Office</span>
                    </div>
                    <h5 className="text-xs font-bold text-brand-green-dark mt-0.5">KPS Worldwide Logistics Pvt Ltd.</h5>
                    <p className="text-xs text-brand-gray-dark leading-relaxed font-medium mt-0.5">
                      {companyDetails.contact.corporateOffice.line1}<br />
                      {companyDetails.contact.corporateOffice.line2}<br />
                      {companyDetails.contact.corporateOffice.area}, {companyDetails.contact.corporateOffice.city} - {companyDetails.contact.corporateOffice.pincode}<br />
                      {companyDetails.contact.corporateOffice.state}, {companyDetails.contact.corporateOffice.country}
                    </p>
                  </div>
                </div>

                {/* Regional Office */}
                <div className="flex items-start space-x-3.5 p-3.5 bg-white rounded-xl border border-brand-gray-muted shadow-sm">
                  <div className="p-3 bg-brand-yellow-dark text-white rounded-lg flex-shrink-0 shadow">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-brand-yellow-dark font-extrabold uppercase tracking-wider">22. Regional Office</span>
                    <h5 className="text-xs font-bold text-brand-green-dark mt-0.5">{companyDetails.contact.regionalOffice.building}</h5>
                    <p className="text-xs text-brand-gray-dark leading-relaxed font-medium mt-0.5">
                      {companyDetails.contact.regionalOffice.line1}<br />
                      {companyDetails.contact.regionalOffice.area}, {companyDetails.contact.regionalOffice.city} - {companyDetails.contact.regionalOffice.pincode}<br />
                      {companyDetails.contact.regionalOffice.state}, {companyDetails.contact.regionalOffice.country}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Regional Offices Grid */}
      <section className="py-20 bg-brand-gray-light border-t border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-green font-bold text-xs uppercase tracking-wider block">
              Pan-India Presence
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-brand-green-dark mt-1">
              Our Offices
            </h2>
            <p className="text-xs text-brand-gray mt-1 leading-relaxed">
              Providing local customs clearance and transportation logistics coordination across key economic shipping sectors.
            </p>
          </div>

          {/* Desktop 4 cols, Tablet 2 cols, Mobile 1 col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officesData.map((office) => (
              <div 
                key={office.id} 
                className="bg-white rounded-xl shadow-sm border border-brand-gray-muted p-5 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Icon & City */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-green-bg text-brand-green rounded-lg">
                      <Compass className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-brand-green-dark text-base">{office.city}</h3>
                  </div>

                  {/* Address */}
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {office.address}
                  </p>
                  
                  {/* Pincode */}
                  <p className="text-xs text-brand-green-dark font-semibold">
                    Pincode: {office.pincode}
                  </p>

                  {/* Phone & Email */}
                  <div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-brand-gray-dark">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                      <span className="font-semibold text-gray-700">Phone: </span>
                      <a href="tel:04425264647" className="font-bold text-brand-green-dark hover:text-brand-green">
                        {office.phone || "044 2526 4647"}
                      </a>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                      <span className="font-semibold text-gray-700">Email: </span>
                      <a href="mailto:info@kpsgroups.net" className="text-brand-green-dark hover:text-brand-green">
                        {office.email || "info@kpsgroups.net"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-6 border-t border-brand-gray-muted pt-4">
                  <a
                    href={office.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center bg-brand-green hover:bg-brand-green-light text-white text-[11px] font-semibold py-2 px-2.5 rounded shadow-sm transition-colors duration-200"
                  >
                    Get Directions
                  </a>
                  <button
                    onClick={() => handleViewDetails(office)}
                    className="bg-brand-gray-light hover:bg-brand-gray-muted text-brand-green-dark text-[11px] font-semibold py-2 px-2.5 rounded border border-brand-gray-muted transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Details Modal (View Details Handler) */}
      <AnimatePresence>
        {selectedOffice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-brand-green/10"
            >
              {/* Header */}
              <div className="bg-brand-green text-white p-5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-bold text-lg">{selectedOffice.city} Branch Office</h3>
                </div>
                <button
                  onClick={() => setSelectedOffice(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-brand-gray uppercase font-semibold">Address</span>
                    <p className="text-xs text-brand-gray-dark font-medium leading-relaxed mt-0.5">{selectedOffice.address}</p>
                    <p className="text-xs text-brand-green font-bold mt-1">Pincode: {selectedOffice.pincode}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-brand-gray uppercase font-semibold">Branch Head</span>
                    <p className="text-xs text-brand-gray-dark font-medium mt-0.5">{selectedOffice.manager}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-brand-gray uppercase font-semibold">Direct Phone</span>
                    <a href="tel:04425264647" className="text-xs text-brand-green-dark font-bold hover:underline mt-0.5 block">044 2526 4647</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-brand-gray uppercase font-semibold">Email Desk</span>
                    <a href="mailto:info@kpsgroups.net" className="text-xs text-brand-green-dark font-bold hover:underline mt-0.5 block">info@kpsgroups.net</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-brand-gray uppercase font-semibold">Office Hours</span>
                    <p className="text-xs text-brand-gray-dark font-medium mt-0.5">{selectedOffice.hours}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-brand-gray-light px-6 py-4 flex justify-end space-x-3 border-t border-brand-gray-muted">
                <button
                  onClick={() => setSelectedOffice(null)}
                  className="px-4 py-2 bg-brand-gray hover:bg-brand-gray-dark text-white rounded text-xs font-semibold"
                >
                  Close
                </button>
                <a
                  href={selectedOffice.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-brand-green hover:bg-brand-green-light text-white rounded text-xs font-semibold shadow-sm"
                >
                  Open in Maps
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
