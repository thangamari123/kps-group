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
  /** Display date shown on the public card, e.g. "15th October 2026, Chennai" (falls back to the year) */
  date?: string;
  category: string;
  description: string;
  content?: string;
  /** Local site path ("/images/...") for the original awards, or the R2 delivery path ("/api/media/<imageKey>") */
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

// -------------------------------------------------------------
// 5. Announcement Bar Model
// -------------------------------------------------------------
export type AnnouncementSpeed = 'slow' | 'medium' | 'fast';
export type AnnouncementStatus = 'active' | 'inactive';
export type AnnouncementCtaAction = 'link' | 'register';
export type AnnouncementLocationMode = 'none' | 'online' | 'offline' | 'custom';

export interface AnnouncementItem {
  id: string;
  /** Small label before the message, e.g. "Announcement" (falls back to "Announcement") */
  label?: string;
  /** Main message */
  text: string;
  /** ISO date (YYYY-MM-DD), shown as a badge, e.g. "Oct 25, 2026" */
  date?: string;
  locationMode?: AnnouncementLocationMode;
  /** Display text for the location badge ("Online", "Offline" or custom text) */
  location?: string;
  /** e.g. "Limited Seats" */
  availability?: string;
  /** CTA button text, e.g. "Register Now" */
  ctaText?: string;
  /** CTA link (also used by announcements created before the redesign) */
  linkUrl?: string;
  /** What the CTA does: open `linkUrl` (default) or the webinar registration popup */
  ctaAction?: AnnouncementCtaAction;
  /** Webinar name shown in the registration popup and stored with registrations (defaults to the message) */
  webinarTitle?: string;
  speed: AnnouncementSpeed;
  status: AnnouncementStatus;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
  createdBy?: AuditUser;
  updatedBy?: AuditUser;
}

export interface AnnouncementSettings {
  enabled: boolean;
  pauseOnHover: boolean;
}

// -------------------------------------------------------------
// 6. Webinar Registration Model
// -------------------------------------------------------------
export type WebinarRegistrationStatus = 'New' | 'Contacted' | 'Confirmed';

export interface WebinarRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  webinarName: string;
  announcementId: string;
  source?: string;
  status: WebinarRegistrationStatus;
  createdAt: any;
  updatedAt: any;
}
