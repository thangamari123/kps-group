'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Compass, Globe, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '@/components/common/PageHero';
import ContactForm from '@/components/forms/ContactForm';
import { officesData } from '@/data/offices';
import { companyDetails } from '@/data/company';

export default function ContactContent() {
  const [selectedOffice, setSelectedOffice] = useState(null);

  const handleViewDetails = (office) => {
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
      <PageHero 
        title="Contact Us" 
        description="Get in touch with KPS Worldwide Logistics for expert freight forwarding, customs clearance, and heavy project logistics."
        bgImage="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
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

              <div className="space-y-4">
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
                        <span className="text-gray-400 font-medium">Operations: </span>
                        <a href="mailto:pricing@kpsgroups.net" className="text-brand-green-dark hover:text-brand-green font-bold transition-colors">
                          pricing@kpsgroups.net
                        </a>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400 font-medium">Corporate: </span>
                        <a href="mailto:info@kpsgroups.net" className="text-brand-green-dark hover:text-brand-green font-bold transition-colors">
                          info@kpsgroups.net
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 bg-brand-gray-light rounded-xl border border-brand-gray-muted/60">
                  <div className="p-3 bg-brand-green text-white rounded-lg flex-shrink-0 shadow">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-brand-green font-bold uppercase tracking-wider">
                      Corporate Office (Parrys)
                    </span>
                    <p className="text-xs text-brand-gray-dark font-medium leading-relaxed mt-0.5">
                      No. 14, 6th Floor, A.K. Nayak Bhavan, Jahangir Street, Second Line Beach, Parrys, Chennai – 600 001.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 bg-brand-gray-light rounded-xl border border-brand-gray-muted/60">
                  <div className="p-3 bg-brand-yellow text-brand-green-dark rounded-lg flex-shrink-0 shadow">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-brand-green font-bold uppercase tracking-wider">
                      Regional Office (Guindy)
                    </span>
                    <p className="text-xs text-brand-gray-dark font-medium leading-relaxed mt-0.5">
                      Flat No. 5B, 5th Floor, Kences Towers, No. 1, Ramakrishna Street, North Usman Road, T. Nagar, Chennai – 600 017.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Regional Office Network */}
      <section className="py-16 bg-brand-gray-light border-t border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-brand-green font-bold text-xs uppercase tracking-wider block">
              Pan-India Branch Network
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-green-dark">
              Regional Operations Across Major Maritime Hubs
            </h3>
            <p className="text-xs sm:text-sm text-brand-gray mt-2 font-light">
              Direct presence and dedicated liaison counters across key commercial corridors and sea ports in India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {officesData.map((office) => (
              <div 
                key={office.id}
                className="bg-white border border-brand-gray-muted rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-green-dark group-hover:text-brand-green transition-colors uppercase tracking-wider">
                      {office.city}
                    </span>
                    <span className="text-[10px] font-semibold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded">
                      {office.state}
                    </span>
                  </div>
                  <p className="text-xs text-brand-gray leading-relaxed font-light">
                    {office.address}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-light">{office.type}</span>
                  <button 
                    onClick={() => handleViewDetails(office)}
                    className="font-bold text-brand-green hover:text-brand-green-light transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Details Modal */}
      <AnimatePresence>
        {selectedOffice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-brand-gray-muted space-y-4"
            >
              <button 
                onClick={() => setSelectedOffice(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                <MapPin className="w-5 h-5 text-brand-green" />
                <h4 className="text-lg font-bold text-brand-green-dark">{selectedOffice.city} Branch Office</h4>
              </div>

              <div className="space-y-3 text-xs text-brand-gray leading-relaxed">
                <div>
                  <strong className="text-brand-green-dark block mb-0.5">Address:</strong>
                  <p>{selectedOffice.address}</p>
                </div>
                {selectedOffice.manager && (
                  <div>
                    <strong className="text-brand-green-dark block mb-0.5">Operations Lead:</strong>
                    <p>{selectedOffice.manager}</p>
                  </div>
                )}
                {selectedOffice.hours && (
                  <div>
                    <strong className="text-brand-green-dark block mb-0.5">Working Hours:</strong>
                    <p>{selectedOffice.hours}</p>
                  </div>
                )}
                <div>
                  <strong className="text-brand-green-dark block mb-0.5">Central Support Desk:</strong>
                  <p>044 - 45088099 | info@kpsgroups.net</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedOffice(null)}
                  className="bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-green-dark transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
