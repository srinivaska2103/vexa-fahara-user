import { motion } from 'framer-motion';
import { ShieldCheck, CalendarCheck, Award, ThumbsUp } from 'lucide-react';

export function WhyChooseSection() {
  const reasons = [
    { title: 'Verified Cafes', desc: 'Every venue is manually vetted for quality and safety.', icon: ShieldCheck },
    { title: 'Secure Booking', desc: '100% secure payment protection and instant confirmation.', icon: CalendarCheck },
    { title: 'Premium Experience', desc: 'Unmatched VIP service tailored for your specific events.', icon: Award },
    { title: 'Trusted Reviews', desc: 'Real reviews from verified customers who booked the venue.', icon: ThumbsUp },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">Why Choose Fahara</h2>
          <p className="text-[var(--color-text-secondary)] text-lg">We provide the most seamless and premium cafe discovery and event booking experience in the industry.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, idx) => (
            <motion.div 
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-6">
                <reason.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">{reason.title}</h3>
              <p className="text-[var(--color-text-secondary)]">{reason.desc}</p>
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
