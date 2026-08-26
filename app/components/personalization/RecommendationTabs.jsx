import { motion } from 'framer-motion';

export default function RecommendationTabs({ activeTab, setTab }) {
  const tabs = [
    { id: 'cafes', label: 'Cafes & Venues' },
    { id: 'events', label: 'Event Companies' },
    { id: 'packages', label: 'Popular Packages' }
  ];

  return (
    <div className="flex items-center gap-6 border-b border-[#E8DED5] mb-8 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`pb-4 relative font-medium transition-colors whitespace-nowrap ${
              isActive ? 'text-[#6F4E37]' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F4E37]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
