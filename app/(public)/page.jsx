'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Users, MapPin, Sparkles, ArrowRight, Cake, Briefcase, 
  Heart, PartyPopper, Users2, Star, ShieldCheck, 
  Lock, Building2, CheckCircle2, ChevronDown, HelpCircle, 
  LogIn, UserPlus, Zap, Coffee, Clock, Award, ThumbsUp, Bell,
  X, RotateCcw, ChevronRight, Layers, Tag, Menu, Compass, CalendarCheck, User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import Footer from '@/app/components/home/Footer';
import ModernDatePicker from '@/app/components/common/ModernDatePicker';
import ModernDropdown from '@/app/components/common/ModernDropdown';

// Hero Showcase Carousel Cafes
const heroShowcaseCafes = [
  {
    id: 1,
    name: 'Bandra Garden Cafe',
    rating: '4.9',
    reviews: '128',
    location: 'Mumbai • Private Birthday Setup',
    cityArea: 'Bandra West, Mumbai',
    price: '499',
    eventType: 'Birthday Setup',
    isOpenNow: true,
    isTopRated: true,
    image: 'cafe1.jpg',
  },
  {
    id: 2,
    name: 'Indiranagar Rooftop Lounge',
    rating: '4.95',
    reviews: '94',
    location: 'Bengaluru • Corporate Meeting & Drinks',
    cityArea: 'Indiranagar, Bengaluru',
    price: '799',
    eventType: 'Corporate Meeting',
    isOpenNow: true,
    isTopRated: true,
    image: 'cafe2.jpg',
  },
  {
    id: 3,
    name: 'Hauz Khas Glasshouse Nook',
    rating: '4.88',
    reviews: '210',
    location: 'Delhi • Romantic Candlelight Date',
    cityArea: 'Hauz Khas, Delhi',
    price: '599',
    eventType: 'Date Night',
    isOpenNow: true,
    isTopRated: false,
    image: 'cafe3.jpg',
  },
  {
    id: 4,
    name: 'Jubilee Hills Backyard Studio',
    rating: '4.92',
    reviews: '150',
    location: 'Hyderabad • Private Gathering & Party',
    cityArea: 'Jubilee Hills, Hyderabad',
    price: '899',
    eventType: 'Private Party',
    isOpenNow: true,
    isTopRated: true,
    image: 'cafe4.jpg',
  }
];

const popularLocations = [
  'Bandra West, Mumbai',
  'Indiranagar, Bengaluru',
  'Hauz Khas, Delhi',
  'Jubilee Hills, Hyderabad',
  'Connaught Place, Delhi',
  'Koramangala, Bengaluru'
];

const popularEventChips = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'date-night', label: 'Date Night' },
  { id: 'party', label: 'Party' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'family', label: 'Family Gathering' }
];

// Occasion categories definitions
const occasionCategories = [
  { 
    id: 'birthday', 
    label: 'Birthday Parties', 
    desc: 'Celebrate birthdays with reserved cafe zones, cakes, and custom ambience.',
    icon: Cake,
    bg: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-200'
  },
  { 
    id: 'corporate', 
    label: 'Corporate & Meetings', 
    desc: 'Quiet cafe spots equipped with Wi-Fi, power outlets, and coffee for team meets.',
    icon: Briefcase,
    bg: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-200'
  },
  { 
    id: 'date-night', 
    label: 'Romantic Date Nights', 
    desc: 'Cozy, candlelight cafe tables reserved for memorable evenings with your special one.',
    icon: Heart,
    bg: 'from-rose-500/10 to-pink-500/10',
    border: 'border-rose-200'
  },
  { 
    id: 'party', 
    label: 'Private Celebrations', 
    desc: 'Full cafe backyards or rooftop sections reserved exclusively for your party.',
    icon: PartyPopper,
    bg: 'from-purple-500/10 to-indigo-500/10',
    border: 'border-purple-200'
  },
  { 
    id: 'workshop', 
    label: 'Workshops & Meetups', 
    desc: 'Spacious layouts perfect for book clubs, art workshops, and community events.',
    icon: Users,
    bg: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-200'
  },
  { 
    id: 'photoshoot', 
    label: 'Photoshoots & Shoots', 
    desc: 'Aesthetic cafe interiors with natural lighting ideal for creators and brand shoots.',
    icon: Sparkles,
    bg: 'from-amber-500/10 to-yellow-500/10',
    border: 'border-amber-200'
  },
];

