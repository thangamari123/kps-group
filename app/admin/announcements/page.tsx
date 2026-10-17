'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { announcementsCms } from '@/lib/cms-firestore';
import { useToast } from '@/components/admin/Toast';
import { useAuth } from '@/lib/AuthContext';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import AnnouncementItemView from '@/components/common/AnnouncementItemView';
import type {
  AnnouncementCtaAction,
  AnnouncementItem,
  AnnouncementLocationMode,
  AnnouncementSpeed,
  AnnouncementStatus,
} from '@/lib/cms-types';
import {
  ANNOUNCEMENT_SPEEDS,
  ANNOUNCEMENT_SHORT_MAX,
  ANNOUNCEMENT_TEXT_MAX,
  formatAnnouncementDate,
  normalizeAnnouncementLink,
} from '@/lib/announcement-utils';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  X,
  Link as LinkIcon,
  AlertCircle,
  Gauge,
  Calendar,
  MapPin,
  Eye,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormState {
  label: string;
  text: string;
  date: string;
  locationMode: AnnouncementLocationMode;
  customLocation: string;
  availability: string;
  ctaText: string;
  ctaAction: AnnouncementCtaAction;
  webinarTitle: string;
  linkUrl: string;
  speed: AnnouncementSpeed;
  status: AnnouncementStatus;
  sortOrder: string;
}

const EMPTY_FORM: FormState = {
  label: '',
  text: '',
  date: '',
  locationMode: 'none',
  customLocation: '',
  availability: '',
  ctaText: '',
  ctaAction: 'link',
  webinarTitle: '',
  linkUrl: '',
  speed: 'medium',
  status: 'active',
  sortOrder: '1',
};

const labelClass = 'block text-xs font-bold text-[#17211E] uppercase tracking-wider mb-2';
const inputClass =
  'w-full px-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20';

const PERMISSION_HELP =
  'Firestore denied access to the announcement data. Make sure the latest firestore.rules (including the ' +
  '"announcements" and "site_settings" rules) are published to this Firebase project, and that your account has an ' +
  'active record at admins/{your UID} in Firestore.';

function isPermissionError(err: any): boolean {
  return (
    err?.code === 'permission-denied' ||
    /missing or insufficient permissions/i.test(err?.message || '')
  );
}

function errorMessage(err: any, fallback: string): string {
  return isPermissionError(err)
    ? 'Permission denied: your admin account is not authorized to change announcements.'
    : err?.message || fallback;
}

const LOCATION_OPTIONS: { value: AnnouncementLocationMode; label: string }[] = [
  { value: 'none', label: 'None (hide badge)' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'custom', label: 'Custom...' },
];

function resolveLocation(form: FormState): string {
  if (form.locationMode === 'online') return 'Online';
  if (form.locationMode === 'offline') return 'Offline';
  if (form.locationMode === 'custom') return form.customLocation.trim();
  return '';
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#ffc107] ${
        checked ? 'bg-[#006B4F]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function speedLabel(speed: string) {
  return ANNOUNCEMENT_SPEEDS.find((s) => s.value === speed)?.label || 'Medium';
}

