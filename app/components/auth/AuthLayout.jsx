import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#EF5350] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#B71C1C] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl shadow-sm border border-red-100">
              <Image src="/grab-it-logo.png" alt="Grab2GO Logo" width={56} height={56} className="object-contain rounded-xl w-12 h-12" priority />
              <div className="flex flex-col text-left">
                <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight">
                  <span className="text-[#1E1E1E]">Grab</span>
                  <span className="text-[#ED0014]">2GO</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ED0014] mt-1">Cafe &amp; Event Booking</span>
              </div>
            </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black tracking-tight text-[#252525]"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#E50914] font-medium mt-2 text-sm"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
