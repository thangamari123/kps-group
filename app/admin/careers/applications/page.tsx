'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { applicationsApi, jobsApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import {
  Users,
  Search,
  Filter,
  FileText,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Eye,
  RefreshCw,
  Download,
} from 'lucide-react';

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('job_id') || 'all';

  const { success: toastSuccess, error: toastError } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState(initialJobId);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationsApi.getAdminApplications({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        job_id: jobFilter !== 'all' ? jobFilter : undefined,
      });
      setApplications(data || []);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load jobs for filter dropdown
    jobsApi.getAdminJobs().then((data) => setJobs(data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, jobFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleStatusChange = async (appId: string, nextStatus: string) => {
    try {
      await applicationsApi.updateStatus(appId, nextStatus);
      toastSuccess(`Status updated to "${nextStatus}".`);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: nextStatus } : a))
      );
    } catch (err: any) {
      toastError(err?.message || 'Failed to update application status.');
    }
  };

  const statusColors: Record<string, string> = {
    New: 'bg-blue-950 text-blue-300 border-blue-700',
    'Under Review': 'bg-amber-950 text-amber-300 border-amber-700',
    Shortlisted: 'bg-purple-950 text-purple-300 border-purple-700',
    Interview: 'bg-indigo-950 text-indigo-300 border-indigo-700',
    Selected: 'bg-emerald-950 text-emerald-300 border-emerald-700',
    Rejected: 'bg-red-950 text-red-300 border-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200">Careers</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400">Applications</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Job Applications Pipeline</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review candidate dossiers, inspect PDF resumes stored in R2, and update recruitment status.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </form>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Job Filter */}
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 max-w-[200px] truncate"
          >
            <option value="all">All Job Positions</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4">Applicant</th>
                <th className="px-4 py-4">Position</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Applied Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Resume</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-400">No applications found.</p>
                    <p className="text-[11px] mt-1">
                      {search || statusFilter !== 'all' || jobFilter !== 'all'
                        ? 'Try clearing your search or filters.'
                        : 'Submissions from the public career portal will appear here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Applicant Name & Experience */}
                    <td className="px-5 py-4">
                      <div>
                        <Link
                          href={`/admin/careers/applications/${app.id}`}
                          className="font-bold text-white text-sm hover:text-emerald-400 block"
                        >
                          {app.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {app.location ? `${app.location} • ` : ''}
                          {app.experience || 'Experience not specified'}
                        </span>
                      </div>
                    </td>

                    {/* Job Position */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-200 block truncate max-w-[180px]">
                        {app.job_title || 'General Application'}
                      </span>
                      {app.current_company && (
                        <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                          Curr: {app.current_company}
                        </span>
                      )}
                    </td>

                    {/* Email & Phone */}
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <a href={`mailto:${app.email}`} className="hover:text-emerald-400 truncate max-w-[160px]">
                            {app.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <a href={`tel:${app.phone}`} className="hover:text-emerald-400">
                            {app.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="px-4 py-4 text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          statusColors[app.status] || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Secure Resume View / Download */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <a
                          href={applicationsApi.getResumeUrl(app.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 text-slate-300 border border-slate-700 transition-colors font-semibold text-[11px]"
                          title="Stream authenticated PDF from R2"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View PDF</span>
                        </a>

                        <a
                          href={applicationsApi.getResumeUrl(app.id, true)}
                          download
                          className="p-1 text-slate-400 hover:text-white"
                          title="Download Resume"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    {/* View Details Action */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/careers/applications/${app.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
