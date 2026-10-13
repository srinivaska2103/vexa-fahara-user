import { motion } from 'framer-motion';
import { ShieldCheck, CalendarCheck, Award, ThumbsUp } from 'lucide-react';

export function WhyChooseSection() {
  const reasons = [
    { title: 'Verified Cafes', desc: 'Every venue is manually vetted for quality, ambience, and safety standards.', icon: ShieldCheck, tag: '01' },
    { title: 'Secure Booking', desc: '100% secure payment protection and instant table/space confirmation.', icon: CalendarCheck, tag: '02' },
    { title: 'Premium Experience', desc: 'Unmatched VIP service tailored for your birthdays, events, and reunions.', icon: Award, tag: '03' },
    { title: 'Trusted Reviews', desc: 'Real ratings & authentic reviews from customers who booked through Fahara.', icon: ThumbsUp, tag: '04' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EF] to-white relative overflow-hidden border-b border-[#E8DED5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF8F0] border border-[#E8DED5] text-[#6F4E37] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            Why Choose Fahara
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2C1810] tracking-tight leading-tight">
            Built for Memorable Gatherings
          </h2>
          <p className="text-[#8B6E59] text-base sm:text-lg mt-3 font-medium max-w-2xl mx-auto">
            We provide the most seamless, transparent, and premium cafe discovery &amp; event booking experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group relative bg-white/90 backdrop-blur-sm border border-[#E8DED5] hover:border-[#6F4E37]/40 rounded-3xl p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(44,24,16,0.03)] hover:shadow-[0_20px_40px_rgba(111,78,55,0.12)] hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6F4E37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#E8DED5] flex items-center justify-center text-[#6F4E37] shadow-2xs group-hover:bg-[#6F4E37] group-hover:text-white group-hover:border-[#6F4E37] transition-all duration-300">
                  <reason.icon size={26} />
                </div>
                <span className="text-xs font-black text-[#A67B5B]/40 group-hover:text-[#6F4E37] transition-colors">{reason.tag}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#2C1810] group-hover:text-[#6F4E37] transition-colors duration-200 tracking-tight">{reason.title}</h3>
              <p className="text-[#7A6253] text-sm leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    { name: 'Sarah J.', rating: 5, text: 'Fahara completely changed how I plan my birthday parties. Found an amazing hidden cafe!' },
    { name: 'Michael T.', rating: 5, text: 'The booking process was incredibly smooth and the venue was even better in person.' },
    { name: 'Emma W.', rating: 4.8, text: 'Highly recommend for corporate events. The team had a blast and the coffee was top notch.' },
  ];

  return (
    <section className="py-20 bg-[var(--color-background)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[var(--color-text-primary)] mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <motion.div 
              key={test.name}
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-2xl shadow-sm border border-[var(--color-border)]"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.floor(test.rating) ? 'fill-yellow-400' : ''} />)}
              </div>
              <p className="text-[var(--color-text-secondary)] italic mb-6">"{test.text}"</p>
              <div className="font-bold text-[var(--color-text-primary)]">- {test.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Dummy Star since it was missing above
const Star = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export function PartnerCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-[var(--color-secondary)]/10 rounded-3xl p-10 md:p-16 text-center border border-[var(--color-secondary)]/20">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">Become a Cafe Partner</h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto mb-8">Join thousands of venues already using Fahara to boost their bookings and grow their business.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:bg-[var(--color-secondary)] transition-colors">
              Register Your Cafe
            </button>
            <button className="px-8 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
