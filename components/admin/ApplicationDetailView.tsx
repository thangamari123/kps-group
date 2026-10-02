'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { applicationsApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import {
  Users,
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface ApplicationDetailViewProps {
  appId: string;
}

export default function ApplicationDetailView({ appId }: ApplicationDetailViewProps) {
  const searchParams = useSearchParams();
  const effectiveId = appId && appId !== 'view' ? appId : searchParams.get('id') || '';
  const { success: toastSuccess, error: toastError } = useToast();

  const [app, setApp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!effectiveId) {
      setLoading(false);
      return;
    }

    const loadApp = async () => {
      try {
        const data = await applicationsApi.getAdminApplicationById(effectiveId);
        setApp(data);
      } catch (err: any) {
        toastError(err?.message || 'Failed to load application details.');
      } finally {
        setLoading(false);
      }
    };

    loadApp();
  }, [effectiveId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!app) return;
    setUpdating(true);
    try {
      await applicationsApi.updateStatus(app.id, newStatus);
      toastSuccess(`Application marked as "${newStatus}".`);
      setApp((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions = ['New', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading candidate dossier...</span>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">
        <p className="text-slate-400 text-sm">Application record not found.</p>
        <Link
          href="/admin/careers/applications"
          className="mt-4 inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Link href="/admin" className="hover:text-emerald-400">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/careers/applications" className="hover:text-emerald-400">Applications</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-400">{app.name}</span>
        </div>

        <Link
          href="/admin/careers/applications"
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pipeline</span>
        </Link>
      </div>

      {/* Main Candidate Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
        {/* Header Strip with Name & Status Updater */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Candidate Dossier
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">{app.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Applied for{' '}
              <span className="text-slate-200 font-semibold">{app.job_title || 'General Position'}</span> on{' '}
              {new Date(app.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Stage:</span>
            <select
              value={app.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 text-emerald-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Contact & Professional Details */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Candidate Information
            </h2>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Email Address</span>
                  <a href={`mailto:${app.email}`} className="text-xs text-white hover:text-emerald-400 font-semibold">
                    {app.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Phone Number</span>
                  <a href={`tel:${app.phone}`} className="text-xs text-white hover:text-emerald-400 font-semibold">
                    {app.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Location</span>
                  <span className="text-xs text-slate-200 font-medium">{app.location || 'Not provided'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Relevant Experience</span>
                  <span className="text-xs text-slate-200 font-medium">{app.experience || 'Not specified'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Current / Previous Company</span>
                  <span className="text-xs text-slate-200 font-medium">{app.current_company || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Secure R2 Resume PDF Box */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Candidate Resume (Cloudflare R2)
            </h2>

            <div className="bg-gradient-to-br from-slate-950 to-emerald-950/20 border border-emerald-500/20 rounded-xl p-6 flex flex-col justify-between space-y-5">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{app.resume_name || 'Resume.pdf'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {(app.resume_size / (1024 * 1024)).toFixed(2)} MB • Secure R2 Storage
                  </p>
                  <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Protected by Cloudflare Session Auth</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={applicationsApi.getResumeUrl(app.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Resume PDF</span>
                </a>

                <a
                  href={applicationsApi.getResumeUrl(app.id, true)}
                  download
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter Section */}
        {app.cover_letter && (
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Candidate Cover Letter / Note
            </h2>
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {app.cover_letter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
