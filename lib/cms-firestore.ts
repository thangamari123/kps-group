// Cloud Firestore Service Layer for KPS CMS Operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type {
  GalleryItem,
  BlogItem,
  CSRSection,
  AwardItem,
  CMSStats,
  AuditUser,
  AnnouncementItem,
  AnnouncementSettings,
  WebinarRegistration,
  WebinarRegistrationStatus,
} from './cms-types';
import { sanitizeFirestorePayload } from './careers-firestore';

function getCurrentAuditUser(): AuditUser {
  const fbUser = auth?.currentUser;
  if (!fbUser) {
    return { uid: 'system-admin', email: 'admin@kpsgroup.com', name: 'Administrator' };
  }
  const audit: AuditUser = {
    uid: fbUser.uid,
    name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Admin'),
  };
  if (fbUser.email) {
    audit.email = fbUser.email;
  }
  return audit;
}

// -------------------------------------------------------------
// 1. GALLERY FIRESTORE OPERATIONS
// -------------------------------------------------------------
export const galleryCms = {
  async getAll(statusFilter?: string, categoryFilter?: string): Promise<GalleryItem[]> {
    try {
      const colRef = collection(db, 'gallery');
      const constraints: QueryConstraint[] = [];
      const currentUser = auth?.currentUser;

      if (!currentUser) {
        constraints.push(where('status', '==', 'published'));
      } else if (statusFilter && statusFilter !== 'all') {
        constraints.push(where('status', '==', statusFilter));
      }

      if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'All') {
        constraints.push(where('category', '==', categoryFilter));
      }

      const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as GalleryItem[];

      return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch (err: any) {
      console.warn('Gallery query failed, attempting safe fallback:', err?.message || err);
      try {
        const q = query(collection(db, 'gallery'), where('status', '==', 'published'));
        const snap = await getDocs(q);
        let items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as GalleryItem[];
        if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'All') {
          items = items.filter((i) => i.category === categoryFilter);
        }
        return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      } catch (fallbackErr) {
        console.error('Fallback gallery fetch failed:', fallbackErr);
        return [];
      }
    }
  },

  async getPublished(): Promise<GalleryItem[]> {
    return this.getAll('published');
  },

  async getById(id: string): Promise<GalleryItem | null> {
    if (!id) return null;
    try {
      const docSnap = await getDoc(doc(db, 'gallery', id));
      if (docSnap.exists()) {
        const data = docSnap.data() as GalleryItem;
        const currentUser = auth?.currentUser;
        if (currentUser || data.status === 'published') {
          return { id: docSnap.id, ...data } as GalleryItem;
        }
      }
      return null;
    } catch (err) {
      console.error(`Error fetching gallery item ${id}:`, err);
      return null;
    }
  },

  async create(data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const colRef = collection(db, 'gallery');
    const docRef = doc(colRef);
    const auditUser = getCurrentAuditUser();

    await setDoc(
      docRef,
      sanitizeFirestorePayload({
        ...data,
        sortOrder: Number(data.sortOrder) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auditUser,
        updatedBy: auditUser,
      })
    );

    return docRef.id;
  },

  async update(id: string, data: Partial<GalleryItem>): Promise<void> {
    const docRef = doc(db, 'gallery', id);
    const auditUser = getCurrentAuditUser();

    const cleanData: any = {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: auditUser,
    };
    if (cleanData.sortOrder !== undefined) {
      cleanData.sortOrder = Number(cleanData.sortOrder);
    }
    delete cleanData.id;

    await updateDoc(docRef, sanitizeFirestorePayload(cleanData));
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'gallery', id);
    await deleteDoc(docRef);
  },

  async reorder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const auditUser = getCurrentAuditUser();
    const updatePromises = items.map((item) =>
      updateDoc(
        doc(db, 'gallery', item.id),
        sanitizeFirestorePayload({
          sortOrder: item.sortOrder,
          updatedAt: serverTimestamp(),
          updatedBy: auditUser,
        })
      )
    );
    await Promise.all(updatePromises);
  },
};

