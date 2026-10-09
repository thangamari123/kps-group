'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { applicationsCms, jobsCms } from '@/lib/careers-firestore';
import { resumeApi } from '@/lib/resume-api';
import { useToast } from '@/components/admin/Toast';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { CandidateApplication, ApplicationPipelineStats, ApplicationStatus, JobItem } from '@/lib/careers-types';
import {
  Users,
  Search,
  FileText,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Eye,
  RefreshCw,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  Award,
  XCircle,
  Briefcase,
  ShieldCheck,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const queryJobId = searchParams.get('jobId') || searchParams.get('job_id') || 'all';

  const { success: toastSuccess, error: toastError } = useToast();

  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [stats, setStats] = useState<ApplicationPipelineStats>({
    total: 0,
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    withdrawn: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState(queryJobId);
  const [dateRange, setDateRange] = useState('all');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<CandidateApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load jobs list for filtering
  useEffect(() => {
    jobsCms.getAll().then((data) => setJobs(data || [])).catch(() => {});
  }, []);

  // Sync query param changes
  useEffect(() => {
    if (queryJobId) {
      setJobFilter(queryJobId);
    }
  }, [queryJobId]);

  // Load applications and summary pipeline metrics
  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, statsData] = await Promise.all([
        applicationsCms.getAll(jobFilter, statusFilter, search, dateRange),
        applicationsCms.getStats(),
      ]);
      setApplications(appsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading applications:', err);
      toastError(err?.message || 'Failed to load candidate applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, jobFilter, dateRange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (appId: string, nextStatus: ApplicationStatus) => {
    try {
      await applicationsCms.updateStatus(appId, nextStatus);
      toastSuccess(`Application status updated to "${nextStatus}".`);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: nextStatus } : a))
      );
      // Refresh stats
      applicationsCms.getStats().then(setStats).catch(() => {});
    } catch (err: any) {
      toastError(err?.message || 'Failed to update application status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    setDeleting(true);
    try {
      // 1. Delete resume file from R2
      if (appToDelete.resumeR2Key) {
        await resumeApi.deleteResume(appToDelete.resumeR2Key);
      }
      // 2. Delete Firestore document
      await applicationsCms.delete(appToDelete.id);

      toastSuccess(`Application for ${appToDelete.candidateName} deleted.`);
      setApplications((prev) => prev.filter((a) => a.id !== appToDelete.id));
      setDeleteModalOpen(false);
      setAppToDelete(null);
      // Refresh stats
      applicationsCms.getStats().then(setStats).catch(() => {});
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    New: { bg: 'bg-[#EAF5F1]', text: 'text-[#006B4F]', border: 'border-[#006B4F]/30' },
    Reviewing: { bg: 'bg-blue-50', text: 'text-[#2563EB]', border: 'border-blue-200' },
    Shortlisted: { bg: 'bg-emerald-50', text: 'text-[#059669]', border: 'border-emerald-200' },
    Interview: { bg: 'bg-purple-50', text: 'text-[#7C3AED]', border: 'border-purple-200' },
    Selected: { bg: 'bg-[#004D3A]/10', text: 'text-[#004D3A]', border: 'border-[#004D3A]/30' },
    Rejected: { bg: 'bg-red-50', text: 'text-[#DC2626]', border: 'border-red-200' },
    Withdrawn: { bg: 'bg-slate-100', text: 'text-[#66736E]', border: 'border-slate-200' },
  };

  // Find active job if filtered by jobId
  const activeJob = useMemo(() => {
    if (jobFilter === 'all') return null;
    return jobs.find((j) => j.id === jobFilter);
  }, [jobFilter, jobs]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#66736E] mb-1">
            <Link href="/admin" className="hover:text-[#006B4F]">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Careers</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#006B4F] font-bold">Applications</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211E] tracking-tight">Candidate Applications</h1>
          <p className="text-xs text-[#66736E] mt-0.5">
            Review and manage candidates who applied for KPS Worldwide Logistics career opportunities.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <Link
            href="/admin/careers/jobs"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E9E5] text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors shadow-2xs"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#006B4F]" />
            <span>Manage Jobs</span>
          </Link>

          <button
            onClick={loadData}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#006B4F] text-white text-xs font-bold hover:bg-[#005A43] shadow-sm shadow-[#006B4F]/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Selected Job Banner (if filtered) */}
      {activeJob && (
        <div className="bg-[#EAF5F1] border border-[#006B4F]/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#006B4F]/20 flex items-center justify-center text-[#006B4F] font-bold shrink-0 shadow-2xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-[#006B4F] uppercase tracking-wider">Filtered by Job:</span>
                <span className="text-sm font-bold text-[#17211E]">{activeJob.title}</span>
              </div>
              <p className="text-xs text-[#66736E] mt-0.5">
                {activeJob.department} • {activeJob.location} • {applications.length} Candidates
              </p>
            </div>
          </div>

          <button
            onClick={() => setJobFilter('all')}
            className="text-xs font-bold text-[#006B4F] hover:underline px-3 py-1.5 bg-white rounded-lg border border-[#006B4F]/20 cursor-pointer"
          >
            Show All Jobs
          </button>
        </div>
      )}

      {/* Pipeline Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'all'
              ? 'bg-[#006B4F] text-white border-[#006B4F]'
              : 'bg-white border-[#E2E9E5] hover:border-[#006B4F]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'all' ? 'text-white/80' : 'text-[#66736E]'}`}>
              Total
            </span>
            <Users className={`w-4 h-4 ${statusFilter === 'all' ? 'text-white' : 'text-[#006B4F]'}`} />
          </div>
          <div className="text-2xl font-black">{stats.total}</div>
          <span className={`text-[10px] block mt-0.5 ${statusFilter === 'all' ? 'text-white/70' : 'text-[#66736E]'}`}>
            All applications
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('New')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'New'
              ? 'bg-[#006B4F] text-white border-[#006B4F]'
              : 'bg-white border-[#E2E9E5] hover:border-[#006B4F]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'New' ? 'text-white/80' : 'text-[#66736E]'}`}>
              New
            </span>
            <Clock className={`w-4 h-4 ${statusFilter === 'New' ? 'text-white' : 'text-[#006B4F]'}`} />
          </div>
          <div className="text-2xl font-black text-[#006B4F]">{stats.new}</div>
          <span className={`text-[10px] block mt-0.5 ${statusFilter === 'New' ? 'text-white/70' : 'text-[#66736E]'}`}>
            Needs screening
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('Reviewing')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'Reviewing'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white border-[#E2E9E5] hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Reviewing' ? 'text-white/80' : 'text-[#66736E]'}`}>
              Reviewing
            </span>
            <Eye className={`w-4 h-4 ${statusFilter === 'Reviewing' ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <div className="text-2xl font-black text-blue-600">{stats.reviewing}</div>
          <span className={`text-[10px] block mt-0.5 ${statusFilter === 'Reviewing' ? 'text-white/70' : 'text-[#66736E]'}`}>
            Under evaluation
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('Shortlisted')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'Shortlisted'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white border-[#E2E9E5] hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Shortlisted' ? 'text-white/80' : 'text-[#66736E]'}`}>
              Shortlisted
            </span>
            <UserCheck className={`w-4 h-4 ${statusFilter === 'Shortlisted' ? 'text-white' : 'text-emerald-600'}`} />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.shortlisted}</div>
          <span className={`text-[10px] block mt-0.5 ${statusFilter === 'Shortlisted' ? 'text-white/70' : 'text-[#66736E]'}`}>
            Passed review
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('Interview')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'Interview'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white border-[#E2E9E5] hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Interview' ? 'text-white/80' : 'text-[#66736E]'}`}>
              Interview
            </span>
            <Users className={`w-4 h-4 ${statusFilter === 'Interview' ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <div className="text-2xl font-black text-purple-600">{stats.interview}</div>
          <span className={`text-[10px] block mt-0.5 ${statusFilter === 'Interview' ? 'text-white/70' : 'text-[#66736E]'}`}>
            Rounds active
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('Selected')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
            statusFilter === 'Selected'
              ? 'bg-[#004D3A] text-white border-[#004D3A]'
              : 'bg-white border-[#E2E9E5] hover:border-[#004D3A]/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Selected' ? 'text-white/80' : 'text-[#66736E]'}`}>
              Selected
            </span>
            <Award className={`w-4 h-4 ${statusFilter === 'Selected' ? 'text-white' : 'text-[#004D3A]'}`} />
          </div>
          <div className="text-2xl font-black text-[#004D3A]">{stats.selected}</div>
          <span className={`text-[10px] block mt-0.5 ${statusFilter === 'Selected' ? 'text-white/70' : 'text-[#66736E]'}`}>
            Offer extended
          </span>
        </div>
      </div>

      {/* Search & Comprehensive Filter Bar */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate, email, phone or job..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Job Filter */}
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-semibold text-[#17211E] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#006B4F] max-w-[220px] truncate cursor-pointer"
          >
            <option value="all">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.applicationCount ?? 0})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-semibold text-[#17211E] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-semibold text-[#17211E] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4">Candidate Name</th>
                <th className="px-4 py-4">Job Applied</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Experience & Location</th>
                <th className="px-4 py-4">Applied Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Resume</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E5]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-[#66736E]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-7 h-7 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                      <span className="font-semibold text-xs">Loading candidate applications from Firestore...</span>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-[#66736E]">
                    <Users className="w-10 h-10 text-[#66736E]/40 mx-auto mb-2" />
                    <p className="font-bold text-[#17211E] text-sm">No applications found</p>
                    <p className="text-xs mt-1 text-[#66736E]">
                      {search || statusFilter !== 'all' || jobFilter !== 'all' || dateRange !== 'all'
                        ? 'Try adjusting your search criteria or resetting filters.'
                        : 'Applications submitted via the public career portal will appear here in real-time.'}
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const appliedDateStr = app.appliedAt?.toDate
                    ? app.appliedAt.toDate().toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : new Date(app.appliedAt).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      });

                  const style = statusStyles[app.status] || {
                    bg: 'bg-slate-100',
                    text: 'text-[#66736E]',
                    border: 'border-slate-200',
                  };

                  return (
                    <tr key={app.id} className="hover:bg-[#F7F9F8] transition-colors">
                      {/* Candidate Name */}
                      <td className="px-5 py-4">
                        <div>
                          <Link
                            href={`/admin/careers/applications/view?id=${app.id}`}
                            className="font-bold text-[#17211E] text-sm hover:text-[#006B4F] transition-colors block"
                          >
                            {app.candidateName}
                          </Link>
                          {app.currentJobTitle && (
                            <span className="text-[11px] text-[#66736E] block truncate max-w-[170px]">
                              {app.currentJobTitle}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Job Applied */}
                      <td className="px-4 py-4">
                        <span className="font-bold text-[#17211E] block truncate max-w-[180px]">
                          {app.jobTitle}
                        </span>
                        {app.currentCompany && (
                          <span className="text-[11px] text-[#66736E] block truncate max-w-[180px]">
                            {app.currentCompany}
                          </span>
                        )}
                      </td>

                      {/* Email & Phone */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-[#17211E]">
                            <Mail className="w-3.5 h-3.5 text-[#006B4F] shrink-0" />
                            <a
                              href={`mailto:${app.email}`}
                              className="hover:text-[#006B4F] truncate max-w-[160px] font-semibold text-xs"
                            >
                              {app.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[#66736E]">
                            <Phone className="w-3.5 h-3.5 text-[#66736E] shrink-0" />
                            <a href={`tel:${app.phone}`} className="hover:text-[#006B4F] text-xs">
                              {app.phone}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Experience & Location */}
                      <td className="px-4 py-4 text-[#66736E]">
                        <div>
                          <span className="font-semibold text-[#17211E] block">
                            {app.experience || 'Not specified'}
                          </span>
                          <span className="text-[11px]">
                            {[app.city, app.state || app.location].filter(Boolean).join(', ') || 'Location N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="px-4 py-4 text-[#66736E]">
                        <div className="flex items-center space-x-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#66736E]" />
                          <span>{appliedDateStr}</span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${style.bg} ${style.text} ${style.border}`}
                        >
                          <option value="New">New</option>
                          <option value="Reviewing">Reviewing</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </select>
                      </td>

                      {/* Resume View / Download */}
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await resumeApi.viewOrDownloadResume(
                                  app.id,
                                  app.resumeR2Key,
                                  app.resumeFileName || 'Resume.pdf',
                                  true
                                );
                              } catch (err: any) {
                                toastError(err?.message || 'Failed to open resume.');
                              }
                            }}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#EAF5F1] hover:bg-[#D5EDE5] text-[#006B4F] border border-[#006B4F]/20 transition-colors font-bold text-[11px] cursor-pointer"
                            title="View candidate resume securely from R2"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#006B4F]" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await resumeApi.viewOrDownloadResume(
                                  app.id,
                                  app.resumeR2Key,
                                  app.resumeFileName || 'Resume.pdf',
                                  false
                                );
                                toastSuccess('Resume downloaded successfully.');
                              } catch (err: any) {
                                toastError(err?.message || 'Failed to download resume.');
                              }
                            }}
                            className="p-1.5 text-[#66736E] hover:text-[#006B4F] rounded-lg hover:bg-white border border-transparent hover:border-[#E2E9E5] transition-colors cursor-pointer"
                            title="Download Resume"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/careers/applications/view?id=${app.id}`}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F7F9F8] text-[#17211E] border border-[#E2E9E5] font-semibold text-xs transition-colors shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#006B4F]" />
                            <span>View</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setAppToDelete(app);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-[#66736E] hover:text-[#DC2626] rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete candidate application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Candidate Application?"
        message={`This will permanently remove the application record for ${appToDelete?.candidateName || 'Candidate'} (${appToDelete?.jobTitle || ''}). The associated resume file in Cloudflare R2 will also be removed.`}
        confirmLabel="Delete Application"
        loading={deleting}
        onClose={() => {
          setDeleteModalOpen(false);
          setAppToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default function AdminApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#66736E] text-xs">
          <div className="w-8 h-8 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold">Loading Candidate Applications...</span>
        </div>
      }
    >
      <ApplicationsContent />
    </Suspense>
  );
}
