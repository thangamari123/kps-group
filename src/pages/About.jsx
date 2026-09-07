import { useState } from 'react';
import { Play, X, Compass, Eye, CheckCircle2, Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { companyDetails } from '../data/company';
import PageHero from '../components/common/PageHero';
import SEO from '../components/common/SEO';

export default function About() {
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  const videos = [
    {
      id: "vid1",
      title: "Logistics Fleet Operations",
      thumbnail: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder embed
    },
    {
      id: "vid2",
      title: "FTWZ Warehouse Management",
      thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder embed
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

      {/* 2. Founder Section */}
      <section className="py-12 sm:py-20 bg-brand-gray-light border-y border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Image Box */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4] max-w-full relative z-10 bg-brand-green-dark">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                  alt="Founder & Chairman, K.P.S & Co. - Mr. Srinivasa Pragasam (Seenu)"
                  className="w-full h-full object-cover grayscale contrast-125 opacity-90"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-full h-full border-4 border-brand-yellow rounded-2xl -z-0"></div>
            </div>

            {/* Content Box */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div>
                <span className="text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-1 block">
                  Founder & Chairman, K.P.S & Co.
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-green-dark">
                  Mr. Srinivasa Pragasam (Seenu)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                I began this journey in 1985, at the age of 24, without any industry background just inspiration from my uncle and an eagerness to learn. I didn’t join any company or take a job. I simply decided to build something on my own.
              </p>
              
              <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                With hard work and self-study, I cleared the required exams and obtained my logistics license. One unforgettable moment in my early days came while I was visiting the bank for company work. I noticed an elderly man struggling to fill a cheque deposit form. I helped him just as any young person should. A month later, that same man, now too old to continue in business, handed me his entire logistics operation.
              </p>

              <blockquote className="border-l-4 border-brand-yellow pl-4 py-2 italic text-gray-800 font-semibold text-sm sm:text-base leading-relaxed bg-white/70 rounded-r-lg">
                &ldquo;That experience shaped my belief: Help others without expecting anything in return good things will always follow.&rdquo;
              </blockquote>

              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-xs sm:text-sm font-extrabold text-brand-green-dark uppercase tracking-wider mb-1.5">
                  KPS Logistics Team
                </h4>
                <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                  Since then, we’ve grown K.P.S & Co. with the values of trust, consistency, and long-term partnerships. I’ve always believed in investing in people and building customer relationships that last. In 2008, I proudly handed over the leadership to my son, Mr. Prasssanna B.S., who shares the same commitment and vision for our future.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Managing Director Section */}
      <section className="py-12 sm:py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Content Box (Left) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:order-1">
              <div>
                <span className="text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-1 block">
                  Managing Director, K.P.S & Co.
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-green-dark">
                  Mr. B.S. Prassanna
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                In 2008, at the age of just 20, Mr. B.S. Prassanna stepped into the world of shipping and logistics, taking over the reins of K.P.S & Co. after completing his Bachelor’s degree in Computer Engineering. Though young, he entered the business with a clear vision: to transform the traditional logistics landscape using modern technology and to offer clients more solution-driven, simplified experiences.
              </p>

              <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                Prassanna’s focus from the very beginning has been to reduce complexity and enhance transparency in logistics operations. With a passion for innovation, he identified the key pain points clients faced and began building tech-enabled solutions that not only improved operational efficiency but also strengthened client satisfaction and trust.
              </p>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <div className="inline-flex items-center space-x-1.5 bg-[#eaf4ef] text-brand-green-dark font-bold text-xs px-3 py-1.5 rounded-lg border border-brand-green/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                  <span>Tech-Driven Operations</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 bg-[#fef7e0] text-brand-green-dark font-bold text-xs px-3 py-1.5 rounded-lg border border-brand-yellow/30">
                  <HeartHandshake className="w-3.5 h-3.5 text-brand-yellow-dark" />
                  <span>Customer Trust & Transparency</span>
                </div>
              </div>
            </div>

            {/* Image Box (Right) */}
            <div className="lg:col-span-5 relative lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4] max-w-full relative z-10 bg-brand-green-dark">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
                  alt="Managing Director Mr. B.S. Prassanna"
                  className="w-full h-full object-cover grayscale opacity-90"
                />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-full h-full border-4 border-brand-green rounded-2xl -z-0"></div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Operations in Action Video Section */}
      <section className="py-12 sm:py-20 bg-brand-gray-light border-y border-brand-gray-muted text-brand-gray-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-1.5 sm:space-y-2">
            <span className="text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-wider block">
              Our Operations in Action
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-brand-green-dark">
              Experience K.P.S & Co.
            </h2>
            <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-light">
              Watch our team and technology in motion, delivering excellence across the supply chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {videos.map((vid) => (
              <div key={vid.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-brand-gray-muted group">
                <div className="relative aspect-video cursor-pointer overflow-hidden" onClick={() => setActiveVideoUrl(vid.videoUrl)}>
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-brand-green-dark/40 flex items-center justify-center group-hover:bg-brand-green-dark/50 transition-colors">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-yellow text-brand-green-dark flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between">
                  <h4 className="font-bold text-brand-green-dark text-sm sm:text-base">{vid.title}</h4>
                  <span className="text-[10px] font-semibold text-brand-green uppercase tracking-wider">Watch Video</span>
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

      {/* 6. Happy Customers Section */}
      <section className="py-14 sm:py-20 bg-brand-green-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1920&q=80')` }}></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            
            {/* Stats block */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-2 sm:space-y-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-brand-yellow block">
                6890+
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Happy Customers
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm mx-auto lg:mx-0 font-light">
                Our vision to create an inclusive and dynamic environment
              </p>
            </div>

            {/* List block */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
              {[
                "Custom Brokerage",
                "Liquid Bulk",
                "Trade Compliance Consultations",
                "Warehouse - FTWZ"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-white/10 border border-white/15 rounded-xl p-3.5 sm:p-4 hover:bg-white/15 transition-colors">
                  <div className="p-1.5 sm:p-2 bg-brand-yellow text-brand-green-dark rounded-full flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm tracking-wide">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video">
                <iframe
                  title="Operations Video Player"
                  src={activeVideoUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
