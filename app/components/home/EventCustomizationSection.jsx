'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Cake, Camera, Utensils, Music, PartyPopper, Disc, Flower2, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const eventServices = [
  {
    id: 1,
    title: 'Custom Decoration',
    rating: '4.9',
    price: '₹1,499',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
    desc: 'Themed balloons, floral backdrops & custom banner setups.'
  },
  {
    id: 2,
    title: 'Professional Photography',
    rating: '4.8',
    price: '₹2,499',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
    desc: '2 Hours candid coverage with edited high-res digital album.'
  },
  {
    id: 3,
    title: 'Gourmet Catering & Platter',
    rating: '4.9',
    price: '₹999',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80',
    desc: 'Curated artisanal snacks, dessert boards & Mocktail bar.'
  },
  {
    id: 4,
    title: 'Birthday Special Setup',
    rating: '5.0',
    price: '₹1,999',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80',
    desc: 'Sparkler candles, banner, photo wall & party props package.'
  },
  {
    id: 5,
    title: 'Live DJ & Acoustic Music',
    rating: '4.7',
    price: '₹3,500',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80',
    desc: 'Professional sound system & DJ setup tailored for celebrations.'
  },
  {
    id: 6,
    title: 'Fresh Flower Arrangement',
    rating: '4.9',
    price: '₹1,299',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80',
    desc: 'Exotic roses, orchids & table centerpieces arrangement.'
  },
];

const flowSteps = [
  { step: '01', title: 'Choose a Cafe', desc: 'Select a cafe based on location & capacity.' },
  { step: '02', title: 'Select Date & Time', desc: 'Pick your preferred date and duration slot.' },
  { step: '03', title: 'Add Event Arrangements', desc: 'Customize with decor, cake & photography.' },
  { step: '04', title: 'Review Price & Book', desc: 'See transparent costs & pay securely.' },
];

export default function EventCustomizationSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0] border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-[#6F4E37] uppercase tracking-widest bg-[#DDB892]/25 px-4 py-1.5 rounded-full border border-[#DDB892]/40 inline-flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-[#6F4E37]" /> The Fahara Advantage
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] tracking-tight">
            Make Your Cafe Event Complete
          </h2>
          <p className="text-stone-600 text-base sm:text-lg font-medium mt-3">
            Don't just rent a space—add professional decorations, photography, and catering in a single seamless booking.
          </p>
        </div>

        {/* 4-Step Interactive Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {flowSteps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="text-4xl font-black text-[#DDB892]/40 group-hover:text-[#6F4E37]/30 transition-colors mb-3">
                {item.step}
              </div>
              <h3 className="text-lg font-black text-[#2C1810] mb-1">{item.title}</h3>
              <p className="text-xs font-bold text-stone-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Featured Event Services Grid */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div>
            <h3 className="text-2xl font-black text-[#2C1810]">Add-on Event Services</h3>
            <p className="text-xs sm:text-sm font-bold text-stone-500">Handpicked event arrangements delivered right at your cafe venue</p>
          </div>
          <Link href="/events" className="mt-3 sm:mt-0 text-xs font-black text-[#6F4E37] hover:text-[#4A2C11] flex items-center gap-1">
            <span>Explore All Services</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-amber-900 border border-amber-200/80 flex items-center gap-1 shadow-xs">
                  <span>★</span> {service.rating}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h4 className="text-base font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors">{service.title}</h4>
                  <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">{service.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 font-extrabold uppercase tracking-wider block">Starting at</span>
                    <span className="text-lg font-black text-[#2C1810]">{service.price}</span>
                  </div>

                  <Link href="/events">
                    <button className="px-4 py-2 bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#DDB892]/60 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer">
                      View Service
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
