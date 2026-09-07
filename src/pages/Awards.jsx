import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { awardsData } from '../data/awards';
import { 
  Award, Calendar, Landmark, Check, ZoomIn, X, Trophy, 
  ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Filter, ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Awards() {
  const [selectedAwardIndex, setSelectedAwardIndex] = useState(null);
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (newest first) or 'asc' (oldest first)

  // Available unique years
  const availableYears = ['ALL', '2025', '2023', '2022'];

  // Filtered and sorted awards
  const processedAwards = useMemo(() => {
    let list = [...awardsData];
    if (selectedYear !== 'ALL') {
      list = list.filter((item) => item.year === selectedYear);
    }
    if (sortOrder === 'asc') {
      list.reverse();
    }
    return list;
  }, [selectedYear, sortOrder]);

  const activeAward = selectedAwardIndex !== null ? processedAwards[selectedAwardIndex] : null;

  const handleNextAward = () => {
    if (selectedAwardIndex !== null) {
      setSelectedAwardIndex((prev) => (prev + 1) % processedAwards.length);
    }
  };

  const handlePrevAward = () => {
    if (selectedAwardIndex !== null) {
      setSelectedAwardIndex((prev) => (prev - 1 + processedAwards.length) % processedAwards.length);
    }
  };

  return (
    <div className="bg-white">
      {/* Page Hero */}
      <PageHero 
        title="Awards & Recognitions" 
        description="At KPS & Co., we take pride in being recognized by prominent shipping conclaves, maritime councils, and multinational logistics partners for our four-decade legacy of excellence and dependable service."
        bgImage="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Main Awards Section with Proper Order */}
      <section className="py-12 sm:py-20 text-brand-gray-dark bg-white">
        <div className="container mx-auto px-3 sm:px-6">
          
          {/* Section Header & Controls */}
          <div className="max-w-5xl mx-auto mb-8 sm:mb-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center space-x-1.5 text-brand-yellow-dark font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>CHRONOLOGICAL WALL OF FAME</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-brand-green-dark tracking-tight">
                  Recognized by Global & Maritime Leaders
                </h2>
                <p className="text-xs sm:text-sm text-brand-gray font-light">
                  A comprehensive record of prestigious industry awards, customer partner appreciations, and conclave recognitions honoring KPS & Co.
                </p>
              </div>

              {/* Filtering & Sort Controls */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Year Filter Buttons */}
                <div className="flex items-center bg-[#f4f7f5] p-1 rounded-xl border border-[#e2e8e5] text-xs">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg font-bold transition-all text-[11px] sm:text-xs ${
                        selectedYear === year
                          ? 'bg-[#072419] text-brand-yellow shadow-xs'
                          : 'text-gray-600 hover:text-brand-green'
                      }`}
                    >
                      {year === 'ALL' ? 'All (5)' : year}
                    </button>
                  ))}
                </div>

                {/* Sort Order Toggle */}
                <button
                  onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  className="inline-flex items-center space-x-1.5 bg-[#f4f7f5] hover:bg-[#eaf1ec] text-brand-green-dark border border-[#e2e8e5] px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors"
                  title="Toggle Chronological / Reverse-Chronological Order"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-brand-yellow-dark" />
                  <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Awards Ordered Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
            {processedAwards.map((award, index) => {
              // Calculate continuous proper sequence number
              const milestoneNumber = sortOrder === 'desc' ? index + 1 : processedAwards.length - index;
              const formattedNumber = String(milestoneNumber).padStart(2, '0');

              return (
                <div 
                  key={award.id}
                  onClick={() => setSelectedAwardIndex(index)}
                  className="bg-[#fafcfb] border border-[#e2e8e5] hover:border-brand-green/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative cursor-pointer"
                >
                  {/* Top Award Image Display Area (Full uncropped plaque presentation) */}
                  <div className="relative h-52 sm:h-64 md:h-72 w-full overflow-hidden bg-gradient-to-b from-[#f4f7f5] to-[#eaefec] flex items-center justify-center p-3.5 sm:p-5 flex-shrink-0 border-b border-[#e5ece8]">
                    <img
                      src={award.image}
                      alt={award.title}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl group-hover:scale-105 transition-all duration-500"
                    />

                    {/* Top Order Badges */}
                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center space-x-1.5">
                        <span className="inline-flex items-center space-x-1 bg-[#072419]/90 backdrop-blur-md text-brand-yellow font-mono font-bold text-[9px] sm:text-xs px-2.5 py-1 rounded-lg border border-brand-yellow/30 shadow-xs">
                          <Calendar className="w-3 h-3 text-brand-yellow" />
                          <span>{award.year}</span>
                        </span>
                        <span className="inline-flex items-center bg-white/90 backdrop-blur-md text-brand-green-dark font-extrabold text-[9px] sm:text-[10.5px] px-2 py-1 rounded-lg border border-emerald-200 shadow-xs">
                          #{formattedNumber}
                        </span>
                      </div>

                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/90 backdrop-blur-md text-brand-green border border-emerald-200 flex items-center justify-center shadow-xs">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                      </div>
                    </div>

                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 bg-[#072419]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-[#072419]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center space-x-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-brand-yellow" />
                        <span>View Certificate</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow space-y-3 bg-white">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-brand-yellow-dark uppercase tracking-wider">
                        <span>Milestone Accolade #{formattedNumber}</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-brand-green-dark group-hover:text-brand-green transition-colors leading-snug">
                        {award.title}
                      </h3>

                      <p className="text-xs text-brand-gray leading-relaxed font-light line-clamp-3">
                        {award.description}
                      </p>
                    </div>

                    {/* Bottom Meta Row */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1.5 text-xs text-gray-500">
                      <div className="flex items-center space-x-1.5 font-semibold text-brand-green-dark truncate">
                        <Landmark className="w-3.5 h-3.5 text-brand-yellow-dark flex-shrink-0" />
                        <span className="truncate">{award.organization}</span>
                      </div>
                      <span className="text-gray-400 font-medium flex-shrink-0 text-[11px]">
                        {award.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Partnership Callout Banner */}
          <div className="mt-14 sm:mt-20 max-w-4xl mx-auto bg-brand-green-dark text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-brand-green/30 text-center space-y-4">
            <div className="inline-flex items-center space-x-1.5 bg-brand-yellow/20 text-brand-yellow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Partner with an Award-Winning Team</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              Experience Four Decades of Reliable Shipping & Logistics
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
              From licensed customs clearance to multimodal freight and FTWZ operations, get tailored supply chain solutions designed for reliability and compliance.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/lead-form"
                className="bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-bold px-6 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm"
              >
                Request a Custom Quote
              </Link>
              <Link
                to="/contact-us"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all text-xs sm:text-sm"
              >
                Contact Our Corporate Desk
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Full Certificate Lightbox Modal with Next/Prev Navigation */}
      <AnimatePresence>
        {activeAward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative border border-brand-gray-muted space-y-4 max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedAwardIndex(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors z-10 shadow-xs"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start pt-2">
                {/* High-res Image Preview */}
                <div className="w-full sm:w-1/2 bg-gradient-to-b from-[#f8faf9] to-[#eef2f0] border border-[#e2e8e5] rounded-xl p-3 sm:p-4 flex items-center justify-center shadow-inner relative">
                  <img
                    src={activeAward.image}
                    alt={activeAward.title}
                    className="max-h-[320px] sm:max-h-[400px] w-auto object-contain drop-shadow-xl"
                  />
                </div>

                {/* Content */}
                <div className="w-full sm:w-1/2 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1 bg-[#072419] text-brand-yellow font-bold text-xs px-2.5 py-1 rounded-md border border-brand-yellow/30">
                      <Calendar className="w-3 h-3 text-brand-yellow" />
                      <span>{activeAward.year}</span>
                    </span>
                    <span className="text-xs font-semibold text-gray-500">{activeAward.date}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#072419] leading-snug">
                    {activeAward.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    {activeAward.description}
                  </p>

                  <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-brand-green-dark font-bold">
                      <Landmark className="w-4 h-4 text-brand-yellow-dark flex-shrink-0" />
                      <span>Awarded by: {activeAward.organization}</span>
                    </div>
                  </div>

                  {/* Navigation Arrows inside Modal */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">
                      {selectedAwardIndex + 1} of {processedAwards.length}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={handlePrevAward}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-brand-green hover:text-white text-gray-700 transition-colors"
                        aria-label="Previous Award"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextAward}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-brand-green hover:text-white text-gray-700 transition-colors"
                        aria-label="Next Award"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