// Why Fahara features
const whyFaharaFeatures = [
  { 
    id: 'verified', 
    title: '100% Verified Cafes', 
    desc: 'Every listed cafe is manually inspected for hygiene, seating capacity, and safety standards.', 
    icon: ShieldCheck 
  },
  { 
    id: 'pricing', 
    title: 'Transparent Hourly Rates', 
    desc: 'Clear upfront pricing with no hidden service charges. Pay strictly for the hours you reserve.', 
    icon: Lock 
  },
  { 
    id: 'instant', 
    title: 'Instant Confirmation', 
    desc: 'Get immediate booking confirmations without waiting for endless back-and-forth phone calls.', 
    icon: Zap 
  },
  { 
    id: 'capacity', 
    title: 'Flexible Guest Capacity', 
    desc: 'Book intimate tables for 2 or reserve full cafe halls for gatherings up to 100+ guests.', 
    icon: Users2 
  },
  { 
    id: 'reviews', 
    title: 'Verified Guest Reviews', 
    desc: 'Make confident decisions backed by genuine ratings and reviews from past event hosts.', 
    icon: Star 
  },
  { 
    id: 'support', 
    title: '24/7 Concierge Support', 
    desc: 'Our dedicated support team is available round-the-clock to assist with your venue bookings.', 
    icon: Bell 
  },
];

// How It Works Steps
const howItWorksSteps = [
  { step: '01', title: 'Discover & Search', desc: 'Browse curated cafes by location, event type, guest count, and hourly budget.' },
  { step: '02', title: 'Select Date & Slots', desc: 'Pick your preferred date, check real-time slot availability, and select duration.' },
  { step: '03', title: 'Instant Booking', desc: 'Reserve your space securely online with transparent pricing and direct confirmation.' },
  { step: '04', title: 'Host & Enjoy', desc: 'Arrive at your reserved cafe venue and enjoy a seamless celebration experience.' },
];

// Fahara Safety & Guarantee Commitments
const faharaSafetyCommitments = [
  {
    id: 'verified',
    title: '100% Verified Venues',
    desc: 'Every cafe is manually inspected for hygiene, guest safety standards, and seating capacities before listing.',
    icon: ShieldCheck,
    badge: 'Hygiene & Safety'
  },
  {
    id: 'reserved',
    title: 'Guaranteed Slot Lock',
    desc: 'Your reserved cafe section is locked exclusively for your group. Zero double bookings or walk-in overlaps.',
    icon: CheckCircle2,
    badge: 'Exclusive Access'
  },
  {
    id: 'refund',
    title: '100% Refund Safeguard',
    desc: 'Cancel up to 24 hours before your slot time for a full, hassle-free refund processed directly to your account.',
    icon: Lock,
    badge: 'Zero Risk'
  },
  {
    id: 'support',
    title: '24/7 Event Assistance',
    desc: 'Our dedicated support team coordinates directly with cafe hosts to ensure seating, food, and setups run smoothly.',
    icon: Bell,
    badge: 'Concierge Help'
  }
];

