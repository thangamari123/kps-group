// TypeScript Data Models for KPS Careers & Applications
import type { AuditUser } from './cms-types';

export type JobStatus = 'published' | 'draft' | 'closed' | 'archived';

export type EmploymentType =
  | 'Full Time'
  | 'Part Time'
  | 'Internship'
  | 'Contract'
  | 'Full-time'
  | 'Part-time';

export type ApplicationStatus =
  | 'New'
  | 'Reviewing'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn';

// -------------------------------------------------------------
// 1. Job Posting Model
// -------------------------------------------------------------
export interface JobItem {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experience?: string;
  salary?: string;
  description: string;
  responsibilities: string[] | string;
  requirements: string[] | string;
  qualifications?: string[] | string;
  skills?: string[] | string;
  benefits?: string[] | string;
  deadline?: any;
  status: JobStatus;
  featured: boolean;
  sortOrder: number;
  applicationCount?: number;
  newApplicationCount?: number;
  publishedAt?: any;
  createdAt: any;
  updatedAt: any;
  createdBy?: AuditUser;
  updatedBy?: AuditUser;
}

// -------------------------------------------------------------
// 2. Candidate Application Model
// -------------------------------------------------------------
export interface CandidateApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  jobSlug?: string;
  candidateName: string;
  name?: string; // alias for backwards compatibility
  email: string;
  phone: string;
  alternatePhone?: string;
  location?: string;
  city?: string;
  state?: string;
  experience?: string;
  currentCompany?: string;
  currentJobTitle?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  qualification?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;

  // Cloudflare R2 Resume References
  resumeFileName: string;
  resumeName?: string; // alias
  resumeR2Key: string;
  resumeKey?: string; // alias
  resumeUrl?: string;
  resumeFileSize?: number;
  resumeSize?: number; // alias
  resumeFileType?: string;

  status: ApplicationStatus;

  appliedAt: any;
  createdAt?: any;
  updatedAt: any;
}

// -------------------------------------------------------------
// 3. Application Pipeline Summary Stats
// -------------------------------------------------------------
export interface ApplicationPipelineStats {
  total: number;
  new: number;
  reviewing: number;
  shortlisted: number;
  interview: number;
  selected: number;
  rejected: number;
  withdrawn: number;
}
