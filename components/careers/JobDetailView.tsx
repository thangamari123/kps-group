'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { jobsCms } from '@/lib/careers-firestore';
import CareerApplicationForm from '@/components/forms/CareerApplicationForm';
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Award,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface JobDetailViewProps {
  initialSlug?: string;
}

export default function JobDetailView({ initialSlug }: JobDetailViewProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. Resolve effective slug from query parameter (?slug=... or ?id=...), prop, or pathname
  const targetSlug = useMemo(() => {
    // Check search params first: ?slug=..., ?id=..., ?job=...
    const qSlug = searchParams?.get('slug') || searchParams?.get('id') || searchParams?.get('job');
    if (qSlug && qSlug.trim() && qSlug.trim() !== 'view') {
      return qSlug.trim();
    }

    // Check props
    if (initialSlug && initialSlug.trim() && initialSlug.trim() !== 'view') {
      return initialSlug.trim();
    }

    // Check pathname (e.g., /career/customs-broker or /careers/logistics-lead on Cloudflare Pages)
    if (pathname) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2 && (parts[0] === 'career' || parts[0] === 'careers') && parts[1] !== 'view') {
        return decodeURIComponent(parts[1].trim());
      }
    }

    // Fallback to check window location if running in browser
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSlug = urlParams.get('slug') || urlParams.get('id') || urlParams.get('job');
      if (urlSlug && urlSlug.trim() && urlSlug.trim() !== 'view') {
        return urlSlug.trim();
      }

      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2 && (pathParts[0] === 'career' || pathParts[0] === 'careers') && pathParts[1] !== 'view') {
        return decodeURIComponent(pathParts[1].trim());
      }
    }

    return '';
  }, [searchParams, pathname, initialSlug]);

  useEffect(() => {
    if (!targetSlug) {
      setLoading(false);
      setNotFoundState(true);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setNotFoundState(false);

    jobsCms
      .getBySlug(targetSlug)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.status !== 'archived' && data.status !== 'draft') {
          setJob(data);
          setNotFoundState(false);
        } else {
          setJob(null);
          setNotFoundState(true);
        }
      })
      .catch((err) => {
        console.error('Error fetching job details from Firestore:', err);
        if (!isMounted) return;
        setJob(null);
        setNotFoundState(true);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [targetSlug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const parseListItems = (content: any): string[] => {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return content
        .split('\n')
        .map((s) => s.replace(/^[•\-*]\s*/, '').trim())
        .filter(Boolean);
    }
    return [];
  };

  if (loading) {
    return (
      <div className="py-24 text-center bg-white min-h-[50vh] flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-4">
          <div className="w-10 h-10 border-3 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-brand-gray">Loading career opportunity details...</p>
        </div>
      </div>
    );
  }

  if (notFoundState || !job) {
    return (
      <div className="py-24 bg-brand-gray-light min-h-[60vh] flex items-center justify-center text-center">
        <div className="container mx-auto px-4 max-w-xl bg-white p-8 sm:p-12 rounded-2xl border border-brand-gray-muted shadow-lg space-y-4">
          <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-brand-green-dark">Position Not Available</h1>
          <p className="text-sm text-brand-gray leading-relaxed font-light">
            This job posting may have been filled, archived, deleted, or is no longer accepting public applications.
          </p>
          <div className="pt-4">
            <Link
              href="/career"
              className="inline-flex items-center space-x-2 bg-brand-green hover:bg-[#004D3A] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse All Careers</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const responsibilities = parseListItems(job.responsibilities);
  const requirements = parseListItems(job.requirements);
  const qualifications = parseListItems(job.qualifications);
  const skills = parseListItems(job.skills);
  const benefits = parseListItems(job.benefits);

  const employmentType = job.employmentType || job.employment_type || 'Full Time';
  const isDeadlinePassed = job.deadline && new Date(job.deadline).getTime() < Date.now();
  const isClosed = isDeadlinePassed || job.status === 'closed';

  return (
    <div className="bg-white text-brand-gray-dark">
      {/* 1. Header Hero Banner */}
      <section className="bg-brand-green-dark text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-white/70 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/career" className="hover:text-white transition-colors">Careers</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-yellow truncate max-w-xs">{job.title}</span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {job.department && (
                <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/15 text-brand-yellow border border-white/20">
                  {job.department}
                </span>
              )}
              <span className="px-3 py-1 rounded-md text-[11px] font-semibold bg-white/10 text-white border border-white/15">
                {employmentType}
              </span>
              {isClosed && (
                <span className="px-3 py-1 rounded-md text-[11px] font-bold bg-red-500/20 text-red-200 border border-red-400/30">
                  Applications Closed
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {job.title}
            </h1>

            {/* Meta Tags Strip */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-white/80 pt-2 font-light">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>{job.location}</span>
              </div>

              {job.experience && (
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span>{job.experience}</span>
                </div>
              )}

              {job.salary && (
                <div className="flex items-center space-x-1.5 font-semibold text-brand-yellow">
                  <span>{job.salary}</span>
                </div>
              )}

              {job.deadline && (
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-brand-yellow shrink-0" />
                  <span>Apply before {job.deadline}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 flex flex-wrap items-center gap-3">
              {!isClosed ? (
                <a
                  href="#apply-section"
                  className="bg-brand-yellow hover:bg-brand-yellow-light text-brand-green-dark font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition-transform hover:scale-105"
                >
                  Apply for this Position
                </a>
              ) : (
                <div className="bg-red-500/20 text-red-100 border border-red-400/30 font-bold text-xs py-3 px-6 rounded-xl">
                  Applications Closed for this Role
                </div>
              )}

              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 px-4 rounded-xl border border-white/20 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Position'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Job Details Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Content Area */}
            <div className="lg:col-span-8 space-y-10">
              {/* About the Role */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-brand-green-dark uppercase tracking-wide border-b border-brand-gray-muted pb-3">
                  About the Role & Responsibilities
                </h2>
                <div className="text-sm text-brand-gray-dark leading-relaxed whitespace-pre-wrap font-light">
                  {job.description}
                </div>
              </div>

              {/* Key Responsibilities */}
              {responsibilities.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-brand-green-dark uppercase tracking-wide border-b border-brand-gray-muted pb-3">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-brand-gray-dark font-light">
                        <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-brand-green-dark uppercase tracking-wide border-b border-brand-gray-muted pb-3">
                    Candidate Requirements & Experience
                  </h2>
                  <ul className="space-y-3">
                    {requirements.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-brand-gray-dark font-light">
                        <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Educational Qualifications */}
              {qualifications.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-brand-green-dark uppercase tracking-wide border-b border-brand-gray-muted pb-3">
                    Educational Qualifications
                  </h2>
                  <ul className="space-y-3">
                    {qualifications.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-brand-gray-dark font-light">
                        <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-brand-green-dark uppercase tracking-wide border-b border-brand-gray-muted pb-3">
                    Required Skills & Domain Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-brand-green-dark uppercase tracking-wide border-b border-brand-gray-muted pb-3">
                    What We Offer & Employee Benefits
                  </h2>
                  <ul className="space-y-3">
                    {benefits.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-brand-gray-dark font-light">
                        <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-brand-gray-light border border-brand-gray-muted rounded-2xl p-6 space-y-5">
                <h3 className="text-base font-bold text-brand-green-dark uppercase tracking-wider border-b border-brand-gray-muted pb-2">
                  Position Overview
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-brand-gray font-semibold block text-[11px] uppercase">Department</span>
                    <span className="font-bold text-brand-gray-dark text-sm">{job.department || 'Operations'}</span>
                  </div>

                  <div>
                    <span className="text-brand-gray font-semibold block text-[11px] uppercase">Work Location</span>
                    <span className="font-bold text-brand-gray-dark text-sm">{job.location}</span>
                  </div>

                  <div>
                    <span className="text-brand-gray font-semibold block text-[11px] uppercase">Employment Type</span>
                    <span className="font-bold text-brand-gray-dark text-sm">{employmentType}</span>
                  </div>

                  {job.experience && (
                    <div>
                      <span className="text-brand-gray font-semibold block text-[11px] uppercase">Experience Required</span>
                      <span className="font-bold text-brand-gray-dark text-sm">{job.experience}</span>
                    </div>
                  )}

                  {job.salary && (
                    <div>
                      <span className="text-brand-gray font-semibold block text-[11px] uppercase">Compensation</span>
                      <span className="font-bold text-brand-green text-sm">{job.salary}</span>
                    </div>
                  )}
                </div>

                {!isClosed ? (
                  <a
                    href="#apply-section"
                    className="block text-center w-full bg-brand-green hover:bg-[#004D3A] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors"
                  >
                    Apply Now
                  </a>
                ) : (
                  <div className="text-center w-full bg-gray-200 text-gray-600 font-bold py-3 rounded-xl text-xs">
                    Applications Closed
                  </div>
                )}
              </div>

              {/* Corporate Trust Card */}
              <div className="bg-brand-green-bg/60 border border-brand-green/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3 text-brand-green-dark">
                  <Award className="w-6 h-6 text-brand-green" />
                  <h4 className="font-bold text-sm">Join a 40+ Year Logistics Leader</h4>
                </div>
                <p className="text-xs text-brand-gray leading-relaxed font-light">
                  KPS Worldwide Logistics operates licensed customs brokerage, Pan-India multimodal freight, and industrial warehousing supporting premier multinational brands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Embedded Application Form Section */}
      <section id="apply-section" className="py-16 bg-brand-gray-light border-t border-brand-gray-muted">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <CareerApplicationForm
              jobId={job.id}
              jobTitle={job.title}
              jobSlug={job.slug}
              isClosed={isClosed}
              deadline={job.deadline}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
