'use client';

import FoodLoadingScreen from '@/app/components/common/FoodLoadingScreen';

export default function Loading() {
  return <FoodLoadingScreen message="Loading your food experience..." fullScreen={true} />;
}
