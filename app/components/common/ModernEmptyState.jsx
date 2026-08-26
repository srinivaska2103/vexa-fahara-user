'use client';

import { motion } from 'framer-motion';
import { 
  Coffee, Sparkles, RefreshCw, Cake, Briefcase, 
  Heart, PartyPopper, Music, Users2, Camera, ArrowRight, SearchX 
} from 'lucide-react';

export default function ModernEmptyState({
  title = "No Cafes Found",
  category = "",
  query = "",
  message = "We couldn't find any cafe spaces matching your search criteria. Try clearing your filters or explore popular categories below!",
  onReset = null,
  onSelectCategory = null
}) {
  const quickCategories = [
    { id: '', label: 'All Spaces', icon: Sparkles },
    { id: 'Birthday Party', label: 'Birthday', icon: Cake },
    { id: 'Corporate', label: 'Corporate', icon: Briefcase },
    { id: 'Date Night', label: 'Date Night', icon: Heart },
    { id: 'Party', label: 'Party', icon: PartyPopper },
    { id: 'Live Music', label: 'Live Music', icon: Music },
    { id: 'Photoshoot', label: 'Photoshoot', icon: Camera },
  ];

  const displayTitle = category 
    ? `No Cafes Found for "${category}"`
    : query 
    ? `No Cafes Found for "${query}"`
    : title;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', damping: 25, stiffness: 260 }}
      className="w-full bg-gradient-to-b from-white/95 via-[#FFF8F0]/90 to-[#F5EBE0]/80 backdrop-blur-2xl rounded-3xl border border-[#DDB892]/50 shadow-[0_16px_50px_rgba(74,44,17,0.08)] p-8 sm:p-14 flex flex-col items-center justify-center text-center relative overflow-hidden select-none my-4"
    >
      
      {/* Ambient Pulsing Glow Background */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#DDB892]/30 via-[#A67B5B]/20 to-amber-200/40 blur-3xl pointer-events-none"
      />

      {/* Central Animated Icon Container with Orbiting Ring */}
      <div className="relative mb-6 z-10">
        
        {/* Orbiting Rotating Dashed Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 rounded-full border-2 border-dashed border-[#6F4E37]/35 pointer-events-none"
        />

        {/* Pulsing Glow Ring */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-2 rounded-3xl bg-[#6F4E37]/15 blur-xs"
        />

        {/* Logo/Icon Card Container */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white p-3 rounded-3xl border-2 border-[#DDB892]/60 shadow-xl flex items-center justify-center text-[#6F4E37]"
        >
          {category ? <SearchX size={40} className="text-[#6F4E37]" /> : <Coffee size={40} className="text-[#6F4E37]" />}

          {/* Floating Sparkle Badge */}
          <motion.div 
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-[#6F4E37] to-[#4A2C11] text-white p-1.5 rounded-full shadow-md border border-white"
          >
            <Sparkles size={13} />
          </motion.div>
        </motion.div>

      </div>

      {/* Content Badges & Text */}
      <div className="z-10 space-y-2 max-w-lg">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-[#6F4E37] uppercase tracking-widest bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DDB892]/50 shadow-2xs">
          <Sparkles size={12} className="text-amber-500" />
          <span>0 MATCHING RESULTS</span>
        </span>

        <h3 className="text-xl sm:text-3xl font-black text-[#2C1810] tracking-tight leading-tight pt-1">
          {displayTitle}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed max-w-md mx-auto">
          {message}
        </p>
      </div>

      {/* Interactive Quick Category Pills inside Empty State */}
      {onSelectCategory && (
        <div className="z-10 w-full max-w-xl mt-6 pt-5 border-t border-[#DDB892]/30">
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-500 mb-3">
            Try Exploring Popular Categories:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;

              return (
                <motion.button
                  key={cat.label}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#6F4E37] text-white shadow-md border border-[#4A2C11]' 
                      : 'bg-white hover:bg-[#FFF8F0] text-[#2C1810] border border-stone-200/90 shadow-2xs hover:border-[#DDB892]'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-white' : 'text-[#6F4E37]'} />
                  <span>{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="z-10 flex flex-col sm:flex-row items-center gap-3 mt-7">
        {onReset && (
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#4A2C11] to-[#6F4E37] text-white font-black rounded-2xl shadow-lg shadow-[#4A2C11]/25 hover:shadow-xl hover:shadow-[#4A2C11]/30 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs sm:text-sm cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>Reset All Filters</span>
          </motion.button>
        )}
      </div>

    </motion.div>
  );
}
