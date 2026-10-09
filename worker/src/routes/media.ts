// Cloudflare Worker CMS Media Routes: Secure R2 Upload, Delete & Public Delivery
import type { Env, MediaUploadResponse } from '../types';
import { requireAuth } from '../auth/middleware';
import { jsonResponse, errorResponse, parseAllowedOrigins } from '../utils/response';

// Allowed MIME types and size constraints
const UPLOAD_CONFIG = {
  images: {
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    maxBytes: 20 * 1024 * 1024, // 20 MB
  },
  videos: {
    types: ['video/mp4', 'video/webm'],
    maxBytes: 250 * 1024 * 1024, // 250 MB
  },
  documents: {
    types: ['application/pdf'],
    maxBytes: 20 * 1024 * 1024, // 20 MB
  },
};

const ALLOWED_PREFIXES = [
  'gallery/images',
  'gallery/videos',
  'gallery/posters',
  'blogs/images',
  'blogs/videos',
  'csr/images',
  'csr/videos',
  'csr/posters',
  'awards/images',
  'awards/documents',
];

/**
 * Validates whether the uploaded file meets CMS security and type constraints
 */
function validateUploadFile(file: File, prefix: string): { valid: boolean; error?: string } {
  const mime = (file.type || '').toLowerCase();
  const size = file.size;

  const isVideoPrefix = prefix.includes('videos');
  const isDocPrefix = prefix.includes('documents');

  if (isVideoPrefix) {
    if (!UPLOAD_CONFIG.videos.types.includes(mime)) {
      return {
        valid: false,
        error: `Invalid video format "${mime}". Allowed: MP4, WebM.`,
      };
    }
    if (size > UPLOAD_CONFIG.videos.maxBytes) {
      return {
        valid: false,
        error: `Video size (${(size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 250MB.`,
      };
    }
    return { valid: true };
  }

  if (isDocPrefix) {
    if (!UPLOAD_CONFIG.documents.types.includes(mime)) {
      return {
        valid: false,
        error: `Invalid document format "${mime}". Allowed: PDF.`,
      };
    }
    if (size > UPLOAD_CONFIG.documents.maxBytes) {
      return {
        valid: false,
        error: `Document size (${(size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 20MB.`,
      };
    }
    return { valid: true };
  }

  // Default image validation
  if (!UPLOAD_CONFIG.images.types.includes(mime)) {
    return {
      valid: false,
      error: `Invalid image format "${mime}". Allowed: JPG, JPEG, PNG, WebP, AVIF.`,
    };
  }
  if (size > UPLOAD_CONFIG.images.maxBytes) {
    return {
      valid: false,
      error: `Image size (${(size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 20MB.`,
    };
  }

  return { valid: true };
}

/**
 * POST /api/admin/media/upload
 * Requires Admin Authentication via Firebase Token
 */
export async function handleUploadMedia(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // 1. Verify Authentication
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    let prefix = (formData.get('prefix') as string | null)?.trim() || 'gallery/images';

    if (!file) {
      return errorResponse('No file provided in form data', 400, request, allowedOrigins);
    }

    // Sanitize and validate prefix
    prefix = prefix.replace(/^\/+|\/+$/g, '');
    if (!ALLOWED_PREFIXES.some((p) => prefix.startsWith(p))) {
      prefix = 'gallery/images';
    }

    // Validate MIME type & file size
    const validation = validateUploadFile(file, prefix);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file', 400, request, allowedOrigins);
    }

    // Generate safe unique key
    const uniqueId = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');
    const r2Key = `${prefix}/${uniqueId}-${sanitizedName}`;

    // Target bucket (MEDIA_BUCKET or fallback RESUMES_BUCKET)
    const bucket = env.MEDIA_BUCKET || env.RESUMES_BUCKET;
    if (!bucket) {
      return errorResponse('R2 Storage bucket is not configured on the worker', 500, request, allowedOrigins);
    }

    // Stream into R2
    const fileBuffer = await file.arrayBuffer();
    await bucket.put(r2Key, fileBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        originalName: file.name,
        uploadedBy: authResult.firebaseUser.email || authResult.firebaseUser.sub,
        uploadedAt: new Date().toISOString(),
      },
    });

    const publicUrl = `/api/media/${r2Key}`;

    const responsePayload: MediaUploadResponse = {
      success: true,
      key: r2Key,
      url: publicUrl,
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    return jsonResponse(responsePayload, 201, request, allowedOrigins);
  } catch (err: any) {
    console.error('Error handling media upload to R2:', err);
    return errorResponse(`Failed to upload media: ${err?.message || 'Server error'}`, 500, request, allowedOrigins);
  }
}

/**
 * DELETE /api/admin/media/delete
 * Requires Admin Authentication via Firebase Token
 */
export async function handleDeleteMedia(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);

  // 1. Verify Authentication
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    let key: string | null = null;

    if (request.method === 'DELETE' || request.method === 'POST') {
      try {
        const body = (await request.json()) as { key?: string };
        key = body?.key || null;
      } catch {
        // Fallback to query param
      }
    }

    if (!key) {
      const url = new URL(request.url);
      key = url.searchParams.get('key');
    }

    if (!key || typeof key !== 'string' || !key.trim()) {
      return errorResponse('Missing "key" parameter to delete from R2', 400, request, allowedOrigins);
    }

    const sanitizedKey = key.trim().replace(/^\/+/, '');
    const bucket = env.MEDIA_BUCKET || env.RESUMES_BUCKET;
    if (!bucket) {
      return errorResponse('R2 Storage bucket is not configured', 500, request, allowedOrigins);
    }

    await bucket.delete(sanitizedKey);

    return jsonResponse({ success: true, deletedKey: sanitizedKey }, 200, request, allowedOrigins);
  } catch (err: any) {
    console.error('Error deleting media from R2:', err);
    return errorResponse(`Failed to delete media: ${err?.message || 'Server error'}`, 500, request, allowedOrigins);
  }
}

/**
 * GET /api/media/* or /media/*
 * Public high-performance media delivery with Range request support (HTML5 video streaming)
 */
export async function handleGetPublicMedia(request: Request, env: Env, rawKey: string): Promise<Response> {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const origin = request.headers.get('Origin');
  const corsOrigin = origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) ? origin : '*';

  try {
    if (!rawKey || !rawKey.trim()) {
      return errorResponse('Media key is required', 400, request, allowedOrigins);
    }

    const key = decodeURIComponent(rawKey.trim().replace(/^\/+/, ''));
    const bucket = env.MEDIA_BUCKET || env.RESUMES_BUCKET;
    if (!bucket) {
      return errorResponse('Storage bucket is unavailable', 500, request, allowedOrigins);
    }

    // Support HTTP Range requests for video seeking and streaming
    const rangeHeader = request.headers.get('range');
    const options: R2GetOptions = rangeHeader ? { range: request.headers } : {};

    const object = await bucket.get(key, options);

    if (!object) {
      return errorResponse(`Media item "${key}" not found`, 404, request, allowedOrigins);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', corsOrigin);
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    if (object.range) {
      // Return 206 Partial Content for video streams
      const status = 206;
      return new Response(object.body as ReadableStream, {
        status,
        headers,
      });
    }

    return new Response(object.body as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error('Error delivering media from R2:', err);
    return errorResponse('Failed to retrieve media asset', 500, request, allowedOrigins);
  }
}
