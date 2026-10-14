'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Upload,
  FileText,
  CheckCircle,
  Trash2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Globe,
} from 'lucide-react';
import { applicationsCms } from '@/lib/careers-firestore';
import { resumeApi } from '@/lib/resume-api';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function CareerApplicationForm({
  jobId = '',
  jobTitle = '',
  jobSlug = '',
  isClosed = false,
  deadline = '',
} = {}) {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    location: '',
    city: '',
    state: '',
    experience: '',
    currentCompany: '',
    currentJobTitle: '',
    expectedSalary: '',
    noticePeriod: 'Immediate',
    qualification: 'Bachelor\'s Degree',
    linkedinUrl: '',
    portfolioUrl: '',
    coverLetter: '',
  });

  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | uploading | saving | success | error
  const [apiError, setApiError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validate = () => {
    const tempErrors = {};

    if (!formData.candidateName.trim()) {
      tempErrors.candidateName = 'Full candidate name is required';
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        tempErrors.phone = `Enter at least 10 digits (${digitsOnly.length}/10 entered)`;
      }
    }

    if (!resume) {
      tempErrors.resume = 'Resume document is required (PDF, DOC, DOCX up to 10MB)';
    } else {
      const ext = resume.name.substring(resume.name.lastIndexOf('.')).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        tempErrors.resume = 'Allowed formats: PDF (.pdf), DOC (.doc), DOCX (.docx)';
      } else if (resume.size > MAX_FILE_SIZE) {
        tempErrors.resume = 'File size exceeds maximum 10MB limit';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setErrors((prev) => ({ ...prev, resume: 'Only PDF, DOC, or DOCX formats are supported' }));
      } else if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ ...prev, resume: 'File size exceeds maximum 10MB limit' }));
      } else {
        setResume(file);
        if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setErrors((prev) => ({ ...prev, resume: 'Only PDF, DOC, or DOCX formats are supported' }));
      } else if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ ...prev, resume: 'File size exceeds maximum 10MB limit' }));
      } else {
        setResume(file);
        if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
      }
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (isClosed) {
      setApiError('Applications for this position are currently closed.');
      return;
    }

    if (!validate() || !resume) return;

    // 1. Duplicate application check
    if (jobId) {
      try {
        const isDuplicate = await applicationsCms.checkDuplicate(formData.email, jobId);
        if (isDuplicate) {
          setApiError('You have already applied for this position with this email address.');
          return;
        }
      } catch (dupErr) {
        console.warn('Duplicate check warning:', dupErr);
      }
    }

    let uploadResult = null;
    try {
      setStatus('uploading');

      // 2. Upload resume securely to Cloudflare R2
      uploadResult = await resumeApi.uploadResume(
        resume,
        jobId || 'general',
        formData.candidateName.trim(),
        formData.email.trim()
      );

      setStatus('saving');

      // 3. Construct clean application payload (omitting empty optional fields)
      const applicationPayload = {
        jobId: jobId || 'general-application',
        jobTitle: jobTitle || 'General Application',
        jobSlug: jobSlug || '',
        candidateName: formData.candidateName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        resumeFileName: uploadResult.filename || resume.name,
        resumeR2Key: uploadResult.key,
        resumeUrl: uploadResult.url,
        resumeFileSize: uploadResult.size || resume.size,
        resumeFileType: uploadResult.contentType || resume.type,
      };

      if (formData.alternatePhone?.trim()) applicationPayload.alternatePhone = formData.alternatePhone.trim();
      if (formData.location?.trim()) applicationPayload.location = formData.location.trim();
      if (formData.city?.trim()) applicationPayload.city = formData.city.trim();
      if (formData.state?.trim()) applicationPayload.state = formData.state.trim();
      if (formData.experience?.trim()) applicationPayload.experience = formData.experience.trim();
      if (formData.currentCompany?.trim()) applicationPayload.currentCompany = formData.currentCompany.trim();
      if (formData.currentJobTitle?.trim()) applicationPayload.currentJobTitle = formData.currentJobTitle.trim();
      if (formData.expectedSalary?.trim()) applicationPayload.expectedSalary = formData.expectedSalary.trim();
      if (formData.noticePeriod?.trim()) applicationPayload.noticePeriod = formData.noticePeriod.trim();
      if (formData.qualification?.trim()) applicationPayload.qualification = formData.qualification.trim();
      if (formData.linkedinUrl?.trim()) applicationPayload.linkedinUrl = formData.linkedinUrl.trim();
      if (formData.portfolioUrl?.trim()) applicationPayload.portfolioUrl = formData.portfolioUrl.trim();
      if (formData.coverLetter?.trim()) applicationPayload.coverLetter = formData.coverLetter.trim();

      // Create Application record in Firestore
      await applicationsCms.create(applicationPayload);

      setStatus('success');
      setFormData({
        candidateName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        location: '',
        city: '',
        state: '',
        experience: '',
        currentCompany: '',
        currentJobTitle: '',
        expectedSalary: '',
        noticePeriod: 'Immediate',
        qualification: 'Bachelor\'s Degree',
        linkedinUrl: '',
        portfolioUrl: '',
        coverLetter: '',
      });
      setResume(null);
    } catch (err) {
      console.error('Application submission error:', err);
      // Clean up orphaned R2 file if Firestore creation failed
      if (uploadResult && uploadResult.key) {
        resumeApi.deleteResume(uploadResult.key).catch(() => {});
      }
      setStatus('error');
      setApiError(err?.message || 'Failed to submit application. Please check your connection and try again.');
    }
  };

  if (isClosed) {
    return (
      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-900">Applications Closed</h3>
        <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto leading-relaxed">
          Applications for <span className="font-bold">{jobTitle || 'this position'}</span> are currently closed. You may browse other openings or submit a general application for future roles.
        </p>
        <div className="pt-2">
          <Link
            href="/career"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-green hover:underline"
          >
            <span>Explore other careers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100">
      <div className="border-b border-gray-100 pb-5 mb-8">
        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">
          {jobTitle ? 'Direct Application' : 'Candidate Portal'}
        </span>
        <h3 className="text-2xl font-black text-brand-green-dark">
          {jobTitle ? `Apply for ${jobTitle}` : 'Submit Your Application'}
        </h3>
        <p className="text-[#4b5563] text-xs sm:text-sm mt-1 font-normal leading-relaxed">
          Fill in your credentials and upload your resume. Our HR recruitment team reviews every profile.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-8 sm:p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-extrabold text-emerald-900">
            Application Submitted Successfully!
          </h4>
          <p className="text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed font-normal">
            Thank you for applying to KPS Worldwide Logistics. Your application for{' '}
            <span className="font-bold text-emerald-950">{jobTitle || 'this position'}</span> has been received and securely stored in our recruitment pipeline.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/career"
              className="px-5 py-2.5 bg-brand-green hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white font-bold text-xs rounded-xl shadow-xs transition-all duration-250 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
            >
              Back to All Careers
            </Link>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="px-5 py-2.5 bg-white text-emerald-900 border border-emerald-300 hover:bg-[#ffc107] hover:border-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] font-semibold text-xs rounded-xl transition-all duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Submission Error</span>
                <span>{apiError}</span>
              </div>
            </div>
          )}

          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#004D3A] flex items-center space-x-2 border-b border-gray-100 pb-2">
              <User className="w-4 h-4 text-brand-yellow-dark" />
              <span>Personal Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Name <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="text"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                  placeholder="e.g. Anandha Krishnan"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.candidateName ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {errors.candidateName && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.candidateName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email Address <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Primary Phone <span className="text-emerald-700">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                    errors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Alternate Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Current City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Current State / Region
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional & Experience */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#004D3A] flex items-center space-x-2 border-b border-gray-100 pb-2">
              <Briefcase className="w-4 h-4 text-brand-yellow-dark" />
              <span>Professional Experience</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Total Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">Select Experience Level</option>
                  <option value="Fresher / Entry Level">Fresher / Entry Level</option>
                  <option value="1 - 2 Years">1 - 2 Years</option>
                  <option value="3 - 5 Years">3 - 5 Years</option>
                  <option value="5 - 8 Years">5 - 8 Years</option>
                  <option value="8+ Years">8+ Years (Senior)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Highest Qualification
                </label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Bachelor's Degree">Bachelor's Degree (B.Com / B.Sc / B.E / BBA)</option>
                  <option value="Master's / MBA">Master's Degree (MBA / M.Com / MS)</option>
                  <option value="Diploma in Logistics / Customs">Diploma in Logistics / Customs Brokerage</option>
                  <option value="Higher Secondary (12th)">Higher Secondary / 12th Standard</option>
                  <option value="Other">Other Specialized Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Current Company <span className="text-gray-400 font-normal">(if currently employed)</span>
                </label>
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="e.g. ABC Shipping Pvt Ltd"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Current Job Title
                </label>
                <input
                  type="text"
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Documentation Assistant"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Expected Compensation <span className="text-gray-400 font-normal">(CTC / Month)</span>
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g. ₹ 35,000 / Month or As per industry standards"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Notice Period
                </label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Immediate">Immediate / Available Now</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  LinkedIn Profile URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Portfolio / Website URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Cover Letter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Cover Letter / Statement of Interest <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={4}
              placeholder="Tell our HR team about your domain experience, key achievements in shipping/customs, and why you would like to join KPS..."
              className="w-full px-4 py-3 text-xs bg-[#fafcfb] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-y font-normal leading-relaxed"
            />
          </div>

          {/* Section 4: Resume Dropzone */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Resume / Curriculum Vitae (CV) <span className="text-emerald-700">*</span>
            </label>

            {!resume ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-600 bg-emerald-50/60 scale-[1.01]'
                    : errors.resume
                    ? 'border-red-300 bg-red-50/20 hover:border-red-400'
                    : 'border-gray-300 bg-[#fafcfb] hover:border-emerald-600 hover:bg-emerald-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-800">
                  Click to select or drag & drop your resume
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX (Max size: 10 MB)
                </p>
              </div>
            ) : (
              <div className="bg-[#eef6f2] border border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate">{resume.name}</p>
                    <p className="text-[11px] text-gray-600">
                      {(resume.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.resume && (
              <p className="text-[11px] text-red-600 font-medium">{errors.resume}</p>
            )}

            <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 font-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Resumes are encrypted and stored securely in Cloudflare R2.</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={status === 'uploading' || status === 'saving'}
              className="w-full sm:w-auto min-w-[220px] bg-brand-green hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white font-extrabold text-xs sm:text-sm py-3.5 px-8 rounded-xl shadow-md transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
            >
              {status === 'uploading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading Resume to R2...</span>
                </>
              ) : status === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Candidate Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
