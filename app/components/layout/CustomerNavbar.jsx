import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, List, LayoutGrid, SlidersHorizontal, Bell, Heart, User, ShoppingBag, 
  Settings, LogOut, CalendarCheck, Moon, Sun, ChevronDown, Sparkles, Compass, Utensils 
} from 'lucide-react';
import SearchBar from '@/app/components/cafes/SearchBar';
import { useSearchStore } from '@/stores/search.store';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useCartStore } from '@/stores/cart.store';
import { useLanguage } from '@/context/LanguageContext';
import { authService } from '@/services/auth.service';
import toast from 'react-hot-toast';

import api from '@/lib/axios';

import { profileService } from '@/services/profile.service';
import { loyaltyService } from '@/services/loyalty.service';

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
  const { itemCount, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);
  const logout = useAuthStore((state) => state.logout);

  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);
  const [imageError, setImageError] = useState(false);
  const [loyaltyCredits, setLoyaltyCredits] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUserProfile = async () => {
      try {
        const profileRes = await profileService.getProfile().catch(() => null);
        const data = profileRes?.data || profileRes;
        if (data) {
          const img = data.avatar || data.profile_image || data.image || data.photo_url;
          if (img) {
            setProfileImage(img);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user profile avatar:', err);
      }
    };

    const fetchLoyalty = async () => {
      try {
        const res = await loyaltyService.getSummary().catch(() => null);
        const data = res?.data || res;
        if (data && typeof data.credit_balance !== 'undefined') {
          setLoyaltyCredits(data.credit_balance);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchUserProfile();
    fetchLoyalty();
  }, [user]);

  useEffect(() => {
    if (user?.avatar || user?.profile_image) {
      setProfileImage(user.avatar || user.profile_image);
    }
  }, [user]);

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
    <header className="hidden md:block bg-white/95 backdrop-blur-xl border-b border-stone-200/80 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-2 sm:py-3 print:hidden" suppressHydrationWarning>
      <div className="container mx-auto px-2.5 sm:px-4 flex flex-col gap-2" suppressHydrationWarning>
        
        {/* Top Row: Logo & Brand | Search Bar | Notifications & Profile */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Left: Logo & Brand Name */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 hover:scale-105 active:scale-95 transition-transform duration-300">
              <Image 
                src="/grab-it-logo.png" 
                alt="Grab2GO Logo" 
                width={46} 
                height={46} 
                className="object-contain drop-shadow-xs rounded-2xl border border-red-200 bg-white w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12" 
                priority 
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black leading-none tracking-tight">
                  <span className="text-[#1E1E1E]">Grab</span>
                  <span className="text-[#ED0014]">2GO</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black text-[#ED0014] mt-0.5 tracking-widest uppercase hidden sm:block">
                  CAFE &amp; EVENT BOOKING
                </span>
              </div>
            </Link>

            {/* Main Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-6 bg-stone-50 p-1 rounded-2xl border border-stone-200/80">
              <Link 
                href="/customer/food" 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${pathname.startsWith('/customer/food') ? 'bg-[#E50914] text-white shadow-2xs' : 'text-[#E50914] hover:bg-white'}`}
              >
                <Utensils size={13} /> Food
              </Link>
              <Link 
                href="/customer/cafe" 
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${(pathname.startsWith('/customer/cafe') || pathname.startsWith('/customer/discover')) ? 'bg-[#E50914] text-white shadow-2xs' : 'text-stone-600 hover:text-[#E50914] hover:bg-white'}`}
              >
                Discover Cafe
              </Link>
            </nav>
          </div>

          {/* Center: Search Bar (Desktop) */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-xl mx-2 sm:mx-4 min-w-0">
              <SearchBar />
            </div>
          )}
          
          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 ml-auto" suppressHydrationWarning>

            {/* Grab2GO Loyalty Credit Badge */}
            {user && (
              <Link href="/customer/profile?tab=loyalty" title="View Grab2GO Loyalty Credits">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF5F5] hover:bg-red-50 border border-[#ED0014]/30 hover:border-[#ED0014] rounded-full text-[#1E1E1E] font-black text-xs shadow-2xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                  <span className="text-amber-500 text-sm leading-none drop-shadow-2xs">⭐</span>
                  <span className="font-black text-[#ED0014]">{loyaltyCredits}</span>
                  <span className="text-[10px] text-[#ED0014] font-black uppercase tracking-wider">Credits</span>
                </div>
              </Link>
            )}

            {/* Cart Button (hidden in cafe discovery tab) */}
            {!(pathname.startsWith('/customer/cafe') || pathname.startsWith('/customer/discover')) && (
              <Link 
                href="/customer/cart" 
                className="p-2 sm:p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-600 hover:bg-white hover:text-[#E50914] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer"
                title="Shopping Cart"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E50914] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications Dropdown Container */}
            <div className="relative" ref={notifRef} suppressHydrationWarning>
              <button 
                onClick={() => { setIsNotifMenuOpen(!isNotifMenuOpen); setIsProfileMenuOpen(false); }}
                className="p-2 sm:p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-600 hover:bg-white hover:text-[#E50914] hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer" 
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
                      <span className="font-black text-xs text-[#252525]">Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadNotifCount > 0 && (
                          <span className="text-[10px] font-extrabold text-[#E50914] bg-[#FFF5F5] border border-[#EF5350]/40 px-2 py-0.5 rounded-md">
                            {unreadNotifCount} New
                          </span>
                        )}
                        {notifications.length > 0 && (
                          <button 
                            onClick={async () => {
                              await api.patch('/notifications/read-all').catch(() => null);
                              setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                            }}
                            className="text-[9px] font-bold text-stone-400 hover:text-[#E50914] transition-colors cursor-pointer"
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
                                : 'bg-[#FFF5F5]/70 border-[#EF5350]/40 text-[#252525]'
                            }`}
                          >
                            <div className="p-1.5 bg-[#E50914] text-white rounded-lg shrink-0 mt-0.5">
                              <Sparkles size={12} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#252525] line-clamp-1">{n.title || n.subject || 'Notification'}</p>
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
                className="flex items-center gap-1.5 p-1 sm:p-1.5 bg-stone-50 hover:bg-[#FFF5F5] border border-stone-200/80 rounded-xl transition-all cursor-pointer active:scale-95"
                suppressHydrationWarning
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#B71C1C] to-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-2xs border border-white overflow-hidden relative shrink-0">
                  {profileImage && !imageError ? (
                    <img 
                      src={profileImage} 
                      alt={userName} 
                      className="w-full h-full object-cover" 
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span>{userInitials}</span>
                  )}
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
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FFF5F5] to-[#F5EBE0] border border-[#EF5350]/40 mb-1 flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B71C1C] to-[#E50914] text-white flex items-center justify-center font-black text-xs shrink-0 overflow-hidden border border-white shadow-2xs">
                        {profileImage && !imageError ? (
                          <img 
                            src={profileImage} 
                            alt={userName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span>{userInitials}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-xs text-[#252525] truncate">{userName}</p>
                        <p className="text-[10px] font-bold text-[#E50914] truncate">{user?.email || 'Customer Account'}</p>
                      </div>
                    </div>

                    {/* Navigation Options */}
                    <Link 
                      href="/customer/profile?tab=loyalty" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50/70 border border-amber-200/60 hover:bg-amber-100/80 transition-colors"
                    >
                      <span className="text-amber-500 text-sm">⭐</span> Grab2GO Credits ({loyaltyCredits})
                    </Link>

                    <Link 
                      href="/customer/profile" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF5F5] hover:text-[#E50914] transition-colors"
                    >
                      <User size={14} /> Profile Dashboard
                    </Link>

                    <Link 
                      href="/customer/orders" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF5F5] hover:text-[#E50914] transition-colors"
                    >
                      <ShoppingBag size={14} /> My Food Orders
                    </Link>

                    <Link 
                      href="/customer/bookings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF5F5] hover:text-[#E50914] transition-colors"
                    >
                      <CalendarCheck size={14} /> My Bookings
                    </Link>

                    <Link 
                      href="/customer/favorites" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF5F5] hover:text-[#E50914] transition-colors"
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
