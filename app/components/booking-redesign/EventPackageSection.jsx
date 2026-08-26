import { motion } from 'framer-motion';
import { Clock, Users, Star, CheckCircle2, Cake, Heart, Briefcase, IndianRupee } from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';

export default function EventPackageSection({ cafe }) {
  const { selectedEventCompany, selectedPackage, setPackage } = useBookingStore();

  let packages = [];
  let sourceName = '';

  if (cafe && cafe.cafe_packages && cafe.cafe_packages.length > 0) {
    // Show the cafe's own packages
    sourceName = cafe.name;
    packages = cafe.cafe_packages.map(pkg => ({
      ...pkg,
      id: pkg._id || pkg.id,
      name: pkg.package_name || pkg.event_type || 'Cafe Package',
      description: pkg.description || '',
      price: pkg.price || cafe.price_per_hour || 0,
      duration_hours: pkg.duration_hours || 2,
      max_guests: pkg.maximum_persons || pkg.max_guests || 20,
      rating: cafe.rating || 4.5,
      image: pkg.cover_image || cafe.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
      inclusions: [
        pkg.food && 'Food',
        pkg.cake && 'Cake',
        pkg.decoration && 'Decoration',
        pkg.music && 'Music',
        ...(Array.isArray(pkg.inclusions) ? pkg.inclusions : (typeof pkg.inclusions === 'string' ? pkg.inclusions.split(',') : []))
      ].filter(Boolean)
    }));
  }

  // If there are no packages available from either source, don't render the section
  if (packages.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4 }}
      className="bg-[#FFFFFF] border border-[#E8DED5] rounded-3xl p-6 mb-8 shadow-sm overflow-hidden"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#2C1810] mb-1 tracking-tight">Select a Package</h2>
          <p className="text-stone-500 font-medium text-xs sm:text-sm">Packages offered by <span className="font-bold text-[#6F4E37]">{sourceName}</span></p>
        </div>

        {selectedPackage && (
          <button 
            onClick={() => setPackage(null)}
            className="text-xs font-black text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200/60 transition-all cursor-pointer"
          >
            Clear Selected Package
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => {
          const getTheme = (name) => {
            const n = name.toLowerCase();
            if (n.includes('birthday')) return { bg: 'bg-pink-100/50', text: 'text-pink-500', icon: Cake, label: 'BIRTHDAY' };
            if (n.includes('date') || n.includes('couple') || n.includes('anniversary')) return { bg: 'bg-red-50', text: 'text-red-500', icon: Heart, label: 'ROMANTIC' };
            if (n.includes('corporate') || n.includes('meeting')) return { bg: 'bg-blue-50', text: 'text-blue-600', icon: Briefcase, label: 'CORPORATE' };
            return { bg: 'bg-[#FFF8F0]', text: 'text-[#DDB892]', icon: Star, label: name.toUpperCase() };
          };
          const theme = getTheme(pkg.name);
          const Icon = theme.icon;

          return (
            <div 
              key={pkg.id}
              onClick={() => {
                if (selectedPackage?.id === pkg.id) {
                  setPackage(null);
                } else {
                  setPackage(pkg);
                }
              }}
              className={`flex flex-col border rounded-2xl overflow-hidden cursor-pointer transition-all bg-white ${
                selectedPackage?.id === pkg.id 
                  ? 'border-[#6F4E37] ring-2 ring-[#6F4E37]/20 shadow-xl scale-[1.02]' 
                  : 'border-[#E8DED5] hover:border-[#A67B5B] hover:shadow-md'
              }`}
            >
              {/* Banner Area */}
              <div className={`h-40 w-full relative flex flex-col items-center justify-center ${theme.bg}`}>
                {selectedPackage?.id === pkg.id && (
                    <div className="absolute top-3 left-3 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <CheckCircle2 size={16} />
                    </div>
                )}
                
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-white/60">
                  <Icon size={28} className={theme.text} />
                </div>
                <span className={`font-bold tracking-widest text-sm uppercase ${theme.text}`}>
                  {theme.label}
                </span>
              </div>
              
              {/* Content Area */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-[#2C1810] leading-tight mb-1">{pkg.name}</h3>
                <p className="text-gray-400 text-sm mb-4">At {sourceName}</p>
                
                <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-snug">{pkg.description || `${sourceName} ${pkg.name}`}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-5 gap-6">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-gray-400" />
                    <span>{pkg.min_guests || 10} - {pkg.max_guests} guests</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    <span>{pkg.duration_hours} hrs</span>
                  </div>
                </div>
                
                <div className="flex items-center text-[#2C1810] mb-6">
                  <IndianRupee size={16} className="mr-1 text-gray-400" />
                  <span className="text-lg font-bold">₹{pkg.price}</span> 
                  <span className="ml-1 text-gray-600 text-sm font-medium">Base Price</span>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedPackage?.id === pkg.id) {
                      setPackage(null);
                    } else {
                      setPackage(pkg);
                    }
                  }}
                  className={`mt-auto w-full py-3 rounded-xl font-bold transition-all ${
                    selectedPackage?.id === pkg.id 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm' 
                      : 'bg-[#FFF8F0] text-[#6F4E37] hover:bg-[#F2E8DF]'
                  }`}
                >
                  {selectedPackage?.id === pkg.id ? 'Cancel Selection' : 'Select Package'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
