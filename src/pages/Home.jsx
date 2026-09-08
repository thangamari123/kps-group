import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ship, Shield, Cpu, Users, ChevronLeft, ChevronRight, ArrowRight, Check, CheckCircle2,
  FileText, Truck, Warehouse, Anchor, Clock, ShieldCheck, TrendingUp, Globe,
  MapPin, Heart, Award, Settings, Briefcase, Play, X, Info, Package, Handshake,
  LineChart, Radio, Activity, Database, Server, Wifi, FileCheck, Layers, Compass, Navigation,
  Phone, Mail, Building2, Send, Trophy, Calendar, Landmark, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { companyDetails } from '../data/company';
import { servicesData } from '../data/services';
import { officesData } from '../data/offices';
import { awardsData } from '../data/awards';
import SEO from '../components/common/SEO';

import automotiveLogisticsImg from '../assets/Automotive Logistics.webp';
import automotivePartsLogisticsImg from '../assets/Automotive Parts Logistics.webp';
import fmcgLogisticsImg from '../assets/FMCG Logistics.webp';
import manufacturingLogisticsImg from '../assets/Manufacturing & Industrial Logistics.webp';
import healthcareLogisticsImg from '../assets/Healthcare Logistics.webp';
import projectCargoLogisticsImg from '../assets/Project Cargo Logistics.webp';

// Animated Counter Component for trust statistics
function Counter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const numericPart = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9,]/g, ''); 
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericPart;
      const steps = 50;
      const stepTime = (duration * 1000) / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        const current = Math.floor((end * step) / steps);
        if (step >= steps) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(current);
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [isInView, numericPart, duration]);
  
  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// City Landmark Line-Art Illustrations for Office Cards
function BengaluruLandmark() {
  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      <svg viewBox="0 0 120 62" className="w-12 xs:w-14 sm:w-20 md:w-24 h-auto text-slate-400" fill="none" stroke="currentColor">
        {/* Central Dome & Spire */}
        <path d="M60 4 v-2.5 M58 1.5 h4 M60 4 c-6 0 -10 5 -10 11 h20 c0 -6 -4 -11 -10 -11 z" strokeWidth="1.1" fill="currentColor" fillOpacity="0.1" />
        <path d="M48 15 h24 v2 h-24 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.15" />
        {/* Side Domes */}
        <path d="M37 10 c-3 0 -5 3 -5 6.5 h10 c0 -3.5 -2 -6.5 -5 -6.5 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.08" />
        <path d="M83 10 c-3 0 -5 3 -5 6.5 h10 c0 -3.5 -2 -6.5 -5 -6.5 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.08" />
        {/* Main Roof Arch & Triangular Pediment */}
        <path d="M22 19.5 L60 16 L98 19.5 v2.5 H22 z" strokeWidth="1" fill="currentColor" fillOpacity="0.06" />
        {/* Pillared Colonnade */}
        <path d="M24 22 h72 v19 h-72 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.04" />
        {/* Vertical Columns */}
        <line x1="28" y1="22" x2="28" y2="41" strokeWidth="0.9" />
        <line x1="34" y1="22" x2="34" y2="41" strokeWidth="0.9" />
        <line x1="40" y1="22" x2="40" y2="41" strokeWidth="0.9" />
        <line x1="46" y1="22" x2="46" y2="41" strokeWidth="0.9" />
        <line x1="52" y1="22" x2="52" y2="41" strokeWidth="0.9" />
        <line x1="58" y1="22" x2="58" y2="41" strokeWidth="0.9" />
        <line x1="62" y1="22" x2="62" y2="41" strokeWidth="0.9" />
        <line x1="68" y1="22" x2="68" y2="41" strokeWidth="0.9" />
        <line x1="74" y1="22" x2="74" y2="41" strokeWidth="0.9" />
        <line x1="80" y1="22" x2="80" y2="41" strokeWidth="0.9" />
        <line x1="86" y1="22" x2="86" y2="41" strokeWidth="0.9" />
        <line x1="92" y1="22" x2="92" y2="41" strokeWidth="0.9" />
        {/* Base Steps Plinth */}
        <path d="M18 41 h84 v2 h-84 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.08" />
        <path d="M14 43 h92 v2 h-92 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.1" />
        <path d="M10 45 h100 v1.5 h-100 z" strokeWidth="1" />
      </svg>
      <span className="text-[5.5px] sm:text-[7.5px] md:text-[8px] font-bold text-slate-500 tracking-[0.18em] sm:tracking-[0.22em] uppercase -mt-0.5">
        BENGALURU
      </span>
    </div>
  );
}

function TuticorinLandmark() {
  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      <svg viewBox="0 0 120 62" className="w-12 xs:w-14 sm:w-20 md:w-24 h-auto text-slate-400" fill="none" stroke="currentColor">
        {/* Cargo Vessel */}
        <path d="M8 41 L16 32 h28 l4 9 z" strokeWidth="1.1" fill="currentColor" fillOpacity="0.08" />
        <path d="M16 32 v-6 h12 v6 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.05" />
        <path d="M20 26 v-4 h4 v4" strokeWidth="0.9" />
        <line x1="22" y1="22" x2="22" y2="16" strokeWidth="0.9" />
        {/* Cargo Containers */}
        <rect x="30" y="26" width="6" height="6" strokeWidth="0.8" fill="currentColor" fillOpacity="0.1" />
        <rect x="36" y="26" width="6" height="6" strokeWidth="0.8" fill="currentColor" fillOpacity="0.1" />
        <rect x="33" y="20" width="6" height="6" strokeWidth="0.8" fill="currentColor" fillOpacity="0.1" />
        {/* Hull waterline */}
        <path d="M6 41 Q25 43 50 41" strokeWidth="1.1" />
        {/* Gantry Crane 1 */}
        <path d="M54 46 L64 10 L74 46" strokeWidth="1.1" />
        <path d="M64 10 L102 6 M64 10 L46 12" strokeWidth="1.1" />
        <path d="M64 6 L64 10" strokeWidth="1.1" />
        <line x1="64" y1="6" x2="98" y2="6" strokeWidth="0.8" />
        <line x1="64" y1="6" x2="48" y2="12" strokeWidth="0.8" />
        <line x1="58" y1="27" x2="70" y2="27" strokeWidth="0.8" />
        <line x1="56" y1="38" x2="72" y2="38" strokeWidth="0.8" />
        <line x1="84" y1="6" x2="84" y2="25" strokeWidth="0.8" strokeDasharray="1,1" />
        <rect x="81" y="25" width="6" height="4" strokeWidth="0.8" fill="currentColor" fillOpacity="0.15" />
        {/* Gantry Crane 2 in Background */}
        <path d="M76 46 L84 15 L92 46" strokeWidth="0.8" opacity="0.6" />
        <path d="M84 15 L108 12 M84 15 L70 17" strokeWidth="0.8" opacity="0.6" />
        {/* Dock Pier Line */}
        <line x1="50" y1="46" x2="114" y2="46" strokeWidth="1.1" />
        <line x1="6" y1="48" x2="114" y2="48" strokeWidth="0.8" strokeDasharray="2,2" />
      </svg>
      <span className="text-[5.5px] sm:text-[7.5px] md:text-[8px] font-bold text-slate-500 tracking-[0.18em] sm:tracking-[0.22em] uppercase -mt-0.5">
        TUTICORIN
      </span>
    </div>
  );
}

function VisakhapatnamLandmark() {
  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      <svg viewBox="0 0 120 62" className="w-12 xs:w-14 sm:w-20 md:w-24 h-auto text-slate-400" fill="none" stroke="currentColor">
        {/* Dolphin's Nose Hill */}
        <path d="M42 46 C54 31 68 23 86 25 C96 26 106 34 114 46 z" strokeWidth="1.1" fill="currentColor" fillOpacity="0.06" />
        <path d="M62 46 C72 35 82 32 94 34 C102 36 108 41 112 46 z" strokeWidth="0.8" opacity="0.5" />
        {/* Lighthouse */}
        <path d="M92 25 L93 9 h4 l1 16 z" strokeWidth="1" fill="currentColor" fillOpacity="0.12" />
        <path d="M91 9 h8 v-2.5 h-8 z" strokeWidth="0.9" />
        <path d="M93 6.5 L95 3 L97 6.5 z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.2" />
        {/* Light Beam */}
        <line x1="91" y1="7" x2="70" y2="2" strokeWidth="0.7" strokeDasharray="2,2" />
        <line x1="91" y1="8" x2="66" y2="12" strokeWidth="0.7" strokeDasharray="2,2" />
        {/* Sea Vessel in Water */}
        <path d="M12 42 L18 36 h18 l3 6 z" strokeWidth="1" fill="currentColor" fillOpacity="0.08" />
        <path d="M20 36 v-4.5 h8 v4.5 z" strokeWidth="0.8" />
        <line x1="24" y1="31.5" x2="24" y2="27" strokeWidth="0.8" />
        {/* Water Waves */}
        <path d="M6 46 Q20 44 38 46 T75 46 T114 46" strokeWidth="1.1" />
        <path d="M12 49 Q28 48 48 49 T88 49 T110 49" strokeWidth="0.8" strokeDasharray="3,2" />
      </svg>
      <span className="text-[5px] sm:text-[7px] md:text-[7.5px] font-bold text-slate-500 tracking-[0.14em] sm:tracking-[0.18em] uppercase -mt-0.5">
        VISAKHAPATNAM
      </span>
    </div>
  );
}

