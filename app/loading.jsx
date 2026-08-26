import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function GlobalLoading() {
  return (
    <FaharaInteractiveLoader 
      message="Discovering Top Rated Venues & Cafes..." 
      badgeTag="FAHARA DISCOVERY" 
      fullScreen={true} 
    />
  );
}
