import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2, Sparkles, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function ILoveFaharaBadge() {
  const [likes, setLikes] = useState(1284);
  const [isLiked, setIsLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);

  const handleLoveClick = () => {
    setLikes((prev) => prev + (isLiked ? -1 : 1));
    setIsLiked(!isLiked);

    // Spawn floating heart particle animation
    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 60 - 30,
    };
    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1100);
  };

  return (
    <div className="relative inline-flex flex-col items-center mt-1">
      {/* Floating Animated Hearts */}
      <div className="absolute -top-10 inset-x-0 flex justify-center pointer-events-none z-20">
        <AnimatePresence>
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 1, y: 0, scale: 0.8, x: heart.x }}
              animate={{ opacity: 0, y: -45, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute text-rose-500"
            >
              <Heart size={20} className="fill-rose-500 text-rose-500 drop-shadow-md" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Interactive Pill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLoveClick}
        className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 shadow-md cursor-pointer select-none ${
          isLiked
            ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white border-rose-500 shadow-rose-500/25 ring-2 ring-rose-400/30'
            : 'bg-white hover:bg-[#FFF8F0] border-stone-200 hover:border-rose-300 text-[#2C1810] hover:text-rose-600 shadow-stone-200/50'
        }`}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart 
            size={16} 
            className={`transition-all duration-300 ${
              isLiked 
                ? 'fill-white text-white' 
                : 'text-rose-500 group-hover:scale-110 fill-rose-100 group-hover:fill-rose-500'
            }`} 
          />
        </motion.div>
        <span className="text-xs font-black tracking-wide">
          I Love Fahara
        </span>
      </motion.button>
    </div>
  );
}

export default function InfiniteScroll({ hasNextPage, fetchNextPage, isFetchingNextPage }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={ref} className="w-full flex justify-center py-4 sm:py-6 px-2 sm:px-4 overflow-hidden">
      {isFetchingNextPage ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 border border-[#DDB892]/40 shadow-sm text-[#6F4E37] text-xs font-black"
        >
          <Loader2 className="animate-spin text-[#6F4E37]" size={16} />
          <span>Discovering more spaces...</span>
        </motion.div>
      ) : hasNextPage ? (
        <div className="flex items-center gap-2 text-stone-400 text-xs font-bold bg-stone-100/60 px-3.5 py-1.5 rounded-full border border-stone-200/50">
          <Sparkles size={12} className="text-amber-500" />
          <span>Scroll down to explore more</span>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center py-4 sm:py-6 px-2 sm:px-4 my-2 sm:my-4 bg-transparent relative"
        >
          {/* BOY FINDING CAFES BANNER ILLUSTRATION - BORDERLESS & MOBILE RESPONSIVE */}
          <div className="w-full shrink-0 max-w-[92vw] xs:max-w-[440px] sm:max-w-[550px]">
            <img 
              src="/coming_soon_banner.png" 
              alt="More Cafes Coming Soon to Fahara" 
              className="w-full h-auto object-contain pointer-events-none drop-shadow-sm"
            />
          </div>

          {/* OPTIONAL CTA BUTTON */}
          <div className="-mt-1 sm:-mt-4 relative z-10">
            <Link href="/customer/events">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 h-9 sm:h-11 px-5 sm:px-7 rounded-full bg-[#6F4E37] hover:bg-[#5A3215] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <span>Explore Events</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}