// -------------------------------------------------------------
// 2. BLOGS FIRESTORE OPERATIONS
// -------------------------------------------------------------
export const blogsCms = {
  async getAll(statusFilter?: string, categoryFilter?: string): Promise<BlogItem[]> {
    try {
      const colRef = collection(db, 'blogs');
      const constraints: QueryConstraint[] = [];
      const currentUser = auth?.currentUser;

      if (!currentUser) {
        constraints.push(where('status', '==', 'published'));
      } else if (statusFilter && statusFilter !== 'all') {
        constraints.push(where('status', '==', statusFilter));
      }

      if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'All') {
        constraints.push(where('category', '==', categoryFilter));
      }

      const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as BlogItem[];

      return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch (err: any) {
      console.warn('Blogs query failed, attempting safe published fallback:', err?.message || err);
      try {
        const q = query(collection(db, 'blogs'), where('status', '==', 'published'));
        const snap = await getDocs(q);
        let items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BlogItem[];
        if (categoryFilter && categoryFilter !== 'all' && categoryFilter !== 'All') {
          items = items.filter((i) => i.category === categoryFilter);
        }
        return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      } catch (fallbackErr) {
        console.error('Fallback blogs fetch failed:', fallbackErr);
        return [];
      }
    }
  },

  async getPublished(): Promise<BlogItem[]> {
    return this.getAll('published');
  },

  async getBySlug(slug: string): Promise<BlogItem | null> {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();
    try {
      const colRef = collection(db, 'blogs');
      const currentUser = auth?.currentUser;

      let q = query(colRef, where('slug', '==', cleanSlug));
      if (!currentUser) {
        q = query(colRef, where('slug', '==', cleanSlug), where('status', '==', 'published'));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as BlogItem;
      }

      // Also allow direct lookup by document ID
      const directDoc = await getDoc(doc(db, 'blogs', slug));
      if (directDoc.exists()) {
        const data = directDoc.data() as BlogItem;
        if (currentUser || data.status === 'published') {
          return { id: directDoc.id, ...data } as BlogItem;
        }
      }

      return null;
    } catch (err) {
      console.error(`Error finding blog with slug "${slug}":`, err);
      try {
        const qPub = query(collection(db, 'blogs'), where('status', '==', 'published'));
        const snapPub = await getDocs(qPub);
        const match = snapPub.docs.find((d) => {
          const item = d.data();
          return item.slug === cleanSlug || d.id === slug;
        });
        if (match) {
          return { id: match.id, ...match.data() } as BlogItem;
        }
      } catch (fallbackErr) {
        console.error('Fallback slug lookup also failed:', fallbackErr);
      }
      return null;
    }
  },

  async getById(id: string): Promise<BlogItem | null> {
    if (!id) return null;
    try {
      const docSnap = await getDoc(doc(db, 'blogs', id));
      if (docSnap.exists()) {
        const data = docSnap.data() as BlogItem;
        const currentUser = auth?.currentUser;
        if (currentUser || data.status === 'published') {
          return { id: docSnap.id, ...data } as BlogItem;
        }
      }
      return null;
    } catch (err) {
      console.error(`Error fetching blog ${id}:`, err);
      return null;
    }
  },

  async create(data: Omit<BlogItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const colRef = collection(db, 'blogs');
    const docRef = doc(colRef);
    const auditUser = getCurrentAuditUser();

    // Clean slug
    let cleanSlug = (data.slug || data.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!cleanSlug) cleanSlug = `blog-${Date.now()}`;

    // Ensure slug uniqueness where possible
    try {
      const existingSnap = await getDocs(query(colRef, where('slug', '==', cleanSlug)));
      if (!existingSnap.empty) {
        cleanSlug = `${cleanSlug}-${Date.now().toString(36).slice(-4)}`;
      }
    } catch {
      // Non-fatal if index query not available
    }

    await setDoc(
      docRef,
      sanitizeFirestorePayload({
        ...data,
        slug: cleanSlug,
        sortOrder: Number(data.sortOrder) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: data.publishedAt || (data.status === 'published' ? new Date().toISOString() : null),
        createdBy: auditUser,
        updatedBy: auditUser,
      })
    );

    return docRef.id;
  },

  async update(id: string, data: Partial<BlogItem>): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid blog ID. Cannot update blog without a document ID.');
    }
    const docRef = doc(db, 'blogs', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`This blog post (ID: ${id}) no longer exists in Firestore. Please refresh the list.`);
    }

    const auditUser = getCurrentAuditUser();

    let cleanSlug = data.slug;
    if (cleanSlug !== undefined) {
      cleanSlug = cleanSlug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      if (!cleanSlug && data.title) {
        cleanSlug = data.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
    }

    const cleanData: any = {
      ...data,
      ...(cleanSlug !== undefined ? { slug: cleanSlug } : {}),
      updatedAt: serverTimestamp(),
      updatedBy: auditUser,
    };
    if (cleanData.sortOrder !== undefined) {
      cleanData.sortOrder = Number(cleanData.sortOrder);
    }
    delete cleanData.id;

    await updateDoc(docRef, sanitizeFirestorePayload(cleanData));
  },

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid blog ID. Cannot delete blog without a document ID.');
    }
    const docRef = doc(db, 'blogs', id);
    await deleteDoc(docRef);
  },
};

