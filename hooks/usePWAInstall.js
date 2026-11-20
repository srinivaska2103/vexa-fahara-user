'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * usePWAInstall hook
 * Manages native PWA beforeinstallprompt lifecycle and iOS detection.
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === 'undefined') return;

    // 1. Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('[PWA] SW register error:', err));
    }

    // 2. Already Installed / Standalone Mode Detection
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    setIsInstalled(isStandalone);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleModeChange = (e) => {
      setIsInstalled(e.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleModeChange);
    }

    // 3. iOS Detection (Safari lacks beforeinstallprompt)
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    setIsIOS(isApple);

    // 4. Capture native beforeinstallprompt (Chromium / Android Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleModeChange);
      }
    };
  }, []);

  /**
   * triggerInstall
   * - If native prompt is available: IMMEDIATELY opens native dialog without any custom modal.
   * - If iOS: triggers the provided iOS callback modal.
   */
  const triggerInstall = useCallback(
    async (onShowIOSModal) => {
      if (deferredPrompt) {
        // Direct Native Browser Dialog
        try {
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          if (choice?.outcome === 'accepted') {
            setIsInstalled(true);
          }
        } catch (err) {
          console.error('[PWA] Native prompt invocation error:', err);
        } finally {
          setDeferredPrompt(null);
        }
        return;
      }

      // iOS Safari (No beforeinstallprompt exists)
      if (isIOS && onShowIOSModal) {
        onShowIOSModal(true);
      }
    },
    [deferredPrompt, isIOS]
  );

  // Can install if not already installed AND either native prompt is ready OR on iOS Safari
  const canInstall = !isInstalled && (Boolean(deferredPrompt) || isIOS);

  return {
    isInstalled,
    isIOS,
    canInstall,
    hasDeferredPrompt: Boolean(deferredPrompt),
    triggerInstall,
    mounted,
  };
}
