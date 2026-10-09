'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jobsCms } from '@/lib/careers-firestore';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/admin/Toast';
import {
  Briefcase,
  ArrowLeft,
  Save,
  ChevronRight,
  Sparkles,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Layers,
  FileText,
  ListOrdered,
} from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: 'Customs Brokerage',
    location: 'Chennai (Parrys Head Office)',
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
    const { name, value, type } = e.target;
    if (name === 'slug') setSlugManuallyEdited(true);

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      toastError('Please fill in all required fields (Title, Location, Description).');
      return;
    }

    setSubmitting(true);
    try {
      // Clean string lists into arrays
      const parseList = (str: string) =>
        str
          .split('\n')
          .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
          .filter(Boolean);

      await jobsCms.create({
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

      toastSuccess('Job posting created and published successfully!');
      router.push('/admin/careers/jobs');
    } catch (err: any) {
      console.error('Create job error:', err);
      toastError(err?.message || 'Failed to create job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-[#E2E9E5] pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#66736E]">
          <Link href="/admin" className="hover:text-[#006B4F]">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/careers/jobs" className="hover:text-[#006B4F]">Job Posts</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#006B4F] font-bold">Create New</span>
        </div>

        <Link
          href="/admin/careers/jobs"
          className="flex items-center space-x-1.5 text-xs font-semibold text-[#66736E] hover:text-[#17211E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </Link>
      </div>

      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006B4F] block mb-1">
            New Career Listing
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17211E] tracking-tight">Create Career Opportunity</h1>
          <p className="text-xs text-[#66736E] mt-1">
            Specify job specifications, role expectations, candidate requirements, and publishing status for Cloud Firestore.
          </p>
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
                  onChange={handleTitleChange}
                  required
                  placeholder="e.g. Logistics Executive"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                  SEO Slug <span className="text-[#006B4F]">*</span>
                </label>
                <div className="flex rounded-xl overflow-hidden border border-[#E2E9E5] bg-white focus-within:border-[#006B4F] focus-within:ring-1 focus-within:ring-[#006B4F]/20">
                  <span className="inline-flex items-center px-3 bg-[#F7F9F8] text-[#66736E] text-xs font-mono select-none border-r border-[#E2E9E5]">
                    /career/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    placeholder="logistics-executive"
                    className="w-full px-3 py-2.5 bg-white text-xs font-mono text-[#006B4F] placeholder-[#66736E]/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Department, Employment Type, Status */}
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
                  Employment Type <span className="text-[#006B4F]">*</span>
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
                  Publishing Status <span className="text-[#006B4F]">*</span>
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
                  <option value="published">Published (Live on Careers)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="closed">Closed (Applications Disabled)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Compensation & Requirements Specifications */}
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
                placeholder="e.g. Chennai, Tamil Nadu"
                className="w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#006B4F]" />
                <span>Experience Required</span>
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
                <span>Salary / Compensation</span>
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. Competitive / ₹35k - ₹50k"
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

          {/* Job Overview / Description */}
          <div>
            <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
              Job Description / About the Role <span className="text-[#006B4F]">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Provide a comprehensive summary of this role and where it fits within KPS logistics operations..."
              className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20 resize-y"
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
              placeholder={`Prepare and file online Bills of Entry on ICEGATE\nCoordinate with customs appraisers at Chennai Port\nMonitor customs bond clearances and duty drawbacks`}
              className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] resize-y"
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
                placeholder={`2+ years direct experience in CHA / customs documentation\nStrong command of ICEGATE and e-Sanchit platforms\nKnowledge of EXIM procedures`}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] resize-y"
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
                placeholder={`Bachelor's degree in Logistics, Commerce, or related discipline\nCHA Rule 6 / Rule 13 certification preferred`}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] resize-y"
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
                placeholder={`ICEGATE filing\nCustoms Tariff classification\ne-Sanchit\nFreight forwarding coordination`}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] resize-y"
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
                placeholder={`Comprehensive health insurance for family\nAnnual performance bonus\nRule 6 exam certification sponsorship`}
                className="w-full px-4 py-3 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] resize-y"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-end space-x-3">
            <Link
              href="/admin/careers/jobs"
              className="px-5 py-2.5 rounded-xl border border-[#E2E9E5] bg-white text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#005A43] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
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
