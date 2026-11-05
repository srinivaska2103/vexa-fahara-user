'use client';

import { Rocket, Zap, ShieldCheck, Heart } from 'lucide-react';

const trustFeatures = [
  {
    id: 'platform',
    title: 'All in One Platform',
    desc: 'Food, Cafes & Events together',
    icon: Rocket
  },
  {
    id: 'delivery',
    title: 'Fast & Reliable',
    desc: 'Quick delivery & easy booking',
    icon: Zap
  },
  {
    id: 'partners',
    title: 'Trusted Cafes & Restaurants',
    desc: 'Verified partners with great quality',
    icon: ShieldCheck
  },
  {
    id: 'loved',
    title: 'Loved by Thousands',
    desc: 'Join our happy customers',
    icon: Heart
  }
];

export default function HomeTrustSection() {
  return (
    <section className="py-4 sm:py-6 bg-white border-b border-[#FEE2E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF5F5] border border-[#FEE2E2] rounded-3xl p-4 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.id} 
                  className={`flex items-center gap-3.5 p-2 sm:p-2.5 ${
                    idx < trustFeatures.length - 1 ? 'lg:border-r lg:border-[#FEE2E2]/80' : ''
                  }`}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-md shadow-[#E50914]/30 shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>
                  <div className="text-left leading-tight">
                    <h3 className="text-xs sm:text-sm font-black text-[#252525] tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-500 font-bold mt-0.5">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
