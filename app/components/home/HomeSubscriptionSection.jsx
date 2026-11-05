'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Coffee, Calendar, Check, ArrowRight, Store } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeSubscriptionSection() {
  const router = useRouter();

  const handleSubscribe = (type) => {
    // Smooth scroll to the Contact / Partner form section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('#contact');
    }
  };

  return (
    <section id="pricing" suppressHydrationWarning className="py-12 sm:py-16 bg-gradient-to-b from-[#FFF5F1] via-[#FFF7F4] to-white relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* UNIFIED CONTAINER MATCHING EXACT REFERENCE IMAGE */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative bg-gradient-to-r from-[#FFF0EB] via-[#FFF4F0] to-[#FFF5F1] rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_-15px_rgba(237,0,20,0.1)] border border-red-100/80 overflow-hidden"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: TITLE, SUBTITLE & 3D STOREFRONT ILLUSTRATION */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="lg:col-span-4 text-left flex flex-col justify-between h-full space-y-6"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12]">
                  <span className="text-[#ED0014]">Subscription Plans</span><br />
                  <span className="text-[#1E1E1E]">For Business Partners</span>
                </h2>
                
                <p className="text-sm sm:text-base font-semibold text-stone-600 mt-3 max-w-sm leading-relaxed">
                  List your cafe, restaurant or event business on Grab2GO and grow your customers.
                </p>
              </div>

              {/* 3D Cafe Storefront Illustration */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full max-w-[240px] aspect-[225/113] pt-2"
              >
                <Image
                  src="/images/storefront-3d.png"
                  alt="Grab2GO Partner Storefront"
                  fill
                  className="object-contain object-left-bottom drop-shadow-md"
                  priority
                  unoptimized
                />
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN: 2 WHITE PRICING CARDS */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              
              {/* CARD 1: CAFES & RESTAURANTS (₹399 / month) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:border-red-200 border border-stone-200/80 flex flex-col justify-between text-left group transition-all duration-300"
              >
                <div>
                  {/* Card Header with Icon */}
                  <div className="flex items-center gap-2.5 text-[#1E1E1E] mb-3">
                    <Coffee className="w-6 h-6 text-[#ED0014] stroke-[2.3]" />
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      Cafes &amp; Restaurants
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-3xl sm:text-4xl font-black text-[#ED0014] tracking-tight">
                      ₹399
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#ED0014]/90">
                      / month
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm font-semibold text-stone-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>List your business on Grab2GO</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>Manage menu &amp; bookings</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>Get more customers</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>Analytics &amp; reports</span>
                    </li>
                  </ul>
                </div>

                {/* Subscribe Button */}
                <button
                  type="button"
                  onClick={() => handleSubscribe('CAFE')}
                  className="w-full py-3.5 px-6 rounded-full bg-[#ED0014] hover:bg-[#B80012] text-white font-black text-sm shadow-md shadow-[#ED0014]/25 hover:shadow-lg hover:shadow-[#ED0014]/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </motion.div>

              {/* CARD 2: EVENT MANAGERS (₹299 / month) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_12px_35px_-10px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:border-red-200 border border-stone-200/80 flex flex-col justify-between text-left group transition-all duration-300"
              >
                <div>
                  {/* Card Header with Icon */}
                  <div className="flex items-center gap-2.5 text-[#1E1E1E] mb-3">
                    <Calendar className="w-6 h-6 text-[#ED0014] stroke-[2.3]" />
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      Event Managers
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-3xl sm:text-4xl font-black text-[#ED0014] tracking-tight">
                      ₹299
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#ED0014]/90">
                      / month
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8 text-xs sm:text-sm font-semibold text-stone-700">
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>List your event services &amp; packages</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>Receive event enquiries &amp; bookings</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>Manage events &amp; schedules</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                      <span>Grow your business locally</span>
                    </li>
                  </ul>
                </div>

                {/* Subscribe Button */}
                <button
                  type="button"
                  onClick={() => handleSubscribe('EVENT')}
                  className="w-full py-3.5 px-6 rounded-full bg-[#ED0014] hover:bg-[#B80012] text-white font-black text-sm shadow-md shadow-[#ED0014]/25 hover:shadow-lg hover:shadow-[#ED0014]/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Subscribe Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </motion.div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

