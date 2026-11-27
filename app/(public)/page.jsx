'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const SESSION_INTRO_KEY = 'g2g_intro_viewed_session_v1';
const TARGET_ROUTE = '/customer/cafe';

export default function RootIntroPage() {
  const router = useRouter();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Navigate to target route safely and mark session
  const completeIntroAndNavigate = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(SESSION_INTRO_KEY, 'true');
      }
    } catch {
      // Ignore sessionStorage exceptions (e.g. private mode)
    }

    router.replace(TARGET_ROUTE);
  }, [isNavigating, router]);

  // Session check on initial mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const viewed = window.sessionStorage.getItem(SESSION_INTRO_KEY);
        if (viewed === 'true') {
          router.replace(TARGET_ROUTE);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setHasCheckedSession(true);
  }, [router]);

  // Display intro screen for 2.5 seconds, then smoothly transition
  useEffect(() => {
    if (!hasCheckedSession || isNavigating) return;

    const timer = setTimeout(() => {
      completeIntroAndNavigate();
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasCheckedSession, isNavigating, completeIntroAndNavigate]);

  if (!hasCheckedSession) {
    return <main className="fixed inset-0 z-50 bg-[#E50914]" />;
  }

  return (
    <main
      onClick={completeIntroAndNavigate}
      className="fixed inset-0 z-50 w-screen h-[100dvh] bg-[#E50914] overflow-hidden flex flex-col items-center justify-center select-none cursor-pointer p-6"
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-sm"
      >
        {/* Rounded Circle Logo Container with subtle shadow & border */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-white p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/90 flex items-center justify-center overflow-hidden">
          <img
            src="/grab2go-circle-logo.jpg"
            alt="Grab2GO Logo"
            className="w-full h-full object-cover rounded-full pointer-events-none"
          />
        </div>

        {/* Brand Taglines */}
        <div className="mt-8 space-y-1.5 text-white">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
            Grab2Go
          </h2>
          <p className="text-xs sm:text-sm font-bold text-white/95 tracking-wide">
            Good Food. Great Vibes.
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-black uppercase tracking-wider text-white border border-white/30 shadow-inner">
              Just Grab2Go!
            </span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
