'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Trash2, Edit, AlertCircle } from 'lucide-react';
import { applicationsApi } from '@/lib/api';

export default function CareerApplicationForm({
  jobId = '',
  jobTitle = '',
  jobSlug = '',
} = {}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    designation: jobTitle || '',
    location: '',
    experience: '',
    currentCompany: '',
    coverLetter: '',
  });

  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [apiError, setApiError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        tempErrors.phone = `Enter at least 10 digits (${digitsOnly.length}/10 entered)`;
      }
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.designation.trim() && !jobTitle) {
      tempErrors.designation = 'Position / Designation is required';
    }

    if (!resume) {
      tempErrors.resume = 'Please upload your resume (PDF format only, max 5MB)';
    } else {
      if (!resume.name.toLowerCase().endsWith('.pdf')) {
        tempErrors.resume = 'Only PDF format (.pdf) is accepted';
      } else if (resume.size > 5 * 1024 * 1024) {
        tempErrors.resume = 'File size exceeds maximum 5MB limit';
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
      if (file.name.toLowerCase().endsWith('.pdf')) {
        if (file.size <= 5 * 1024 * 1024) {
          setResume(file);
          if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
        } else {
          setErrors((prev) => ({ ...prev, resume: 'File size exceeds maximum 5MB limit' }));
        }
      } else {
        setErrors((prev) => ({ ...prev, resume: 'Only PDF documents (.pdf) are allowed' }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.toLowerCase().endsWith('.pdf')) {
        if (file.size <= 5 * 1024 * 1024) {
          setResume(file);
          if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
        } else {
          setErrors((prev) => ({ ...prev, resume: 'File size exceeds maximum 5MB limit' }));
        }
      } else {
        setErrors((prev) => ({ ...prev, resume: 'Only PDF documents (.pdf) are allowed' }));
      }
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate() || !resume) return;

    setStatus('loading');

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('email', formData.email.trim());
      data.append('phone', formData.phone.trim());
      if (formData.location) data.append('location', formData.location.trim());
      if (formData.experience) data.append('experience', formData.experience.trim());
      if (formData.currentCompany) data.append('current_company', formData.currentCompany.trim());
      if (formData.coverLetter) data.append('cover_letter', formData.coverLetter.trim());
      if (jobId) data.append('job_id', jobId);
      if (jobSlug) data.append('job_slug', jobSlug);

      data.append('resume', resume);

      await applicationsApi.submitApplication(data);
      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        designation: jobTitle || '',
        location: '',
        experience: '',
        currentCompany: '',
        coverLetter: '',
      });
      setResume(null);
    } catch (err) {
      setStatus('error');
      setApiError(err?.message || 'Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-brand-green/10">
      <h3 className="text-xl font-bold text-brand-green-dark mb-1 uppercase tracking-wide">
        {jobTitle ? `Apply for ${jobTitle}` : 'Submit Your Application'}
      </h3>
      <p className="text-brand-gray text-xs sm:text-sm mb-6">
        Submit your resume and candidate details. Our HR team reviews every submission.
      </p>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 sm:p-8 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-emerald-800 mb-2">Application Received!</h4>
          <p className="text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
            Thank you for applying to KPS Worldwide Logistics. Your resume has been secured and our HR team will contact shortlisted candidates shortly.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-6 text-xs font-bold text-brand-green hover:text-brand-green-light underline"
          >
            Submit another application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {apiError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="career-name" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="career-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'loading'}
              className={`w-full px-4 py-3 rounded-lg text-sm border focus:ring-2 focus:ring-offset-1 transition-all ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
              }`}
              placeholder="Your Full Name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label htmlFor="career-phone" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="career-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 rounded-lg text-sm border focus:ring-2 focus:ring-offset-1 transition-all ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                }`}
                placeholder="e.g. +91 98843 88099"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="career-email" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="career-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 rounded-lg text-sm border focus:ring-2 focus:ring-offset-1 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                }`}
                placeholder="candidate@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Current Location */}
            <div>
              <label htmlFor="career-location" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Current Location
              </label>
              <input
                type="text"
                id="career-location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-lg text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                placeholder="e.g. Chennai, Tamil Nadu"
              />
            </div>

            {/* Total Experience */}
            <div>
              <label htmlFor="career-experience" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
                Total Relevant Experience
              </label>
              <input
                type="text"
                id="career-experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-lg text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                placeholder="e.g. 3.5 Years"
              />
            </div>
          </div>

          {/* Current / Last Company */}
          <div>
            <label htmlFor="career-company" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
              Current or Previous Organization
            </label>
            <input
              type="text"
              id="career-company"
              name="currentCompany"
              value={formData.currentCompany}
              onChange={handleChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
              placeholder="e.g. Global Freight Logistics Ltd."
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="career-cover" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
              Cover Note / Professional Summary
            </label>
            <textarea
              id="career-cover"
              name="coverLetter"
              rows={3}
              value={formData.coverLetter}
              onChange={handleChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-lg text-sm border border-brand-gray-muted focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all resize-y"
              placeholder="Brief summary of your background and why you are interested in this position..."
            />
          </div>

          {/* Drag & Drop Resume Upload (PDF Only, Max 5MB) */}
          <div>
            <label className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-1.5">
              Upload Resume / CV (PDF Only, Max 5MB) <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />

            {!resume ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleTriggerFileInput}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-brand-yellow bg-brand-yellow/5'
                    : 'border-brand-gray-muted hover:border-brand-green hover:bg-brand-gray-light'
                }`}
              >
                <div className="mx-auto w-10 h-10 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-brand-gray-dark">
                  Drag and drop your PDF resume here, or <span className="text-brand-green underline hover:text-brand-green-light">browse file</span>
                </p>
                <p className="text-xs text-brand-gray mt-1 font-medium">
                  Strictly PDF documents up to 5 MB
                </p>
              </div>
            ) : (
              <div className="border border-brand-green bg-brand-green-bg/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2.5 bg-brand-green text-white rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-brand-gray-dark truncate">{resume.name}</p>
                    <p className="text-xs text-brand-gray font-medium">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleTriggerFileInput}
                    className="p-1.5 text-brand-gray hover:text-brand-green transition-colors"
                    title="Change PDF"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-brand-gray hover:text-red-500 transition-colors"
                    title="Remove PDF"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {errors.resume && <p className="mt-1 text-xs text-red-500 font-medium">{errors.resume}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-green hover:bg-brand-green-light text-white font-bold py-3.5 px-6 rounded-lg text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading Resume & Submitting...</span>
              </>
            ) : (
              <span>Submit Application</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
