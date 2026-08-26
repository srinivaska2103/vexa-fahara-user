import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/auth.store';

export default function PersonalizedBanner() {
  const { user } = useAuthStore();
  
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#2C1810] text-white p-8 md:p-12">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80"
          alt="Atmosphere"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810] via-[#2C1810]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[#DDB892] font-medium tracking-wide uppercase text-sm mb-4"
        >
          <Sparkles size={16} />
          <span>Curated for you</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black mb-4 leading-tight"
        >
          {greeting}, {user?.name || 'Guest'}!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-lg md:text-xl max-w-lg mb-8 leading-relaxed"
        >
          We've found some incredible new cafes and experiences that perfectly match your taste for acoustic music and cozy corners.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mt-6"
        >
          <button className="px-8 py-3 bg-white text-[#2C1810] font-black rounded-xl hover:scale-105 active:scale-95 shadow-lg transition-all hover:shadow-xl">
            Explore Top Picks
          </button>
          <button className="px-8 py-3 bg-[var(--color-primary)] text-white font-black rounded-xl hover:scale-105 active:scale-95 shadow-lg transition-all hover:bg-orange-800">
            View Trending
          </button>
        </motion.div>
      </div>
    </div>
  );
}
