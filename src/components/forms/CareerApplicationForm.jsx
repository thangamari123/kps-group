import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Trash2, Edit } from 'lucide-react';

export default function CareerApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    designation: ''
  });
  
  const [resume, setResume] = useState(null); // File object
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.phone.trim()) tempErrors.phone = 'Phone is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.designation.trim()) tempErrors.designation = 'Designation is required';
    if (!resume) tempErrors.resume = 'Please upload your resume';

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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // File type check (typically PDF or Word doc)
      const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
      if (allowedExtensions.exec(file.name)) {
        setResume(file);
        if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
      } else {
        setErrors((prev) => ({ ...prev, resume: 'Only PDF, DOC, or DOCX files are allowed' }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
    }
  };

  const handleRemoveFile = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');

    // Simulate submission
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        designation: ''
      });
      setResume(null);
    }, 1800);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-brand-green/10">
      <h3 className="text-xl font-bold text-brand-green-dark mb-2 uppercase tracking-wide">
        PLEASE FILL BELOW THE FORM
      </h3>
      <p className="text-brand-gray text-sm mb-6">
        Submit your resume and contact information to apply.
      </p>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-emerald-800 mb-2">Application Submitted!</h4>
          <p className="text-sm text-emerald-600">
            Thank you for applying. Our HR team will review your application and contact you soon.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 text-sm font-semibold text-brand-green hover:text-brand-green-light underline"
          >
            Submit another application
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="career-name" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="career-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'loading'}
              className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
              }`}
              placeholder="Full Name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div>
              <label htmlFor="career-phone" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="career-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                }`}
                placeholder="Phone Number"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="career-email" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="career-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
                }`}
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Designation */}
          <div>
            <label htmlFor="career-designation" className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="career-designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={status === 'loading'}
              className={`w-full px-4 py-3 rounded-md text-sm border focus:ring-2 focus:ring-offset-2 transition-all ${
                errors.designation
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-brand-gray-muted focus:ring-brand-green focus:border-brand-green'
              }`}
              placeholder="Applying for Designation (e.g. Logistics Executive)"
            />
            {errors.designation && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.designation}</p>
            )}
          </div>

          {/* Drag & Drop Resume Upload */}
          <div>
            <label className="block text-xs font-bold text-brand-gray-dark uppercase tracking-wider mb-2">
              Upload Resume <span className="text-red-500">*</span>
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />

            {!resume ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={handleTriggerFileInput}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-brand-yellow bg-brand-yellow/5'
                    : 'border-brand-gray-muted hover:border-brand-green hover:bg-brand-gray-light'
                }`}
              >
                <div className="mx-auto w-10 h-10 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-brand-gray-dark">
                  Drag and drop your file here, or <span className="text-brand-green underline hover:text-brand-green-light">browse</span>
                </p>
                <p className="text-xs text-brand-gray mt-1">
                  Supports PDF, DOC, DOCX up to 5MB
                </p>
              </div>
            ) : (
              <div className="border border-brand-green bg-brand-green-bg/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 bg-brand-green text-white rounded">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-brand-gray-dark truncate">{resume.name}</p>
                    <p className="text-xs text-brand-gray">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleTriggerFileInput}
                    className="p-1 text-brand-gray hover:text-brand-green transition-colors"
                    title="Change File"
                  >
                    <Edit className="w-4.5 h-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-brand-gray hover:text-red-500 transition-colors"
                    title="Remove File"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            )}
            
            {errors.resume && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.resume}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-brand-green hover:bg-brand-green-light text-white font-bold py-3.5 px-6 rounded-md text-sm shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            {status === 'loading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading & Submitting...</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
