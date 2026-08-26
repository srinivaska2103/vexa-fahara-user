'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ModernDropdown from '@/app/components/common/ModernDropdown';

export default function ReviewSort({ sort, setSort }) {
  const options = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' },
  ];

  return (
    <ModernDropdown 
      options={options}
      value={sort}
      onChange={setSort}
      label="Sort:"
      icon={SlidersHorizontal}
    />
  );
}
