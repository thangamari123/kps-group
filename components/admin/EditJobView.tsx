'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { jobsApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import {
  Briefcase,
  ArrowLeft,
  Save,
  ChevronRight,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

interface EditJobViewProps {
  jobId: string;
}

export default function EditJobView({ jobId }: EditJobViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectiveId = jobId && jobId !== 'edit' ? jobId : searchParams.get('id') || '';
  const { success: toastSuccess, error: toastError } = useToast();

  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    department: '',
    location: '',
    employment_type: 'Full-time',
    experience: '',
    salary: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    deadline: '',
    status: 'draft',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!effectiveId) {
      setLoading(false);
      return;
    }

    const loadJob = async () => {
      try {
        const allJobs = await jobsApi.getAdminJobs();
        const found = allJobs?.find((j: any) => j.id === effectiveId);
        if (found) {
          let resp = found.responsibilities;
          let req = found.requirements;
          let ben = found.benefits;

          try {
            if (typeof resp === 'string' && resp.startsWith('[')) {
              resp = JSON.parse(resp).join('\n');
            }
          } catch {}
          try {
            if (typeof req === 'string' && req.startsWith('[')) {
              req = JSON.parse(req).join('\n');
            }
          } catch {}
          try {
            if (typeof ben === 'string' && ben.startsWith('[')) {
              ben = JSON.parse(ben).join('\n');
            }
          } catch {}

          setFormData({
            ...found,
            responsibilities: resp || '',
            requirements: req || '',
            benefits: ben || '',
          });
        } else {
          toastError('Job not found.');
        }
      } catch (err: any) {
        toastError(err?.message || 'Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [effectiveId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      toastError('Please fill in required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await jobsApi.updateJob(effectiveId, formData);
      toastSuccess('Job posting updated successfully!');
      router.push('/admin/careers/jobs');
    } catch (err: any) {
      toastError(err?.message || 'Failed to update job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await jobsApi.deleteJob(effectiveId);
      toastSuccess('Job posting deleted.');
      router.push('/admin/careers/jobs');
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete job.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading job posting details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Link href="/admin" className="hover:text-emerald-400">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/careers/jobs" className="hover:text-emerald-400">Job Posts</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-400">Edit Position</span>
        </div>

        <div className="flex items-center space-x-3">
          {formData.status === 'published' && formData.slug && (
            <Link
              href={`/career/${formData.slug}`}
              target="_blank"
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-emerald-400"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public</span>
            </Link>
          )}

          <Link
            href="/admin/careers/jobs"
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Edit Job Posting</h1>
            <p className="text-xs text-slate-400 mt-1">ID: {effectiveId}</p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-red-950/50 text-red-400 border border-red-900/50 rounded-xl text-xs font-bold hover:bg-red-900 hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Job Title <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                SEO Slug <span className="text-emerald-400">*</span>
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-700 focus-within:border-emerald-500">
                <span className="inline-flex items-center px-3 bg-slate-950/80 text-slate-500 text-xs font-mono select-none border-r border-slate-700">
                  /career/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 bg-slate-950 text-xs font-mono text-emerald-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Department, Type, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Customs Brokerage">Customs Brokerage</option>
                <option value="Ocean & Air Freight">Ocean & Air Freight</option>
                <option value="Multimodal Transportation">Multimodal Transportation</option>
                <option value="Project Cargo & ODC">Project Cargo & ODC</option>
                <option value="Industrial Warehousing">Industrial Warehousing</option>
                <option value="Operations & CFS">Operations & CFS</option>
                <option value="Sales & Business Development">Sales & Business Development</option>
                <option value="Finance & Administration">Finance & Administration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={formData.employment_type || 'Full-time'}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Publishing Status
              </label>
              <select
                name="status"
                value={formData.status || 'draft'}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold focus:outline-none ${
                  formData.status === 'published'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : formData.status === 'draft'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-slate-950 text-slate-400 border-slate-700'
                }`}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Row 3: Location, Experience, Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Location <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Experience
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline || ''}
              onChange={handleChange}
              className="w-full sm:w-64 px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Job Description <span className="text-emerald-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-y"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Key Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-y font-sans"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Candidate Requirements (one per line)
            </label>
            <textarea
              name="requirements"
              value={formData.requirements || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-y font-sans"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Benefits (one per line)
            </label>
            <textarea
              name="benefits"
              value={formData.benefits || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-y font-sans"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <Link
              href="/admin/careers/jobs"
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Job Listing?"
        message="Are you sure you want to permanently delete this job listing? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
