'use client';

import { 
  Users, Building, ChevronDown, ChevronUp, CheckCircle, Clock, 
  Sparkles, Copy, Check, Coffee, HeartHandshake, UtensilsCrossed, ShieldCheck 
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CafeInfo({ cafe }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { description, maximum_persons, name, users } = cafe || {};

  // Clean and format description
  const fullDescription = (description || `Welcome to ${name || 'our cafe'}! Discover this venue for your next event or gathering.`).trim();

  // Extract Break Time if present in description
  const breakTimeMatch = fullDescription.match(/break\s*time\s*:\s*([^.\n]+)/i);
  const breakTimeText = breakTimeMatch ? breakTimeMatch[1].trim() : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldTruncate = fullDescription.length > 200;

  return (
    <div className="mb-8 font-sans antialiased">
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6F4E37] animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">About this space</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-stone-700 mt-3">
              {maximum_persons && (
                <motion.span 
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-1.5 bg-[#FFF8F0] border border-[#DDB892]/50 text-[#6F4E37] px-3.5 py-1.5 rounded-xl shadow-2xs cursor-default"
                >
                  <Users size={15} /> 
                  <span>Up to {maximum_persons} guests</span>
                </motion.span>
              )}

              <motion.span 
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-1.5 bg-stone-100/90 text-stone-700 border border-stone-200/60 px-3.5 py-1.5 rounded-xl max-w-full shadow-2xs cursor-default"
              >
                <Building size={15} className="text-[#6F4E37] shrink-0" /> 
                <span className="truncate">Hosted by {users?.name || name || 'Fahara Partner'}</span>
              </motion.span>

              {(() => {
                const categoryStr = `${cafe?.category || ''} ${cafe?.service_type || ''} ${cafe?.name || ''}`.toLowerCase();
                const isRestaurant = categoryStr.includes('restaur') || categoryStr.includes('restur');
                return !isRestaurant && cafe?.allow_third_party_decoration === true && (
                  <motion.span 
                    whileHover={{ scale: 1.04 }}
                    className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-2xs cursor-default"
                  >
                    <CheckCircle size={15} className="text-emerald-600 shrink-0" /> 
                    <span>3rd Party Event Decoration Allowed</span>
                  </motion.span>
                );
              })()}
            </div>
          </div>

          {/* Quick Copy Action */}
          <button
            onClick={handleCopy}
            className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#FFF8F0] text-stone-600 hover:text-[#6F4E37] border border-stone-200/80 hover:border-[#DDB892]/60 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 shadow-2xs"
            title="Copy venue description"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Info'}</span>
          </button>
        </div>

        {/* Break Time Highlight Notice Pill (If extracted from description) */}
        {breakTimeText && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-300/60 flex items-center gap-2.5 text-xs font-bold text-amber-900">
            <Clock size={16} className="text-amber-700 shrink-0" />
            <span><strong className="font-extrabold text-amber-950">Break Hours:</strong> {breakTimeText}</span>
          </div>
        )}

        {/* Interactive Description Canvas with Smooth Motion Expansion */}
        <div className="relative">
          <motion.div 
            animate={{ height: isExpanded || !shouldTruncate ? 'auto' : 96 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden relative text-stone-700 leading-relaxed text-sm sm:text-base font-medium space-y-3 whitespace-pre-line select-text"
          >
            <p>{fullDescription}</p>
          </motion.div>

          {/* Gradient Overlay Fade when collapsed */}
          {shouldTruncate && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Interactive Read More / Show Less Toggle Button */}
        {shouldTruncate && (
          <div className="mt-2 pt-1 flex items-center justify-start">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#6F4E37] hover:text-[#4A2C11] bg-[#FFF8F0] hover:bg-[#FFF3E6] px-4 py-2 rounded-xl border border-[#DDB892]/60 transition-all cursor-pointer shadow-2xs"
            >
              <span>{isExpanded ? 'Show less' : 'Read full description'}</span>
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </motion.button>
          </div>
        )}

        {/* Interactive STEP-BY-STEP BOOKING GUIDE TIMELINE */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <span className="font-extrabold text-stone-400 text-[10px] uppercase tracking-widest block">
              How Booking Works
            </span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Verified Guarantee
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[#FFF8F0]/90 border border-[#DDB892]/50 p-4 rounded-2xl flex flex-col justify-between space-y-2.5 transition-all shadow-2xs hover:shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-110 transition-transform">1</span>
                <span className="font-black text-xs text-[#2C1810]">Select Date & Slot</span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium leading-relaxed">Choose your date, duration, and guest count from the live booking panel.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[#FFF8F0]/90 border border-[#DDB892]/50 p-4 rounded-2xl flex flex-col justify-between space-y-2.5 transition-all shadow-2xs hover:shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-110 transition-transform">2</span>
                <span className="font-black text-xs text-[#2C1810]">Instant Lock</span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium leading-relaxed">Securely lock your venue slot with zero double-booking guarantee.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-[#FFF8F0]/90 border border-[#DDB892]/50 p-4 rounded-2xl flex flex-col justify-between space-y-2.5 transition-all shadow-2xs hover:shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-110 transition-transform">3</span>
                <span className="font-black text-xs text-[#2C1810]">Arrive & Celebrate</span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium leading-relaxed">Enjoy exclusive access and dedicated service at your reserved space.</p>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
