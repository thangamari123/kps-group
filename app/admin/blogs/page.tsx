'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { blogsCms } from '@/lib/cms-firestore';
import { cmsApi } from '@/lib/cms-api';
import { useToast } from '@/components/admin/Toast';
import { useAuth } from '@/lib/AuthContext';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import type { BlogItem, CMSPublishStatus } from '@/lib/cms-types';
import {
  BookOpen,
  Plus,
  Search,
  ChevronRight,
  Eye,
  Trash2,
  Edit,
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Globe,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BLOG_CATEGORIES = [
  'Customs Brokerage',
  'Ocean & Air Freight',
  'Multimodal Transportation',
  'Industrial Warehousing',
  'Trade & Regulatory Insights',
  'Company News & Milestones',
  'Sustainability & CSR',
];

export default function AdminBlogsPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal / Drawer Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImageUrl: '',
    featuredImageKey: '',
    category: 'Customs Brokerage',
    tags: [] as string[],
    author: 'KPS Editorial Team',
    status: 'published' as CMSPublishStatus,
    publishedAt: new Date().toISOString().split('T')[0],
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    ogImageUrl: '',
    sortOrder: 0,
  });

  const [tagInput, setTagInput] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Upload Progress
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [oldImageKey, setOldImageKey] = useState<string | null>(null);

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogsCms.getAll(
        statusFilter !== 'all' ? statusFilter : undefined,
        categoryFilter !== 'all' ? categoryFilter : undefined
      );
      setBlogs(data);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchBlogs();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, authLoading, user]);

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setOldImageKey(null);
    setSlugManuallyEdited(false);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImageUrl: '',
      featuredImageKey: '',
      category: 'Customs Brokerage',
      tags: ['Customs', 'Logistics'],
      author: 'KPS Editorial Team',
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0],
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      ogImageUrl: '',
      sortOrder: blogs.length + 1,
    });
    setUploadPercent(0);
    setEditorOpen(true);
  };

  const formatDisplayDate = (d: any) => {
    if (!d) return '—';
    try {
      if (typeof d === 'string') return new Date(d).toLocaleDateString();
      if (typeof d.toDate === 'function') return d.toDate().toLocaleDateString();
      if (d.seconds) return new Date(d.seconds * 1000).toLocaleDateString();
      if (d instanceof Date) return d.toLocaleDateString();
      return new Date(d).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  const handleOpenEdit = (blog: BlogItem) => {
    setEditingBlog(blog);
    setOldImageKey(null);
    setSlugManuallyEdited(true);

    let dateStr = new Date().toISOString().split('T')[0];
    if (blog.publishedAt) {
      try {
        if (typeof blog.publishedAt === 'string') {
          dateStr = blog.publishedAt.split('T')[0];
        } else if (typeof blog.publishedAt.toDate === 'function') {
          dateStr = blog.publishedAt.toDate().toISOString().split('T')[0];
        } else if (blog.publishedAt.seconds) {
          dateStr = new Date(blog.publishedAt.seconds * 1000).toISOString().split('T')[0];
        } else if (blog.publishedAt instanceof Date) {
          dateStr = blog.publishedAt.toISOString().split('T')[0];
        }
      } catch {
        dateStr = new Date().toISOString().split('T')[0];
      }
    }

    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      featuredImageUrl: blog.featuredImageUrl || '',
      featuredImageKey: blog.featuredImageKey || '',
      category: blog.category || 'Customs Brokerage',
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      author: blog.author || 'KPS Editorial Team',
      status: blog.status || 'published',
      publishedAt: dateStr,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      canonicalUrl: blog.canonicalUrl || '',
      ogImageUrl: blog.ogImageUrl || '',
      sortOrder: blog.sortOrder ?? 0,
    });
    setUploadPercent(0);
    setEditorOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const updates: any = { title };
    if (!slugManuallyEdited) {
      updates.slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadPercent(0);

    try {
      if (editingBlog?.featuredImageKey && !oldImageKey) {
        setOldImageKey(editingBlog.featuredImageKey);
      } else if (formData.featuredImageKey && !oldImageKey) {
        setOldImageKey(formData.featuredImageKey);
      }

      const result = await cmsApi.uploadMedia(file, 'blogs/images', (percent) => {
        setUploadPercent(percent);
      });

      setFormData((prev) => ({
        ...prev,
        featuredImageUrl: result.url,
        featuredImageKey: result.key,
        ogImageUrl: prev.ogImageUrl || result.url,
      }));

      toastSuccess('Featured image uploaded to R2.');
    } catch (err: any) {
      toastError(err?.message || 'Featured image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    if (formData.featuredImageKey && !oldImageKey) {
      setOldImageKey(formData.featuredImageKey);
    }
    setFormData((prev) => ({
      ...prev,
      featuredImageUrl: '',
      featuredImageKey: '',
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !formData.tags.includes(val)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const insertFormatting = (prefix: string, suffix = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = el.value.substring(0, start) + replacement + el.value.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 10);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      toastError('Title, Slug, and Content are required.');
      return;
    }

    let cleanSlug = formData.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!cleanSlug) {
      cleanSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (!cleanSlug) {
      cleanSlug = `blog-${Date.now()}`;
    }

    const payload = {
      ...formData,
      slug: cleanSlug,
    };

    setSaving(true);
    try {
      if (editingBlog) {
        await blogsCms.update(editingBlog.id, payload);
        toastSuccess('Blog post updated successfully.');

        // Clean up old R2 image if replaced
        if (oldImageKey && oldImageKey !== payload.featuredImageKey) {
          cmsApi.deleteMedia(oldImageKey).catch(() => {});
        }
      } else {
        await blogsCms.create(payload);
        toastSuccess('Blog post published / created successfully.');
      }

      setEditorOpen(false);
      fetchBlogs();
    } catch (err: any) {
      toastError(err?.message || 'Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (blog: BlogItem) => {
    const nextStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      await blogsCms.update(blog.id, { status: nextStatus });
      toastSuccess(`Blog status changed to ${nextStatus}.`);
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, status: nextStatus } : b))
      );
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    setDeleting(true);
    try {
      await blogsCms.delete(blogToDelete.id);
      if (blogToDelete.featuredImageKey) {
        cmsApi.deleteMedia(blogToDelete.featuredImageKey).catch(() => {});
      }
      toastSuccess('Blog post deleted.');
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete blog.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.slug.toLowerCase().includes(search.toLowerCase()) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(search.toLowerCase())) ||
      (blog.author && blog.author.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
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
            <span className="text-[#006B4F] font-bold">Blogs</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211E] tracking-tight">Blog CMS Management</h1>
          <p className="text-xs text-[#66736E] mt-0.5">
            Create, edit, draft, and publish industry insights, customs advisories, and company announcements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/blogs"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006B4F]" />
            <span>View Public /blogs</span>
          </Link>

          <button
            onClick={fetchBlogs}
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
            <span>Write New Blog</span>
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
            placeholder="Search articles by title, slug, excerpt, author..."
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4 w-24">Image</th>
                <th className="px-4 py-4">Article Title & Slug</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Author</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E5]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                      <span className="font-medium">Loading articles...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#66736E]">
                    <BookOpen className="w-8 h-8 text-[#66736E]/40 mx-auto mb-2" />
                    <p className="font-semibold text-[#17211E]">No blog posts found</p>
                    <p className="text-[11px] mt-1">
                      {search || statusFilter !== 'all'
                        ? 'Try clearing your search or filters.'
                        : 'Click "Write New Blog" to publish your first article.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#F7F9F8] transition-colors">
                    {/* Featured Image */}
                    <td className="px-5 py-4">
                      <div className="w-20 h-14 rounded-xl bg-[#F7F9F8] border border-[#E2E9E5] overflow-hidden relative flex items-center justify-center shrink-0">
                        {blog.featuredImageUrl ? (
                          <img
                            src={cmsApi.resolveMediaUrl(blog.featuredImageUrl)}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#004D3A]/10 text-[#006B4F] flex items-center justify-center font-bold text-xs">
                            KPS
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="px-4 py-4">
                      <div>
                        <button
                          onClick={() => handleOpenEdit(blog)}
                          className="font-bold text-[#17211E] text-sm hover:text-[#006B4F] text-left block"
                        >
                          {blog.title}
                        </button>
                        <span className="text-[11px] text-[#66736E] font-mono block truncate max-w-sm">
                          /blogs/{blog.slug}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5F1] text-[#006B4F] border border-[#006B4F]/20">
                        {blog.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-4 text-[#17211E] font-medium">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-[#66736E]" />
                        <span>{blog.author || 'Editorial'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(blog)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          blog.status === 'published'
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30 hover:bg-[#d4ede5]'
                            : 'bg-amber-50 text-[#D97706] border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${blog.status === 'published' ? 'bg-[#006B4F]' : 'bg-[#D97706]'}`} />
                        <span>{blog.status === 'published' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Published Date */}
                    <td className="px-4 py-4 text-[#66736E]">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#66736E]" />
                        <span>{formatDisplayDate(blog.publishedAt)}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {blog.status === 'published' && (
                          <Link
                            href={`/blogs/view?slug=${encodeURIComponent(blog.slug || blog.id)}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors"
                            title="View public blog"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleOpenEdit(blog)}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#006B4F] hover:bg-[#EAF5F1] transition-colors cursor-pointer"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setBlogToDelete(blog);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#66736E] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Post"
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

      {/* Blog Editor Modal / Drawer */}
      <AnimatePresence>
        {editorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#17211E]/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white border border-[#E2E9E5] rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[94vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-[#E2E9E5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#006B4F] uppercase tracking-wider block">
                    Blog CMS Post Editor
                  </span>
                  <h2 className="text-lg font-bold text-[#17211E]">
                    {editingBlog ? 'Edit Blog Article' : 'Compose New Blog Article'}
                  </h2>
                </div>
                <button
                  onClick={() => setEditorOpen(false)}
                  className="text-[#66736E] hover:text-[#17211E] p-1.5 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Article Title <span className="text-[#006B4F]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={handleTitleChange}
                      required
                      placeholder="e.g. Navigating Customs Reforms in Chennai Ports"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      URL Slug <span className="text-[#006B4F]">*</span>
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-[#E2E9E5] focus-within:border-[#006B4F]">
                      <span className="inline-flex items-center px-3 bg-[#F7F9F8] text-[#66736E] text-xs font-mono select-none border-r border-[#E2E9E5]">
                        /blogs/
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          setSlugManuallyEdited(true);
                          setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[\s]+/g, '-') }));
                        }}
                        required
                        className="w-full px-3 py-2.5 bg-white text-xs font-mono text-[#006B4F] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Category, Author, Published Date, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs font-medium text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                    >
                      {BLOG_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as CMSPublishStatus }))}
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none cursor-pointer ${
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

                {/* Featured Image Upload */}
                <div className="p-4 bg-[#F7F9F8] border border-[#E2E9E5] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider">
                      Featured Image (Cloudflare R2)
                    </label>
                    {uploadingImage && (
                      <span className="text-[11px] font-bold text-[#006B4F]">Uploading {uploadPercent}%</span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.featuredImageUrl && (
                      <img
                        src={cmsApi.resolveMediaUrl(formData.featuredImageUrl)}
                        alt="Featured"
                        className="w-32 h-20 object-cover rounded-xl border border-[#E2E9E5] shrink-0"
                      />
                    )}

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <label className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-[#E2E9E5] hover:bg-[#F7F9F8] text-[#17211E] font-semibold rounded-xl text-xs cursor-pointer transition-colors shadow-2xs">
                          <Upload className="w-4 h-4 text-[#006B4F]" />
                          <span>{formData.featuredImageUrl ? 'Replace Featured Image' : 'Upload Featured Image to R2'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        {formData.featuredImageUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="inline-flex items-center space-x-1.5 px-3 py-2.5 bg-white border border-[#E2E9E5] hover:bg-red-50 text-red-600 font-semibold rounded-xl text-xs cursor-pointer transition-colors shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Image</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-[#66736E]">
                        High resolution landscape image recommended (1200 x 630px, max 20MB).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Short Excerpt / Summary
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    rows={2}
                    placeholder="Brief 1-2 sentence preview for cards and search listings..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                  />
                </div>

                {/* Article Content & Formatting Toolbar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider">
                      Article Content (Rich Markdown / Text) <span className="text-[#006B4F]">*</span>
                    </label>
                    <span className="text-[10px] text-[#66736E]">Markdown & HTML supported</span>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center flex-wrap gap-1 p-2 bg-[#F7F9F8] border border-[#E2E9E5] rounded-t-xl text-xs">
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ', '\n')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ', '\n')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Unordered List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('1. ')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Blockquote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('[Link Title](', ')')}
                      className="p-1.5 rounded hover:bg-white text-[#17211E] border border-transparent hover:border-[#E2E9E5]"
                      title="Insert Link"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    required
                    rows={10}
                    placeholder="Write the complete article content here. You can use headings, lists, bullet points, and links..."
                    className="w-full p-4 bg-white border border-t-0 border-[#E2E9E5] rounded-b-xl text-xs text-[#17211E] font-mono leading-relaxed focus:outline-none focus:border-[#006B4F]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2">
                    Tags & Keywords (Press Enter or Comma to add)
                  </label>
                  <div className="p-2.5 bg-white border border-[#E2E9E5] rounded-xl flex flex-wrap items-center gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#EAF5F1] text-[#006B4F] text-xs font-semibold"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-[#006B4F] hover:text-red-600 ml-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tag..."
                      className="flex-1 min-w-[120px] px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* SEO Metadata Group */}
                <div className="p-4 bg-[#F7F9F8] border border-[#E2E9E5] rounded-2xl space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#17211E] uppercase tracking-wider">
                    <Globe className="w-4 h-4 text-[#006B4F]" />
                    <span>Search Engine Optimization (SEO Metadata)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#66736E] uppercase mb-1">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                        placeholder={formData.title || 'Custom SEO Title'}
                        className="w-full px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#66736E] uppercase mb-1">
                        Canonical URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.canonicalUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                        placeholder="https://www.kpsgroups.net/blogs/..."
                        className="w-full px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#66736E] uppercase mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                      rows={2}
                      placeholder={formData.excerpt || 'Search engine snippet...'}
                      className="w-full px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] focus:outline-none focus:border-[#006B4F]"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className="px-4 py-2.5 bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] rounded-xl font-semibold cursor-pointer text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="px-6 py-2.5 bg-[#006B4F] hover:bg-[#005A43] text-white font-bold rounded-xl text-xs shadow-sm shadow-[#006B4F]/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Post...</span>
                      </>
                    ) : (
                      <span>{editingBlog ? 'Update Blog Post' : 'Publish / Save Blog'}</span>
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
        title="Delete Blog Post?"
        message={`Are you sure you want to permanently delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Post"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
