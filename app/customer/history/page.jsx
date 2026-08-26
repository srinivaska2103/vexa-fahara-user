'use client';

import { useSearchHistory, useDeleteSearchHistory, useClearSearchHistory } from '@/hooks/usePersonalization';
import SearchHistoryList from '@/app/components/personalization/SearchHistoryList';
import { Trash2, Loader2, ArrowLeft, Compass, Search, Bell, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import CustomerNavbar from '@/app/components/layout/CustomerNavbar';

import { useState } from 'react';
import ConfirmModal from '@/app/components/common/ConfirmModal';

export default function SearchHistoryPage() {
  const router = useRouter();
  const { data: history, isLoading } = useSearchHistory();
  const deleteMutation = useDeleteSearchHistory();
  const clearMutation = useClearSearchHistory();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Search removed from history');
    } catch (err) {
      toast.error('Failed to remove search');
    }
  };

  const handleClearAll = () => {
    setIsConfirmOpen(true);
  };

  const confirmClearAll = async () => {
    try {
      await clearMutation.mutateAsync();
      toast.success('Search history cleared');
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const handleSearchAgain = (item) => {
    // In a real app, this would update the search store and navigate to results
    toast.success(`Searching for ${item.keyword}...`);
    router.push('/customer/cafe');
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-12">
      <CustomerNavbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/customer/discover" className="p-2.5 bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-full transition-all active:scale-95 text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black text-[#2C1810] tracking-tight">Search History</h1>
        </div>
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-500">Your recent searches and browsing activity.</p>
          
          {history && history.length > 0 && (
            <button 
              onClick={handleClearAll}
              disabled={clearMutation.isPending}
              className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} /> Clear All
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
          </div>
        ) : (
          <SearchHistoryList 
            history={history} 
            onDelete={handleDelete} 
            onSearchAgain={handleSearchAgain} 
          />
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmClearAll}
        title="Clear Search History"
        message="Are you sure you want to clear your entire search history? This action cannot be undone."
        confirmText="Clear History"
        type="danger"
        isProcessing={clearMutation.isPending}
      />
    </div>
  );
}
