// Frontend API Client for KPS Backend Cloudflare Worker

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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  // Only set Content-Type to JSON if body is not FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Always send cookies for session auth
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

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
    const errorMessage = json?.error || json?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status, json);
  }

  return json.data !== undefined ? json.data : json;
}

// -------------------------------------------------------------
// Authentication API
// -------------------------------------------------------------
export const authApi = {
  login: (email: string, password: string) =>
    request<{ id: string; email: string; name: string; role: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ message: string }>('/api/admin/logout', {
      method: 'POST',
    }),

  getMe: () =>
    request<{ id: string; email: string; name: string; role: string; created_at: string }>('/api/admin/me', {
      method: 'GET',
    }),

  setup: (payload: { email: string; password: string; name?: string }, secret?: string) =>
    request<{ message: string; id: string; email: string }>('/api/admin/setup', {
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
  getPublicJobs: () => request<any[]>('/api/jobs', { method: 'GET' }),

  getPublicJobBySlug: (slug: string) => request<any>(`/api/jobs/${encodeURIComponent(slug)}`, { method: 'GET' }),

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
