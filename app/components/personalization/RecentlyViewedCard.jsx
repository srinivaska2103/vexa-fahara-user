import { motion } from 'framer-motion';
import { Clock, Star, MapPin, Navigation } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function RecentlyViewedCard({ item }) {
  const isCafe = item.type === 'cafe';
  const href = isCafe ? `/cafes/${item.id}` : `/events/${item.id}`;
  const timeAgo = formatDistanceToNow(new Date(item.viewedAt), { addSuffix: true });

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group relative bg-white border border-[#E8DED5] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col h-full"
    >
      <Link href={href} className="block aspect-[4/3] relative overflow-hidden">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#2C1810]">
          <Clock size={12} />
          Viewed {timeAgo}
        </div>
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex flex-wrap gap-1.5">
            {item.tags?.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium rounded-full border border-white/20">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white/95 text-[#2C1810] px-2 py-1 rounded-lg shadow-sm">
            <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-xs font-bold">{item.rating}</span>
          </div>
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link href={href} className="hover:text-[var(--color-primary)] transition-colors">
            <h3 className="font-bold text-[#2C1810] leading-tight line-clamp-1">{item.name}</h3>
          </Link>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            {item.distance}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            {isCafe ? 'Cafe' : 'Event Company'}
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-500 text-xs">Starting from</span>
            <div className="font-bold text-[#6F4E37]">{item.price}</div>
          </div>
          <Link 
            href={href}
            className="flex items-center gap-1 text-xs font-semibold text-[#6F4E37] hover:bg-[#FFF8F0] px-3 py-1.5 rounded-lg transition-colors"
          >
            Continue <Navigation size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