function KochiLandmark() {
  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      <svg viewBox="0 0 120 62" className="w-12 xs:w-14 sm:w-20 md:w-24 h-auto text-slate-400" fill="none" stroke="currentColor">
        {/* Stilt Platforms */}
        <line x1="86" y1="46" x2="86" y2="31" strokeWidth="1.3" />
        <line x1="92" y1="46" x2="92" y2="31" strokeWidth="1.3" />
        <line x1="82" y1="31" x2="96" y2="31" strokeWidth="1.3" />
        {/* Cantilever Structure */}
        <line x1="86" y1="31" x2="70" y2="9" strokeWidth="1.2" />
        <line x1="86" y1="31" x2="106" y2="39" strokeWidth="1.2" />
        {/* Counterweights */}
        <circle cx="106" cy="41" r="2.2" strokeWidth="0.9" fill="currentColor" fillOpacity="0.2" />
        <circle cx="103" cy="43" r="1.8" strokeWidth="0.9" fill="currentColor" fillOpacity="0.2" />
        {/* Fishing Net Arms */}
        <line x1="70" y1="9" x2="20" y2="31" strokeWidth="1.2" />
        <line x1="70" y1="9" x2="46" y2="39" strokeWidth="1.1" />
        <line x1="70" y1="9" x2="16" y2="41" strokeWidth="1.1" />
        <line x1="70" y1="9" x2="36" y2="22" strokeWidth="0.9" />
        {/* Net suspended into water */}
        <path d="M20 31 Q32 41 46 39 Q30 45 16 41 Q14 35 20 31 z" strokeWidth="1" fill="currentColor" fillOpacity="0.08" />
        <path d="M24 33 Q32 39 40 38" strokeWidth="0.6" strokeDasharray="1,1" />
        <path d="M20 37 Q28 41 34 40" strokeWidth="0.6" strokeDasharray="1,1" />
        {/* Background second net */}
        <line x1="94" y1="31" x2="80" y2="15" strokeWidth="0.8" opacity="0.6" />
        <line x1="80" y1="15" x2="44" y2="29" strokeWidth="0.8" opacity="0.6" />
        {/* Water Waves */}
        <path d="M8 46 Q30 44 58 46 T98 46 T114 46" strokeWidth="1.1" />
        <line x1="14" y1="49" x2="108" y2="49" strokeWidth="0.8" strokeDasharray="3,2" />
      </svg>
      <span className="text-[5.5px] sm:text-[7.5px] md:text-[8px] font-bold text-slate-500 tracking-[0.18em] sm:tracking-[0.22em] uppercase -mt-0.5">
        KOCHI
      </span>
    </div>
  );
}

