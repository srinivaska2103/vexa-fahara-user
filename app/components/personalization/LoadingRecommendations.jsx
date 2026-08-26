import { motion } from 'framer-motion';

export default function LoadingRecommendations({ count = 4, type = 'card' }) {
  return (
    <div className="flex overflow-hidden gap-4 md:gap-6 py-6">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="w-[280px] md:w-[320px] flex-shrink-0 bg-white rounded-2xl border border-[#E8DED5] overflow-hidden"
        >
          {/* Image skeleton */}
          <motion.div 
            className="w-full aspect-[4/3] bg-gray-200"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
          <div className="p-4 space-y-4">
            <motion.div 
              className="h-4 bg-gray-200 rounded w-3/4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
            <motion.div 
              className="h-3 bg-gray-200 rounded w-1/2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <motion.div 
                className="h-8 bg-gray-200 rounded w-1/3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
              <motion.div 
                className="h-8 bg-gray-200 rounded-lg w-1/3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
