'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, X, SlidersHorizontal, User, LogOut, Utensils
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { profileService } from '@/services/profile.service';
import { authService } from '@/services/auth.service';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import InstallAppButton from '@/app/components/common/InstallAppButton';

export default function MobileFoodHeader({ 
  searchQuery = '', 
  onSearchChange = () => {},
  onFilterClick = () => {} 
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);
  const [notifications, setNotifications] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Time-based greeting prefix
  const [greetingPrefix, setGreetingPrefix] = useState('Good evening');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingPrefix('Good morning');
    else if (hour < 17) setGreetingPrefix('Good afternoon');
    else setGreetingPrefix('Good evening');
  }, []);

  // Fetch avatar & notifications
  useEffect(() => {
    if (!user) return;

    profileService.getProfile()
      .then((res) => {
        const data = res?.data || res;
        const img = data?.avatar || data?.profile_image || data?.image || data?.photo_url;
        if (img) setProfileImage(img);
      })
      .catch(() => {});

    api.get('/notifications')
      .then((res) => {
        const data = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {});
  }, [user]);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      await authService.logout().catch(() => null);
    } catch (e) {}
    logout();
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('fahara-auth-storage');
    }
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const rawUserName = user?.name || user?.full_name || (user?.email ? user.email.split('@')[0] : '');
  const userName = rawUserName.trim();
  const userInitials = userName ? userName.substring(0, 2).toUpperCase() : 'FC';

  return (
    <>
      {/* ── TOP HEADER ROW (Grab2GO Brand, Switch, Notifications, Avatar) ── */}
      <div className="md:hidden relative w-full bg-[#E50914] text-white px-2.5 xs:px-4 pt-3 pb-1 transition-all duration-200 overflow-visible border-0 z-40" suppressHydrationWarning>
        <div className="relative z-10 flex flex-col space-y-2.5" suppressHydrationWarning>
          
          {/* Navigation Row */}
          <div className="flex items-center justify-between gap-1 w-full overflow-hidden">
            {/* Left: Grab2GO Logo (Larger on Mobile, text hidden) */}
            <div className="flex items-center gap-1.5 xs:gap-2 shrink-0">
              <Link 
                href="/customer/food" 
                className="flex items-center active:scale-95 transition-transform shrink-0"
                aria-label="Grab2GO Food"
              >
                <div className="relative w-10 h-10 xs:w-11 xs:h-11 rounded-2xl overflow-hidden shadow-md ring-2 ring-white/60 bg-white shrink-0 p-1">
                  <Image
                    src="/grab-it-logo.png"
                    alt="Grab2GO Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Right: Install App + Switch Pill + Notification Bell + User Avatar */}
            <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
              
              {/* Install App Button */}
              <InstallAppButton variant="mobile" />

              {/* Switch Pill (Food & Discover Cafe) */}
              <div className="flex items-center bg-white/20 p-0.5 rounded-full border border-white/30 backdrop-blur-md shrink-0">
                <Link
                  href="/customer/food"
                  className={cn(
                    "px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-[8.5px] xs:text-[10px] font-black transition-all flex items-center gap-0.5 xs:gap-1",
                    pathname?.startsWith('/customer/food')
                      ? "bg-white text-[#E50914] shadow-xs"
                      : "text-white hover:text-white/80"
                  )}
                >
                  <Utensils size={8.5} className="hidden xs:inline" />
                  <span>Food</span>
                </Link>
                <Link
                  href="/customer/cafe"
                  className={cn(
                    "px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-[8.5px] xs:text-[10px] font-black transition-all",
                    pathname?.startsWith('/customer/cafe') || pathname?.startsWith('/customer/discover')
                      ? "bg-white text-[#E50914] shadow-xs"
                      : "text-white hover:text-white/80"
                  )}
                >
                  <span>Cafe</span>
                </Link>
              </div>

              {/* Notification Button */}
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsProfileOpen(false);
                  }}
                  suppressHydrationWarning
                  type="button"
                  className={cn(
                    "w-7 h-7 xs:w-9 xs:h-9 rounded-xl xs:rounded-2xl backdrop-blur-md flex items-center justify-center transition-all relative active:scale-90 cursor-pointer shadow-sm",
                    isNotifOpen
                      ? "bg-white text-[#E50914] ring-2 ring-white/50"
                      : "bg-white/20 text-white border border-white/25 hover:bg-white/30"
                  )}
                  aria-label="Notifications"
                >
                  <Bell size={14} className="text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 xs:min-w-4 xs:h-4 px-1 rounded-full bg-white text-[#E50914] text-[8px] xs:text-[9px] font-black flex items-center justify-center ring-1 xs:ring-2 ring-[#B71C1C]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popup Modal - Portaled to document.body */}
                {mounted && typeof document !== 'undefined' && createPortal(
                  <AnimatePresence>
                    {isNotifOpen && (
                      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                        {/* Full-screen backdrop to close when clicking outside */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsNotifOpen(false)}
                          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Centered Modern Modal */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 15 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 p-5 text-stone-800 space-y-3 relative z-10 overflow-hidden"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                              <span className="p-2 rounded-xl bg-[#FFF5F5] text-[#E50914]">
                                <Bell size={16} />
                              </span>
                              <h3 className="text-sm font-black text-[#252525]">Notifications</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              {unreadCount > 0 && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-[#E50914]">
                                  {unreadCount} new
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => setIsNotifOpen(false)}
                                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                            {notifications.length > 0 ? (
                              notifications.slice(0, 6).map((n) => (
                                <div
                                  key={n.id || n._id}
                                  className={cn(
                                    "p-3 rounded-2xl border text-xs transition-colors cursor-pointer",
                                    n.is_read ? "bg-stone-50 border-stone-100" : "bg-[#FFF5F5] border-red-200"
                                  )}
                                >
                                  <p className="font-black text-[#252525] line-clamp-1">{n.title || 'Notification'}</p>
                                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5 leading-relaxed">{n.message || n.content}</p>
                                </div>
                              ))
                            ) : (
                              <div className="py-8 text-center space-y-2">
                                <Bell size={24} className="text-stone-300 mx-auto" />
                                <p className="text-xs font-bold text-stone-400">
                                  No new notifications
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => setIsNotifOpen(false)}
                              className="text-xs font-bold text-stone-500 hover:text-stone-800"
                            >
                              Dismiss
                            </button>
                            <Link
                              href="/customer/profile?tab=notifications"
                              onClick={() => setIsNotifOpen(false)}
                              className="text-xs font-black text-[#E50914] hover:underline"
                            >
                              View all notifications →
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>,
                    document.body
                  )}
                </div>

              {/* User Avatar */}
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                  }}
                  type="button"
                  className="w-7 h-7 xs:w-9 xs:h-9 rounded-xl xs:rounded-2xl overflow-hidden ring-2 ring-white/40 shadow-sm active:scale-90 transition-transform cursor-pointer bg-white/20"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={userName || 'User'}
                      className="w-full h-full object-cover"
                      onError={() => setProfileImage(null)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-xs text-white bg-white/30">
                      {userInitials}
                    </div>
                  )}
                </button>

                {/* Profile Popup */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 z-50 text-stone-800 space-y-2"
                    >
                      <div className="px-2 py-1.5 border-b border-stone-100">
                        <p className="font-black text-xs text-[#252525] truncate">{userName || 'Customer'}</p>
                        <p className="text-[10px] text-stone-400 truncate">{user?.email || ''}</p>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/customer/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF5F5] hover:text-[#E50914] transition-colors"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/customer/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF5F5] hover:text-[#E50914] transition-colors"
                        >
                          Profile & Settings
                        </Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        type="button"
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* Greeting Row */}
          <div className="flex flex-col pt-0.5" suppressHydrationWarning>
            <h1 className="text-xl xs:text-2xl font-black text-white tracking-tight leading-tight" suppressHydrationWarning>
              <span suppressHydrationWarning>
                {userName ? `${greetingPrefix}, ${userName}!` : `${greetingPrefix}!`}
              </span>
            </h1>
            <p className="text-xs text-white/90 font-semibold tracking-wide truncate w-full text-left mt-0.5">
              Craving something delicious today?
            </p>
          </div>

        </div>
      </div>

      {/* ── STICKY SEARCH & FILTER ROW (Floating on scroll) ── */}
      <div 
        id="mobile-food-sticky-search-bar"
        className="md:hidden sticky top-0 z-40 w-full bg-[#E50914] px-4 py-2.5 shadow-[0_8px_20px_rgba(183,28,28,0.25)]"
        suppressHydrationWarning
      >
        <div className="flex items-center gap-2.5">
          {/* Search Pill Input */}
          <div className="relative flex-1 flex items-center bg-white rounded-full px-4 py-2.5 shadow-xs border border-white/40">
            <Search size={16} className="text-[#E50914] shrink-0 mr-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes, restaurants or cuisines..."
              suppressHydrationWarning
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-transparent text-[#252525] placeholder:text-stone-400 text-xs font-bold focus:outline-none cursor-text pr-1"
            />
            {Boolean(searchQuery) && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => onSearchChange('')}
                className="text-stone-400 hover:text-stone-700 p-0.5 rounded-full active:scale-90 transition-transform cursor-pointer shrink-0 ml-1"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Circular Filter Toggle Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={onFilterClick}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#E50914] active:scale-90 transition-transform cursor-pointer shrink-0 shadow-md hover:bg-stone-50"
            aria-label="Open Filters"
          >
            <SlidersHorizontal size={17} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </>
  );
}

