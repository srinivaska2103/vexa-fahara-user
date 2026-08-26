'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, MapPin } from 'lucide-react';
import { useNearbyCafes } from '@/hooks/useHome';
import CafeCard from '../cards/CafeCard';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(
  () => import('./MapComponent'), 
  { ssr: false, loading: () => <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center rounded-2xl"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div> }
);

export default function NearbyCafeSection() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState('');
  const { data: cafesData, isLoading } = useNearbyCafes(location.lat, location.lng);
  
  const cafes = cafesData?.data || cafesData || [];

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setLocationError('Unable to retrieve your location. Please enable location services.');
      }
    );
  };

  return (
    <section className="py-16 bg-white border-y border-[var(--color-border)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Nearby Cafes</h2>
            <p className="text-[var(--color-text-secondary)] text-lg">Discover hidden gems around your current location</p>
          </div>
          <button 
            onClick={requestLocation}
            className="mt-4 md:mt-0 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg flex items-center shadow hover:bg-[var(--color-secondary)] transition-colors"
          >
            <MapPin size={18} className="mr-2" />
            Locate Me
          </button>
        </div>

        {locationError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-8 border border-red-100">
            {locationError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] h-[400px] z-0">
              <Map center={location.lat ? [location.lat, location.lng] : [51.505, -0.09]} markers={cafes} />
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {!location.lat && !isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
                <MapPin size={40} className="text-gray-300 mb-4" />
                <p className="text-gray-500">Click "Locate Me" to see cafes near you.</p>
              </div>
            ) : isLoading ? (
              <div className="flex-1 flex justify-center items-center">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
              </div>
            ) : cafes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No cafes found nearby.</div>
            ) : (
              cafes.slice(0, 3).map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
