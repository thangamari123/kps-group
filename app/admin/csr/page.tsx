'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { csrCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';
import { useToast } from '@/components/admin/Toast';
import { useAuth } from '@/lib/AuthContext';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { CSRSection, CMSPublishStatus } from '@/lib/cms-types';
import {
  HeartHandshake,
  Plus,
  Search,
  ChevronRight,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Upload,
  Video,
  Image as ImageIcon,
  X,
  RefreshCw,
  ExternalLink,
  Layers,
  Heart,
  Landmark,
  Gift,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CSR_CATEGORIES = [
  'Hero & Mission Statement',
  'Child Welfare & Nutrition',
  'Community Outreach',
  'Education & Healthcare',
  'Environmental Sustainability',
  'Employee Giving & Volunteering',
  'Partner With Us / CTA',
];

export default function AdminCSRPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [sections, setSections] = useState<CSRSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CSRSection | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: 'Child Welfare & Nutrition',
    sectionKey: '',
    mediaType: 'image' as 'image' | 'video' | 'none',
    mediaUrl: '',
    mediaKey: '',
    posterUrl: '',
    caption: '',
    ctaText: '',
    ctaLink: '',
    status: 'published' as CMSPublishStatus,
    sortOrder: 0,
  });

  // Upload Progress
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [oldMediaKey, setOldMediaKey] = useState<string | null>(null);

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<CSRSection | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const data = await csrCms.getAll(statusFilter !== 'all' ? statusFilter : undefined);
      setSections(data);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load CSR sections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchSections();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [statusFilter, authLoading, user]);

  const handleOpenCreate = () => {
    setEditingSection(null);
    setOldMediaKey(null);
    setFormData({
      title: '',
      subtitle: 'Community Action 2026',
      content: '',
      category: 'Child Welfare & Nutrition',
      sectionKey: '',
      mediaType: 'image',
      mediaUrl: '',
      mediaKey: '',
      posterUrl: '',
      caption: '',
      ctaText: '',
      ctaLink: '',
      status: 'published',
      sortOrder: sections.length + 1,
    });
    setUploadPercent(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (sec: CSRSection) => {
    setEditingSection(sec);
    setOldMediaKey(null);
    setFormData({
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      content: sec.content || '',
      category: sec.category || 'Child Welfare & Nutrition',
      sectionKey: sec.sectionKey || '',
      mediaType: sec.mediaType || 'image',
      mediaUrl: sec.mediaUrl || '',
      mediaKey: sec.mediaKey || '',
      posterUrl: sec.posterUrl || '',
      caption: sec.caption || '',
      ctaText: sec.ctaText || '',
      ctaLink: sec.ctaLink || '',
      status: sec.status || 'published',
      sortOrder: sec.sortOrder ?? 0,
    });
    setUploadPercent(0);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || formData.mediaType === 'video';
    const prefix = isVideo ? 'csr/videos' : 'csr/images';

    setUploading(true);
    setUploadPercent(0);

    try {
      if (editingSection?.mediaKey && !oldMediaKey) {
        setOldMediaKey(editingSection.mediaKey);
      }

      const result = await cmsApi.uploadMedia(file, prefix, (percent) => {
        setUploadPercent(percent);
      });

      setFormData((prev) => ({
        ...prev,
        mediaUrl: result.url,
        mediaKey: result.key,
        mediaType: isVideo ? 'video' : 'image',
      }));

      toastSuccess('CSR media uploaded to R2.');
    } catch (err: any) {
      toastError(err?.message || 'Media upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toastError('Section title and content are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingSection) {
        await csrCms.update(editingSection.id, formData);
        toastSuccess('CSR section updated.');

        if (oldMediaKey && oldMediaKey !== formData.mediaKey) {
          cmsApi.deleteMedia(oldMediaKey).catch(() => {});
        }
      } else {
        await csrCms.create(formData);
        toastSuccess('CSR section created.');
      }

      setModalOpen(false);
      fetchSections();
    } catch (err: any) {
      toastError(err?.message || 'Failed to save section.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (sec: CSRSection) => {
    const nextStatus = sec.status === 'published' ? 'draft' : 'published';
    try {
      await csrCms.update(sec.id, { status: nextStatus });
      toastSuccess(`Section marked as ${nextStatus}.`);
      setSections((prev) =>
        prev.map((s) => (s.id === sec.id ? { ...s, status: nextStatus } : s))
      );
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const updates = newSections.map((sec, idx) => ({
      id: sec.id,
      sortOrder: idx + 1,
    }));

    setSections(newSections);
    try {
      await csrCms.reorder(updates);
      toastSuccess('CSR section display order updated.');
    } catch (err: any) {
      toastError(err?.message || 'Failed to update order.');
      fetchSections();
    }
  };

  const handleConfirmDelete = async () => {
    if (!sectionToDelete) return;
    setDeleting(true);
    try {
      await csrCms.delete(sectionToDelete.id);
      if (sectionToDelete.mediaKey) {
        cmsApi.deleteMedia(sectionToDelete.mediaKey).catch(() => {});
      }
      toastSuccess('CSR section deleted.');
      setSections((prev) => prev.filter((s) => s.id !== sectionToDelete.id));
      setDeleteModalOpen(false);
      setSectionToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete section.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredSections = sections.filter((sec) => {
    const matchesSearch =
      sec.title.toLowerCase().includes(search.toLowerCase()) ||
      sec.content.toLowerCase().includes(search.toLowerCase()) ||
      (sec.category && sec.category.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || sec.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            <span className="text-[#006B4F] font-bold">CSR Initiatives</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211E] tracking-tight">CSR CMS Management</h1>
          <p className="text-xs text-[#66736E] mt-0.5">
            Manage Corporate Social Responsibility initiatives, community sponsorships, and sustainability stories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/csr"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006B4F]" />
            <span>View Public /csr</span>
          </Link>

          <button
            onClick={fetchSections}
            className="p-2.5 rounded-xl bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] transition-colors cursor-pointer shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 text-[#006B4F] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#005A43] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add CSR Section</span>
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
            placeholder="Search CSR initiatives by title, theme, description..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>
      </div>

      {/* CSR Sections Table */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4 w-12 text-center">Order</th>
                <th className="px-4 py-4 w-24">Media</th>
                <th className="px-4 py-4">Section Title & Summary</th>
                <th className="px-4 py-4">Category / Pillar</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#66736E]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Loading CSR sections...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#66736E]">
                    <HeartHandshake className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                    <p className="font-semibold text-[#17211E]">No CSR sections found</p>
                    <p className="text-[11px] mt-1">
                      Click "Add CSR Section" to create your first community initiative or focus pillar.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSections.map((sec, index) => (
                  <tr key={sec.id} className="hover:bg-[#F7F9F8] transition-colors">
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
                          {sec.sortOrder || index + 1}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === filteredSections.length - 1}
                          className="p-1 rounded text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Media Thumbnail */}
                    <td className="px-4 py-4">
                      <div className="w-20 h-14 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] overflow-hidden relative flex items-center justify-center shrink-0">
                        {sec.mediaUrl ? (
                          <img
                            src={cmsApi.resolveMediaUrl(sec.mediaUrl)}
                            alt={sec.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#EAF5F1] text-[#006B4F] flex items-center justify-center">
                            <Heart className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Content Snippet */}
                    <td className="px-4 py-4">
                      <div>
                        <button
                          onClick={() => handleOpenEdit(sec)}
                          className="font-bold text-[#17211E] text-sm hover:text-[#006B4F] text-left block"
                        >
                          {sec.title}
                        </button>
                        <p className="text-[11px] text-[#66736E] line-clamp-1 mt-0.5 max-w-lg">
                          {sec.content}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5F1] text-[#006B4F] border border-[#006B4F]/20">
                        {sec.category || 'Initiative'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(sec)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          sec.status === 'published'
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30 hover:bg-[#d4ede5]'
                            : 'bg-amber-50 text-[#D97706] border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sec.status === 'published' ? 'bg-[#006B4F]' : 'bg-[#D97706]'}`} />
                        <span>{sec.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(sec)}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors cursor-pointer"
                          title="Edit Section"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSectionToDelete(sec);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Section"
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

      {/* Add / Edit CSR Section Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#17211E]/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white border border-[#E2E9E5] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-[#E2E9E5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#006B4F] uppercase tracking-wider block">
                    CSR Section Manager
                  </span>
                  <h2 className="text-lg font-bold text-[#17211E]">
                    {editingSection ? 'Edit CSR Section' : 'Create CSR Initiative Section'}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#66736E] hover:text-[#17211E] p-1.5 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Section Title <span className="text-[#006B4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="e.g. Lunch Sponsorship at GOS Bala Vihar"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Category / Theme Pillar
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs font-medium text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                    >
                      {CSR_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subtitle / Tagline */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Subtitle / Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="e.g. Community Action 2026 • 50 Children Sponsored"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Initiative Description & Story <span className="text-[#006B4F]">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    required
                    rows={4}
                    placeholder="Describe the CSR program, community impact, partnership details..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                  />
                </div>

                {/* Media Upload */}
                <div className="p-4 bg-[#F7F9F8] border border-[#E2E9E5] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider">
                      Initiative Photo / Video (R2 Storage)
                    </label>
                    {uploading && (
                      <span className="text-[11px] font-bold text-[#006B4F]">Uploading {uploadPercent}%</span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.mediaUrl && (
                      <img
                        src={cmsApi.resolveMediaUrl(formData.mediaUrl)}
                        alt="Preview"
                        className="w-28 h-20 object-cover rounded-xl border border-[#E2E9E5] shrink-0"
                      />
                    )}

                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-[#E2E9E5] hover:bg-[#F7F9F8] text-[#17211E] font-semibold rounded-xl text-xs cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-4 h-4 text-[#006B4F]" />
                        <span>{formData.mediaUrl ? 'Replace Image / Video' : 'Upload Media to R2'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,video/mp4"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.caption}
                        onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
                        placeholder="Image caption (e.g. Distributing nutritious meals)"
                        className="w-full px-3 py-1.5 bg-white border border-[#E2E9E5] rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Status & CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      CTA Button Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData((prev) => ({ ...prev, ctaLink: e.target.value }))}
                      placeholder="/contact-us"
                      className="w-full px-3.5 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Publishing Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as CMSPublishStatus }))}
                      className={`w-full px-3.5 py-2 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
                        formData.status === 'published'
                          ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30'
                          : 'bg-amber-50 text-[#D97706] border-amber-200'
                      }`}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] rounded-xl font-semibold cursor-pointer text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="px-6 py-2 bg-[#006B4F] hover:bg-[#005A43] text-white font-bold rounded-xl text-xs shadow-sm shadow-[#006B4F]/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingSection ? 'Update Section' : 'Save CSR Section'}</span>
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
        title="Delete CSR Section?"
        message={`Are you sure you want to permanently delete "${sectionToDelete?.title}"?`}
        confirmLabel="Delete Section"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
