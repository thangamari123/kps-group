'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import {
  Briefcase,
  Users,
  FileText,
  Mail,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { error: toastError } = useToast();
  const [data, setData] = useState<{
    stats: {
      totalJobs: number;
      activeJobs: number;
      totalApplications: number;
      newApplications: number;
      totalQuotes: number;
      newQuotes: number;
      totalContacts: number;
      newContacts: number;
    };
    recentApplications: any[];
    recentQuotes: any[];
    recentContacts: any[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await dashboardApi.getStats();
      setData(res);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = data?.stats || {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    totalQuotes: 0,
    newQuotes: 0,
    totalContacts: 0,
    newContacts: 0,
  };

  const statCards = [
    {
      title: 'Job Posts',
      mainCount: stats.totalJobs,
      subCount: `${stats.activeJobs} Published`,
      icon: Briefcase,
      color: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      href: '/admin/careers/jobs',
    },
    {
      title: 'Job Applications',
      mainCount: stats.totalApplications,
      subCount: `${stats.newApplications} New`,
      icon: Users,
      color: 'from-blue-500/20 to-blue-700/10 border-blue-500/30 text-blue-400',
      badgeColor: stats.newApplications > 0 ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse' : 'bg-slate-800 text-slate-400',
      href: '/admin/careers/applications',
    },
    {
      title: 'Quote Requests',
      mainCount: stats.totalQuotes,
      subCount: `${stats.newQuotes} New Requests`,
      icon: FileText,
      color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-400',
      badgeColor: stats.newQuotes > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' : 'bg-slate-800 text-slate-400',
      href: '/admin/enquiries/quotes',
    },
    {
      title: 'Contact Messages',
      mainCount: stats.totalContacts,
      subCount: `${stats.newContacts} Unread`,
      icon: Mail,
      color: 'from-purple-500/20 to-purple-700/10 border-purple-500/30 text-purple-400',
      badgeColor: stats.newContacts > 0 ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-400',
      href: '/admin/enquiries/contacts',
    },
  ];

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. Header & Quick Actions */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live D1 Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">Management Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time operations, career applicant pipeline, and inbound customer enquiries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/careers/jobs/new"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md shadow-emerald-950/40 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. 8 KPI Metric Cards */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                  {card.subCount}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-slate-800 animate-pulse rounded-lg" />
                    ) : (
                      card.mainCount
                    )}
                  </span>
                  <div className="text-slate-500 group-hover:text-emerald-400 transition-colors flex items-center text-xs font-medium">
                    <span>Manage</span>
                    <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Recent Activity Lists (3 Columns on Large Screens) */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Recent Applications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white">Recent Applications</h2>
            </div>
            <Link
              href="/admin/careers/applications"
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
            >
              View All
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="space-y-2 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : data?.recentApplications && data.recentApplications.length > 0 ? (
              data.recentApplications.map((app: any) => (
                <Link
                  key={app.id}
                  href={`/admin/careers/applications/${app.id}`}
                  className="block p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate">{app.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        app.status === 'New'
                          ? 'bg-blue-500/20 text-blue-400'
                          : app.status === 'Selected'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{app.job_title || 'General Application'}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(app.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">No applications received yet.</div>
            )}
          </div>
        </div>

        {/* Column 2: Recent Quote Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Recent Quote Requests</h2>
            </div>
            <Link
              href="/admin/enquiries/quotes"
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
            >
              View All
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="space-y-2 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : data?.recentQuotes && data.recentQuotes.length > 0 ? (
              data.recentQuotes.map((q: any) => (
                <Link
                  key={q.id}
                  href={`/admin/enquiries/quotes`}
                  className="block p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate">{q.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        q.status === 'New'
                          ? 'bg-amber-500/20 text-amber-400'
                          : q.status === 'Quoted'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {q.origin} → {q.destination} ({q.service})
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(q.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">No quote requests recorded yet.</div>
            )}
          </div>
        </div>

        {/* Column 3: Recent Contact Messages */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white">Recent Messages</h2>
            </div>
            <Link
              href="/admin/enquiries/contacts"
              className="text-[11px] font-semibold text-purple-400 hover:text-purple-300"
            >
              View All
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="space-y-2 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : data?.recentContacts && data.recentContacts.length > 0 ? (
              data.recentContacts.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/admin/enquiries/contacts`}
                  className="block p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 truncate">{c.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        c.status === 'New'
                          ? 'bg-purple-500/20 text-purple-400'
                          : c.status === 'Replied'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">No contact messages received yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
