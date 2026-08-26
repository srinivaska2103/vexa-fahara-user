'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Coffee, Sparkles, Star, ShieldCheck, Lock, CalendarCheck, 
  ArrowRight, Users, Building2, Heart, CheckCircle2, Award, 
  MapPin, Clock, Compass
} from 'lucide-react';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';
import Footer from '@/app/components/home/Footer';

const featureCards = [
  { 
    id: 'discover', 
    icon: Coffee, 
    title: 'Discover Cafes', 
    desc: 'Find cafes based on location, rating, price per hour, guest capacity and slot availability.' 
  },
  { 
    id: 'events', 
    icon: Sparkles, 
    title: 'Event Arrangements', 
    desc: 'Add decoration, photography, artisanal catering, DJ setups and cakes to your venue reservation.' 
  },
  { 
    id: 'reviews', 
    icon: Star, 
    title: 'Real Reviews', 
    desc: 'Explore genuine customer ratings, verified photos and authentic experiences before booking.' 
  },
  { 
    id: 'pricing', 
    icon: ShieldCheck, 
    title: 'Transparent Pricing', 
    desc: 'Clearly view hourly cafe charges, event add-ons, Fahara platform fee and GST before payment.' 
  },
  { 
    id: 'secure', 
    icon: Lock, 
    title: 'Secure Booking', 
    desc: 'Enjoy a simple, encrypted and secure booking process powered by certified gateways.' 
  },
  { 
    id: 'management', 
    icon: CalendarCheck, 
    title: 'Easy Management', 
    desc: 'Manage bookings, cancellations, rescheduling, invoices and reviews from one dashboard.' 
  },
];

const timelineSteps = [
  { step: '01', title: 'Discover', desc: 'Find a cafe that matches your event or gathering needs.' },
  { step: '02', title: 'Choose', desc: 'Select your date, preferred duration slot, and guest count.' },
  { step: '03', title: 'Customize', desc: 'Add optional decor, catering, and event arrangements.' },
  { step: '04', title: 'Book', desc: 'Review the itemized price breakdown and complete payment.' },
];

const ecosystemParticipants = [
  {
    id: 'customers',
    title: 'Customers',
    subtitle: 'For Celebrators & Gatherers',
    desc: 'Discover and book cafes and event experiences seamlessly for birthdays, meetups, dates, and parties.',
    cta: 'Explore Cafes',
    href: '/customer/cafe',
    icon: Users,
    color: 'from-[#6F4E37] to-[#4A2C11]'
  },
  {
    id: 'owners',
    title: 'Cafe Owners',
    subtitle: 'For Venue Hosts',
    desc: 'List your cafe, set hourly slot pricing, monetize off-peak hours, and grow your venue revenue.',
    cta: 'List Your Cafe',
    href: 'http://localhost:3001',
    external: true,
    icon: Building2,
    color: 'from-[#4A2C11] to-[#2C1810]'
  },
  {
    id: 'partners',
    title: 'Event Partners',
    subtitle: 'For Service Professionals',
    desc: 'Offer event services like decor, photography, and catering directly inside cafe checkout flows.',
    cta: 'Become an Event Partner',
    href: 'http://localhost:3001',
    external: true,
    icon: Sparkles,
    color: 'from-[#A67B5B] to-[#6F4E37]'
  },
];

