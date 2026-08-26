import api from '@/lib/axios';

// Mock data generator for reviews when APIs are missing
const generateMockReview = (id = Math.random().toString(36).substring(7)) => ({
  id,
  rating: Math.floor(Math.random() * 2) + 4,
  review: "This is a fantastic place! Highly recommend the ambiance and the service. The coffee was amazing.",
  created_at: new Date().toISOString(),
  cafe_id: "123",
  event_service_id: null,
  helpful_count: Math.floor(Math.random() * 50),
  is_verified: true,
  has_liked: false,
  images: ["https://picsum.photos/seed/picsum/200/300"],
  owner_reply: Math.random() > 0.5 ? {
    message: "Thank you so much for your wonderful review! We look forward to serving you again.",
    replied_at: new Date().toISOString(),
    owner_name: "Cafe Manager"
  } : null,
  user: {
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?u=" + id
  },
  detailed_ratings: {
    food: 5,
    ambience: 5,
    service: 4,
    cleanliness: 5,
    value: 4
  }
});

let mockReviewsList = Array.from({ length: 5 }, () => generateMockReview());

export const reviewService = {
  // Existing Backend APIs
  addReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getCafeReviews: async (cafeId) => {
    const response = await api.get(`/reviews/cafe/${cafeId}`);
    return response.data;
  },

  getEventServiceReviews: async (serviceId) => {
    const response = await api.get(`/reviews/event-service/${serviceId}`);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Mocked Endpoints (Backend doesn't have these yet)
  getMyReviews: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: mockReviewsList,
      meta: {
        totalReviews: mockReviewsList.length,
        averageRating: 4.5,
        reviewsWithImages: mockReviewsList.filter(r => r.images?.length > 0).length
      }
    };
  },

  getReviewById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const review = mockReviewsList.find(r => r.id === id) || generateMockReview(id);
    return { success: true, data: review };
  },

  updateReview: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockReviewsList.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReviewsList[index] = { ...mockReviewsList[index], ...updateData };
    }
    return { success: true, data: mockReviewsList[index] };
  },

  likeReview: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockReviewsList.findIndex(r => r.id === id);
    if (index !== -1) {
      const isLiked = mockReviewsList[index].has_liked;
      mockReviewsList[index].has_liked = !isLiked;
      mockReviewsList[index].helpful_count += isLiked ? -1 : 1;
    }
    return { success: true };
  },

  reportReview: async (id, reason) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'Review reported successfully' };
  }
};
