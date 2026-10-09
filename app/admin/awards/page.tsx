'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { awardsCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';
import { useToast } from '@/components/admin/Toast';
import { useAuth } from '@/lib/AuthContext';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
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
  Image as ImageIcon,
  FileText,
  X,
  RefreshCw,
  ExternalLink,
  Calendar,
  Building2,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AWARD_CATEGORIES = [
  'Customs Broker of the Year',
  'Logistics Leadership & CEO Honors',
  'Freight Forwarding Excellence',
  'Port Conclave & Maritime Accolades',
  'Industrial Warehousing Partner',
  'Special Project & ODC Transport',
  'Corporate Recognition',
];

export default function AdminAwardsPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: new Date().getFullYear(),
    category: 'Customs Broker of the Year',
    description: '',
    content: '',
    imageUrl: '',
    imageKey: '',
    documentUrl: '',
    documentKey: '',
    altText: '',
    featured: false,
    status: 'published' as CMSPublishStatus,
    sortOrder: 0,
  });

  // Upload Progress
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePercent, setImagePercent] = useState(0);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docPercent, setDocPercent] = useState(0);

  const [oldImageKey, setOldImageKey] = useState<string | null>(null);
  const [oldDocKey, setOldDocKey] = useState<string | null>(null);

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [awardToDelete, setAwardToDelete] = useState<AwardItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const data = await awardsCms.getAll(
        statusFilter !== 'all' ? statusFilter : undefined,
        yearFilter !== 'all' ? yearFilter : undefined
      );
      setAwards(data);
    } catch (err: any) {
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
  }, [statusFilter, yearFilter, authLoading, user]);

  const handleOpenCreate = () => {
    setEditingAward(null);
    setOldImageKey(null);
    setOldDocKey(null);
    setFormData({
      title: '',
      organization: 'South East Cargo Conclave',
      year: new Date().getFullYear(),
      category: 'Customs Broker of the Year',
      description: '',
      content: '',
      imageUrl: '',
      imageKey: '',
      documentUrl: '',
      documentKey: '',
      altText: '',
      featured: false,
      status: 'published',
      sortOrder: awards.length + 1,
    });
    setImagePercent(0);
    setDocPercent(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (award: AwardItem) => {
    setEditingAward(award);
    setOldImageKey(null);
    setOldDocKey(null);
    setFormData({
      title: award.title || '',
      organization: award.organization || '',
      year: Number(award.year) || new Date().getFullYear(),
      category: award.category || 'Customs Broker of the Year',
      description: award.description || '',
      content: award.content || '',
      imageUrl: award.imageUrl || '',
      imageKey: award.imageKey || '',
      documentUrl: award.documentUrl || '',
      documentKey: award.documentKey || '',
      altText: award.altText || '',
      featured: award.featured ?? false,
      status: award.status || 'published',
      sortOrder: award.sortOrder ?? 0,
    });
    setImagePercent(0);
    setDocPercent(0);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImagePercent(0);

    try {
      if (editingAward?.imageKey && !oldImageKey) {
        setOldImageKey(editingAward.imageKey);
      }

      const result = await cmsApi.uploadMedia(file, 'awards/images', (percent) => {
        setImagePercent(percent);
      });

      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url,
        imageKey: result.key,
        altText: prev.altText || prev.title || file.name,
      }));

      toastSuccess('Award image uploaded to R2.');
    } catch (err: any) {
      toastError(err?.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setDocPercent(0);

    try {
      if (editingAward?.documentKey && !oldDocKey) {
        setOldDocKey(editingAward.documentKey);
      }

      const result = await cmsApi.uploadMedia(file, 'awards/documents', (percent) => {
        setDocPercent(percent);
      });

      setFormData((prev) => ({
        ...prev,
        documentUrl: result.url,
        documentKey: result.key,
      }));

      toastSuccess('Certificate / Document uploaded to R2.');
    } catch (err: any) {
      toastError(err?.message || 'Document upload failed.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) {
      toastError('Award Title and Organization are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingAward) {
        await awardsCms.update(editingAward.id, formData);
        toastSuccess('Award record updated.');

        if (oldImageKey && oldImageKey !== formData.imageKey) {
          cmsApi.deleteMedia(oldImageKey).catch(() => {});
        }
        if (oldDocKey && oldDocKey !== formData.documentKey) {
          cmsApi.deleteMedia(oldDocKey).catch(() => {});
        }
      } else {
        await awardsCms.create(formData);
        toastSuccess('Award record created.');
      }

      setModalOpen(false);
      fetchAwards();
    } catch (err: any) {
      toastError(err?.message || 'Failed to save award.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (award: AwardItem) => {
    const nextStatus = award.status === 'published' ? 'draft' : 'published';
    try {
      await awardsCms.update(award.id, { status: nextStatus });
      toastSuccess(`Award marked as ${nextStatus}.`);
      setAwards((prev) =>
        prev.map((a) => (a.id === award.id ? { ...a, status: nextStatus } : a))
      );
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= awards.length) return;

    const newAwards = [...awards];
    const temp = newAwards[index];
    newAwards[index] = newAwards[targetIndex];
    newAwards[targetIndex] = temp;

    const updates = newAwards.map((a, idx) => ({
      id: a.id,
      sortOrder: idx + 1,
    }));

    setAwards(newAwards);
    try {
      await awardsCms.reorder(updates);
      toastSuccess('Awards order updated.');
    } catch (err: any) {
      toastError(err?.message || 'Failed to update order.');
      fetchAwards();
    }
  };

  const handleConfirmDelete = async () => {
    if (!awardToDelete) return;
    setDeleting(true);
    try {
      await awardsCms.delete(awardToDelete.id);
      if (awardToDelete.imageKey) {
        cmsApi.deleteMedia(awardToDelete.imageKey).catch(() => {});
      }
      if (awardToDelete.documentKey) {
        cmsApi.deleteMedia(awardToDelete.documentKey).catch(() => {});
      }
      toastSuccess('Award deleted.');
      setAwards((prev) => prev.filter((a) => a.id !== awardToDelete.id));
      setDeleteModalOpen(false);
      setAwardToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete award.');
    } finally {
      setDeleting(false);
    }
  };

  const availableYears = Array.from(new Set(awards.map((a) => String(a.year)).filter(Boolean))).sort().reverse();

  const filteredAwards = awards.filter((award) => {
    const matchesSearch =
      award.title.toLowerCase().includes(search.toLowerCase()) ||
      award.organization.toLowerCase().includes(search.toLowerCase()) ||
      (award.description && award.description.toLowerCase().includes(search.toLowerCase())) ||
      (award.category && award.category.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || award.status === statusFilter;
    const matchesYear = yearFilter === 'all' || String(award.year) === yearFilter;
    return matchesSearch && matchesStatus && matchesYear;
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
            <span className="text-[#006B4F] font-bold">Awards</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211E] tracking-tight">Awards & Recognitions CMS</h1>
          <p className="text-xs text-[#66736E] mt-0.5">
            Manage prestigious maritime awards, conclave trophies, and industry partner citations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/awards"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006B4F]" />
            <span>View Public /awards</span>
          </Link>

          <button
            onClick={fetchAwards}
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
            <span>Add Award</span>
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
            placeholder="Search awards by title, organization, year..."
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Year Filter */}
          {availableYears.length > 0 && (
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Awards Table */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4 w-12 text-center">Order</th>
                <th className="px-4 py-4 w-24">Award Image</th>
                <th className="px-4 py-4">Award Title & Citation</th>
                <th className="px-4 py-4">Organization & Year</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Loading awards...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAwards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <Trophy className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                    <p className="font-semibold text-[#17211E]">No awards found</p>
                    <p className="text-[11px] mt-1">
                      Click "Add Award" to record an industry honor or conclave appreciation.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAwards.map((award, index) => (
                  <tr key={award.id} className="hover:bg-[#F7F9F8] transition-colors">
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
                          {award.sortOrder || index + 1}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === filteredAwards.length - 1}
                          className="p-1 rounded text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Image */}
                    <td className="px-4 py-4">
                      <div className="w-20 h-16 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] overflow-hidden relative flex items-center justify-center shrink-0">
                        {award.imageUrl ? (
                          <img
                            src={cmsApi.resolveMediaUrl(award.imageUrl)}
                            alt={award.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#EAF5F1] text-[#006B4F] flex items-center justify-center">
                            <Trophy className="w-6 h-6" />
                          </div>
                        )}
                        {award.featured && (
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
                          onClick={() => handleOpenEdit(award)}
                          className="font-bold text-[#17211E] text-sm hover:text-[#006B4F] text-left block"
                        >
                          {award.title}
                        </button>
                        {award.description && (
                          <p className="text-[11px] text-[#66736E] line-clamp-1 mt-0.5 max-w-sm">
                            {award.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Organization & Year */}
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[#17211E] block truncate max-w-[150px]">
                          {award.organization}
                        </span>
                        <span className="text-[11px] font-mono text-[#006B4F] font-bold">
                          Year: {award.year}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5F1] text-[#006B4F] border border-[#006B4F]/20">
                        {award.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(award)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          award.status === 'published'
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30 hover:bg-[#d4ede5]'
                            : 'bg-amber-50 text-[#D97706] border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${award.status === 'published' ? 'bg-[#006B4F]' : 'bg-[#D97706]'}`} />
                        <span>{award.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(award)}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors cursor-pointer"
                          title="Edit Award"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAwardToDelete(award);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Award"
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
                    Awards CMS
                  </span>
                  <h2 className="text-lg font-bold text-[#17211E]">
                    {editingAward ? 'Edit Award Recognition' : 'Record New Award or Recognition'}
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
                {/* Title & Organization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Award Title <span className="text-[#006B4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="e.g. Best Customs House Agent of the Year"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Awarding Body / Organization <span className="text-[#006B4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                      required
                      placeholder="e.g. South East Cargo Conclave / CII"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>
                </div>

                {/* Year & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData((prev) => ({ ...prev, year: Number(e.target.value) || 2026 }))}
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
                      {AWARD_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Award Image Upload */}
                <div className="p-4 bg-[#F7F9F8] border border-[#E2E9E5] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider">
                      Award Photo / Trophy Image (R2 Storage)
                    </label>
                    {uploadingImage && (
                      <span className="text-[11px] font-bold text-[#006B4F]">Uploading {imagePercent}%</span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.imageUrl && (
                      <img
                        src={cmsApi.resolveMediaUrl(formData.imageUrl)}
                        alt="Award"
                        className="w-28 h-20 object-cover rounded-xl border border-[#E2E9E5] shrink-0"
                      />
                    )}

                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-[#E2E9E5] hover:bg-[#F7F9F8] text-[#17211E] font-semibold rounded-xl text-xs cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-4 h-4 text-[#006B4F]" />
                        <span>{formData.imageUrl ? 'Replace Trophy Photo' : 'Upload Award Photo to R2'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.altText}
                        onChange={(e) => setFormData((prev) => ({ ...prev, altText: e.target.value }))}
                        placeholder="Alt text (e.g. CEO receiving South East Cargo trophy)"
                        className="w-full px-3 py-1.5 bg-white border border-[#E2E9E5] rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Certificate / PDF Upload (Optional) */}
                <div className="p-4 bg-[#F7F9F8] border border-[#E2E9E5] rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider">
                    Certificate / Citation Document PDF (Optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    {formData.documentUrl && (
                      <span className="text-xs font-mono text-[#006B4F] font-bold truncate max-w-xs">
                        ✓ PDF Attached: {formData.documentKey || 'Certificate.pdf'}
                      </span>
                    )}
                    <label className="px-3.5 py-2 bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] rounded-xl font-semibold cursor-pointer text-xs">
                      {uploadingDoc ? `Uploading (${docPercent}%)...` : formData.documentUrl ? 'Replace PDF' : 'Upload PDF Document'}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleDocUpload}
                        disabled={uploadingDoc}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Description & Citation */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Award Citation / Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Provide details about the jury citation, category excellence, or key achievements..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                  />
                </div>

                {/* Status & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="featuredAward"
                      checked={formData.featured}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-[#006B4F] rounded border-[#E2E9E5] focus:ring-[#006B4F] cursor-pointer"
                    />
                    <label htmlFor="featuredAward" className="text-xs font-semibold text-[#17211E] cursor-pointer select-none">
                      Feature in highlight recognitions banner
                    </label>
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
                    disabled={saving || uploadingImage || uploadingDoc}
                    className="px-6 py-2 bg-[#006B4F] hover:bg-[#005A43] text-white font-bold rounded-xl text-xs shadow-sm shadow-[#006B4F]/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingAward ? 'Update Award' : 'Save Award Record'}</span>
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
        title="Delete Award Record?"
        message={`Are you sure you want to permanently delete "${awardToDelete?.title}"?`}
        confirmLabel="Delete Award"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
