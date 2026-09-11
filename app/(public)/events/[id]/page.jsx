'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEventPackage } from '@/hooks/useCafeDetails';
import { ArrowLeft, Users, Clock, ShieldCheck, CheckCircle2, Sparkles, Share2, Check, Utensils, Cake as CakeIcon, Music } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
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

  const parsedInclusions = useMemo(() => {
    let inc = event?.inclusions;
    if (typeof inc === 'string') {
      try { inc = JSON.parse(inc); } catch (e) { inc = {}; }
    }
    return inc || {};
  }, [event?.inclusions]);

  const activeInclusionCategories = useMemo(() => {
    let rawInc = event?.inclusions;
    if (typeof rawInc === 'string') {
      try { rawInc = JSON.parse(rawInc); } catch (e) { rawInc = []; }
    }

    // Case 1: inclusions is an ARRAY of inclusion cards (new tier schema)
    if (Array.isArray(rawInc) && rawInc.length > 0) {
      return rawInc.map((inc, idx) => {
        let icon = CheckCircle2;
        const nameLower = (inc.name || inc.category || inc.title || '').toLowerCase();
        if (nameLower.includes('food') || nameLower.includes('cater') || nameLower.includes('buffet') || nameLower.includes('starter')) icon = Utensils;
        else if (nameLower.includes('cake') || nameLower.includes('baker')) icon = CakeIcon;
        else if (nameLower.includes('decor') || nameLower.includes('theme') || nameLower.includes('balloon')) icon = Sparkles;
        else if (nameLower.includes('music') || nameLower.includes('dj') || nameLower.includes('sound')) icon = Music;

        let items = [];
        if (Array.isArray(inc.tiers) && inc.tiers.length > 0) {
          items = inc.tiers.map(t => ({
            name: t.tier_name || t.name || 'Tier Item',
            description: t.description || inc.description || '',
            price: Number(t.unit_price ?? t.price ?? 0)
          }));
        } else if (Array.isArray(inc.items) && inc.items.length > 0) {
          items = inc.items.map(i => ({
            name: i.name || i.title || 'Item',
            description: i.description || i.desc || '',
            price: Number(i.price ?? i.unitPrice ?? i.unit_price ?? 0)
          }));
        } else {
          items = [{
            name: inc.name || inc.title || 'Included Service',
            description: inc.description || inc.desc || '',
            price: Number(inc.basic_price ?? inc.unit_price ?? inc.price ?? 0)
          }];
        }

        return {
          title: inc.name || inc.category || inc.title || `Inclusion #${idx + 1}`,
          key: `inc_${idx}_${(inc.name || '').replace(/\s+/g, '_')}`,
          icon: icon,
          active: true,
          items: items,
          theme: 'from-[#6F4E37]/10 via-amber-500/5 to-[#6F4E37]/10 border-[#DDB892]/60 text-[#6F4E37] bg-[#6F4E37]/10'
        };
      });
    }

    // Case 2: inclusions is an OBJECT (legacy schema)
    const objInc = (rawInc && typeof rawInc === 'object' && !Array.isArray(rawInc)) ? rawInc : {};
    const foodItemsRaw = objInc.food_items || event?.food_items || [];
    const cakeItemsRaw = objInc.cake_items || event?.cake_items || [];
    const decorItemsRaw = objInc.decoration_items || event?.decoration_items || [];
    const musicItemsRaw = objInc.music_items || event?.music_items || [];
    const otherItemsRaw = objInc.other_items || event?.other_items || [];

    const isFood = objInc.food !== undefined ? Boolean(objInc.food) : foodItemsRaw.length > 0;
    const isCake = objInc.cake !== undefined ? Boolean(objInc.cake) : cakeItemsRaw.length > 0;
    const isDecor = objInc.decoration !== undefined ? Boolean(objInc.decoration) : decorItemsRaw.length > 0;
    const isMusic = objInc.music !== undefined ? Boolean(objInc.music) : musicItemsRaw.length > 0;
    const isOther = objInc.other !== undefined ? Boolean(objInc.other) : otherItemsRaw.length > 0;

    return [
      { title: 'Food & Catering', key: 'food_items', icon: Utensils, active: isFood, items: foodItemsRaw, theme: 'from-amber-500/10 via-orange-500/5 to-amber-500/10 border-amber-200/80 text-amber-900 bg-amber-500/10' },
      { title: 'Celebration Cake', key: 'cake_items', icon: CakeIcon, active: isCake, items: cakeItemsRaw, theme: 'from-rose-500/10 via-pink-500/5 to-rose-500/10 border-rose-200/80 text-rose-900 bg-pink-500/10' },
      { title: 'Theme Decoration', key: 'decoration_items', icon: Sparkles, active: isDecor, items: decorItemsRaw, theme: 'from-purple-500/10 via-indigo-500/5 to-purple-500/10 border-purple-200/80 text-purple-900 bg-purple-500/10' },
      { title: 'Music & DJ Setup', key: 'music_items', icon: Music, active: isMusic, items: musicItemsRaw, theme: 'from-sky-500/10 via-cyan-500/5 to-sky-500/10 border-sky-200/80 text-sky-900 bg-sky-500/10' },
      { title: 'Other Special Inclusions', key: 'other_items', icon: CheckCircle2, active: isOther, items: otherItemsRaw, theme: 'from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-emerald-200/80 text-emerald-900 bg-emerald-500/10' },
    ].filter(cat => cat.active);
  }, [event]);

  const packagePrice = useMemo(() => {
    const directPrice = Number(event?.price ?? event?.base_price ?? 0);
    let incSum = 0;
    activeInclusionCategories.forEach(cat => {
      if (Array.isArray(cat.items)) {
        cat.items.forEach(item => {
          incSum += Number(item.price || item.unitPrice || item.unit_price || 0);
        });
      }
    });
    return incSum > directPrice ? incSum : (directPrice > 0 ? directPrice : incSum);
  }, [event, activeInclusionCategories]);

  const handleShareClick = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const galleryList = useMemo(() => {
    let list = event?.gallery || parsedInclusions?.gallery || [];
    if (typeof list === 'string') {
      try { list = JSON.parse(list); } catch (e) { list = []; }
    }
    return Array.isArray(list) ? list : [];
  }, [event?.gallery, parsedInclusions?.gallery]);

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
        <div className="bg-white/90 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-4 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-6 sm:mb-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-[#2C1810] tracking-tight leading-tight min-w-0">
              {event.package_name || 'Special Event Package'}
            </h1>
            <span className="inline-flex items-center gap-1.5 bg-[#FFF8F0] text-[#6F4E37] border border-[#DDB892]/60 px-3 py-1 rounded-full text-xs font-black shadow-2xs shrink-0">
              <Sparkles size={14} className="text-[#6F4E37]" />
              <span>Event Package</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-600 flex-wrap">
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

            {/* Provided Inclusions & Services Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-2xl font-black text-[#2C1810] tracking-tight">Package Inclusions & Provided Services</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">Everything included in this package provided directly by the venue</p>
                </div>
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-black shadow-2xs shrink-0">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>All Included</span>
                </span>
              </div>

              {/* Service Categories Display */}
              {activeInclusionCategories.map((cat) => {
                const CatIcon = cat.icon;

                return (
                  <div key={cat.title} className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-stone-50 via-white to-stone-50/60 border border-stone-200/80 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-2xl ${cat.theme} flex items-center justify-center font-extrabold shadow-2xs`}>
                          <CatIcon size={19} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-[#2C1810]">{cat.title}</h3>
                          <p className="text-[11px] text-stone-400 font-bold">
                            {cat.items && cat.items.length > 0 ? `${cat.items.length} Provided Items` : 'Included with Package'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Provided
                      </span>
                    </div>

                    {cat.items && cat.items.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {cat.items.map((item, idx) => {
                          const formattedName = item.name ? (item.name.charAt(0).toUpperCase() + item.name.slice(1)) : 'Service Item';
                          const itemDesc = item.description || item.desc || '';
                          const itemPrice = Number(item.price) || 0;

                          return (
                            <div 
                              key={`${cat.key}-${idx}-${item.name}`}
                              className="p-3.5 rounded-2xl border bg-gradient-to-r from-[#FFF8F0] to-white border-stone-200 flex items-start justify-between shadow-2xs gap-3"
                            >
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className="w-6 h-6 rounded-lg bg-[#6F4E37] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs mt-0.5">
                                  <Check size={14} className="stroke-[3]" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-black text-[#2C1810] truncate">
                                    {formattedName}
                                  </span>
                                  {itemDesc && (
                                    <span className="text-[11px] font-semibold text-stone-500 line-clamp-2 mt-0.5">
                                      {itemDesc}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 shrink-0">
                                {itemPrice > 0 && (
                                  <span className="text-xs font-black text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-0.5 rounded-lg border border-[#DDB892]/40">
                                    ₹{itemPrice}
                                  </span>
                                )}
                                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20">
                                  Included
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-600 font-bold italic pl-2">Standard offering included in package.</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Photo Gallery Card */}
            {galleryList.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">Package Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {galleryList.map((img, idx) => {
                    const imgUrl = typeof img === 'string' ? img : img?.url;
                    if (!imgUrl) return null;
                    return (
                      <div key={idx} className="h-36 sm:h-44 rounded-2xl overflow-hidden border border-stone-200 shadow-2xs group relative bg-stone-100">
                        <img 
                          src={imgUrl} 
                          alt={`Package photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:w-1/3 w-full sticky top-[7.5rem]">
            <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-6 w-full space-y-5">
              
              {/* Price Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">₹{packagePrice}</span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1.5">Package Price</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black border border-emerald-200 shadow-2xs">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>INSTANT BOOK</span>
                </div>
              </div>
              
              {/* Capacity & Price Breakdown Box */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FFF8F0]/80 border border-[#DDB892]/50 text-xs font-bold text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Minimum Guests</span>
                  <span className="font-black text-[#2C1810]">{event.minimum_persons || 1} Guests</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#DDB892]/30 pt-2.5">
                  <span className="text-stone-500 font-semibold">Maximum Guests</span>
                  <span className="font-black text-[#2C1810]">{event.maximum_persons || 50} Guests</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#DDB892]/30 pt-2.5 text-[#6F4E37]">
                  <span className="font-extrabold">Total Package Price</span>
                  <span className="font-black text-sm">₹{packagePrice}</span>
                </div>
              </div>
              
              {/* Reserve Package CTA */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/booking/${cafe.id}`)}
                className="w-full bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:from-[#3A220D] hover:to-[#5E422E] text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-[#4A2C11]/20 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Reserve Package</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-white/20 text-white text-xs font-black">₹{packagePrice}</span>
              </motion.button>

              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-stone-400">
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
