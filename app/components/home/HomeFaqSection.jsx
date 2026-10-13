'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What is Fahara?',
    a: 'Fahara is India\'s premier cafe and event booking platform that connects customers with verified cafes, restaurants, venues and event services.'
  },
  {
    q: 'How does Fahara booking work?',
    a: 'Simply search for your location, select your date, time slot and guest count, compare venue photos and pricing, and complete your instant booking online.'
  },
  {
    q: 'Are venues verified?',
    a: 'Yes! Every cafe, restaurant and venue listed on Fahara is manually inspected for hygiene, seating capacity, safety standards and service quality.'
  },
  {
    q: 'Can I cancel my booking?',
    a: 'Yes. Cancellations made 24 hours prior to your scheduled booking time receive a full, hassle-free refund according to Fahara\'s cancellation policy.'
  },
  {
    q: 'How do I become a Fahara partner?',
    a: 'If you own a cafe, restaurant or event management business, click "Partner With Fahara" or sign up to create your partner account and list your business.'
  },
  {
    q: 'How much does a partner subscription cost?',
    a: 'The Fahara Partner subscription is ₹299/month for eligible Cafes, Restaurants and Event Managers. It includes business profile tools, customer discovery, booking management and analytics where supported.'
  },
  {
    q: 'Can restaurants join Fahara?',
    a: 'Yes! Restaurant owners can build their business profile, get discovered by customers, showcase photos and offers, and manage bookings through Fahara.'
  },
  {
    q: 'Can event managers list their services?',
    a: 'Yes. Event managers can showcase their services, inclusions, packages, pricing and availability to customers looking for professional event management.'
  },
  {
    q: 'How does payment work?',
    a: 'Customers can pay securely online via Razorpay or direct digital payments. Payments are processed with transparent pricing and direct booking confirmation.'
  }
];

export default function HomeFaqSection() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section id="faq" className="py-12 sm:py-20 bg-[#F5EBE0] border-y border-[#DDB892]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-white px-4 py-1.5 rounded-full border border-[#DDB892]/50 inline-block mb-3 shadow-2xs">
            HAVE QUESTIONS?
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C1810]">Frequently Asked Questions</h2>
          <p className="text-stone-600 font-medium text-xs sm:text-base mt-2">
            Everything you need to know about booking and partnering with Fahara.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-5 py-4.5 flex items-center justify-between text-left font-black text-xs sm:text-base text-[#2C1810] hover:text-[#6F4E37] transition-colors cursor-pointer gap-2 min-h-[48px]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`transform transition-transform shrink-0 ${isOpen ? 'rotate-180 text-[#6F4E37]' : 'text-stone-400'}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs sm:text-sm font-medium text-stone-600 leading-relaxed border-t border-stone-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
