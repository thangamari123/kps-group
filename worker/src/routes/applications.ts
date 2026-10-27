// Applications & Resume Route Handlers for Cloudflare Worker & R2
import type { Env } from '../types';
import { requireAuth, checkRateLimit } from '../auth/middleware';
import { errorResponse, successResponse, parseAllowedOrigins, getCorsHeaders } from '../utils/response';
import { isValidEmail, isValidPhone, sanitizeString } from '../utils/validator';
import {
  createFirestoreDoc,
  getFirestoreDoc,
  checkDuplicateApplicationInFirestore,
} from '../utils/firestore';
import { checkJobAcceptingApplications } from '../utils/jobApplications';

// Supported Resume MIME types & extensions
const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Public: Complete Candidate Application Submission
 * Flow:
 * 1. Validate payload & candidate fields (name, email, phone, resume file).
 * 2. Validate job existence in Firestore.
 * 3. Enforce server-side duplicate check (same normalizedEmail + same jobId).
 * 4. Upload resume to private R2 bucket (resumes/{jobId}/{applicationId}/{uniqueFileId}.{ext}).
 * 5. Create application document in Firestore (applications/{applicationId}).
 * 6. Rollback / cleanup R2 file if Firestore write fails.
 */
export async function handleCreateApplication(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const projectId = env.FIREBASE_PROJECT_ID || 'kps-website-hr-panel';

  // Rate limit public applications (15 submissions per 5 minutes per IP)
  if (!checkRateLimit(request, 15, 300)) {
    return errorResponse(
      'Too many submission attempts. Please wait a few minutes and try again.',
      429,
      request,
      allowedOrigins
    );
  }

  const targetBucket = env.RESUMES_BUCKET || env.MEDIA_BUCKET;
  if (!targetBucket) {
    return errorResponse('R2 Storage bucket is not configured on Worker', 500, request, allowedOrigins);
  }

  let uploadedR2Key: string | null = null;

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return errorResponse('Content-Type must be multipart/form-data', 400, request, allowedOrigins);
    }

    const formData = await request.formData();

    // 1. Extract and sanitize fields
    const candidateName = sanitizeString(formData.get('candidate_name') || formData.get('candidateName') || formData.get('name')) || '';
    const email = sanitizeString(formData.get('email') || formData.get('candidate_email'))?.toLowerCase().trim() || '';
    const phone = sanitizeString(formData.get('phone') || formData.get('candidate_phone')) || '';
    const jobId = sanitizeString(formData.get('job_id') || formData.get('jobId')) || 'general';
    let jobTitle = sanitizeString(formData.get('job_title') || formData.get('jobTitle')) || '';
    const jobSlug = sanitizeString(formData.get('job_slug') || formData.get('jobSlug')) || '';

    const alternatePhone = sanitizeString(formData.get('alternate_phone') || formData.get('alternatePhone'));
    const location = sanitizeString(formData.get('location'));
    const city = sanitizeString(formData.get('city'));
    const state = sanitizeString(formData.get('state'));
    const experience = sanitizeString(formData.get('experience'));
    const currentCompany = sanitizeString(formData.get('current_company') || formData.get('currentCompany'));
    const currentJobTitle = sanitizeString(formData.get('current_job_title') || formData.get('currentJobTitle'));
    const expectedSalary = sanitizeString(formData.get('expected_salary') || formData.get('expectedSalary'));
    const noticePeriod = sanitizeString(formData.get('notice_period') || formData.get('noticePeriod'));
    const qualification = sanitizeString(formData.get('qualification'));
    const linkedinUrl = sanitizeString(formData.get('linkedin_url') || formData.get('linkedinUrl'));
    const portfolioUrl = sanitizeString(formData.get('portfolio_url') || formData.get('portfolioUrl'));
    const coverLetter = sanitizeString(formData.get('cover_letter') || formData.get('coverLetter'));

    const resumeFile = formData.get('resume') as File | null;

    // 2. Validate required fields
    if (!candidateName) {
      return errorResponse('Full candidate name is required', 400, request, allowedOrigins);
    }
    if (!email || !isValidEmail(email)) {
      return errorResponse('A valid email address is required', 400, request, allowedOrigins);
    }
    if (!phone || !isValidPhone(phone)) {
      return errorResponse('A valid phone number with at least 10 digits is required', 400, request, allowedOrigins);
    }
    if (!resumeFile || typeof resumeFile === 'string') {
      return errorResponse('Resume document file is required (PDF, DOC, DOCX up to 10MB)', 400, request, allowedOrigins);
    }

    // 3. Validate resume file
    if (resumeFile.size > MAX_RESUME_SIZE) {
      return errorResponse(
        `Resume file exceeds maximum allowed size of 10MB (${(resumeFile.size / (1024 * 1024)).toFixed(1)}MB provided)`,
        400,
        request,
        allowedOrigins
      );
    }

    const originalName = resumeFile.name || 'resume.pdf';
    const extMatch = originalName.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : '.pdf';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return errorResponse(
        `Unsupported file format (${ext}). Only PDF (.pdf), DOC (.doc), and DOCX (.docx) documents are permitted.`,
        400,
        request,
        allowedOrigins
      );
    }

    let mimeType = resumeFile.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (ext === '.pdf') mimeType = 'application/pdf';
      else if (ext === '.doc') mimeType = 'application/msword';
      else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // 4. The job must be published and its closing date must not have passed (general applications have no job)
    const jobGate = await checkJobAcceptingApplications(projectId, jobId);
    if (!jobGate.ok) {
      return errorResponse(jobGate.message, jobGate.status, request, allowedOrigins);
    }
    if (jobGate.title) {
      jobTitle = jobGate.title;
    }

    if (!jobTitle) {
      jobTitle = jobId === 'general' ? 'General Application' : 'Open Role';
    }

    // 5. Server-side Duplicate Protection
    const isDuplicate = await checkDuplicateApplicationInFirestore(projectId, email, jobId);
    if (isDuplicate) {
      return errorResponse(
        'You have already applied for this position.',
        409,
        request,
        allowedOrigins
      );
    }

    // 6. Generate IDs and Upload Resume to R2
    const applicationId = `app_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
    const uniqueFileId = crypto.randomUUID().substring(0, 8);
    const safeBaseName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 60);
    uploadedR2Key = `resumes/${jobId}/${applicationId}/${uniqueFileId}-${safeBaseName}`;

    const fileBuffer = await resumeFile.arrayBuffer();
    await targetBucket.put(uploadedR2Key, fileBuffer, {
      httpMetadata: {
        contentType: mimeType,
      },
      customMetadata: {
        applicationId,
        candidateName,
        candidateEmail: email,
        jobId,
        jobTitle,
        originalFilename: originalName,
        uploadedAt: new Date().toISOString(),
      },
    });

    // 7. Save Application Record in Firestore
    const nowIso = new Date().toISOString();
    const appData: Record<string, any> = {
      jobId,
      jobTitle,
      jobSlug: jobSlug || undefined,
      candidateName,
      name: candidateName,
      email,
      normalizedEmail: email,
      phone,
      alternatePhone: alternatePhone || undefined,
      location: location || undefined,
      city: city || undefined,
      state: state || undefined,
      experience: experience || undefined,
      currentCompany: currentCompany || undefined,
      currentJobTitle: currentJobTitle || undefined,
      expectedSalary: expectedSalary || undefined,
      noticePeriod: noticePeriod || 'Immediate',
      qualification: qualification || "Bachelor's Degree",
      linkedinUrl: linkedinUrl || undefined,
      portfolioUrl: portfolioUrl || undefined,
      coverLetter: coverLetter || undefined,
      resumeFileName: originalName,
      resumeR2Key: uploadedR2Key,
      resumeUrl: `/api/admin/resumes/stream?key=${encodeURIComponent(uploadedR2Key)}`,
      resumeContentType: mimeType,
      resumeFileSize: resumeFile.size,
      status: 'New',
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await createFirestoreDoc(projectId, 'applications', applicationId, appData);
    } catch (firestoreErr) {
      console.error('Firestore save failed, rolling back R2 upload:', firestoreErr);
      // Clean up orphaned R2 file
      if (uploadedR2Key) {
        await targetBucket.delete(uploadedR2Key).catch(() => {});
      }
      throw firestoreErr;
    }

    return successResponse(
      {
        id: applicationId,
        applicationId,
        jobId,
        jobTitle,
        candidateName,
        email,
        status: 'New',
        message: 'Candidate application submitted successfully.',
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    console.error('Candidate application submission error:', err);
    if (uploadedR2Key && targetBucket) {
      await targetBucket.delete(uploadedR2Key).catch(() => {});
    }
    return errorResponse(
      'Failed to submit application: ' + (err?.message || 'Server error'),
      500,
      request,
      allowedOrigins
    );
  }
}

/**
 * Public: Standalone Upload Candidate Resume to Cloudflare R2
 */
export async function handleUploadResume(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const projectId = env.FIREBASE_PROJECT_ID || 'kps-website-hr-panel';

  // Rate limit public uploads (15 uploads per 5 minutes per IP)
  if (!checkRateLimit(request, 15, 300)) {
    return errorResponse('Too many upload attempts. Please wait a few minutes and try again.', 429, request, allowedOrigins);
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return errorResponse('Content-Type must be multipart/form-data', 400, request, allowedOrigins);
    }

    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File | null;
    const jobId = sanitizeString(formData.get('job_id') || formData.get('jobId')) || 'general';
    const candidateName = sanitizeString(formData.get('candidate_name') || formData.get('candidateName')) || 'Candidate';
    const candidateEmail = sanitizeString(formData.get('candidate_email') || formData.get('email'))?.toLowerCase().trim() || '';

    if (!resumeFile || typeof resumeFile === 'string') {
      return errorResponse('Resume document file is required', 400, request, allowedOrigins);
    }

    // Do not store files for a job that is closed or past its application deadline
    const jobGate = await checkJobAcceptingApplications(projectId, jobId);
    if (!jobGate.ok) {
      return errorResponse(jobGate.message, jobGate.status, request, allowedOrigins);
    }

    // Validate size
    if (resumeFile.size > MAX_RESUME_SIZE) {
      return errorResponse(`Resume file exceeds maximum allowed size of 10MB (${(resumeFile.size / (1024 * 1024)).toFixed(1)}MB provided)`, 400, request, allowedOrigins);
    }

    // Validate extension
    const originalName = resumeFile.name || 'resume.pdf';
    const extMatch = originalName.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : '.pdf';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return errorResponse(`Unsupported file type (${ext}). Only PDF, DOC, and DOCX files are permitted.`, 400, request, allowedOrigins);
    }

    // Determine content type
    let mimeType = resumeFile.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (ext === '.pdf') mimeType = 'application/pdf';
      else if (ext === '.doc') mimeType = 'application/msword';
      else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    const targetBucket = env.RESUMES_BUCKET || env.MEDIA_BUCKET;
    if (!targetBucket) {
      return errorResponse('R2 Storage bucket is not configured on Worker', 500, request, allowedOrigins);
    }

    // Generate clean storage key: resumes/{jobId}/{applicationId}/{uniqueFileId}.{ext}
    const uniqueId = crypto.randomUUID().substring(0, 8);
    const appId = `app_${Date.now()}_${crypto.randomUUID().substring(0, 6)}`;
    const safeBaseName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 60);
    const r2Key = `resumes/${jobId}/${appId}/${uniqueId}-${safeBaseName}`;

    // Read binary and upload to R2
    const fileBuffer = await resumeFile.arrayBuffer();
    await targetBucket.put(r2Key, fileBuffer, {
      httpMetadata: {
        contentType: mimeType,
      },
      customMetadata: {
        candidateName,
        candidateEmail,
        jobId,
        originalFilename: originalName,
        uploadedAt: new Date().toISOString(),
      },
    });

    return successResponse(
      {
        key: r2Key,
        resume_key: r2Key,
        filename: originalName,
        resume_name: originalName,
        size: resumeFile.size,
        resume_size: resumeFile.size,
        contentType: mimeType,
        url: `/api/admin/resumes/stream?key=${encodeURIComponent(r2Key)}`,
      },
      201,
      request,
      allowedOrigins
    );
  } catch (err: any) {
    console.error('Resume upload error:', err);
    return errorResponse('Failed to process and store resume: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}

/**
 * Admin Only: Secure authenticated streaming / download of resume from R2
 * Flow:
 * 1. Cryptographically verify Firebase ID Token (requireAuth)
 * 2. Verify admin in Firestore (/admins/{uid})
 * 3. Read object from private R2 bucket
 * 4. Stream response with private Cache-Control and Content-Disposition (inline or attachment)
 */
export async function handleStreamResume(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const projectId = env.FIREBASE_PROJECT_ID || 'kps-website-hr-panel';

  // Require verified Firebase Admin authentication
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  try {
    const url = new URL(request.url);
    let key = url.searchParams.get('key');
    const isDownload = url.searchParams.get('download') === '1' || url.pathname.endsWith('/download');

    // If route is /api/admin/applications/:id/resume or /download, extract :id
    if (!key && url.pathname.includes('/applications/')) {
      const match = url.pathname.match(/\/applications\/([^/]+)\/resume/);
      if (match && match[1]) {
        const appId = decodeURIComponent(match[1]);
        const appDoc = await getFirestoreDoc(projectId, 'applications', appId);
        if (appDoc && appDoc.resumeR2Key) {
          key = appDoc.resumeR2Key;
        }
      }
    }

    if (!key) {
      return errorResponse('Resume key or application identifier parameter is required', 400, request, allowedOrigins);
    }

    const targetBucket = env.RESUMES_BUCKET || env.MEDIA_BUCKET;
    if (!targetBucket) {
      return errorResponse('R2 Storage bucket is not configured', 500, request, allowedOrigins);
    }

    const object = await targetBucket.get(key);
    if (!object) {
      return errorResponse('Resume file not found in R2 storage', 404, request, allowedOrigins);
    }

    const originalName = object.customMetadata?.originalFilename || key.split('/').pop() || 'Resume.pdf';
    const contentType = object.httpMetadata?.contentType || 'application/pdf';
    const dispositionType = isDownload ? 'attachment' : 'inline';
    const safeFilename = encodeURIComponent(originalName);

    const headers = getCorsHeaders(request, allowedOrigins);
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `${dispositionType}; filename="${safeFilename}"`);
    headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    return new Response(object.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error('Stream resume error:', err);
    return errorResponse('Failed to retrieve resume: ' + (err?.message || 'Server error'), 500, request, allowedOrigins);
  }
}
