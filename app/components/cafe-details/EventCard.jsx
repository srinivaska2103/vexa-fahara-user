'use client';

import Link from 'next/link';
import { Users, Clock, Eye, PartyPopper, Briefcase, Cake, Music, HeartHandshake, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventCard({ event, cafeId }) {
  const { id, package_name, description, price, duration_hours, cover_image, minimum_persons, maximum_persons } = event;

  const getEventPlaceholder = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('birth')) return { icon: Cake, colors: 'from-pink-500/20 via-pink-400/10 to-pink-500/5', text: 'text-pink-600' };
    if (t.includes('wed') || t.includes('anniver') || t.includes('couple')) return { icon: HeartHandshake, colors: 'from-rose-500/20 via-red-400/10 to-rose-500/5', text: 'text-rose-600' };
    if (t.includes('party') || t.includes('celebrat') || t.includes('fest')) return { icon: PartyPopper, colors: 'from-purple-500/20 via-fuchsia-400/10 to-purple-500/5', text: 'text-purple-600' };
    if (t.includes('work') || t.includes('corpor') || t.includes('meet') || t.includes('business')) return { icon: Briefcase, colors: 'from-blue-500/20 via-indigo-400/10 to-blue-500/5', text: 'text-blue-600' };
    if (t.includes('music') || t.includes('concert') || t.includes('dj')) return { icon: Music, colors: 'from-emerald-500/20 via-teal-400/10 to-emerald-500/5', text: 'text-emerald-600' };
    return { icon: PartyPopper, colors: 'from-[#D2B48C]/20 via-[#D2B48C]/10 to-[#D2B48C]/5', text: 'text-[#6F4E37]' }; 
  };

  const placeholder = getEventPlaceholder(event.event_type);
  const Icon = placeholder.icon;

  const parsedInclusions = (() => {
    let inc = event.inclusions;
    if (typeof inc === 'string') {
      try { inc = JSON.parse(inc); } catch (e) { inc = {}; }
    }
    return inc || {};
  })();

  const foodItems = parsedInclusions.food_items || event.food_items || [];
  const cakeItems = parsedInclusions.cake_items || event.cake_items || [];
  const decorationItems = parsedInclusions.decoration_items || event.decoration_items || [];
  const musicItems = parsedInclusions.music_items || event.music_items || [];
  const otherItems = parsedInclusions.other_items || event.other_items || [];

  const isFood = event.food !== undefined ? Boolean(event.food) : Boolean(parsedInclusions.food);
  const isCake = event.cake !== undefined ? Boolean(event.cake) : Boolean(parsedInclusions.cake);
  const isDecor = event.decoration !== undefined ? Boolean(event.decoration) : Boolean(parsedInclusions.decoration);
  const isMusic = event.music !== undefined ? Boolean(event.music) : Boolean(parsedInclusions.music);
  const isOther = event.other !== undefined ? Boolean(event.other) : Boolean(parsedInclusions.other);
  const realCalculatedPrice = (() => {
    let sum = 0;
    const catKeys = ['food_items', 'cake_items', 'decoration_items', 'music_items', 'other_items'];
    catKeys.forEach(key => {
      const items = parsedInclusions[key] || event[key] || [];
      if (Array.isArray(items)) {
        items.forEach(i => {
          if (i && typeof i === 'object') {
            const p = Number(i.price || i.unitPrice || i.unit_price || i.basic_price || 0);
            sum += p;
          }
        });
      }
    });
    if (sum === 0 && Array.isArray(event.inclusions)) {
      event.inclusions.forEach(inc => {
        if (inc && typeof inc === 'object') {
          const p = Number(inc.basic_price || inc.unit_price || inc.price || 0);
          sum += p;
        }
      });
    }
    return sum;
  })();

  const basePrice = Number(event.price ?? event.base_price ?? 0);
  // Display maximum of basePrice or sum of inclusions so real package value is shown accurately
  const displayPrice = realCalculatedPrice > basePrice ? realCalculatedPrice : (basePrice > 0 ? basePrice : realCalculatedPrice);


  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300 group flex flex-col h-full font-sans">
      <div className="h-48 relative overflow-hidden bg-stone-100">
        {cover_image ? (
          <img 
            src={cover_image} 
            alt={package_name || event.event_type} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${placeholder.colors} flex flex-col items-center justify-center`}>
            <div className={`p-4 rounded-2xl bg-white/80 backdrop-blur-md mb-2 shadow-sm ${placeholder.text}`}>
              <Icon className="w-8 h-8" />
            </div>
            <span className={`font-black text-xs uppercase tracking-widest ${placeholder.text}`}>{event.event_type || 'Event Package'}</span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1 bg-white">
        <h3 className="text-base sm:text-lg font-black text-[#2C1810] truncate mb-1">{package_name}</h3>
        
        <p className="text-xs text-stone-500 line-clamp-2 mb-4 flex-1 font-medium leading-relaxed">
          {description || 'Enjoy a meticulously curated event package tailored for your special moments.'}
        </p>

        {/* Inclusions Tags */}
        <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold uppercase tracking-wider mb-4">
          {isFood && <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200/60">Food Incl.</span>}
          {isCake && <span className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg border border-pink-200/60">Cake</span>}
          {isDecor && <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200/60">Decor</span>}
          {isMusic && <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200/60">Music Setup</span>}
          {isOther && <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200/60">Other Services</span>}
        </div>
        
        {/* Specs */}
        <div className="flex items-center justify-between text-xs text-stone-600 mb-4 pt-3.5 border-t border-stone-100">
          <div className="flex items-center font-bold">
             <Users className="w-4 h-4 mr-1.5 text-[#6F4E37] shrink-0" />
             <span>{minimum_persons || 1} - {maximum_persons || 50} guests</span>
          </div>
          <div className="flex items-center font-bold">
             <Clock className="w-4 h-4 mr-1.5 text-[#6F4E37] shrink-0" />
             <span>{duration_hours ? `${duration_hours} hrs` : 'Flexible'}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-2">
          <Link href={`/events/${id}?cafeId=${cafeId}`}>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </motion.button>
          </Link>
        </div>

      </div>
    </div>
  );
}
