import { motion } from 'framer-motion';
import { Calendar, Clock, Star } from 'lucide-react';
import { usePopularEvents } from '@/hooks/useHome';
import { Loader2 } from 'lucide-react';

export function PopularEventsSection() {
  const { data, isLoading } = usePopularEvents();
  const events = data?.data || data || [];

  return (
    <section className="py-16 bg-[var(--color-background)]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Popular Events</h2>
          <p className="text-[var(--color-text-secondary)] text-lg">Curated experiences you won't want to miss</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.slice(0, 4).map((event) => (
              <motion.div key={event.id || event.name} whileHover={{ y: -5 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-lg transition-all">
                <div className="h-40 bg-gray-200">
                  {event.image ? (
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-secondary)]/20" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 truncate">{event.name || 'Special Event'}</h3>
                  <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2">
                    <Clock size={14} className="mr-1" /> {event.duration || '2-4 Hours'}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-[var(--color-primary)]">{event.price ? `₹${event.price}` : 'From ₹50'}</span>
                    <div className="flex items-center text-sm font-semibold">
                      <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" /> {event.rating || '4.8'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function OfferBanner() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="relative rounded-3xl overflow-hidden bg-[var(--color-primary)] text-white shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl mb-6 md:mb-0">
              <span className="inline-block px-3 py-1 bg-[var(--color-accent)] text-[var(--color-text-primary)] rounded-full text-sm font-bold mb-4">
                SPECIAL OFFER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 20% off your first Private Event booking!</h2>
              <p className="text-gray-200 mb-6">Use code FAHARA20 at checkout. Valid until the end of the month.</p>
              <button className="px-6 py-3 bg-white text-[var(--color-primary)] font-bold rounded-lg hover:bg-[var(--color-background)] transition-colors">
                Claim Offer
              </button>
            </div>
            <div className="text-8xl font-black text-white/20 hidden md:block">
              20%
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