export default function AdminAnnouncementsPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<{ message: string; permission: boolean } | null>(null);

  // Master switch
  const [barEnabled, setBarEnabled] = useState(true);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [togglingBar, setTogglingBar] = useState(false);

  // Per-row quick status toggle
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Modal / form
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  // Delete
  const [itemToDelete, setItemToDelete] = useState<AnnouncementItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [list, settings] = await Promise.all([
        announcementsCms.getAll(),
        announcementsCms.getSettings(),
      ]);
      setItems(list);
      setBarEnabled(settings.enabled);
      setPauseOnHover(settings.pauseOnHover);
    } catch (err: any) {
      console.error('Load announcements error:', err);
      setLoadError(
        isPermissionError(err)
          ? { message: PERMISSION_HELP, permission: true }
          : { message: err?.message || 'Failed to load announcements.', permission: false }
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, fetchData]);

  const handleToggleSetting = async (key: 'enabled' | 'pauseOnHover') => {
    const next = key === 'enabled' ? !barEnabled : !pauseOnHover;
    setTogglingBar(true);
    try {
      await announcementsCms.updateSettings({ [key]: next });
      if (key === 'enabled') {
        setBarEnabled(next);
        toastSuccess(next ? 'Announcement bar enabled on the website.' : 'Announcement bar disabled on the website.');
      } else {
        setPauseOnHover(next);
        toastSuccess(next ? 'Bar will pause when hovered.' : 'Bar will keep scrolling when hovered.');
      }
    } catch (err: any) {
      toastError(errorMessage(err, 'Failed to update the announcement bar setting.'));
    } finally {
      setTogglingBar(false);
    }
  };

  const handleOpenCreate = () => {
    const nextOrder = items.reduce((max, i) => Math.max(max, Number(i.sortOrder) || 0), 0) + 1;
    setEditingItem(null);
    setFormData({ ...EMPTY_FORM, sortOrder: String(nextOrder) });
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AnnouncementItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label || '',
      text: item.text || '',
      date: item.date || '',
      locationMode: item.locationMode || (item.location ? 'custom' : 'none'),
      customLocation:
        item.locationMode === 'online' || item.locationMode === 'offline' ? '' : item.location || '',
      availability: item.availability || '',
      ctaText: item.ctaText || '',
      ctaAction: item.ctaAction || 'link',
      webinarTitle: item.webinarTitle || '',
      linkUrl: item.linkUrl || '',
      speed: item.speed || 'medium',
      status: item.status || 'active',
      sortOrder: String(item.sortOrder ?? 0),
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    const text = formData.text.trim();
    if (!text) next.text = 'Announcement text is required.';
    else if (text.length > ANNOUNCEMENT_TEXT_MAX) {
      next.text = `Announcement text must be ${ANNOUNCEMENT_TEXT_MAX} characters or fewer.`;
    }

    if (formData.label.trim().length > ANNOUNCEMENT_SHORT_MAX) {
      next.label = `Label must be ${ANNOUNCEMENT_SHORT_MAX} characters or fewer.`;
    }

    if (formData.date.trim() && !formatAnnouncementDate(formData.date)) {
      next.date = 'Enter a valid date.';
    }

    if (formData.locationMode === 'custom') {
      const custom = formData.customLocation.trim();
      if (!custom) next.customLocation = 'Enter the location text, or choose another option.';
      else if (custom.length > ANNOUNCEMENT_SHORT_MAX) {
        next.customLocation = `Location must be ${ANNOUNCEMENT_SHORT_MAX} characters or fewer.`;
      }
    }

    if (formData.availability.trim().length > ANNOUNCEMENT_SHORT_MAX) {
      next.availability = `Availability text must be ${ANNOUNCEMENT_SHORT_MAX} characters or fewer.`;
    }

    if (formData.ctaText.trim().length > ANNOUNCEMENT_SHORT_MAX) {
      next.ctaText = `Button text must be ${ANNOUNCEMENT_SHORT_MAX} characters or fewer.`;
    }

    if (formData.ctaAction === 'register') {
      if (formData.webinarTitle.trim().length > 200) {
        next.webinarTitle = 'Webinar name must be 200 characters or fewer.';
      }
    } else if (formData.linkUrl.trim() && !normalizeAnnouncementLink(formData.linkUrl)) {
      next.linkUrl = 'Enter a full link (https://…), a site path starting with "/", or a mailto:/tel: link.';
    } else if (formData.ctaText.trim() && !formData.linkUrl.trim()) {
      next.linkUrl = 'A link is required when the button has text.';
    }

    const order = Number(formData.sortOrder);
    if (formData.sortOrder.trim() === '' || !Number.isInteger(order) || order < 0) {
      next.sortOrder = 'Display order must be a whole number, 0 or higher.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      // Empty strings clear a section (the service removes those fields from the document)
      const payload = {
        label: formData.label.trim(),
        text: formData.text.trim(),
        date: formData.date.trim(),
        locationMode: formData.locationMode,
        location: resolveLocation(formData),
        availability: formData.availability.trim(),
        ctaText: formData.ctaText.trim(),
        ctaAction: formData.ctaAction,
        webinarTitle: formData.ctaAction === 'register' ? formData.webinarTitle.trim() : '',
        linkUrl: formData.ctaAction === 'register' ? '' : normalizeAnnouncementLink(formData.linkUrl) || '',
        speed: formData.speed,
        status: formData.status,
        sortOrder: Number(formData.sortOrder),
      };

      if (editingItem) {
        await announcementsCms.update(editingItem.id, payload);
        toastSuccess('Announcement updated.');
      } else {
        await announcementsCms.create(payload);
        toastSuccess('Announcement created.');
      }
      setModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error('Save announcement error:', err);
      toastError(errorMessage(err, 'Failed to save the announcement.'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: AnnouncementItem) => {
    const next: AnnouncementStatus = item.status === 'active' ? 'inactive' : 'active';
    setTogglingId(item.id);
    try {
      await announcementsCms.update(item.id, { status: next });
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
      toastSuccess(next === 'active' ? 'Announcement activated.' : 'Announcement deactivated.');
    } catch (err: any) {
      toastError(errorMessage(err, 'Failed to change announcement status.'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await announcementsCms.delete(itemToDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toastSuccess('Announcement deleted.');
      setItemToDelete(null);
    } catch (err: any) {
      toastError(errorMessage(err, 'Failed to delete the announcement.'));
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = items.filter((i) => i.status === 'active').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb / title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006B4F] block mb-1">
            Content Management
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17211E] tracking-tight">Announcement Bar</h1>
          <p className="text-xs text-[#66736E] mt-1">
            Scrolling notices shown at the top of every public page. Changes go live without a redeploy.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-[#E2E9E5] rounded-xl text-xs font-semibold text-[#17211E] hover:bg-[#F7F9F8] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#006B4F]" />
            <span>View Website</span>
          </Link>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 text-[#006B4F] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-250 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#ffc107]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Announcement</span>
          </button>
        </div>
      </div>

      {/* Master switch */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF5F1] flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 text-[#006B4F]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#17211E]">Show announcement bar on website</h2>
            <p className="text-xs text-[#66736E] mt-0.5">
              {barEnabled
                ? `Enabled — ${activeCount} active announcement${activeCount === 1 ? '' : 's'} will scroll in order.`
                : 'Disabled — nothing is shown, even for active announcements.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-3">
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-semibold text-[#17211E]">Show bar</span>
            <Toggle
              checked={barEnabled}
              onChange={() => handleToggleSetting('enabled')}
              disabled={togglingBar || loading || !!loadError}
              label="Show announcement bar on website"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs font-semibold text-[#17211E]">Pause on hover</span>
            <Toggle
              checked={pauseOnHover}
              onChange={() => handleToggleSetting('pauseOnHover')}
              disabled={togglingBar || loading || !!loadError}
              label="Pause scrolling when hovered"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        {loadError ? (
          <div className="p-10 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#DC2626] mx-auto" />
            <p className="text-sm font-bold text-[#17211E]">
              {loadError.permission ? 'Permission denied' : "Couldn't load announcements"}
            </p>
            <p className="text-xs text-[#66736E] max-w-md mx-auto">{loadError.message}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-[#006B4F] text-white rounded-xl text-xs font-bold hover:bg-[#005A43] cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4 w-16 text-center">Order</th>
                  <th className="px-4 py-4">Announcement</th>
                  <th className="px-4 py-4">Speed</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E9E5]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-8 h-8 border-3 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[#66736E] font-semibold">Loading announcements...</span>
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <Megaphone className="w-8 h-8 text-[#66736E]/40 mx-auto mb-3" />
                      <p className="text-sm font-bold text-[#17211E]">No announcements yet</p>
                      <p className="text-[#66736E] mt-1">Create your first announcement to display it on the website.</p>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const active = item.status === 'active';
                    return (
                      <tr key={item.id} className="hover:bg-[#F7F9F8]/60 transition-colors">
                        <td className="px-5 py-4 text-center font-bold text-[#66736E]">{item.sortOrder ?? 0}</td>
                        <td className="px-4 py-4 max-w-md">
                          {item.label && (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#006B4F] mb-0.5">
                              {item.label}
                            </p>
                          )}
                          <p className="font-semibold text-[#17211E] leading-relaxed break-words">{item.text}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[#66736E] font-medium">
                            {item.date && formatAnnouncementDate(item.date) && (
                              <span className="inline-flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatAnnouncementDate(item.date)}</span>
                              </span>
                            )}
                            {item.location && (
                              <span className="inline-flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{item.location}</span>
                              </span>
                            )}
                            {item.availability && <span>{item.availability}</span>}
                          </div>
                          {item.ctaAction === 'register' && (
                            <p className="mt-1 flex items-center space-x-1 text-[#006B4F] font-medium min-w-0">
                              <Users className="w-3 h-3 shrink-0" />
                              <span className="shrink-0">{item.ctaText || 'Register Now'}</span>
                              <span className="truncate text-[#66736E]">&rarr; opens webinar registration form</span>
                            </p>
                          )}
                          {item.ctaAction !== 'register' && item.linkUrl && (
                            <p className="mt-1 flex items-center space-x-1 text-[#006B4F] font-medium min-w-0">
                              <LinkIcon className="w-3 h-3 shrink-0" />
                              <span className="shrink-0">{item.ctaText || 'Learn more'}</span>
                              <span className="truncate text-[#66736E]">&rarr; {item.linkUrl}</span>
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#F7F9F8] border border-[#E2E9E5] font-bold text-[#17211E]">
                            <Gauge className="w-3 h-3 text-[#006B4F]" />
                            <span>{speedLabel(item.speed)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            disabled={togglingId === item.id}
                            title={active ? 'Click to deactivate' : 'Click to activate'}
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
                              active
                                ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30 hover:bg-[#d9eee6]'
                                : 'bg-slate-100 text-[#66736E] border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#006B4F]' : 'bg-slate-400'}`} />
                            <span>{active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 rounded-lg text-[#17211E] hover:bg-[#EAF5F1] hover:text-[#006B4F] transition-colors cursor-pointer"
                              title="Edit"
                              aria-label="Edit announcement"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="p-2 rounded-lg text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete"
                              aria-label="Delete announcement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211E]/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-[#E2E9E5] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-5 sm:p-6 border-b border-[#E2E9E5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#006B4F] uppercase tracking-wider block">
                    Announcement Bar
                  </span>
                  <h2 className="text-lg font-bold text-[#17211E]">
                    {editingItem ? 'Edit Announcement' : 'Add New Announcement'}
                  </h2>
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
                {/* Live preview (same component as the website bar) */}
                <div>
                  <span className={`${labelClass} flex items-center space-x-1.5`}>
                    <Eye className="w-3.5 h-3.5 text-[#006B4F]" />
                    <span>Live Preview</span>
                  </span>
                  <div className="h-10 flex items-center bg-white border border-[#0F5B44]/20 rounded-lg overflow-hidden">
                    <AnnouncementItemView
                      preview
                      item={{
                        speed: formData.speed,
                        text: formData.text.trim() || 'Your announcement message appears here',
                        label: formData.label,
                        date: formData.date,
                        location: resolveLocation(formData),
                        availability: formData.availability,
                        ctaText: formData.ctaText,
                        ctaAction: formData.ctaAction,
                        linkUrl: formData.linkUrl,
                      }}
                    />
                  </div>
                  <p className="text-[#66736E] mt-1.5">
                    Only the message scrolls (when it is too long to fit), at the speed you pick below. Everything else stays fixed.
                  </p>
                </div>

                {/* Label */}
                <div>
                  <label htmlFor="ann-label" className={labelClass}>
                    Announcement Label{' '}
                    <span className="normal-case font-medium text-[#66736E]">(blank = &quot;Announcement&quot;)</span>
                  </label>
                  <input
                    id="ann-label"
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))}
                    placeholder="Announcement"
                    className={`${inputClass} ${errors.label ? 'border-[#DC2626]' : ''}`}
                  />
                  {errors.label && <p className="text-[#DC2626] font-medium mt-1.5">{errors.label}</p>}
                </div>

                {/* Text */}
                <div>
                  <label htmlFor="ann-text" className={labelClass}>
                    Main Announcement Message <span className="text-[#006B4F]">*</span>
                  </label>
                  <textarea
                    id="ann-text"
                    rows={2}
                    value={formData.text}
                    onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))}
                    placeholder="e.g. Free webinar on import & export procedure"
                    className={`${inputClass} resize-none ${errors.text ? 'border-[#DC2626]' : ''}`}
                  />
                  <div className="flex items-start justify-between mt-1.5 gap-3">
                    <p className="text-[#DC2626] font-medium">{errors.text}</p>
                    <span
                      className={`shrink-0 font-medium ${
                        formData.text.length > ANNOUNCEMENT_TEXT_MAX ? 'text-[#DC2626]' : 'text-[#66736E]'
                      }`}
                    >
                      {formData.text.length}/{ANNOUNCEMENT_TEXT_MAX}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Date */}
                  <div>
                    <label htmlFor="ann-date" className={labelClass}>
                      Date <span className="normal-case font-medium text-[#66736E]">(optional)</span>
                    </label>
                    <input
                      id="ann-date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                      className={`${inputClass} cursor-pointer ${errors.date ? 'border-[#DC2626]' : ''}`}
                    />
                    {errors.date && <p className="text-[#DC2626] font-medium mt-1.5">{errors.date}</p>}
                  </div>

                  {/* Location / Mode */}
                  <div>
                    <label htmlFor="ann-location" className={labelClass}>
                      Location / Mode
                    </label>
                    <select
                      id="ann-location"
                      value={formData.locationMode}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, locationMode: e.target.value as AnnouncementLocationMode }))
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs font-medium text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                    >
                      {LOCATION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {formData.locationMode === 'custom' && (
                      <>
                        <input
                          type="text"
                          aria-label="Custom location"
                          value={formData.customLocation}
                          onChange={(e) => setFormData((p) => ({ ...p, customLocation: e.target.value }))}
                          placeholder="e.g. Chennai Office"
                          className={`${inputClass} mt-2 ${errors.customLocation ? 'border-[#DC2626]' : ''}`}
                        />
                        {errors.customLocation && (
                          <p className="text-[#DC2626] font-medium mt-1.5">{errors.customLocation}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label htmlFor="ann-availability" className={labelClass}>
                    Availability Text <span className="normal-case font-medium text-[#66736E]">(optional)</span>
                  </label>
                  <input
                    id="ann-availability"
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData((p) => ({ ...p, availability: e.target.value }))}
                    placeholder="e.g. Limited Seats"
                    className={`${inputClass} ${errors.availability ? 'border-[#DC2626]' : ''}`}
                  />
                  {errors.availability && <p className="text-[#DC2626] font-medium mt-1.5">{errors.availability}</p>}
                </div>

                {/* CTA action */}
                <div>
                  <span className={labelClass}>CTA Action</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: 'link', label: 'Open a link' },
                        { value: 'register', label: 'Open webinar registration form' },
                      ] as { value: AnnouncementCtaAction; label: string }[]
                    ).map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={formData.ctaAction === o.value}
                        onClick={() => setFormData((p) => ({ ...p, ctaAction: o.value }))}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          formData.ctaAction === o.value
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]'
                            : 'bg-white text-[#66736E] border-[#E2E9E5] hover:bg-[#F7F9F8]'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* CTA text */}
                  <div>
                    <label htmlFor="ann-cta" className={labelClass}>
                      CTA Button Text <span className="normal-case font-medium text-[#66736E]">(optional)</span>
                    </label>
                    <input
                      id="ann-cta"
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData((p) => ({ ...p, ctaText: e.target.value }))}
                      placeholder="e.g. Register Now"
                      className={`${inputClass} ${errors.ctaText ? 'border-[#DC2626]' : ''}`}
                    />
                    {errors.ctaText && <p className="text-[#DC2626] font-medium mt-1.5">{errors.ctaText}</p>}
                  </div>

                  {formData.ctaAction === 'register' ? (
                    /* Webinar name for the registration form */
                    <div>
                      <label htmlFor="ann-webinar" className={labelClass}>
                        Webinar Name <span className="normal-case font-medium text-[#66736E]">(blank = message)</span>
                      </label>
                      <input
                        id="ann-webinar"
                        type="text"
                        value={formData.webinarTitle}
                        onChange={(e) => setFormData((p) => ({ ...p, webinarTitle: e.target.value }))}
                        placeholder="Free Webinar on Import & Export Procedure"
                        className={`${inputClass} ${errors.webinarTitle ? 'border-[#DC2626]' : ''}`}
                      />
                      {errors.webinarTitle && <p className="text-[#DC2626] font-medium mt-1.5">{errors.webinarTitle}</p>}
                    </div>
                  ) : (
                    /* CTA link */
                    <div>
                      <label htmlFor="ann-link" className={labelClass}>
                        CTA Link URL <span className="normal-case font-medium text-[#66736E]">(optional)</span>
                      </label>
                      <input
                        id="ann-link"
                        type="text"
                        value={formData.linkUrl}
                        onChange={(e) => setFormData((p) => ({ ...p, linkUrl: e.target.value }))}
                        placeholder="https://example.com or /contact-us"
                        className={`${inputClass} ${errors.linkUrl ? 'border-[#DC2626]' : ''}`}
                      />
                      {errors.linkUrl && <p className="text-[#DC2626] font-medium mt-1.5">{errors.linkUrl}</p>}
                    </div>
                  )}
                </div>

                {/* Speed */}
                <div>
                  <span className={labelClass}>Scroll Speed</span>
                  <div className="grid grid-cols-3 gap-3">
                    {ANNOUNCEMENT_SPEEDS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, speed: s.value }))}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          formData.speed === s.value
                            ? 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]'
                            : 'bg-white text-[#66736E] border-[#E2E9E5] hover:bg-[#F7F9F8]'
                        }`}
                        aria-pressed={formData.speed === s.value}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Status */}
                  <div>
                    <label htmlFor="ann-status" className={labelClass}>
                      Status
                    </label>
                    <select
                      id="ann-status"
                      value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as AnnouncementStatus }))}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs font-medium text-[#17211E] focus:outline-none focus:border-[#006B4F] cursor-pointer"
                    >
                      <option value="active">Active (Shown on website)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <label htmlFor="ann-order" className={labelClass}>
                      Display Order
                    </label>
                    <input
                      id="ann-order"
                      type="number"
                      min={0}
                      step={1}
                      value={formData.sortOrder}
                      onChange={(e) => setFormData((p) => ({ ...p, sortOrder: e.target.value }))}
                      className={`${inputClass} ${errors.sortOrder ? 'border-[#DC2626]' : ''}`}
                    />
                    {errors.sortOrder && <p className="text-[#DC2626] font-medium mt-1.5">{errors.sortOrder}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E9E5] flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="px-4 py-2 bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#ffc107]/20 hover:border-[#ffc107] active:bg-[#e0a800]/30 rounded-xl font-semibold cursor-pointer text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#ffc107] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white font-bold rounded-xl text-xs shadow-sm shadow-[#006B4F]/20 disabled:opacity-50 cursor-pointer flex items-center space-x-2 transition-all duration-250 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingItem ? 'Update Announcement' : 'Save Announcement'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Announcement?"
        message={`Are you sure you want to delete this announcement? "${itemToDelete?.text ?? ''}" will no longer appear on the website.`}
        confirmLabel="Delete Announcement"
        loading={deleting}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
