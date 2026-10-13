'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight, Store, Coffee, ShieldCheck } from 'lucide-react';
import { usePopularCafes } from '@/hooks/useHome';

export default function HomePopularPlaces() {
  const { data: popularCafesData, isLoading, isError } = usePopularCafes();

  const cafesList = Array.isArray(popularCafesData?.data) 
    ? popularCafesData.data 
    : (Array.isArray(popularCafesData) ? popularCafesData : []);

  return (
    <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#6F4E37] bg-[#FFF8F0] px-3.5 py-1.5 rounded-full border border-[#DDB892]/50 inline-block mb-3 shadow-2xs">
            POPULAR PLACES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
            Popular Places
          </h2>
          <p className="text-stone-600 font-medium text-xs sm:text-sm mt-1.5">
            Discover places customers are loving.
          </p>
        </div>

        <Link
          href="/customer/cafe"
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#6F4E37] hover:text-[#4A2C11] transition-colors self-start sm:self-auto"
        >
          <span>View All Places</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* BODY CONTENT */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3 animate-pulse">
              <div className="aspect-[4/3] bg-stone-200 rounded-2xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : isError || cafesList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8DED5] p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center mx-auto">
            <Store size={24} />
          </div>
          <h3 className="font-black text-lg text-[#2C1810]">No Popular Places Found</h3>
          <p className="text-xs font-medium text-stone-500">
            Check back soon as new verified partner cafes and venues join Fahara in your city.
          </p>
          <div className="pt-2">
            <Link
              href="/customer/cafe"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#6F4E37] text-white rounded-xl text-xs font-black hover:bg-[#4A2C11] transition-colors"
            >
              <span>Explore All Cafes</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cafesList.map((cafe) => {
            const coverImg = cafe.cover_image || cafe.gallery?.[0] || '/cafe1.jpg';
            const rating = cafe.average_rating || cafe.google_rating || '4.9';
            const reviewsCount = cafe.total_reviews || 0;
            const price = cafe.price_per_hour ? `₹${cafe.price_per_hour}/hr` : 'On Request';

            return (
              <motion.div
                key={cafe.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-[#E8DED5] shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                    <img
                      src={coverImg}
                      alt={cafe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs border border-stone-200 text-[#2C1810] flex items-center gap-1">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span className="text-[11px] font-black">{rating}</span>
                      {reviewsCount > 0 && (
                        <span className="text-[10px] text-stone-400 font-bold">({reviewsCount})</span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-[#6F4E37]">
                      {price}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5 text-left">
                    <span className="text-[10px] font-black uppercase text-[#6F4E37] bg-[#FFF8F0] px-2 py-0.5 rounded-md border border-[#DDB892]/40 inline-block">
                      {cafe.category || 'Cafe & Venue'}
                    </span>
                    <h3 className="font-black text-base text-[#2C1810] line-clamp-1 group-hover:text-[#6F4E37] transition-colors">
                      {cafe.name}
                    </h3>
                    <p className="text-xs font-medium text-stone-500 flex items-center gap-1 line-clamp-1">
                      <MapPin size={13} className="text-[#6F4E37] shrink-0" />
                      <span>{cafe.city || cafe.address || 'India'}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/customer/cafe?search=${encodeURIComponent(cafe.name)}`}
                    className="w-full py-2.5 px-4 bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border border-[#DDB892]/40"
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
