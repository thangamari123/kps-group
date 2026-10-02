'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export default function AdminJobsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsApi.getAdminJobs({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
      });
      setJobs(data || []);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load jobs list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, departmentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleToggleStatus = async (job: any, nextStatus: string) => {
    try {
      await jobsApi.updateJob(job.id, { status: nextStatus });
      toastSuccess(`Job "${job.title}" updated to ${nextStatus}.`);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
      );
    } catch (err: any) {
      toastError(err?.message || 'Failed to update job status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await jobsApi.deleteJob(jobToDelete.id);
      toastSuccess(`Job "${jobToDelete.title}" deleted.`);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete job.');
    } finally {
      setDeleting(false);
    }
  };

  const departments = Array.from(
    new Set(jobs.map((j) => j.department).filter(Boolean))
  );

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
            <span className="text-emerald-400">Job Posts</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Career Job Postings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, publish, or archive career opportunities on the public portal.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchJobs}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <Link
            href="/admin/careers/jobs/new"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job Post</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, or department..."
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>

          {/* Department Filter */}
          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4">Job Title</th>
                <th className="px-4 py-4">Department</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Type / Exp</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Applications</th>
                <th className="px-4 py-4">Deadline</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading job postings...</span>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-400">No job postings found.</p>
                    <p className="text-[11px] mt-1">
                      {search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Click "Create Job Post" to post your first position.'}
                    </p>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Job Title & Slug */}
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-bold text-white text-sm block leading-tight">{job.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono">/career/{job.slug}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-4 text-slate-300 font-medium">
                      {job.department || '—'}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[140px]">{job.location}</span>
                      </div>
                    </td>

                    {/* Employment Type & Exp */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-200 block">{job.employment_type}</span>
                      <span className="text-[11px] text-slate-500">{job.experience || 'Any Exp'}</span>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="px-4 py-4">
                      <select
                        value={job.status}
                        onChange={(e) => handleToggleStatus(job, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          job.status === 'published'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                            : job.status === 'draft'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700/80'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    {/* Applications Count */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/careers/applications?job_id=${job.id}`}
                        className="inline-flex items-center space-x-1 text-slate-300 hover:text-emerald-400 font-semibold"
                      >
                        <span>{job.application_count ?? 0}</span>
                        {job.new_application_count > 0 && (
                          <span className="ml-1 text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded-full border border-blue-500/30">
                            {job.new_application_count} new
                          </span>
                        )}
                      </Link>
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-4 text-slate-400">
                      {job.deadline ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{job.deadline}</span>
                        </div>
                      ) : (
                        'Open'
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Public Link */}
                        {job.status === 'published' && (
                          <Link
                            href={`/career/${job.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                            title="View on public site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Edit Button */}
                        <Link
                          href={`/admin/careers/jobs/${job.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setJobToDelete(job);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Job Posting?"
        message={`Are you sure you want to permanently delete the job listing "${jobToDelete?.title}"? Applications linked to this position will be preserved.`}
        confirmLabel="Delete Job"
        loading={deleting}
        onClose={() => {
          setDeleteModalOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
