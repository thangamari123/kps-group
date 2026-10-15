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
    types: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-m4v',
      'video/ogg',
      'video/m4v',
      'application/mp4',
    ],
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
 * Resolves accurate MIME type from filename extension or declared type
 */
export function resolveMimeType(filename: string, declaredType?: string | null): string {
  const norm = (declaredType || '').trim().toLowerCase();
  const extMatch = (filename || '').toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : '';

  if (ext === 'mp4' || ext === 'm4v') return 'video/mp4';
  if (ext === 'webm') return 'video/webm';
  if (ext === 'mov') return 'video/quicktime';
  if (ext === 'ogv' || ext === 'ogg') return 'video/ogg';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'avif') return 'image/avif';
  if (ext === 'pdf') return 'application/pdf';

  if (norm && norm !== 'application/octet-stream') {
    return norm;
  }

  return 'application/octet-stream';
}

/**
 * Validates whether the uploaded file meets CMS security and type constraints
 */
function validateUploadFile(file: File, prefix: string): { valid: boolean; error?: string; mime: string } {
  const mime = resolveMimeType(file.name, file.type);
  const size = file.size;

  const isVideoPrefix = prefix.includes('videos');
  const isDocPrefix = prefix.includes('documents');

  if (isVideoPrefix) {
    const isVideoMime = UPLOAD_CONFIG.videos.types.includes(mime) || mime.startsWith('video/');
    const isVideoExt = /\.(mp4|webm|mov|m4v|ogv)$/i.test(file.name);
    if (!isVideoMime && !isVideoExt) {
      return {
        valid: false,
        error: `Invalid video format "${file.type || 'unknown'}". Allowed: MP4, WebM, MOV.`,
        mime,
      };
    }
    if (size > UPLOAD_CONFIG.videos.maxBytes) {
      return {
        valid: false,
        error: `Video size (${(size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 250MB.`,
        mime,
      };
    }
    return { valid: true, mime };
  }

  if (isDocPrefix) {
    if (!UPLOAD_CONFIG.documents.types.includes(mime) && !/\.pdf$/i.test(file.name)) {
      return {
        valid: false,
        error: `Invalid document format "${file.type || 'unknown'}". Allowed: PDF.`,
        mime,
      };
    }
    if (size > UPLOAD_CONFIG.documents.maxBytes) {
      return {
        valid: false,
        error: `Document size (${(size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 20MB.`,
        mime,
      };
    }
    return { valid: true, mime };
  }

  // Default image validation
  const isImageMime = UPLOAD_CONFIG.images.types.includes(mime) || mime.startsWith('image/');
  const isImageExt = /\.(jpg|jpeg|png|webp|avif)$/i.test(file.name);
  if (!isImageMime && !isImageExt) {
    return {
      valid: false,
      error: `Invalid image format "${file.type || 'unknown'}". Allowed: JPG, JPEG, PNG, WebP, AVIF.`,
      mime,
    };
  }
  if (size > UPLOAD_CONFIG.images.maxBytes) {
    return {
      valid: false,
      error: `Image size (${(size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 20MB.`,
      mime,
    };
  }

  return { valid: true, mime };
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

    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|ogv)$/i.test(file.name);
    const isImageFile = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif)$/i.test(file.name);

    // Enforce mutual exclusivity of media types
    if (prefix.includes('videos') && isImageFile && !isVideoFile) {
      return errorResponse('Video selected. Switch to Photo/Image to upload an image.', 400, request, allowedOrigins);
    }
    if (prefix.includes('images') && isVideoFile && !isImageFile) {
      return errorResponse('Image selected. Switch to Video to upload a video.', 400, request, allowedOrigins);
    }

    // Sanitize and validate prefix
    prefix = prefix.replace(/^\/+|\/+$/g, '');
    if (!ALLOWED_PREFIXES.some((p) => prefix.startsWith(p))) {
      prefix = isVideoFile ? 'gallery/videos' : 'gallery/images';
    }

    // Validate MIME type & file size
    const validation = validateUploadFile(file, prefix);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file', 400, request, allowedOrigins);
    }

    const resolvedMime = validation.mime;

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
    const bodyContent = typeof file.stream === 'function' ? file.stream() : await file.arrayBuffer();
    await bucket.put(r2Key, bodyContent, {
      httpMetadata: {
        contentType: resolvedMime,
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
      contentType: resolvedMime,
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
 * GET or HEAD /api/media/* or /media/*
 * Public high-performance media delivery with RFC 7233 / 9110 Range request support (HTML5 video streaming)
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
    if (key.startsWith('resumes/') || key.startsWith('resumes_dev/') || key.startsWith('private/')) {
      return errorResponse('Forbidden: Private asset', 403, request, allowedOrigins);
    }

    const bucket = env.MEDIA_BUCKET || env.RESUMES_BUCKET;
    if (!bucket) {
      return errorResponse('Storage bucket is unavailable', 500, request, allowedOrigins);
    }

    // Handle HEAD request for fast header inspection
    if (request.method === 'HEAD') {
      const headObj = await bucket.head(key);
      if (!headObj) {
        return errorResponse(`Media item "${key}" not found`, 404, request, allowedOrigins);
      }
      const headers = new Headers();
      headObj.writeHttpMetadata(headers);
      headers.set('ETag', headObj.httpEtag);
      headers.set('Content-Type', resolveMimeType(key, headObj.httpMetadata?.contentType));
      headers.set('Content-Length', String(headObj.size));
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('Access-Control-Allow-Origin', corsOrigin);
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
      headers.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges, ETag');
      return new Response(null, { status: 200, headers });
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
    headers.set('Content-Type', resolveMimeType(key, object.httpMetadata?.contentType));
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', corsOrigin);
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
    headers.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges, ETag');

    if (object.range) {
      // Calculate Content-Range and Content-Length for RFC 7233 / 9110 compliance
      let start = 0;
      let end = object.size - 1;

      if ('offset' in object.range && object.range.offset !== undefined) {
        start = object.range.offset;
        if ('length' in object.range && object.range.length !== undefined) {
          end = start + object.range.length - 1;
        }
      } else if ('suffix' in object.range && object.range.suffix !== undefined) {
        start = Math.max(0, object.size - object.range.suffix);
        end = object.size - 1;
      }

      const chunkLength = end - start + 1;
      headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
      headers.set('Content-Length', String(chunkLength));

      return new Response(object.body as ReadableStream, {
        status: 206,
        headers,
      });
    }

    headers.set('Content-Length', String(object.size));
    return new Response(object.body as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error('Error delivering media from R2:', err);
    return errorResponse('Failed to retrieve media asset', 500, request, allowedOrigins);
  }
}