// -------------------------------------------------------------
// 3. CSR FIRESTORE OPERATIONS
// -------------------------------------------------------------
export const csrCms = {
  async getAll(statusFilter?: string): Promise<CSRSection[]> {
    try {
      const colRef = collection(db, 'csr');
      const constraints: QueryConstraint[] = [];

      if (statusFilter && statusFilter !== 'all') {
        constraints.push(where('status', '==', statusFilter));
      }

      const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CSRSection[];

      return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch (err: any) {
      console.warn('CSR query failed, attempting safe published fallback:', err?.message || err);
      try {
        const q = query(collection(db, 'csr'), where('status', '==', 'published'));
        const snap = await getDocs(q);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CSRSection[];
        return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      } catch (fallbackErr) {
        console.error('Fallback CSR fetch failed:', fallbackErr);
        return [];
      }
    }
  },

  async getPublished(): Promise<CSRSection[]> {
    return this.getAll('published');
  },

  async create(data: Omit<CSRSection, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const colRef = collection(db, 'csr');
    const docRef = doc(colRef);
    const auditUser = getCurrentAuditUser();

    await setDoc(
      docRef,
      sanitizeFirestorePayload({
        ...data,
        sortOrder: Number(data.sortOrder) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auditUser,
        updatedBy: auditUser,
      })
    );

    return docRef.id;
  },

  async update(id: string, data: Partial<CSRSection>): Promise<void> {
    const docRef = doc(db, 'csr', id);
    const auditUser = getCurrentAuditUser();

    const cleanData: any = {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: auditUser,
    };
    if (cleanData.sortOrder !== undefined) {
      cleanData.sortOrder = Number(cleanData.sortOrder);
    }
    delete cleanData.id;

    await updateDoc(docRef, sanitizeFirestorePayload(cleanData));
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'csr', id);
    await deleteDoc(docRef);
  },

  async reorder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const auditUser = getCurrentAuditUser();
    const updatePromises = items.map((item) =>
      updateDoc(
        doc(db, 'csr', item.id),
        sanitizeFirestorePayload({
          sortOrder: item.sortOrder,
          updatedAt: serverTimestamp(),
          updatedBy: auditUser,
        })
      )
    );
    await Promise.all(updatePromises);
  },
};

