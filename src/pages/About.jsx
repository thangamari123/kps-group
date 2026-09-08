import { useState } from 'react';
import { Play, X, Compass, Eye, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { companyDetails } from '../data/company';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';
import founderImg from '../assets/Mr. Srinivasa Pragasam.webp';
import mdImg from '../assets/Mr. B.S. Prassanna.webp';

export default function About() {
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  const videos = [
    {
      id: "vid1",
      tag: "Logistics & Fleet",
      title: "Logistics Fleet & Port Operations",
      subtitle: "Multimodal transport, container movement & vessel stevedoring",
      thumbnail: "https://res.cloudinary.com/vm9q4qwp/video/upload/v1788875259/about-video-1.jpg",
      videoUrl: "https://res.cloudinary.com/vm9q4qwp/video/upload/v1788875259/about-video-1.mp4"
    },
    {
      id: "vid2",
      tag: "Warehouse & FTWZ",
      title: "FTWZ & Cargo Handling Operations",
      subtitle: "High-throughput storage, inventory sorting & bonded handling",
      thumbnail: "https://res.cloudinary.com/vm9q4qwp/video/upload/v1788875264/about-video-2.jpg",
      videoUrl: "https://res.cloudinary.com/vm9q4qwp/video/upload/v1788875264/about-video-2.mp4"
    }
  ];

  return (
    <div className="bg-white">
      <SEO 
        title="About KPS & Co. | 40+ Years of Supply Chain & Logistics Excellence" 
        description="Learn about K.P.S & Co., founded in 1985 by Mr. Srinivasa Pragasam (Seenu) and led by Mr. B.S. Prassanna. Over 40+ years of technology-driven supply chain solutions, customs clearance, freight forwarding, and FTWZ warehousing in India." 
        keywords={[
          "About KPS",
          "KPS Logistics",
          "K.P.S & Co.",
          "Srinivasa Pragasam Seenu",
          "BS Prassanna",
          "logistics company in Chennai",
          "freight forwarding company India",
          "customs brokerage India",
          "FTWZ warehousing Chennai"
        ]}
      />
      {/* Page Hero */}
      <PageHero 
        title="About Us" 
        description="Over 40+ years of trust, technology-driven operations, and dedicated logistics solutions in India." 
        bgImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
      />

      {/* 1. About Company Intro Section */}
      <section className="py-12 sm:py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Column 1: Core Copy */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 sm:w-8 h-[2px] bg-brand-yellow"></div>
                <span className="text-brand-yellow-dark font-extrabold text-[11px] sm:text-xs uppercase tracking-widest block">
                  K.P.S
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-green-dark tracking-tight leading-tight">
                Technology-Driven Logistics Solutions in India
              </h2>
              <p className="text-sm sm:text-base text-brand-green-dark font-medium leading-relaxed">
                KPS is a technology-driven logistics service provider in India that enables businesses to make their supply chain more efficient through integrated services such as Custom Clearance, Freight Forwarding, Transportation, FTWZ & Warehousing, Project Handling, and End-To-End Logistics. We use cutting-edge technology to make the logistics process more streamlined and efficient for businesses.
              </p>
              <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light">
                We have been a leading provider of Logistics Solutions for over 40+ years and are proud to say that we have been helping Indian businesses grow exponentially and compete on a global scale. We provide a world-class supply chain solution and constantly strive to help our client's requirements with modern technology.
              </p>
            </div>

            {/* Column 2: Statistics Block */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#f4f7f5] to-[#e6ece9] border border-brand-green/20 rounded-2xl p-6 sm:p-8 text-center shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/10 rounded-full blur-2xl"></div>
              <span className="block text-brand-green font-extrabold text-xs uppercase tracking-widest mb-1">
                Since From
              </span>
              <span className="block text-5xl sm:text-6xl font-black text-brand-green-dark tracking-tight my-2">
                1985
              </span>
              <span className="block text-[11px] font-bold text-brand-yellow bg-brand-green py-1.5 px-4 rounded-full inline-block uppercase tracking-wider shadow-xs">
                Four Decades of Excellence
              </span>
            </div>

          </div>

          {/* THE KPS ADVANTAGE 4 PILLARS */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-brand-gray-muted/60">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-1">
              <span className="text-brand-yellow-dark font-bold text-[10px] sm:text-xs uppercase tracking-widest block">
                THE KPS ADVANTAGE
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-green-dark">
                Engineered for Reliability & Scale
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {companyDetails.advantagePillars.map((pillar, idx) => (
                <div key={idx} className="bg-brand-gray-light border border-brand-gray-muted rounded-xl p-3.5 sm:p-5 hover:border-brand-green transition-all shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-xs mb-2.5 sm:mb-3">
                      0{idx + 1}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-green-dark mb-1 leading-snug">{pillar.title}</h4>
                    <p className="text-[10.5px] sm:text-xs text-brand-gray leading-relaxed font-light">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Executive Leadership Section (Responsive & Compact Cards) */}
      <section className="py-10 sm:py-16 md:py-20 bg-brand-gray-light border-y border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <span className="w-3.5 sm:w-6 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
                EXECUTIVE LEADERSHIP
              </span>
              <span className="w-3.5 sm:w-6 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-brand-green-dark">
              Guiding K.P.S & Co. Across Four Decades
            </h2>

            <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light max-w-xl mx-auto">
              Founded on core values of integrity and lasting relationships in 1985, and advanced through next-generation supply chain technology.
            </p>
          </div>

          {/* 2-Card Responsive Compact Grid: 1 Column on Mobile, 2 Columns on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            
            {/* Card 1: Founder & Chairman */}
            <div className="bg-white rounded-2xl border border-brand-gray-muted shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                {/* Photo Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={founderImg}
                    alt="Founder & Chairman Mr. Srinivasa Pragasam (Seenu)"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-xs border border-white/20 text-[9.5px] sm:text-[10.5px] font-bold text-brand-yellow uppercase tracking-wider">
                      FOUNDER & CHAIRMAN
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-brand-green/90 backdrop-blur-xs text-[9.5px] sm:text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                      Est. 1985
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold text-brand-yellow tracking-wide block">
                      K.P.S & Co. Founder
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                      Mr. Srinivasa Pragasam (Seenu)
                    </h3>
                  </div>
                </div>

                {/* Accent Line */}
                <div className="h-1 bg-gradient-to-r from-brand-yellow via-brand-yellow-light to-brand-yellow"></div>

                {/* Card Body */}
                <div className="p-5 sm:p-7 space-y-3.5">
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light">
                    I began this journey in 1985 at the age of 24 without any industry background — just inspiration from my uncle and an eagerness to learn. Through hard work and independent study, I cleared the required exams and secured my logistics license to build something of my own.
                  </p>

                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light">
                    One unforgettable moment came during a bank visit when I helped an elderly gentleman struggling to fill a cheque deposit form. A month later, ready to retire, that same gentleman handed me his entire logistics operation — becoming our foundational client.
                  </p>

                  <blockquote className="border-l-3 border-brand-yellow pl-3.5 py-2 italic text-gray-800 font-medium text-xs sm:text-[13px] leading-relaxed bg-[#fffdf0] rounded-r-lg">
                    &ldquo;Help others without expecting anything in return — good things will always follow.&rdquo;
                  </blockquote>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 sm:px-7 sm:pb-6 pt-2 border-t border-brand-gray-muted/60 flex items-center justify-between text-[11px] sm:text-xs text-brand-gray">
                <span className="font-semibold text-brand-green-dark">Leadership Handover: 2008</span>
                <span className="text-brand-yellow-dark font-bold">40+ Years of Excellence</span>
              </div>
            </div>

            {/* Card 2: Managing Director */}
            <div className="bg-white rounded-2xl border border-brand-gray-muted shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                {/* Photo Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={mdImg}
                    alt="Managing Director Mr. B.S. Prassanna"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-xs border border-white/20 text-[9.5px] sm:text-[10.5px] font-bold text-brand-yellow uppercase tracking-wider">
                      MANAGING DIRECTOR
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-brand-green/90 backdrop-blur-xs text-[9.5px] sm:text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                      Since 2008
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold text-brand-yellow tracking-wide block">
                      Operations & Innovation
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                      Mr. B.S. Prassanna
                    </h3>
                  </div>
                </div>

                {/* Accent Line */}
                <div className="h-1 bg-gradient-to-r from-brand-green via-brand-green-light to-brand-green"></div>

                {/* Card Body */}
                <div className="p-5 sm:p-7 space-y-3.5">
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light">
                    In 2008, at the age of just 20, Mr. B.S. Prassanna stepped into the shipping and logistics industry, taking over the reins of K.P.S & Co. after completing his Bachelor’s degree in Computer Engineering. He entered with a clear vision: to modernize traditional logistics through digital automation and simplified client workflows.
                  </p>

                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light">
                    Prassanna’s focus has been eliminating supply chain complexity and maximizing transparency. By identifying key industry friction points, he developed tech-enabled tracking and custom clearance protocols that significantly elevated operational velocity, client satisfaction, and corporate trust.
                  </p>

                  {/* Highlight Badges */}
                  <div className="pt-1 flex flex-wrap gap-2">
                    <div className="inline-flex items-center space-x-1.5 bg-[#eaf4ef] text-brand-green-dark font-bold text-[11px] sm:text-xs px-3 py-1.5 rounded-lg border border-brand-green/20">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                      <span>Tech-Driven Operations</span>
                    </div>
                    <div className="inline-flex items-center space-x-1.5 bg-[#fef7e0] text-brand-green-dark font-bold text-[11px] sm:text-xs px-3 py-1.5 rounded-lg border border-brand-yellow/30">
                      <HeartHandshake className="w-3.5 h-3.5 text-brand-yellow-dark" />
                      <span>Client Trust & Transparency</span>
                    </div>
                    <div className="inline-flex items-center space-x-1.5 bg-brand-gray-light text-brand-green-dark font-bold text-[11px] sm:text-xs px-3 py-1.5 rounded-lg border border-brand-gray-muted">
                      <Award className="w-3.5 h-3.5 text-brand-green" />
                      <span>B.E. Computer Engineering</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 sm:px-7 sm:pb-6 pt-2 border-t border-brand-gray-muted/60 flex items-center justify-between text-[11px] sm:text-xs text-brand-gray">
                <span className="font-semibold text-brand-green-dark">Leadership: Next-Gen Supply Chain</span>
                <span className="text-brand-green font-bold">Technology & Innovation</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Operations in Action Video Section (Compact & Responsive) */}
      <section className="py-8 sm:py-14 md:py-16 bg-brand-gray-light border-y border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center space-x-1.5 sm:space-x-2">
              <span className="w-3.5 sm:w-6 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
              <span className="text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
                OUR OPERATIONS IN ACTION
              </span>
              <span className="w-3.5 sm:w-6 h-[1.5px] sm:h-[2px] bg-brand-yellow"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-brand-green-dark">
              Experience K.P.S & Co.
            </h2>

            <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light max-w-xl mx-auto">
              Watch our team, heavy-lift fleets, and FTWZ warehousing technology in motion across India.
            </p>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {videos.map((vid) => (
              <div 
                key={vid.id} 
                onClick={() => setActiveVideoUrl(vid.videoUrl)}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xs hover:shadow-xl overflow-hidden border border-brand-gray-muted transition-all duration-300 group cursor-pointer flex flex-col justify-between transform hover:-translate-y-1"
              >
                {/* Video Thumbnail Box */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-colors"></div>

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs border border-white/20 text-[9px] sm:text-[10px] font-bold text-brand-yellow uppercase tracking-wider">
                      {vid.tag}
                    </span>
                  </div>

                  {/* Centered Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-yellow text-brand-green-dark flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1 text-brand-green-dark" />
                    </div>
                  </div>
                </div>

                {/* Card Info Bar */}
                <div className="p-3 sm:p-4 bg-white flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-bold text-brand-green-dark text-xs sm:text-sm md:text-base group-hover:text-brand-green transition-colors truncate">
                      {vid.title}
                    </h3>
                    <p className="text-[10.5px] sm:text-xs text-brand-gray font-light truncate">
                      {vid.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#eaf4ef] text-brand-green font-bold text-[10px] sm:text-xs shrink-0 group-hover:bg-brand-green group-hover:text-white transition-colors">
                    <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                    <span>Watch</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Mission & Vision Section */}
      <section className="py-12 sm:py-20 bg-white text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-1.5 sm:space-y-2">
            <span className="text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-wider block">
              Mission & Vision
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug text-brand-green-dark">
              Our Core Intent
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="bg-brand-gray-light border border-brand-gray-muted rounded-2xl p-6 sm:p-8 relative overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-brand-green pointer-events-none">
                <Compass className="w-36 h-36" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 bg-brand-green text-white rounded-xl shadow-xs">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-green-dark">
                    Our Mission
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed relative z-10 font-light">
                  Committed to integrity and service excellence, we empower our employees, strengthen partnerships with our clients and vendors, and harness technology to enhance the well-being of our region and beyond.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-brand-green-bg/40 border border-brand-green/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-brand-green pointer-events-none">
                <Eye className="w-36 h-36" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 bg-brand-yellow text-brand-green-dark rounded-xl shadow-xs">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-green-dark">
                    Our Vision
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed relative z-10 font-light">
                  Our vision is to create an inclusive and dynamic environment where integrity and service guide our every action. We aim to empower our employees, nurture strong partnerships with our clients and vendors, and leverage the latest technological advancements to drive innovation and growth in our region, ensuring a brighter future for our community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Video Modal Player (Native HTML5 MP4 with Controls) */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm"
            onClick={() => setActiveVideoUrl(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <video
                  key={activeVideoUrl}
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
