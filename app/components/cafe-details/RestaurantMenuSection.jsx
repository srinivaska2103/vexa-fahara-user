'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  UtensilsCrossed, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Loader2,
  ChevronRight,
  Info,
  BadgePercent,
  Tag,
  Plus,
  Minus,
  ShoppingBag,
  Check
} from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function RestaurantMenuSection({ cafeId, cafeName, isOrderingAvailable = true, availabilityReason = null }) {
  const [activeCategoryId, setActiveCategoryId] = useState('ALL');
  const [selectedFoodType, setSelectedFoodType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [conflictModal, setConflictModal] = useState(null);

  const user = useAuthStore((state) => state.user);
  const { cart, addItem, updateQuantity, removeItem } = useCartStore();

  // Fetch Public Menu for this Cafe with Live Offers & Discounts
  const { data, isLoading, error } = useQuery({
    queryKey: ['cafe-public-menu', cafeId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/cafes/${cafeId}/menu`);
      return res.data;
    },
    enabled: !!cafeId
  });

  const categories = data?.data?.categories || [];
  const activeOffers = data?.data?.activeOffers || [];

  // Filtered menu categories & items
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => activeCategoryId === 'ALL' || cat.id === activeCategoryId)
      .map((cat) => {
        const filteredItems = (cat.items || []).filter((item) => {
          if (selectedFoodType !== 'ALL' && item.foodType !== selectedFoodType) {
            return false;
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
              item.name.toLowerCase().includes(q) ||
              (item.description && item.description.toLowerCase().includes(q))
            );
          }
          return true;
        });

        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, activeCategoryId, selectedFoodType, searchQuery]);

  // Total visible item count
  const totalItemsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  // Helper to find quantity in current cart
  const getItemCartQuantity = (menuItemId) => {
    if (!cart?.items) return 0;
    const found = cart.items.find((i) => i.menuItemId === menuItemId);
    return found ? found.quantity : 0;
  };

  const getCartItemId = (menuItemId) => {
    if (!cart?.items) return null;
    const found = cart.items.find((i) => i.menuItemId === menuItemId);
    return found ? found.id : null;
  };

  // Add / Increment Item
  const handleAddToCart = async (item) => {
    if (!isOrderingAvailable) {
      toast.error(availabilityReason || 'This restaurant is currently closed for online ordering.');
      return;
    }
    if (!user) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    try {
      const res = await addItem({
        cafeId,
        menuItemId: item.id,
        quantity: 1
      });

      if (res?.requiresConfirmation) {
        setConflictModal({
          existingCafe: res.existingCafe,
          item
        });
      } else {
        toast.success(`Added ${item.name} to cart`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    }
  };

  // Replace cart confirmed
  const handleReplaceCart = async () => {
    if (!conflictModal) return;
    try {
      await addItem({
        cafeId,
        menuItemId: conflictModal.item.id,
        quantity: 1,
        forceReplace: true
      });
      toast.success(`Cart updated with ${conflictModal.item.name}`);
      setConflictModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to replace cart');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FEE2E2] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
              <UtensilsCrossed className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
              Restaurant Menu & Dishes
            </h2>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            Browse authentic food items, special discounts, and add dishes directly to your cart
          </p>
        </div>

        {/* Active Special Offers Counter Badge */}
        {activeOffers.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#FFF5F5] to-orange-50 border border-[#FEE2E2] shadow-2xs">
            <BadgePercent className="w-4 h-4 text-[#FF6B00] animate-pulse" />
            <div>
              <span className="text-[11px] font-black text-[#E50914] block leading-none">
                {activeOffers.length} Active {activeOffers.length === 1 ? 'Special Offer' : 'Special Offers'}
              </span>
              <span className="text-[9px] text-[#757575] font-bold">Discounts applied directly at checkout</span>
            </div>
          </div>
        )}
      </div>

      {/* ── FILTERS & SEARCH BAR ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Biriyani, Paneer, Juice)..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#FEE2E2] rounded-2xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914] transition-all"
            />
          </div>

          {/* Food Type Chips */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { type: 'ALL', label: 'All Dishes' },
              { type: 'VEG', label: 'Veg' },
              { type: 'NON_VEG', label: 'Non-Veg' },
              { type: 'EGG', label: 'Contains Egg' }
            ].map((f) => (
              <button
                key={f.type}
                type="button"
                onClick={() => setSelectedFoodType(f.type)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
                  selectedFoodType === f.type
                    ? 'bg-[#E50914] text-white border-[#E50914] shadow-xs'
                    : 'bg-white text-[#757575] border-[#FEE2E2] hover:bg-[#FFF5F5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Tab Strip */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategoryId('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
                activeCategoryId === 'ALL'
                  ? 'bg-[#252525] text-white border-[#252525]'
                  : 'bg-white text-[#252525] border-[#FEE2E2] hover:bg-[#FFF5F5]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
                  activeCategoryId === cat.id
                    ? 'bg-[#252525] text-white border-[#252525]'
                    : 'bg-white text-[#252525] border-[#FEE2E2] hover:bg-[#FFF5F5]'
                }`}
              >
                {cat.name} ({cat.items?.length || 0})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── DISHES LIST ── */}
      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-[#E50914] animate-spin mx-auto mb-2" />
          <span className="text-xs font-bold text-[#757575]">Loading restaurant menu...</span>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#FEE2E2] p-8 text-center space-y-2">
          <UtensilsCrossed className="w-8 h-8 text-[#757575]/40 mx-auto" />
          <h4 className="text-sm font-black text-[#252525]">No dishes found</h4>
          <p className="text-xs text-[#757575]">Try adjusting your search query or food type filter</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#FEE2E2] pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#252525]">
                  {category.name}
                </span>
                <span className="text-[10px] text-[#757575] font-bold">({category.items.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {category.items.map((item) => {
                  const qty = getItemCartQuantity(item.id);
                  const cartItemId = getCartItemId(item.id);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-[#FEE2E2] p-4 flex gap-3.5 justify-between items-start hover:border-[#E50914]/40 transition-all shadow-xs group"
                    >
                      {/* Left: Food Info */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        {/* Food Type Indicator */}
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                            item.foodType === 'VEG' ? 'border-emerald-600' : item.foodType === 'NON_VEG' ? 'border-red-600' : 'border-amber-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.foodType === 'VEG' ? 'bg-emerald-600' : item.foodType === 'NON_VEG' ? 'bg-red-600' : 'bg-amber-600'
                            }`} />
                          </span>

                          <h3 
                            onClick={() => setSelectedItemDetail(item)}
                            className="text-xs sm:text-sm font-black text-[#252525] truncate cursor-pointer hover:text-[#E50914] transition-colors"
                          >
                            {item.name}
                          </h3>
                        </div>

                        {/* Price & Discounts */}
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm sm:text-base font-black text-[#252525]">
                              ₹{Number(item.discountedPrice !== undefined ? item.discountedPrice : item.price).toFixed(2)}
                            </span>
                            {item.hasDiscount && item.originalPrice > item.discountedPrice && (
                              <span className="text-xs line-through text-stone-400 font-bold">
                                ₹{Number(item.originalPrice).toFixed(2)}
                              </span>
                            )}
                          </div>
                          {item.hasDiscount && (
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <span className="px-1.5 py-0.5 rounded-md bg-[#FF6B00] text-white text-[9px] font-black tracking-wider uppercase">
                                {item.appliedOffer?.discountType === 'PERCENTAGE' 
                                  ? `${item.appliedOffer.discountValue}% OFF` 
                                  : `₹${item.appliedOffer?.discountValue} OFF`}
                              </span>
                              <span className="text-[10px] font-extrabold text-emerald-600">
                                Saves ₹{Number(item.discountAmount).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {item.description && (
                          <p className="text-xs text-[#757575] line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-[#757575] pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#E50914]" />
                            {item.preparationTime || 15} mins prep
                          </span>
                        </div>
                      </div>

                      {/* Right: Food Image & Add/Quantity Button */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FFF5F5] border border-[#FEE2E2]">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                                !item.isAvailable ? 'grayscale-[50%]' : ''
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#757575]/40">
                              <UtensilsCrossed className="w-6 h-6" />
                            </div>
                          )}

                          {!item.isAvailable && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-[9px] font-black uppercase text-white">SOLD OUT</span>
                            </div>
                          )}
                        </div>

                        {/* Add to Cart Controls */}
                        {item.isAvailable && (
                          qty > 0 ? (
                            <div className="flex items-center bg-[#FFF5F5] border border-[#FEE2E2] rounded-xl px-1.5 py-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(cartItemId, qty - 1)}
                                className="w-6 h-6 flex items-center justify-center text-[#E50914] font-black hover:bg-white rounded-lg transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-black text-[#252525] px-2 text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(cartItemId, qty + 1)}
                                className="w-6 h-6 flex items-center justify-center text-[#E50914] font-black hover:bg-white rounded-lg transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              className="px-3.5 py-1.5 bg-white border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white rounded-xl text-xs font-black shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" /> ADD
                            </button>
                          )
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── CONFLICT RESTAURANT REPLACEMENT MODAL ── */}
      {conflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#FEE2E2] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-[#252525]">Replace Items in Cart?</h3>
              <p className="text-xs text-[#757575] leading-relaxed">
                Your cart currently contains dishes from <strong>{conflictModal.existingCafe.name}</strong>. A cart can only contain dishes from one restaurant at a time.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConflictModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#FEE2E2] text-xs font-bold text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={handleReplaceCart}
                className="flex-1 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-xs font-black text-white cursor-pointer shadow-md"
              >
                Start New Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOD ITEM DETAILS MODAL ── */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#FEE2E2] shadow-2xl space-y-4">
            {selectedItemDetail.imageUrl && (
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#FFF5F5] border border-[#FEE2E2]">
                <img
                  src={selectedItemDetail.imageUrl}
                  alt={selectedItemDetail.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-[#252525]">{selectedItemDetail.name}</h3>
              <p className="text-xs text-[#757575] leading-relaxed">
                {selectedItemDetail.description || 'Prepared fresh with high quality ingredients.'}
              </p>
              <div className="flex items-center gap-4 text-xs text-[#757575] pt-2 border-t border-[#FEE2E2]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E50914]" />
                  Estimated Prep: {selectedItemDetail.preparationTime || 15} mins
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedItemDetail(null)}
              className="w-full py-2.5 bg-[#FFF5F5] hover:bg-[#FEE2E2] text-[#252525] font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
