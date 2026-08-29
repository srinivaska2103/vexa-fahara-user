'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, CalendarCheck, Heart, User } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useAuthStore } from '@/stores/auth.store';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { profileService } from '@/services/profile.service';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const favoriteCafes = useFavoritesStore((state) => state.favoriteCafes || []);
  const user = useAuthStore((state) => state.user);

  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);
  const [imageError, setImageError] = useState(false);

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
        console.error('Failed to fetch profile avatar in mobile bottom nav:', err);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (user?.avatar || user?.profile_image) {
      setProfileImage(user.avatar || user.profile_image);
    }
  }, [user]);

  // Hidden on auth, booking checkout, landing, legal, and support pages
  if (
    pathname === '/' ||
    pathname.startsWith('/booking') ||
    [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/privacy',
      '/cancellation',
      '/terms',
      '/faq',
      '/about',
      '/contact',
    ].includes(pathname)
  ) {
    return null;
  }

  const userInitial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : user?.full_name 
    ? user.full_name.charAt(0).toUpperCase() 
    : user?.email 
    ? user.email.charAt(0).toUpperCase() 
    : 'U';

  const navItems = [
    { 
      id: 'discover',
      label: t('discover', 'Discover'), 
      href: '/customer/cafe', 
      icon: Compass,
      isActive: pathname === '/customer/cafe' || pathname.startsWith('/cafes') || pathname === '/' || pathname === '/customer/discover'
    },
    { 
      id: 'bookings',
      label: t('bookings', 'Bookings'), 
      href: '/customer/bookings', 
      icon: CalendarCheck,
      isActive: pathname.startsWith('/customer/bookings') || pathname.startsWith('/booking')
    },
    { 
      id: 'favorites',
      label: t('favorites', 'Favorites'), 
      href: '/customer/favorites', 
      icon: Heart,
      badge: favoriteCafes.length > 0 ? favoriteCafes.length : null,
      isActive: pathname.startsWith('/customer/favorites') || pathname.startsWith('/customer/wishlist')
    },
    { 
      id: 'profile',
      label: t('profile', 'Profile'), 
      href: '/customer/profile', 
      icon: User,
      isAvatar: true,
      isActive: pathname.startsWith('/customer/profile') || pathname.startsWith('/customer/payment') || pathname.startsWith('/customer/settings') || pathname.startsWith('/customer/addresses') || pathname.startsWith('/customer/security') || pathname.startsWith('/customer/notifications') || pathname.startsWith('/customer/history') || pathname.startsWith('/customer/receipt') || pathname.startsWith('/customer/invoice')
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-3 right-3 z-50 select-none print:hidden">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-full p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex items-center justify-between gap-1 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          if (isActive) {
            return (
              <Link key={item.id} href={item.href} className="flex-1 min-w-0">
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="bg-[#4A2C11] text-white rounded-full py-2.5 px-3 flex items-center justify-center gap-1.5 shadow-md shadow-[#4A2C11]/30"
                >
                  <div className="p-1 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="font-black text-xs tracking-wide whitespace-nowrap truncate">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className="p-2 sm:p-2.5 rounded-full text-stone-700 hover:text-[#4A2C11] hover:bg-stone-100/80 transition-all flex items-center justify-center relative shrink-0"
              aria-label={item.label}
            >
              {item.isAvatar ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs overflow-hidden hover:scale-105 transition-transform shrink-0">
                  {profileImage && !imageError ? (
                    <img 
                      src={profileImage} 
                      alt="User Profile" 
                      className="w-full h-full object-cover" 
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>
              ) : (
                <div className="relative flex items-center justify-center shrink-0">
                  <Icon size={19} className="text-[#4A2C11]" />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
