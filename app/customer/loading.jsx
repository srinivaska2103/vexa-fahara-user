import FaharaInteractiveLoader from '@/app/components/common/FaharaInteractiveLoader';

export default function CustomerLoading() {
  return (
    <FaharaInteractiveLoader 
      message="Loading Customer Portal..." 
      badgeTag="FAHARA CUSTOMER" 
      fullScreen={true} 
    />
  );
}
