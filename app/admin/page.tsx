'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';
import { getCmsDashboardStats } from '@/lib/cms-firestore';
import { jobsCms, applicationsCms } from '@/lib/careers-firestore';
import type { CMSStats } from '@/lib/cms-types';
import type { JobItem, CandidateApplication } from '@/lib/careers-types';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/admin/Toast';
import {
  Briefcase,
  Users,
  ArrowUpRight,
  PlusCircle,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Camera,
  BookOpen,
  HeartHandshake,
  Trophy,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { error: toastError } = useToast();

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
  });

  const [recentApplications, setRecentApplications] = useState<CandidateApplication[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobItem[]>([]);

  const [cmsStats, setCmsStats] = useState<CMSStats>({
    galleryCount: 0,
    publishedGalleryCount: 0,
    blogsCount: 0,
    publishedBlogsCount: 0,
    csrCount: 0,
    publishedCsrCount: 0,
    awardsCount: 0,
    publishedAwardsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [allJobs, allApps, appStats, cmsRes] = await Promise.all([
        jobsCms.getAll().catch(() => []),
        applicationsCms.getAll().catch(() => []),
        applicationsCms.getStats().catch(() => ({ total: 0, new: 0 })),
        getCmsDashboardStats().catch(() => null),
      ]);

      const publishedCount = allJobs.filter((j) => j.status === 'published').length;

      setStats({
        totalJobs: allJobs.length,
        activeJobs: publishedCount,
        totalApplications: appStats.total || allApps.length,
        newApplications: appStats.new || 0,
      });

      setRecentJobs(allJobs.slice(0, 5));
      setRecentApplications(allApps.slice(0, 5));
      if (cmsRes) setCmsStats(cmsRes);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const statCards = [
    {
      title: 'Career Positions',
      mainCount: stats.totalJobs,
      subCount: `${stats.activeJobs} Published`,
      icon: Briefcase,
      badgeColor: 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/20',
      href: '/admin/careers/jobs',
      meta: 'Careers Portal',
    },
    {
      title: 'Candidate Applications',
      mainCount: stats.totalApplications,
      subCount: `${stats.newApplications} New Candidates`,
      icon: Users,
      badgeColor:
        stats.newApplications > 0
          ? 'bg-blue-50 text-[#2563EB] border-blue-200 font-bold'
          : 'bg-slate-100 text-[#66736E] border-slate-200',
      href: '/admin/careers/applications',
      meta: 'Recruitment Pipeline',
    },
    {
      title: 'Active Job Openings',
      mainCount: stats.activeJobs,
      subCount: 'Accepting Resumes',
      icon: TrendingUp,
      badgeColor: 'bg-emerald-50 text-[#059669] border-emerald-200 font-bold',
      href: '/admin/careers/jobs',
      meta: 'Public Careers Page',
    },
    {
      title: 'Live CMS Sections',
      mainCount: cmsStats.publishedGalleryCount + cmsStats.publishedBlogsCount + cmsStats.publishedCsrCount + cmsStats.publishedAwardsCount,
      subCount: 'Published Across Site',
      icon: CheckCircle2,
      badgeColor: 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/20 font-bold',
      href: '/admin/gallery',
      meta: 'Firestore Content',
    },
  ];

  const cmsCards = [
    {
      title: 'Gallery Assets',
      mainCount: cmsStats.galleryCount,
      subCount: `${cmsStats.publishedGalleryCount} Published`,
      icon: Camera,
      badgeColor: 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/20',
      href: '/admin/gallery',
      meta: 'Photos & Videos',
    },
    {
      title: 'Blog Articles',
      mainCount: cmsStats.blogsCount,
      subCount: `${cmsStats.publishedBlogsCount} Published`,
      icon: BookOpen,
      badgeColor: 'bg-blue-50 text-[#2563EB] border-blue-200',
      href: '/admin/blogs',
      meta: 'News & Insights',
    },
    {
      title: 'CSR Initiatives',
      mainCount: cmsStats.csrCount,
      subCount: `${cmsStats.publishedCsrCount} Published`,
      icon: HeartHandshake,
      badgeColor: 'bg-purple-50 text-[#7C3AED] border-purple-200',
      href: '/admin/csr',
      meta: 'Community Impact',
    },
    {
      title: 'Awards & Honors',
      mainCount: cmsStats.awardsCount,
      subCount: `${cmsStats.publishedAwardsCount} Published`,
      icon: Trophy,
      badgeColor: 'bg-amber-50 text-[#D97706] border-amber-200',
      href: '/admin/awards',
      meta: 'Industry Accolades',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. Header & Quick Actions */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006B4F] block mb-1">
            Enterprise Management Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#17211E]">
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'KPS Logistics'}
          </h1>
          <p className="text-xs sm:text-sm text-[#66736E] mt-1 font-medium">
            Monitor recruitment pipeline, candidate dossiers, and website CMS content in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E9E5] text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#006B4F] ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/careers/jobs/new"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#005A43] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Job Post</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Recruitment & Pipeline KPIs */}
      {/* ------------------------------------------------------------- */}
      <div>
        <h2 className="text-xs font-bold text-[#66736E] uppercase tracking-wider mb-3">
          Recruitment & Careers Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group bg-white border border-[#E2E9E5] hover:border-[#006B4F]/40 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#66736E] uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] text-[#006B4F] flex items-center justify-center border border-[#006B4F]/20 group-hover:bg-[#006B4F] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-[#17211E] tracking-tight">
                      {loading ? (
                        <span className="inline-block w-14 h-8 bg-slate-100 animate-pulse rounded-lg" />
                      ) : (
                        card.mainCount
                      )}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                      {card.subCount}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E2E9E5]/60 flex items-center justify-between text-xs text-[#66736E]">
                    <span className="text-[11px]">{card.meta}</span>
                    <div className="text-[#006B4F] font-semibold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Manage</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Dynamic CMS Content KPIs */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-[#66736E] uppercase tracking-wider">
            Dynamic Website Content Management (Firestore + R2)
          </h2>
          <span className="text-[11px] font-bold text-[#006B4F] bg-[#EAF5F1] px-2.5 py-0.5 rounded-md border border-[#006B4F]/20">
            Live CMS Active
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cmsCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group bg-white border border-[#E2E9E5] hover:border-[#006B4F]/40 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#17211E] uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] text-[#006B4F] flex items-center justify-center border border-[#006B4F]/20 group-hover:bg-[#006B4F] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-[#17211E] tracking-tight">
                      {loading ? (
                        <span className="inline-block w-14 h-8 bg-slate-100 animate-pulse rounded-lg" />
                      ) : (
                        card.mainCount
                      )}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                      {card.subCount}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E2E9E5]/60 flex items-center justify-between text-xs text-[#66736E]">
                    <span className="text-[11px]">{card.meta}</span>
                    <div className="text-[#006B4F] font-semibold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Edit CMS</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Recent Activity Lists (2 Columns) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Recent Applications */}
        <div className="bg-white border border-[#E2E9E5] rounded-2xl p-5 flex flex-col shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E9E5]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EAF5F1] text-[#006B4F] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#17211E]">Recent Candidate Applications</h2>
            </div>
            <Link
              href="/admin/careers/applications"
              className="text-xs font-semibold text-[#006B4F] hover:text-[#005A43] flex items-center space-x-0.5"
            >
              <span>View Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-2.5">
            {loading ? (
              <div className="space-y-2.5 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentApplications && recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/careers/applications/view?id=${app.id}`}
                  className="block p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] hover:border-[#006B4F]/40 hover:bg-white transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17211E] truncate">{app.candidateName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        app.status === 'New'
                          ? 'bg-[#EAF5F1] text-[#006B4F] border border-[#006B4F]/30'
                          : app.status === 'Selected'
                          ? 'bg-[#004D3A]/10 text-[#004D3A] border border-[#004D3A]/20'
                          : 'bg-slate-100 text-[#66736E] border border-slate-200'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66736E] truncate mt-0.5 font-medium">
                    {app.jobTitle} • {app.email}
                  </p>
                  <span className="text-[10px] text-[#66736E]/70 mt-1 block">
                    {app.appliedAt?.toDate
                      ? app.appliedAt.toDate().toLocaleDateString()
                      : new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#66736E]">
                <Users className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                <p className="font-semibold text-[#17211E]">No candidate applications yet</p>
                <p className="text-[11px] text-[#66736E] mt-0.5">
                  Applications submitted through the careers portal will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Recent Job Postings */}
        <div className="bg-white border border-[#E2E9E5] rounded-2xl p-5 flex flex-col shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E9E5]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EAF5F1] text-[#006B4F] flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#17211E]">Active Job Positions</h2>
            </div>
            <Link
              href="/admin/careers/jobs"
              className="text-xs font-semibold text-[#006B4F] hover:text-[#005A43] flex items-center space-x-0.5"
            >
              <span>Manage All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-2.5">
            {loading ? (
              <div className="space-y-2.5 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentJobs && recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/admin/careers/jobs/edit?id=${job.id}`}
                  className="block p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] hover:border-[#006B4F]/40 hover:bg-white transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17211E] truncate">{job.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        job.status === 'published'
                          ? 'bg-[#EAF5F1] text-[#006B4F] border border-[#006B4F]/30'
                          : 'bg-amber-50 text-[#D97706] border border-amber-200'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66736E] truncate mt-0.5 font-medium">
                    {job.department} • {job.location} • {job.applicationCount ?? 0} Applications
                  </p>
                  <span className="text-[10px] text-[#006B4F] mt-1 font-mono block">
                    /career/{job.slug}
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#66736E]">
                <Briefcase className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                <p className="font-semibold text-[#17211E]">No job positions posted yet</p>
                <p className="text-[11px] text-[#66736E] mt-0.5">
                  Click "+ Add Job Post" to publish new positions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
