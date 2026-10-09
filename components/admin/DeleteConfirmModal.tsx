'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  secondaryActionLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSecondaryAction?: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  secondaryActionLabel,
  loading = false,
  onClose,
  onConfirm,
  onSecondaryAction,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17211E]/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white rounded-2xl shadow-2xl border border-[#E2E9E5] max-w-lg w-full overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center border border-red-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-[#66736E] hover:text-[#17211E] transition-colors p-1.5 rounded-lg hover:bg-[#F7F9F8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-[#17211E] mb-2">{title}</h3>
            <div className="text-xs text-[#66736E] leading-relaxed space-y-2">{message}</div>
          </div>

          <div className="px-6 py-4 bg-[#F7F9F8] border-t border-[#E2E9E5] flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-[#17211E] bg-white border border-[#E2E9E5] rounded-xl hover:bg-[#F7F9F8] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {secondaryActionLabel && onSecondaryAction && (
              <button
                type="button"
                onClick={onSecondaryAction}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-[#006B4F] bg-[#EAF5F1] border border-[#006B4F]/30 rounded-xl hover:bg-[#D5EDE5] transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{secondaryActionLabel}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C] transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{confirmLabel}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
