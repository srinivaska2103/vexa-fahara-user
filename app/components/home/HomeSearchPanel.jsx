'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Tag, ArrowRight, X, ChevronRight, RotateCcw } from 'lucide-react';
import ModernDatePicker from '@/app/components/common/ModernDatePicker';
import ModernDropdown from '@/app/components/common/ModernDropdown';

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
  { id: 'date-night', label: 'Date Night' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'party', label: 'Party' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'family', label: 'Family Gathering' },
  { id: 'photoshoot', label: 'Photoshoot' }
];

export default function HomeSearchPanel() {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);
  const [searchEventType, setSearchEventType] = useState('all');
  const [selectedChip, setSelectedChip] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-30">
      <motion.form 
        onSubmit={handleSearchSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-xl border border-[#E8DED5] text-[#2C1810]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3">
          
          {/* LOCATION FIELD */}
          <div className="flex flex-col text-left w-full min-w-0 relative">
            <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider mb-1">Where</label>
            <div className="relative w-full flex items-center px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-white hover:border-[#6F4E37]/60 focus-within:border-[#6F4E37] focus-within:ring-2 focus-within:ring-[#6F4E37]/20 transition-all shadow-2xs min-h-[44px] group">
              <MapPin size={16} className="text-[#6F4E37] mr-2 shrink-0 group-hover:scale-110 transition-transform" />
              <input 
                type="text"
                value={searchLocation}
                onFocus={() => setShowLocationDropdown(true)}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="e.g. Bandra, Indiranagar"
                className="w-full text-xs font-extrabold text-[#2C1810] outline-none bg-transparent placeholder:text-stone-400 truncate"
                suppressHydrationWarning
              />
              {searchLocation && (
                <button 
                  type="button" 
                  onClick={() => setSearchLocation('')} 
                  className="p-1 hover:text-stone-700 text-stone-400 ml-1 shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* LOCATION AUTOCOMPLETE DROPDOWN */}
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
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-[#FFF8F0] hover:text-[#6F4E37] flex items-center justify-between transition-colors min-h-[40px]"
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

          {/* DATE SELECTOR */}
          <div className="flex flex-col text-left w-full min-w-0">
            <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider mb-1">Date</label>
            <ModernDatePicker
              value={searchDate}
              onChange={(d) => setSearchDate(d)}
              placeholder="Select Date"
              minYear={new Date().getFullYear()}
              maxYear={new Date().getFullYear() + 2}
            />
          </div>

          {/* GUESTS SELECTOR */}
          <div className="flex flex-col text-left w-full min-w-0">
            <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider mb-1">Guests</label>
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

          {/* WHAT ARE YOU PLANNING? */}
          <div className="flex flex-col text-left w-full min-w-0">
            <label className="text-[10px] font-black uppercase text-stone-400 block tracking-wider mb-1">What are you planning?</label>
            <ModernDropdown 
              value={searchEventType}
              onChange={(val) => setSearchEventType(val)}
              icon={Tag}
              options={[
                { value: 'all', label: 'All Occasions' },
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

        {/* SEARCH ACTION & CHIPS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] shrink-0 mr-1">Occasions:</span>
            {popularEventChips.map((chip) => {
              const isSelected = selectedChip === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleChipSelect(chip.id, chip.label)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer min-h-[32px] flex items-center ${
                    isSelected 
                      ? 'bg-[#6F4E37] text-white font-black shadow-xs' 
                      : 'bg-[#FFF8F0] hover:bg-[#F5EBE0] text-[#6F4E37] border border-[#DDB892]/40'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button 
              type="button" 
              onClick={handleResetSearch}
              className="text-xs font-extrabold text-stone-400 hover:text-[#6F4E37] flex items-center gap-1 transition-colors px-2 py-1 min-h-[44px]"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button 
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#6F4E37] to-[#4A2C11] hover:from-[#5c402d] hover:to-[#38210d] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer min-h-[46px]"
            >
              <span>Search Places</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
