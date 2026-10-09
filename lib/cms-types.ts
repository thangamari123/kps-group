// TypeScript Data Models for KPS CMS: Gallery, Blogs, CSR, Awards

export interface AuditUser {
  uid: string;
  email?: string;
  name?: string;
}

export type CMSPublishStatus = 'published' | 'draft' | 'archived';

// -------------------------------------------------------------
// 1. Gallery Model
// -------------------------------------------------------------
export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  location?: string;
  date?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  r2Key: string;
  posterUrl?: string;
  posterKey?: string;
  altText?: string;
  caption?: string;
  featured: boolean;
  status: CMSPublishStatus;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
  createdBy?: AuditUser;
  updatedBy?: AuditUser;
}

// -------------------------------------------------------------
// 2. Blog Post Model
// -------------------------------------------------------------
export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl: string;
  featuredImageKey?: string;
  category: string;
  tags: string[];
  author: string;
  status: CMSPublishStatus;
  publishedAt?: any;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
  createdBy?: AuditUser;
  updatedBy?: AuditUser;
}

// -------------------------------------------------------------
// 3. CSR Section Model
// -------------------------------------------------------------
export interface CSRSection {
  id: string;
  sectionKey?: string;
  title: string;
  subtitle?: string;
  content: string;
  category?: string;
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string;
  mediaKey?: string;
  posterUrl?: string;
  caption?: string;
  ctaText?: string;
  ctaLink?: string;
  status: CMSPublishStatus;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
  createdBy?: AuditUser;
  updatedBy?: AuditUser;
}

// -------------------------------------------------------------
// 4. Awards Model
// -------------------------------------------------------------
export interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: number | string;
  category: string;
  description: string;
  content?: string;
  imageUrl: string;
  imageKey?: string;
  documentUrl?: string;
  documentKey?: string;
  altText?: string;
  featured: boolean;
  status: CMSPublishStatus;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
  createdBy?: AuditUser;
  updatedBy?: AuditUser;
}

// -------------------------------------------------------------
// CMS Statistics Summary
// -------------------------------------------------------------
export interface CMSStats {
  galleryCount: number;
  publishedGalleryCount: number;
  blogsCount: number;
  publishedBlogsCount: number;
  csrCount: number;
  publishedCsrCount: number;
  awardsCount: number;
  publishedAwardsCount: number;
}
