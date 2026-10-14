'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { galleryCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';
import { useToast } from '@/components/admin/Toast';
import { useAuth } from '@/lib/AuthContext';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { GalleryItem, CMSPublishStatus } from '@/lib/cms-types';
import {
  Camera,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Upload,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  Sparkles,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Operations',
  'Fleet & Transport',
  'Warehousing & FTWZ',
  'Customs & Port',
  'Project Cargo',
  'Corporate Events',
  'CSR & Community',
  'General',
];

export default function AdminGalleryPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Operations',
    location: '',
    date: new Date().toISOString().split('T')[0],
    mediaType: 'image' as 'image' | 'video',
    mediaUrl: '',
    r2Key: '',
    posterUrl: '',
    posterKey: '',
    altText: '',
    caption: '',
    featured: false,
    status: 'published' as CMSPublishStatus,
    sortOrder: 0,
  });

  // Upload Progress State
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterPercent, setPosterPercent] = useState(0);
  const cancelUploadRef = useRef<{ abort?: () => void }>({});

  // Old media key to clean up on replacement
  const [oldMediaKey, setOldMediaKey] = useState<string | null>(null);
  const [oldPosterKey, setOldPosterKey] = useState<string | null>(null);

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await galleryCms.getAll(
        statusFilter !== 'all' ? statusFilter : undefined,
        categoryFilter !== 'all' ? categoryFilter : undefined
      );
      setItems(data);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchGallery();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, authLoading, user]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setOldMediaKey(null);
    setOldPosterKey(null);
    setFormData({
      title: '',
      description: '',
      category: 'Operations',
      location: 'Chennai Port & Terminals',
      date: new Date().toISOString().split('T')[0],
      mediaType: 'image',
      mediaUrl: '',
      r2Key: '',
      posterUrl: '',
      posterKey: '',
      altText: '',
      caption: '',
      featured: false,
      status: 'published',
      sortOrder: items.length + 1,
    });
    setUploadPercent(0);
    setUploadStatusText('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setOldMediaKey(null);
    setOldPosterKey(null);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Operations',
      location: item.location || '',
      date: item.date || new Date().toISOString().split('T')[0],
      mediaType: item.mediaType || 'image',
      mediaUrl: item.mediaUrl || '',
      r2Key: item.r2Key || '',
      posterUrl: item.posterUrl || '',
      posterKey: item.posterKey || '',
      altText: item.altText || '',
      caption: item.caption || '',
      featured: item.featured ?? false,
      status: item.status || 'published',
      sortOrder: item.sortOrder ?? 0,
    });
    setUploadPercent(0);
    setUploadStatusText('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || formData.mediaType === 'video';
    const prefix = isVideo ? 'gallery/videos' : 'gallery/images';

    setUploading(true);
    setUploadPercent(0);
    setUploadStatusText(`Uploading ${file.name}...`);

    try {
      if (editingItem?.r2Key && !oldMediaKey) {
        setOldMediaKey(editingItem.r2Key);
      }

      const result = await cmsApi.uploadMedia(file, prefix, (percent) => {
        setUploadPercent(percent);
        setUploadStatusText(`Uploading ${file.name} (${percent}%)...`);
      }, cancelUploadRef.current);

      setFormData((prev) => ({
        ...prev,
        mediaUrl: result.url,
        r2Key: result.key,
        mediaType: isVideo ? 'video' : 'image',
        altText: prev.altText || file.name.split('.')[0].replace(/[-_]/g, ' '),
      }));

      setUploadStatusText('✓ Media asset uploaded to Cloudflare R2 successfully!');
      toastSuccess('Media asset uploaded successfully.');
    } catch (err: any) {
      toastError(err?.message || 'Media upload failed.');
      setUploadStatusText('');
    } finally {
      setUploading(false);
    }
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPoster(true);
    setPosterPercent(0);

    try {
      if (editingItem?.posterKey && !oldPosterKey) {
        setOldPosterKey(editingItem.posterKey);
      }

      const result = await cmsApi.uploadMedia(file, 'gallery/posters', (percent) => {
        setPosterPercent(percent);
      });

      setFormData((prev) => ({
        ...prev,
        posterUrl: result.url,
        posterKey: result.key,
      }));

      toastSuccess('Video poster uploaded.');
    } catch (err: any) {
      toastError(err?.message || 'Poster upload failed.');
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Title is required.');
      return;
    }
    if (!formData.mediaUrl.trim()) {
      toastError('Please upload an image or video before saving.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await galleryCms.update(editingItem.id, formData);
        toastSuccess('Gallery item updated.');

        // Clean up old media from R2 if replaced
        if (oldMediaKey && oldMediaKey !== formData.r2Key) {
          cmsApi.deleteMedia(oldMediaKey).catch(() => {});
        }
        if (oldPosterKey && oldPosterKey !== formData.posterKey) {
          cmsApi.deleteMedia(oldPosterKey).catch(() => {});
        }
      } else {
        await galleryCms.create(formData);
        toastSuccess('Gallery item created.');
      }

      setModalOpen(false);
      fetchGallery();
    } catch (err: any) {
      toastError(err?.message || 'Failed to save gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: GalleryItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await galleryCms.update(item.id, { status: nextStatus });
      toastSuccess(`Item marked as ${nextStatus}.`);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
      );
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update sortOrder
    const updates = newItems.map((item, idx) => ({
      id: item.id,
      sortOrder: idx + 1,
    }));

    setItems(newItems);
    try {
      await galleryCms.reorder(updates);
      toastSuccess('Display order updated.');
    } catch (err: any) {
      toastError(err?.message || 'Failed to update order.');
      fetchGallery();
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      // 1. Delete from Firestore
      await galleryCms.delete(itemToDelete.id);

      // 2. Delete media & poster from R2
      if (itemToDelete.r2Key) {
        cmsApi.deleteMedia(itemToDelete.r2Key).catch(() => {});
      }
      if (itemToDelete.posterKey) {
        cmsApi.deleteMedia(itemToDelete.posterKey).catch(() => {});
      }

      toastSuccess('Gallery item and R2 media deleted.');
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete item.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || item.mediaType === typeFilter;
    return matchesSearch && matchesType;
  });

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
            <span className="text-[#006B4F] font-bold">Gallery</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211E] tracking-tight">Gallery CMS Management</h1>
          <p className="text-xs text-[#66736E] mt-0.5">
            Manage high-resolution operations photography, showcase videos, and media displayed on the public gallery.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/corporate/gallery"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006B4F]" />
            <span>View Public Gallery</span>
          </Link>

          <button
            onClick={fetchGallery}
            className="p-2.5 rounded-xl bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] transition-colors cursor-pointer shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 text-[#006B4F] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gallery Item</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gallery items by title, category, description..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
          </select>

          {/* Media Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Media</option>
            <option value="image">Photos Only</option>
            <option value="video">Videos Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Table */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4 w-12 text-center">Order</th>
                <th className="px-4 py-4 w-28">Preview</th>
                <th className="px-4 py-4">Title & Details</th>
                <th className="px-4 py-4">Type / Cat</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Date & Location</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Loading gallery assets...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <Camera className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                    <p className="font-semibold text-[#17211E]">No gallery items found</p>
                    <p className="text-[11px] mt-1">
                      {search || statusFilter !== 'all' || typeFilter !== 'all'
                        ? 'Try clearing your search or filters.'
                        : 'Click "Add Gallery Item" to upload your first corporate photo or video.'}
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
                          disabled={index === 0}
                          className="p-1 rounded text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-[#66736E] font-bold">
                          {item.sortOrder || index + 1}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === filteredItems.length - 1}
                          className="p-1 rounded text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Media Thumbnail */}
                    <td className="px-4 py-4">
                      <div className="w-24 h-16 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] overflow-hidden relative flex items-center justify-center shrink-0">
                        {item.mediaType === 'video' ? (
                          item.posterUrl ? (
                            <img
                              src={cmsApi.resolveMediaUrl(item.posterUrl)}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#004D3A] flex items-center justify-center text-white">
                              <Video className="w-6 h-6 text-emerald-300" />
                            </div>
                          )
                        ) : (
                          <img
                            src={cmsApi.resolveMediaUrl(item.mediaUrl)}
                            alt={item.altText || item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {item.mediaType === 'video' && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] text-white font-bold flex items-center space-x-0.5">
                            <Video className="w-2.5 h-2.5 text-emerald-300" />
                            <span>VID</span>
                          </span>
                        )}
                        {item.featured && (
                          <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-[#006B4F] text-[8px] text-white font-bold">
                            ★
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Title & Description */}
                    <td className="px-4 py-4">
                      <div>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="font-bold text-[#17211E] text-sm hover:text-[#006B4F] text-left block"
                        >
                          {item.title}
                        </button>
                        {item.description && (
                          <p className="text-[11px] text-[#66736E] line-clamp-1 mt-0.5 max-w-md">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Type & Category */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5F1] text-[#006B4F] border border-[#006B4F]/20">
                          {item.category}
                        </span>
                        <span className="block text-[10px] text-[#66736E] uppercase font-semibold">
                          {item.mediaType === 'video' ? '🎬 HTML5 Video' : '🖼️ High-Res Photo'}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          item.status === 'published'
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30 hover:bg-[#d4ede5]'
                            : 'bg-amber-50 text-[#D97706] border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' ? 'bg-[#006B4F]' : 'bg-[#D97706]'}`} />
                        <span>{item.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Date & Location */}
                    <td className="px-4 py-4 text-[#66736E]">
                      <div className="space-y-0.5 text-[11px]">
                        {item.date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-[#66736E]" />
                            <span>{item.date}</span>
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center space-x-1 truncate max-w-[140px]">
                            <MapPin className="w-3 h-3 text-[#006B4F]" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Item"
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

      {/* Add / Edit Gallery Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211E]/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-[#E2E9E5] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-[#E2E9E5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#006B4F] uppercase tracking-wider block">
                    Gallery CMS
                  </span>
                  <h2 className="text-lg font-bold text-[#17211E]">
                    {editingItem ? 'Edit Gallery Asset' : 'Add New Gallery Photo or Video'}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#66736E] hover:text-[#17211E] p-1.5 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Media Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Media Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, mediaType: 'image' }))}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.mediaType === 'image'
                          ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]'
                          : 'bg-white text-[#66736E] border-[#E2E9E5] hover:bg-[#F7F9F8]'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Photo / Image (JPG, PNG, WebP)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, mediaType: 'video' }))}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.mediaType === 'video'
                          ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]'
                          : 'bg-white text-[#66736E] border-[#E2E9E5] hover:bg-[#F7F9F8]'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Video (MP4, WebM)</span>
                    </button>
                  </div>
                </div>

                {/* Upload Dropzone */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Upload {formData.mediaType === 'video' ? 'Video File (Max 250MB)' : 'Image File (Max 20MB)'} <span className="text-[#006B4F]">*</span>
                  </label>

                  <div className="p-4 border-2 border-dashed border-[#E2E9E5] hover:border-[#006B4F] rounded-2xl bg-[#F7F9F8] text-center space-y-3 transition-colors">
                    {formData.mediaUrl ? (
                      <div className="space-y-3">
                        <div className="max-h-48 rounded-xl overflow-hidden bg-black/5 flex items-center justify-center border border-[#E2E9E5]">
                          {formData.mediaType === 'video' ? (
                            <video
                              src={cmsApi.resolveMediaUrl(formData.mediaUrl)}
                              controls
                              poster={formData.posterUrl ? cmsApi.resolveMediaUrl(formData.posterUrl) : undefined}
                              className="max-h-48 w-full object-contain"
                            />
                          ) : (
                            <img
                              src={cmsApi.resolveMediaUrl(formData.mediaUrl)}
                              alt="Preview"
                              className="max-h-48 w-full object-contain"
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#66736E] px-2 font-mono">
                          <span className="truncate max-w-xs">{formData.r2Key || formData.mediaUrl}</span>
                          <label className="text-[#006B4F] font-bold hover:underline cursor-pointer">
                            Replace File
                            <input
                              type="file"
                              accept={formData.mediaType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/avif'}
                              onChange={handleFileUpload}
                              disabled={uploading}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6">
                        <Upload className="w-8 h-8 text-[#006B4F] mx-auto mb-2 opacity-80" />
                        <p className="font-semibold text-[#17211E] text-xs">
                          Click to select or drop {formData.mediaType === 'video' ? 'video' : 'image'} to upload to Cloudflare R2
                        </p>
                        <p className="text-[10px] text-[#66736E] mt-1">
                          {formData.mediaType === 'video'
                            ? 'MP4 or WebM up to 250MB'
                            : 'WebP, JPG, PNG or AVIF up to 20MB'}
                        </p>
                        <label className="mt-3 inline-block px-4 py-2 bg-[#006B4F] hover:bg-[#005A43] text-white font-bold rounded-xl cursor-pointer text-xs transition-colors">
                          Choose File
                          <input
                            type="file"
                            accept={formData.mediaType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/avif'}
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* Upload Progress Bar */}
                    {uploading && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#006B4F]">
                          <span>{uploadStatusText}</span>
                          <span>{uploadPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#006B4F] h-2 rounded-full transition-all duration-150"
                            style={{ width: `${uploadPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Poster Image (For videos only) */}
                {formData.mediaType === 'video' && (
                  <div className="p-4 bg-[#F7F9F8] border border-[#E2E9E5] rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider">
                      Video Poster / Thumbnail Image (Optional)
                    </label>
                    <div className="flex items-center space-x-3">
                      {formData.posterUrl && (
                        <img
                          src={cmsApi.resolveMediaUrl(formData.posterUrl)}
                          alt="Poster"
                          className="w-16 h-12 object-cover rounded-lg border border-[#E2E9E5]"
                        />
                      )}
                      <label className="px-3.5 py-2 bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] rounded-xl font-semibold cursor-pointer text-xs">
                        {uploadingPoster ? `Uploading (${posterPercent}%)...` : formData.posterUrl ? 'Change Poster' : 'Upload Poster Image'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePosterUpload}
                          disabled={uploadingPoster}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Title <span className="text-[#006B4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="e.g. Container Vessel Unloading Operations"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs font-medium text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Chennai Port Terminal 2"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Event / Capture Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3.5 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Description / Context
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="Short description for lightbox view and public context..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                  />
                </div>

                {/* Alt Text & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      value={formData.altText}
                      onChange={(e) => setFormData((prev) => ({ ...prev, altText: e.target.value }))}
                      placeholder="Descriptive text for screen readers and SEO"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Publishing Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as CMSPublishStatus }))}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                        formData.status === 'published'
                          ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30'
                          : 'bg-amber-50 text-[#D97706] border-amber-200'
                      }`}
                    >
                      <option value="published">Published (Visible on public gallery)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-[#006B4F] rounded border-[#E2E9E5] focus:ring-[#006B4F] cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-[#17211E] cursor-pointer select-none">
                    Feature in highlight gallery hero carousel
                  </label>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#ffc107]/20 hover:border-[#ffc107] active:bg-[#e0a800]/30 rounded-xl font-semibold cursor-pointer text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
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
                      <span>{editingItem ? 'Update Asset' : 'Save Gallery Asset'}</span>
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
        title="Delete Gallery Asset?"
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This will permanently delete the record and its R2 storage file.`}
        confirmLabel="Delete Asset"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
