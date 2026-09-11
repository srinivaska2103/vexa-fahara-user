'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSearchStore } from '@/stores/search.store';
import { useAuthStore } from '@/stores/auth.store';
import { 
  Wifi, Car, Wind, Users, CheckCircle2, Music, Coffee, ChevronDown, Trash2,
  Compass, CalendarCheck, UserCircle, Globe, SlidersHorizontal, Check, Sparkles,
  PlusCircle, ShieldAlert, Headphones, ArrowRight, Star, Clock, Calendar,
  PhoneCall, Mail, X, CheckCircle, User, MapPin, Shield, Bell, Settings, ChevronRight, Heart,
  LayoutGrid, Repeat, RefreshCw, CreditCard, BarChart3, HelpCircle, LogOut,
  Cake, Briefcase, PartyPopper, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

import { useFavoritesStore } from '@/stores/favorites.store';

const COLORFUL_AMENITY_STYLES = [
  {
    id: 'wifi',
    label: 'Wi-Fi',
    icon: Wifi,
    activeBg: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-500/30 border-transparent',
    idleBg: 'bg-sky-50/90 text-sky-950 border-sky-200/80 hover:bg-sky-100 hover:border-sky-300',
    iconActive: 'text-white',
    iconIdle: 'text-sky-600',
    badgeActive: 'bg-white/20 text-white',
    badgeIdle: 'bg-sky-100/90 text-sky-800 border-sky-200/60',
  },
  {
    id: 'parking',
    label: 'Parking',
    icon: Car,
    activeBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-md shadow-amber-500/30 border-transparent',
    idleBg: 'bg-amber-50/90 text-amber-950 border-amber-200/80 hover:bg-amber-100 hover:border-amber-300',
    iconActive: 'text-white',
    iconIdle: 'text-amber-600',
    badgeActive: 'bg-white/20 text-white',
    badgeIdle: 'bg-amber-100/90 text-amber-900 border-amber-200/60',
  },
  {
    id: 'ac',
    label: 'AC',
    icon: Wind,
    activeBg: 'bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 text-white shadow-md shadow-teal-500/30 border-transparent',
    idleBg: 'bg-teal-50/90 text-teal-950 border-teal-200/80 hover:bg-teal-100 hover:border-teal-300',
    iconActive: 'text-white',
    iconIdle: 'text-teal-600',
    badgeActive: 'bg-white/20 text-white',
    badgeIdle: 'bg-teal-100/90 text-teal-800 border-teal-200/60',
  },
  {
    id: 'wheelchair',
    label: 'Wheelchair',
    icon: CheckCircle2,
    activeBg: 'bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 text-white shadow-md shadow-purple-500/30 border-transparent',
    idleBg: 'bg-purple-50/90 text-purple-950 border-purple-200/80 hover:bg-purple-100 hover:border-purple-300',
    iconActive: 'text-white',
    iconIdle: 'text-purple-600',
    badgeActive: 'bg-white/20 text-white',
    badgeIdle: 'bg-purple-100/90 text-purple-800 border-purple-200/60',
  },
  {
    id: 'private_room',
    label: 'Private Room',
    icon: Users,
    activeBg: 'bg-gradient-to-r from-rose-500 via-pink-600 to-fuchsia-600 text-white shadow-md shadow-rose-500/30 border-transparent',
    idleBg: 'bg-rose-50/90 text-rose-950 border-rose-200/80 hover:bg-rose-100 hover:border-rose-300',
    iconActive: 'text-white',
    iconIdle: 'text-rose-600',
    badgeActive: 'bg-white/20 text-white',
    badgeIdle: 'bg-rose-100/90 text-rose-800 border-rose-200/60',
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    icon: Coffee,
    activeBg: 'bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-md shadow-emerald-500/30 border-transparent',
    idleBg: 'bg-emerald-50/90 text-emerald-950 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300',
    iconActive: 'text-white',
    iconIdle: 'text-emerald-600',
    badgeActive: 'bg-white/20 text-white',
    badgeIdle: 'bg-emerald-100/90 text-emerald-800 border-emerald-200/60',
  },
  {
    id: 'live_music',
    label: 'Live Music',
    icon: Music,
    activeBg: 'bg-gradient-to-r from-fuchsia-500 via-purple-600 to-pink-600 text-white shadow-md shadow-fuchsia-500/30 border-transparent',
    idleBg: 'bg-fuchsia-50/90 text-fuchsia-950 border-fuchsia-200/80 hover:bg-fuchsia-100 hover:border-fuchsia-300',
    iconActive: 'text-white',
    iconIdle: 'text-fuchsia-600',
    badgeActive: 'bg-white/20 text-white',
    badgeIdle: 'bg-fuchsia-100/90 text-fuchsia-800 border-fuchsia-200/60',
  },
];

export default function FilterSidebar({ showNavigation = true, showHeader = true, mode, bookingStats, activeTab, onTabChange, cafes = [], isNonScrollable = false }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const favoriteCafes = useFavoritesStore((state) => state.favoriteCafes || []);
  const favoriteEvents = useFavoritesStore((state) => state.favoriteEvents || []);

  const user = useAuthStore((state) => state.user);
  const userName = user?.name || user?.full_name || user?.username || (user?.email ? user.email.split('@')[0] : 'Fahara Customer');
  const userRoleOrEmail = user?.email || 'Customer Account';
  const userInitials = userName ? userName.substring(0, 2).toUpperCase() : 'FC';

  const isFavoritesPage = mode === 'favorites' || pathname === '/customer/favorites';
  const isProfilePage = mode === 'profile' || pathname === '/customer/profile';
  const isBookingsPage = mode === 'bookings' || pathname === '/customer/bookings' || (pathname.startsWith('/customer/bookings/') && !isProfilePage);
  
  const { 
    category, setCategory, 
    amenities, toggleAmenity,
    openNow, setOpenNow,
    availableToday, setAvailableToday,
    clearFilters
  } = useSearchStore();

  // Active Filter Count Calculation (Distance slider removed)
  const activeFiltersCount = 
    (category ? 1 : 0) + 
    (openNow ? 1 : 0) + 
    (availableToday ? 1 : 0) + 
    amenities.length;

  const eventChips = [
    { id: '', label: 'All' },
    { id: 'Coffee Shop', label: 'Coffee Shop' },
    { id: 'Restaurant', label: 'Restaurant' },
    { id: 'Party Hall', label: 'Party Hall' },
    { id: 'Bakery & Cafe', label: 'Bakery & Cafe' },
    { id: 'Bistro', label: 'Bistro' },
    { id: 'Co-working Cafe', label: 'Co-working Cafe' },
    { id: 'Birthday Party', label: 'Birthday' },
    { id: 'Date Night', label: 'Date Night' },
  ];

  // Extract all unique real amenities available across fetched cafes
  const dynamicAmenities = (() => {
    const defaultList = [...COLORFUL_AMENITY_STYLES];
    if (!cafes || cafes.length === 0) return defaultList;

    const realMap = new Map();
    defaultList.forEach(item => realMap.set(item.id, { ...item, count: 0 }));

    cafes.forEach(cafe => {
      const text = (
        (cafe.amenities || '') + ' ' + 
        (cafe.features || '') + ' ' + 
        (cafe.description || '') + ' ' +
        (Array.isArray(cafe.cafe_packages) ? cafe.cafe_packages.map(p => p.inclusions ? JSON.stringify(p.inclusions) : '').join(' ') : '')
      ).toLowerCase();

      defaultList.forEach(item => {
        const searchKey = item.id.replace('_', ' ');
        if (text.includes(searchKey)) {
          const found = realMap.get(item.id);
          if (found) found.count += 1;
        }
      });
    });

    return Array.from(realMap.values());
  })();
  const isDiscoverActive = pathname === '/customer/cafe' || pathname === '/customer/discover';
  const isBookingsActive = pathname === '/customer/bookings' || (pathname.startsWith('/customer/bookings/') && !isProfilePage);
  const isProfileActive = isProfilePage;

  const tabs = [
    { id: 'discover', label: t('discover', 'Discover'), href: '/customer/cafe', icon: Compass, isActive: isDiscoverActive },
    { id: 'bookings', label: t('bookings', 'Bookings'), href: '/customer/bookings', icon: CalendarCheck, isActive: isBookingsActive },
    { id: 'profile', label: t('profile', 'Profile'), href: '/customer/profile', icon: UserCircle, isActive: isProfileActive },
  ];

  return (
    <div className={`bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-200/90 flex flex-col ${isNonScrollable || isBookingsPage ? 'overflow-hidden sticky top-24 self-start' : showHeader ? 'max-h-[calc(100vh-7rem)] overflow-y-auto sticky top-24 self-start' : 'h-full overflow-y-auto'} space-y-4 font-sans selection:bg-[#6F4E37] selection:text-white transition-all`}>
      
      {/* 🔹 HEADER TITLE / FILTERS SECTION HEADER */}
      {showHeader && (
        <div id="filters-section" className="flex items-center justify-between px-1 shrink-0 pt-1 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FFF8F0] border border-[#DDB892]/60 rounded-xl text-[#6F4E37] shadow-2xs">
              {isProfilePage ? <User size={16} /> : isBookingsPage ? <CalendarCheck size={16} /> : isFavoritesPage ? <Heart size={16} /> : <SlidersHorizontal size={16} />}
            </div>
            <div>
              <h3 className="font-black text-[#2C1810] text-sm tracking-tight">
                {isProfilePage ? 'User Profile' : isBookingsPage ? 'My Dashboard' : isFavoritesPage ? 'Your Favorites' : 'Filter Spaces'}
              </h3>
              <p className="text-[10px] text-stone-400 font-medium">Refine your search options</p>
            </div>
          </div>

          {!isBookingsPage && !isProfilePage && !isFavoritesPage && activeFiltersCount > 0 && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1 text-[10px] font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50/80 border border-rose-200/60 px-2.5 py-1 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <Trash2 size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>
      )}

      {/* 🔹 ASIDE CONTEXT SWITCHER (MIDDLE SCROLLABLE CONTENT) */}
      <div className="flex-1 flex flex-col justify-start pb-2 space-y-4">
        
        {isBookingsPage || isProfilePage || isFavoritesPage ? (
          /* ==================== MY BOOKINGS, PROFILE & FAVORITES CONTEXTUAL ASIDE CONTENT ==================== */
          <div className="space-y-5 flex-1 flex flex-col justify-start">
            
            {/* USER QUICK CARD */}
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-gradient-to-br from-[#FFF8F0] via-[#F5EBE0] to-[#E6D5C3] p-3.5 rounded-2xl border border-[#DDB892]/50 shadow-2xs space-y-2.5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4A2C11] to-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-md tracking-wider flex-shrink-0 border-2 border-white">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-xs text-[#2C1810] truncate">{userName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#6F4E37] block truncate">{userRoleOrEmail}</span>
                </div>
              </div>
            </motion.div>

            {/* PROFILE NAVIGATION, FAVORITES SUMMARY OR BOOKING METRICS GRID */}
            {isProfilePage ? (
              <div className="space-y-2">
                <h4 className="font-black text-stone-400 text-[9px] uppercase tracking-widest px-1 mb-1">PROFILE NAVIGATION</h4>
                {[
                  { id: 'personal', label: 'Personal Information', icon: User },
                  { id: 'loyalty', label: 'Fahara Credits', icon: Award },
                  { id: 'addresses', label: 'Addresses', icon: MapPin },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onTabChange && onTabChange(item.id)}
                      className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#6F4E37] text-white shadow-md font-extrabold'
                          : 'text-stone-700 hover:bg-stone-100/80 hover:text-stone-900 bg-stone-50/50 border border-stone-200/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 z-10">
                        <Icon size={15} className={isActive ? 'text-white' : 'text-[#6F4E37]'} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={14} className={`z-10 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-stone-400'}`} />
                    </motion.button>
                  );
                })}
              </div>
            ) : isFavoritesPage ? (
              <div className="space-y-3.5">
                <h4 className="font-black text-stone-400 text-[9px] uppercase tracking-widest px-1">SAVED SUMMARY</h4>
                
                {/* 2x2 FAVORITES METRICS GRID */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div 
                    onClick={() => onTabChange && onTabChange('cafes')}
                    className={`border p-3 rounded-2xl flex flex-col items-start shadow-2xs cursor-pointer transition-all ${
                      activeTab === 'cafes' ? 'bg-[#FFF8F0] border-[#6F4E37] ring-1 ring-[#6F4E37]' : 'bg-[#FFF8F0]/60 border-[#DDB892]/60 hover:border-[#6F4E37]'
                    }`}
                  >
                    <span className="text-[9px] font-extrabold text-[#6F4E37] uppercase tracking-wider flex items-center gap-1">
                      <Coffee size={10} /> Saved Cafes
                    </span>
                    <span className="text-lg font-black text-[#2C1810] mt-0.5">{favoriteCafes.length}</span>
                  </div>

                  <div 
                    onClick={() => onTabChange && onTabChange('events')}
                    className={`border p-3 rounded-2xl flex flex-col items-start shadow-2xs cursor-pointer transition-all ${
                      activeTab === 'events' ? 'bg-amber-100/90 border-amber-500 ring-1 ring-amber-500' : 'bg-amber-50/80 border-amber-200/60 hover:border-amber-400'
                    }`}
                  >
                    <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={10} /> Event Services
                    </span>
                    <span className="text-lg font-black text-amber-950 mt-0.5">{favoriteEvents.length}</span>
                  </div>
                </div>

                {/* QUICK DISCOVERY LINK CARD */}
                <Link href="/customer/cafe" className="block">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-extrabold text-xs shadow-md flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle size={15} />
                      <span>Explore New Spaces</span>
                    </div>
                    <ArrowRight size={14} />
                  </motion.div>
                </Link>
              </div>
            ) : (
              <div>
                <h4 className="font-black text-stone-400 mb-2 text-[9px] uppercase tracking-widest px-1">BOOKING METRICS</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-stone-50 border border-stone-200/60 p-2.5 rounded-2xl flex flex-col items-start">
                    <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Total</span>
                    <span className="text-base font-black text-[#2C1810] mt-0.5">{bookingStats?.total || 0}</span>
                  </div>
                  <div className="bg-emerald-50/80 border border-emerald-200/60 p-2.5 rounded-2xl flex flex-col items-start">
                    <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider">Upcoming</span>
                    <span className="text-base font-black text-emerald-800 mt-0.5">{bookingStats?.upcoming || 0}</span>
                  </div>
                  <div className="bg-blue-50/80 border border-blue-200/60 p-2.5 rounded-2xl flex flex-col items-start">
                    <span className="text-[9px] font-extrabold text-blue-700 uppercase tracking-wider">Completed</span>
                    <span className="text-base font-black text-blue-800 mt-0.5">{bookingStats?.completed || 0}</span>
                  </div>
                  <div className="bg-rose-50/80 border border-rose-200/60 p-2.5 rounded-2xl flex flex-col items-start">
                    <span className="text-[9px] font-extrabold text-rose-700 uppercase tracking-wider">Cancelled</span>
                    <span className="text-base font-black text-rose-800 mt-0.5">{bookingStats?.cancelled || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* INTERACTIVE HELP & SUPPORT MODAL TRIGGER */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowSupportModal(true)}
              className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between text-stone-700 cursor-pointer shadow-2xs hover:bg-amber-100/80 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Headphones size={18} className="text-[#6F4E37] flex-shrink-0" />
                <div>
                  <span className="text-xs font-black block text-stone-900 leading-tight">Need Help?</span>
                  <span className="text-[10px] text-stone-500 font-medium">Click for 24/7 Support</span>
                </div>
              </div>
              <ChevronDown size={14} className="text-stone-400 -rotate-90" />
            </motion.div>

          </div>
        ) : (
          /* ==================== CAFE DISCOVERY FILTERS CONTENT ==================== */
          <>
            {/* INLINE AVAILABILITY TOGGLES */}
            <div className="space-y-2 pt-1">
              <h4 className="font-extrabold text-stone-400 text-[10px] uppercase tracking-widest px-0.5">Availability</h4>
              <div className="grid grid-cols-2 gap-2 bg-stone-50/80 p-2 rounded-2xl border border-stone-200/70">
                
                {/* OPEN NOW Toggle */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setOpenNow(!openNow)}
                  className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-xl hover:bg-white transition-all shadow-2xs"
                >
                  <span className="text-[10px] font-black text-stone-800 tracking-tight">OPEN NOW</span>
                  <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 relative flex items-center ${
                    openNow ? 'bg-emerald-600' : 'bg-stone-200'
                  }`}>
                    <motion.div 
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-3.5 h-3.5 rounded-full bg-white shadow-md ${openNow ? 'ml-auto' : 'mr-auto'}`}
                    />
                  </div>
                </motion.div>

                {/* Available Today Toggle */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setAvailableToday(!availableToday)}
                  className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-xl hover:bg-white transition-all shadow-2xs"
                >
                  <span className="text-[10px] font-black text-stone-800 tracking-tight">Today</span>
                  <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-300 relative flex items-center ${
                    availableToday ? 'bg-[#6F4E37]' : 'bg-stone-200'
                  }`}>
                    <motion.div 
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-3.5 h-3.5 rounded-full bg-white shadow-md ${availableToday ? 'ml-auto' : 'mr-auto'}`}
                    />
                  </div>
                </motion.div>

              </div>
            </div>

            {/* COLORFUL AMENITIES GRID WITH REAL CAFE DATA */}
            <div className="space-y-2 pt-1 pb-2">
              <div className="flex items-center justify-between px-0.5">
                <h4 className="font-extrabold text-stone-400 text-[10px] uppercase tracking-widest">Amenities</h4>
                {amenities.length > 0 && (
                  <span className="text-[10px] font-black text-[#6F4E37] bg-[#FFF8F0] border border-[#DDB892]/60 px-2 py-0.5 rounded-full">
                    {amenities.length} Selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {dynamicAmenities.map((opt) => {
                  const isSelected = amenities.includes(opt.id);
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.id}
                      suppressHydrationWarning
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleAmenity(opt.id)}
                      className={`flex items-center justify-between gap-1.5 px-3 py-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer select-none ${
                        isSelected ? opt.activeBg : opt.idleBg
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon size={14} className={`shrink-0 ${isSelected ? opt.iconActive : opt.iconIdle}`} /> 
                        <span className="truncate text-left text-xs font-bold">{opt.label}</span>
                      </div>
                      {opt.count > 0 ? (
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 border ${
                          isSelected ? opt.badgeActive : opt.badgeIdle
                        }`}>
                          {opt.count}
                        </span>
                      ) : isSelected ? (
                        <Check size={12} className="shrink-0 text-white stroke-[3]" />
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* INTERACTIVE HELP & SUPPORT MODAL TRIGGER */}
            <div className="pt-2 border-t border-stone-200/80">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowSupportModal(true)}
                className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between text-stone-700 cursor-pointer shadow-2xs hover:bg-amber-100/80 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Headphones size={18} className="text-[#6F4E37] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-black block text-[#2C1810] leading-tight">Need Help?</span>
                    <span className="text-[10px] text-stone-500 font-medium">Click for 24/7 Support</span>
                  </div>
                </div>
                <ChevronDown size={14} className="text-stone-400 -rotate-90" />
              </motion.div>
            </div>
          </>
        )}

      </div>

      {/* 🔹 BOTTOM PLATFORM NAVIGATION TABS (MOVED TO BOTTOM OF ASIDE NAV) */}
      <div className="hidden lg:grid bg-[#FFF8F0] p-1.5 rounded-2xl border border-[#DDB892]/40 grid-cols-2 gap-1.5 w-full shrink-0 shadow-2xs pt-2 mt-auto">
        {[
          { id: 'discover', label: 'Discover', href: '/customer/cafe', icon: Compass, isActive: isDiscoverActive },
          { id: 'bookings', label: 'Bookings', href: '/customer/bookings', icon: CalendarCheck, isActive: isBookingsActive },
          { id: 'favorites', label: 'Favorites', href: '/customer/favorites', icon: Heart, isActive: isFavoritesPage },
          { id: 'profile', label: 'Profile', href: '/customer/profile', icon: UserCircle, isActive: isProfileActive },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} href={item.href} className="w-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer w-full ${
                  item.isActive
                    ? 'bg-[#5C3D28] text-white shadow-xs'
                    : 'text-[#4A3222] hover:bg-white hover:text-[#5C3D28]'
                }`}
              >
                <Icon size={14} className={`shrink-0 ${item.isActive ? 'text-white' : 'text-[#6F4E37]'}`} />
                <span className="text-xs font-black tracking-tight">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom navigation is now cleanly elevated to top aside navigation */}

      {/* 🔹 INTERACTIVE 24/7 SUPPORT MODAL */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full max-w-[calc(100vw-32px)] shadow-2xl border border-stone-200 space-y-4 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowSupportModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-100 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/50 flex items-center justify-center text-[#6F4E37] shadow-inner">
                <Headphones size={24} />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#2C1810]">Fahara Support Team</h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5 leading-relaxed">We are available 24/7 to assist with your bookings and reservations.</p>
              </div>

              <div className="space-y-2 pt-1 min-w-0">
                <a href="tel:+918946029205" className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-[#FFF8F0] border border-stone-200/80 text-xs font-bold text-stone-800 transition-colors min-w-0">
                  <PhoneCall size={16} className="text-[#6F4E37] shrink-0" />
                  <span className="truncate">+91 89460-29205</span>
                </a>
                <a href="mailto:vexatech.connect@gmail.com" className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 hover:bg-[#FFF8F0] border border-stone-200/80 text-xs font-bold text-stone-800 transition-colors min-w-0">
                  <Mail size={16} className="text-[#6F4E37] shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">vexatech.connect@gmail.com</span>
                </a>
              </div>

              <button 
                onClick={() => setShowSupportModal(false)}
                className="w-full py-3 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Close Support
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
