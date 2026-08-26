'use client';

import { motion } from 'framer-motion';
import { Cake, Briefcase, Heart, PartyPopper, Music, Users2, Camera, Sparkles, Coffee, Utensils, GlassWater } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Spaces', icon: Sparkles, color: 'from-[#6F4E37] to-[#A67B5B] text-white' },
  { id: 'Coffee Shop', name: 'Coffee Shop', icon: Coffee, color: 'from-amber-700 to-amber-900 text-white' },
  { id: 'Party Hall', name: 'Party Hall', icon: PartyPopper, color: 'from-purple-600 to-indigo-600 text-white' },
  { id: 'Bakery & Cafe', name: 'Bakery & Cafe', icon: Utensils, color: 'from-pink-500 to-rose-500 text-white' },
  { id: 'Bistro', name: 'Bistro', icon: GlassWater, color: 'from-teal-600 to-cyan-600 text-white' },
  { id: 'Co-working Cafe', name: 'Co-working Cafe', icon: Briefcase, color: 'from-blue-600 to-indigo-600 text-white' },
  { id: 'birthday', name: 'Birthday', icon: Cake, color: 'from-rose-500 to-pink-600 text-white' },
  { id: 'date-night', name: 'Date Night', icon: Heart, color: 'from-red-500 to-pink-600 text-white' },
];

export default function CategoryGrid({ activeCategory, onSelectCategory }) {
  return (
    <section className="py-12 lg:py-16 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-black text-[#6F4E37] uppercase tracking-widest bg-[#DDB892]/20 px-3 py-1 rounded-full border border-[#DDB892]/30 inline-block mb-1.5">
              Occasions & Themes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
              Categories
            </h2>
          </div>
          
          <button 
            onClick={() => onSelectCategory && onSelectCategory('all')}
            className="text-xs font-black text-[#6F4E37] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>See all</span>
          </button>
        </div>
        
        {/* Modern Interactive Category Filter Cards */}
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 overflow-x-auto pb-4 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className={`min-w-[110px] sm:min-w-0 flex flex-col items-center justify-center p-4 rounded-3xl cursor-pointer transition-all duration-300 border text-center shrink-0 ${
                  isSelected
                    ? "bg-[#6F4E37] border-[#4A2C11] text-white shadow-xl shadow-[#6F4E37]/20 scale-105"
                    : "bg-white hover:bg-[#FFF8F0] border-stone-200/90 text-[#2C1810] shadow-xs hover:border-[#DDB892]"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected 
                    ? 'bg-white/15 text-white' 
                    : `bg-gradient-to-br ${cat.color} shadow-sm`
                }`}>
                  <Icon size={24} />
                </div>
                <span className={`text-xs font-black tracking-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-[#2C1810]'}`}>
                  {cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
