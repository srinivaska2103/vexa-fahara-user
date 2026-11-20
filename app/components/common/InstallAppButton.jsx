'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { cn } from '@/lib/utils';

export default function InstallAppButton({ className = '', variant = 'mobile' }) {
  const { isInstalled, isIOS, canInstall, triggerInstall, mounted } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If not mounted, already installed, or not installable, do not render
  if (!mounted || isInstalled || !canInstall) {
    return null;
  }

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Directly opens native browser prompt; only opens modal on iOS Safari
    triggerInstall(setShowIOSModal);
  };

  return (
    <>
      {/* ── INSTALL APP BUTTON ── */}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install Grab2GO App"
        title="Install Grab2GO App"
        className={cn(
          "inline-flex items-center justify-center shrink-0 transition-all duration-200 active:scale-95 cursor-pointer select-none",
          variant === 'mobile'
            ? "px-2 xs:px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md shadow-xs gap-1"
            : "px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#B71C1C] via-[#E50914] to-[#B71C1C] text-white hover:brightness-105 shadow-sm text-xs font-black gap-1.5 border border-red-500/30",
          className
        )}
      >
        <Download 
          size={variant === 'mobile' ? 13 : 15} 
          className="text-amber-300 shrink-0 stroke-[2.5]" 
        />
        
        {/* Responsive text handling: icon-only on 320px, 'Install' at 360px+, 'Install App' on desktop */}
        {variant === 'mobile' ? (
          <span className="hidden min-[360px]:inline text-[9px] xs:text-[10px] font-black uppercase tracking-wider leading-none">
            Install
          </span>
        ) : (
          <span className="text-xs font-black tracking-tight leading-none">
            Install App
          </span>
        )}
      </button>

      {/* ── ONLY FOR IOS SAFARI (Share -> Add to Home Screen) ── */}
      {isIOS && showIOSModal && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIOSModal(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-stone-200 text-stone-800 z-10 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#E50914] flex items-center justify-center shadow-xs">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#252525]">Install Grab2GO App</h3>
                    <p className="text-[11px] text-stone-500 font-medium">Add to your Home Screen</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowIOSModal(false)}
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>

              {/* iOS Instructions */}
              <div className="space-y-3 text-xs text-stone-600">
                <p className="font-medium text-stone-700">
                  Follow these steps in Safari:
                </p>
                <div className="space-y-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                    <p className="leading-tight">Tap the <Share size={14} className="inline text-[#E50914] mx-1" /> <strong>Share</strong> icon in the bottom Safari toolbar.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                    <p className="leading-tight">Scroll down and choose <PlusSquare size={14} className="inline text-[#E50914] mx-1" /> <strong>Add to Home Screen</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                    <p className="leading-tight">Tap <strong>Add</strong> at top-right to finish.</p>
                  </div>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#E50914] text-white text-xs font-black active:scale-95 transition-transform cursor-pointer shadow-sm"
              >
                Got It
              </button>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
