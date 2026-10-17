'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { webinarRegistrationsCms } from '@/lib/cms-firestore';
import { useToast } from '@/components/admin/Toast';
import { useAuth } from '@/lib/AuthContext';
import type { WebinarRegistration, WebinarRegistrationStatus } from '@/lib/cms-types';
import {
  Users,
  Search,
  RefreshCw,
  FileText,
  Loader2,
  Eye,
  X,
  Mail,
  Phone,
  Video,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES: WebinarRegistrationStatus[] = ['New', 'Contacted', 'Confirmed'];
const PAGE_SIZES = [10, 25, 50];

const STATUS_STYLES: Record<WebinarRegistrationStatus, string> = {
  New: 'bg-amber-50 text-[#B45309] border-amber-200',
  Contacted: 'bg-blue-50 text-[#1D4ED8] border-blue-200',
  Confirmed: 'bg-[#EAF5F1] text-[#006B4F] border-[#006B4F]/30',
};

const PERMISSION_HELP =
  'Firestore denied access to webinar registrations. Make sure the latest firestore.rules (including the ' +
  '"webinar_registrations" rule) are published to this Firebase project, and that your account has an active ' +
  'record at admins/{your UID} in Firestore.';

function isPermissionError(err: any): boolean {
  return err?.code === 'permission-denied' || /missing or insufficient permissions/i.test(err?.message || '');
}

function toDate(value: any): Date | null {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateTime(value: any): string {
  const d = toDate(value);
  if (!d) return '—';
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminWebinarRegistrationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();

  const [items, setItems] = useState<WebinarRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<{ message: string; permission: boolean } | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WebinarRegistrationStatus>('all');
  const [webinarFilter, setWebinarFilter] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<WebinarRegistration | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setItems(await webinarRegistrationsCms.getAll());
    } catch (err: any) {
      console.error('Load webinar registrations error:', err);
      setLoadError(
        isPermissionError(err)
          ? { message: PERMISSION_HELP, permission: true }
          : { message: err?.message || 'Failed to load webinar registrations.', permission: false }
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) fetchData();
    else if (!authLoading && !user) setLoading(false);
  }, [authLoading, user, fetchData]);

  const webinars = useMemo(
    () => Array.from(new Set(items.map((i) => i.webinarName).filter(Boolean))).sort(),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (webinarFilter !== 'all' && i.webinarName !== webinarFilter) return false;
      if (!q) return true;
      return [i.fullName, i.email, i.phone, i.webinarName].some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [items, search, statusFilter, webinarFilter]);

  const counts = useMemo(
    () => ({
      total: items.length,
      New: items.filter((i) => i.status === 'New').length,
      Contacted: items.filter((i) => i.status === 'Contacted').length,
      Confirmed: items.filter((i) => i.status === 'Confirmed').length,
    }),
    [items]
  );

  // Back to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, webinarFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  const handleStatusChange = async (item: WebinarRegistration, status: WebinarRegistrationStatus) => {
    if (status === item.status) return;
    setUpdatingId(item.id);
    try {
      await webinarRegistrationsCms.updateStatus(item.id, status);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status } : i)));
      setSelected((prev) => (prev && prev.id === item.id ? { ...prev, status } : prev));
      toastSuccess(`${item.fullName} marked as ${status}.`);
    } catch (err: any) {
      toastError(
        isPermissionError(err)
          ? 'Permission denied: your admin account is not authorized to update registrations.'
          : err?.message || 'Failed to update status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Human-readable description of the active search/filters, printed on the PDF
  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (search.trim()) parts.push(`Search: "${search.trim()}"`);
    if (statusFilter !== 'all') parts.push(`Status: ${statusFilter}`);
    if (webinarFilter !== 'all') parts.push(`Webinar: ${webinarFilter}`);
    return parts;
  }, [search, statusFilter, webinarFilter]);

  // Exports every registration matching the current search and filters (not just the visible page)
  const handleExportPdf = async () => {
    if (exporting) return;
    if (filtered.length === 0) {
      const message = 'There are no registrations to export.';
      setExportError(message);
      toastError(message);
      return;
    }
    setExporting(true);
    setExportError(null);
    try {
      // Let the loading state paint before the (synchronous) PDF work starts
      await new Promise((resolve) => setTimeout(resolve, 50));
      const { exportWebinarRegistrationsPdf } = await import('@/lib/webinar-registrations-pdf');
      const { fileName, replacedValues } = await exportWebinarRegistrationsPdf(
        filtered.map((i) => ({
          fullName: i.fullName,
          email: i.email,
          phone: i.phone,
          webinarName: i.webinarName,
          registeredAt: formatDateTime(i.createdAt),
          status: i.status,
        })),
        { filterSummary, exportedAt: new Date() }
      );
      toastSuccess(`Exported ${filtered.length} registration${filtered.length === 1 ? '' : 's'} to ${fileName}.`);
      if (replacedValues > 0) {
        toastWarning(
          `${replacedValues} value${replacedValues === 1 ? '' : 's'} used characters the PDF font cannot display and appear as "?".`
        );
      }
    } catch (err: any) {
      console.error('Webinar registrations PDF export failed:', err);
      const message = `Could not generate the PDF${err?.message ? `: ${err.message}` : '.'} Please try again.`;
      setExportError(message);
      toastError(message);
    } finally {
      setExporting(false);
    }
  };

  const selectClass =
    'bg-white border border-[#E2E9E5] text-xs font-medium text-[#17211E] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#006B4F] cursor-pointer';

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006B4F] block mb-1">
            Content Management
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17211E] tracking-tight">Webinar Registrations</h1>
          <p className="text-xs text-[#66736E] mt-1">
            People who registered through the announcement bar. Only active administrators can see this list.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-[#E2E9E5] text-[#17211E] hover:bg-[#F7F9F8] transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            title="Refresh list"
            aria-label="Refresh registrations"
          >
            <RefreshCw className={`w-4 h-4 text-[#006B4F] ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportPdf}
            disabled={loading || !!loadError || filtered.length === 0 || exporting}
            aria-busy={exporting}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006B4F] hover:bg-[#ffc107] hover:text-[#073B2C] active:bg-[#e0a800] active:text-[#073B2C] text-white text-xs font-bold shadow-sm shadow-[#006B4F]/20 transition-all duration-250 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#ffc107]"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span>{exporting ? 'Generating PDF...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {exportError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{exportError}</span>
          </div>
          <button
            onClick={() => setExportError(null)}
            className="shrink-0 rounded p-0.5 hover:bg-red-100 cursor-pointer"
            aria-label="Dismiss export error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(
          [
            ['Total', counts.total, 'text-[#17211E]'],
            ['New', counts.New, 'text-[#B45309]'],
            ['Contacted', counts.Contacted, 'text-[#1D4ED8]'],
            ['Confirmed', counts.Confirmed, 'text-[#006B4F]'],
          ] as const
        ).map(([label, value, color]) => (
          <div key={label} className="bg-white border border-[#E2E9E5] rounded-2xl px-4 py-3.5 shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#66736E]">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{loading ? '–' : value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66736E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or webinar..."
            aria-label="Search registrations"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E9E5] rounded-xl text-xs text-[#17211E] placeholder-[#66736E]/60 focus:outline-none focus:border-[#006B4F] focus:ring-1 focus:ring-[#006B4F]/20"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | WebinarRegistrationStatus)}
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={webinarFilter}
            onChange={(e) => setWebinarFilter(e.target.value)}
            className={`${selectClass} max-w-[220px]`}
            aria-label="Filter by webinar"
          >
            <option value="all">All Webinars</option>
            {webinars.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E9E5] rounded-2xl overflow-hidden shadow-2xs">
        {loadError ? (
          <div className="p-10 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#DC2626] mx-auto" />
            <p className="text-sm font-bold text-[#17211E]">
              {loadError.permission ? 'Permission denied' : "Couldn't load registrations"}
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F9F8] border-b border-[#E2E9E5] text-[#66736E] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-4">Full Name</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Webinar</th>
                    <th className="px-4 py-4 whitespace-nowrap">Registered</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-5 py-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E9E5]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-8 h-8 border-3 border-[#006B4F] border-t-transparent rounded-full animate-spin" />
                          <span className="text-[#66736E] font-semibold">Loading registrations...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-14 text-center">
                        <Users className="w-8 h-8 text-[#66736E]/40 mx-auto mb-3" />
                        <p className="text-sm font-bold text-[#17211E]">
                          {items.length === 0 ? 'No registrations yet' : 'No registrations match your filters'}
                        </p>
                        <p className="text-[#66736E] mt-1">
                          {items.length === 0
                            ? 'Registrations from the announcement bar will appear here.'
                            : 'Try a different search or clear the filters.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F7F9F8]/60 transition-colors">
                        <td className="px-5 py-4 font-semibold text-[#17211E] break-words max-w-[180px]">{item.fullName}</td>
                        <td className="px-4 py-4 text-[#17211E] break-all max-w-[220px]">{item.email}</td>
                        <td className="px-4 py-4 text-[#17211E] whitespace-nowrap">{item.phone}</td>
                        <td className="px-4 py-4 text-[#17211E] max-w-[220px]">
                          <span className="line-clamp-2">{item.webinarName}</span>
                        </td>
                        <td className="px-4 py-4 text-[#66736E] whitespace-nowrap">{formatDateTime(item.createdAt)}</td>
                        <td className="px-4 py-4">
                          <select
                            value={item.status}
                            disabled={updatingId === item.id}
                            onChange={(e) => handleStatusChange(item, e.target.value as WebinarRegistrationStatus)}
                            aria-label={`Status for ${item.fullName}`}
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_STYLES[item.status] || STATUS_STYLES.New}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() => setSelected(item)}
                              className="p-2 rounded-lg text-[#17211E] hover:bg-[#EAF5F1] hover:text-[#006B4F] transition-colors cursor-pointer"
                              title="View details"
                              aria-label={`View details for ${item.fullName}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-[#E2E9E5] bg-[#F7F9F8]/60 text-xs text-[#66736E]">
                <div className="flex items-center gap-3">
                  <span>
                    Showing <strong className="text-[#17211E]">{pageStart + 1}</strong>–
                    <strong className="text-[#17211E]">{Math.min(pageStart + pageSize, filtered.length)}</strong> of{' '}
                    <strong className="text-[#17211E]">{filtered.length}</strong>
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className={`${selectClass} py-1.5`}
                    aria-label="Rows per page"
                  >
                    {PAGE_SIZES.map((n) => (
                      <option key={n} value={n}>
                        {n} / page
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg border border-[#E2E9E5] bg-white hover:bg-[#F7F9F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-[#17211E] px-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg border border-[#E2E9E5] bg-white hover:bg-[#F7F9F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211E]/50 backdrop-blur-xs"
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Registration details"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-[#E2E9E5] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-5 sm:p-6 border-b border-[#E2E9E5] flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#006B4F] uppercase tracking-wider block">
                    Webinar Registration
                  </span>
                  <h2 className="text-lg font-bold text-[#17211E] break-words">{selected.fullName}</h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[#66736E] hover:text-[#17211E] p-1.5 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
                <dl className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 text-[#006B4F] shrink-0" />
                    <div className="min-w-0">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-[#66736E]">Email</dt>
                      <dd className="mt-0.5 break-all">
                        <a href={`mailto:${selected.email}`} className="font-semibold text-[#17211E] hover:text-[#006B4F] underline-offset-2 hover:underline">
                          {selected.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 text-[#006B4F] shrink-0" />
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-[#66736E]">Contact Number</dt>
                      <dd className="mt-0.5">
                        <a href={`tel:${selected.phone}`} className="font-semibold text-[#17211E] hover:text-[#006B4F] underline-offset-2 hover:underline">
                          {selected.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="w-4 h-4 mt-0.5 text-[#006B4F] shrink-0" />
                    <div className="min-w-0">
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-[#66736E]">Webinar</dt>
                      <dd className="mt-0.5 font-semibold text-[#17211E] break-words">{selected.webinarName}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-0.5 text-[#006B4F] shrink-0" />
                    <div>
                      <dt className="text-[10px] font-bold uppercase tracking-wider text-[#66736E]">Registered</dt>
                      <dd className="mt-0.5 font-semibold text-[#17211E]">{formatDateTime(selected.createdAt)}</dd>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#66736E] break-all">
                    Announcement reference: <span className="font-mono">{selected.announcementId}</span>
                  </div>
                </dl>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#66736E] mb-2">Status</span>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={updatingId === selected.id}
                        aria-pressed={selected.status === s}
                        onClick={() => handleStatusChange(selected, s)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer disabled:opacity-50 ${
                          selected.status === s
                            ? `${STATUS_STYLES[s]} ring-1 ring-current`
                            : 'bg-white text-[#66736E] border-[#E2E9E5] hover:bg-[#F7F9F8]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
