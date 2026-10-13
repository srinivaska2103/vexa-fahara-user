'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Camera, Edit2, User, MapPin, Heart, CalendarCheck, 
  History, Award, Bell, HelpCircle, Shield, Settings, LogOut, 
  ChevronRight, Loader2, Sparkles, Phone, Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileProfileView({
  profile,
  user,
  fileInputRef,
  handleAvatarUpload,
  isUploadingAvatar,
  onLogout,
  onOpenEdit,
  activeTab,
  onSelectTab,
  loyaltyCredits = 0,
}) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  if (!profile) return null;

  const displayName = profile.name || user?.name || user?.fullName || 'Customer';
  const displayEmail = profile.email || user?.email || '';
  const displayPhone = profile.phone || user?.phone || user?.phoneNumber || '';

  // Get User Initials if avatar fails or not present
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'FC';

  // Menu Groups aligned strictly with Reference 1 layout and existing Fahara features
  const menuGroups = [
    {
      group: 'Personal',
      items: [
        {
          id: 'personal-info',
          title: 'Personal Information',
          subtitle: 'Bio, contact details & date of birth',
          icon: User,
          action: () => onSelectTab && onSelectTab('personal'),
          badge: activeTab === 'personal' ? 'Active' : null,
        },
        {
          id: 'saved-addresses',
          title: 'Saved Addresses',
          subtitle: 'Manage delivery and venue addresses',
          icon: MapPin,
          action: () => onSelectTab && onSelectTab('addresses'),
          badge: activeTab === 'addresses' ? 'Active' : null,
        },
        {
          id: 'favourites',
          title: 'My Favourites',
          subtitle: 'Saved cafes, packages and event spaces',
          icon: Heart,
          action: () => router.push('/customer/favorites'),
        },
      ],
    },
    {
      group: 'Bookings',
      items: [
        {
          id: 'my-bookings',
          title: 'My Bookings',
          subtitle: 'Current and upcoming reservations',
          icon: CalendarCheck,
          action: () => router.push('/customer/bookings'),
        },
        {
          id: 'booking-history',
          title: 'Booking History',
          subtitle: 'Past reservations, receipts & reviews',
          icon: History,
          action: () => router.push('/customer/history'),
        },
      ],
    },
    {
      group: 'Fahara Rewards & Updates',
      items: [
        {
          id: 'fahara-credits',
          title: 'Fahara Credits',
          subtitle: loyaltyCredits > 0 ? `${loyaltyCredits} credit points available` : 'Earn & redeem reward points',
          icon: Award,
          action: () => onSelectTab && onSelectTab('loyalty'),
          badge: loyaltyCredits > 0 ? `⭐ ${loyaltyCredits}` : null,
        },
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Alerts, updates and booking status',
          icon: Bell,
          action: () => onSelectTab && onSelectTab('notifications'),
          badge: activeTab === 'notifications' ? 'Active' : null,
        },
        {
          id: 'help-support',
          title: 'Help & Support',
          subtitle: 'FAQs, live chat and customer care',
          icon: HelpCircle,
          action: () => router.push('/contact'),
        },
      ],
    },
    {
      group: 'Account',
      items: [
        {
          id: 'privacy-security',
          title: 'Privacy & Security',
          subtitle: 'Password, Two-Factor Authentication',
          icon: Shield,
          action: () => onSelectTab && onSelectTab('security'),
          badge: activeTab === 'security' ? 'Active' : null,
        },
        {
          id: 'logout',
          title: 'Log Out',
          subtitle: 'Sign out of your Fahara account',
          icon: LogOut,
          isDestructive: true,
          action: () => setShowLogoutConfirm(true),
        },
      ],
    },
  ];

  return (
    <div className="md:hidden flex flex-col w-full pb-28 font-sans selection:bg-[#6F4E37] selection:text-white">
      {/* ── TOP THEMED PROFILE HEADER (Inspired by Reference Image 1, Fahara theme colors) ── */}
      <div className="relative w-full bg-gradient-to-b from-[#2C1810] via-[#3D2317] to-[#4A2C11] text-white pt-4 pb-14 px-4 overflow-hidden rounded-b-[40px] shadow-[0_14px_35px_rgba(44,24,16,0.22)]">
        {/* Curved warm circular overlay inspired by the top-right orange circle in Reference Image 1, in Fahara Secondary Brown/Gold */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-gradient-to-br from-[#A67B5B] to-[#6F4E37] opacity-60 pointer-events-none" />
        <div className="absolute top-1/2 -left-10 w-36 h-36 rounded-full bg-[#DDB892]/15 blur-xl pointer-events-none" />

        {/* Header Top Bar: Back Button + Title */}
        <div className="relative z-10 flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-90 transition-all backdrop-blur-md flex items-center justify-center text-[#FFF8F0] border border-white/15 cursor-pointer shadow-sm"
            aria-label="Go Back"
          >
            <ArrowLeft size={18} />
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-white">
            Customer Profile
          </span>

          <button
            type="button"
            onClick={() => (onOpenEdit ? onOpenEdit() : router.push('/customer/profile/edit'))}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-90 transition-all backdrop-blur-md flex items-center justify-center text-[#FFF8F0] border border-white/15 cursor-pointer shadow-sm"
            aria-label="Edit Profile"
            title="Edit Profile"
          >
            <Edit2 size={16} />
          </button>
        </div>

        {/* Profile Avatar & Identity Card */}
        <div className="relative z-10 flex flex-col items-center text-center pt-2">
          {/* Avatar Container with Edit Camera Button */}
          <div className="relative mb-3 group">
            <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#DDB892] via-[#A67B5B] to-white shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#2C1810] flex items-center justify-center ring-2 ring-white/40">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-[#DDB892] tracking-wider">
                    {userInitials}
                  </span>
                )}
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Camera / Edit Icon Button */}
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#6F4E37] hover:bg-[#5A3E2B] active:scale-90 text-white flex items-center justify-center shadow-md border-2 border-white transition-all cursor-pointer disabled:opacity-60"
              aria-label="Upload photo (under 2MB)"
              title="Upload photo (under 2MB)"
            >
              {isUploadingAvatar ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Camera size={13} strokeWidth={2.4} />
              )}
            </button>
          </div>

          {/* User Name & Details */}
          <h1 className="text-xl font-black text-[#FFF8F0] tracking-tight leading-snug">
            {displayName}
          </h1>

          {displayEmail && (
            <p className="text-xs text-[#DDB892] font-semibold tracking-wide mt-0.5 truncate max-w-[280px]">
              {displayEmail}
            </p>
          )}

          {displayPhone && (
            <p className="text-[11px] text-stone-300 font-medium mt-0.5">
              {displayPhone}
            </p>
          )}
        </div>
      </div>

      {/* ── VERTICAL PROFILE MENU LIST (Clean, modern stacked rows from Reference 1) ── */}
      <div className="px-4 -mt-3 relative z-20 space-y-4">
        {menuGroups.map((section, sIdx) => (
          <div
            key={section.group || sIdx}
            className="bg-white rounded-3xl p-3 border border-[#E8DED5] shadow-[0_4px_20px_rgba(44,24,16,0.04)] overflow-hidden"
          >
            <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A67B5B]">
                {section.group}
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isDestructive = item.isDestructive;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="w-full py-3 px-3 flex items-center justify-between gap-3 text-left hover:bg-[#FFF8F0]/70 active:bg-[#FFF8F0] active:scale-[0.99] rounded-2xl transition-all cursor-pointer group"
                  >
                    {/* Left Icon + Text */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                          isDestructive
                            ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'
                            : 'bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/40 group-hover:bg-[#FDF3E7]'
                        }`}
                      >
                        <Icon size={17} strokeWidth={2.2} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-xs font-black block leading-tight truncate ${
                            isDestructive
                              ? 'text-rose-600'
                              : 'text-[#2C1810] group-hover:text-[#6F4E37]'
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="text-[10px] text-stone-400 font-medium block truncate mt-0.5">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Badge / Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        size={15}
                        className={`transition-transform group-hover:translate-x-0.5 ${
                          isDestructive ? 'text-rose-400' : 'text-stone-300'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Member Footprint & App Version */}
        <div className="pt-2 text-center">
          <p className="text-[10px] font-bold text-stone-400">
            Fahara Customer App • Member since {profile.memberSince || '2026'}
          </p>
        </div>
      </div>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#E8DED5] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut size={22} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#2C1810]">Log Out?</h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to log out of your Fahara account?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 active:scale-95 transition-all shadow-md"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
