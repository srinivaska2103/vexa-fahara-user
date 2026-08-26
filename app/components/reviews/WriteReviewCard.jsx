'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

export default function WriteReviewCard({ booking }) {
  const cafe = booking.cafes;
  const pkg = booking.packages;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E8DED5] p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm"
    >
      <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0">
        {cafe?.cover_image || cafe?.images?.[0] ? (
          <Image
            src={cafe.cover_image || cafe.images[0]}
            alt={cafe.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#FFF8F0]" />
        )}
      </div>

      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-bold text-[#2C1810] mb-1">How was your experience?</h3>
        <p className="text-gray-600 text-sm mb-2">
          You recently visited <span className="font-semibold text-[#2C1810]">{cafe?.name}</span>
          {pkg && ` for the ${pkg.package_name} package`}.
        </p>
        <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-6 h-6 text-gray-300 fill-transparent" />
          ))}
        </div>
      </div>

      <div className="shrink-0 w-full md:w-auto">
        <Link 
          href={`/customer/reviews/create?bookingId=${booking.id}`}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-[#6F4E37] text-white rounded-xl font-medium hover:bg-[#5A3E2B] transition-colors shadow-sm w-full"
        >
          Rate & Review
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