export default function Home() {
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedAward, setSelectedAward] = useState(null);
  const [activeInsight, setActiveInsight] = useState(0);
  const [isInsightPaused, setIsInsightPaused] = useState(false);
  const [activeAwardSlide, setActiveAwardSlide] = useState(0);
  const [isAwardPaused, setIsAwardPaused] = useState(false);
  const [activeHeroHeading, setActiveHeroHeading] = useState(0);

  const heroHeadings = [
    {
      title: "Shipping & Logistics Solutions",
      highlight: "in Chennai Since 1985",
      desc: "Licensed customs brokerage, multimodal freight forwarding, and strategic logistics backed by 40+ years of proven operational excellence."
    },
    {
      title: "End-to-End Shipping,",
      highlight: "Freight & Logistics Services",
      desc: "Comprehensive global container forwarding, heavy lift project cargo handling, and dedicated supply chain solutions engineered for global scale."
    },
    {
      title: "Customs Brokerage,",
      highlight: "Transportation & Warehousing Solutions",
      desc: "In-house CHA clearance (R-50), nationwide multi-axle fleet distribution, and tax-deferred FTWZ warehousing across major trade lanes."
    }
  ];

  // Auto-cycle Hero Headings
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroHeading((prev) => (prev + 1) % heroHeadings.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroHeadings.length]);

  // Auto-slide for Insights (Mobile only)
  useEffect(() => {
    if (isInsightPaused) return;
    const timer = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, [isInsightPaused]);

  // Auto-slide for Awards (Mobile only)
  useEffect(() => {
    if (isAwardPaused) return;
    const timer = setInterval(() => {
      setActiveAwardSlide((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, [isAwardPaused]);

  // Section 3: 6 Core Capabilities cards list
  const servicesList = [
    {
      id: "01",
      name: "Containerized Cargo (FCL & LCL)",
      tag: "FCL • LCL • Specialized Reefer",
      desc: "Reliable, scheduled container shipping solutions optimized for high-volume trade lanes with real-time digital equipment monitoring.",
      path: "/services/containerized-cargo",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      icon: <Package className="w-5 h-5" />
    },
    {
      id: "02",
      name: "Project Cargo & Maritime Operations",
      tag: "Break Bulk • RoRo • Turnkey Logistics",
      desc: "Turnkey project logistics for break bulk charters, heavy industrial components, rolling stock, and specialized port vessel stevedoring.",
      path: "/services/project-logistics",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
      icon: <Anchor className="w-5 h-5" />
    },
    {
      id: "03",
      name: "Over Dimensional Cargo (ODC)",
      tag: "Hydraulic Multi-Axle • Route Feasibility",
      desc: "Heavy-haul transport with comprehensive civil surveys, bridge load engineering, hydraulic modular trailers, and dedicated route escorts.",
      path: "/services/odc",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: "04",
      name: "Customs Brokerage & CHA Compliance",
      tag: "CHA License R-50 • 24/7 ICEGATE",
      desc: "In-house licensed customs brokerage (R-50/Chennai), direct port clearance desks, precise HTS tariff coding, and duty benefit optimization.",
      path: "/services/customs-brokerage",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: "05",
      name: "Multimodal Freight Forwarding",
      tag: "Sea + Air + Road • Global Corridors",
      desc: "Seamless intermodal transit combining ocean carriers, expedited air charters, and nationwide express trucking networks.",
      path: "/services/freight-forwarding",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: "06",
      name: "Industrial Warehousing & FTWZ Hubs",
      tag: "Duty Deferment • Covered & Open Storage",
      desc: "Strategic warehousing, bonded customs facilities, dedicated ODC open storage yards, and tax-deferred Free Trade Warehousing Zones (FTWZ).",
      path: "/services/warehousing",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80",
      icon: <Warehouse className="w-5 h-5" />
    }
  ];

  // Section 4: End-to-end supply chain steps
  const journeySteps = [
    { 
      id: "01", 
      title: "Origin & Survey", 
      fullTitle: "Cargo Planning & Origin Pickup",
      desc: "Route feasibility analysis, export crating, and supplier facility coordination.",
      icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" />, 
      theme: "#072419" 
    },
    { 
      id: "02", 
      title: "Global Freight", 
      fullTitle: "Multimodal Freight Transit",
      desc: "Ocean FCL/LCL, break bulk vessel chartering, and air cargo across global trade lanes.",
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" />, 
      theme: "#0b5131" 
    },
    { 
      id: "03", 
      title: "Port Operations", 
      fullTitle: "Port Handling & Stevedoring",
      desc: "Direct berth operations, heavy crane lifting, marine lashing, and terminal liaison.",
      icon: <Anchor className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" />, 
      theme: "#105662" 
    },
    { 
      id: "04", 
      title: "Customs Brokerage", 
      fullTitle: "ICEGATE Digital Customs Filing",
      desc: "Licensed customs brokerage, HS classification, and PGA statutory approvals.",
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" />, 
      theme: "#072419" 
    },
    { 
      id: "05", 
      title: "Warehousing & FTWZ", 
      fullTitle: "Bonded Storage & FTWZ Hub",
      desc: "Duty-deferred storage, FTWZ consolidation, and inventory control.",
      icon: <Warehouse className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" />, 
      theme: "#0e7490" 
    },
    { 
      id: "06", 
      title: "Inland Haulage", 
      fullTitle: "Inland Transportation & ODC",
      desc: "Hydraulic multi-axle modular trailers, GPS tracking, and route escorts.",
      icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" />, 
      theme: "#0b5131" 
    },
    { 
      id: "07", 
      title: "Final Delivery", 
      fullTitle: "Final-Mile Site Delivery & OOC",
      desc: "Out of Charge cargo handover, foundation placement, and proof of delivery.",
      icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow" />, 
      theme: "#105662" 
    }
  ];

  // Section 5: The KPS Advantage — Key Strategic Importance Points
  const kpsAdvantagePoints = [
    {
      id: "01",
      tag: "LICENSED CUSTOMS BROKERAGE",
      title: "Direct Port Clearance Authority (CHA R-50)",
      highlight: "In-House Custom Broker (Zero Middlemen)",
      desc: "Operating with our own direct CHA License R-50 at Chennai Customs with 24/7 direct ICEGATE digital EDI clearances across major Indian sea and air ports.",
      points: [
        "In-house licensed Custom House Agent (CHA License R-50)",
        "24/7 direct ICEGATE digital EDI filing & duty calculation",
        "Expert HTS tariff classification & project duty exemptions"
      ],
      icon: <ShieldCheck className="w-5 h-5" />
    },
    {
      id: "02",
      tag: "PROJECT & HEAVY-LIFT ENGINEERING",
      title: "Turnkey Over Dimensional Cargo (ODC)",
      highlight: "Engineering-Backed Heavy Haulage",
      desc: "Dedicated route feasibility studies, bridge load simulations, hydraulic modular multi-axles, and dedicated escort operations for ultra-heavy machinery.",
      points: [
        "Pre-route civil surveys, turning radius & bridge load analysis",
        "Hydraulic modular multi-axles & specialized drop-deck trailers",
        "Police escorts, statutory highway permissions & power shutdown escorts"
      ],
      icon: <Cpu className="w-5 h-5" />
    },
    {
      id: "03",
      tag: "MULTIMODAL CONNECTIVITY",
      title: "Pan-India Port & Inland Corridors",
      highlight: "Integrated Sea, Air, Road & Rail",
      desc: "Strategic branch offices and on-site port clearance desks across Chennai, Ennore, Kattupalli, Tuticorin, Kochi, and Bengaluru industrial hubs.",
      points: [
        "Permanent desks across all key South Indian maritime ports",
        "Multi-port coordination for Break Bulk, RoRo & Containerized cargo",
        "Direct road & rail feeder access to Inland Container Depots (ICDs)"
      ],
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: "04",
      tag: "TAX & WORKING CAPITAL OPTIMIZATION",
      title: "Free Trade Warehousing Zone (FTWZ) Hubs",
      highlight: "Customs Duty Deferment & Trading Hubs",
      desc: "Notified FTWZ warehousing allowing 100% customs duty deferment, international trading, foreign currency transactions, and repackaging.",
      points: [
        "Indefinite duty deferment until goods enter Domestic Tariff Area (DTA)",
        "Foreign currency billing & offshore cargo consolidation",
        "Value-added sorting, kitting, lab testing, and industrial crating"
      ],
      icon: <Warehouse className="w-5 h-5" />
    },
    {
      id: "05",
      tag: "PROVEN TRACK RECORD",
      title: "40+ Years of Zero-Compliance Defects",
      highlight: "Established 1985 • 200,000+ Filings Annually",
      desc: "Four decades of trusted logistics partnerships with Fortune 500 manufacturers, energy conglomerates, and global trading enterprises.",
      points: [
        "Over 40 years of continuous supply chain leadership",
        "2,00,000+ customs entries processed with pristine audit records",
        "Zero-delay clearance track record for time-critical factory lines"
      ],
      icon: <Award className="w-5 h-5" />
    },
    {
      id: "06",
      tag: "EXECUTIVE SINGLE-POINT ACCOUNTABILITY",
      title: "Director-Led Shipment Governance",
      highlight: "Single-Point Dedicated Project Command",
      desc: "Direct involvement of experienced logistics directors and dedicated project managers for every shipment from booking to final site handover.",
      points: [
        "Direct single point of contact with senior logistics engineers",
        "Real-time GPS tracking & proactive milestone escalation",
        "Tailored SLA compliance reports for executive supply chain teams"
      ],
      icon: <Users className="w-5 h-5" />
    }
  ];

  // Section 6: Industries We Serve (6 Key Sectors)
  const industries = [
    {
      id: "automotive-logistics",
      name: "Automotive Logistics",
      tag: "Auto & RoRo",
      desc: "Reliable vehicle transportation and assembly line feeding for automotive OEMs.",
      bullets: [
        "Vehicle transportation",
        "Inbound & outbound logistics",
        "Time-critical deliveries",
        "Supply chain coordination"
      ],
      path: "/industries/automotive-logistics",
      image: automotiveLogisticsImg
    },
    {
      id: "automotive-parts-logistics",
      name: "Automotive Parts Logistics",
      tag: "Tier-1 Parts",
      desc: "Just-In-Time delivery, sequencing and distribution for tier-1 auto components.",
      bullets: [
        "Spare parts transportation",
        "Just-in-time (JIT) delivery",
        "Warehousing & distribution",
        "Component movement"
      ],
      path: "/industries/automotive-parts-logistics",
      image: automotivePartsLogisticsImg
    },
    {
      id: "fmcg-logistics",
      name: "FMCG Logistics",
      tag: "FMCG / Retail",
      desc: "Fast, agile transportation and distribution for time-sensitive FMCG shipments.",
      bullets: [
        "FMCG transportation",
        "Distribution & last-mile delivery",
        "Inventory movement",
        "Time-sensitive shipments"
      ],
      path: "/industries/fmcg-logistics",
      image: fmcgLogisticsImg
    },
    {
      id: "manufacturing-industrial-logistics",
      name: "Manufacturing & Industrial Logistics",
      tag: "Industrial Plants",
      desc: "Specialized logistics for industrial equipment, raw materials, and heavy cargo.",
      bullets: [
        "Industrial equipment transportation",
        "Raw material movement",
        "Factory-to-site logistics",
        "Heavy & specialized cargo"
      ],
      path: "/industries/manufacturing-industrial-logistics",
      image: manufacturingLogisticsImg
    },
    {
      id: "healthcare-logistics",
      name: "Healthcare Logistics",
      tag: "Pharma & Health",
      desc: "Temperature-controlled and time-critical logistics for pharma and medical devices.",
      bullets: [
        "Medical equipment transportation",
        "Pharmaceutical logistics",
        "Temperature-sensitive shipments",
        "Secure & time-critical delivery"
      ],
      path: "/industries/healthcare-logistics",
      image: healthcareLogisticsImg
    },
    {
      id: "project-cargo-logistics",
      name: "Project Cargo Logistics",
      tag: "Heavy Lift & ODC",
      desc: "Planned turnkey solutions for oversized, heavy-lift, and specialized project cargo.",
      bullets: [
        "Oversized & heavy cargo",
        "Machinery transportation",
        "Multimodal transportation",
        "Project-based logistics planning"
      ],
      path: "/industries/project-cargo-logistics",
      image: projectCargoLogisticsImg
    }
  ];

  // Section 10: Case Studies Success Stories
  const caseStudies = [
    {
      title: "Industrial Machinery Import & Project Movement",
      category: "Project Logistics",
      challenge: "Complex customs procedures and oversized heavy-lift cargo transport constraints.",
      solution: "Integrated customs clearance coordination, specialized heavy multi-axle vehicle transportation, and crane operations.",
      result: "Successful execution and port-to-factory delivery within the required project timeline.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Urgent Automotive Component Dispatch",
      category: "Freight & Clearance",
      challenge: "Critical factory assembly line-stoppage risk due to port documentation delay.",
      solution: "24/7 customs clearance desk operations, digital documentation pre-filing, and express fleet deployment.",
      result: "Clearance and door-to-door delivery executed within 24 hours, ensuring zero production downtime.",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Tax-Deferred FTWZ Storage",
      category: "FTWZ Solutions",
      challenge: "High up-front customs duty cash flows for global machinery importer.",
      solution: "Duty-deferred warehousing inside FTWZ Chennai, quality checking, and gradual domestic distribution.",
      result: "Duties deferred, optimized working capital, and simplified compliance-based regional dispatches.",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const statsData = [
    {
      value: "40+",
      label1: "Years Industry",
      label2: "Experience",
      icon: <Award className="w-5 h-5 md:w-6 h-6 text-brand-green-dark" />
    },
    {
      value: "2,00,000+",
      label1: "Customs Entries",
      label2: "Annually",
      icon: <FileText className="w-5 h-5 md:w-6 h-6 text-brand-green-dark" />
    },
    {
      value: "15+",
      label1: "Strategic",
      label2: "Locations",
      icon: <MapPin className="w-5 h-5 md:w-6 h-6 text-brand-green-dark" />
    },
    {
      value: "6,000+",
      label1: "Customers",
      label2: "Served",
      icon: <Users className="w-5 h-5 md:w-6 h-6 text-brand-green-dark" />
    }
  ];

  const aboutFeatures = [
    {
      title: "Bridging Logistics & Project Engineering",
      desc: "From single LCL cartons to ultra-heavy industrial plants across major trade lanes.",
      icon: <Cpu className="w-5 h-5 text-brand-yellow" />
    },
    {
      title: "Four Decades of Proven Experience",
      desc: "Planning, executing, and managing freight movements since 1985.",
      icon: <Award className="w-5 h-5 text-brand-yellow" />
    },
    {
      title: "Regulatory Command & Coordination",
      desc: "Delivering reliable cargo movement for conventional and specialized requirements.",
      icon: <ShieldCheck className="w-5 h-5 text-brand-yellow" />
    }
  ];

  return (
    <div className="bg-white">
      <SEO 
        title="Global Supply Chains. Engineered to Scale." 
        description="KPS Worldwide Logistics Pvt. Ltd. is your premier partner for containerized freight, global break bulk, RoRo operations, and complex over dimensional cargo in Chennai, India." 
        keywords={[
          "KPS Worldwide Logistics",
          "KPS Worldwide Logistics Pvt Ltd",
          "logistics company in Chennai",
          "freight forwarding company India",
          "containerized cargo shipping services",
          "project cargo logistics services",
          "over dimensional cargo transportation",
          "licensed customs brokerage services",
          "industrial warehousing Chennai",
          "customs broker Chennai",
          "ODC transport Chennai"
        ]}
      />
      
      {/* Hero Video Section */}
      <section className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[640px] md:min-h-[700px] lg:h-[92vh] w-full overflow-hidden bg-brand-green-dark text-white flex items-center">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover object-center"
          >
            <source src="https://res.cloudinary.com/vm9q4qwp/video/upload/v1788797756/desktop_hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Deep Emerald & Vignette Overlays for Crisp Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#072419]/95 via-[#072419]/80 to-[#072419]/50"></div>
          <div className="absolute inset-0 bg-black/25"></div>
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-28 bg-gradient-to-t from-[#072419] to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full py-4 xs:py-6 sm:pt-20 sm:pb-24 md:py-0">
          <div className="container mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl lg:max-w-4xl">
              
              {/* Eyebrow Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-brand-yellow/15 border border-brand-yellow/35 backdrop-blur-md px-2 py-0.5 xs:px-2.5 xs:py-1 sm:px-4 sm:py-1.5 rounded-full mb-1.5 xs:mb-2 sm:mb-5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-yellow animate-pulse"></span>
                <span className="text-brand-yellow font-extrabold uppercase tracking-wider sm:tracking-widest text-[8.5px] xs:text-[9px] sm:text-xs">
                  Technology-Driven Logistics Since 1985
                </span>
              </motion.div>

              {/* Heading Indicators */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 xs:mb-2 sm:mb-4">
                {heroHeadings.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroHeading(idx)}
                    className={`h-1 xs:h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeHeroHeading ? 'w-5 xs:w-7 bg-brand-yellow' : 'w-1.5 xs:w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide to heading ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Main Heading with AnimatePresence */}
              <div className="min-h-[46px] xs:min-h-[54px] sm:min-h-[110px] md:min-h-[135px] lg:min-h-[150px] flex items-center mb-1 xs:mb-2 sm:mb-4">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={activeHeroHeading}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="text-[19px] xs:text-[21px] sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-[1.12] tracking-tight text-white drop-shadow-md"
                  >
                    {heroHeadings[activeHeroHeading].title}{' '}
                    <span className="text-brand-yellow block sm:inline">
                      {heroHeadings[activeHeroHeading].highlight}
                    </span>
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* Subtitle / Description */}
              <div className="min-h-[26px] xs:min-h-[32px] sm:min-h-[46px] md:min-h-[54px] mb-2.5 xs:mb-3.5 sm:mb-8">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeHeroHeading}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="text-[10px] xs:text-[11px] sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl leading-relaxed font-light drop-shadow-sm line-clamp-2 xs:line-clamp-none"
                  >
                    {heroHeadings[activeHeroHeading].desc}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 }}
                className="flex flex-row items-center gap-1.5 xs:gap-2 sm:gap-4"
              >
                <Link
                  to="/lead-form"
                  className="inline-flex items-center justify-center space-x-1 xs:space-x-1.5 sm:space-x-2.5 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-2.5 py-1.5 xs:px-3.5 xs:py-2 sm:px-8 sm:py-4 text-[10px] xs:text-[11px] sm:text-sm rounded-md xs:rounded-lg sm:rounded-xl shadow-md sm:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow text-center"
                >
                  <span>Request a Custom Quote</span>
                  <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                </Link>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center space-x-1 xs:space-x-1.5 sm:space-x-2 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-bold px-2.5 py-1.5 xs:px-3.5 xs:py-2 sm:px-8 sm:py-4 text-[10px] xs:text-[11px] sm:text-sm rounded-md xs:rounded-lg sm:rounded-xl shadow-sm sm:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white text-center"
                >
                  <span>Explore Capabilities</span>
                </Link>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — TRUST STATISTICS BAR */}
      <section className="relative z-30 -mt-12 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-brand-gray-muted p-2.5 md:p-8 shadow-xl">
          
          {/* Desktop Layout: Static Grid */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-6 items-center">
            {statsData.map((stat, idx) => (
              <div 
                key={idx}
                className={`flex items-center space-x-4
                  ${idx !== 3 ? 'border-r border-brand-gray-muted pr-4' : ''}
                `}
              >
                <div className="p-3 bg-[#e6f4ea] text-brand-green-dark rounded-2xl flex-shrink-0 flex items-center justify-center shadow-inner">
                  {stat.icon}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="block text-2xl font-extrabold text-brand-green-dark tracking-tight leading-none">
                    <Counter value={stat.value} />
                  </span>
                  <span className="block text-[10px] tracking-wider uppercase text-brand-gray-dark font-bold leading-tight whitespace-normal">
                    {stat.label1}<br />{stat.label2}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Layout: Infinite Scrolling Ticker (Single Line Loop) */}
          <div className="md:hidden overflow-hidden relative w-full py-0.5">
            <div className="animate-marquee flex gap-3 pr-3">
              {[...statsData, ...statsData].map((stat, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-2.5 bg-[#f8f9fa] border border-[#e9ecef] px-3 py-1.5 rounded-xl flex-shrink-0"
                >
                  <div className="p-1.5 bg-[#e6f4ea] text-brand-green-dark rounded-lg flex-shrink-0 flex items-center justify-center shadow-inner">
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      {React.cloneElement(stat.icon, { className: "w-3.5 h-3.5 text-brand-green-dark" })}
                    </div>
                  </div>
                  <div className="space-y-0 min-w-0">
                    <span className="block text-xs font-extrabold text-brand-green-dark tracking-tight leading-none">
                      {stat.value}
                    </span>
                    <span className="block text-[7px] tracking-wider uppercase text-brand-gray-dark font-bold leading-tight">
                      {stat.label1} {stat.label2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 — ABOUT KPS WORLDWIDE LOGISTICS */}
      <section className="py-20 bg-white text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16 items-center">
            
            {/* Title / Header block (order-1 on mobile, left side on desktop) */}
            <div className="lg:col-span-7 order-1 space-y-4">
              <div>
                <span className="text-brand-green font-bold text-xs uppercase tracking-widest block">
                  ABOUT KPS WORLDWIDE LOGISTICS
                </span>
                <div className="w-10 h-[2px] bg-brand-yellow mt-1 mb-4"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-green-dark leading-tight">
                Moving Your Commerce. <span className="text-brand-yellow-dark">Shaping Global Trade.</span>
              </h2>
            </div>

            {/* Image Card (order-2 on mobile, right side on desktop taking full height) */}
            <div className="lg:col-span-5 order-2 lg:order-3 lg:row-span-2 relative mt-6 lg:mt-0">
              {/* Gold outline frame behind image */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-brand-yellow rounded-2xl -z-10"></div>
              
              {/* Warehouse Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl relative z-10 aspect-[4/3] bg-brand-green-dark">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                  alt="KPS warehousing operations racks"
                  className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Description & Features Block (order-3 on mobile, fits underneath Title on desktop) */}
            <div className="lg:col-span-7 order-3 lg:order-2 space-y-6 mt-8 lg:mt-0">
              <p className="text-base text-brand-green-dark font-medium leading-relaxed">
                At KPS Worldwide Logistics Pvt Ltd., we bridge the gap between standard logistics and complex project engineering.
              </p>
              <p className="text-sm text-brand-gray leading-relaxed font-light">
                For four decades, our experienced professionals have planned, executed, and managed freight movements across major international trade lanes, from single LCL cartons to ultra heavy industrial plants. We combine logistics expertise, technical planning, regulatory knowledge, and global coordination to deliver reliable cargo movement for both conventional and specialized requirements.
              </p>
              
              <div className="space-y-4 mb-8">
                {aboutFeatures.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="bg-brand-gray-light/60 border border-brand-gray-muted rounded-xl p-4 flex items-center space-x-4 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-green-dark text-brand-yellow flex items-center justify-center flex-shrink-0 shadow-md">
                      {feat.icon}
                    </div>
                    <div className="w-[2px] h-8 bg-brand-yellow flex-shrink-0"></div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-brand-green-dark">{feat.title}</h4>
                      <p className="text-xs text-brand-gray leading-relaxed font-light">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/about-us"
                  className="inline-flex items-center justify-center bg-brand-green-dark hover:bg-brand-green text-white font-semibold px-6 py-3.5 rounded-md shadow-md hover:shadow-lg transition-all duration-300 group text-sm"
                >
                  <span>Discover KPS Worldwide</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-brand-yellow transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR CORE CAPABILITIES (Corporate Tier-1 Design) */}
      <section className="py-14 sm:py-20 md:py-24 bg-[#fafcfb] text-brand-gray-dark border-t border-brand-gray-muted relative">
        <div className="container mx-auto px-4 sm:px-6">
          
          {/* Corporate Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2.5">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-5 sm:w-8 h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow-dark font-extrabold text-xs sm:text-sm uppercase tracking-widest">
                OUR CORE CAPABILITIES
              </span>
              <span className="w-5 sm:w-8 h-[2px] bg-brand-yellow"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black tracking-tight text-brand-green-dark leading-tight">
              Precision Logistics & Global Freight Solutions
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-brand-gray leading-relaxed font-light max-w-2xl mx-auto">
              From high-volume containerized freight to complex project logistics and customs brokerage, KPS Worldwide delivers end-to-end engineered capabilities.
            </p>
          </div>

          {/* 6-Card Corporate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {servicesList.map((service, idx) => (
              <div 
                key={idx}
                className="bg-white border border-[#e5e9e7] hover:border-brand-green/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                {/* Top Image Banner with Corporate Overlay */}
                <div className="h-44 sm:h-48 relative overflow-hidden bg-brand-green-dark">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#072419]/90 via-[#072419]/30 to-transparent"></div>
                  
                  {/* Top Right Numeric Indicator */}
                  <div className="absolute top-3.5 right-3.5 bg-black/40 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                    {service.id}
                  </div>

                  {/* Floating Icon Badge & Sub-tag */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-green text-brand-yellow border-2 border-white/80 shadow-md flex items-center justify-center group-hover:bg-brand-yellow group-hover:text-brand-green-dark transition-colors duration-300 flex-shrink-0">
                      {service.icon}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-brand-yellow-light bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10 truncate">
                      {service.tag}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light">
                      {service.desc}
                    </p>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <Link
                      to={service.path}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light transition-colors group/link"
                    >
                      <span>Explore Capability</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-green transition-colors">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Corporate Callout Action */}
          <div className="mt-12 sm:mt-14 text-center">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 bg-brand-green hover:bg-brand-green-light text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm transform hover:-translate-y-0.5"
            >
              <span>View All Logistics Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>



      {/* SECTION 4 — COMPLETE SUPPLY CHAIN ARCHITECTURE (Corporate & Responsive) */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#fafcfb] text-brand-gray-dark border-t border-brand-gray-muted relative overflow-hidden">
        {/* Subtle Map Watermark Background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1400&q=80')` }}
        ></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Corporate Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2.5">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-5 sm:w-8 h-[2px] bg-[#f97316]"></span>
              <span className="text-[#f97316] font-extrabold text-xs sm:text-sm uppercase tracking-widest">
                COMPLETE SUPPLY CHAIN
              </span>
              <span className="w-5 sm:w-8 h-[2px] bg-[#f97316]"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#072419] leading-tight">
              One Partner. Complete Supply Chain <span className="text-brand-green">Solutions.</span>
            </h2>

            <p className="text-xs sm:text-sm text-brand-gray max-w-2xl mx-auto leading-relaxed font-light">
              From origin cargo pickup to final-mile site delivery, KPS Worldwide Logistics coordinates every critical milestone with precision logistics engineering.
            </p>
          </div>

          {/* Desktop Connected 7-Stage Pipeline (lg: 1024px+) */}
          <div className="hidden lg:block relative">
            
            {/* Connected Horizontal Pipeline Track */}
            <div className="absolute top-[28px] left-[7%] right-[7%] h-[2px] bg-gradient-to-r from-brand-green via-brand-yellow to-brand-green -z-0 opacity-40"></div>

            <div className="grid grid-cols-7 gap-3 xl:gap-4 relative z-10">
              {journeySteps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-[#e5e9e7] hover:border-brand-green/60 rounded-2xl p-3.5 xl:p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 group hover:-translate-y-1 relative"
                >
                  <div className="space-y-2.5">
                    {/* Top Node & Number */}
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-[#072419] text-brand-yellow group-hover:bg-[#f97316] group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-xs flex-shrink-0">
                        {step.icon}
                      </div>
                      <span className="text-[10px] font-mono font-black text-gray-400 group-hover:text-[#f97316] transition-colors">
                        STAGE {step.id}
                      </span>
                    </div>

                    {/* Stage Title */}
                    <div>
                      <h4 className="text-xs xl:text-sm font-extrabold text-[#072419] tracking-tight leading-snug">
                        {step.title}
                      </h4>
                      <div className="w-4 h-[2px] bg-brand-yellow mt-1 mb-1.5 group-hover:w-8 transition-all"></div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-brand-gray leading-relaxed font-light line-clamp-3">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bottom Accent Indicator */}
                  <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                    <span>Step {step.id}/07</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 group-hover:bg-[#f97316] transition-colors"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Connected Vertical Timeline (< 1024px) */}
          <div className="lg:hidden max-w-xl mx-auto relative pl-8 sm:pl-10 space-y-3 sm:space-y-4 before:content-[''] before:absolute before:left-3.5 sm:before:left-4.5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-brand-green before:via-brand-yellow before:to-brand-green">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="relative flex items-center group">
                
                {/* Node on Timeline */}
                <div className="absolute -left-8 sm:-left-10 w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#072419] text-brand-yellow flex items-center justify-center shadow-xs border-2 border-white z-10 flex-shrink-0 group-hover:bg-[#f97316] group-hover:text-white transition-colors">
                  <div className="scale-75 sm:scale-90 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                
                {/* Card Container */}
                <div className="bg-white border border-[#e5e9e7] hover:border-brand-green/50 shadow-2xs hover:shadow-xs p-3.5 sm:p-4 rounded-2xl w-full transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-extrabold text-[#f97316] uppercase tracking-wider">
                      STAGE {step.id} OF 07
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green"></span>
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#072419] tracking-tight">
                    {step.fullTitle || step.title}
                  </h4>
                  
                  <p className="text-[11px] sm:text-xs text-brand-gray leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* Corporate Supply Chain Callout Bar */}
          <div className="mt-10 sm:mt-14 bg-gradient-to-br from-[#072419] to-brand-green-dark text-white rounded-2xl p-4 sm:p-6 shadow-md border border-brand-green/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest block">
                INTEGRATED MULTIMODAL OPERATIONS
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                Looking for an End-to-End Single-Point Logistics Partner?
              </h4>
              <p className="text-xs text-gray-300 font-light">
                From route planning to customs clearance and heavy haulage, our directors manage the entire journey.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 flex-shrink-0">
              <Link
                to="/lead-form"
                className="inline-flex items-center space-x-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xs transition-all text-xs sm:text-sm"
              >
                <span>Plan Your Cargo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="tel:04445088099"
                className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm backdrop-blur-sm"
              >
                <span>044 - 45088099</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 — THE KPS ADVANTAGE (Corporate Strategic Points Matrix) */}
      <section className="py-14 sm:py-20 md:py-24 bg-white text-brand-gray-dark relative overflow-hidden border-t border-brand-gray-muted">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Executive Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2.5">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-5 sm:w-8 h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow-dark font-extrabold text-xs sm:text-sm uppercase tracking-widest">
                THE KPS ADVANTAGE
              </span>
              <span className="w-5 sm:w-8 h-[2px] bg-brand-yellow"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black tracking-tight text-brand-green-dark leading-tight">
              Why Global Enterprises Choose <span className="text-brand-green">KPS Worldwide</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-brand-gray leading-relaxed font-light max-w-2xl mx-auto">
              Strategic logistics advantages engineered to eliminate customs delays, ensure complete regulatory compliance, and optimize your global supply chain costs.
            </p>
          </div>

          {/* 6 Strategic Pillars Grid with Compact Mobile 2-Column Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
            {kpsAdvantagePoints.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#fafcfb] border border-[#e5e9e7] hover:border-brand-green/60 rounded-xl sm:rounded-2xl p-3 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                <div className="space-y-2.5 sm:space-y-4">
                  {/* Top Row: Icon Badge & Category Pill */}
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-brand-green text-brand-yellow flex items-center justify-center group-hover:bg-brand-yellow group-hover:text-brand-green-dark transition-colors duration-300 shadow-xs flex-shrink-0">
                      {React.cloneElement(item.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                    </div>
                    <span className="bg-white text-brand-green-dark font-mono font-bold text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-lg border border-brand-green/15 shadow-2xs">
                      {item.id}
                    </span>
                  </div>

                  {/* Header & Sub-highlight */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-brand-yellow-dark block truncate">
                      {item.tag}
                    </span>
                    <h3 className="text-xs sm:text-lg font-extrabold text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors line-clamp-2 sm:line-clamp-none">
                      {item.title}
                    </h3>
                  </div>

                  {/* Main Description */}
                  <p className="text-[10px] sm:text-xs text-brand-gray leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                    {item.desc}
                  </p>

                  {/* Key Strategic Importance Points Checklist */}
                  <div className="pt-2 sm:pt-3 border-t border-gray-200/70 space-y-1.5 sm:space-y-2">
                    <span className="text-[8px] sm:text-[10px] font-bold text-brand-green-dark uppercase tracking-wider block">
                      Importance Points:
                    </span>
                    <ul className="space-y-1 sm:space-y-1.5">
                      {item.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start space-x-1 sm:space-x-2 text-[9px] sm:text-xs text-brand-gray-dark font-medium leading-tight">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1 sm:line-clamp-none">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between text-[8px] sm:text-[11px] font-bold text-brand-green">
                  <span className="truncate">Executive Grade</span>
                  <span className="text-brand-yellow-dark hidden sm:inline">&bull; Verified</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Corporate Link */}
          <div className="mt-12 sm:mt-16 text-center flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/about-us"
              className="inline-flex items-center space-x-2 bg-brand-green-dark hover:bg-brand-green text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
            >
              <span>Explore Corporate Credentials</span>
              <ArrowRight className="w-4 h-4 text-brand-yellow" />
            </Link>
            <Link
              to="/lead-form"
              className="inline-flex items-center space-x-2 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
            >
              <span>Consult Our Logistics Engineers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 6 — INDUSTRIES WE SERVE (Compact Responsive Image-First Corporate Grid) */}
      <section className="py-8 sm:py-16 md:py-20 bg-[#fafcfb] text-brand-gray-dark border-t border-brand-gray-muted">
        <div className="container mx-auto px-3 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <span className="w-3.5 sm:w-6 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
                INDUSTRIES WE SERVE
              </span>
              <span className="w-3.5 sm:w-6 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
            </div>

            <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-brand-green-dark leading-tight">
              Specialized Logistics Solutions for Every Industry
            </h2>

            <p className="text-[11px] sm:text-sm text-brand-gray leading-relaxed font-light max-w-xl mx-auto px-1 sm:px-0">
              Reliable multimodal freight, statutory customs clearance, and dedicated warehousing tailored to critical industry supply chains.
            </p>
          </div>

          {/* Compact Responsive Grid: 2-Column on Mobile, 3-Column on Desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-5">
            {industries.map((ind, idx) => (
              <Link 
                key={ind.id || idx}
                to={ind.path}
                className="group relative h-[185px] xs:h-[205px] sm:h-[240px] md:h-[260px] lg:h-[275px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-slate-200/90 hover:border-brand-yellow/60 transition-all duration-300 flex flex-col justify-between p-2.5 xs:p-3 sm:p-4 md:p-5 bg-brand-green-dark cursor-pointer transform hover:-translate-y-1"
              >
                {/* High-Resolution Industry Background Image */}
                <img
                  src={ind.image}
                  alt={ind.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Cinematic Dark Emerald Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#051a12] via-[#051a12]/60 via-45% to-black/15 group-hover:via-[#051a12]/50 transition-colors duration-300 pointer-events-none"></div>
                
                {/* Top Gold Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-0.5 sm:h-1 bg-brand-yellow scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20"></div>

                {/* Top Row: Sector Badge & Action Icon */}
                <div className="relative z-10 flex items-center justify-between gap-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded bg-black/45 backdrop-blur-xs border border-white/15 text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-brand-yellow uppercase tracking-wider">
                    {ind.tag}
                  </span>
                  
                  <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full bg-black/35 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white/90 group-hover:bg-brand-yellow group-hover:text-brand-green-dark group-hover:border-brand-yellow transition-all duration-300 transform group-hover:rotate-[-45deg] shrink-0">
                    <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 space-y-1 sm:space-y-1.5">
                  <h3 className="text-[11.5px] xs:text-[13px] sm:text-base md:text-lg font-bold sm:font-extrabold text-white tracking-tight leading-tight sm:leading-snug group-hover:text-brand-yellow transition-colors line-clamp-2 drop-shadow-xs">
                    {ind.name}
                  </h3>
                  
                  <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-200/90 leading-tight sm:leading-relaxed font-light line-clamp-2 drop-shadow-2xs">
                    {ind.desc}
                  </p>

                  <div className="pt-0.5 flex items-center space-x-1 text-[8.5px] xs:text-[9.5px] sm:text-xs font-bold text-brand-yellow group-hover:text-white transition-colors">
                    <span>Explore Solutions</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="text-center mt-6 sm:mt-10">
            <Link
              to="/contact-us"
              className="inline-flex items-center space-x-2 bg-brand-green-dark hover:bg-brand-green text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-[11px] sm:text-xs md:text-sm transform hover:-translate-y-0.5"
            >
              <span>Speak with an Industry Specialist</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-yellow" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 8 — OUR NETWORK & OFFICES (Compact Mobile 2-Column Grid & Desktop 4-Column) */}
      <section className="py-10 sm:py-20 bg-[#f6f9f7] text-brand-gray-dark border-t border-brand-gray-muted relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <span className="w-3.5 sm:w-8 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow-dark font-extrabold text-[9px] sm:text-xs md:text-sm uppercase tracking-widest">
                OUR NETWORK & PRESENCE
              </span>
              <span className="w-3.5 sm:w-8 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-brand-green-dark leading-tight">
              Our Offices
            </h2>

            <p className="text-[11px] sm:text-sm text-brand-gray leading-relaxed font-light px-2 sm:px-0">
              Direct port clearance desks, inland cargo hubs, and corporate offices across India's key industrial corridors.
            </p>
          </div>

          {/* Offices Grid (Compact 2-Column on Mobile, 4-Column on Desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {[
              {
                id: "bengaluru",
                city: "Bengaluru",
                name: "Bengaluru Office",
                landmark: <BengaluruLandmark />,
                address: "Kasturi Nagar, Bengaluru, Karnataka",
                pincode: "560 043",
                phone: "044 2526 4647",
                email: "info@kpsgroups.net",
                googleMapsUrl: "https://www.google.com/maps/dir/9.8828288,78.0664832/Kasturi+Nagar,+Bengaluru,+Karnataka/@11.4408819,76.5780445,8z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3bae113195b7923d:0xa457538b53fe1a19!2m2!1d77.6594498!2d13.0060924?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D"
              },
              {
                id: "tuticorin",
                city: "Tuticorin",
                name: "Tuticorin Office",
                landmark: <TuticorinLandmark />,
                address: "No. 5A/401, Caldwell Colony 4th street, Tuticorin, TamilNadu",
                pincode: "628 008",
                phone: "044 2526 4647",
                email: "info@kpsgroups.net",
                googleMapsUrl: "https://www.google.com/maps/dir/9.8828288,78.0664832/%E0%AE%95%E0%AF%87%E0%AE%B2%E0%AF%8D%E0%AE%9F%E0%AF%8D%E0%AE%B5%E0%AF%86%E0%AE%B2%E0%AF%8D+%E0%AE%95%E0%AE%BE%E0%AE%B2%E0%AE%A9%E0%AE%BF+%E0%AE%A4%E0%AF%82%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AF%81%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%81%E0%AE%9F%E0%AE%BF,+Q4PQ%2B2C9,+Caldwell+Colony,+Thoothukudi,+Tamil+Nadu+628001/@9.3236179,77.4168593,9z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3b03ef005871bce1:0xa20f90e4831b439a!2m2!1d78.1386261!2d8.7850881?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D"
              },
              {
                id: "visakhapatnam",
                city: "Visakhapatnam",
                name: "Visakhapatnam Office",
                landmark: <VisakhapatnamLandmark />,
                address: "Botcha Square, Visakhapatnam, Andhra Pradesh",
                pincode: "530 007",
                phone: "044 2526 4647",
                email: "info@kpsgroups.net",
                googleMapsUrl: "https://www.google.com/maps/dir/9.8828288,78.0664832/Botcha+Square,+Murali+Nagar,+NH5+Birla+junction,+Visakhapatnam,+Andhra+Pradesh+530007/@13.7563368,75.2074002,6z/data=!3m2!4b1!5s0x3a395d52ac8cbe89:0x867a6276d899cff!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3a3d6b517a0a672b:0xa4f5a733d0b0b5bf!2m2!1d83.260975!2d17.7433792?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D"
              },
              {
                id: "kochi",
                city: "Kochi",
                name: "Kochi Office",
                landmark: <KochiLandmark />,
                address: "Dotspace Business Center, Cloud 9, 9th Cross Road, Panampilly Nagar, Kochi",
                pincode: "682 036",
                phone: "044 2526 4647",
                email: "info@kpsgroups.net",
                googleMapsUrl: "https://www.google.com/maps/dir/9.8828288,78.0664832/Dotspace+Business+Centre,+Cloud+9,+9th+Cross+Rd,+above+Starbucks,+Avenue+Road,+Panampilly+Nagar,+Kochi,+Ernakulam,+Kerala+682036/@10.3338986,75.8409583,8z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x3b08735a4bf5851f:0xcec183bf2ed998f7!2m2!1d76.2960528!2d9.9610247?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D"
              }
            ].map((office, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl sm:rounded-3xl p-2.5 sm:p-5 lg:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(7,36,25,0.12)] border border-gray-100 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50/40 hover:-translate-y-1"
              >
                <div>
                  {/* Top Eyebrow & Map Pin Badge */}
                  <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                    <div className="flex items-center space-x-1 sm:space-x-1.5">
                      <span className="w-2.5 sm:w-5 h-[1.5px] sm:h-[2px] bg-brand-green"></span>
                      <span className="text-[7.5px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        OUR OFFICE
                      </span>
                    </div>
                    <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-[#e8f5e9] text-brand-green flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-brand-green group-hover:text-white fill-brand-green/20 group-hover:fill-white/20 transition-colors" />
                    </div>
                  </div>

                  {/* Office Name & Landmark Illustration Row */}
                  <div className="flex items-end justify-between gap-1 mb-2 sm:mb-5 pb-1.5 sm:pb-3 border-b border-gray-100 min-h-[38px] sm:min-h-[64px]">
                    <h3 className="text-[11px] sm:text-lg lg:text-xl font-bold sm:font-black text-[#072419] tracking-tight leading-tight">
                      {office.city} <br />
                      <span className="font-extrabold text-[#072419]">Office</span>
                    </h3>
                    <div className="flex-shrink-0 -mb-0.5 sm:-mb-1">
                      {office.landmark}
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-1.5 sm:space-y-3.5">
                    {/* Address */}
                    <div className="flex items-start space-x-1.5 sm:space-x-2.5">
                      <div className="w-4 h-4 sm:w-7 sm:h-7 rounded-full bg-[#eaf4ef] text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-2 sm:w-3.5 h-2 sm:h-3.5 text-brand-green" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[7.5px] sm:text-[11px] text-gray-400 font-medium">Address</div>
                        <div className="text-[8.5px] sm:text-xs font-semibold text-gray-700 leading-tight sm:leading-snug line-clamp-2 sm:line-clamp-none">
                          {office.address}
                        </div>
                      </div>
                    </div>

                    {/* Pincode */}
                    <div className="flex items-start space-x-1.5 sm:space-x-2.5">
                      <div className="w-4 h-4 sm:w-7 sm:h-7 rounded-full bg-[#eaf4ef] text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 className="w-2 sm:w-3.5 h-2 sm:h-3.5 text-brand-green" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[7.5px] sm:text-[11px] text-gray-400 font-medium">Pincode</div>
                        <div className="text-[9.5px] sm:text-sm font-bold text-[#072419]">
                          {office.pincode}
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                      <div className="w-4 h-4 sm:w-7 sm:h-7 rounded-full bg-[#eaf4ef] text-brand-green flex items-center justify-center flex-shrink-0">
                        <Phone className="w-2 sm:w-3.5 h-2 sm:h-3.5 text-brand-green" />
                      </div>
                      <a
                        href={`tel:${office.phone.replace(/\s+/g, '')}`}
                        className="text-[8.5px] sm:text-xs font-semibold text-gray-800 hover:text-brand-green transition-colors truncate"
                      >
                        {office.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                      <div className="w-4 h-4 sm:w-7 sm:h-7 rounded-full bg-[#eaf4ef] text-brand-green flex items-center justify-center flex-shrink-0">
                        <Mail className="w-2 sm:w-3.5 h-2 sm:h-3.5 text-brand-green" />
                      </div>
                      <a
                        href={`mailto:${office.email}`}
                        className="text-[8px] sm:text-xs font-semibold text-gray-800 hover:text-brand-green transition-colors truncate"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Get Directions Button */}
                <a
                  href={office.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2.5 sm:mt-5 bg-[#072419] hover:bg-brand-green text-white font-bold py-1.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-between text-[9px] sm:text-sm shadow-xs hover:shadow-md transition-all duration-300 group/btn"
                >
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Send className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-emerald-400 transform group-hover/btn:translate-x-0.5 transition-transform" />
                    <span>Get Directions</span>
                  </div>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 transform group-hover/btn:translate-x-1 transition-transform text-white/80" />
                </a>

              </div>
            ))}
          </div>

          {/* Corporate Headquarters Banner Callout */}
          <div className="mt-6 sm:mt-10 bg-brand-green-dark text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-brand-green/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 bg-brand-yellow/20 text-brand-yellow px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Corporate Headquarters</span>
              </div>
              <h4 className="text-sm sm:text-lg font-extrabold text-white">
                Chennai (Head Office)
              </h4>
              <p className="text-[11px] sm:text-xs text-gray-300 font-light">
                No. 14, 6th Floor, A.K. Nayak Bhavan, Jahangir Street, Second Line Beach, Parrys, Chennai 600 001, Tamil Nadu, India
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              <a
                href="https://www.google.com/maps/search/?api=1&query=A.K.+Nayak+Bhavan+Second+Line+Beach+Parrys+Chennai+600001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-xs transition-all text-[11px] sm:text-xs"
              >
                <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Get Directions</span>
              </a>
              <Link
                to="/contact-us"
                className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-[11px] sm:text-xs"
              >
                <span>All Locations</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

        {/* Office Details Modal */}
        <AnimatePresence>
          {selectedOffice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-brand-gray-muted space-y-4 text-brand-gray-dark"
              >
                <button
                  type="button"
                  onClick={() => setSelectedOffice(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-green text-brand-yellow">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-brand-green-dark">
                      {selectedOffice.name || `${selectedOffice.city} Office`}
                    </h3>
                    <span className="text-xs text-brand-yellow-dark font-semibold">
                      {selectedOffice.role || "Regional Logistics Desk"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-brand-gray-dark border-t border-b border-gray-100 py-3">
                  <div>
                    <span className="block font-bold text-gray-500 uppercase text-[10px]">Address</span>
                    <p className="font-medium mt-0.5">{selectedOffice.address}</p>
                    <span className="inline-block mt-1 font-bold text-brand-green">Pincode: {selectedOffice.pincode}</span>
                  </div>
                  
                  <div>
                    <span className="block font-bold text-gray-500 uppercase text-[10px]">Direct Phone & Email</span>
                    <p className="font-bold text-brand-green-dark mt-0.5">Phone: {selectedOffice.phone || "044 2526 4647"}</p>
                    <p className="font-medium text-gray-600">Email: {selectedOffice.email || "info@kpsgroups.net"}</p>
                  </div>

                  <div>
                    <span className="block font-bold text-gray-500 uppercase text-[10px]">Operational Hours</span>
                    <p className="font-medium mt-0.5">{selectedOffice.hours || "09:00 AM - 06:00 PM (Mon-Sat)"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={selectedOffice.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-brand-green hover:bg-brand-green-light text-white font-bold py-2.5 rounded-xl transition-all text-xs"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Get Directions</span>
                  </a>
                  <Link
                    to="/contact-us"
                    onClick={() => setSelectedOffice(null)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold py-2.5 rounded-xl transition-all text-xs"
                  >
                    <span>Contact This Desk</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Award Details / Certificate Modal */}
        <AnimatePresence>
          {selectedAward && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative border border-brand-gray-muted space-y-4 max-h-[92vh] overflow-y-auto"
              >
                <button
                  type="button"
                  onClick={() => setSelectedAward(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors z-10 shadow-xs"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start pt-2">
                  {/* High-res Image Preview */}
                  <div className="w-full sm:w-1/2 bg-gradient-to-b from-[#f8faf9] to-[#eef2f0] border border-[#e2e8e5] rounded-xl p-3 sm:p-4 flex items-center justify-center shadow-inner">
                    <img
                      src={selectedAward.image}
                      alt={selectedAward.title}
                      className="max-h-[300px] sm:max-h-[380px] w-auto object-contain drop-shadow-xl"
                    />
                  </div>

                  {/* Award Info */}
                  <div className="w-full sm:w-1/2 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 bg-[#072419] text-brand-yellow font-bold text-xs px-2.5 py-1 rounded-md border border-brand-yellow/30">
                        <Calendar className="w-3 h-3 text-brand-yellow" />
                        <span>{selectedAward.year}</span>
                      </span>
                      <span className="text-xs font-semibold text-gray-500">{selectedAward.date}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-[#072419] leading-snug">
                      {selectedAward.title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {selectedAward.description}
                    </p>

                    <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-brand-green-dark font-bold">
                        <Award className="w-4 h-4 text-brand-yellow-dark flex-shrink-0" />
                        <span>Awarded by: {selectedAward.organization}</span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <Link
                        to="/awards"
                        onClick={() => setSelectedAward(null)}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-green hover:text-brand-green-dark transition-colors"
                      >
                        <span>View All Company Awards</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      {/* SECTION 9 — AWARDS & RECOGNITIONS (3 Awards Only: Desktop 3-Col & Mobile Auto-Sliding Carousel) */}
      <section className="py-10 sm:py-20 bg-white text-brand-gray-dark border-t border-brand-gray-muted relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-14 space-y-1.5 sm:space-y-2.5">
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <span className="w-3.5 sm:w-8 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow-dark font-extrabold text-[9px] sm:text-xs md:text-sm uppercase tracking-widest">
                AWARDS & RECOGNITIONS
              </span>
              <span className="w-3.5 sm:w-8 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-brand-green-dark leading-tight">
              Honored for Logistics Excellence & Leadership
            </h2>

            <p className="text-[11px] sm:text-sm md:text-base text-brand-gray leading-relaxed font-light max-w-2xl mx-auto px-2 sm:px-0">
              Recognized by prominent shipping conclaves, maritime bodies, and multinational supply chain partners for four decades of service excellence.
            </p>
          </div>

          {/* 1. Mobile-Only Compact Auto-Sliding Carousel (< 768px) */}
          <div 
            className="md:hidden relative max-w-[270px] xs:max-w-[290px] mx-auto"
            onMouseEnter={() => setIsAwardPaused(true)}
            onMouseLeave={() => setIsAwardPaused(false)}
            onTouchStart={() => setIsAwardPaused(true)}
            onTouchEnd={() => setIsAwardPaused(false)}
          >
            <AnimatePresence mode="wait">
              {awardsData.slice(0, 3).map((award, idx) => (
                idx === activeAwardSlide && (
                  <motion.div
                    key={award.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onClick={() => setSelectedAward(award)}
                    className="bg-[#fafcfb] border border-[#e2e8e5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between group relative cursor-pointer"
                  >
                    {/* Top Plaque Image Container (Square Shape) */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#f4f7f5] to-[#eaefec] flex items-center justify-center p-3.5 border-b border-[#e5ece8]">
                      <img
                        src={award.image}
                        alt={award.title}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain filter drop-shadow-md"
                      />

                      {/* Floating Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center space-x-1">
                          <span className="inline-flex items-center space-x-0.5 bg-[#072419]/90 backdrop-blur-md text-brand-yellow font-mono font-bold text-[8px] px-1.5 py-0.5 rounded border border-brand-yellow/30 shadow-2xs">
                            <Calendar className="w-2.5 h-2.5 text-brand-yellow" />
                            <span>{award.year}</span>
                          </span>
                          <span className="inline-flex items-center bg-white/95 backdrop-blur-md text-brand-green-dark font-extrabold text-[8px] px-1.5 py-0.5 rounded border border-emerald-200 shadow-2xs">
                            #{String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="w-6 h-6 rounded-md bg-white/95 backdrop-blur-md text-brand-green border border-emerald-200 flex items-center justify-center shadow-2xs">
                          <Trophy className="w-3 h-3 text-amber-500" />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-2.5 flex flex-col justify-between space-y-1.5 bg-white">
                      <div className="space-y-0.5">
                        <div className="text-[7.5px] font-bold text-brand-yellow-dark uppercase tracking-wider">
                          Accolade #{String(idx + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-[11px] font-extrabold text-brand-green-dark leading-snug line-clamp-1">
                          {award.title}
                        </h3>
                        <p className="text-[8.5px] text-brand-gray leading-tight font-light line-clamp-2">
                          {award.description}
                        </p>
                      </div>

                      {/* Footer Row with Meta and Slider Arrows */}
                      <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-[8px] font-bold text-brand-green-dark truncate max-w-[150px]">
                          <Award className="w-2.5 h-2.5 text-brand-yellow-dark flex-shrink-0" />
                          <span className="truncate">{award.organization}</span>
                        </div>

                        {/* Mini Prev / Next buttons */}
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAwardSlide((prev) => (prev - 1 + 3) % 3);
                            }}
                            className="w-5 h-5 rounded-full bg-gray-100 hover:bg-brand-green hover:text-white flex items-center justify-center transition-colors text-gray-700 shadow-2xs"
                            aria-label="Previous Award"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAwardSlide((prev) => (prev + 1) % 3);
                            }}
                            className="w-5 h-5 rounded-full bg-gray-100 hover:bg-brand-green hover:text-white flex items-center justify-center transition-colors text-gray-700 shadow-2xs"
                            aria-label="Next Award"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>

            {/* Mobile Pagination Dot Bars */}
            <div className="flex items-center justify-center space-x-1 pt-2">
              {[0, 1, 2].map((dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveAwardSlide(dotIdx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeAwardSlide === dotIdx ? 'w-4 bg-brand-green' : 'w-1.5 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 2. Desktop 3-Column Static Grid (>= 768px, 3 Awards Only) */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {awardsData.slice(0, 3).map((award, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedAward(award)}
                className="bg-[#fafcfb] border border-[#e2e8e5] hover:border-brand-green/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative cursor-pointer"
              >
                {/* Top Award Image Display Area */}
                <div className="relative h-64 md:h-72 w-full overflow-hidden bg-gradient-to-b from-[#f4f7f5] to-[#eaefec] flex items-center justify-center p-4 sm:p-5 flex-shrink-0 border-b border-[#e5ece8]">
                  <img
                    src={award.image}
                    alt={award.title}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl group-hover:scale-105 transition-all duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center space-x-1.5">
                      <span className="inline-flex items-center space-x-1 bg-[#072419]/90 backdrop-blur-md text-brand-yellow font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-brand-yellow/30 shadow-xs">
                        <Calendar className="w-3 h-3 text-brand-yellow" />
                        <span>{award.year}</span>
                      </span>
                      <span className="inline-flex items-center bg-white/90 backdrop-blur-md text-brand-green-dark font-extrabold text-[10px] px-2 py-1 rounded-lg border border-emerald-200 shadow-xs">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-md text-brand-green border border-emerald-200 flex items-center justify-center shadow-xs">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                  </div>

                  {/* Hover Quick View Overlay Pill */}
                  <div className="absolute inset-0 bg-[#072419]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-[#072419]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center space-x-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-brand-yellow" />
                      <span>View Certificate</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col justify-between flex-grow space-y-3 bg-white">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-brand-green-dark group-hover:text-brand-green transition-colors leading-snug line-clamp-2">
                      {award.title}
                    </h3>

                    <p className="text-xs text-brand-gray leading-relaxed font-light line-clamp-3">
                      {award.description}
                    </p>
                  </div>

                  {/* Bottom Meta Row */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1 font-semibold text-brand-green-dark truncate">
                      <Award className="w-3.5 h-3.5 text-brand-yellow-dark flex-shrink-0" />
                      <span className="truncate">{award.organization}</span>
                    </div>
                    <span className="text-gray-400 font-medium flex-shrink-0 text-[10.5px]">
                      {award.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Link */}
          <div className="text-center mt-6 sm:mt-12">
            <Link
              to="/corporate/awards"
              className="inline-flex items-center space-x-2 bg-brand-green-dark hover:bg-brand-green text-white font-bold px-4 sm:px-7 py-2 sm:py-3.5 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-[11px] sm:text-sm transform hover:-translate-y-0.5"
            >
              <span>View Full Awards & Recognition Timeline</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-yellow" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 12 — INSIGHTS & KNOWLEDGE HUB */}
      <section className="py-12 sm:py-16 md:py-20 bg-white text-brand-gray-dark border-t border-brand-gray-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <span className="text-brand-green font-bold text-xs uppercase tracking-widest mb-1.5 block">
              INSIGHTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-green-dark leading-tight">
              Logistics Insights & Industry Knowledge
            </h2>
            <p className="text-xs sm:text-sm text-brand-gray mt-2 leading-relaxed">
              Practical insights, industry updates, and expert perspectives on logistics, customs, trade, and supply chain management.
            </p>
            <div className="w-12 h-[3px] bg-brand-yellow mx-auto mt-3 sm:mt-4 rounded-full"></div>
          </div>

          {/* 1. Mobile-Only Compact Auto-Sliding View (< 768px) */}
          <div 
            className="md:hidden space-y-3.5 max-w-md mx-auto"
            onTouchStart={() => setIsInsightPaused(true)}
            onTouchEnd={() => setIsInsightPaused(false)}
            onMouseEnter={() => setIsInsightPaused(true)}
            onMouseLeave={() => setIsInsightPaused(false)}
          >
            {[
              {
                title: "What is Customs Brokerage?",
                category: "Customs Compliance",
                date: "Aug 25, 2026",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
                desc: "An in-depth explanation of custom clearance roles, CHA license exams, import declarations, and compliance structures."
              },
              {
                title: "Understanding FTWZ and Its Business Benefits",
                category: "Trade Optimization",
                date: "Aug 12, 2026",
                image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80",
                desc: "How Free Trade Warehousing Zones defer custom duty payments, reduce warehousing compliance costs, and optimize cash flow."
              },
              {
                title: "Air Freight vs Sea Freight: Choosing the Right Option",
                category: "Supply Chain",
                date: "Jul 28, 2026",
                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
                desc: "A comparative evaluation of speed, cost structures, carbon footprint, and weight constraints for sea and air freight routing."
              }
            ].map((post, idx) => (
              activeInsight === idx && (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl shadow-md border border-brand-gray-muted overflow-hidden flex flex-col justify-between transition-all duration-300 animate-fadeIn"
                >
                  {/* Compact Header Image */}
                  <div className="h-36 relative overflow-hidden bg-brand-green-dark">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-brand-green text-white text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded shadow-xs">
                      {post.category}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium py-0.5 px-2 rounded">
                      {post.date}
                    </div>
                  </div>

                  {/* Compact Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-2.5">
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-brand-green-dark leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[11px] text-brand-gray leading-relaxed font-light line-clamp-2">
                        {post.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        to="/blogs"
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      {/* Mini Prev / Next buttons */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setActiveInsight((prev) => (prev - 1 + 3) % 3)}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-brand-green hover:text-white flex items-center justify-center transition-colors text-gray-700 shadow-2xs"
                          aria-label="Previous Insight"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveInsight((prev) => (prev + 1) % 3)}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-brand-green hover:text-white flex items-center justify-center transition-colors text-gray-700 shadow-2xs"
                          aria-label="Next Insight"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* Mobile Pagination Dot Bars */}
            <div className="flex items-center justify-center space-x-1.5 pt-1">
              {[0, 1, 2].map((dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveInsight(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeInsight === dotIdx ? 'w-6 bg-brand-green' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 2. Desktop 3-Column Card Grid (>= 768px) */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "What is Customs Brokerage?",
                category: "Customs Compliance",
                date: "Aug 25, 2026",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
                desc: "An in-depth explanation of custom clearance roles, CHA license exams, import declarations, and compliance structures."
              },
              {
                title: "Understanding FTWZ and Its Business Benefits",
                category: "Trade Optimization",
                date: "Aug 12, 2026",
                image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80",
                desc: "How Free Trade Warehousing Zones defer custom duty payments, reduce warehousing compliance costs, and optimize cash flow."
              },
              {
                title: "Air Freight vs Sea Freight: Choosing the Right Option",
                category: "Supply Chain",
                date: "Jul 28, 2026",
                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
                desc: "A comparative evaluation of speed, cost structures, carbon footprint, and weight constraints for sea and air freight routing."
              }
            ].map((post, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl shadow-md border border-brand-gray-muted overflow-hidden flex flex-col justify-between h-full hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="h-48 relative overflow-hidden bg-brand-green-dark">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-4 left-4 bg-brand-green text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded">
                    {post.category}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] text-brand-gray block">
                      {post.date}
                    </span>
                    <h3 className="text-base font-bold text-brand-green-dark leading-snug group-hover:text-brand-green transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-brand-gray leading-relaxed font-light">
                      {post.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-gray-muted flex justify-end">
                    <Link
                      to="/blogs"
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-green hover:text-brand-green-light"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/blogs"
              className="inline-flex items-center justify-center bg-brand-green hover:bg-brand-green-light text-white font-semibold px-6 py-3 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              View All Insights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
