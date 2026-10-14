// Resume Upload and Secure Access Client via Cloudflare Worker & R2
import { auth } from './firebase';
import { buildApiUrl, getApiBaseUrl } from './api-config';

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

    const uploadUrl = buildApiUrl('/api/careers/resume/upload');
    const response = await fetch(uploadUrl, {
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
    const finalKey = data.key || data.resume_key || '';

    return {
      success: true,
      key: finalKey,
      filename: data.filename || data.resume_name || file.name,
      size: data.size || data.resume_size || file.size,
      contentType: data.contentType || file.type || 'application/pdf',
      url: data.url || (finalKey ? buildApiUrl('/api/admin/resumes/stream', { key: finalKey }) : ''),
    };
  },

  /**
   * Securely streams / downloads resume PDF from R2 using current Firebase Admin token
   * Calls Worker GET /api/admin/resumes/stream?key=...&download=0|1
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

    // Clean and extract raw R2 key if passed with URL or query parameters
    let cleanKey = (r2Key || '').trim();
    if (cleanKey.includes('key=')) {
      try {
        const parsed = cleanKey.startsWith('http')
          ? new URL(cleanKey)
          : new URL(cleanKey, 'https://dummy.local');
        const extracted = parsed.searchParams.get('key');
        if (extracted) {
          cleanKey = decodeURIComponent(extracted);
        }
      } catch {
        const match = cleanKey.match(/[?&]key=([^&]+)/);
        if (match && match[1]) {
          cleanKey = decodeURIComponent(match[1]);
        }
      }
    }

    // Build URL using centralized URL constructor
    let endpoint = '/api/admin/resumes/stream';
    const params: Record<string, string> = {
      download: openInNewTab ? '0' : '1',
    };

    if (cleanKey) {
      params.key = cleanKey;
    } else if (applicationId) {
      endpoint = `/api/admin/applications/${encodeURIComponent(applicationId)}/resume`;
    }

    const url = buildApiUrl(endpoint, params);

    const res = await fetch(url, { headers });
    if (!res.ok) {
      let errorMsg = `Failed to retrieve resume (${res.status} ${res.statusText})`;
      try {
        const errorJson = await res.json();
        if (errorJson?.error) {
          errorMsg = errorJson.error;
        }
      } catch {}
      throw new Error(errorMsg);
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    if (openInNewTab) {
      const opened = window.open(blobUrl, '_blank');
      // If popup blocker intervened, fall back to anchor click
      if (!opened) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
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

    const deleteUrl = buildApiUrl('/api/admin/media/delete');
    await fetch(deleteUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ key: r2Key }),
    }).catch((err) => console.warn('R2 resume deletion warning:', err));
  },
};

export { getApiBaseUrl, buildApiUrl };
