import { motion } from 'framer-motion';
import { Search, Clock, Trash2, ChevronRight, Package, MapPin, Sparkles, Building2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = {
  package: Package,
  category: Sparkles,
  location: MapPin,
  event_company: Building2,
  default: Search,
};

export default function SearchHistoryCard({ history, onDelete, onClick }) {
  const Icon = typeIcons[history.type] || typeIcons.default;
  const timeAgo = formatDistanceToNow(new Date(history.date), { addSuffix: true });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group flex items-center justify-between p-4 bg-white border border-[#E8DED5] rounded-xl hover:shadow-sm hover:border-[var(--color-primary)]/30 transition-all cursor-pointer"
      onClick={() => onClick(history)}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[var(--color-primary)]">
          <Icon size={18} />
        </div>
        <div>
          <h4 className="font-semibold text-[#2C1810]">{history.keyword}</h4>
          <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {timeAgo}
            </span>
            <span>•</span>
            <span>{history.results} Results</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(history.id); }}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Search"
        >
          <Trash2 size={16} />
        </button>
        <div className="p-2 text-[var(--color-primary)] bg-[#FFF8F0] rounded-lg">
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.div>
  );
}
