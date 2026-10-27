'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { jobsCms } from '@/lib/careers-firestore';
import CareerApplicationForm from '@/components/forms/CareerApplicationForm';
import { getDeadlineDate, isJobOpenForApplications } from '@/lib/job-deadline';
import { formatAnnouncementDate } from '@/lib/announcement-utils';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Calendar,
  AlertCircle,
  Wallet,
} from 'lucide-react';

export default function OpenJobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  // The application form stays hidden until the visitor clicks Apply on an open job
  const [applyJobId, setApplyJobId] = useState<string | null>(null);
  const applyRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (applyJobId) {
      applyRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    }
  }, [applyJobId]);

  useEffect(() => {
    let isMounted = true;
    jobsCms
      .getPublished()
      .then((data) => {
        if (isMounted) {
          setJobs(data || []);
        }
      })
      .catch((err) => {
        console.error('Could not fetch published jobs from Firestore:', err);
        if (isMounted) {
          setJobs([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const departments = useMemo(() => {
    const depts = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) depts.add(j.department);
    });
    return ['All', ...Array.from(depts)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.location && job.location.toLowerCase().includes(q)) ||
        (job.department && job.department.toLowerCase().includes(q)) ||
        (job.description && job.description.toLowerCase().includes(q));

      const matchesDept = selectedDept === 'All' || job.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [jobs, search, selectedDept]);

  const applyJob = applyJobId ? jobs.find((j) => j.id === applyJobId) : null;

  return (
    <>
    <section id="open-positions" className="py-16 sm:py-20 bg-brand-gray-light border-t border-brand-gray-muted text-brand-gray-dark scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header + search */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 lg:items-end mb-8 sm:mb-10">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2.5 text-brand-green text-[11px] font-bold uppercase tracking-[0.18em]">
              <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
              Active Recruitment
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-green-dark">
              Current Open Positions
            </h2>
            <p className="mt-3 text-[14.5px] sm:text-[15px] text-[#4b5563] leading-relaxed font-normal max-w-2xl">
              Explore active openings across our customs brokerage, ocean & air freight forwarding, multimodal logistics, and FTWZ operations in Chennai and Pan-India.
            </p>
          </div>

          {/* Search Box */}
          <div className="lg:col-span-5">
            <label htmlFor="career-search" className="sr-only">
              Search positions
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="career-search"
                type="text"
                placeholder="Search positions, locations, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:outline-none bg-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Department Filters */}
        {departments.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                aria-pressed={selectedDept === dept}
                className={`min-h-9 px-3.5 py-1.5 rounded-md border text-xs font-bold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107] ${
                  selectedDept === dept
                    ? 'bg-[#004D3A] border-[#004D3A] text-brand-yellow shadow-xs'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-[#ffc107] hover:border-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          /* Loading: skeleton rows that match the job rows */
          <div
            role="status"
            aria-label="Loading open positions"
            className="bg-white border border-brand-gray-muted divide-y divide-brand-gray-muted rounded-lg overflow-hidden"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 sm:p-6 animate-pulse flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-3 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <div className="h-11 bg-slate-200 rounded-lg w-full lg:w-40" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          /* Error */
          <div role="alert" className="bg-white border border-red-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-green-dark mb-1">We couldn&apos;t load the open positions</h3>
            <p className="text-sm text-[#4b5563] leading-relaxed max-w-md mx-auto font-normal">
              Please check your connection and try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center justify-center min-h-11 px-5 rounded-lg bg-brand-green hover:bg-[#ffc107] hover:text-[#073B2C] text-white text-sm font-bold transition-all duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
            >
              Reload page
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty: nothing published yet, or nothing matches the current search / filter */
          <div className="bg-white border border-brand-gray-muted rounded-lg p-8 sm:p-10 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            {jobs.length === 0 ? (
              <>
                <h3 className="text-lg font-bold text-brand-green-dark mb-1">No open positions right now</h3>
                <p className="text-sm text-[#4b5563] leading-relaxed max-w-md mx-auto font-normal">
                  New roles are listed here as soon as they open. Please check back soon.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-brand-green-dark mb-1">No positions match your search</h3>
                <p className="text-sm text-[#4b5563] leading-relaxed max-w-md mx-auto font-normal">
                  Try adjusting your search criteria or check back soon for future openings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedDept('All');
                  }}
                  className="mt-5 inline-flex items-center justify-center min-h-11 px-5 rounded-lg border border-gray-300 bg-white hover:bg-[#ffc107] hover:border-[#ffc107] hover:text-[#073B2C] text-sm font-bold text-gray-700 transition-all duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                >
                  Clear search &amp; filters
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs font-semibold text-brand-gray" aria-live="polite">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
            </p>

            <ul className="bg-white border border-brand-gray-muted divide-y divide-brand-gray-muted rounded-lg overflow-hidden shadow-xs">
              {filteredJobs.map((job) => {
                const employmentType = job.employmentType || job.employment_type || 'Full Time';
                // Open only while published and the closing date (through the end of that day, IST) has not passed
                const isOpen = isJobOpenForApplications(job);
                const closingDate = formatAnnouncementDate(getDeadlineDate(job.deadline));

                return (
                  <li key={job.id}>
                    <article
                      className={`group relative grid grid-cols-1 gap-x-8 gap-y-4 py-5 pl-5 pr-4 sm:py-6 sm:pl-7 sm:pr-6 lg:grid-cols-12 lg:items-center transition-colors duration-200 ${
                        isOpen ? 'bg-white hover:bg-brand-green-bg/40' : 'bg-gray-50'
                      }`}
                    >
                      {/* Status rail: green = accepting applications, grey = closed */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-0 left-0 w-1 ${isOpen ? 'bg-brand-green' : 'bg-gray-300'}`}
                      />

                      {/* Role summary */}
                      <div className="min-w-0 lg:col-span-7">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2">
                          {job.department && (
                            <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isOpen ? 'text-brand-green' : 'text-gray-500'}`}>
                              {job.department}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-gray-600 border border-gray-300 bg-white px-2 py-0.5 rounded-sm">
                            {employmentType}
                          </span>
                          {!isOpen ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm">
                              <AlertCircle className="w-3 h-3" />
                              <span>Applications Closed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                              <span>Open Position</span>
                            </span>
                          )}
                        </div>

                        <h3
                          className={`text-lg sm:text-xl font-bold leading-snug break-words ${
                            isOpen ? 'text-brand-green-dark' : 'text-gray-500'
                          }`}
                        >
                          {job.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-brand-gray font-medium">
                          {job.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
                              <span>{job.location}</span>
                            </span>
                          )}
                          {job.experience && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-brand-green shrink-0" />
                              <span>{job.experience}</span>
                            </span>
                          )}
                          {job.salary && (
                            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold">
                              <Wallet className="w-3.5 h-3.5 shrink-0" />
                              <span>{job.salary}</span>
                            </span>
                          )}
                        </div>

                        {job.description && (
                          <p className="mt-2.5 text-[13.5px] text-[#4b5563] leading-relaxed line-clamp-2 font-normal">
                            {job.description}
                          </p>
                        )}
                      </div>

                      {/* Closing date + actions */}
                      <div className="lg:col-span-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-6">
                        <div className="flex items-center gap-1.5 text-xs text-brand-gray">
                          <Calendar className="w-3.5 h-3.5 text-brand-yellow-dark shrink-0" />
                          {job.deadline ? (
                            <span className="font-medium">
                              {isOpen ? 'Apply before' : 'Closed on'} {closingDate || String(job.deadline)}
                            </span>
                          ) : (
                            <span className="text-emerald-800 font-semibold">Immediate Hiring</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/career/view?slug=${encodeURIComponent(job.slug || job.id)}`}
                            className="inline-flex items-center justify-center min-h-11 px-3 text-xs font-bold text-brand-green hover:underline underline-offset-4 rounded-md focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                          >
                            <span>View Role</span>
                          </Link>

                          {isOpen ? (
                            <button
                              type="button"
                              onClick={() => setApplyJobId(job.id)}
                              aria-label={`Apply for ${job.title}`}
                              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 min-h-11 bg-brand-green hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white text-sm font-bold px-6 rounded-lg shadow-xs hover:shadow-md transition-all duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                            >
                              <span>Apply</span>
                              <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-0.5" />
                            </button>
                          ) : (
                            <span
                              aria-disabled="true"
                              className="inline-flex flex-1 sm:flex-none items-center justify-center min-h-11 px-6 text-sm font-bold rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed select-none"
                            >
                              Closed
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>

    {/* Candidate Portal: hidden by default, shown for the job whose Apply button was clicked */}
    {applyJob && (
      <section
        id="apply-section"
        ref={applyRef}
        className="py-14 sm:py-16 bg-white border-t border-brand-gray-muted text-brand-gray-dark scroll-mt-20"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Selected position summary */}
            <div className="mb-5 border-l-4 border-brand-yellow bg-brand-gray-light px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-green">Selected position</p>
              <p className="mt-1 text-[13px] text-brand-gray font-medium leading-relaxed break-words">
                {[
                  applyJob.department,
                  applyJob.location,
                  applyJob.employmentType || applyJob.employment_type || 'Full Time',
                  applyJob.deadline
                    ? `${isJobOpenForApplications(applyJob) ? 'Apply before' : 'Closed on'} ${
                        formatAnnouncementDate(getDeadlineDate(applyJob.deadline)) || String(applyJob.deadline)
                      }`
                    : null,
                ]
                  .filter(Boolean)
                  .join('  ·  ')}
              </p>
            </div>

            <CareerApplicationForm
              key={applyJob.id}
              jobId={applyJob.id}
              jobTitle={applyJob.title}
              jobSlug={applyJob.slug}
              isClosed={!isJobOpenForApplications(applyJob)}
              deadline={applyJob.deadline}
              onCancel={() => setApplyJobId(null)}
            />
          </div>
        </div>
      </section>
    )}
    </>
  );
}
