'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import DiscoveryCategorySection from './DiscoveryCategorySection';

export default function HomeCategorySection() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/cafes/categories');
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelect = (catId) => {
    setSelectedId(catId);
    if (catId) {
      router.push(`/customer/cafe?category=${encodeURIComponent(catId)}`);
    }
  };

  const handleClear = () => {
    setSelectedId('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <DiscoveryCategorySection
        title="WHAT'S ON YOUR MIND?"
        subtitle="Find cafes, spaces & occasions for your next moment."
        items={categories}
        selectedId={selectedId}
        onSelect={handleSelect}
        onClear={handleClear}
        isLoading={isLoading}
        isError={isError}
        onRetry={fetchCategories}
      />
    </section>
  );
}
