'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { applicationsCms } from '@/lib/careers-firestore';
import { resumeApi } from '@/lib/resume-api';
import { useToast } from '@/components/admin/Toast';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { CandidateApplication, ApplicationStatus } from '@/lib/careers-types';
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
  GraduationCap,
  Globe,
  Trash2,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

interface ApplicationDetailViewProps {
  appId: string;
}

export default function ApplicationDetailView({ appId }: ApplicationDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectiveId = appId && appId !== 'view' ? appId : searchParams.get('id') || '';
  const { success: toastSuccess, error: toastError } = useToast();

  const [app, setApp] = useState<CandidateApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!effectiveId) {
      setLoading(false);
      return;
    }

    const loadApp = async () => {
      try {
        const data = await applicationsCms.getById(effectiveId);
        setApp(data);
      } catch (err: any) {
        toastError(err?.message || 'Failed to load application details.');
      } finally {
        setLoading(false);
      }
    };

    loadApp();
  }, [effectiveId]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!app) return;
    setUpdating(true);
    try {
      await applicationsCms.updateStatus(app.id, newStatus);
      toastSuccess(`Application marked as "${newStatus}".`);
      setApp((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!app) return;
    setDeleting(true);
    try {
      if (app.resumeR2Key) {
        await resumeApi.deleteResume(app.resumeR2Key);
      }
      await applicationsCms.delete(app.id);
      toastSuccess('Candidate application permanently deleted.');
      router.push('/admin/careers/applications');
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  const statusOptions: ApplicationStatus[] = [
    'New',
    'Reviewing',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
    'Withdrawn',
  ];

  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    New: { bg: 'bg-[#EAF5F1]', text: 'text-[#006B4F]', border: 'border-[#006B4F]/30' },
    Reviewing: { bg: 'bg-blue-50', text: 'text-[#2563EB]', border: 'border-blue-200' },
    Shortlisted: { bg: 'bg-emerald-50', text: 'text-[#059669]', border: 'border-emerald-200' },
    Interview: { bg: 'bg-purple-50', text: 'text-[#7C3AED]', border: 'border-purple-200' },
    Selected: { bg: 'bg-[#004D3A]/10', text: 'text-[#004D3A]', border: 'border-[#004D3A]/30' },
    Rejected: { bg: 'bg-red-50', text: 'text-[#DC2626]', border: 'border-red-200' },
    Withdrawn: { bg: 'bg-slate-100', text: 'text-[#66736E]', border: 'border-slate-200' },
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#66736E] text-xs">
        <div className="w-8 h-8 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
        <span className="font-semibold">Loading candidate profile & dossier...</span>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-12 bg-white border border-[#E2E9E5] rounded-2xl text-center shadow-2xs max-w-lg mx-auto mt-8">
        <Users className="w-12 h-12 text-[#66736E]/40 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#17211E]">Application Record Not Found</h2>
        <p className="text-xs text-[#66736E] mt-1">
          The requested candidate application does not exist or has been deleted.
        </p>
        <Link
          href="/admin/careers/applications"
          className="mt-6 inline-flex items-center space-x-1.5 px-4 py-2 bg-[#006B4F] text-white text-xs font-bold rounded-xl hover:bg-[#005A43] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Applications</span>
        </Link>
      </div>
    );
  }

  const appliedDateFormatted = app.appliedAt?.toDate
    ? app.appliedAt.toDate().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date(app.appliedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const fileSizeMb = app.resumeFileSize
    ? (app.resumeFileSize / (1024 * 1024)).toFixed(2)
    : '1.20';

  const style = statusStyles[app.status] || {
    bg: 'bg-slate-100',
    text: 'text-[#66736E]',
    border: 'border-slate-200',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-[#E2E9E5] pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#66736E]">
          <Link href="/admin" className="hover:text-[#006B4F]">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/admin/careers/applications" className="hover:text-[#006B4F]">Applications</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#006B4F] font-bold">{app.candidateName}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 text-[#DC2626] border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <Link
            href="/admin/careers/applications"
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#66736E] hover:text-[#17211E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </Link>
        </div>
      </div>

      {/* Main Candidate Card */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-8">
        {/* Header Strip with Name & Status Updater */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E9E5]">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold text-[#006B4F] uppercase tracking-wider">
                Candidate Profile
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}>
                {app.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17211E] tracking-tight">{app.candidateName}</h1>
            <p className="text-xs text-[#66736E] mt-1 font-medium">
              Applied for <span className="text-[#17211E] font-bold">{app.jobTitle}</span> • {appliedDateFormatted}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 bg-[#F7F9F8] p-2 rounded-xl border border-[#E2E9E5]">
            <span className="text-xs font-bold text-[#66736E] uppercase tracking-wider pl-1">Stage:</span>
            <select
              value={app.status}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-[#E2E9E5] text-[#006B4F] focus:outline-none focus:border-[#006B4F] cursor-pointer shadow-2xs"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Personal & Professional Information */}
          <div className="space-y-6">
            {/* 1. PERSONAL INFORMATION */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#006B4F] flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Personal Information</span>
              </h2>

              <div className="bg-[#F7F9F8] border border-[#E2E9E5] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">Full Name</span>
                  <span className="text-[#17211E] font-bold">{app.candidateName}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">Email Address</span>
                  <a
                    href={`mailto:${app.email}`}
                    className="text-[#006B4F] hover:underline font-bold flex items-center space-x-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{app.email}</span>
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">Primary Phone</span>
                  <a
                    href={`tel:${app.phone}`}
                    className="text-[#006B4F] hover:underline font-bold flex items-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{app.phone}</span>
                  </a>
                </div>

                {app.alternatePhone && (
                  <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                    <span className="text-[#66736E] font-medium">Alternate Phone</span>
                    <a href={`tel:${app.alternatePhone}`} className="text-[#17211E] hover:text-[#006B4F] font-semibold">
                      {app.alternatePhone}
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#66736E] font-medium">Current Location</span>
                  <span className="text-[#17211E] font-semibold">
                    {[app.city, app.state, app.location].filter(Boolean).join(', ') || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. PROFESSIONAL INFORMATION */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#006B4F] flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Professional Experience</span>
              </h2>

              <div className="bg-[#F7F9F8] border border-[#E2E9E5] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">Current / Past Company</span>
                  <span className="text-[#17211E] font-bold">{app.currentCompany || 'Not specified'}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">Current Job Title</span>
                  <span className="text-[#17211E] font-bold">{app.currentJobTitle || 'Not specified'}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">Years of Experience</span>
                  <span className="text-[#17211E] font-bold">{app.experience || 'Not specified'}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">Expected Salary</span>
                  <span className="text-[#17211E] font-semibold">{app.expectedSalary || 'Not specified'}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#66736E] font-medium">Notice Period</span>
                  <span className="text-[#17211E] font-semibold">{app.noticePeriod || 'Immediate / Not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Education, Profiles & Resume Card */}
          <div className="space-y-6">
            {/* 3. RESUME FILE CARD (Cloudflare R2) */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#006B4F] flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Candidate Resume (Cloudflare R2)</span>
              </h2>

              <div className="bg-[#EAF5F1] border border-[#006B4F]/20 rounded-xl p-5 space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#006B4F]/20 text-[#006B4F] flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold text-[#17211E] truncate" title={app.resumeFileName || 'Resume.pdf'}>
                      {app.resumeFileName || 'Resume.pdf'}
                    </p>
                    <p className="text-xs text-[#66736E] mt-0.5 font-medium">
                      {fileSizeMb} MB • Cloudflare R2 Private Bucket
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] text-[#006B4F] font-semibold mt-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticated Access Only</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
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
                    className="w-full sm:flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#006B4F] hover:bg-[#005A43] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-200 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Resume</span>
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
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white hover:bg-[#F7F9F8] text-[#17211E] text-xs font-bold border border-[#E2E9E5] transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#006B4F]" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. EDUCATION */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#006B4F] flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Education & Qualifications</span>
              </h2>

              <div className="bg-[#F7F9F8] border border-[#E2E9E5] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#66736E] font-medium">Highest Qualification</span>
                  <span className="text-[#17211E] font-bold">{app.qualification || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* 5. ONLINE PROFILES */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#006B4F] flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Online Profiles</span>
              </h2>

              <div className="bg-[#F7F9F8] border border-[#E2E9E5] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-[#E2E9E5] pb-2">
                  <span className="text-[#66736E] font-medium">LinkedIn Profile</span>
                  {app.linkedinUrl ? (
                    <a
                      href={app.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#006B4F] hover:underline font-bold flex items-center space-x-1 truncate max-w-[200px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{app.linkedinUrl}</span>
                    </a>
                  ) : (
                    <span className="text-[#66736E]">Not provided</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#66736E] font-medium">Portfolio / Website</span>
                  {app.portfolioUrl ? (
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#006B4F] hover:underline font-bold flex items-center space-x-1 truncate max-w-[200px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{app.portfolioUrl}</span>
                    </a>
                  ) : (
                    <span className="text-[#66736E]">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. COVER LETTER */}
        {app.coverLetter && (
          <div className="pt-6 border-t border-[#E2E9E5] space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#006B4F] flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Candidate Cover Letter / Note</span>
            </h2>
            <div className="p-5 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] text-xs text-[#17211E] leading-relaxed whitespace-pre-wrap font-medium">
              {app.coverLetter}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Candidate Application?"
        message={`Are you sure you want to permanently delete the application of ${app.candidateName}? This will permanently remove the application record from Firestore and delete the associated resume file from Cloudflare R2.`}
        confirmLabel="Delete Application"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