// FAQ Data
const faqs = [
  {
    question: 'How do I book a cafe on Fahara?',
    answer: 'Simply enter your location, preferred date, and guest count in the search bar. Browse available cafes, choose your time slot, and click "Book Cafe" to complete your secure payment.'
  },
  {
    question: 'What is included in the hourly cafe booking fee?',
    answer: 'The hourly rate reserves your dedicated seating area or venue section for the chosen duration. Specific menu offerings or food & beverage packages are specified on each cafe detail page.'
  },
  {
    question: 'Can I visit the cafe before making a booking?',
    answer: 'Yes! You can view detailed photos, 360-degree venue tours, and address details on Fahara. If you wish to visit in person beforehand, you can coordinate via our concierge support.'
  },
  {
    question: 'What is the cancellation policy for cafe bookings?',
    answer: 'Cancellations made 24 hours prior to your scheduled booking time receive a full refund. Check our detailed cancellation policy page for specific terms.'
  },
  {
    question: 'How do I list my cafe on Fahara?',
    answer: 'If you are a cafe owner looking to monetize off-peak hours and private event bookings, click "Log In" or contact our partner onboarding team to get started.'
  }
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Search State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);
  const [searchEventType, setSearchEventType] = useState('all');
  const [selectedChip, setSelectedChip] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Showcase Card Carousel State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Auto carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroShowcaseCafes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeShowcaseCafe = heroShowcaseCafes[activeSlideIndex];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set('search', searchLocation);
    if (searchGuests) params.set('guests', searchGuests);
    if (searchEventType && searchEventType !== 'all') params.set('event', searchEventType);
    router.push(`/customer/cafe?${params.toString()}`);
  };

  const handleChipSelect = (chipId, label) => {
    if (selectedChip === chipId) {
      setSelectedChip('');
      setSearchEventType('all');
    } else {
      setSelectedChip(chipId);
      setSearchEventType(chipId);
      setSearchLocation(label);
    }
  };

  const handleResetSearch = () => {
    setSearchLocation('');
    setSearchDate('');
    setSearchGuests(2);
    setSearchEventType('all');
    setSelectedChip('');
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] selection:bg-[#6F4E37] selection:text-white">

      {/* ==================== 1. TOP STICKY NAVBAR WITH HAMBURGER ==================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <Image 
              src="/Fahara%20Logo.jpeg" 
              alt="Fahara Logo" 
              width={36} 
              height={36} 
              className="object-contain rounded-xl sm:rounded-2xl shadow-md border border-[#DDB892]/40 group-hover:scale-105 transition-transform" 
              priority 
            />
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#2C1810] block leading-none">FAHARA</span>
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#6F4E37]">CAFE & EVENT BOOKING</span>
            </div>
          </Link>

          {/* Desktop Quick Nav Links (Visible >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-black text-stone-700">
            <Link href="/customer/cafe" className="hover:text-[#6F4E37] transition-colors">
              Discover Cafes
            </Link>
            <a href="#how-it-works" className="hover:text-[#6F4E37] transition-colors">
              How It Works
            </a>
            <a href="#why-fahara" className="hover:text-[#6F4E37] transition-colors">
              Why Fahara
            </a>
            <a href="#occasions" className="hover:text-[#6F4E37] transition-colors">
              Occasions
            </a>
            <a href="#faq" className="hover:text-[#6F4E37] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Header Action Buttons & Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/login" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-[#6F4E37] bg-[#FFF8F0] hover:bg-[#F5EBE0] border border-[#DDB892]/60 rounded-xl transition-all"
            >
              <LogIn size={14} />
              <span>Log In</span>
            </Link>
            
            <Link 
              href="/register" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <UserPlus size={14} />
              <span>Sign Up</span>
            </Link>

            {/* Mobile / Tablet Hamburger Toggle Button (< 1024px) */}
            <button 
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] hover:bg-amber-100/60 transition-all cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Overlay Drawer (Floating over page content) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Darkened Blur Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-stone-950/70 backdrop-blur-md z-40 lg:hidden"
              />

              {/* Modern Interactive Floating Menu Drawer */}
              <motion.div 
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute top-full left-0 right-0 z-50 lg:hidden bg-[#FFF8F0] border-b-2 border-[#DDB892]/40 shadow-2xl overflow-y-auto max-h-[calc(100vh-65px)] rounded-b-3xl text-[#2C1810] pb-6"
              >
                {/* Header Sub-bar */}
                <div className="px-4 py-2.5 bg-[#F5EBE0]/80 border-b border-[#DDB892]/30 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6F4E37] animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6F4E37]">Fahara Navigation</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-200/50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-3.5 space-y-3 max-w-7xl mx-auto">
                  {/* Interactive Nav Cards Grid */}
                  <div className="grid grid-cols-1 gap-1.5">
                    
                    <Link 
                      href="/customer/cafe" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="group p-2.5 rounded-2xl bg-white border border-[#DDB892]/40 shadow-2xs hover:shadow-md hover:border-[#6F4E37]/50 transition-all flex items-center justify-between active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-[#4A2C11] to-[#6F4E37] text-white shadow-xs group-hover:scale-105 transition-transform">
                          <Compass size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">Discover Cafes</div>
                          <div className="text-[10px] font-medium text-stone-500">Explore top rated coffee shops & spaces</div>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-stone-400 group-hover:text-[#6F4E37] group-hover:translate-x-1 transition-all" />
                    </Link>

                    <a 
                      href="#how-it-works" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="group p-2.5 rounded-2xl bg-white border border-[#DDB892]/40 shadow-2xs hover:shadow-md hover:border-[#6F4E37]/50 transition-all flex items-center justify-between active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-[#6F4E37] border border-amber-500/20 group-hover:scale-105 transition-transform">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">How It Works</div>
                          <div className="text-[10px] font-medium text-stone-500">4 simple steps to reserve & customize</div>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-stone-400 group-hover:text-[#6F4E37] group-hover:translate-x-1 transition-all" />
                    </a>

                    <a 
                      href="#why-fahara" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="group p-2.5 rounded-2xl bg-white border border-[#DDB892]/40 shadow-2xs hover:shadow-md hover:border-[#6F4E37]/50 transition-all flex items-center justify-between active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">Why Fahara</div>
                          <div className="text-[10px] font-medium text-stone-500">Verified venues & transparent pricing</div>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-stone-400 group-hover:text-[#6F4E37] group-hover:translate-x-1 transition-all" />
                    </a>

                    <a 
                      href="#occasions" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="group p-2.5 rounded-2xl bg-white border border-[#DDB892]/40 shadow-2xs hover:shadow-md hover:border-[#6F4E37]/50 transition-all flex items-center justify-between active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-800 border border-purple-500/20 group-hover:scale-105 transition-transform">
                          <PartyPopper size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">Occasions</div>
                          <div className="text-[10px] font-medium text-stone-500">Birthdays, meetings & private events</div>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-stone-400 group-hover:text-[#6F4E37] group-hover:translate-x-1 transition-all" />
                    </a>

                    <a 
                      href="#faq" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="group p-2.5 rounded-2xl bg-white border border-[#DDB892]/40 shadow-2xs hover:shadow-md hover:border-[#6F4E37]/50 transition-all flex items-center justify-between active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-800 border border-blue-500/20 group-hover:scale-105 transition-transform">
                          <HelpCircle size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">Help & FAQ</div>
                          <div className="text-[10px] font-medium text-stone-500">Cancellation, refunds & booking support</div>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-stone-400 group-hover:text-[#6F4E37] group-hover:translate-x-1 transition-all" />
                    </a>

                  </div>

                  {/* Quick Category Badges Row */}
                  <div className="pt-1">
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#6F4E37] mb-1.5 px-1">Quick Shortcuts</div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-stone-700">
                      <Link 
                        href="/customer/cafe" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2 py-0.5 rounded-full bg-white border border-[#DDB892]/40 hover:bg-[#FFF8F0] transition-colors flex items-center gap-1"
                      >
                        ☕ Cafes
                      </Link>
                      <Link 
                        href="/events" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2 py-0.5 rounded-full bg-white border border-[#DDB892]/40 hover:bg-[#FFF8F0] transition-colors flex items-center gap-1"
                      >
                        🎉 Events
                      </Link>
                      <Link 
                        href="/cancellation" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2 py-0.5 rounded-full bg-white border border-[#DDB892]/40 hover:bg-[#FFF8F0] transition-colors flex items-center gap-1"
                      >
                        🛡️ 9-Hr Policy
                      </Link>
                    </div>
                  </div>

                  {/* Auth / Action Buttons */}
                  <div className="pt-2.5 border-t border-[#DDB892]/40 flex flex-col gap-2">
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-black text-[#6F4E37] bg-white hover:bg-[#F5EBE0] border-2 border-[#DDB892]/60 rounded-xl shadow-2xs active:scale-95 transition-all"
                    >
                      <LogIn size={14} />
                      <span>Log In</span>
                    </Link>
                    
                    <Link 
                      href="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-[#2C1810] via-[#4A2C11] to-[#6F4E37] text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg active:scale-95 transition-all"
                    >
                      <UserPlus size={14} />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ==================== 2. PREMIUM INTERACTIVE SPLIT HERO ==================== */}
      <section className="relative bg-gradient-to-br from-[#2C1810] via-[#4A2C11] to-[#6F4E37] text-white py-10 sm:py-16 lg:py-24 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#6F4E37]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT SIDE (col-span-12 lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#DDB892] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-4 sm:mb-5"
              >
                <Sparkles size={14} className="text-amber-400 shrink-0" />
                <span className="truncate">FAHARA • CAFE VENUE BOOKING PLATFORM</span>
              </motion.div>

              {/* Large Headline (Responsive across 360px to 4K) */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-5 leading-tight"
              >
                Find the Perfect Cafe for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#DDB892] to-amber-400">Your Moment</span>
              </motion.h1>

              {/* Supporting Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs sm:text-base lg:text-lg text-[#FFF8F0]/90 font-medium mb-6 sm:mb-8 leading-relaxed max-w-2xl"
              >
                Discover and reserve cafes for birthdays, meetings, date nights, celebrations, and private events with transparent pricing.
              </motion.p>

              {/* FLOATING ADVANCED SEARCH WIDGET (Fully Responsive 360px+) */}
              <motion.form 
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 text-[#2C1810] relative z-30 mb-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3">
                  
                  {/* Location Field with Dropdown */}
                  <div className="flex flex-col text-left w-full min-w-0 relative">
                    <label className="text-[9px] font-black uppercase text-stone-400 block tracking-wider mb-1">Location / Cafe</label>
                    <div className="relative w-full flex items-center px-3.5 py-2.5 sm:py-3 rounded-2xl border border-stone-200 bg-white hover:border-[#6F4E37]/60 focus-within:border-[#6F4E37] focus-within:ring-2 focus-within:ring-[#6F4E37]/20 transition-all shadow-2xs min-h-[44px] group">
                      <MapPin size={16} className="text-[#6F4E37] mr-2.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <input 
                        type="text"
                        value={searchLocation}
                        onFocus={() => setShowLocationDropdown(true)}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="e.g. Bandra, Indiranagar"
                        className="w-full text-xs font-extrabold text-stone-900 outline-none bg-transparent placeholder:text-stone-400 truncate"
                        suppressHydrationWarning
                      />
                      {searchLocation && (
                        <button 
                          type="button" 
                          onClick={() => setSearchLocation('')} 
                          className="p-1 hover:text-stone-700 text-stone-400 ml-1 shrink-0"
                          suppressHydrationWarning
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Interactive Location Dropdown */}
                    <AnimatePresence>
                      {showLocationDropdown && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowLocationDropdown(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 text-left"
                          >
                            <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block mb-2 px-1">Popular Locations</span>
                            <div className="space-y-1">
                              {popularLocations.map((loc) => (
                                <button
                                  key={loc}
                                  type="button"
                                  onClick={() => {
                                    setSearchLocation(loc);
                                    setShowLocationDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] flex items-center justify-between transition-colors"
                                >
                                  <span>{loc}</span>
                                  <ChevronRight size={14} className="text-stone-400" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Date Selector */}
                  <div className="flex flex-col text-left w-full min-w-0">
                    <label className="text-[9px] font-black uppercase text-stone-400 block tracking-wider mb-1">Date</label>
                    <ModernDatePicker
                      value={searchDate}
                      onChange={(d) => setSearchDate(d)}
                      placeholder="Select Date"
                      minYear={new Date().getFullYear()}
                      maxYear={new Date().getFullYear() + 2}
                    />
                  </div>

                  {/* Guests Selector */}
                  <div className="flex flex-col text-left w-full min-w-0">
                    <label className="text-[9px] font-black uppercase text-stone-400 block tracking-wider mb-1">Guests</label>
                    <ModernDropdown 
                      value={searchGuests}
                      onChange={(val) => setSearchGuests(Number(val))}
                      icon={Users}
                      options={[
                        { value: 1, label: '1 Guest' },
                        { value: 2, label: '2 Guests' },
                        { value: 4, label: '4 Guests' },
                        { value: 8, label: '8+ Guests' },
                        { value: 20, label: '20+ Group' },
                      ]}
                    />
                  </div>

                  {/* Event Type Selector */}
                  <div className="flex flex-col text-left w-full min-w-0">
                    <label className="text-[9px] font-black uppercase text-stone-400 block tracking-wider mb-1">Event Type</label>
                    <ModernDropdown 
                      value={searchEventType}
                      onChange={(val) => setSearchEventType(val)}
                      icon={Tag}
                      options={[
                        { value: 'all', label: 'All Events' },
                        { value: 'birthday', label: 'Birthday Party' },
                        { value: 'corporate', label: 'Corporate Meeting' },
                        { value: 'date-night', label: 'Date Night' },
                        { value: 'party', label: 'Private Party' },
                        { value: 'workshop', label: 'Workshop' },
                        { value: 'photoshoot', label: 'Photoshoot' },
                      ]}
                    />
                  </div>

                </div>

                {/* Search Action Row (CTA + Reset) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button 
                      type="button" 
                      suppressHydrationWarning
                      onClick={handleResetSearch}
                      className="text-[11px] font-black text-stone-400 hover:text-[#6F4E37] flex items-center gap-1 transition-colors px-2 py-1"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Filters</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a 
                      href="#occasions"
                      className="hidden sm:inline-flex px-5 py-3 text-xs font-black text-[#6F4E37] hover:bg-[#FFF8F0] rounded-2xl transition-all"
                    >
                      Explore Events
                    </a>

                    <button 
                      type="submit"
                      suppressHydrationWarning
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <span>Search Cafes</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.form>

              {/* POPULAR EVENT CHIPS (HORIZONTALLY SCROLLABLE ON MOBILE) */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full"
              >
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <span className="text-xs font-black uppercase tracking-wider text-[#DDB892] shrink-0 mr-1">Popular Events:</span>
                  {popularEventChips.map((chip) => {
                    const isSelected = selectedChip === chip.id;
                    return (
                      <motion.button
                        key={chip.id}
                        type="button"
                        suppressHydrationWarning
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChipSelect(chip.id, chip.label)}
                        className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-300 text-[#2C1810] font-black shadow-md scale-105' 
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                        }`}
                      >
                        {chip.label}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

            </div>

            {/* RIGHT SIDE: PREMIUM INTERACTIVE CAFE SHOWCASE CARD (col-span-12 lg:col-span-5) */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative mt-6 lg:mt-0"
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 bg-white text-[#2C1810] group"
              >
                {/* Main Showcase Image Carousel */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeShowcaseCafe.id}
                      src={activeShowcaseCafe.image} 
                      alt={activeShowcaseCafe.name}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {activeShowcaseCafe.isOpenNow && (
                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
                          OPEN NOW
                        </span>
                      )}
                      {activeShowcaseCafe.isTopRated && (
                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-md">
                          TOP RATED
                        </span>
                      )}
                    </div>

                    {/* Animated Heart Button */}
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                      onClick={() => setIsFavorite(!isFavorite)}
                      suppressHydrationWarning
                      className="p-2 sm:p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-rose-500 shadow-md transition-all cursor-pointer"
                    >
                      <Heart size={16} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
                    </motion.button>
                  </div>

                  {/* Rating Pill Badge */}
                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg border border-stone-200 text-[#2C1810] flex items-center gap-1.5"
                  >
                    <Star size={13} className="fill-amber-500 text-amber-500" />
                    <span className="text-[11px] sm:text-xs font-black">{activeShowcaseCafe.rating} Superhost</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-stone-400">({activeShowcaseCafe.reviews})</span>
                  </motion.div>
                </div>

                {/* Cafe Showcase Info Card Content */}
                <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 bg-white">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-black text-base sm:text-lg text-[#2C1810] leading-snug line-clamp-1">{activeShowcaseCafe.name}</h3>
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FFF8F0] border border-[#DDB892]/60 rounded-xl text-xs font-black text-[#6F4E37] shrink-0">
                        ₹{activeShowcaseCafe.price}/hr
                      </span>
                    </div>

                    <p className="text-xs font-bold text-stone-500 flex items-center gap-1 line-clamp-1">
                      <MapPin size={13} className="text-[#6F4E37] shrink-0" />
                      <span className="truncate">{activeShowcaseCafe.location}</span>
                    </p>
                  </div>

                  {/* Carousel Thumbnail Navigation Dots */}
                  <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      {heroShowcaseCafes.map((_, idx) => (
                        <button
                          key={idx}
                          suppressHydrationWarning
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            activeSlideIndex === idx ? 'w-5 sm:w-6 bg-[#6F4E37]' : 'w-2 bg-stone-200'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <Link
                      href="/customer/cafe"
                      className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#6F4E37] hover:bg-[#4A2C11] text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Book Cafe</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==================== 2B. TRUST STRIP ==================== */}
      <section className="bg-white border-b border-stone-200/80 py-3.5 sm:py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-around gap-3 sm:gap-4 text-[11px] sm:text-xs font-black text-[#2C1810]">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Verified Cafes</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Transparent Pricing</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Real Customer Reviews</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>Secure Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. PLATFORM HIGHLIGHTS (STATS BAR WITH FRAMER MOTION) ==================== */}
      <section className="bg-white border-b border-stone-200/80 py-8 sm:py-12 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center"
          >
            
            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFF8F0] to-amber-50/40 border border-[#DDB892]/50 shadow-xs hover:shadow-lg transition-all"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center mx-auto mb-2.5 sm:mb-3 font-black shadow-md">
                <MapPin size={20} />
              </div>
              <span className="text-2xl sm:text-4xl font-black text-[#2C1810] block tracking-tight">50+</span>
              <p className="text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-wider mt-1">Top City Neighborhoods</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFF8F0] to-amber-50/40 border border-[#DDB892]/50 shadow-xs hover:shadow-lg transition-all"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center mx-auto mb-2.5 sm:mb-3 font-black shadow-md">
                <PartyPopper size={20} />
              </div>
              <span className="text-2xl sm:text-4xl font-black text-[#2C1810] block tracking-tight">15,000+</span>
              <p className="text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-wider mt-1">Celebrations Reserved</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFF8F0] to-amber-50/40 border border-[#DDB892]/50 shadow-xs hover:shadow-lg transition-all"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center mx-auto mb-2.5 sm:mb-3 font-black shadow-md">
                <Star size={20} />
              </div>
              <span className="text-2xl sm:text-4xl font-black text-[#2C1810] block tracking-tight">4.9 ★</span>
              <p className="text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-wider mt-1">Average Host Rating</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#FFF8F0] to-amber-50/40 border border-[#DDB892]/50 shadow-xs hover:shadow-lg transition-all"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center mx-auto mb-2.5 sm:mb-3 font-black shadow-md">
                <ShieldCheck size={20} />
              </div>
              <span className="text-2xl sm:text-4xl font-black text-[#2C1810] block tracking-tight">₹0</span>
              <p className="text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-wider mt-1">Hidden Service Charges</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ==================== 4. ABOUT FAHARA PLATFORM ==================== */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <div className="space-y-4 sm:space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37] bg-[#DDB892]/25 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#DDB892]/40 inline-block">
              About Fahara Platform
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C1810] leading-tight">
              India's Premier Cafe Venue Booking Marketplace
            </h2>
            <p className="text-stone-600 font-medium text-xs sm:text-base leading-relaxed">
              Fahara transforms how people discover and book cafe spaces. Whether you're planning an intimate birthday celebration, a quiet team meeting, a romantic anniversary date, or a community workshop, Fahara connects you directly with top verified cafe venues.
            </p>

            <div className="space-y-3 sm:space-y-4 pt-2">
              <div className="flex items-start gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#FFF8F0] text-[#6F4E37] shrink-0 font-black">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#2C1810]">Curated & Manually Verified Venues</h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">Every cafe listed on Fahara undergoes strict quality checks for seating, ambience, and hospitality.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#FFF8F0] text-[#6F4E37] shrink-0 font-black">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#2C1810]">Transparent Hourly Pricing</h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">Pay only for the hours you need. No bloated venue minimums or hidden mandatory charges.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#FFF8F0] text-[#6F4E37] shrink-0 font-black">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#2C1810]">Instant Online Booking Confirmation</h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">Select your preferred date, time slot, and guest count, and receive instant digital confirmation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-4 lg:mt-0">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white aspect-[4/3]">
              <img 
                src="caf5.jpg" 
                alt="Cafe Interior" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-transparent to-transparent" />
            
            </div>
          </div>

        </div>
      </section>

      {/* ==================== 5. HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-12 sm:py-20 bg-[#F5EBE0] border-y border-[#DDB892]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37] bg-white px-3.5 py-1.5 rounded-full border border-[#DDB892]/50 inline-block mb-3">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C1810]">How Fahara Works</h2>
            <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
              Booking your dream cafe venue takes less than two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {howItWorksSteps.map((item, idx) => (
              <motion.div 
                key={item.step}
                whileHover={{ y: -6 }}
                className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] flex items-center justify-center font-black text-base sm:text-lg mb-3 sm:mb-4 shadow-2xs">
                    {item.step}
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-[#2C1810] mb-1.5 sm:mb-2">{item.title}</h3>
                  <p className="text-xs font-medium text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#DDB892]">
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================== 6. OCCASIONS YOU CAN HOST ==================== */}
      <section id="occasions" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37] bg-[#DDB892]/25 px-3.5 py-1.5 rounded-full border border-[#DDB892]/40 inline-block mb-3">
            Tailored Venue Spaces
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C1810]">Occasions You Can Host</h2>
          <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
            Explore curated cafe setups designed specifically for your event type.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {occasionCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -6 }}
                className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${cat.bg} border ${cat.border} text-[#6F4E37] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-[#2C1810] mb-1.5 sm:mb-2 group-hover:text-[#6F4E37] transition-colors">{cat.label}</h3>
                  <p className="text-xs font-medium text-stone-500 leading-relaxed mb-4 sm:mb-6">{cat.desc}</p>
                </div>

                <Link
                  href={`/customer/cafe?category=${cat.id}`}
                  className="inline-flex items-center gap-2 text-xs font-black text-[#6F4E37] group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore {cat.label}</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* ==================== 7. WHY CHOOSE FAHARA ==================== */}
      <section id="why-fahara" className="py-12 sm:py-20 bg-[#F5EBE0] border-y border-[#DDB892]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C1810]">Why Choose Fahara</h2>
            <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
              Everything you need for a stress-free cafe venue reservation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {whyFaharaFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.id} className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-2xs flex items-start gap-3.5 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-[#2C1810] mb-1">{feat.title}</h3>
                    <p className="text-xs font-medium text-stone-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================== 8. FAHARA SAFETY & BOOKING GUARANTEE ==================== */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37] bg-[#DDB892]/25 px-3.5 py-1.5 rounded-full border border-[#DDB892]/40 inline-block mb-3">
            Fahara Guarantee
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C1810]">Your Trust & Safety First</h2>
          <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
            We ensure every cafe venue booking meets the highest standards of safety, privacy, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {faharaSafetyCommitments.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={item.id}
                whileHover={{ y: -6 }}
                className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] flex items-center justify-center font-black shadow-2xs">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-[#2C1810] mb-2">{item.title}</h3>
                  <p className="text-xs font-medium text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* ==================== 9. FREQUENTLY ASKED QUESTIONS (FAQ) ==================== */}
      <section id="faq" className="py-12 sm:py-20 bg-[#F5EBE0] border-y border-[#DDB892]/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37] bg-white px-3.5 py-1.5 rounded-full border border-[#DDB892]/50 inline-block mb-3">
              Have Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C1810]">Frequently Asked Questions</h2>
            <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
              Everything you need to know about booking cafe spaces on Fahara.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    suppressHydrationWarning
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left font-black text-xs sm:text-base text-[#2C1810] hover:text-[#6F4E37] transition-colors cursor-pointer gap-2"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={16} className={`transform transition-transform shrink-0 ${isOpen ? 'rotate-180 text-[#6F4E37]' : 'text-stone-400'}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm font-medium text-stone-600 leading-relaxed border-t border-stone-100 pt-3"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================== 10. AUTH & DISCOVERY CTA ==================== */}
      <section className="py-14 sm:py-20 bg-gradient-to-r from-[#2C1810] via-[#4A2C11] to-[#6F4E37] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 sm:mb-4">Ready to Book Your Next Cafe Experience?</h2>
          <p className="text-xs sm:text-base lg:text-lg text-[#FFF8F0]/90 mb-6 sm:mb-8 font-medium max-w-2xl mx-auto">
            Log in or sign up today to discover, customize, and reserve top-rated cafe spaces in your city.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-white text-[#2C1810] font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl hover:bg-[#FFF8F0] transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              <span>Log In Now</span>
            </Link>

            <Link 
              href="/register" 
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              <span>Create Account</span>
            </Link>

            <Link 
              href="/customer/cafe" 
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Search size={16} />
              <span>Browse All Cafes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== 11. FOOTER ==================== */}
      <Footer />

    </div>
  );
}
