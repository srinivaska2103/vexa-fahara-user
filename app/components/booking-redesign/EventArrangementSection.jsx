import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Search, ChevronRight, Loader2 } from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';
import { usePopularEvents } from '@/hooks/useHome';

export default function EventArrangementSection() {
  const { selectedEventCompany, setEventCompany, setPackage } = useBookingStore();
  const [sortBy, setSortBy] = useState('Nearest');
  const [isSkipped, setIsSkipped] = useState(false);
  
  const { data: eventsResponse, isLoading, isError } = usePopularEvents();
  // Map the event services to "companies" for now, or just use them as arrangements.
  // We'll treat each event service as an arrangement.
  const fetchedArrangements = eventsResponse?.data || [];
  
  // Convert event-services to the format we need
  const managers = fetchedArrangements.map(event => {
    const companyName = event.users?.event_management_profiles?.company_name || 'Event Company';
    return {
      id: event.id,
      name: event.service_name || companyName,
      companyName: companyName,
      rating: event.average_rating ? parseFloat(event.average_rating).toFixed(1) : '0.0',
      reviews: event.total_reviews || 0,
      distance: null, // Removed hardcoded distance
      starting_price: event.price || 0,
      logo: (event.gallery && event.gallery.length > 0) ? event.gallery[0] : `https://ui-avatars.com/api/?name=${encodeURIComponent(event.service_name || companyName)}&background=6F4E37&color=fff`,
      services: event.category ? [event.category] : [],
      originalEvent: event // keep a reference
    };
  });

  const handleSelect = (company) => {
    setEventCompany(company);
    setIsSkipped(false);
    setPackage(null); // Reset package when company changes
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setEventCompany(null);
    setPackage(null);
  };

  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8DED5] rounded-3xl p-6 mb-8 flex justify-center py-12">
        <Loader2 className="animate-spin text-[#6F4E37]" size={32} />
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#FFFFFF] border border-[#E8DED5] rounded-3xl p-6 mb-8 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#2C1810] mb-2 tracking-tight">Event Arrangement <span className="text-gray-400 font-normal text-lg">(Optional)</span></h2>
          <p className="text-gray-500 font-medium text-sm">Make your booking special by hiring a nearby event arrangement.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <button 
            onClick={handleSkip}
            className={`px-4 py-2 font-semibold text-sm rounded-xl transition-all ${isSkipped ? 'bg-gray-100 text-gray-800 border border-gray-300' : 'text-[#A67B5B] hover:bg-[#FFF8F0]'}`}
          >
            {isSkipped ? 'Skipped' : 'Skip This'}
          </button>
        </div>
      </div>

      {!isSkipped && (
        <>
          {/* Sorting */}
          <div className="flex space-x-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
            {['Nearest', 'Highest Rated', 'Most Popular', 'Lowest Price'].map(sort => (
              <button 
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${sortBy === sort ? 'bg-[#6F4E37] text-white shadow-md' : 'bg-[#FFF8F0] text-[#6F4E37] border border-[#E8DED5] hover:bg-[#F2E8DF]'}`}
              >
                {sort}
              </button>
            ))}
          </div>

          {/* Managers List */}
          <div className="grid grid-cols-1 gap-4">
            {managers.length === 0 ? (
              <p className="text-gray-500 py-4">No event arrangements found nearby.</p>
            ) : managers.map(company => (
              <div 
                key={company.id}
                onClick={() => handleSelect(company)}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedEventCompany?.id === company.id ? 'border-[#6F4E37] bg-[#FFF8F0] shadow-md' : 'border-[#E8DED5] hover:border-[#A67B5B] bg-white'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#2C1810] text-lg">{company.name}</h3>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Starting from</span>
                        <span className="font-black text-[#6F4E37]">₹{company.starting_price}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium mb-2 mt-1">
                      <Star size={14} className="text-[#DDB892] fill-[#DDB892] mr-1" />
                      <span className="text-[#2C1810] mr-1">{company.rating}</span>
                      <span className="text-gray-400">({company.reviews})</span>
                      {company.distance && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <MapPin size={14} className="text-gray-400 mr-1" />
                          <span className="text-gray-500">{company.distance}</span>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-2">By {company.companyName}</div>

                    <div className="flex flex-wrap gap-2">
                      {company.services.map((svc, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-white border border-[#E8DED5] text-[#A67B5B] rounded-md font-medium">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedEventCompany?.id === company.id && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#6F4E37] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
}
