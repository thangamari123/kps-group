'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsCms } from '@/lib/careers-firestore';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/admin/Toast';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { JobItem, JobStatus } from '@/lib/careers-types';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  ChevronRight,
  RefreshCw,
  Users,
  Archive,
  Sparkles,
} from 'lucide-react';

export default function AdminJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobsCms.getAll(
        statusFilter !== 'all' ? statusFilter : undefined,
        departmentFilter !== 'all' ? departmentFilter : undefined,
        search.trim() || undefined
      );
      setJobs(data || []);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load jobs list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchJobs();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [statusFilter, departmentFilter, authLoading, user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authLoading && user) {
      fetchJobs();
    }
  };

  const handleToggleStatus = async (job: JobItem, nextStatus: JobStatus) => {
    try {
      await jobsCms.update(job.id, { status: nextStatus });
      toastSuccess(`Job "${job.title}" status updated to ${nextStatus}.`);
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
      await jobsCms.delete(jobToDelete.id);
      toastSuccess(`Job "${jobToDelete.title}" permanently deleted from Cloud Firestore.`);
      setDeleteModalOpen(false);
      setJobToDelete(null);
      await fetchJobs();
    } catch (err: any) {
      console.error('Failed to delete job from Firestore:', err);
      toastError(err?.message || 'Failed to delete job from Cloud Firestore.');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmArchive = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await jobsCms.archive(jobToDelete.id);
      toastSuccess(`Job "${jobToDelete.title}" archived successfully.`);
      setDeleteModalOpen(false);
      setJobToDelete(null);
      await fetchJobs();
    } catch (err: any) {
      console.error('Failed to archive job in Firestore:', err);
      toastError(err?.message || 'Failed to archive job.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#66736E] mb-1">
            <Link href="/admin" className="hover:text-[#006B4F]">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Careers</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#006B4F] font-bold">Job Posts</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211E] tracking-tight">Career Job Postings</h1>
          <p className="text-xs text-[#66736E] mt-0.5">
            Create, manage, publish, and monitor recruitment job openings on the corporate website.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchJobs}
            className="p-2.5 rounded-xl bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] transition-colors cursor-pointer shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 text-[#006B4F] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/careers/jobs/new"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#004D3A] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create Job Post</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, or department..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
          />
        </form>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>

          {/* Department Filter */}
          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
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
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
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
            <tbody className="divide-y divide-[#E2E9E5]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#66736E]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Loading job postings from Firestore...</span>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#66736E]">
                    <Briefcase className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                    <p className="font-semibold text-[#17211E]">No job postings found</p>
                    <p className="text-[11px] mt-1">
                      {search || statusFilter !== 'all'
                        ? 'Try adjusting your filters.'
                        : 'Click "Create Job Post" to post your first position.'}
                    </p>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F7F9F8] transition-colors">
                    {/* Job Title & Slug */}
                    <td className="px-5 py-4">
                      <div>
                        <Link
                          href={`/admin/careers/jobs/edit?id=${job.id}`}
                          className="font-bold text-[#17211E] text-sm hover:text-[#006B4F] block leading-tight"
                        >
                          {job.title}
                        </Link>
                        <span className="text-[11px] text-[#66736E] font-mono">/career/{job.slug}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-4 text-[#17211E] font-medium">
                      {job.department || '—'}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-[#66736E]">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#006B4F] shrink-0" />
                        <span className="truncate max-w-[140px] text-[#17211E] font-medium">{job.location}</span>
                      </div>
                    </td>

                    {/* Employment Type & Exp */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-[#17211E] block">{job.employmentType}</span>
                      <span className="text-[11px] text-[#66736E]">{job.experience || 'Any Exp'}</span>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="px-4 py-4">
                      <select
                        value={job.status}
                        onChange={(e) => handleToggleStatus(job, e.target.value as JobStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          job.status === 'published'
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30'
                            : job.status === 'draft'
                            ? 'bg-amber-50 text-[#D97706] border-amber-200'
                            : job.status === 'closed'
                            ? 'bg-red-50 text-[#DC2626] border-red-200'
                            : 'bg-slate-100 text-[#66736E] border-slate-200'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    {/* Applications Count */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/careers/applications?job_id=${job.id}`}
                        className="inline-flex items-center space-x-1 text-[#17211E] hover:text-[#006B4F] font-semibold"
                        title="View applications for this position"
                      >
                        <Users className="w-3.5 h-3.5 text-[#66736E]" />
                        <span className="font-bold">{job.applicationCount ?? 0}</span>
                        {job.newApplicationCount && job.newApplicationCount > 0 ? (
                          <span className="ml-1 text-[10px] bg-blue-50 text-[#2563EB] px-1.5 py-0.5 rounded-full border border-blue-200 font-bold">
                            {job.newApplicationCount} new
                          </span>
                        ) : null}
                      </Link>
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-4 text-[#66736E]">
                      {job.deadline ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-[#66736E]" />
                          <span>{job.deadline}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-medium">Open</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Applications Action */}
                        <Link
                          href={`/admin/careers/applications?job_id=${job.id}`}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#006B4F] bg-[#EAF5F1] hover:bg-[#006B4F] hover:text-white transition-colors"
                          title="View Applications"
                        >
                          Applications ({job.applicationCount ?? 0})
                        </Link>

                        {/* Public Link */}
                        {job.status === 'published' && (
                          <Link
                            href={`/career/view?slug=${encodeURIComponent(job.slug || job.id)}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors"
                            title="View on public site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Edit Button */}
                        <Link
                          href={`/admin/careers/jobs/edit?id=${job.id}`}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors"
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
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Delete / Archive Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={
          jobToDelete && jobToDelete.applicationCount && jobToDelete.applicationCount > 0
            ? 'Delete Job with Linked Applications?'
            : 'Delete Job Posting Permanently?'
        }
        message={
          jobToDelete ? (
            <div className="space-y-2.5">
              <p>
                Are you sure you want to permanently delete the job listing{' '}
                <strong className="text-[#17211E]">"{jobToDelete.title}"</strong> (Document ID:{' '}
                <span className="font-mono text-[#006B4F]">{jobToDelete.id}</span>) from Cloud Firestore?
              </p>
              {jobToDelete.applicationCount && jobToDelete.applicationCount > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <p className="font-bold flex items-center space-x-1 mb-1">
                    <span>⚠️ {jobToDelete.applicationCount} Candidate Application(s) Linked</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Candidate records and submitted resumes in Cloudflare R2 will remain safely preserved. However, to preserve role metadata, we recommend{' '}
                    <strong>archiving</strong> the position instead of permanently deleting it.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-[#66736E]">
                  This operation executes a Firestore <code className="text-[#006B4F]">deleteDoc()</code> and removes the document permanently from the <code className="text-[#006B4F]">jobs</code> collection.
                </p>
              )}
            </div>
          ) : (
            ''
          )
        }
        confirmLabel="Permanently Delete"
        secondaryActionLabel={
          jobToDelete && jobToDelete.applicationCount && jobToDelete.applicationCount > 0
            ? 'Archive Position (Recommended)'
            : undefined
        }
        loading={deleting}
        onClose={() => {
          setDeleteModalOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        onSecondaryAction={handleConfirmArchive}
      />
    </div>
  );
}
