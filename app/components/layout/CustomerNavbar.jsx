import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, List, LayoutGrid, SlidersHorizontal, Bell, Heart, User, 
  Settings, LogOut, CalendarCheck, Moon, Sun, ChevronDown, Sparkles, Compass 
} from 'lucide-react';
import SearchBar from '@/app/components/cafes/SearchBar';
import { useSearchStore } from '@/stores/search.store';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useLanguage } from '@/context/LanguageContext';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

import api from '@/lib/axios';

export default function CustomerNavbar({ 
  showSearch = false, 
  showViewToggles = false, 
  onFilterClick = null 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { viewMode, setViewMode } = useSearchStore();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    try {
      await authService.logout().catch(() => null);
    } catch (err) {
      // Ignore API errors on logout
    }
    logout();
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('fahara-auth-storage');
    }
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };
  const favoriteCafes = useFavoritesStore((state) => state.favoriteCafes || []);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifLoading, setIsNotifLoading] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real notifications from backend API
  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      setIsNotifLoading(true);
      try {
        const res = await api.get('/notifications').catch(() => null);
        const data = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Notifications fetch error:", err);
      } finally {
        setIsNotifLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  const userName = user?.name || user?.full_name || (user?.email ? user.email.split('@')[0] : 'Guest Customer');
  const userInitials = userName ? userName.substring(0, 2).toUpperCase() : 'FC';

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-stone-200/80 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-2 sm:py-3 print:hidden" suppressHydrationWarning>
      <div className="container mx-auto px-2.5 sm:px-4 flex flex-col gap-2" suppressHydrationWarning>
        
        {/* Top Row: Logo & Brand | Search Bar | Notifications & Profile */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Left: Logo & Brand Name */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/customer/cafe" className="flex items-center gap-2 sm:gap-2.5 hover:scale-105 active:scale-95 transition-transform duration-300">
              <Image 
                src="/Fahara%20Logo.jpeg" 
                alt="Fahara Logo" 
                width={36} 
                height={36} 
                className="object-contain drop-shadow-xs rounded-xl border border-[#DDB892]/40" 
                priority 
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-black text-[#4A2C11] leading-none tracking-wide">FAHARA</span>
                <span className="text-[8px] sm:text-[10px] font-extrabold text-stone-400 mt-0.5 tracking-wider uppercase hidden sm:block">Cafe & Event Booking</span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-xl mx-2 sm:mx-4 min-w-0">
              <SearchBar />
            </div>
          )}
          
          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 ml-auto" suppressHydrationWarning>

            {/* Notifications Dropdown Container */}
            <div className="relative" ref={notifRef} suppressHydrationWarning>
              <button 
                onClick={() => { setIsNotifMenuOpen(!isNotifMenuOpen); setIsProfileMenuOpen(false); }}
                className="p-2 sm:p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-600 hover:bg-white hover:text-[#6F4E37] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer" 
                title={t('notifications', 'Notifications')}
                suppressHydrationWarning
              >
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notifications Menu Popup */}
              <AnimatePresence>
                {isNotifMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-stone-200 shadow-xl p-3 z-50 space-y-2"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <span className="font-black text-xs text-[#2C1810]">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadNotifCount > 0 && (
                          <span className="text-[10px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] border border-[#DDB892]/40 px-2 py-0.5 rounded-md">
                            {unreadNotifCount} New
                          </span>
                        )}
                        {notifications.length > 0 && (
                          <button 
                            onClick={async () => {
                              await api.patch('/notifications/read-all').catch(() => null);
                              setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                            }}
                            className="text-[9px] font-bold text-stone-400 hover:text-[#6F4E37] transition-colors cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div 
                            key={n.id || n._id}
                            className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                              n.is_read 
                                ? 'bg-stone-50/80 border-stone-100 text-stone-600' 
                                : 'bg-[#FFF8F0]/70 border-[#DDB892]/40 text-[#2C1810]'
                            }`}
                          >
                            <div className="p-1.5 bg-[#6F4E37] text-white rounded-lg shrink-0 mt-0.5">
                              <Sparkles size={12} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#2C1810] line-clamp-1">{n.title || n.subject || 'Notification'}</p>
                              <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed line-clamp-2">{n.message || n.body || n.content}</p>
                              <span className="text-[9px] text-stone-400 font-semibold block mt-1">
                                {n.created_at ? (typeof n.created_at === 'string' && n.created_at.includes('ago') ? n.created_at : new Date(n.created_at).toLocaleDateString()) : 'Recently'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-xs font-bold text-stone-400">
                          No notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Dropdown Menu */}
            <div className="relative" ref={profileRef} suppressHydrationWarning>
              <button 
                onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifMenuOpen(false); }}
                className="flex items-center gap-1.5 p-1 sm:p-1.5 bg-stone-50 hover:bg-[#FFF8F0] border border-stone-200/80 rounded-xl transition-all cursor-pointer active:scale-95"
                suppressHydrationWarning
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#4A2C11] to-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-2xs border border-white">
                  {userInitials}
                </div>
                <ChevronDown size={14} className="text-stone-500 hidden sm:block" />
              </button>

              {/* Profile Dropdown Popup */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-xl p-2.5 z-50 space-y-1.5"
                  >
                    {/* User Summary Header */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#F5EBE0] border border-[#DDB892]/40 mb-1">
                      <p className="font-black text-xs text-[#2C1810] truncate">{userName}</p>
                      <p className="text-[10px] font-bold text-[#6F4E37] truncate">{user?.email || 'Customer Account'}</p>
                    </div>

                    {/* Navigation Options */}
                    <Link 
                      href="/customer/profile" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
                    >
                      <User size={14} /> Profile Dashboard
                    </Link>

                    <Link 
                      href="/customer/bookings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
                    >
                      <CalendarCheck size={14} /> My Bookings
                    </Link>

                    <Link 
                      href="/customer/favorites" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
                    >
                      <Heart size={14} /> Saved Favorites
                    </Link>

                    <div className="pt-1 border-t border-stone-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </header>
  );
}
