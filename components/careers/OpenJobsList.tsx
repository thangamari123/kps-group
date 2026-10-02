'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsApi } from '@/lib/api';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
} from 'lucide-react';

export default function OpenJobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi
      .getPublicJobs()
      .then((data) => {
        setJobs(data || []);
      })
      .catch((err) => {
        console.error('Failed to load published jobs', err);
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-white border-t border-brand-gray-muted text-brand-gray-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <span className="text-brand-green font-bold text-xs uppercase tracking-wider block mb-2">
            Career Opportunities
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-brand-green-dark">
            Current Open Positions
          </h2>
          <p className="text-base text-brand-gray mt-2 leading-relaxed">
            Explore active openings across our customs brokerage, ocean freight, multimodal transport, and supply chain divisions in Chennai and across India.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-brand-gray-light border border-brand-gray-muted rounded-xl p-6 space-y-4 animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                <div className="h-16 bg-slate-200 rounded-md" />
                <div className="h-10 bg-slate-200 rounded-md w-1/3" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-brand-gray-light border border-brand-gray-muted rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-green-dark mb-1">
              No Current Open Positions
            </h3>
            <p className="text-sm text-brand-gray leading-relaxed max-w-md mx-auto">
              We are not actively recruiting for specific roles right now, but we are always looking for passionate logistics professionals. Submit your CV below for future openings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-brand-gray-muted hover:border-brand-green/40 hover:shadow-xl rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Top Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {job.department && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-brand-green-bg text-brand-green uppercase tracking-wide">
                        {job.department}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-brand-gray-light text-brand-gray-dark border border-brand-gray-muted">
                      {job.employment_type}
                    </span>
                  </div>

                  {/* Job Title */}
                  <div>
                    <h3 className="text-xl font-bold text-brand-green-dark group-hover:text-brand-green transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-brand-gray mt-2">
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
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-brand-gray leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Card Footer with Apply Button */}
                <div className="pt-6 mt-6 border-t border-brand-gray-muted flex items-center justify-between">
                  <div className="text-xs text-brand-gray">
                    {job.deadline ? (
                      <span className="font-medium">Deadline: {job.deadline}</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Immediate Hiring</span>
                    )}
                  </div>

                  <Link
                    href={`/career/${job.slug}`}
                    className="inline-flex items-center space-x-2 bg-brand-green hover:bg-brand-green-light text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all group-hover:translate-x-1"
                  >
                    <span>View Role & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
