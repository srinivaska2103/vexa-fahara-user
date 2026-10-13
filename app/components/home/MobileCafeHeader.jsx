'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, X, SlidersHorizontal, ArrowRight, User, LogOut, Heart, CalendarCheck, Star
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useSearchStore } from '@/stores/search.store';
import { profileService } from '@/services/profile.service';
import { loyaltyService } from '@/services/loyalty.service';
import { authService } from '@/services/auth.service';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function MobileCafeHeader({ onFilterClick }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);

  // Dedicated controlled input state separate from search store queries
  const [searchInput, setSearchInput] = useState(query || '');
  const isTypingRef = React.useRef(false);

  // Keep searchInput in sync only when query is changed externally and user is NOT typing
  useEffect(() => {
    if (!isTypingRef.current && query !== searchInput) {
      setSearchInput(query || '');
    }
  }, [query]);

  // Debounce syncing to Zustand search store so typing and spaces never trigger immediate store/network thrashing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== query) {
        setQuery(searchInput);
      }
      isTypingRef.current = false;
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, query, setQuery]);

  const handleSearchChange = (e) => {
    e.stopPropagation();
    isTypingRef.current = true;
    setSearchInput(e.target.value);
  };

  const handleClearSearch = (e) => {
    if (e) e.stopPropagation();
    isTypingRef.current = false;
    setSearchInput('');
    setQuery('');
  };

  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);
  const [imageError, setImageError] = useState(false);
  const [loyaltyCredits, setLoyaltyCredits] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load profile avatar & loyalty credits & notifications
  useEffect(() => {
    if (!user) return;

    profileService.getProfile()
      .then((res) => {
        const data = res?.data || res;
        const img = data?.avatar || data?.profile_image || data?.image || data?.photo_url;
        if (img) setProfileImage(img);
      })
      .catch(() => {});

    loyaltyService.getSummary()
      .then((res) => {
        const data = res?.data || res;
        if (data && typeof data.credit_balance !== 'undefined') {
          setLoyaltyCredits(data.credit_balance);
        }
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
  const userName = user?.name || user?.full_name || (user?.email ? user.email.split('@')[0] : 'Guest');
  const userInitials = userName ? userName.substring(0, 2).toUpperCase() : 'FC';

  // Check scroll position to dynamically round bottom of header when scrolled past hero banner
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="md:hidden w-full sticky top-0 z-40 bg-[#2C1810]" suppressHydrationWarning>
      {/* ── 1. NON-SCROLLABLE STICKY HEADER (Permanently Fixed at Top) ── */}
      <div className={cn(
        "relative w-full bg-[#2C1810] text-white px-4 pt-3.5 pb-2 transition-all duration-200 overflow-visible border-0",
        isScrolled 
          ? "rounded-b-[28px] shadow-[0_14px_32px_rgba(20,9,5,0.45)]" 
          : "rounded-b-none shadow-none"
      )} suppressHydrationWarning>
        <div className="relative z-10 flex flex-col space-y-3" suppressHydrationWarning>
          
          {/* Navigation Row (Logo + Notifications + Avatar) */}
          <div className="flex items-center justify-between">
            {/* Left: Fahara Logo + Branded Wordmark */}
            <Link 
              href="/customer/cafe" 
              className="flex items-center gap-2.5 active:scale-95 transition-transform"
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md ring-1 ring-white/20 bg-black/40 shrink-0">
                <Image
                  src="/Fahara%20Logo.jpeg"
                  alt="Fahara Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-wider text-[#FFF8F0] leading-none">
                  FAHARA
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-[#DDB892] uppercase mt-0.5 leading-none">
                  Cafe & Events
                </span>
              </div>
            </Link>

            {/* Right: Notification Bell Button & User Avatar Control */}
            <div className="flex items-center gap-2">
              
              {/* Notification Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsProfileOpen(false);
                  }}
                  suppressHydrationWarning
                  type="button"
                  className={cn(
                    "w-10 h-10 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all relative active:scale-90 cursor-pointer shadow-sm",
                    isNotifOpen
                      ? "bg-[#6F4E37] text-white ring-2 ring-[#DDB892]/50"
                      : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                  )}
                  aria-label="Notifications"
                >
                  <Bell size={18} className="text-[#FFF8F0]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#E63946] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-[#2A150D]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Popup */}
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 bg-white text-[#2C1810] rounded-2xl border border-stone-200 shadow-2xl p-3 z-50 space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                        <span className="text-xs font-black text-[#2C1810]">Notifications</span>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <span className="text-[10px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-2 py-0.5 rounded-full border border-[#DDB892]">
                              {unreadCount} New
                            </span>
                          )}
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await api.patch('/notifications/read-all').catch(() => null);
                                  setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                                  toast.success('Marked all as read');
                                } catch (err) {
                                  // silent
                                }
                              }}
                              className="text-[10px] font-bold text-[#6F4E37] hover:underline active:scale-95 transition-transform cursor-pointer"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-1.5 no-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id || n._id}
                              onClick={async () => {
                                if (!n.is_read) {
                                  const id = n.id || n._id;
                                  await api.patch(`/notifications/${id}/read`).catch(() => null);
                                  setNotifications((prev) =>
                                    prev.map((item) => ((item.id || item._id) === id ? { ...item, is_read: true } : item))
                                  );
                                }
                              }}
                              className={cn(
                                "p-2 rounded-xl border text-xs transition-colors cursor-pointer",
                                n.is_read 
                                  ? "bg-stone-50/80 border-stone-100 hover:bg-[#FFF8F0]" 
                                  : "bg-[#FFF8F0] border-[#DDB892]/50 hover:bg-[#FDF4E7]"
                              )}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <p className="font-bold text-[#2C1810] line-clamp-1">{n.title || 'Notification'}</p>
                                {!n.is_read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5">{n.message || n.content}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-[11px] font-bold text-stone-400">
                            No notifications
                          </p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-stone-100 text-center">
                        <Link
                          href="/customer/profile?tab=notifications"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-[11px] font-extrabold text-[#6F4E37] hover:underline"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile / Avatar Control */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                  }}
                  type="button"
                  suppressHydrationWarning
                  aria-label="User profile menu"
                  className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-white/20 active:scale-90 transition-transform bg-[#1F100B] flex items-center justify-center cursor-pointer shadow-sm"
                >
                  {profileImage && !imageError ? (
                    <img
                      src={profileImage}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-xs font-black text-[#DDB892] tracking-wider">
                      {userInitials}
                    </span>
                  )}
                </button>

                {/* Profile Popup Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white text-[#2C1810] rounded-2xl border border-stone-200 shadow-2xl p-2.5 z-50 space-y-1 text-left"
                    >
                      <div className="p-2 border-b border-stone-100">
                        <p className="font-black text-xs text-[#2C1810] truncate">{userName}</p>
                        <p className="text-[10px] text-stone-500 truncate">{user?.email || 'Logged in'}</p>
                        {loyaltyCredits > 0 && (
                          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[10px] font-extrabold text-[#6F4E37]">
                            <span>⭐ {loyaltyCredits} Credits</span>
                          </div>
                        )}
                      </div>

                      <Link
                        href="/customer/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
                      >
                        <User size={14} />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/customer/bookings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
                      >
                        <CalendarCheck size={14} />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        href="/customer/favorites"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
                      >
                        <Heart size={14} />
                        <span>Favorites</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        type="button"
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
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

          {/* Greeting Row (Permanently Visible & Non-Scrollable) */}
          <div className="flex flex-col pt-0.5" suppressHydrationWarning>
            <h1 className="text-xl xs:text-2xl font-black text-[#FFF8F0] tracking-tight leading-tight flex items-center gap-1.5" suppressHydrationWarning>
              <span suppressHydrationWarning>Hi, {userName}!</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs text-[#DDB892] font-semibold tracking-wide mt-0.5">
              Let's find the best cafe!
            </p>
          </div>

          {/* Search & Filter Controls (Always Sticky and Visible) */}
          <div className="flex items-center gap-2.5 pt-0.5 pb-0.5">
            {/* Search Pill Input */}
            <div className="relative flex-1 flex items-center bg-[#FFF8F0] rounded-full px-4 py-2.5 shadow-inner border border-white/20">
              <Search size={16} className="text-[#8C5E3C] shrink-0 mr-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search cafes, events or locations..."
                suppressHydrationWarning
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-transparent text-[#2C1810] placeholder:text-stone-400 text-xs font-bold focus:outline-none cursor-text pr-1"
              />
              {Boolean(searchInput) && (
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handleClearSearch}
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
              className="w-11 h-11 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#6F4E37] active:scale-90 transition-transform cursor-pointer shrink-0 shadow-md hover:bg-white"
              aria-label="Open Filters"
            >
              <SlidersHorizontal size={17} strokeWidth={2.3} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
