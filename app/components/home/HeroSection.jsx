'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, MapPin, Sparkles, ArrowRight, Cake, Briefcase, Heart, PartyPopper, Music, Users2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ModernDatePicker from '@/app/components/common/ModernDatePicker';
import ModernDropdown from '@/app/components/common/ModernDropdown';

const eventPills = [
  { label: 'Birthday', icon: Cake, category: 'birthday' },
  { label: 'Corporate Meeting', icon: Briefcase, category: 'corporate' },
  { label: 'Date Night', icon: Heart, category: 'date-night' },
  { label: 'Party', icon: PartyPopper, category: 'party' },
  { label: 'Music', icon: Music, category: 'music' },
  { label: 'Family Gathering', icon: Users2, category: 'family' },
];

export default function HeroSection({ onCategorySelect, activeCategory }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/cafes?search=${encodeURIComponent(searchQuery)}&date=${selectedDate}&guests=${guestsCount}`);
  };

  return (
    <section className="relative min-h-[85vh] lg:min-h-[720px] w-full flex items-center justify-center overflow-hidden bg-[#6F4E37] text-white py-16 lg:py-24">
      {/* Background Image / Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" 
          alt="Fahara Hero Cafe" 
          className="w-full h-full object-cover opacity-25 scale-105 transform transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-[#4A2C11]/80 to-[#6F4E37]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Floating Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#DDB892] text-xs font-black tracking-wider uppercase mb-6 shadow-inner"
        >
          <Sparkles size={14} className="text-amber-400 animate-pulse" />
          <span>Fahara Cafe & Event Booking Marketplace</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-[1.1] max-w-5xl"
        >
          Find the Perfect Cafe <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#FFF8F0] via-[#DDB892] to-amber-200 bg-clip-text text-transparent">
            for Your Moment
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-[#FFF8F0]/90 mb-10 max-w-2xl font-medium leading-relaxed"
        >
          Discover cafes for meetups, birthdays, meetings, celebrations, and private events.
        </motion.p>

        {/* Large Interactive Search Panel */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-5xl bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl sm:rounded-[32px] shadow-[0_20px_50px_rgba(44,24,16,0.3)] border border-white/40 flex flex-col md:flex-row items-center gap-2 text-[#2C1810] mb-8"
        >
          {/* Search Cafe / Location Input */}
          <div className="flex-1 flex items-center px-4 py-3 w-full border-b md:border-b-0 md:border-r border-stone-200/80 group">
            <Search className="text-[#6F4E37] mr-3 shrink-0 transition-transform group-focus-within:scale-110" size={20} />
            <div className="flex flex-col text-left w-full">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Search Cafe or Location</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where to? (e.g. Bandra, Rooftop, Birthday)" 
                className="w-full outline-none text-xs sm:text-sm font-extrabold text-[#2C1810] bg-transparent placeholder:text-stone-400"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Date Picker Input */}
          <div className="flex-1 flex items-center px-2 py-1 w-full border-b md:border-b-0 md:border-r border-stone-200/80 group">
            <div className="flex flex-col text-left w-full">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Date</label>
              <ModernDatePicker 
                value={selectedDate}
                onChange={(d) => setSelectedDate(d)}
                placeholder="Select Date"
                minYear={new Date().getFullYear()}
                maxYear={new Date().getFullYear() + 2}
              />
            </div>
          </div>

          {/* Number of Guests */}
          <div className="flex-1 flex items-center px-2 py-1 w-full border-b md:border-b-0 border-stone-200/80 group">
            <div className="flex flex-col text-left w-full">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-1">Guests</label>
              <ModernDropdown 
                value={guestsCount}
                onChange={(val) => setGuestsCount(Number(val))}
                icon={Users}
                options={[
                  { value: 1, label: '1 Guest' },
                  { value: 2, label: '2 Guests' },
                  { value: 4, label: '4 Guests' },
                  { value: 6, label: '6-10 Guests' },
                  { value: 15, label: '15+ Guests (Event)' },
                ]}
              />
            </div>
          </div>

          {/* Search Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] hover:from-[#361f0a] hover:to-[#573d2a] text-white font-black rounded-2xl sm:rounded-[24px] text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#4A2C11]/30 transition-all cursor-pointer shrink-0"
          >
            <span>Search</span>
            <ArrowRight size={18} />
          </motion.button>
        </motion.form>

        {/* Quick Event Category Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex items-center justify-center flex-wrap gap-2 sm:gap-3"
        >
          <span className="text-xs font-black tracking-wider uppercase text-[#DDB892] mr-1 hidden sm:inline">Event Types:</span>
          {eventPills.map((pill) => {
            const Icon = pill.icon;
            const isSelected = activeCategory === pill.category;
            return (
              <button
                key={pill.label}
                onClick={() => onCategorySelect && onCategorySelect(pill.category)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 backdrop-blur-md cursor-pointer ${
                  isSelected 
                    ? "bg-white text-[#2C1810] shadow-md scale-105 ring-2 ring-white/60" 
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-[#6F4E37]" : "text-[#DDB892]"} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
