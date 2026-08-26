import { useSimilarCafes } from '@/hooks/useCafeDetails';
import CafeCard from '@/app/components/cards/CafeCard';
import { Loader2 } from 'lucide-react';

export default function SimilarCafes({ cafe }) {
  const { city } = cafe || {};
  
  const { data, isLoading, error } = useSimilarCafes(city, null, !!city);
  
  // The API returns paginated data inside data.data or just an array
  const cafes = data?.data || [];
  
  // Filter out the current cafe from similar ones
  const filteredCafes = cafes.filter(c => c.id !== cafe?.id).slice(0, 4);

  if (!city || error || filteredCafes.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-[var(--color-border)]">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Explore other options in {city}</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCafes.map((c) => (
            <CafeCard key={c.id} cafe={c} />
          ))}
        </div>
      )}
    </div>
  );
}
