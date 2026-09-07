import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  Globe, 
  Anchor, 
  Truck, 
  FileText, 
  Warehouse, 
  Layers, 
  ChevronRight, 
  PhoneCall, 
  Mail, 
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function ServiceSidebar({ currentPath, bgImage }) {
  const { pathname } = useLocation();

  const navLinks = [
    { num: "01", name: "Containerized Cargo", path: "/services/containerized-cargo", icon: <Package className="w-3.5 h-3.5" /> },
    { num: "02", name: "Freight Forwarding", path: "/services/freight-forwarding", icon: <Globe className="w-3.5 h-3.5" /> },
    { num: "03", name: "Project & Maritime", path: "/services/project-logistics", icon: <Anchor className="w-3.5 h-3.5" /> },
    { num: "04", name: "Over Dimensional Cargo", path: "/services/odc", icon: <Truck className="w-3.5 h-3.5" /> },
    { num: "05", name: "Customs Brokerage", path: "/services/customs-brokerage", icon: <FileText className="w-3.5 h-3.5" /> },
    { num: "06", name: "Industrial Warehousing", path: "/services/warehousing", icon: <Warehouse className="w-3.5 h-3.5" /> },
    { num: "07", name: "FTWZ Solutions Hub", path: "/services/ftwz", icon: <Layers className="w-3.5 h-3.5" /> }
  ];

  return (
    <aside className="space-y-4 lg:sticky lg:top-28">
      {/* Ultra-Compact Unified Services Directory */}
      <div className="bg-white border border-brand-gray-muted rounded-2xl p-3 sm:p-3.5 shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-gray-muted/80">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
            <h4 className="text-[11px] font-extrabold text-brand-green-dark tracking-wider uppercase">
              Services Directory
            </h4>
          </div>
          <span className="text-[9px] font-bold font-mono bg-brand-gray-light text-brand-gray px-1.5 py-0.5 rounded border border-brand-gray-muted/60">
            7 Divisions
          </span>
        </div>

        <nav className="space-y-1">
          {navLinks.map((link, idx) => {
            const active = pathname === link.path;
            return (
              <Link
                key={idx}
                to={link.path}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all duration-150 group ${
                  active
                    ? 'bg-brand-green-dark text-brand-yellow font-bold shadow-2xs'
                    : 'text-brand-gray-dark hover:bg-brand-gray-light hover:text-brand-green font-medium'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`text-[10px] font-mono font-bold ${active ? 'text-brand-yellow/80' : 'text-brand-gray/70'}`}>
                    {link.num}
                  </span>
                  <span className={`flex-shrink-0 ${active ? 'text-brand-yellow' : 'text-brand-green group-hover:text-brand-green'}`}>
                    {link.icon}
                  </span>
                  <span className="truncate text-xs">{link.name}</span>
                </div>
                
                <div className="flex items-center pl-1.5">
                  {active ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></span>
                  ) : (
                    <ChevronRight className="w-3 h-3 text-brand-gray/40 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Direct Technical Consultation Card */}
      <div className="bg-brand-green-dark text-white rounded-2xl p-6 relative overflow-hidden shadow-xl border border-brand-green/30">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
          style={{ backgroundImage: `url('${bgImage || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"}')` }}
        ></div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-1 bg-brand-yellow/20 text-brand-yellow px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            <span>Dedicated Desk</span>
          </div>

          <h4 className="text-lg font-bold text-white leading-snug">
            Need Expert Logistics Consultation?
          </h4>
          
          <p className="text-xs text-gray-300 leading-relaxed font-light">
            Speak directly with our maritime directors, customs clearance brokers, and route survey engineers.
          </p>
          
          <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
            <a 
              href="tel:04445088099" 
              className="flex items-center space-x-2 text-brand-yellow hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>044 - 45088099</span>
            </a>
            <a 
              href="mailto:bsp@kpsgroups.net" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>bsp@kpsgroups.net</span>
            </a>
            <div className="flex items-center space-x-2 text-gray-400 text-[11px] pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>09:00 AM - 06:00 PM (IST)</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/lead-form"
              className="w-full inline-flex items-center justify-center space-x-2 text-xs font-bold bg-brand-yellow text-brand-green-dark px-4 py-3 rounded-xl hover:bg-white transition-colors shadow-md"
            >
              <span>Request a Custom Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