// -------------------------------------------------------------
// 4. AWARDS FIRESTORE OPERATIONS
// -------------------------------------------------------------
export const awardsCms = {
  async getAll(statusFilter?: string, yearFilter?: string): Promise<AwardItem[]> {
    try {
      const colRef = collection(db, 'awards');
      const constraints: QueryConstraint[] = [];

      if (statusFilter && statusFilter !== 'all') {
        constraints.push(where('status', '==', statusFilter));
      }
      if (yearFilter && yearFilter !== 'ALL' && yearFilter !== 'all') {
        constraints.push(where('year', '==', isNaN(Number(yearFilter)) ? yearFilter : Number(yearFilter)));
      }

      const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AwardItem[];

      return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch (err: any) {
      console.warn('Awards query failed, attempting safe published fallback:', err?.message || err);
      try {
        const q = query(collection(db, 'awards'), where('status', '==', 'published'));
        const snap = await getDocs(q);
        let items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as AwardItem[];
        if (yearFilter && yearFilter !== 'ALL' && yearFilter !== 'all') {
          items = items.filter((i) => String(i.year) === String(yearFilter));
        }
        return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      } catch (fallbackErr) {
        console.error('Fallback awards fetch failed:', fallbackErr);
        return [];
      }
    }
  },

  async getPublished(): Promise<AwardItem[]> {
    return this.getAll('published');
  },

  async create(data: Omit<AwardItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const colRef = collection(db, 'awards');
    const docRef = doc(colRef);
    const auditUser = getCurrentAuditUser();

    await setDoc(
      docRef,
      sanitizeFirestorePayload({
        ...data,
        year: isNaN(Number(data.year)) ? data.year : Number(data.year),
        sortOrder: Number(data.sortOrder) || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auditUser,
        updatedBy: auditUser,
      })
    );

    return docRef.id;
  },

  async update(id: string, data: Partial<AwardItem>): Promise<void> {
    const docRef = doc(db, 'awards', id);
    const auditUser = getCurrentAuditUser();

    const cleanData: any = {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: auditUser,
    };
    if (cleanData.year !== undefined && !isNaN(Number(cleanData.year))) {
      cleanData.year = Number(cleanData.year);
    }
    if (cleanData.sortOrder !== undefined) {
      cleanData.sortOrder = Number(cleanData.sortOrder);
    }
    delete cleanData.id;

    await updateDoc(docRef, sanitizeFirestorePayload(cleanData));
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, 'awards', id);
    await deleteDoc(docRef);
  },

  async reorder(items: { id: string; sortOrder: number }[]): Promise<void> {
    const auditUser = getCurrentAuditUser();
    const updatePromises = items.map((item) =>
      updateDoc(
        doc(db, 'awards', item.id),
        sanitizeFirestorePayload({
          sortOrder: item.sortOrder,
          updatedAt: serverTimestamp(),
          updatedBy: auditUser,
        })
      )
    );
    await Promise.all(updatePromises);
  },
};

// -------------------------------------------------------------
// 5. COMBINED CMS STATS
// -------------------------------------------------------------
export async function getCmsDashboardStats(): Promise<CMSStats> {
  try {
    const [gallerySnap, blogsSnap, csrSnap, awardsSnap] = await Promise.all([
      getDocs(collection(db, 'gallery')).catch(() => ({ docs: [] })),
      getDocs(collection(db, 'blogs')).catch(() => ({ docs: [] })),
      getDocs(collection(db, 'csr')).catch(() => ({ docs: [] })),
      getDocs(collection(db, 'awards')).catch(() => ({ docs: [] })),
    ]);

    const galleryDocs = gallerySnap.docs.map((d: any) => d.data());
    const blogDocs = blogsSnap.docs.map((d: any) => d.data());
    const csrDocs = csrSnap.docs.map((d: any) => d.data());
    const awardDocs = awardsSnap.docs.map((d: any) => d.data());

    return {
      galleryCount: galleryDocs.length,
      publishedGalleryCount: galleryDocs.filter((d: any) => d.status === 'published').length,
      blogsCount: blogDocs.length,
      publishedBlogsCount: blogDocs.filter((d: any) => d.status === 'published').length,
      csrCount: csrDocs.length,
      publishedCsrCount: csrDocs.filter((d: any) => d.status === 'published').length,
      awardsCount: awardDocs.length,
      publishedAwardsCount: awardDocs.filter((d: any) => d.status === 'published').length,
    };
  } catch (err) {
    console.warn('Could not compute full CMS stats (ignoring):', err);
    return {
      galleryCount: 0,
      publishedGalleryCount: 0,
      blogsCount: 0,
      publishedBlogsCount: 0,
      csrCount: 0,
      publishedCsrCount: 0,
      awardsCount: 0,
      publishedAwardsCount: 0,
    };
  }
}