const whyFaharaPillars = [
  { title: 'Convenience', desc: 'Book venue space and event arrangements in one single checkout.' },
  { title: 'Choice', desc: 'Curated selection of verified cafes, private lounges, and rooftop spaces.' },
  { title: 'Transparency', desc: 'Zero hidden fees with clear breakdowns of fees, taxes, and platform charges.' },
  { title: 'Trust', desc: 'Instant confirmations, verified reviews, and secure payment processing.' },
  { title: 'Better Experiences', desc: 'Everything prepared and waiting when you arrive at your reserved cafe.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans antialiased text-[#2C1810] selection:bg-[#6F4E37] selection:text-white flex flex-col justify-between">
      <div>
        {/* Sticky Customer Header Navbar */}
        <CustomerNavbar showSearch={true} showViewToggles={false} />

        {/* ==================== 1. HERO SECTION ==================== */}
        <section className="relative bg-[#6F4E37] text-white py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" 
              alt="Fahara About Banner" 
              className="w-full h-full object-cover opacity-20 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2C1810]/95 via-[#4A2C11]/90 to-[#6F4E37]/95" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#DDB892] text-xs font-black uppercase tracking-wider mb-4"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>About Fahara • Cafe & Event Booking</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 leading-tight max-w-4xl"
            >
              Discover. Celebrate. Book with Fahara.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-[#FFF8F0]/90 max-w-3xl font-medium mb-8 leading-relaxed"
            >
              Fahara makes it simple to discover the right cafe, customize your experience with event services, and book everything in one place.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link 
                href="/customer/cafe"
                className="w-full sm:w-auto px-8 py-4 bg-white text-[#2C1810] font-black rounded-2xl shadow-xl hover:bg-[#FFF8F0] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Explore Cafes</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/events"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border border-white/20 backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Explore Event Services</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ==================== 2. OUR STORY ==================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37] bg-[#DDB892]/25 px-4 py-1.5 rounded-full border border-[#DDB892]/40 inline-block">
                Our Purpose
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] leading-tight">
                Created to make finding and booking spaces for meaningful moments easier.
              </h2>
              <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
                Planning a cafe meetup or a private celebration used to require countless phone calls, price negotiations, and separate vendor coordination. Fahara brings everything together into a unified marketplace.
              </p>
              <p className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed">
                Whether you need a cozy spot for a date night, a rooftop venue for a 25th birthday party, or a quiet lounge for a corporate workshop, Fahara empowers you to compare cafes, read authentic reviews, add themed arrangements, view transparent pricing, and secure your booking instantly.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80" 
                alt="Fahara Cafe Ambience" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-between">
                <div>
                  <span className="font-black text-sm text-[#2C1810] block">Seamless Experience</span>
                  <span className="text-xs text-stone-500 font-bold">Venue + Event Services in 1 Checkout</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#6F4E37] text-white">
                  <Award size={20} />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==================== 3. WHAT FAHARA OFFERS ==================== */}
        <section className="py-20 bg-[#F5EBE0] border-y border-[#DDB892]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Core Features</span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] mt-1">What Fahara Offers</h2>
              <p className="text-stone-600 font-bold text-sm mt-2">Designed from the ground up for clarity, convenience, and trust.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((feat) => {
                const Icon = feat.icon;
                return (
                  <motion.div 
                    key={feat.id}
                    whileHover={{ y: -6 }}
                    className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center mb-5">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-black text-lg text-[#2C1810] mb-2">{feat.title}</h3>
                      <p className="text-xs font-medium text-stone-600 leading-relaxed">{feat.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== 4. HOW FAHARA WORKS ==================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Simple Workflow</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] mt-1">How Fahara Works</h2>
            <p className="text-stone-600 font-bold text-sm mt-2">Book your next event venue in 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timelineSteps.map((step) => (
              <motion.div 
                key={step.step}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl font-black text-[#DDB892]/40 block mb-3">{step.step}</span>
                  <h3 className="font-black text-lg text-[#2C1810] mb-2">{step.title}</h3>
                  <p className="text-xs font-medium text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ==================== 5. FAHARA ECOSYSTEM ==================== */}
        <section className="py-20 bg-white border-y border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Three-Sided Platform</span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] mt-1">The Fahara Ecosystem</h2>
              <p className="text-stone-600 font-bold text-sm mt-2">Connecting customers, venue hosts, and event professionals in one place.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ecosystemParticipants.map((part) => {
                const Icon = part.icon;
                return (
                  <div key={part.id} className="bg-[#FFF8F0] p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[#6F4E37] flex items-center justify-center font-black shadow-2xs border border-[#DDB892]/40">
                        <Icon size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#6F4E37] block">{part.subtitle}</span>
                      <h3 className="text-2xl font-black text-[#2C1810]">{part.title}</h3>
                      <p className="text-xs font-medium text-stone-600 leading-relaxed">{part.desc}</p>
                    </div>

                    {part.external ? (
                      <a 
                        href={part.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#6F4E37] text-white rounded-xl text-xs font-black hover:bg-[#4A2C11] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>{part.cta}</span>
                        <ArrowRight size={14} />
                      </a>
                    ) : (
                      <Link 
                        href={part.href}
                        className="w-full py-3 bg-[#6F4E37] text-white rounded-xl text-xs font-black hover:bg-[#4A2C11] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>{part.cta}</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== 6. WHY FAHARA ==================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#6F4E37]">Why Choose Us</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#2C1810] mt-1">More Than a Cafe Booking Platform</h2>
            <p className="text-stone-600 font-bold text-sm mt-2">Fahara seamlessly bridges spaces, event arrangements, and customers into one reliable ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyFaharaPillars.map((pillar, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFF8F0] border border-[#DDB892]/60 text-[#6F4E37] flex items-center justify-center mb-3 font-black text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-black text-base text-[#2C1810] mb-2">{pillar.title}</h3>
                <p className="text-xs font-medium text-stone-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 7. FINAL CTA ==================== */}
        <section className="py-20 bg-gradient-to-r from-[#2C1810] via-[#4A2C11] to-[#6F4E37] text-white text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Your next experience starts here.</h2>
            <p className="text-sm sm:text-lg text-[#FFF8F0]/90 mb-8 font-medium">Discover cafes, customize your event, and book in seconds.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/customer/cafe" className="w-full sm:w-auto px-8 py-4 bg-white text-[#2C1810] font-black rounded-2xl shadow-xl hover:bg-[#FFF8F0] transition-all">
                Explore Cafes
              </Link>
              <Link href="/events" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border border-white/20 transition-all">
                Find Event Services
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
