import { motion } from 'framer-motion';
import { Star, CheckCircle2, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RecommendedEventsCard({ company }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-[#E8DED5] flex flex-col h-full relative"
    >
      <div className="absolute top-0 right-0 p-3 z-10 flex justify-end w-full bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-1 bg-white/95 text-[#2C1810] px-2 py-1 rounded-lg shadow-sm">
          <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-xs font-bold">{company.rating}</span>
        </div>
      </div>
      
      <Link href={`/customer/events/${company.id}`} className="block relative aspect-video overflow-hidden">
        <Image 
          src={company.image} 
          alt={company.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </Link>
      
      <div className="p-4 flex flex-col flex-1 relative">
        {/* Floating Logo */}
        <div className="absolute -top-8 left-4 w-12 h-12 bg-white rounded-xl shadow-sm border border-[#E8DED5] overflow-hidden flex items-center justify-center p-1">
           <Image 
            src={company.image} 
            alt="Logo" 
            width={40} height={40} 
            className="rounded-lg object-cover"
          />
        </div>

        <div className="mt-4 mb-2 flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#2C1810] leading-tight line-clamp-1">{company.name}</h3>
          <Award size={16} className="text-[#6F4E37] shrink-0" />
        </div>
        
        <div className="flex flex-col gap-1.5 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#16A34A]"/> 5+ Years Experience</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#16A34A]"/> 12 Custom Packages</span>
        </div>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Starts From</div>
            <div className="font-bold text-[#2C1810]">{company.price}</div>
          </div>
          <Link 
            href={`/customer/events/${company.id}`}
            className="px-4 py-2 bg-[#FFF8F0] text-[#6F4E37] text-xs font-bold rounded-lg hover:bg-[#F3E8DF] transition-colors border border-[#DDB892]"
          >
            View Packages
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
