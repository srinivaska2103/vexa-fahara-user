'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Copy, 
  Check, 
  X, 
  Headphones, 
  Clock, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HelpSupportModal({ isOpen, onClose }) {
  const [copiedField, setCopiedField] = useState(null);

  const contactNumber = '+91 89460 29205';
  const cleanPhone = '918946029205';
  const contactEmail = 'vexatech.connect@gmail.com';

  const copyToClipboard = (text, field) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`Copied ${field} to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3.5 sm:p-4 select-none font-sans">
        {/* Fullscreen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-[380px] xs:max-w-[400px] bg-white rounded-[28px] shadow-2xl border border-stone-200 overflow-hidden z-10 text-stone-800"
        >
          {/* Header Gradient Strip */}
          <div className="relative bg-gradient-to-r from-[#B71C1C] via-[#E50914] to-[#B71C1C] text-white p-5 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <Headphones size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                  Help &amp; Support
                </h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  Grab2GO Customer Assistance
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 xs:p-5 space-y-3.5 -mt-2 bg-white rounded-t-3xl relative z-10">
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Have questions about your order, cafe reservation, or account? Our support team is ready to assist you.
            </p>

            {/* Contact Option 1: Phone Call */}
            <div className="p-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/70 hover:bg-[#FFF5F5] hover:border-[#EF5350]/50 transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#E50914] flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Phone Support
                  </p>
                  <a 
                    href={`tel:${cleanPhone}`} 
                    className="text-xs xs:text-sm font-black text-[#252525] hover:text-[#E50914] transition-colors truncate block"
                  >
                    {contactNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(contactNumber, 'Phone Number')}
                  title="Copy Phone Number"
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 active:scale-95 transition-all cursor-pointer shadow-2xs"
                >
                  {copiedField === 'Phone Number' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-2.5 py-1.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-[11px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
                >
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Contact Option 2: WhatsApp Chat */}
            <div className="p-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                    WhatsApp Chat
                  </p>
                  <p className="text-xs xs:text-sm font-black text-[#252525] truncate">
                    Fast WhatsApp Support
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20Grab2GO%20Support,%20I%20need%20help%20with%20my%20order`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center gap-1.5 active:scale-95 transition-all shrink-0 shadow-2xs"
              >
                <span>Chat</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Contact Option 3: Gmail */}
            <div className="p-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/70 hover:bg-[#FFF5F5] hover:border-[#EF5350]/50 transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Email Support
                  </p>
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="text-xs font-black text-[#252525] hover:text-[#E50914] transition-colors truncate block"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(contactEmail, 'Email')}
                  title="Copy Email"
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 active:scale-95 transition-all cursor-pointer shadow-2xs"
                >
                  {copiedField === 'Email' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
                <a
                  href={`mailto:${contactEmail}`}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
                >
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* Footer Trust Info */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-stone-400">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>Mon – Sun, 9AM – 10PM</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck size={13} />
                <span>Verified Support</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

