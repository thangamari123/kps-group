// Cloud Firestore Service Layer for KPS Jobs & Candidate Applications
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type {
  JobItem,
  CandidateApplication,
  ApplicationPipelineStats,
  JobStatus,
  ApplicationStatus,
} from './careers-types';
import type { AuditUser } from './cms-types';

/**
 * Recursively removes `undefined` properties from objects and arrays.
 * Cloud Firestore setDoc/updateDoc fails with an error if any field is `undefined`.
 */
export function sanitizeFirestorePayload<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestorePayload(item)) as unknown as T;
  }

  // Preserve Firestore FieldValues (e.g. serverTimestamp, deleteField, etc.)
  if (
    (obj as any)._methodName ||
    ((obj as any).constructor && (obj as any).constructor.name !== 'Object')
  ) {
    return obj;
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (value !== undefined) {
      const sanitizedChild = sanitizeFirestorePayload(value);
      if (sanitizedChild !== undefined) {
        cleaned[key] = sanitizedChild;
      }
    }
  }

  return cleaned as T;
}

function getCurrentAuditUser(): AuditUser {
  const fbUser = auth?.currentUser;
  if (!fbUser) {
    return { uid: 'system-admin', email: 'admin@kpsgroup.com', name: 'Administrator' };
  }
  const audit: AuditUser = {
    uid: fbUser.uid,
    name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Admin'),
  };
  if (fbUser.email) {
    audit.email = fbUser.email;
  }
  return audit;
}

