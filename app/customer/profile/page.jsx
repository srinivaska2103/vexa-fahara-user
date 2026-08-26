'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Calendar, User, MapPin, Award, Edit2, Shield, 
  Settings, Bell, FileText, Heart, Camera, Check, Copy, Sparkles, 
  ChevronRight, ArrowUpRight, Star, Lock, CheckCircle2, RefreshCw, X, Save,
  Plus, Trash2, Eye, EyeOff, Smartphone, Laptop, Moon, Sun, Monitor
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { profileService } from '@/services/profile.service';
import { settingsService } from '@/services/settings.service';
import { useAuthStore } from '@/stores/auth.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { bookingService } from '@/services/booking.service';
import { useLanguage } from '@/context/LanguageContext';

import FilterSidebar from '@/app/components/cafes/FilterSidebar';
import FilterDrawer from '@/app/components/cafes/FilterDrawer';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';
import ModernDatePicker from '@/app/components/common/ModernDatePicker';
import ModernSelect from '@/app/components/common/ModernSelect';

function ProfileDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'personal';

  const { language, setLanguage, t } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState(initialTab);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { user, setUser } = useAuthStore();
  const { favoriteCafes } = useFavoritesStore();

  const handleTabChange = (tabId) => {
    setActiveTabState(tabId);
    setIsEditing(false);
    router.replace(`/customer/profile?tab=${tabId}`, { scroll: false });
  };

  // Personal Info Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    bio: '',
  });

  // Addresses State (persisted in localStorage)
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: '123 MG Road, Koramangala', city: 'Bengaluru', pincode: '560034', isDefault: true },
    { id: 2, label: 'Work Office', address: '45 Tech Park, Whitefield', city: 'Bengaluru', pincode: '560066', isDefault: false },
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', address: '', city: 'Bengaluru', pincode: '' });

  // Security Form State
  const [showPassword, setShowPassword] = useState(false);
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFactor, setTwoFactor] = useState(false);

  // Notifications Toggle State (persisted in localStorage)
  const [notifications, setNotifications] = useState({
    bookingAlerts: true,
    emailAlerts: true,
    eventInvites: false,
    newsletter: false,
  });

  // Preferences State (persisted in localStorage)
  const [themePreference, setThemePreference] = useState('light');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [preferencesTags, setPreferencesTags] = useState([
    { id: 'wifi', label: 'High-speed Wi-Fi', active: true },
    { id: 'pet', label: 'Pet Friendly', active: true },
    { id: 'outdoor', label: 'Outdoor Garden', active: false },
    { id: 'vegan', label: 'Vegan Options', active: true },
    { id: 'quiet', label: 'Quiet Workspace', active: false },
    { id: 'valet', label: 'Valet Parking', active: false },
  ]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Load persisted preferences on mount
  useEffect(() => {
    try {
      const savedAddresses = localStorage.getItem('fahara-user-addresses');
      if (savedAddresses) setAddresses(JSON.parse(savedAddresses));

      const savedNotifs = localStorage.getItem('fahara-notifications');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedTheme = localStorage.getItem('fahara-theme');
      if (savedTheme) setThemePreference(savedTheme);

      const savedTags = localStorage.getItem('fahara-preferred-amenities');
      if (savedTags) setPreferencesTags(JSON.parse(savedTags));

      const saved2FA = localStorage.getItem('fahara-2fa');
      if (saved2FA) setTwoFactor(JSON.parse(saved2FA));
    } catch (e) {
      console.error('Error loading stored preferences', e);
    }
  }, []);

  // Profile data fetch effect
  useEffect(() => {
    Promise.all([
      profileService.getProfile().catch(() => null),
      bookingService.getMyBookings().catch(() => ({ data: [] }))
    ]).then(([profileRes, bookingsRes]) => {
      const bookingsList = bookingsRes?.data || [];
      setAllBookings(bookingsList);
      const bookingsCount = bookingsList.length;
      const apiData = profileRes?.data || {};

      // Dynamic real address extraction from user profile & booking locations
      const realAddresses = [];
      if (user?.address || apiData?.address) {
        realAddresses.push({
          id: 'user-primary',
          label: 'Home (Saved Profile)',
          address: user?.address || apiData?.address,
          city: user?.city || apiData?.city || 'Bengaluru',
          pincode: user?.pincode || apiData?.pincode || '560001',
          isDefault: true
        });
      }

      // Extract unique addresses from completed/confirmed bookings
      bookingsList.forEach((b, idx) => {
        const cafeAddress = b.cafes?.address;
        const cafeCity = b.cafes?.city || 'Bengaluru';
        if (cafeAddress && !realAddresses.some(a => a.address === cafeAddress)) {
          realAddresses.push({
            id: `booking-${b.id || idx}`,
            label: b.cafes?.name || `Recent Venue ${idx + 1}`,
            address: cafeAddress,
            city: cafeCity,
            pincode: b.cafes?.pincode || '560034',
            isDefault: realAddresses.length === 0
          });
        }
      });

      if (realAddresses.length > 0) {
        setAddresses(realAddresses);
      }

      const userPhone = user?.phone || user?.phone_number || user?.phoneNumber || user?.mobile || user?.contact || apiData?.phone || apiData?.phone_number || apiData?.phoneNumber || '';
      const userGender = user?.gender || apiData?.gender || '';
      const userDob = user?.dob || user?.dateOfBirth || user?.date_of_birth || apiData?.dob || apiData?.dateOfBirth || '';

      const getMemberSinceYear = () => {
        const rawDate = user?.createdAt || user?.created_at || user?.createdAtDate || user?.joinedAt || apiData?.createdAt || apiData?.created_at;
        if (rawDate) {
          const year = new Date(rawDate).getFullYear();
          if (!isNaN(year) && year > 2000) return year.toString();
        }
        if (user?.memberSince) return user.memberSince;
        if (apiData?.memberSince) return apiData.memberSince;
        return new Date().getFullYear().toString();
      };

      const formatDobForInput = (rawDob) => {
        if (!rawDob) return '';
        try {
          const d = new Date(rawDob);
          if (isNaN(d.getTime())) return '';
          return d.toISOString().split('T')[0];
        } catch (e) {
          return '';
        }
      };

      const initialProfile = {
        name: user?.name || user?.fullName || apiData?.name || 'Customer User',
        email: user?.email || apiData?.email || 'user@example.com',
        phone: userPhone,
        gender: userGender,
        dob: userDob,
        bio: user?.bio || apiData?.bio || 'Coffee lover, space enthusiast & digital nomad exploring best spots.',
        memberSince: getMemberSinceYear(),
        rewardPoints: user?.rewardPoints || 120,
        completedBookings: bookingsCount,
        avgRating: 4.9,
        avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=6F4E37&color=fff&size=200`,
      };
      
      setProfile(initialProfile);
      setFormData({
        name: initialProfile.name,
        email: initialProfile.email,
        phone: initialProfile.phone,
        gender: initialProfile.gender,
        dob: formatDobForInput(initialProfile.dob),
        bio: initialProfile.bio,
      });
      setIsLoading(false);
    });
  }, [user]);

  // Sync tab if URL searchParams change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['personal', 'addresses', 'security', 'notifications', 'preferences'].includes(tabParam)) {
      setActiveTabState(tabParam);
    }
  }, [searchParams]);

  // Preference Handlers
  const handleThemeChange = (newTheme) => {
    setThemePreference(newTheme);
    localStorage.setItem('fahara-theme', newTheme);
    if (settingsService.updateSettings) {
      settingsService.updateSettings({ theme: newTheme });
    }
    toast.success(`Theme updated to ${newTheme === 'light' ? t('warmLight', 'Warm Light') : newTheme === 'dark' ? t('darkMocha', 'Dark Mocha') : t('system', 'System')}`);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
    if (settingsService.updateSettings) {
      settingsService.updateSettings({ language: lang });
    }
    toast.success(`Display language updated to ${lang}`);
  };

  const togglePreferenceTag = (id) => {
    const updated = preferencesTags.map(t => (t.id === id ? { ...t, active: !t.active } : t));
    setPreferencesTags(updated);
    localStorage.setItem('fahara-preferred-amenities', JSON.stringify(updated));
    if (settingsService.updateSettings) {
      settingsService.updateSettings({ preferredAmenities: updated });
    }
    toast.success('Amenity preference saved!');
  };

  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('fahara-notifications', JSON.stringify(updated));
    if (settingsService.updateSettings) {
      settingsService.updateSettings({ notifications: updated });
    }
    toast.success('Notification settings saved!');
  };

  const handle2FAToggle = () => {
    const next2FA = !twoFactor;
    setTwoFactor(next2FA);
    localStorage.setItem('fahara-2fa', JSON.stringify(next2FA));
    toast.success(next2FA ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled');
  };

  // Address Actions
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.address) {
      toast.error('Please enter full address');
      return;
    }
    const item = {
      id: Date.now(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    const updated = [...addresses, item];
    setAddresses(updated);
    localStorage.setItem('fahara-user-addresses', JSON.stringify(updated));
    setShowAddressModal(false);
    setNewAddress({ label: 'Home', address: '', city: 'Bengaluru', pincode: '' });
    toast.success('Address added successfully!');
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem('fahara-user-addresses', JSON.stringify(updated));
    toast.success('Default address updated!');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('fahara-user-addresses', JSON.stringify(updated));
    toast.success('Address deleted!');
  };

  // Security Handlers
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!securityForm.currentPassword || !securityForm.newPassword) {
      toast.error('Please fill in password fields');
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    try {
      if (settingsService.changePassword) {
        await settingsService.changePassword(securityForm);
      }
      toast.success('Password changed successfully!');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.message || 'Failed to update password');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      if (profileService.updateProfile) {
        await profileService.updateProfile(formData);
      }
      setProfile((prev) => ({
        ...prev,
        ...formData,
      }));
      if (setUser) {
        setUser({ ...user, ...formData });
      }
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName}!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = [profile.name, profile.email, profile.phone, profile.gender, profile.dob, profile.bio];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPercent = calculateCompletion();

  const tabs = [
    { id: 'personal', label: t('personalInfo', 'Personal Info'), icon: User },
    { id: 'addresses', label: t('addresses', 'Addresses'), icon: MapPin },
    { id: 'security', label: t('security', 'Security'), icon: Shield },
    { id: 'notifications', label: t('notifications', 'Notifications'), icon: Bell },
  ];

  const bookingStats = {
    total: allBookings.length,
    upcoming: allBookings.filter(b => b.booking_status === 'PENDING' || b.booking_status === 'CONFIRMED').length,
    completed: allBookings.filter(b => b.booking_status === 'COMPLETED').length,
    cancelled: allBookings.filter(b => b.booking_status === 'CANCELLED' || b.booking_status === 'REJECTED').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans antialiased pb-20 lg:pb-8 selection:bg-[#6F4E37] selection:text-white">
        {/* Top Navbar Skeleton */}
        <CustomerNavbar showSearch={true} showViewToggles={false} />

        {/* Main Layout Grid Skeleton */}
        <div className="flex-1 max-w-[1550px] w-full mx-auto px-3 sm:px-4 lg:pl-3 lg:pr-6 xl:px-4 py-4 sm:py-6 flex flex-col lg:flex-row gap-5 lg:gap-6">
          
          {/* Left Aside Navigation Skeleton */}
          <aside className="hidden lg:block w-80 xl:w-84 flex-shrink-0">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-4 animate-pulse">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-stone-200"></div>
                <div className="w-28 h-5 rounded-lg bg-stone-200"></div>
              </div>

              {/* Quick Profile Pill */}
              <div className="p-3 rounded-2xl bg-stone-100/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-300"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="w-24 h-4 rounded bg-stone-300"></div>
                    <div className="w-36 h-3 rounded bg-stone-200"></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between">
                  <div className="w-16 h-3 bg-stone-200 rounded"></div>
                  <div className="w-12 h-4 bg-amber-200/80 rounded"></div>
                </div>
              </div>

              {/* Navigation Menu Buttons */}
              <div className="space-y-2 pt-1">
                <div className="w-24 h-3 bg-stone-200 rounded mb-2"></div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-11 rounded-2xl bg-stone-100/70 w-full flex items-center px-4 gap-3">
                    <div className="w-4 h-4 rounded bg-stone-200"></div>
                    <div className="w-32 h-4 rounded bg-stone-200"></div>
                  </div>
                ))}
              </div>

              {/* Support Card Skeleton */}
              <div className="h-16 rounded-2xl bg-amber-50/40 border border-amber-100/60"></div>
            </div>
          </aside>

          {/* Main Column Profile Skeleton Cards */}
          <main className="flex-1 space-y-5 lg:space-y-6 min-w-0">
            
            {/* 1. PROFILE HERO HEADER SKELETON CARD */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden animate-pulse">
              {/* Banner Shimmer */}
              <div className="h-32 sm:h-40 bg-gradient-to-r from-stone-200 via-stone-300 to-stone-200 relative">
                <div className="absolute top-4 right-4 w-28 h-8 rounded-full bg-white/50"></div>
              </div>

              {/* Content Header Info */}
              <div className="px-5 sm:px-7 pb-6 pt-0 relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-5">
                  <div className="flex items-end gap-4">
                    {/* Avatar Circle */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-stone-300 shadow-md relative"></div>
                    <div className="space-y-2 pb-1">
                      <div className="w-40 sm:w-56 h-7 bg-stone-200 rounded-xl"></div>
                      <div className="w-32 sm:w-44 h-4 bg-stone-100 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-10 bg-stone-200 rounded-2xl"></div>
                    <div className="w-10 h-10 bg-stone-100 rounded-2xl"></div>
                  </div>
                </div>

                {/* Progress Bar Placeholder */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="w-36 h-4 bg-stone-200 rounded"></div>
                    <div className="w-10 h-4 bg-stone-300 rounded"></div>
                  </div>
                  <div className="w-full h-2.5 bg-stone-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* 2. STATS METRICS GRID SKELETON CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
                  <div className="w-20 h-3 bg-stone-200 rounded"></div>
                  <div className="w-12 h-6 bg-stone-300 rounded-lg"></div>
                </div>
              ))}
            </div>

            {/* 3. MAIN PROFILE DETAILS & FORM SKELETON CARD */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6 animate-pulse">
              {/* Tab Pills */}
              <div className="flex items-center gap-2 border-b border-stone-100 pb-4 overflow-x-auto">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-28 h-10 rounded-2xl bg-stone-100 shrink-0"></div>
                ))}
              </div>

              {/* Input Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="p-4 rounded-2xl bg-stone-50/80 border border-stone-100 space-y-2">
                    <div className="w-24 h-3 bg-stone-200 rounded"></div>
                    <div className="w-full h-8 bg-stone-200/70 rounded-xl"></div>
                  </div>
                ))}
              </div>

              {/* Bio Skeleton Box */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-100 space-y-2">
                <div className="w-16 h-3 bg-stone-200 rounded"></div>
                <div className="w-full h-16 bg-stone-200/70 rounded-xl"></div>
              </div>
            </div>

          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased pb-24 lg:pb-12">
      {/* Sticky Top Navbar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      {/* Mobile Filter & Aside Nav Drawer */}
      <FilterDrawer 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)} 
        mode="profile" 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Container Wrapper */}
      <div className="max-w-[1600px] w-full mx-auto px-3 sm:px-4 lg:pl-3 lg:pr-6 xl:px-6 py-4 flex flex-col lg:flex-row gap-6">
        
        {/* Left Aside Navigation Panel (Desktop 1024px+) */}
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
          <FilterSidebar mode="profile" activeTab={activeTab} onTabChange={handleTabChange} />
        </aside>

        {/* Main Content Body */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* Profile Header Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden font-sans">
            {/* Top Cover Banner */}
            <div className="relative h-32 sm:h-44 w-full bg-gradient-to-r from-[#4A2C11] via-[#5C3D28] to-[#6F4E37]">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="p-4 flex justify-between items-center relative z-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-black uppercase tracking-wider">
                  <Sparkles size={13} className="text-amber-300" /> {t('customerControlPanel', 'Customer Control Panel')}
                </span>
                {activeTab === 'personal' && (
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-black transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-xs"
                  >
                    {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                    <span>{isEditing ? t('cancelEditing', 'Cancel Editing') : t('editProfile', 'Edit Profile')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info Row */}
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 -mt-12 sm:-mt-16 relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="relative group shrink-0">
                    <div className="relative rounded-full p-1 bg-gradient-to-tr from-[#4A2C11] to-[#6F4E37] shadow-xl">
                      <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover"
                      />
                    </div>
                    <button 
                      onClick={() => toast.success('Avatar update dialog simulated')}
                      className="absolute bottom-1 right-1 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white p-2 rounded-full hover:scale-110 active:scale-95 shadow-lg border-2 border-white transition-all cursor-pointer"
                      title="Upload profile photo"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  
                  <div className="pt-2 sm:pt-14">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">{profile.name}</h1>
                      <CheckCircle2 size={18} className="text-amber-500 fill-amber-100" />
                    </div>
                    <p className="text-stone-500 font-bold text-xs sm:text-sm mt-0.5">{profile.email}</p>
                    
                    <div className="mt-2.5 inline-flex items-center gap-2 bg-[#FFF8F0] border border-[#DDB892]/60 px-3 py-1.5 rounded-xl text-xs font-black text-[#6F4E37] shadow-2xs">
                      <Award size={16} className="text-amber-500" />
                      <span>{profile.rewardPoints} {t('loyaltyPoints', 'Loyalty Points')}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Gauge & Stats */}
                <div className="w-full md:w-72 bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 space-y-2.5 shrink-0 mt-2 md:mt-14 shadow-2xs">
                  <div className="flex justify-between items-center text-xs font-black text-stone-600">
                    <span>{t('profileStrength', 'Profile Strength')}</span>
                    <span className="text-[#6F4E37] font-black">{completionPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-200/80 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] rounded-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/50 text-center">
                    <div>
                      <span className="text-[10px] font-black text-stone-400 uppercase">Bookings</span>
                      <p className="text-sm font-black text-[#2C1810]">{profile.completedBookings}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-stone-400 uppercase">Rating</span>
                      <p className="text-sm font-black text-[#2C1810] flex items-center justify-center gap-1">
                        {profile.avgRating} <Star size={12} className="fill-amber-400 text-amber-400" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Section Pill Tabs Bar (Mobile & Tablet Only) */}
          <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#6F4E37] text-white shadow-md'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

            {/* TAB VIEW 1: Personal Information */}
            {activeTab === 'personal' && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key="personal-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-200/90 p-6 sm:p-8 font-sans">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">{t('personalInfo', 'Personal Information')}</h2>
                        <p className="text-stone-500 font-bold text-xs sm:text-sm mt-0.5">Manage your personal profile details and contact information</p>
                      </div>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2.5 rounded-2xl bg-[#FFF8F0] hover:bg-[#F5EBE1] border border-[#DDB892]/60 text-[#6F4E37] font-black text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {isEditing ? <><X size={16} /> {t('cancel', 'Cancel')}</> : <><Edit2 size={16} /> {t('editInfo', 'Edit Info')}</>}
                      </button>
                    </div>

                    {/* Bio Section */}
                    <div className="mb-8">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('bioAbout', 'Bio / About')}</p>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-4 rounded-2xl border-2 border-amber-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none text-stone-800 text-sm transition-all resize-none"
                          placeholder="Tell us a little bit about yourself..."
                        />
                      ) : (
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 to-stone-50 border border-amber-200/50 text-stone-700 text-sm leading-relaxed italic">
                          "{profile.bio || 'No bio added yet.'}"
                        </div>
                      )}
                    </div>

                    {/* Details Form / Cards */}
                    {isEditing ? (
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('fullName', 'Full Name')}</label>
                            <div className="relative">
                              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none text-sm font-medium text-stone-800 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('emailAddress', 'Email Address')}</label>
                            <div className="relative">
                              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-stone-400 outline-none text-sm font-medium cursor-not-allowed"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('phoneNumber', 'Phone Number')}</label>
                            <div className="relative">
                              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                              <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none text-sm font-medium text-stone-800 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('dateOfBirth', 'Date of Birth')}</label>
                            <ModernDatePicker
                              value={formData.dob}
                              onChange={(newDate) => setFormData((prev) => ({ ...prev, dob: newDate }))}
                              placeholder="Select Date of Birth"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('gender', 'Gender')}</label>
                            <ModernSelect
                              value={formData.gender}
                              onChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
                              placeholder="Select Gender"
                              options={[
                                { value: 'Male', label: t('male', 'Male') },
                                { value: 'Female', label: t('female', 'Female') },
                                { value: 'Other', label: t('other', 'Other') },
                              ]}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 rounded-2xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 text-sm transition-all"
                          >
                            {t('cancel', 'Cancel')}
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs sm:text-sm hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                          >
                            {isSaving ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> {t('saveChanges', 'Save Changes')}</>}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-amber-200 transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-white border border-stone-100 text-[var(--color-primary)] shadow-sm">
                              <User size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('fullName', 'Full Name')}</p>
                              <p className="text-sm font-bold text-stone-900">{profile.name}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(profile.name, t('fullName', 'Full Name'))} 
                            className="p-2 text-stone-400 hover:text-[var(--color-primary)] rounded-xl hover:bg-white transition-colors"
                          >
                            {copiedField === t('fullName', 'Full Name') ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-amber-200 transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-white border border-stone-100 text-[var(--color-primary)] shadow-sm">
                              <Mail size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('emailAddress', 'Email Address')}</p>
                              <p className="text-sm font-bold text-stone-900 truncate max-w-[160px] sm:max-w-none">{profile.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(profile.email, t('emailAddress', 'Email Address'))} 
                            className="p-2 text-stone-400 hover:text-[var(--color-primary)] rounded-xl hover:bg-white transition-colors"
                          >
                            {copiedField === t('emailAddress', 'Email Address') ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-amber-200 transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-white border border-stone-100 text-[var(--color-primary)] shadow-sm">
                              <Phone size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('phoneNumber', 'Phone Number')}</p>
                              <p className="text-sm font-bold text-stone-900">{profile.phone || t('notProvided', 'Not provided')}</p>
                            </div>
                          </div>
                          {profile.phone && (
                            <button 
                              onClick={() => copyToClipboard(profile.phone, t('phoneNumber', 'Phone Number'))} 
                              className="p-2 text-stone-400 hover:text-[var(--color-primary)] rounded-xl hover:bg-white transition-colors"
                            >
                              {copiedField === t('phoneNumber', 'Phone Number') ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                            </button>
                          )}
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-amber-200 transition-all flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white border border-stone-100 text-[var(--color-primary)] shadow-sm">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('dateOfBirth', 'Date of Birth')}</p>
                            <p className="text-sm font-bold text-stone-900">
                              {profile.dob ? new Date(profile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : t('notProvided', 'Not provided')}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-amber-200 transition-all flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white border border-stone-100 text-[var(--color-primary)] shadow-sm">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('gender', 'Gender')}</p>
                            <p className="text-sm font-bold text-stone-900">{profile.gender || t('notProvided', 'Not provided')}</p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-amber-200 transition-all flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white border border-stone-100 text-[var(--color-primary)] shadow-sm">
                            <Award size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('memberSince', 'Member Since')}</p>
                            <p className="text-sm font-bold text-stone-900">{profile.memberSince}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Activity Shortcuts Hub */}
                  <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-8">
                    <div className="mb-6">
                      <h2 className="text-xl font-black text-stone-900 tracking-tight">{t('quickActivityHub', 'Quick Activity Hub')}</h2>
                      <p className="text-stone-500 text-xs sm:text-sm mt-0.5">{t('savedItemsHistory', 'Shortcuts to your saved items & booking history')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link 
                        href="/customer/favorites" 
                        className="group p-5 rounded-2xl border-2 border-stone-100 hover:border-rose-300 hover:bg-rose-50/30 transition-all shadow-sm hover:shadow-md flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Heart size={22} className="fill-rose-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-900 group-hover:text-rose-600 transition-colors">{t('favoriteCafes', 'Favorite Cafes')}</h3>
                            <p className="text-xs text-stone-500 font-medium">{favoriteCafes?.length ?? 0} {t('cafesBookmarked', 'cafes bookmarked')}</p>
                          </div>
                        </div>
                        <ArrowUpRight size={18} className="text-stone-400 group-hover:text-rose-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </Link>

                      <Link 
                        href="/customer/bookings" 
                        className="group p-5 rounded-2xl border-2 border-stone-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all shadow-sm hover:shadow-md flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText size={22} />
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition-colors">{t('myBookings', 'My Bookings')}</h3>
                            <p className="text-xs text-stone-500 font-medium">{profile?.completedBookings ?? 0} {t('totalBookings', 'total bookings')}</p>
                          </div>
                        </div>
                        <ArrowUpRight size={18} className="text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* TAB VIEW 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key="addresses-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-8 space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">{t('savedAddresses', 'Saved Addresses')}</h2>
                      <p className="text-stone-500 text-xs sm:text-sm mt-0.5">{t('manageAddresses', 'Manage your delivery and booking locations')}</p>
                    </div>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="px-4 py-2.5 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:shadow-[var(--color-primary)]/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> {t('addAddress', 'Add Address')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-5 rounded-3xl border-2 transition-all relative flex flex-col justify-between ${
                          item.isDefault 
                            ? 'border-[var(--color-primary)] bg-amber-50/30 shadow-md' 
                            : 'border-stone-100 bg-stone-50/50 hover:border-amber-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-bold shadow-sm flex items-center gap-1.5">
                              <MapPin size={14} className="text-[var(--color-primary)]" />
                              {item.label}
                            </span>
                            {item.isDefault && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-extrabold uppercase tracking-wider">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-stone-800 text-sm font-semibold mb-1">{item.address}</p>
                          <p className="text-stone-500 text-xs font-medium">{item.city} - {item.pincode}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200/60">
                          {!item.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultAddress(item.id)}
                              className="text-xs font-bold text-[var(--color-primary)] hover:underline"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <Check size={14} /> Primary Address
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteAddress(item.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete address"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Address Modal */}
                  {showAddressModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-100"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-stone-900">{t('addAddress', 'Add New Address')}</h3>
                          <button onClick={() => setShowAddressModal(false)} className="p-2 text-stone-400 hover:text-stone-600">
                            <X size={20} />
                          </button>
                        </div>

                        <form onSubmit={handleAddAddress} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">Address Type</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Home', 'Work Office', 'Other'].map(type => (
                                <button
                                  type="button"
                                  key={type}
                                  onClick={() => setNewAddress({ ...newAddress, label: type })}
                                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                    newAddress.label === type 
                                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' 
                                      : 'bg-stone-50 border-stone-200 text-stone-700'
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">Flat / Building / Street</label>
                            <input
                              type="text"
                              required
                              value={newAddress.address}
                              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                              placeholder="e.g. #402, Sunshine Apartments"
                              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] outline-none text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">City</label>
                              <input
                                type="text"
                                required
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">Pincode</label>
                              <input
                                type="text"
                                required
                                value={newAddress.pincode}
                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                placeholder="560034"
                                className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] outline-none text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 mt-6">
                            <button
                              type="button"
                              onClick={() => setShowAddressModal(false)}
                              className="px-5 py-2.5 rounded-2xl border border-stone-200 font-bold text-stone-600 text-sm"
                            >
                              {t('cancel', 'Cancel')}
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2.5 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-sm shadow-md"
                            >
                              {t('saveChanges', 'Save Address')}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* TAB VIEW 3: Security & Password */}
            {activeTab === 'security' && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key="security-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-8">
                    <div className="pb-4 border-b border-stone-100 mb-6">
                      <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">{t('securityPassword', 'Security & Password')}</h2>
                      <p className="text-stone-500 text-xs sm:text-sm mt-0.5">{t('manageSecurity', 'Manage your account authentication and active sessions')}</p>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-5 max-w-lg">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('currentPassword', 'Current Password')}</label>
                        <div className="relative">
                          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securityForm.currentPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] outline-none text-sm"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('newPassword', 'New Password')}</label>
                        <div className="relative">
                          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] outline-none text-sm"
                            placeholder="At least 8 characters"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">{t('confirmNewPassword', 'Confirm New Password')}</label>
                        <div className="relative">
                          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={securityForm.confirmPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] outline-none text-sm"
                            placeholder="Repeat new password"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
                      >
                        {t('updatePassword', 'Update Password')}
                      </button>
                    </form>
                  </div>

                  {/* 2FA & Session Security */}
                  <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm">Two-Factor Authentication (2FA)</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Add an extra layer of security using OTP code</p>
                      </div>
                      <button
                        onClick={handle2FAToggle}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                          twoFactor ? 'bg-[var(--color-primary)]' : 'bg-stone-300'
                        }`}
                      >
                        <motion.div 
                          animate={{ x: twoFactor ? 24 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow"
                        />
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-stone-900 text-sm mb-3">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Laptop size={20} className="text-stone-500" />
                            <div>
                              <p className="text-xs font-bold text-stone-800">Chrome on Windows 11</p>
                              <p className="text-[11px] text-emerald-600 font-semibold">Active now • Current device</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone size={20} className="text-stone-500" />
                            <div>
                              <p className="text-xs font-bold text-stone-800">Fahara Mobile App • iOS 17</p>
                              <p className="text-[11px] text-stone-400">Last active 2 days ago</p>
                            </div>
                          </div>
                          <button onClick={() => toast.success('Session logged out')} className="text-xs text-rose-500 font-bold hover:underline">
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* TAB VIEW 4: Notifications Preferences */}
            {activeTab === 'notifications' && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key="notifications-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-8 space-y-6"
                >
                  <div className="pb-4 border-b border-stone-100">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">{t('notificationPreferences', 'Notification Preferences')}</h2>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Control how and when you receive updates from Fahara</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'bookingAlerts', title: 'Booking Status & Reminders', desc: 'Receive instant push notifications and reminders about your cafe bookings' },
                      { key: 'emailAlerts', title: 'Email Notifications', desc: 'Receive booking confirmations, receipts, invoices, and security updates via email' },
                      { key: 'eventInvites', title: 'Event Invites & Community', desc: 'Notifications about live music events and local gatherings' },
                      { key: 'newsletter', title: 'Weekly Cafe Newsletter', desc: 'Curated list of newly featured cafe spots in your city' },
                    ].map((item) => (
                      <div 
                        key={item.key}
                        className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-100 hover:border-amber-200 transition-all flex items-center justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-bold text-stone-900 text-sm">{item.title}</h3>
                          <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle(item.key)}
                          className={`w-12 h-6 rounded-full transition-colors relative p-1 flex-shrink-0 ${
                            notifications[item.key] ? 'bg-[var(--color-primary)]' : 'bg-stone-300'
                          }`}
                        >
                          <motion.div 
                            animate={{ x: notifications[item.key] ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* TAB VIEW 5: App Preferences */}
            {activeTab === 'preferences' && (
              <AnimatePresence mode="wait">
                <motion.div 
                  key="preferences-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 sm:p-8 space-y-6"
                >
                  <div className="pb-4 border-b border-stone-100">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">{t('appPreferences', 'App Preferences')}</h2>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Customize your browsing experience and dietary tags</p>
                  </div>

                  {/* Preferred Amenities & Dietary Tags */}
                  <div>
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">{t('preferredAmenities', 'Preferred Cafe Amenities')}</h3>
                    <p className="text-xs text-stone-500 mb-3">Toggle your default search filters for cafe recommendations</p>
                    <div className="flex flex-wrap gap-2.5">
                      {preferencesTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => togglePreferenceTag(tag.id)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
                            tag.active
                              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm scale-105'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-200'
                          }`}
                        >
                          {tag.active && <Check size={14} />}
                          <span>{tag.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="pt-4 border-t border-stone-100">
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('displayLanguage', 'Display Language')}</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="w-full max-w-xs px-4 py-3 rounded-2xl border border-stone-200 focus:border-[var(--color-primary)] outline-none text-sm font-bold text-stone-800 bg-white"
                    >
                      <option value="English">English (US)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                    </select>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
        </main>
      </div>

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <FaharaInteractiveLoader 
        message="Loading Customer Profile & Account Details..." 
        badgeTag="FAHARA PROFILE" 
        fullScreen={true} 
      />
    }>
      <ProfileDashboardContent />
    </Suspense>
  );
}
