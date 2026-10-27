'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { awardsCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';
import { useToast } from '@/components/admin/Toast';
import { useAuth } from '@/lib/AuthContext';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { awardsData } from '@/data/awards';
import { planLegacyAwardImport, type LegacyAward } from '@/lib/awards-import';
import type { AwardItem, CMSPublishStatus } from '@/lib/cms-types';
import {
  Trophy,
  Plus,
  Search,
  ChevronRight,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  RefreshCw,
  ExternalLink,
  Calendar,
  Landmark,
  AlertCircle,
  DownloadCloud,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // same limit the Worker enforces for images
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

interface AwardForm {
  title: string;
  organization: string;
  year: string;
  category: string;
  date: string;
  description: string;
  altText: string;
  status: CMSPublishStatus;
  imageUrl: string;
  imageKey: string;
}

type FormErrors = Partial<Record<keyof AwardForm, string>>;

const emptyForm = (): AwardForm => ({
  title: '',
  organization: '',
  year: String(new Date().getFullYear()),
  category: '',
  date: '',
  description: '',
  altText: '',
  status: 'published',
  imageUrl: '',
  imageKey: '',
});

/** Returns an error message for a file that cannot be used as an award image, otherwise null. */
function validateImageFile(file: File): string | null {
  const extensionOk = /\.(jpe?g|png|webp|avif)$/i.test(file.name);
  const typeOk = !file.type || file.type.startsWith('image/');
  if (!extensionOk || !typeOk) {
    return 'Invalid image format. Please upload a JPG, PNG, WebP or AVIF image.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). The maximum size is 20 MB.`;
  }
  return null;
}

/** Path stored on the award record for an uploaded image: the Worker's delivery route, without the API host. */
function deliveryPath(result: { key: string; url: string }): string {
  try {
    return new URL(result.url).pathname;
  } catch {
    return `/api/media/${result.key}`;
  }
}

export default function AdminAwardsPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [items, setItems] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Import of the original website awards
  const [importing, setImporting] = useState(false);

  // Add / edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AwardItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AwardForm>(emptyForm());
  const [errors, setErrors] = useState<FormErrors>({});

  // Image upload (to Cloudflare R2 through the Worker)
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const cancelUploadRef = useRef<{ abort?: () => void }>({});
  // Key of an image uploaded in this modal session that has not been saved on a record yet
  const pendingKeyRef = useRef<string | null>(null);

  // Deletion
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AwardItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const data = await awardsCms.getAll();
      setItems(data);
      setLoadFailed(false);
    } catch (err: any) {
      setLoadFailed(true);
      toastError(err?.message || 'Failed to load awards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchAwards();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  // Original website awards that are not in the admin panel yet
  const legacyPlan = useMemo(() => planLegacyAwardImport(awardsData as LegacyAward[], items), [items]);

  const years = useMemo(
    () => Array.from(new Set(items.map((i) => String(i.year)).filter(Boolean))).sort().reverse(),
    [items]
  );
  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category).filter(Boolean))).sort(),
    [items]
  );

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.organization && item.organization.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesYear = yearFilter === 'all' || String(item.year) === yearFilter;
    return matchesSearch && matchesStatus && matchesYear;
  });
  const canReorder = !search.trim() && statusFilter === 'all' && yearFilter === 'all';

  // ---------------------------------------------------------------- import
  const handleImport = async () => {
    if (legacyPlan.toCreate.length === 0) return;
    setImporting(true);
    try {
      const created = await awardsCms.createManyIfAbsent(
        legacyPlan.toCreate.map((c) => ({ id: c.id, data: c.data }))
      );
      try {
        await awardsCms.markManagedInAdmin();
      } catch (markerErr) {
        console.warn('Could not save the awards-managed marker (deploy the updated firestore.rules):', markerErr);
        toastInfo('Awards imported. Deploy the updated Firestore rules so the public page stops using its built-in list when nothing is published.');
      }
      toastSuccess(
        created > 0
          ? `Imported ${created} existing award${created === 1 ? '' : 's'} with their images.`
          : 'Nothing to import: the existing awards are already here.'
      );
    } catch (err: any) {
      toastError(`Import failed, nothing was changed: ${err?.message || 'unknown error'}. You can safely try again.`);
    } finally {
      setImporting(false);
      await fetchAwards();
    }
  };

  // ---------------------------------------------------------------- modal
  /** Removes an image uploaded in this modal session that never got saved. */
  const discardPendingUpload = () => {
    const key = pendingKeyRef.current;
    pendingKeyRef.current = null;
    if (key) cmsApi.deleteMedia(key).catch(() => {});
  };

  const closeModal = () => {
    if (uploading) {
      cancelUploadRef.current.abort?.();
    }
    discardPendingUpload();
    setModalOpen(false);
  };

  const handleOpenCreate = () => {
    pendingKeyRef.current = null;
    setEditingItem(null);
    setFormData(emptyForm());
    setErrors({});
    setUploadPercent(0);
    setUploadStatusText('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AwardItem) => {
    pendingKeyRef.current = null;
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      organization: item.organization || '',
      year: item.year !== undefined && item.year !== null ? String(item.year) : '',
      category: item.category || '',
      date: item.date || '',
      description: item.description || '',
      altText: item.altText || '',
      status: item.status || 'published',
      imageUrl: item.imageUrl || '',
      imageKey: item.imageKey || '',
    });
    setErrors({});
    setUploadPercent(0);
    setUploadStatusText('');
    setModalOpen(true);
  };

  const setField = (field: keyof AwardForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const problem = validateImageFile(file);
    if (problem) {
      setErrors((prev) => ({ ...prev, imageUrl: problem }));
      toastError(problem);
      e.target.value = '';
      return;
    }

    setUploading(true);
    setUploadPercent(0);
    setUploadStatusText(`Uploading ${file.name}...`);
    setErrors((prev) => ({ ...prev, imageUrl: undefined }));

    try {
      const result = await cmsApi.uploadMedia(
        file,
        'awards/images',
        (percent) => {
          setUploadPercent(percent);
          setUploadStatusText(`Uploading ${file.name} (${percent}%)...`);
        },
        cancelUploadRef.current
      );

      // A previous unsaved upload in this session is replaced by this one
      discardPendingUpload();
      pendingKeyRef.current = result.key;

      setFormData((prev) => ({
        ...prev,
        imageUrl: deliveryPath(result),
        imageKey: result.key,
        altText: prev.altText || prev.title || file.name.split('.')[0].replace(/[-_]/g, ' '),
      }));
      setUploadStatusText('Image uploaded to Cloudflare R2.');
      toastSuccess('Image uploaded.');
    } catch (err: any) {
      toastError(err?.message || 'Image upload failed.');
      setUploadStatusText('');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const validateForm = (): FormErrors => {
    const next: FormErrors = {};
    if (!formData.title.trim()) next.title = 'Title is required.';
    if (!formData.organization.trim()) next.organization = 'Awarding organization is required.';
    const year = formData.year.trim();
    if (!/^\d{4}$/.test(year) || Number(year) < 1900 || Number(year) > 2100) {
      next.year = 'Enter a 4-digit year, e.g. 2026.';
    }
    if (!formData.description.trim()) next.description = 'Description is required.';
    if (!formData.imageUrl.trim()) next.imageUrl = 'Please upload an award image before saving.';
    return next;
  };

  /** Deletes an R2 object once nothing else uses it. Never throws; local site images have no key and are never touched. */
  const releaseMediaKey = async (key: string | undefined): Promise<'deleted' | 'kept' | 'none'> => {
    if (!key) return 'none';
    const stillUsed = await awardsCms.isMediaKeyReferenced(key);
    if (stillUsed) return 'kept';
    const ok = await cmsApi.deleteMedia(key);
    return ok ? 'deleted' : 'kept';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    const found = validateForm();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toastError(Object.values(found)[0] as string);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        organization: formData.organization.trim(),
        year: formData.year.trim(),
        category: formData.category.trim(),
        date: formData.date.trim() || undefined,
        description: formData.description.trim(),
        altText: formData.altText.trim() || formData.title.trim(),
        status: formData.status,
        imageUrl: formData.imageUrl.trim(),
        imageKey: formData.imageKey || undefined,
      };

      const previousKey = editingItem?.imageKey;

      if (editingItem) {
        await awardsCms.update(editingItem.id, payload);
      } else {
        const topOrder = items.length > 0 ? Math.min(...items.map((i) => Number(i.sortOrder) || 0)) - 1 : 1;
        await awardsCms.create({ ...payload, featured: false, sortOrder: topOrder });
      }

      // The upload is now owned by the saved record
      pendingKeyRef.current = null;

      // Keep the public page on the admin-managed list (best effort; needs the updated Firestore rules)
      awardsCms.markManagedInAdmin().catch((err) => console.warn('Could not save the awards-managed marker:', err));

      // Replaced image: remove the old R2 file only when nothing else uses it
      if (previousKey && previousKey !== formData.imageKey) {
        await releaseMediaKey(previousKey);
      }

      toastSuccess(editingItem ? 'Award updated.' : 'Award created.');
      setModalOpen(false);
      fetchAwards();
    } catch (err: any) {
      // Everything the admin typed (and any uploaded image) stays in the form so the save can be retried
      toastError(err?.message || 'Failed to save the award.');
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------------------------------- list actions
  const handleToggleStatus = async (item: AwardItem) => {
    const nextStatus: CMSPublishStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await awardsCms.update(item.id, { status: nextStatus });
      toastSuccess(nextStatus === 'published' ? 'Award published.' : 'Award unpublished (hidden from the public page).');
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i)));
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (!canReorder || targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    const updates = next.map((item, idx) => ({ id: item.id, sortOrder: idx + 1 }));

    setItems(next.map((item, idx) => ({ ...item, sortOrder: idx + 1 })));
    try {
      await awardsCms.reorder(updates);
      toastSuccess('Display order updated.');
    } catch (err: any) {
      toastError(err?.message || 'Failed to update order.');
      fetchAwards();
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await awardsCms.delete(itemToDelete.id);

      // The record is gone; now remove its R2 files, but only those no other record still uses
      const results = await Promise.all([
        releaseMediaKey(itemToDelete.imageKey),
        releaseMediaKey(itemToDelete.documentKey),
      ]);
      const keptShared = results.includes('kept');

      toastSuccess(
        keptShared
          ? 'Award deleted. Its image is still used by another record, so the file was kept.'
          : 'Award deleted.'
      );
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete the award.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E9E5] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#66736E] mb-1">
            <Link href="/admin" className="hover:text-[#006B4F]">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Content Management</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#006B4F] font-bold">Awards</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211E] tracking-tight">Awards Management</h1>
          <p className="text-xs text-[#66736E] mt-0.5">
            Manage the awards and recognitions shown on the public Awards page. Images you upload are stored in Cloudflare R2.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/awards"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006B4F]" />
            <span>View Public Awards</span>
          </Link>

          <button
            onClick={fetchAwards}
            className="p-2.5 rounded-xl bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] transition-colors cursor-pointer shadow-2xs"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 text-[#006B4F] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Award</span>
          </button>
        </div>
      </div>

      {/* Existing website awards not yet in the admin panel */}
      {!loading && !loadFailed && legacyPlan.toCreate.length > 0 && (
        <div className="bg-[#EAF5F1] border border-[#006B4F]/25 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#006B4F]/20 text-[#006B4F] flex items-center justify-center shrink-0">
                <DownloadCloud className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-[#17211E]">
                  {legacyPlan.toCreate.length} existing website award{legacyPlan.toCreate.length === 1 ? '' : 's'} not managed here yet
                </h2>
                <p className="text-xs text-[#4b5563] mt-0.5 max-w-2xl">
                  Import the awards that are already on the public Awards page so you can edit, hide or delete them here. Their
                  current images, titles, dates and descriptions are kept, and no image needs to be uploaded again. Running the
                  import more than once never creates duplicates.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {legacyPlan.toCreate.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 bg-white border border-[#E2E9E5] rounded-lg pr-2.5 overflow-hidden max-w-full sm:max-w-xs min-w-0">
                      <img src={cmsApi.resolveMediaUrl(c.data.imageUrl)} alt={c.data.title} className="w-10 h-10 object-cover shrink-0" />
                      <span className="text-[11px] font-semibold text-[#17211E] truncate">{c.data.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="shrink-0 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] text-white text-xs font-bold shadow-sm disabled:opacity-60 cursor-pointer transition-all duration-250 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
            >
              {importing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4" />
                  <span>Import {legacyPlan.toCreate.length} existing award{legacyPlan.toCreate.length === 1 ? '' : 's'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search awards"
            placeholder="Search awards by title, organization, category..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            aria-label="Filter by year"
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Awards Table */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4 w-12 text-center">Order</th>
                <th className="px-4 py-4 w-28">Image</th>
                <th className="px-4 py-4">Award</th>
                <th className="px-4 py-4">Year / Category</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <div className="flex flex-col items-center space-y-2" role="status">
                      <div className="w-6 h-6 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Loading awards...</span>
                    </div>
                  </td>
                </tr>
              ) : loadFailed ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <AlertCircle className="w-8 h-8 text-[#DC2626]/60 mx-auto mb-2" />
                    <p className="font-semibold text-[#17211E]">Awards could not be loaded</p>
                    <button onClick={fetchAwards} className="mt-2 text-[#006B4F] font-bold hover:underline cursor-pointer">
                      Try again
                    </button>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <Trophy className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                    <p className="font-semibold text-[#17211E]">No awards found</p>
                    <p className="text-[11px] mt-1">
                      {search || statusFilter !== 'all' || yearFilter !== 'all'
                        ? 'Try clearing your search or filters.'
                        : 'Click "Add Award" to add your first award, or import the existing website awards above.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#F7F9F8] transition-colors">
                    {/* Order Controls */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={!canReorder || index === 0}
                          className="p-1 rounded text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] disabled:opacity-20 cursor-pointer"
                          title={canReorder ? 'Move up' : 'Clear filters to reorder'}
                          aria-label={`Move ${item.title} up`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-[#66736E] font-bold">{index + 1}</span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={!canReorder || index === filteredItems.length - 1}
                          className="p-1 rounded text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] disabled:opacity-20 cursor-pointer"
                          title={canReorder ? 'Move down' : 'Clear filters to reorder'}
                          aria-label={`Move ${item.title} down`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Image */}
                    <td className="px-4 py-4">
                      <div className="w-24 h-16 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={cmsApi.resolveMediaUrl(item.imageUrl)}
                          alt={item.altText || item.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </td>

                    {/* Title & Organization */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="font-bold text-[#17211E] text-sm hover:text-[#006B4F] text-left block max-w-md"
                      >
                        {item.title}
                      </button>
                      <div className="flex items-center space-x-1 text-[11px] text-[#66736E] mt-0.5">
                        <Landmark className="w-3 h-3 text-[#006B4F] shrink-0" />
                        <span className="truncate max-w-xs">{item.organization}</span>
                      </div>
                    </td>

                    {/* Year & Category */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5F1] text-[#006B4F] border border-[#006B4F]/20">
                          {String(item.year)}
                        </span>
                        {item.category && (
                          <span className="block text-[10px] text-[#66736E] font-semibold max-w-[180px]">{item.category}</span>
                        )}
                      </div>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          item.status === 'published'
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30 hover:bg-[#d4ede5]'
                            : 'bg-amber-50 text-[#D97706] border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to publish or unpublish"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' ? 'bg-[#006B4F]' : 'bg-[#D97706]'}`} />
                        <span>{item.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-[#66736E]">
                      {item.date ? (
                        <div className="flex items-center space-x-1 text-[11px]">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                      ) : (
                        <span className="text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors cursor-pointer"
                          title="Edit Award"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Award"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Award Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211E]/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              role="dialog"
              aria-label={editingItem ? 'Edit award' : 'Add award'}
              className="bg-white border border-[#E2E9E5] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-5 sm:p-6 border-b border-[#E2E9E5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#006B4F] uppercase tracking-wider block">Awards CMS</span>
                  <h2 className="text-lg font-bold text-[#17211E]">{editingItem ? 'Edit Award' : 'Add New Award'}</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-[#66736E] hover:text-[#17211E] p-1.5 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} noValidate className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Image upload */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Award Image (max 20MB) <span className="text-[#006B4F]">*</span>
                  </label>

                  <div
                    className={`p-4 border-2 border-dashed rounded-2xl bg-[#F7F9F8] text-center space-y-3 transition-colors ${
                      errors.imageUrl ? 'border-[#DC2626]/60' : 'border-[#E2E9E5] hover:border-[#006B4F]'
                    }`}
                  >
                    {formData.imageUrl ? (
                      <div className="space-y-3">
                        <div className="max-h-56 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-[#E2E9E5] p-2">
                          <img
                            src={cmsApi.resolveMediaUrl(formData.imageUrl)}
                            alt="Award preview"
                            className="max-h-52 w-auto max-w-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#66736E] px-2 font-mono gap-3">
                          <span className="truncate">
                            {formData.imageKey ? `R2: ${formData.imageKey}` : `Site image: ${formData.imageUrl}`}
                          </span>
                          <label className="text-[#006B4F] font-bold hover:underline cursor-pointer shrink-0">
                            Replace Image
                            <input type="file" accept={IMAGE_ACCEPT} onChange={handleFileUpload} disabled={uploading} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6">
                        <Upload className="w-8 h-8 text-[#006B4F] mx-auto mb-2 opacity-80" />
                        <p className="font-semibold text-[#17211E] text-xs">Select an image to upload to Cloudflare R2</p>
                        <p className="text-[10px] text-[#66736E] mt-1">WebP, JPG, PNG or AVIF up to 20MB</p>
                        <label className="mt-3 inline-block px-4 py-2 bg-[#006B4F] hover:bg-[#005A43] text-white font-bold rounded-xl cursor-pointer text-xs transition-colors">
                          Choose Image
                          <input type="file" accept={IMAGE_ACCEPT} onChange={handleFileUpload} disabled={uploading} className="hidden" />
                        </label>
                      </div>
                    )}

                    {uploading && (
                      <div className="space-y-1.5 pt-2" role="status">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#006B4F]">
                          <span>{uploadStatusText}</span>
                          <span>{uploadPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#006B4F] h-2 rounded-full transition-all duration-150" style={{ width: `${uploadPercent}%` }} />
                        </div>
                      </div>
                    )}
                    {!uploading && uploadStatusText && (
                      <p className="text-[11px] font-semibold text-[#006B4F]">{uploadStatusText}</p>
                    )}
                  </div>
                  {errors.imageUrl && <p className="mt-1.5 text-[11px] font-medium text-[#DC2626]">{errors.imageUrl}</p>}
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="award-title" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Title <span className="text-[#006B4F]">*</span>
                  </label>
                  <input
                    id="award-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setField('title', e.target.value)}
                    placeholder="e.g. Best Business Partner Award 2025–2026"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] ${errors.title ? 'border-[#DC2626]/60' : 'border-[#E2E9E5]'}`}
                  />
                  {errors.title && <p className="mt-1 text-[11px] font-medium text-[#DC2626]">{errors.title}</p>}
                </div>

                {/* Organization & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="award-org" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Awarded By <span className="text-[#006B4F]">*</span>
                    </label>
                    <input
                      id="award-org"
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setField('organization', e.target.value)}
                      placeholder="e.g. Chennai Port Authority"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] ${errors.organization ? 'border-[#DC2626]/60' : 'border-[#E2E9E5]'}`}
                    />
                    {errors.organization && <p className="mt-1 text-[11px] font-medium text-[#DC2626]">{errors.organization}</p>}
                  </div>

                  <div>
                    <label htmlFor="award-year" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Year <span className="text-[#006B4F]">*</span>
                    </label>
                    <input
                      id="award-year"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={formData.year}
                      onChange={(e) => setField('year', e.target.value.replace(/\D/g, ''))}
                      placeholder="2026"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] ${errors.year ? 'border-[#DC2626]/60' : 'border-[#E2E9E5]'}`}
                    />
                    {errors.year && <p className="mt-1 text-[11px] font-medium text-[#DC2626]">{errors.year}</p>}
                  </div>
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="award-category" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <input
                      id="award-category"
                      type="text"
                      list="award-categories"
                      value={formData.category}
                      onChange={(e) => setField('category', e.target.value)}
                      placeholder="e.g. Customs House Agency (CHA) Excellence"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                    <datalist id="award-categories">
                      {categories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label htmlFor="award-date" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Date Shown on Card
                    </label>
                    <input
                      id="award-date"
                      type="text"
                      value={formData.date}
                      onChange={(e) => setField('date', e.target.value)}
                      placeholder="e.g. 15th October 2026, Chennai"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                    <p className="mt-1 text-[10px] text-[#66736E]">Leave empty to show the year.</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="award-description" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Description <span className="text-[#006B4F]">*</span>
                  </label>
                  <textarea
                    id="award-description"
                    value={formData.description}
                    onChange={(e) => setField('description', e.target.value)}
                    rows={4}
                    placeholder="What the award recognises, shown on the card and in the detail view."
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] ${errors.description ? 'border-[#DC2626]/60' : 'border-[#E2E9E5]'}`}
                  />
                  {errors.description && <p className="mt-1 text-[11px] font-medium text-[#DC2626]">{errors.description}</p>}
                </div>

                {/* Alt text & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="award-alt" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      id="award-alt"
                      type="text"
                      value={formData.altText}
                      onChange={(e) => setField('altText', e.target.value)}
                      placeholder="Defaults to the title"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label htmlFor="award-status" className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Publishing Status
                    </label>
                    <select
                      id="award-status"
                      value={formData.status}
                      onChange={(e) => setField('status', e.target.value)}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                        formData.status === 'published'
                          ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30'
                          : 'bg-amber-50 text-[#D97706] border-amber-200'
                      }`}
                    >
                      <option value="published">Published (visible on the public page)</option>
                      <option value="draft">Draft (hidden)</option>
                    </select>
                  </div>
                </div>

                {!editingItem && (
                  <p className="text-[10px] text-[#66736E]">New awards are placed first. Use the arrows in the list to change the order.</p>
                )}

                <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#ffc107]/20 hover:border-[#ffc107] rounded-xl font-semibold cursor-pointer text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="px-6 py-2 bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white font-bold rounded-xl text-xs shadow-sm shadow-[#006B4F]/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2 transition-all duration-250 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingItem ? 'Update Award' : 'Save Award'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Award?"
        message={
          <>
            <p>
              Are you sure you want to delete <strong>&quot;{itemToDelete?.title}&quot;</strong>? It will disappear from the public Awards page.
            </p>
            <p>
              An image uploaded to Cloudflare R2 is removed only if no other record uses it. Images that ship with the website
              (public/images) are never deleted.
            </p>
          </>
        }
        confirmLabel="Delete Award"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