// -------------------------------------------------------------
// 1. JOBS FIRESTORE OPERATIONS
// -------------------------------------------------------------
export const jobsCms = {
  /**
   * Fetch all jobs with optional filters and compute live application counts
   */
  async getAll(
    statusFilter?: string,
    departmentFilter?: string,
    search?: string
  ): Promise<JobItem[]> {
    try {
      const colRef = collection(db, 'jobs');
      const constraints: QueryConstraint[] = [];

      if (statusFilter && statusFilter !== 'all') {
        constraints.push(where('status', '==', statusFilter));
      }
      if (departmentFilter && departmentFilter !== 'all' && departmentFilter !== 'All') {
        constraints.push(where('department', '==', departmentFilter));
      }

      const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocs(q);

      let jobs = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          employmentType: data.employmentType || data.employment_type || 'Full Time',
        } as JobItem;
      });

      // Filter in-memory if search is provided
      if (search && search.trim()) {
        const s = search.toLowerCase().trim();
        jobs = jobs.filter(
          (j) =>
            (j.title && j.title.toLowerCase().includes(s)) ||
            (j.location && j.location.toLowerCase().includes(s)) ||
            (j.department && j.department.toLowerCase().includes(s))
        );
      }

      // Fetch live application counts for each job
      try {
        const appSnap = await getDocs(collection(db, 'applications'));
        const appCounts: Record<string, { total: number; new: number }> = {};

        appSnap.docs.forEach((ad) => {
          const app = ad.data();
          const jId = app.jobId || app.job_id;
          if (jId) {
            if (!appCounts[jId]) appCounts[jId] = { total: 0, new: 0 };
            appCounts[jId].total += 1;
            if (app.status === 'New' || app.status === 'new') {
              appCounts[jId].new += 1;
            }
          }
        });

        jobs = jobs.map((j) => ({
          ...j,
          applicationCount: appCounts[j.id]?.total || 0,
          newApplicationCount: appCounts[j.id]?.new || 0,
        }));
      } catch (countErr) {
        console.warn('Could not compute application counts (ignoring):', countErr);
      }

      return jobs.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch (err: any) {
      console.error('Failed to load jobs from Firestore:', err);
      return [];
    }
  },

  /**
   * Get all published jobs for public careers page
   */
  async getPublished(): Promise<JobItem[]> {
    try {
      const colRef = collection(db, 'jobs');
      const q = query(colRef, where('status', '==', 'published'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return [];
      }

      const jobs = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          employmentType: data.employmentType || data.employment_type || 'Full Time',
        } as JobItem;
      });
      return jobs.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch (err) {
      console.error('Failed to load published jobs from Firestore:', err);
      return [];
    }
  },

  /**
   * Find single job by unique slug or ID
   */
  async getBySlug(slug: string): Promise<JobItem | null> {
    if (!slug) return null;
    const cleanSlug = slug.trim();

    try {
      const colRef = collection(db, 'jobs');
      const q = query(colRef, where('slug', '==', cleanSlug));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          employmentType: data.employmentType || data.employment_type || 'Full Time',
        } as JobItem;
      }

      // Also allow direct lookup by document ID
      const directDoc = await getDoc(doc(db, 'jobs', cleanSlug));
      if (directDoc.exists()) {
        const data = directDoc.data();
        return {
          id: directDoc.id,
          ...data,
          employmentType: data.employmentType || data.employment_type || 'Full Time',
        } as JobItem;
      }

      return null;
    } catch (err) {
      console.error(`Error finding job with slug "${cleanSlug}":`, err);
      return null;
    }
  },

  /**
   * Find job by document ID
   */
  async getById(id: string): Promise<JobItem | null> {
    if (!id) return null;
    try {
      const docSnap = await getDoc(doc(db, 'jobs', id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          employmentType: data.employmentType || data.employment_type || 'Full Time',
        } as JobItem;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching job with ID "${id}":`, err);
      return null;
    }
  },

  /**
   * Create a new job post in Firestore
   */
  async create(data: Omit<JobItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const colRef = collection(db, 'jobs');
    const docRef = doc(colRef);
    const auditUser = getCurrentAuditUser();

    // Clean slug
    let cleanSlug = (data.slug || data.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!cleanSlug) cleanSlug = `job-${Date.now()}`;

    await setDoc(
      docRef,
      sanitizeFirestorePayload({
        ...data,
        slug: cleanSlug,
        sortOrder: Number(data.sortOrder) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: data.status === 'published' ? serverTimestamp() : null,
        createdBy: auditUser,
        updatedBy: auditUser,
      })
    );

    return docRef.id;
  },

  /**
   * Update an existing job post
   */
  async update(id: string, data: Partial<JobItem>): Promise<void> {
    if (!id) {
      throw new Error('Invalid job ID. Cannot update job without a document ID.');
    }
    const docRef = doc(db, 'jobs', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('This job no longer exists. Refresh the job list and try again.');
    }

    const auditUser = getCurrentAuditUser();
    const cleanData: any = {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: auditUser,
    };
    if (cleanData.sortOrder !== undefined) {
      cleanData.sortOrder = Number(cleanData.sortOrder);
    }
    delete cleanData.id;

    await updateDoc(docRef, sanitizeFirestorePayload(cleanData));
  },

  /**
   * Soft-archive a job post to preserve historical candidate applications
   */
  async archive(id: string): Promise<void> {
    if (!id) {
      throw new Error('Invalid job ID. Cannot archive job without a document ID.');
    }
    const docRef = doc(db, 'jobs', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('This job no longer exists. Refresh the job list and try again.');
    }

    const auditUser = getCurrentAuditUser();
    await updateDoc(docRef, {
      status: 'archived',
      updatedAt: serverTimestamp(),
      updatedBy: auditUser,
    });
  },

  /**
   * Delete a job post
   */
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('Invalid job ID. Cannot delete job without a document ID.');
    }
    const docRef = doc(db, 'jobs', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('This job no longer exists. Refresh the job list and try again.');
    }

    await deleteDoc(docRef);
  },
};

// -------------------------------------------------------------
// 2. CANDIDATE APPLICATIONS FIRESTORE OPERATIONS
// -------------------------------------------------------------
export const applicationsCms = {
  /**
   * Fetch all candidate applications with optional filters
   */
  async getAll(
    jobId?: string,
    statusFilter?: string,
    search?: string,
    dateRange?: string
  ): Promise<CandidateApplication[]> {
    try {
      const colRef = collection(db, 'applications');
      const constraints: QueryConstraint[] = [];

      if (jobId && jobId !== 'all') {
        constraints.push(where('jobId', '==', jobId));
      }
      if (statusFilter && statusFilter !== 'all') {
        constraints.push(where('status', '==', statusFilter));
      }

      const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocs(q);

      let items = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          candidateName: data.candidateName || data.name || 'Candidate',
          resumeFileName: data.resumeFileName || data.resumeName || data.resume_name || 'Resume.pdf',
          resumeR2Key: data.resumeR2Key || data.resumeKey || data.resume_key || '',
          resumeFileSize: data.resumeFileSize || data.resumeSize || data.resume_size || 0,
          appliedAt: data.appliedAt || data.createdAt || data.created_at || new Date().toISOString(),
        } as CandidateApplication;
      });

      // Filter in-memory by search
      if (search && search.trim()) {
        const s = search.toLowerCase().trim();
        items = items.filter(
          (a) =>
            (a.candidateName && a.candidateName.toLowerCase().includes(s)) ||
            (a.email && a.email.toLowerCase().includes(s)) ||
            (a.phone && a.phone.includes(s)) ||
            (a.jobTitle && a.jobTitle.toLowerCase().includes(s)) ||
            (a.location && a.location.toLowerCase().includes(s))
        );
      }

      // Filter in-memory by date range
      if (dateRange && dateRange !== 'all') {
        const now = Date.now();
        let maxAgeMs = 0;
        if (dateRange === 'today') maxAgeMs = 24 * 60 * 60 * 1000;
        else if (dateRange === '7days') maxAgeMs = 7 * 24 * 60 * 60 * 1000;
        else if (dateRange === '30days') maxAgeMs = 30 * 24 * 60 * 60 * 1000;

        if (maxAgeMs > 0) {
          items = items.filter((a) => {
            const time =
              a.appliedAt?.toDate ? a.appliedAt.toDate().getTime() : new Date(a.appliedAt).getTime();
            return !isNaN(time) && now - time <= maxAgeMs;
          });
        }
      }

      // Sort newest first
      return items.sort((a, b) => {
        const timeA = a.appliedAt?.toDate ? a.appliedAt.toDate().getTime() : new Date(a.appliedAt).getTime();
        const timeB = b.appliedAt?.toDate ? b.appliedAt.toDate().getTime() : new Date(b.appliedAt).getTime();
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });
    } catch (err) {
      console.error('Failed to load applications from Firestore:', err);
      return [];
    }
  },

  /**
   * Get single application by ID
   */
  async getById(id: string): Promise<CandidateApplication | null> {
    if (!id) return null;
    try {
      const docSnap = await getDoc(doc(db, 'applications', id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          candidateName: data.candidateName || data.name || 'Candidate',
          resumeFileName: data.resumeFileName || data.resumeName || data.resume_name || 'Resume.pdf',
          resumeR2Key: data.resumeR2Key || data.resumeKey || data.resume_key || '',
          resumeFileSize: data.resumeFileSize || data.resumeSize || data.resume_size || 0,
          appliedAt: data.appliedAt || data.createdAt || data.created_at || new Date().toISOString(),
        } as CandidateApplication;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching application ${id}:`, err);
      return null;
    }
  },

  /**
   * Check for duplicate applications by same normalized email and jobId
   */
  async checkDuplicate(email: string, jobId: string): Promise<boolean> {
    if (!email || !jobId) return false;
    const cleanEmail = email.toLowerCase().trim();

    try {
      const colRef = collection(db, 'applications');
      const q = query(colRef, where('jobId', '==', jobId));
      const snap = await getDocs(q);

      const exists = snap.docs.some((d) => {
        const data = d.data();
        const appEmail = (data.normalizedEmail || data.email || '').toLowerCase().trim();
        return appEmail === cleanEmail;
      });

      return exists;
    } catch (err) {
      console.warn('Could not check for duplicate application:', err);
      return false;
    }
  },

  /**
   * Submit new candidate application to Firestore
   */
  async create(data: {
    jobId: string;
    jobTitle: string;
    jobSlug?: string;
    candidateName: string;
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
    resumeFileName: string;
    resumeR2Key: string;
    resumeUrl?: string;
    resumeFileSize?: number;
    resumeFileType?: string;
  }): Promise<string> {
    if (!data.candidateName || !data.candidateName.trim()) {
      throw new Error('Full candidate name is required');
    }
    if (!data.email || !data.email.trim()) {
      throw new Error('Valid email address is required');
    }
    if (!data.phone || !data.phone.trim()) {
      throw new Error('Candidate phone number is required');
    }
    if (!data.resumeR2Key || !data.resumeR2Key.trim()) {
      throw new Error('Resume file upload reference is required');
    }

    const colRef = collection(db, 'applications');
    const docRef = doc(colRef);

    const cleanEmail = data.email.toLowerCase().trim();
    const effectiveJobId = data.jobId || 'general';

    if (effectiveJobId && effectiveJobId !== 'general' && effectiveJobId !== 'general-application') {
      const isDuplicate = await this.checkDuplicate(cleanEmail, effectiveJobId);
      if (isDuplicate) {
        throw new Error('You have already applied for this position.');
      }
    }

    const candidateName = data.candidateName.trim();

    // Construct application document payload
    const rawPayload: Record<string, any> = {
      jobId: effectiveJobId,
      jobTitle: (data.jobTitle || (effectiveJobId === 'general' ? 'General Application' : 'Open Position')).trim(),
      jobSlug: data.jobSlug ? data.jobSlug.trim() : undefined,
      candidateName,
      name: candidateName, // backwards compatibility
      email: cleanEmail,
      normalizedEmail: cleanEmail,
      phone: data.phone.trim(),
      alternatePhone: data.alternatePhone?.trim() || undefined,
      location: data.location?.trim() || undefined,
      city: data.city?.trim() || undefined,
      state: data.state?.trim() || undefined,
      experience: data.experience?.trim() || undefined,
      currentCompany: data.currentCompany?.trim() || undefined,
      currentJobTitle: data.currentJobTitle?.trim() || undefined,
      expectedSalary: data.expectedSalary?.trim() || undefined,
      noticePeriod: data.noticePeriod?.trim() || undefined,
      qualification: data.qualification?.trim() || undefined,
      linkedinUrl: data.linkedinUrl?.trim() || undefined,
      portfolioUrl: data.portfolioUrl?.trim() || undefined,
      coverLetter: data.coverLetter?.trim() || undefined,
      resumeFileName: (data.resumeFileName || 'Resume.pdf').trim(),
      resumeR2Key: data.resumeR2Key.trim(),
      resumeUrl: data.resumeUrl?.trim() || undefined,
      resumeFileSize: typeof data.resumeFileSize === 'number' ? data.resumeFileSize : 0,
      resumeFileType: data.resumeFileType?.trim() || undefined,
      status: 'New' as ApplicationStatus,
      appliedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const sanitizedPayload = sanitizeFirestorePayload(rawPayload);

    await setDoc(docRef, sanitizedPayload);

    return docRef.id;
  },

  /**
   * Update application recruitment status
   */
  async updateStatus(id: string, status: ApplicationStatus | string): Promise<void> {
    if (!id) {
      throw new Error('Application ID is required to update status.');
    }
    const docRef = doc(db, 'applications', id);
    await updateDoc(
      docRef,
      sanitizeFirestorePayload({
        status: status || 'New',
        updatedAt: serverTimestamp(),
      })
    );
  },

  /**
   * Delete application record from Firestore
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'applications', id);
    await deleteDoc(docRef);
  },

  /**
   * Compute aggregate recruitment pipeline metrics
   */
  async getStats(): Promise<ApplicationPipelineStats> {
    try {
      const snap = await getDocs(collection(db, 'applications'));
      const apps = snap.docs.map((d) => d.data());

      return {
        total: apps.length,
        new: apps.filter((a) => (a.status || '').toLowerCase() === 'new').length,
        reviewing: apps.filter((a) => ['reviewing', 'under review'].includes((a.status || '').toLowerCase())).length,
        shortlisted: apps.filter((a) => (a.status || '').toLowerCase() === 'shortlisted').length,
        interview: apps.filter((a) => (a.status || '').toLowerCase() === 'interview').length,
        selected: apps.filter((a) => (a.status || '').toLowerCase() === 'selected').length,
        rejected: apps.filter((a) => (a.status || '').toLowerCase() === 'rejected').length,
        withdrawn: apps.filter((a) => (a.status || '').toLowerCase() === 'withdrawn').length,
      };
    } catch (err) {
      console.warn('Could not compute application pipeline stats:', err);
      return {
        total: 0,
        new: 0,
        reviewing: 0,
        shortlisted: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
        withdrawn: 0,
      };
    }
  },
};
