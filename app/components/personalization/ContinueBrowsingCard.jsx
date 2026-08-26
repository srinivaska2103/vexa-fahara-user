import { motion } from 'framer-motion';
import { PlayCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContinueBrowsingCard({ item }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] transition-all cursor-pointer group"
    >
      <div className="md:w-1/3 relative aspect-video md:aspect-auto overflow-hidden">
        <Image 
          src={item.image} 
          alt={item.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 hover:scale-110 hover:bg-white/30 transition-all">
            <PlayCircle size={28} className="text-white fill-white/20" />
          </div>
        </div>
        
        {/* Progress bar simulation for Netflix style */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30 backdrop-blur-sm">
          <div className="h-full bg-[var(--color-primary)] w-[65%]" />
        </div>
      </div>
      
      <div className="p-5 md:p-6 md:w-2/3 flex flex-col justify-center">
        <div className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5">
          Continue Booking
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-5 line-clamp-2 font-medium">
          You left your booking incomplete. Resume where you left off and secure your reservation before it sells out!
        </p>
        
        <div className="flex items-center gap-4">
          <Link 
            href={`/customer/booking/${item.id}`}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            Resume Booking
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
            <Clock size={14} />
            Started 2 hours ago
          </div>
        </div>
      </div>
    </motion.div>
  );
}
