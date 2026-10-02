'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jobsApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import {
  Briefcase,
  ArrowLeft,
  Save,
  ChevronRight,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: 'Customs Brokerage',
    location: 'Chennai (Parrys Head Office)',
    employment_type: 'Full-time',
    experience: '',
    salary: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    deadline: '',
    status: 'published',
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-generate slug as user types title unless manually modified
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const updates: any = { title };
    if (!slugManuallyEdited) {
      updates.slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'slug') setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      toastError('Please fill in all required fields (Title, Location, Description).');
      return;
    }

    setSubmitting(true);
    try {
      await jobsApi.createJob(formData);
      toastSuccess('Job posting created successfully!');
      router.push('/admin/careers/jobs');
    } catch (err: any) {
      toastError(err?.message || 'Failed to create job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Link href="/admin" className="hover:text-emerald-400">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/careers/jobs" className="hover:text-emerald-400">Job Posts</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-emerald-400">Create New</span>
        </div>

        <Link
          href="/admin/careers/jobs"
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white tracking-tight">Create Career Opportunity</h1>
          <p className="text-xs text-slate-400 mt-1">
            Specify job specifications, role expectations, candidate requirements, and publishing status.
          </p>
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
                value={formData.title}
                onChange={handleTitleChange}
                required
                placeholder="e.g. Customs Documentation Executive"
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
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="customs-documentation-executive"
                  className="w-full px-3 py-2.5 bg-slate-950 text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Department, Employment Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
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
                Employment Type <span className="text-emerald-400">*</span>
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
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
                Publishing Status <span className="text-emerald-400">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold focus:outline-none ${
                  formData.status === 'published'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : formData.status === 'draft'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-slate-950 text-slate-400 border-slate-700'
                }`}
              >
                <option value="published">Published (Live on website)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="closed">Closed (Archived)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Location, Experience, Salary, Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Location <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Chennai Port Operations"
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
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2 - 5 Years"
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
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹35,000 - ₹50,000 / month"
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
              value={formData.deadline}
              onChange={handleChange}
              className="w-full sm:w-64 px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Job Overview / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Job Description / About the Role <span className="text-emerald-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Provide a comprehensive summary of this role and where it fits within KPS logistics operations..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-y"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Key Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={4}
              placeholder={`• Prepare and file online Bills of Entry on ICEGATE\n• Coordinate with customs appraisers at Chennai Port\n• Monitor customs bond clearances and duty drawbacks`}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans resize-y"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Candidate Requirements & Qualifications (one per line)
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              placeholder={`• Bachelor's degree in Logistics or Commerce\n• 2+ years direct experience in CHA / customs documentation\n• Strong command of ICEGATE and e-Sanchit platforms`}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans resize-y"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Perks & Benefits (one per line)
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={3}
              placeholder={`• Comprehensive health insurance for family\n• Annual performance bonus\n• Rule 6 exam certification sponsorship`}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans resize-y"
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
                  <span>Saving Job Post...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish Job Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
