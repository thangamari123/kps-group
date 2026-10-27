// Frontend CMS Media Client: R2 Uploads, Deletion & URL Helpers
import { auth } from './firebase';
import { getApiBaseUrl, buildApiUrl } from './api-config';

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
    if (urlOrKey.startsWith('data:')) {
      return urlOrKey;
    }

    // Static files shipped with the website (public/images/...), e.g. the original award images: not R2 keys
    if (urlOrKey.startsWith('/images/')) {
      return urlOrKey;
    }

    // If it's a 3rd party external URL (e.g. YouTube, Vimeo, Unsplash, external CDN), leave as-is
    if (
      (urlOrKey.startsWith('http://') || urlOrKey.startsWith('https://')) &&
      !urlOrKey.includes('localhost:8787') &&
      !urlOrKey.includes('127.0.0.1:8787') &&
      !urlOrKey.includes('kps-backend-api')
    ) {
      return urlOrKey;
    }

    // Extract path if it was an absolute URL pointing to our backend API
    let path = urlOrKey;
    if (urlOrKey.startsWith('http://') || urlOrKey.startsWith('https://')) {
      try {
        const parsed = new URL(urlOrKey);
        path = parsed.pathname + parsed.search;
      } catch {
        path = urlOrKey;
      }
    }

    const cleanKey = path.replace(/^\/+/, '');
    if (cleanKey.startsWith('api/media/')) {
      return buildApiUrl(`/${cleanKey}`);
    }
    if (cleanKey.startsWith('media/')) {
      return buildApiUrl(`/api/${cleanKey}`);
    }
    return buildApiUrl(`/api/media/${cleanKey}`);
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

    const endpoint = buildApiUrl('/api/admin/media/upload');
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

      const endpoint = buildApiUrl('/api/admin/media/delete');
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

export { getApiBaseUrl, buildApiUrl };
