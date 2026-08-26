import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div ref={ref} className="w-full flex justify-center py-8 px-4 mt-6">
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] border border-[#DDB892]/60 shadow-xs text-[#4A2C11] text-xs font-black tracking-wide"
        >
          <CheckCircle2 size={15} className="text-[#6F4E37]" />
          <span>You&apos;ve explored all available cafes</span>
        </motion.div>
      )}
    </div>
  );
}
