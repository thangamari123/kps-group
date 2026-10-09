// Resume Upload and Secure Access Client via Cloudflare Worker & R2
import { auth } from './firebase';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8787'
    : 'https://api.kpsgroups.net')
).replace(/\/+$/, '');

export interface ResumeUploadResult {
  success: boolean;
  key: string;
  filename: string;
  size: number;
  contentType: string;
  url: string;
}

export const resumeApi = {
  /**
   * Uploads candidate resume to Cloudflare R2 via Cloudflare Worker
   */
  async uploadResume(
    file: File,
    jobId: string,
    candidateName: string,
    candidateEmail: string
  ): Promise<ResumeUploadResult> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_id', jobId || 'general');
    formData.append('candidate_name', candidateName);
    formData.append('candidate_email', candidateEmail);

    const response = await fetch(`${API_BASE}/api/careers/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errMsg = 'Failed to upload resume';
      try {
        const json = await response.json();
        errMsg = json?.error || json?.message || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    const json = await response.json();
    const data = json.data || json;

    return {
      success: true,
      key: data.key || data.resume_key,
      filename: data.filename || data.resume_name || file.name,
      size: data.size || data.resume_size || file.size,
      contentType: data.contentType || file.type || 'application/pdf',
      url: data.url || `${API_BASE}/api/admin/resumes/stream?key=${encodeURIComponent(data.key || '')}`,
    };
  },

  /**
   * Securely streams / downloads resume PDF from R2 using current Firebase Admin token
   */
  async viewOrDownloadResume(
    applicationId: string,
    r2Key?: string,
    filename = 'Resume.pdf',
    openInNewTab = false
  ): Promise<void> {
    const idToken = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    // Build URL
    let url = `${API_BASE}/api/admin/applications/${encodeURIComponent(applicationId)}/resume`;
    if (r2Key) {
      url = `${API_BASE}/api/admin/resumes/stream?key=${encodeURIComponent(r2Key)}`;
    }
    url += `${url.includes('?') ? '&' : '?'}download=${openInNewTab ? '0' : '1'}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Failed to retrieve resume (${res.status} ${res.statusText})`);
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    if (openInNewTab) {
      window.open(blobUrl, '_blank');
    } else {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 15000);
    }
  },

  /**
   * Deletes a resume object from Cloudflare R2
   */
  async deleteResume(r2Key: string): Promise<void> {
    if (!r2Key) return;
    const idToken = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    await fetch(`${API_BASE}/api/admin/media/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key: r2Key }),
    }).catch((err) => console.warn('R2 resume deletion warning:', err));
  },
};
