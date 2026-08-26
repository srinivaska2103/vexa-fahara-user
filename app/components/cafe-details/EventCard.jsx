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
          {event.food && <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200/60">Food Incl.</span>}
          {event.cake && <span className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg border border-pink-200/60">Cake</span>}
          {event.decoration && <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200/60">Decor</span>}
          {event.music && <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200/60">Music Setup</span>}
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

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xl font-black text-[#2C1810]">₹{price || 1999}</span>
            <span className="text-[10px] text-stone-400 font-bold block">Flat Package</span>
          </div>

          <Link href={`/events/${id}?cafeId=${cafeId}`}>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="px-4.5 py-2.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black text-xs rounded-2xl flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg cursor-pointer"
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
