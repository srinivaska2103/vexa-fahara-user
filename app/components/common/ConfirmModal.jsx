'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, Info, X, Loader2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isProcessing = false,
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-100/80 border-red-200';
      case 'warning':
        return 'bg-amber-100/80 border-amber-200';
      default:
        return 'bg-blue-100/80 border-blue-200';
    }
  };

  const getConfirmBtnStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25 focus:ring-red-500';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25 focus:ring-amber-500';
      default:
        return 'bg-[#6F4E37] hover:bg-[#5a3f2d] text-white shadow-[#6F4E37]/25 focus:ring-[#6F4E37]';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          onClick={!isProcessing ? onClose : undefined}
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E8DED5] overflow-hidden z-10 p-6 sm:p-7 text-left"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Icon Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className={`p-3.5 rounded-2xl border ${getIconBg()} shrink-0 shadow-sm`}>
              {getIcon()}
            </div>
            <div className="pr-6">
              <h3 className="text-xl font-bold text-[#2C1810] tracking-tight leading-snug">
                {title}
              </h3>
              <p className="text-sm text-stone-500 font-medium mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-7 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold active:scale-[0.98] transition-all shadow-md flex items-center gap-2 disabled:opacity-50 ${getConfirmBtnStyle()}`}
            >
              {isProcessing && <Loader2 size={16} className="animate-spin" />}
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
