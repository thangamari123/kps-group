// Cloudflare Worker Main Entry Point - KPS Worldwide Logistics Backend API
import type { Env } from './types';
import { handleOptions, errorResponse, jsonResponse, parseAllowedOrigins } from './utils/response';

import { handleLogin, handleLogout, handleMe, handleSetupAdmin } from './routes/auth';
import {
  handleGetPublicJobs,
  handleGetPublicJobBySlug,
  handleGetAdminJobs,
  handleCreateJob,
  handleUpdateJob,
  handleDeleteJob,
} from './routes/jobs';
import {
  handleSubmitApplication,
  handleGetAdminApplications,
  handleGetAdminApplicationById,
  handleUpdateApplication,
  handleGetResumePdf,
} from './routes/applications';
import {
  handleSubmitQuote,
  handleGetAdminQuotes,
  handleGetAdminQuoteById,
  handleUpdateQuote,
  handleDeleteQuote,
} from './routes/quotes';
import {
  handleSubmitContact,
  handleGetAdminContacts,
  handleGetAdminContactById,
  handleUpdateContact,
  handleDeleteContact,
} from './routes/contacts';
import { handleGetDashboardStats } from './routes/dashboard';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions(request, allowedOrigins);
    }

    try {
      // -------------------------------------------------------------
      // Health check
      // -------------------------------------------------------------
      if (path === '/api/health' || path === '/health') {
        return jsonResponse({ status: 'ok', service: 'kps-backend-api', timestamp: new Date().toISOString() }, 200, request, allowedOrigins);
      }

      // -------------------------------------------------------------
      // 1. Authentication Routes
      // -------------------------------------------------------------
      if (path === '/api/admin/login' && method === 'POST') {
        return await handleLogin(request, env);
      }
      if (path === '/api/admin/logout' && method === 'POST') {
        return await handleLogout(request, env);
      }
      if (path === '/api/admin/me' && method === 'GET') {
        return await handleMe(request, env);
      }
      if (path === '/api/admin/setup' && method === 'POST') {
        return await handleSetupAdmin(request, env);
      }

      // -------------------------------------------------------------
      // 2. Admin Dashboard Stats
      // -------------------------------------------------------------
      if (path === '/api/admin/dashboard/stats' && method === 'GET') {
        return await handleGetDashboardStats(request, env);
      }

      // -------------------------------------------------------------
      // 3. Career Jobs Routes
      // -------------------------------------------------------------
      // Public jobs list
      if (path === '/api/jobs' && method === 'GET') {
        return await handleGetPublicJobs(request, env);
      }
      // Public job detail by slug: /api/jobs/:slug
      if (path.startsWith('/api/jobs/') && method === 'GET') {
        const slug = path.substring('/api/jobs/'.length);
        if (slug) {
          return await handleGetPublicJobBySlug(request, env, slug);
        }
      }

      // Admin jobs list & create
      if (path === '/api/admin/jobs') {
        if (method === 'GET') return await handleGetAdminJobs(request, env);
        if (method === 'POST') return await handleCreateJob(request, env);
      }
      // Admin job item operations: /api/admin/jobs/:id
      if (path.startsWith('/api/admin/jobs/')) {
        const id = path.substring('/api/admin/jobs/'.length);
        if (id) {
          if (method === 'PUT') return await handleUpdateJob(request, env, id);
          if (method === 'DELETE') return await handleDeleteJob(request, env, id);
        }
      }

      // -------------------------------------------------------------
      // 4. Job Applications Routes
      // -------------------------------------------------------------
      // Public apply
      if (path === '/api/applications' && method === 'POST') {
        return await handleSubmitApplication(request, env);
      }
      // Admin list applications
      if (path === '/api/admin/applications' && method === 'GET') {
        return await handleGetAdminApplications(request, env);
      }
      // Admin resume download / stream: /api/admin/applications/:id/resume
      if (path.startsWith('/api/admin/applications/') && path.endsWith('/resume') && method === 'GET') {
        const parts = path.split('/');
        // format: ['', 'api', 'admin', 'applications', ':id', 'resume']
        const id = parts[4];
        if (id) {
          return await handleGetResumePdf(request, env, id);
        }
      }
      // Admin single application: /api/admin/applications/:id
      if (path.startsWith('/api/admin/applications/')) {
        const id = path.substring('/api/admin/applications/'.length);
        if (id) {
          if (method === 'GET') return await handleGetAdminApplicationById(request, env, id);
          if (method === 'PUT') return await handleUpdateApplication(request, env, id);
        }
      }

      // -------------------------------------------------------------
      // 5. Quote Requests Routes
      // -------------------------------------------------------------
      // Public submit quote
      if (path === '/api/quotes' && method === 'POST') {
        return await handleSubmitQuote(request, env);
      }
      // Admin list quotes
      if (path === '/api/admin/quotes' && method === 'GET') {
        return await handleGetAdminQuotes(request, env);
      }
      // Admin single quote: /api/admin/quotes/:id
      if (path.startsWith('/api/admin/quotes/')) {
        const id = path.substring('/api/admin/quotes/'.length);
        if (id) {
          if (method === 'GET') return await handleGetAdminQuoteById(request, env, id);
          if (method === 'PUT') return await handleUpdateQuote(request, env, id);
          if (method === 'DELETE') return await handleDeleteQuote(request, env, id);
        }
      }

      // -------------------------------------------------------------
      // 6. Contact Messages Routes
      // -------------------------------------------------------------
      // Public submit contact
      if (path === '/api/contact' && method === 'POST') {
        return await handleSubmitContact(request, env);
      }
      // Admin list contacts
      if (path === '/api/admin/contacts' && method === 'GET') {
        return await handleGetAdminContacts(request, env);
      }
      // Admin single contact: /api/admin/contacts/:id
      if (path.startsWith('/api/admin/contacts/')) {
        const id = path.substring('/api/admin/contacts/'.length);
        if (id) {
          if (method === 'GET') return await handleGetAdminContactById(request, env, id);
          if (method === 'PUT') return await handleUpdateContact(request, env, id);
          if (method === 'DELETE') return await handleDeleteContact(request, env, id);
        }
      }

      // -------------------------------------------------------------
      // 404 Route Not Found
      // -------------------------------------------------------------
      return errorResponse(`Route ${method} ${path} not found`, 404, request, allowedOrigins);
    } catch (err: any) {
      console.error('Unhandled Worker Error:', err);
      return errorResponse('Internal server error', 500, request, allowedOrigins);
    }
  },
};
