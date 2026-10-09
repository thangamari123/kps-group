// Frontend API Client for KPS Backend Cloudflare Worker
import { auth } from './firebase';

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8787'
    : 'https://api.kpsgroups.net')
).replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieves the current Firebase user's ID token.
 * If forceRefresh is true, requests a new token from Firebase.
 */
async function getFirebaseIdToken(forceRefresh = false): Promise<string | null> {
  if (typeof window === 'undefined' || !auth) return null;
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  try {
    return await currentUser.getIdToken(forceRefresh);
  } catch (err) {
    console.error('Failed to get Firebase ID token:', err);
    return null;
  }
}

/**
 * Universal HTTP request wrapper with automatic Firebase ID Token attachment,
 * token refresh retry on 401, and comprehensive error handling.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  // Only set Content-Type to JSON if body is not FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Attach Firebase ID Token for protected admin routes or if token is present
  const isAdminRoute = endpoint.startsWith('/api/admin');
  if (isAdminRoute) {
    const idToken = await getFirebaseIdToken(isRetry);
    if (idToken) {
      defaultHeaders['Authorization'] = `Bearer ${idToken}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });
  } catch (err: any) {
    const errorMessage = err?.message || 'Network request failed';
    throw new ApiError(errorMessage, 0, { networkError: true });
  }

  // On 401 Unauthorized: token might be expired. Force refresh and retry once.
  if (response.status === 401 && isAdminRoute && !isRetry) {
    const refreshedToken = await getFirebaseIdToken(true);
    if (refreshedToken) {
      return request<T>(endpoint, options, true);
    }
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  let json: any = {};
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch {
      json = {};
    }
  }

  if (!response.ok) {
    let errorMessage = json?.error || json?.message;
    if (!errorMessage) {
      if (response.status === 401) {
        errorMessage = 'Authentication required or session expired. Please sign in again.';
      } else if (response.status === 403) {
        errorMessage = 'You are authenticated, but you do not have admin access.';
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }
    throw new ApiError(errorMessage, response.status, json);
  }

  return json.data !== undefined ? json.data : json;
}

// -------------------------------------------------------------
// Authentication & Profile API
// -------------------------------------------------------------
export const authApi = {
  getMe: () =>
    request<{
      id: string;
      firebase_uid: string;
      email: string;
      name: string;
      role: string;
      created_at: string;
    }>('/api/admin/me', {
      method: 'GET',
    }),

  logout: () =>
    request<{ message: string }>('/api/admin/logout', {
      method: 'POST',
    }),

  setup: (payload: { firebase_uid?: string; email?: string; name?: string; role?: string }, secret?: string) =>
    request<{ message: string; id: string; firebase_uid: string; email: string }>('/api/admin/setup', {
      method: 'POST',
      headers: secret ? { 'X-Setup-Secret': secret } : {},
      body: JSON.stringify(payload),
    }),
};

// -------------------------------------------------------------
// Dashboard API
// -------------------------------------------------------------
export const dashboardApi = {
  getStats: () =>
    request<{
      stats: {
        totalJobs: number;
        activeJobs: number;
        totalApplications: number;
        newApplications: number;
        totalQuotes: number;
        newQuotes: number;
        totalContacts: number;
        newContacts: number;
      };
      recentApplications: any[];
      recentQuotes: any[];
      recentContacts: any[];
    }>('/api/admin/dashboard/stats', {
      method: 'GET',
    }),
};

// -------------------------------------------------------------
// Jobs API
// -------------------------------------------------------------
export const jobsApi = {
  getPublicJobs: async (): Promise<any[]> => {
    try {
      const data = await request<any[]>('/api/jobs', { method: 'GET' });
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch {
      return [];
    }
  },

  getPublicJobBySlug: async (slug: string): Promise<any> => {
    const data = await request<any>(`/api/jobs/${encodeURIComponent(slug)}`, { method: 'GET' });
    if (data && data.status === 'published') {
      return data;
    }
    throw new ApiError('Job position not found', 404);
  },

  getAdminJobs: (params?: { search?: string; status?: string; department?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.department) query.set('department', params.department);
    const qs = query.toString();
    return request<any[]>(`/api/admin/jobs${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  createJob: (data: any) =>
    request<any>('/api/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateJob: (id: string, data: any) =>
    request<any>(`/api/admin/jobs/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteJob: (id: string) =>
    request<any>(`/api/admin/jobs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// Applications API
// -------------------------------------------------------------
export const applicationsApi = {
  submitApplication: (formData: FormData) =>
    request<{ id: string; message: string }>('/api/applications', {
      method: 'POST',
      body: formData,
    }),

  getAdminApplications: (params?: { search?: string; status?: string; job_id?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.job_id) query.set('job_id', params.job_id);
    const qs = query.toString();
    return request<any[]>(`/api/admin/applications${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  getAdminApplicationById: (id: string) =>
    request<any>(`/api/admin/applications/${encodeURIComponent(id)}`, { method: 'GET' }),

  updateStatus: (id: string, status: string) =>
    request<any>(`/api/admin/applications/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getResumeUrl: (id: string, download = false) =>
    `${API_BASE}/api/admin/applications/${encodeURIComponent(id)}/resume${download ? '?download=1' : ''}`,

  /**
   * Securely fetch resume PDF as a blob using current Firebase credentials
   * and trigger download or return object URL.
   */
  downloadResumeFile: async (id: string, filename = 'Resume.pdf', openInNewTab = false) => {
    const idToken = await getFirebaseIdToken();
    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    const url = `${API_BASE}/api/admin/applications/${encodeURIComponent(id)}/resume${!openInNewTab ? '?download=1' : ''}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new ApiError('Failed to load resume file', response.status);
    }

    const blob = await response.blob();
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
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    }
  },
};

// -------------------------------------------------------------
// Quotes API
// -------------------------------------------------------------
export const quotesApi = {
  submitQuote: (data: any) =>
    request<{ id: string; message: string }>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAdminQuotes: (params?: { search?: string; status?: string; service?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.service) query.set('service', params.service);
    const qs = query.toString();
    return request<any[]>(`/api/admin/quotes${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  getAdminQuoteById: (id: string) =>
    request<any>(`/api/admin/quotes/${encodeURIComponent(id)}`, { method: 'GET' }),

  updateStatus: (id: string, status: string) =>
    request<any>(`/api/admin/quotes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  deleteQuote: (id: string) =>
    request<any>(`/api/admin/quotes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// Contact Messages API
// -------------------------------------------------------------
export const contactsApi = {
  submitContact: (data: any) =>
    request<{ id: string; message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAdminContacts: (params?: { search?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return request<any[]>(`/api/admin/contacts${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  getAdminContactById: (id: string) =>
    request<any>(`/api/admin/contacts/${encodeURIComponent(id)}`, { method: 'GET' }),

  updateStatus: (id: string, status: string) =>
    request<any>(`/api/admin/contacts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  deleteContact: (id: string) =>
    request<any>(`/api/admin/contacts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};
