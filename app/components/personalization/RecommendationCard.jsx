import { motion } from 'framer-motion';
import { Star, MapPin, Sparkles, Navigation } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RecommendationCard({ item }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-[#E8DED5] flex flex-col h-full"
    >
      <Link href={`/cafes/${item.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Recommendation Reason Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F0]/95 backdrop-blur-md rounded-lg text-xs font-bold text-[#6F4E37] shadow-sm border border-[#DDB892]/30">
          <Sparkles size={12} className="text-[#F59E0B]" />
          {item.reason}
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
        <h3 className="font-bold text-[#2C1810] leading-tight mb-2 line-clamp-1">{item.name}</h3>
        
        <div className="flex items-center text-xs text-gray-500 mb-4 gap-3">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            {item.distance}
          </div>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Est. Price</div>
            <div className="font-bold text-[#2C1810]">{item.price}</div>
          </div>
          <Link 
            href={`/customer/cafe/${item.id}`}
            className="px-4 py-2 bg-[#6F4E37] text-white text-xs font-bold rounded-lg hover:bg-[#5A3E2B] transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
