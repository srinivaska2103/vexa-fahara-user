'use client';

import Link from 'next/link';
import { Users, Clock, PartyPopper, Briefcase, Cake, Music, HeartHandshake, CheckCircle2, IndianRupee } from 'lucide-react';

export default function EventCard({ event, cafeId }) {
  const { id, package_name, description, duration_hours, cover_image, minimum_persons, maximum_persons } = event;

  const getEventPlaceholder = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('birth')) return { icon: Cake, colors: 'from-pink-500/20 via-pink-400/10 to-pink-500/5', text: 'text-pink-600', badgeBg: 'bg-pink-100 text-pink-700' };
    if (t.includes('wed') || t.includes('anniver') || t.includes('couple')) return { icon: HeartHandshake, colors: 'from-rose-500/20 via-red-400/10 to-rose-500/5', text: 'text-rose-600', badgeBg: 'bg-rose-100 text-rose-700' };
    if (t.includes('party') || t.includes('celebrat') || t.includes('fest')) return { icon: PartyPopper, colors: 'from-purple-500/20 via-fuchsia-400/10 to-purple-500/5', text: 'text-purple-600', badgeBg: 'bg-purple-100 text-purple-700' };
    if (t.includes('work') || t.includes('corpor') || t.includes('meet') || t.includes('business')) return { icon: Briefcase, colors: 'from-blue-500/20 via-indigo-400/10 to-blue-500/5', text: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700' };
    if (t.includes('music') || t.includes('concert') || t.includes('dj')) return { icon: Music, colors: 'from-emerald-500/20 via-teal-400/10 to-emerald-500/5', text: 'text-emerald-600', badgeBg: 'bg-emerald-100 text-emerald-700' };
    return { icon: PartyPopper, colors: 'from-[#D2B48C]/20 via-[#D2B48C]/10 to-[#D2B48C]/5', text: 'text-[#6F4E37]', badgeBg: 'bg-[#6F4E37]/10 text-[#6F4E37]' }; 
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

  const inclusionsList = (() => {
    let list = [];
    if (Array.isArray(event.inclusions)) {
      list = event.inclusions.map(inc => {
        if (typeof inc === 'string') return { name: inc };
        const name = inc.name || inc.title || inc.item_name || '';
        const desc = inc.description || '';
        const qty = inc.quantity ? `${inc.quantity} ${inc.unit || ''}`.trim() : '';
        return { name, desc, qty };
      });
    } else if (parsedInclusions && typeof parsedInclusions === 'object') {
      const items = parsedInclusions.items || parsedInclusions.inclusions || [];
      if (Array.isArray(items)) {
        list = items.map(inc => {
          if (typeof inc === 'string') return { name: inc };
          const name = inc.name || inc.title || inc.item_name || '';
          const desc = inc.description || '';
          const qty = inc.quantity ? `${inc.quantity} ${inc.unit || ''}`.trim() : '';
          return { name, desc, qty };
        });
      }
    }

    if (list.length === 0) {
      const catKeys = ['food_items', 'cake_items', 'decoration_items', 'music_items', 'other_items'];
      catKeys.forEach(key => {
        const items = parsedInclusions[key] || event[key] || [];
        if (Array.isArray(items)) {
          items.forEach(i => {
            if (typeof i === 'string') list.push({ name: i });
            else if (i && typeof i === 'object') {
              const name = i.name || i.title || i.item_name || '';
              const desc = i.description || '';
              if (name) list.push({ name, desc });
            }
          });
        }
      });
    }

    return list.filter(i => Boolean(i.name));
  })();

  const basePrice = Number(event.price ?? event.base_price ?? 0);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full font-sans relative">
      {/* Cover / Category Header Banner */}
      <div className="h-44 relative overflow-hidden bg-stone-100">
        {cover_image ? (
          <img 
            src={cover_image} 
            alt={package_name || event.event_type} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${placeholder.colors} flex flex-col items-center justify-center`}>
            <div className={`p-3.5 rounded-2xl bg-white/80 backdrop-blur-md mb-2 shadow-xs ${placeholder.text}`}>
              <Icon className="w-7 h-7" />
            </div>
            <span className={`font-black text-xs uppercase tracking-widest ${placeholder.text}`}>{event.event_type || 'Event Package'}</span>
          </div>
        )}

        {/* Floating Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${placeholder.badgeBg}`}>
            {event.event_type || 'Custom Package'}
          </span>
        </div>

        {/* Floating Price Tag */}
        {basePrice > 0 && (
          <div className="absolute bottom-3 right-3 bg-[#2C1810]/95 text-amber-300 px-3.5 py-1.5 rounded-2xl backdrop-blur-md shadow-md flex items-center gap-0.5 border border-amber-400/30">
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="text-sm font-black tracking-tight">{basePrice.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Package Content & Full Inclusions */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <h3 className="text-lg font-black text-[#2C1810] tracking-tight mb-1.5">{package_name}</h3>
        
        {description && (
          <p className="text-xs text-stone-500 mb-4 font-medium leading-relaxed">
            {description}
          </p>
        )}

        {/* Specs: Guests & Duration */}
        <div className="flex items-center gap-4 text-xs font-extrabold text-[#6F4E37] py-2.5 px-3.5 bg-[#FFF8F0] rounded-2xl border border-[#DDB892]/40 mb-4">
          <div className="flex items-center gap-1.5">
             <Users className="w-4 h-4 shrink-0 text-[#6F4E37]" />
             <span>{minimum_persons || 1} - {maximum_persons || 50} guests</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#6F4E37]/30" />
          <div className="flex items-center gap-1.5">
             <Clock className="w-4 h-4 shrink-0 text-[#6F4E37]" />
             <span>{duration_hours ? `${duration_hours} hrs` : 'Flexible'}</span>
          </div>
        </div>

        {/* Package Inclusions List */}
        <div className="flex-1 space-y-2 mb-2">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-stone-400">Package Inclusions</h4>
          
          {inclusionsList.length > 0 ? (
            <div className="space-y-1.5">
              {inclusionsList.map((inc, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[#2C1810]">{inc.name}</span>
                    {inc.qty && <span className="text-[11px] text-stone-500 ml-1.5 font-normal">({inc.qty})</span>}
                    {inc.desc && <p className="text-[11px] text-stone-400 font-normal leading-tight mt-0.5">{inc.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-stone-400 italic bg-stone-50 p-3 rounded-xl border border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-stone-300 shrink-0" />
              <span>Standard venue & event setup included</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

