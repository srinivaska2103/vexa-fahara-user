'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, X, ShieldCheck, Utensils, Coffee } from 'lucide-react';

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title = 'Login to continue',
  subtitle = 'Create an account or sign in to order food and reserve your favourite cafes.',
  actionType = 'food', // 'food' | 'booking'
  returnUrl = null
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const currentPath = returnUrl || (typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : '/customer/cafe');

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('post_login_redirect', currentPath);
    }
    onClose();
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleRegister = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('post_login_redirect', currentPath);
    }
    onClose();
    router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 text-stone-800 space-y-4 relative z-10 overflow-hidden text-center mx-auto my-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={15} />
          </button>

          {/* Header Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2] flex items-center justify-center mx-auto shadow-sm">
            {actionType === 'booking' ? (
              <Coffee size={26} strokeWidth={2.2} />
            ) : (
              <Utensils size={26} strokeWidth={2.2} />
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-1.5 pt-1">
            <h3 className="text-lg font-black text-[#252525] tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleLogin}
              className="w-full py-3 rounded-2xl bg-[#E50914] hover:bg-[#B71C1C] text-white text-xs font-black shadow-md shadow-[#E50914]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <LogIn size={15} />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-2.5 rounded-2xl bg-[#FFF5F5] hover:bg-red-100 text-[#E50914] border border-red-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-semibold">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(modalContent, document.body);
}

