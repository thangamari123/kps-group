'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import NewJobView from '@/components/admin/NewJobView';
import { jobsCms } from '@/lib/careers-firestore';
import { useToast } from '@/components/admin/Toast';
import {
  Briefcase,
  ArrowLeft,
  Save,
  ChevronRight,
  Trash2,
  ExternalLink,
  Sparkles,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  ListOrdered,
  Users,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { JobItem } from '@/lib/careers-types';

interface EditJobViewProps {
  jobId: string;
}

export default function EditJobView({ jobId }: EditJobViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // If this view is accidentally rendered on /new (e.g. from a wildcard proxy), render NewJobView directly
  const normalizedPath = pathname ? pathname.replace(/\/+$/, '') : '';
  const isCreateRoute = jobId === 'new' || normalizedPath.endsWith('/admin/careers/jobs/new');
  if (isCreateRoute) {
    return <NewJobView />;
  }

  // Extract ID from pathname if accessed as /admin/careers/jobs/[id] (excluding static segments)
  let pathJobId = '';
  if (pathname) {
    const parts = pathname.split('?')[0].split('/').filter(Boolean);
    if (parts.length >= 4 && parts[0] === 'admin' && parts[1] === 'careers' && parts[2] === 'jobs') {
      const seg = parts[3];
      if (seg !== 'edit' && seg !== 'new' && seg !== 'default') {
        pathJobId = seg;
      }
    }
  }

  const effectiveId = jobId && jobId !== 'edit' && jobId !== 'default'
    ? jobId
    : searchParams.get('id') || pathJobId || '';
  const { success: toastSuccess, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: 'Customs Brokerage',
    location: '',
    employmentType: 'Full Time',
    experience: '',
    salary: '',
    description: '',
    responsibilities: '',
    requirements: '',
    qualifications: '',
    skills: '',
    benefits: '',
    deadline: '',
    status: 'published' as 'published' | 'draft' | 'closed' | 'archived',
    featured: false,
    sortOrder: 1,
    applicationCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadJob = async () => {
    if (!effectiveId) {
      setNotFound(true);
      setErrorMessage('No job ID specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const found = await jobsCms.getById(effectiveId);
      if (found) {
        setNotFound(false);
        setErrorMessage('');
        const formatList = (val: any) => {
          if (!val) return '';
          if (Array.isArray(val)) return val.join('\n');
          if (typeof val === 'string' && val.startsWith('[')) {
            try {
              return JSON.parse(val).join('\n');
            } catch {}
          }
          return String(val);
        };

        let dl = '';
        if (found.deadline) {
          try {
            const d = found.deadline?.toDate ? found.deadline.toDate() : new Date(found.deadline);
            if (!isNaN(d.getTime())) {
              dl = d.toISOString().split('T')[0];
            }
          } catch {}
        }

        setFormData({
          title: found.title || '',
          slug: found.slug || '',
          department: found.department || 'Customs Brokerage',
          location: found.location || '',
          employmentType: found.employmentType || (found as any).employment_type || 'Full Time',
          experience: found.experience || '',
          salary: found.salary || '',
          description: found.description || '',
          responsibilities: formatList(found.responsibilities),
          requirements: formatList(found.requirements),
          qualifications: formatList(found.qualifications),
          skills: formatList(found.skills),
          benefits: formatList(found.benefits),
          deadline: dl,
          status: found.status || 'published',
          featured: Boolean(found.featured),
          sortOrder: Number(found.sortOrder) || 1,
          applicationCount: found.applicationCount || 0,
        });
      } else {
        setNotFound(true);
        const msg = 'This job no longer exists. Refresh the job list and try again.';
        setErrorMessage(msg);
        toastError(msg);
      }
    } catch (err: any) {
      setNotFound(true);
      const msg = err?.message || 'Failed to load job details.';
      setErrorMessage(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, [effectiveId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notFound || !effectiveId) {
      toastError('This job no longer exists. Refresh the job list and try again.');
      return;
    }

    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      toastError('Please fill in required fields (Title, Location, Description).');
      return;
    }

    setSubmitting(true);
    try {
      const parseList = (str: string) =>
        str
          .split('\n')
          .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean);

      await jobsCms.update(effectiveId, {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        department: formData.department,
        location: formData.location.trim(),
        employmentType: formData.employmentType,
        experience: formData.experience.trim() || undefined,
        salary: formData.salary.trim() || undefined,
        description: formData.description.trim(),
        responsibilities: parseList(formData.responsibilities),
        requirements: parseList(formData.requirements),
        qualifications: parseList(formData.qualifications),
        skills: parseList(formData.skills),
        benefits: parseList(formData.benefits),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        status: formData.status,
        featured: formData.featured,
        sortOrder: Number(formData.sortOrder) || 1,
      });

      toastSuccess('Job posting updated successfully!');
      router.push('/admin/careers/jobs');
    } catch (err: any) {
      console.error('Update job error:', err);
      const msg = err?.message || 'Failed to update job.';
      toastError(msg);
      if (msg.includes('no longer exists')) {
        setNotFound(true);
        setErrorMessage(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (notFound || !effectiveId) {
      toastError('This job no longer exists. Refresh the job list and try again.');
      return;
    }

    setDeleting(true);
    try {
      await jobsCms.archive(effectiveId);
      toastSuccess('Job posting archived successfully.');
      setDeleteModalOpen(false);
      router.push('/admin/careers/jobs');
    } catch (err: any) {
      console.error('Archive job error:', err);
      const msg = err?.message || 'Failed to archive job.';
      toastError(msg);
      if (msg.includes('no longer exists')) {
        setNotFound(true);
        setErrorMessage(msg);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (notFound || !effectiveId) {
      toastError('This job no longer exists. Refresh the job list and try again.');
      return;
    }

    setDeleting(true);
    try {
      await jobsCms.delete(effectiveId);
      toastSuccess('Job posting permanently deleted from Cloud Firestore.');
      setDeleteModalOpen(false);
      router.push('/admin/careers/jobs');
    } catch (err: any) {
      console.error('Delete job error:', err);
      const msg = err?.message || 'Failed to delete job from Cloud Firestore.';
      toastError(msg);
      if (msg.includes('no longer exists')) {
        setNotFound(true);
        setErrorMessage(msg);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#66736E] text-xs">
        <div className="w-8 h-8 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
        <span className="font-medium">Loading job posting details...</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-8 pb-16">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#66736E] border-b border-[#E2E9E5] pb-4">
          <Link href="/admin" className="hover:text-[#006B4F]">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/careers/jobs" className="hover:text-[#006B4F]">Job Posts</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#DC2626] font-bold">Job Not Found</span>
        </div>

        <div className="bg-white border border-[#E2E9E5] rounded-2xl p-8 sm:p-12 text-center shadow-2xs space-y-4">
          <div className="w-16 h-16 bg-red-50 text-[#DC2626] rounded-2xl flex items-center justify-center mx-auto border border-red-200 shadow-2xs">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17211E]">Job Posting Not Found</h2>
            <p className="text-xs text-[#DC2626] font-semibold mt-2 max-w-md mx-auto">
              {errorMessage || 'This job no longer exists. Refresh the job list and try again.'}
            </p>
            {effectiveId && (
              <p className="text-xs text-[#66736E] mt-1 font-mono">
                Requested Document ID: {effectiveId}
              </p>
            )}
          </div>

          <p className="text-xs sm:text-[13px] text-[#4b5563] max-w-md mx-auto font-normal leading-relaxed">
            The job document could not be found in Cloud Firestore. It may have been deleted, or a stale seed ID was accessed.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#005A43] text-white text-xs font-bold transition-all shadow-sm shadow-[#006B4F]/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Job Posts</span>
            </Link>

            <button
              type="button"
              onClick={loadJob}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F7F9F8] text-[#17211E] border border-[#E2E9E5] text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#006B4F]" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[#E2E9E5] pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#66736E]">
          <Link href="/admin" className="hover:text-[#006B4F]">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/careers/jobs" className="hover:text-[#006B4F]">Job Posts</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#006B4F] font-bold">Edit Position</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/careers/applications?job_id=${effectiveId}`}
            className="flex items-center space-x-1.5 text-xs text-[#006B4F] bg-[#EAF5F1] hover:bg-[#D5EDE5] px-3 py-1.5 rounded-xl font-bold border border-[#006B4F]/20 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Applications ({formData.applicationCount})</span>
          </Link>

          {formData.status === 'published' && formData.slug && (
            <Link
              href={`/careers/${formData.slug}`}
              target="_blank"
              className="flex items-center space-x-1.5 text-xs text-[#66736E] hover:text-[#006B4F] font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public</span>
            </Link>
          )}

          <Link
            href="/admin/careers/jobs"
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#66736E] hover:text-[#17211E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006B4F] block mb-1">
              Position Settings
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17211E] tracking-tight">Edit Job Posting</h1>
            <p className="text-xs text-[#66736E] mt-1 font-mono">ID: {effectiveId}</p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-50 text-[#DC2626] border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete / Archive</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Core Job Identity */}
          <div className="p-5 bg-[#F7F9F8] border border-[#E2E9E5] rounded-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#006B4F] flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Core Job Information</span>
            </h2>

            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                  Job Title <span className="text-[#006B4F]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                  SEO Slug <span className="text-[#006B4F]">*</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-[#E2E9E5] bg-white focus-within:border-[#006B4F] focus-within:ring-1 focus-within:ring-[#006B4F]/20">
                  <span className="inline-flex items-center px-3 bg-[#F7F9F8] text-[#66736E] text-xs font-mono select-none border-r border-[#E2E9E5]">
                    /careers/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-white text-xs font-mono text-[#006B4F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Department, Type, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs font-medium text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
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
                <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs font-medium text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                  Publishing Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                    formData.status === 'published'
                      ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30'
                      : formData.status === 'draft'
                      ? 'bg-amber-50 text-[#D97706] border-amber-200'
                      : 'bg-slate-100 text-[#66736E] border-slate-200'
                  }`}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed (Applications Disabled)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location, Experience, Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#006B4F]" />
                <span>Location <span className="text-[#006B4F]">*</span></span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#006B4F]" />
                <span>Experience</span>
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 1-3 Years"
                className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-[#006B4F]" />
                <span>Salary Range</span>
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. Competitive"
                className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F]"
              />
            </div>
          </div>

          {/* Section 3: Deadline, Featured, Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#006B4F]" />
                <span>Application Deadline</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center space-x-1">
                <ListOrdered className="w-3.5 h-3.5 text-[#006B4F]" />
                <span>Sort Order</span>
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                min={1}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
              />
            </div>

            <div className="pb-2">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#006B4F] rounded border-[#E2E9E5] focus:ring-[#006B4F]"
                />
                <span className="text-xs font-bold text-[#17211E] flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Featured Position</span>
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              Job Description <span className="text-[#006B4F]">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20 resize-y"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              Key Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] resize-y"
            />
          </div>

          {/* Requirements & Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                Candidate Requirements (one per line)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                Educational Qualifications (one per line)
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] resize-y"
              />
            </div>
          </div>

          {/* Skills & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                Key Skills (one per line)
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                Perks & Benefits (one per line)
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] resize-y"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-end space-x-3">
            <Link
              href="/admin/careers/jobs"
              className="px-5 py-2.5 rounded-xl border border-[#E2E9E5] bg-white text-xs font-semibold text-[#17211E] hover:bg-[#ffc107]/20 hover:border-[#ffc107] active:bg-[#e0a800]/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-250 disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
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
        title={
          formData.applicationCount > 0
            ? 'Delete Job with Linked Applications?'
            : 'Delete Job Posting Permanently?'
        }
        message={
          <div className="space-y-2.5">
            <p>
              Are you sure you want to permanently delete the job listing{' '}
              <strong className="text-[#17211E]">"{formData.title || 'Job'}"</strong> (Document ID:{' '}
              <span className="font-mono text-[#006B4F]">{effectiveId}</span>) from Cloud Firestore?
            </p>
            {formData.applicationCount > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <p className="font-bold flex items-center space-x-1 mb-1">
                  <span>⚠️ {formData.applicationCount} Candidate Application(s) Linked</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  Candidate records and resumes stored in Cloudflare R2 will remain safely preserved. To retain position metadata for these candidates, we recommend{' '}
                  <strong>archiving</strong> the position instead.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-[#66736E]">
                This operation will permanently delete the document from Cloud Firestore. This action cannot be undone.
              </p>
            )}
          </div>
        }
        confirmLabel="Permanently Delete"
        secondaryActionLabel={
          formData.applicationCount > 0
            ? 'Archive Position (Recommended)'
            : 'Archive Position'
        }
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePermanentDelete}
        onSecondaryAction={handleArchive}
      />
    </div>
  );
}
