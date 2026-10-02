'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { contactsApi } from '@/lib/api';
import { useToast } from '@/components/admin/Toast';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import {
  Mail,
  Search,
  Filter,
  ChevronRight,
  Phone,
  Calendar,
  Eye,
  Trash2,
  X,
  RefreshCw,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminContactsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal / Drawer Detail View
  const [activeMessage, setActiveMessage] = useState<any | null>(null);

  // Deletion State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await contactsApi.getAdminContacts({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setContacts(data || []);
    } catch (err: any) {
      toastError(err?.message || 'Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts();
  };

  const handleOpenMessage = async (msg: any) => {
    setActiveMessage(msg);
    // If it was 'New', mark as 'Read'
    if (msg.status === 'New') {
      try {
        await contactsApi.updateStatus(msg.id, 'Read');
        setContacts((prev) =>
          prev.map((c) => (c.id === msg.id ? { ...c, status: 'Read' } : c))
        );
        setActiveMessage((prev: any) => ({ ...prev, status: 'Read' }));
      } catch {}
    }
  };

  const handleStatusChange = async (msgId: string, nextStatus: string) => {
    try {
      await contactsApi.updateStatus(msgId, nextStatus);
      toastSuccess(`Message status updated to "${nextStatus}".`);
      setContacts((prev) =>
        prev.map((c) => (c.id === msgId ? { ...c, status: nextStatus } : c))
      );
      if (activeMessage && activeMessage.id === msgId) {
        setActiveMessage((prev: any) => ({ ...prev, status: nextStatus }));
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to update status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      await contactsApi.deleteContact(messageToDelete.id);
      toastSuccess('Contact message deleted.');
      setContacts((prev) => prev.filter((c) => c.id !== messageToDelete.id));
      if (activeMessage?.id === messageToDelete.id) {
        setActiveMessage(null);
      }
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete message.');
    } finally {
      setDeleting(false);
    }
  };

  const statusColors: Record<string, string> = {
    New: 'bg-purple-950 text-purple-300 border-purple-700',
    Read: 'bg-blue-950 text-blue-300 border-blue-700',
    Replied: 'bg-emerald-950 text-emerald-300 border-emerald-700',
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
            <span className="text-emerald-400">Contact Messages</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Messages & Inquiries</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View inbound communications submitted through the public Contact Us form.
          </p>
        </div>

        <button
          onClick={fetchContacts}
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
            placeholder="Search messages by sender name, email, phone, or text content..."
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
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-4">Sender</th>
                <th className="px-4 py-4">Contact Info</th>
                <th className="px-4 py-4">Service Required</th>
                <th className="px-4 py-4">Message Snippet</th>
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
                      <span>Loading contact messages...</span>
                    </div>
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-400">No contact messages found.</p>
                    <p className="text-[11px] mt-1">Inbound messages from the Contact Us form will appear here.</p>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Sender */}
                    <td className="px-5 py-4">
                      <div>
                        <button
                          onClick={() => handleOpenMessage(c)}
                          className="font-bold text-white text-sm hover:text-emerald-400 text-left block"
                        >
                          {c.name}
                        </button>
                        {c.company_name && (
                          <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                            {c.company_name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <a href={`mailto:${c.email}`} className="text-slate-300 hover:text-emerald-400 block truncate max-w-[150px]">
                          {c.email}
                        </a>
                        <a href={`tel:${c.phone}`} className="text-slate-400 hover:text-emerald-400 block font-mono text-[11px]">
                          {c.phone}
                        </a>
                      </div>
                    </td>

                    {/* Service Required */}
                    <td className="px-4 py-4 text-slate-300 font-medium">
                      {c.service_required || 'General Inquiry'}
                    </td>

                    {/* Message Snippet */}
                    <td className="px-4 py-4">
                      <p className="text-slate-300 line-clamp-2 max-w-xs">{c.message}</p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-slate-400">
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-4">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          statusColors[c.status] || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenMessage(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          title="Read Full Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setMessageToDelete(c);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Delete Message"
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

      {/* Message Viewer Modal */}
      <AnimatePresence>
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    Contact Message
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{activeMessage.name}</h2>
                </div>
                <button
                  onClick={() => setActiveMessage(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Email</span>
                    <a href={`mailto:${activeMessage.email}`} className="text-xs font-semibold text-emerald-400 hover:underline">
                      {activeMessage.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Phone</span>
                    <a href={`tel:${activeMessage.phone}`} className="text-xs font-semibold text-emerald-400 hover:underline">
                      {activeMessage.phone}
                    </a>
                  </div>
                  {activeMessage.company_name && (
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Company</span>
                      <span className="text-xs text-slate-200">{activeMessage.company_name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Service</span>
                    <span className="text-xs text-slate-200">{activeMessage.service_required || 'General'}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Message Body</span>
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
                    {activeMessage.message}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Update Status:</span>
                  <select
                    value={activeMessage.status}
                    onChange={(e) => handleStatusChange(activeMessage.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 text-purple-300 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`mailto:${activeMessage.email}?subject=Re: Inquiry with KPS Worldwide Logistics`}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>

                <button
                  onClick={() => setActiveMessage(null)}
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
        title="Delete Contact Message?"
        message={`Are you sure you want to delete the message from "${messageToDelete?.name}"?`}
        confirmLabel="Delete Message"
        loading={deleting}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
