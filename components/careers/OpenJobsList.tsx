'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { jobsCms } from '@/lib/careers-firestore';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function OpenJobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

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

  return (
    <section className="py-16 bg-white border-t border-brand-gray-muted text-brand-gray-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Recruitment</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-green-dark">
              Current Open Positions
            </h2>
            <p className="text-sm text-brand-gray mt-2 leading-relaxed font-light">
              Explore active openings across our customs brokerage, ocean & air freight forwarding, multimodal logistics, and FTWZ operations in Chennai and Pan-India.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gray">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search positions, locations, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-muted rounded-xl text-xs focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:outline-none bg-[#fafcfb]"
            />
          </div>
        </div>

        {/* Department Filters */}
        {departments.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-gray-100">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDept === dept
                    ? 'bg-[#004D3A] text-brand-yellow shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-brand-gray-light border border-brand-gray-muted rounded-2xl p-6 space-y-4 animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                <div className="h-16 bg-slate-200 rounded-md" />
                <div className="h-10 bg-slate-200 rounded-md w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-brand-gray-light border border-brand-gray-muted rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-green-dark mb-1">
              No Positions Matching Your Filter
            </h3>
            <p className="text-sm text-brand-gray leading-relaxed max-w-md mx-auto font-light">
              Try adjusting your search criteria or submit a general application below for future openings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredJobs.map((job) => {
              const employmentType = job.employmentType || job.employment_type || 'Full Time';
              const isDeadlinePassed = job.deadline && new Date(job.deadline).getTime() < Date.now();

              return (
                <div
                  key={job.id}
                  className="bg-white border border-brand-gray-muted hover:border-brand-green/50 hover:shadow-xl rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    {/* Top Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {job.department && (
                          <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-md bg-[#004D3A] text-brand-yellow uppercase tracking-wide">
                            {job.department}
                          </span>
                        )}
                        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                          {employmentType}
                        </span>
                      </div>

                      {isDeadlinePassed ? (
                        <span className="text-[10.5px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Applications Closed</span>
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Open Position
                        </span>
                      )}
                    </div>

                    {/* Job Title */}
                    <div>
                      <h3 className="text-xl font-extrabold text-brand-green-dark group-hover:text-brand-green transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-brand-gray mt-2 font-medium">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-green" />
                          <span>{job.location}</span>
                        </div>
                        {job.experience && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-brand-green" />
                            <span>{job.experience}</span>
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center space-x-1 text-emerald-800 font-bold">
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-brand-gray leading-relaxed line-clamp-3 font-light">
                      {job.description}
                    </p>
                  </div>

                  {/* Card Footer with Apply Button */}
                  <div className="pt-6 mt-6 border-t border-brand-gray-muted flex items-center justify-between">
                    <div className="text-xs text-brand-gray flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-yellow-dark" />
                      {job.deadline ? (
                        <span className="font-medium">Apply before {job.deadline}</span>
                      ) : (
                        <span className="text-emerald-800 font-semibold">Immediate Hiring</span>
                      )}
                    </div>

                    <Link
                      href={`/career/view?slug=${encodeURIComponent(job.slug || job.id)}`}
                      className="inline-flex items-center space-x-2 bg-brand-green hover:bg-[#004D3A] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all group-hover:translate-x-0.5"
                    >
                      <span>View Role & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
