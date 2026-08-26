import { motion } from 'framer-motion';
import CafeCard from '../cards/CafeCard';
import { Loader2 } from 'lucide-react';

export default function CafeListSection({ title, subtitle, cafes, isLoading, error }) {
  return (
    <section className="py-16 bg-[var(--color-background)]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h2>
          {subtitle && <p className="text-[var(--color-text-secondary)] text-lg">{subtitle}</p>}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
          </div>
        ) : error ? (
          <div className="text-center text-[var(--color-danger)] p-8 bg-red-50 rounded-xl border border-red-100">
            Failed to load cafes. Please try again later.
          </div>
        ) : !cafes || cafes.length === 0 ? (
          <div className="text-center text-[var(--color-text-secondary)] p-12 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm">
            <h3 className="text-xl font-semibold mb-2">No cafes found</h3>
            <p>We couldn't find any cafes for this section right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cafes.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