// -------------------------------------------------------------
// ANNOUNCEMENT BAR FIRESTORE OPERATIONS
// -------------------------------------------------------------
const ANNOUNCEMENT_SETTINGS_DOC = ['site_settings', 'announcementBar'] as const;

// Optional text fields: an empty string means "clear this section"
const ANNOUNCEMENT_OPTIONAL_FIELDS = [
  'label',
  'date',
  'location',
  'availability',
  'ctaText',
  'linkUrl',
  'webinarTitle',
] as const;

type AnnouncementInput = Omit<
  AnnouncementItem,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;

export const announcementsCms = {
  // Admin: every announcement regardless of status
  async getAll(): Promise<AnnouncementItem[]> {
    const snapshot = await getDocs(collection(db, 'announcements'));
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as AnnouncementItem[];
    return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  // Public: only active announcements (matches the Firestore read rule)
  async getActive(): Promise<AnnouncementItem[]> {
    const q = query(collection(db, 'announcements'), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as AnnouncementItem[];
    return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  async create(data: AnnouncementInput): Promise<string> {
    const docRef = doc(collection(db, 'announcements'));
    const auditUser = getCurrentAuditUser();
    const payload: Record<string, any> = { ...data, sortOrder: Number(data.sortOrder) || 0 };
    for (const field of ANNOUNCEMENT_OPTIONAL_FIELDS) {
      if (payload[field] === '') delete payload[field];
    }
    await setDoc(
      docRef,
      sanitizeFirestorePayload({
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auditUser,
        updatedBy: auditUser,
      })
    );
    return docRef.id;
  },

  async update(id: string, data: Partial<AnnouncementInput>): Promise<void> {
    const cleanData: Record<string, any> = {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: getCurrentAuditUser(),
    };
    if (cleanData.sortOrder !== undefined) {
      cleanData.sortOrder = Number(cleanData.sortOrder) || 0;
    }
    delete cleanData.id;
    // A cleared section must be removed from the document, not silently kept
    for (const field of ANNOUNCEMENT_OPTIONAL_FIELDS) {
      if (cleanData[field] === '') cleanData[field] = deleteField();
    }
    await updateDoc(doc(db, 'announcements', id), sanitizeFirestorePayload(cleanData));
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'announcements', id));
  },

  // Bar-wide settings. A missing settings document means "enabled, pause on hover".
  async getSettings(): Promise<AnnouncementSettings> {
    const snap = await getDoc(doc(db, ...ANNOUNCEMENT_SETTINGS_DOC));
    if (!snap.exists()) return { enabled: true, pauseOnHover: true };
    const data = snap.data();
    return { enabled: data.enabled !== false, pauseOnHover: data.pauseOnHover !== false };
  },

  async updateSettings(settings: Partial<AnnouncementSettings>): Promise<void> {
    await setDoc(
      doc(db, ...ANNOUNCEMENT_SETTINGS_DOC),
      { ...settings, updatedAt: serverTimestamp(), updatedBy: getCurrentAuditUser() },
      { merge: true }
    );
  },
};

// -------------------------------------------------------------
// WEBINAR REGISTRATIONS (admin only; visitors submit through the Worker API)
// -------------------------------------------------------------
const WEBINAR_REGISTRATIONS_FETCH_LIMIT = 2000;

export const webinarRegistrationsCms = {
  // Newest first. Firestore rules only allow active admins to read this collection.
  async getAll(): Promise<WebinarRegistration[]> {
    const q = query(
      collection(db, 'webinar_registrations'),
      orderBy('createdAt', 'desc'),
      limit(WEBINAR_REGISTRATIONS_FETCH_LIMIT)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as WebinarRegistration[];
  },

  async updateStatus(id: string, status: WebinarRegistrationStatus): Promise<void> {
    await updateDoc(doc(db, 'webinar_registrations', id), {
      status,
      updatedAt: serverTimestamp(),
      updatedBy: getCurrentAuditUser(),
    });
  },
};
