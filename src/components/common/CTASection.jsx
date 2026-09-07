import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Phone, Mail, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { companyDetails } from '../../data/company';

export default function CTASection() {
  return (
    <section className="relative bg-[#072419] py-12 sm:py-16 md:py-20 overflow-hidden border-t border-brand-green/40 text-white">
      {/* Background Graphic elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80')` }}
      ></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/30 rounded-full blur-3xl translate-y-12 -translate-x-12 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-1.5 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full text-brand-yellow text-[10px] sm:text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-yellow" />
            <span>PARTNER WITH KPS WORLDWIDE LOGISTICS</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Move Your Cargo With <span className="text-brand-yellow">Confidence.</span>
          </h2>
          
          <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            From standard containerized freight to complex industrial and over dimensional cargo, KPS Worldwide Logistics provides the expertise, coordination, and logistics infrastructure required to move cargo across global trade lanes.
          </p>
          
          {/* Dual Action Buttons (Stacked on mobile, row on desktop) */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link
              to="/lead-form"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-6 sm:px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm transform hover:-translate-y-0.5"
            >
              <span>Request a Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact-us"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-6 sm:px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm"
            >
              <span>Talk to Our Logistics Engineers</span>
            </Link>
          </div>

          {/* Direct Support Strip */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-gray-300">
            <a 
              href={`tel:${companyDetails.contact.phone}`} 
              className="flex items-center space-x-2 hover:text-brand-yellow transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Direct: <strong className="text-white font-bold">{companyDetails.contact.phone}</strong></span>
            </a>
            <span className="hidden sm:inline text-white/30">|</span>
            <a 
              href={`mailto:${companyDetails.contact.email}`} 
              className="flex items-center space-x-2 hover:text-brand-yellow transition-colors font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Email: <strong className="text-white font-bold">{companyDetails.contact.email}</strong></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


