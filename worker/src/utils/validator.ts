// Input and File Validators

export const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export interface PdfValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a PDF file: extension, MIME type, file size, and magic bytes header
 */
export async function validatePdfFile(file: File): Promise<PdfValidationResult> {
  if (!file) {
    return { valid: false, error: 'No file was provided' };
  }

  // Check file size
  if (file.size > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds maximum allowed size of 5MB (${(file.size / (1024 * 1024)).toFixed(2)}MB uploaded)`,
    };
  }

  if (file.size < 100) {
    return { valid: false, error: 'File is too small to be a valid PDF document' };
  }

  // Check filename extension
  const filename = file.name.toLowerCase();
  if (!filename.endsWith('.pdf')) {
    return { valid: false, error: 'Only PDF documents (.pdf) are allowed' };
  }

  // Check MIME type
  if (file.type && file.type !== 'application/pdf' && file.type !== 'application/x-pdf') {
    return { valid: false, error: 'Invalid MIME type. Must be application/pdf' };
  }

  // Verify magic bytes: first 5 bytes must be %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
  try {
    const headerSlice = file.slice(0, 5);
    const buffer = await headerSlice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const isPdfHeader =
      bytes[0] === 0x25 && // %
      bytes[1] === 0x50 && // P
      bytes[2] === 0x44 && // D
      bytes[3] === 0x46 && // F
      bytes[4] === 0x2d;   // -

    if (!isPdfHeader) {
      return { valid: false, error: 'File content does not match standard PDF structure (invalid magic bytes)' };
    }
  } catch (err: any) {
    return { valid: false, error: 'Failed to inspect file contents: ' + (err?.message || 'Unknown error') };
  }

  return { valid: true };
}

/**
 * Strips dangerous HTML tags / script injection
 */
export function sanitizeString(input: any): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .trim();
}
