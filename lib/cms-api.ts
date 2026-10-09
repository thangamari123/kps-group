// Frontend CMS Media Client: R2 Uploads, Deletion & URL Helpers
import { auth } from './firebase';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8787'
    : 'https://api.kpsgroups.net')
).replace(/\/+$/, '');

async function getFirebaseToken(): Promise<string | null> {
  if (typeof window === 'undefined' || !auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken(false);
  } catch {
    return null;
  }
}

export interface UploadProgressCallback {
  (percentage: number, loadedBytes: number, totalBytes: number): void;
}

export interface UploadResult {
  key: string;
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

export const cmsApi = {
  /**
   * Resolves a media key or partial path to a full public URL
   */
  resolveMediaUrl(urlOrKey?: string): string {
    if (!urlOrKey) return '';
    // If it is already an absolute HTTP/HTTPS URL or data URL
    if (urlOrKey.startsWith('http://') || urlOrKey.startsWith('https://') || urlOrKey.startsWith('data:')) {
      return urlOrKey;
    }

    const cleanKey = urlOrKey.replace(/^\/+/, '');
    if (cleanKey.startsWith('api/media/')) {
      return `${API_BASE}/${cleanKey}`;
    }
    return `${API_BASE}/api/media/${cleanKey}`;
  },

  /**
   * Uploads an image, video, or PDF file to R2 with live progress tracking
   */
  async uploadMedia(
    file: File,
    prefix: string = 'gallery/images',
    onProgress?: UploadProgressCallback,
    cancelRef?: { abort?: () => void }
  ): Promise<UploadResult> {
    const token = await getFirebaseToken();
    if (!token) {
      throw new Error('Authentication required: Please log in to upload media.');
    }

    const endpoint = `${API_BASE}/api/admin/media/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', prefix);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (cancelRef) {
        cancelRef.abort = () => {
          xhr.abort();
          reject(new Error('Upload cancelled by user.'));
        };
      }

      xhr.open('POST', endpoint);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
            onProgress(percent, event.loaded, event.total);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            const resolvedUrl = this.resolveMediaUrl(data.key || data.url);
            resolve({
              key: data.key,
              url: resolvedUrl,
              filename: data.filename || file.name,
              size: data.size || file.size,
              contentType: data.contentType || file.type,
            });
          } catch {
            reject(new Error('Invalid response from upload server.'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.message || errData.error || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed (${xhr.statusText || xhr.status})`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during media upload. Please check your connection.'));
      };

      xhr.onabort = () => {
        reject(new Error('Upload cancelled.'));
      };

      xhr.send(formData);
    });
  },

  /**
   * Deletes a media asset from R2 by key
   */
  async deleteMedia(key: string): Promise<boolean> {
    if (!key) return true;
    try {
      const token = await getFirebaseToken();
      if (!token) return false;

      const endpoint = `${API_BASE}/api/admin/media/delete`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key }),
      });

      return res.ok;
    } catch (err) {
      console.error(`Failed to delete media key "${key}" from R2:`, err);
      return false;
    }
  },
};
