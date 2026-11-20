'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_INTRO_KEY = 'g2g_intro_viewed_session_v1';
const TARGET_ROUTE = '/customer/cafe';

export default function RootIntroPage() {
  const router = useRouter();
  const videoRef = useRef(null);

  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [videoError, setVideoError] = useState(false);
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
          // Already viewed in this session, navigate directly
          router.replace(TARGET_ROUTE);
          return;
        }
      }
    } catch {
      // Fallback: proceed to play intro
    }
    setHasCheckedSession(true);
  }, [router]);

  // Attempt video autoplay when session check is satisfied
  useEffect(() => {
    if (!hasCheckedSession || isNavigating) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // If browser aborts due to power saving or policy, catch silently without console spam
          if (err.name === 'AbortError' || err.name === 'NotAllowedError') {
            return;
          }
          console.warn('[Intro Video] Playback note:', err);
        });
      }
    };

    attemptPlay();

    // In case battery saver / background tab prevented instant play, play as soon as tab is visible or interacted with
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && video.paused) {
        attemptPlay();
      }
    };

    const handleFirstInteraction = () => {
      if (video.paused) {
        attemptPlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasCheckedSession, isNavigating]);

  // If session is already recognized and redirecting, render pure white screen matching the video
  if (!hasCheckedSession) {
    return <main className="fixed inset-0 z-50 bg-white" />;
  }

  return (
    <main
      onClick={completeIntroAndNavigate}
      className="fixed inset-0 z-50 w-screen h-[100dvh] bg-white overflow-hidden flex items-center justify-center select-none cursor-pointer"
    >
      {/* ── True Full Height Video ── */}
      {!videoError && (
        <video
          ref={videoRef}
          src="/videos/grab2go-intro.mp4"
          className="w-full h-full object-cover sm:object-contain bg-white"
          playsInline
          autoPlay
          muted
          preload="auto"
          onEnded={completeIntroAndNavigate}
          onError={() => {
            // Gracefully transition to cafes on error
            completeIntroAndNavigate();
          }}
        />
      )}
    </main>
  );
}
