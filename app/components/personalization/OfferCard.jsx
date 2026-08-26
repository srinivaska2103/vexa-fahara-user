import { motion } from 'framer-motion';
import { Gift, Clock, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function OfferCard({ offer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBirthday = offer.type === 'birthday';

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl p-6 ${
        isBirthday 
          ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white' 
          : 'bg-gradient-to-br from-[#6F4E37] to-[#8C6246] text-white'
      } shadow-lg`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Gift size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
            <Gift size={20} className="text-white" />
          </div>
          <span className="font-bold tracking-wide uppercase text-sm">{offer.title}</span>
        </div>
        
        <p className="text-white/90 text-sm mb-6 leading-relaxed max-w-[85%]">
          {offer.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="font-mono font-bold tracking-widest text-lg">
              {offer.code}
            </div>
            <button 
              onClick={handleCopy}
              className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              {copied ? <><Check size={14} className="text-green-600"/> Copied</> : <><Copy size={14}/> Copy Code</>}
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-white/70 font-medium">
            <Clock size={12} />
            Expires in {offer.expiresIn}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
