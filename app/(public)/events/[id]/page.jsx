'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEventPackage } from '@/hooks/useCafeDetails';
import { Loader2, ArrowLeft, Users, Clock, Coffee, ShieldCheck, CheckCircle2, Sparkles, Calendar, Heart, Share2, Check, Utensils, Cake as CakeIcon, Music, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { data: packageResponse, isLoading, error } = useEventPackage(id);
  const event = packageResponse?.data;
  const cafe = event?.cafe;

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <FaharaInteractiveLoader 
        message="Loading Event Details & Special Offers..." 
        badgeTag="FAHARA EVENTS" 
        fullScreen={true} 
      />
    );
  }

  if (error || !event || !cafe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8F0] p-4 text-center">
        <h2 className="text-2xl font-black text-[#2C1810] mb-2">Event Package Not Found</h2>
        <p className="text-stone-500 text-sm mb-6 max-w-md">We couldn&apos;t load the requested event details.</p>
        <button 
          onClick={() => router.back()} 
          className="px-6 py-3 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased selection:bg-[#6F4E37] selection:text-white pb-24 lg:pb-12">
      
      {/* Top Navbar */}
      <CustomerNavbar showSearch={true} showViewToggles={false} />

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 py-6">
        
        {/* Navigation Breadcrumb Row */}
        <div className="mb-4 flex items-center justify-between">
          <Link href={`/cafes/${cafe.id}`} className="inline-flex items-center text-xs sm:text-sm font-extrabold bg-white hover:bg-[#FFF8F0] hover:text-[#6F4E37] text-stone-700 px-4 py-2.5 rounded-2xl border border-stone-200/80 transition-all shadow-2xs">
            <ArrowLeft size={15} className="mr-2" /> Back to {cafe.name}
          </Link>

          <button
            onClick={handleShareClick}
            className="inline-flex items-center gap-1.5 text-xs font-black bg-white hover:bg-[#FFF8F0] text-[#2C1810] px-4 py-2.5 rounded-2xl border border-stone-200/80 transition-all shadow-2xs cursor-pointer"
          >
            {copied ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} className="text-[#6F4E37]" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Title Header Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#2C1810] tracking-tight leading-tight">
              {event.package_name || 'Special Event Package'}
            </h1>
            <span className="inline-flex items-center gap-1.5 bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 px-3 py-1 rounded-full text-xs font-black shadow-2xs">
              <Sparkles size={14} className="text-[#6F4E37]" />
              <span>Event Package</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-600">
            <span>Hosted at</span>
            <Link href={`/cafes/${cafe.id}`} className="text-[#6F4E37] underline decoration-stone-300 hover:decoration-[#6F4E37] transition-colors font-black">
              {cafe.name}
            </Link>
            {cafe.status === 'ACTIVE' && <ShieldCheck size={16} className="text-emerald-600 shrink-0" />}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          
          {/* Left Column - Details */}
          <div className="lg:w-2/3 min-w-0 space-y-8">
            
            {/* Cover Image Frame */}
            <div className="w-full h-[280px] sm:h-[400px] md:h-[480px] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-md relative group">
              {event.cover_image ? (
                <img 
                  src={event.cover_image} 
                  alt={event.package_name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] via-stone-50 to-[#FFF3E4] flex flex-col items-center justify-center text-stone-400">
                  <Sparkles size={48} className="text-[#6F4E37] opacity-40 mb-2" />
                  <span className="font-extrabold text-stone-500 text-sm">Fahara Event Package</span>
                </div>
              )}
            </div>

            {/* About Package Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-4 tracking-tight">About this package</h2>
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-medium">
                {event.description || 'Enjoy a meticulously curated event package tailored for your special moments.'}
              </p>
            </div>
            
            {/* Highlights Grid */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-6 tracking-tight">Package Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-stone-800 bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#6F4E37] mr-3.5 shadow-2xs border border-stone-200/60 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider text-stone-400">Duration</div>
                    <div className="text-sm font-black text-[#2C1810]">{event.duration_hours || 4} Hours</div>
                  </div>
                </div>

                <div className="flex items-center text-stone-800 bg-stone-50/90 p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#6F4E37] mr-3.5 shadow-2xs border border-stone-200/60 shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider text-stone-400">Capacity</div>
                    <div className="text-sm font-black text-[#2C1810]">Up to {event.maximum_persons || 20} Guests</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions & Amenities Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Inclusions & Amenities</h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">Everything included in this special package</p>
                </div>
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] text-xs font-black shadow-2xs">
                  <Sparkles size={13} className="text-[#6F4E37]" />
                  <span>Package Perks</span>
                </span>
              </div>

              {/* Colorful Tabs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { 
                    id: 'food',
                    name: 'Food & Catering', 
                    included: Boolean(event.food),
                    icon: Utensils,
                    theme: {
                      activeBg: 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-300/80 text-amber-950',
                      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20',
                      badge: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
                      dot: 'bg-amber-500'
                    }
                  },
                  { 
                    id: 'cake',
                    name: 'Celebration Cake', 
                    included: Boolean(event.cake),
                    icon: CakeIcon,
                    theme: {
                      activeBg: 'bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-500/5 border-rose-300/80 text-rose-950',
                      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20',
                      badge: 'bg-pink-100 text-pink-900 border-pink-300 font-extrabold',
                      dot: 'bg-pink-500'
                    }
                  },
                  { 
                    id: 'decoration',
                    name: 'Theme Decoration', 
                    included: Boolean(event.decoration),
                    icon: Sparkles,
                    theme: {
                      activeBg: 'bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/5 border-purple-300/80 text-purple-950',
                      iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/20',
                      badge: 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold',
                      dot: 'bg-purple-500'
                    }
                  },
                  { 
                    id: 'music',
                    name: 'Music & Sound Setup', 
                    included: Boolean(event.music),
                    icon: Music,
                    theme: {
                      activeBg: 'bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-sky-500/5 border-sky-300/80 text-sky-950',
                      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20',
                      badge: 'bg-sky-100 text-sky-900 border-sky-300 font-extrabold',
                      dot: 'bg-sky-500'
                    }
                  }
                ].concat(
                  (Array.isArray(event.inclusions) ? event.inclusions : (typeof event.inclusions === 'string' ? event.inclusions.split(',') : []))
                    .filter(Boolean)
                    .map((extraInclusion, idx) => ({
                      id: `extra-${idx}`,
                      name: extraInclusion.trim(),
                      included: true,
                      icon: CheckCircle2,
                      theme: {
                        activeBg: 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border-emerald-300/80 text-emerald-950',
                        iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20',
                        badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold',
                        dot: 'bg-emerald-500'
                      }
                    }))
                ).map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div 
                      key={item.id || idx}
                      whileHover={{ scale: 1.015, y: -2 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 shadow-2xs ${
                        item.included 
                          ? item.theme.activeBg
                          : 'bg-stone-50/70 border-stone-200/80 text-stone-400 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                          item.included ? item.theme.iconBg : 'bg-stone-200 text-stone-400'
                        }`}>
                          <ItemIcon size={20} className="stroke-[2.5]" />
                        </div>
                        <div>
                          <div className={`font-black text-sm leading-snug ${item.included ? 'text-stone-900' : 'text-stone-400 line-through decoration-stone-300'}`}>
                            {item.name}
                          </div>
                          <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1 mt-0.5">
                            {item.included ? (
                              <>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.theme.dot}`}></span>
                                <span className="text-stone-600 font-semibold">Available with package</span>
                              </>
                            ) : (
                              <span className="text-stone-400 font-medium">Not provided</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className={`text-xs px-3 py-1 rounded-full border shadow-2xs shrink-0 flex items-center gap-1.5 ${
                        item.included 
                          ? item.theme.badge 
                          : 'bg-stone-100 text-stone-400 border-stone-200 font-bold'
                      }`}>
                        {item.included ? (
                          <>
                            <Check size={13} className="stroke-[3]" />
                            <span>Included</span>
                          </>
                        ) : (
                          <>
                            <X size={13} className="stroke-[2.5]" />
                            <span>Excluded</span>
                          </>
                        )}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:w-1/3 w-full sticky top-[7.5rem]">
            <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-6 w-full">
              
              {/* Price Header */}
              <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">₹{event.price || 200}</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">flat rate</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black border border-emerald-200 shadow-2xs">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>INSTANT BOOK</span>
                </div>
              </div>
              
              {/* Capacity Breakdown Box */}
              <div className="space-y-3 mb-5 p-4 rounded-2xl bg-[#FFF8F0]/70 border border-[#DDB892]/40 text-xs font-bold text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Minimum Guests</span>
                  <span className="font-black text-[#2C1810]">{event.minimum_persons || 5} Guests</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#DDB892]/30 pt-2.5">
                  <span className="text-stone-500 font-semibold">Maximum Guests</span>
                  <span className="font-black text-[#2C1810]">{event.maximum_persons || 20} Guests</span>
                </div>
              </div>
              
              {/* Reserve Package CTA */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/booking/${cafe.id}`)}
                className="w-full bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-[#4A2C11]/20 hover:shadow-xl transition-all cursor-pointer"
              >
                Reserve Package
              </motion.button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-stone-400">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Instant Confirmation Guaranteed</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
