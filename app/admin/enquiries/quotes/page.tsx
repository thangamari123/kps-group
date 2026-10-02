'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { quotesApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import {
  FileText,
  Search,
  Filter,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Eye,
  Trash2,
  X,
  RefreshCw,
  Package,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminQuotesPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Modal / Drawer Detail View
  const [activeQuote, setActiveQuote] = useState<any | null>(null);

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await quotesApi.getAdminQuotes({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        service: serviceFilter !== 'all' ? serviceFilter : undefined,
      });
      setQuotes(data || []);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load quote requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter, serviceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes();
  };

  const handleStatusChange = async (quoteId: string, nextStatus: string) => {
    try {
      await quotesApi.updateStatus(quoteId, nextStatus);
      toastSuccess(`Quote status updated to "${nextStatus}".`);
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: nextStatus } : q))
      );
      if (activeQuote && activeQuote.id === quoteId) {
        setActiveQuote((prev: any) => ({ ...prev, status: nextStatus }));
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!quoteToDelete) return;
    setDeleting(true);
    try {
      await quotesApi.deleteQuote(quoteToDelete.id);
      toastSuccess('Quote request deleted.');
      setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
      if (activeQuote?.id === quoteToDelete.id) {
        setActiveQuote(null);
      }
      setDeleteModalOpen(false);
      setQuoteToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete quote request.');
    } finally {
      setDeleting(false);
    }
  };

  const statusColors: Record<string, string> = {
    New: 'bg-amber-950 text-amber-300 border-amber-700',
    Contacted: 'bg-blue-950 text-blue-300 border-blue-700',
    'In Progress': 'bg-purple-950 text-purple-300 border-purple-700',
    Quoted: 'bg-emerald-950 text-emerald-300 border-emerald-700',
    Closed: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200">Enquiries</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400">Quote Requests</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Custom Quote Requests</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage commercial freight calculations, route inquiries, and cargo specifications.
          </p>
        </div>

        <button
          onClick={fetchQuotes}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quotes by client name, email, phone, company, or route..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </form>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Quoted">Quoted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4">Client / Company</th>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Route (Origin → Dest)</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading quote requests...</span>
                    </div>
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-400">No quote requests found.</p>
                    <p className="text-[11px] mt-1">Inbound quotes from the quote calculator will appear here.</p>
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Client / Company */}
                    <td className="px-5 py-4">
                      <div>
                        <button
                          onClick={() => setActiveQuote(q)}
                          className="font-bold text-white text-sm hover:text-emerald-400 text-left block"
                        >
                          {q.name}
                        </button>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                          {q.company || 'Individual Shipper'}
                        </span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-200 block truncate max-w-[140px]">
                        {q.service}
                      </span>
                      {q.cargo_weight && (
                        <span className="text-[11px] text-slate-500 block truncate max-w-[140px]">
                          Wt: {q.cargo_weight}
                        </span>
                      )}
                    </td>

                    {/* Route */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-1.5 text-slate-200 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {q.origin} → {q.destination}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <a href={`mailto:${q.email}`} className="text-slate-300 hover:text-emerald-400 block truncate max-w-[150px]">
                          {q.email}
                        </a>
                        <a href={`tel:${q.phone}`} className="text-slate-400 hover:text-emerald-400 block font-mono text-[11px]">
                          {q.phone}
                        </a>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-slate-400">
                      <span>{new Date(q.created_at).toLocaleDateString()}</span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-4">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          statusColors[q.status] || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setActiveQuote(q)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setQuoteToDelete(q);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Delete Quote"
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

      {/* Quote Details Modal / Drawer */}
      <AnimatePresence>
        {activeQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Quote Request #{activeQuote.id.substring(0, 8)}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{activeQuote.name}</h2>
                </div>
                <button
                  onClick={() => setActiveQuote(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Route Pill Box */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Logistics Route</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {activeQuote.origin} → {activeQuote.destination}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Service Type</span>
                    <span className="text-xs font-semibold text-slate-200">{activeQuote.service}</span>
                  </div>
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Company</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {activeQuote.company || 'Not provided'}
                    </span>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Email Address</span>
                    <a href={`mailto:${activeQuote.email}`} className="text-xs font-semibold text-emerald-400 hover:underline">
                      {activeQuote.email}
                    </a>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Phone</span>
                    <a href={`tel:${activeQuote.phone}`} className="text-xs font-semibold text-emerald-400 hover:underline">
                      {activeQuote.phone}
                    </a>
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Cargo Weight / Vol</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {activeQuote.cargo_weight || 'Not specified'}
                    </span>
                  </div>
                </div>

                {/* Cargo Details */}
                {activeQuote.cargo_details && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Cargo Specifications & Notes
                    </span>
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {activeQuote.cargo_details}
                    </div>
                  </div>
                )}

                {/* Status Updater */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Update Status:</span>
                  <select
                    value={activeQuote.status}
                    onChange={(e) => handleStatusChange(activeQuote.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 text-emerald-300 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => setActiveQuote(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Quote Request?"
        message={`Are you sure you want to delete the quote request from "${quoteToDelete?.name}"?`}
        confirmLabel="Delete Quote"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
