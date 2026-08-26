import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import RecommendedEventsCard from './RecommendedEventsCard';

export default function RecommendationCarousel({ title, subtitle, items, type = 'cafe' }) {
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 relative">
      <div className="flex items-end justify-between mb-6 px-4 md:px-0">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#2C1810] tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full border border-[#E8DED5] bg-white text-gray-600 hover:text-[#6F4E37] hover:border-[#6F4E37] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full border border-[#E8DED5] bg-white text-gray-600 hover:text-[#6F4E37] hover:border-[#6F4E37] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-4 md:gap-6 pb-6 px-4 md:px-0 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="w-[280px] md:w-[320px] flex-shrink-0 snap-start"
          >
            {type === 'cafe' ? (
              <RecommendationCard item={item} />
            ) : (
              <RecommendedEventsCard company={item} />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
