// Cloudflare Worker Environment Bindings & Global Types

export interface Env {
  RESUMES_BUCKET: R2Bucket;
  MEDIA_BUCKET?: R2Bucket;
  DB: D1Database;
  FIREBASE_PROJECT_ID?: string;
  ALLOWED_ORIGINS?: string;
  SESSION_SECRET?: string;
  SETUP_SECRET?: string;
  ENVIRONMENT?: string;
  /** Google Apps Script Web App /exec URL (secret). Contact Us enquiries are stored in Google Sheets. */
  APPS_SCRIPT_URL?: string;
}

export interface MediaUploadResponse {
  success: boolean;
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

export interface AdminUser {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin' | string;
  created_at: string;
  updated_at: string;
}

export interface SessionRecord {
  id: string;
  admin_id: string;
  expires_at: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface JobRecord {
  id: string;
  title: string;
  slug: string;
  department?: string | null;
  location: string;
  employment_type: string;
  experience?: string | null;
  salary?: string | null;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  deadline?: string | null;
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface ApplicationRecord {
  id: string;
  job_id?: string | null;
  job_title?: string | null;
  name: string;
  email: string;
  phone: string;
  location?: string | null;
  experience?: string | null;
  current_company?: string | null;
  cover_letter?: string | null;
  resume_key: string;
  resume_name: string;
  resume_size: number;
  status: 'New' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  created_at: string;
  updated_at: string;
}

export interface QuoteRequestRecord {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone: string;
  service: string;
  origin: string;
  destination: string;
  cargo_weight?: string | null;
  cargo_details?: string | null;
  status: 'New' | 'Contacted' | 'In Progress' | 'Quoted' | 'Closed';
  created_at: string;
  updated_at: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name?: string | null;
  service_required?: string | null;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Closed';
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  totalQuotes: number;
  newQuotes: number;
  totalContacts: number;
  newContacts: number;
}
