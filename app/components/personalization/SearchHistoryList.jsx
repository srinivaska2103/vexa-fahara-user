import { motion } from 'framer-motion';
import SearchHistoryCard from './SearchHistoryCard';
import EmptyHistory from './EmptyHistory';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SearchHistoryList({ historyItems, onDelete, onSearchAgain }) {
  if (!historyItems || historyItems.length === 0) {
    return <EmptyHistory />;
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {historyItems.map((item) => (
        <SearchHistoryCard 
          key={item.id}
          history={item}
          onDelete={onDelete}
          onClick={onSearchAgain}
        />
      ))}
    </motion.div>
  );
}
