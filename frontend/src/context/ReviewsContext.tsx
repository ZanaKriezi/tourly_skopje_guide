// src/context/ReviewsContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ReviewDTO, ReviewCreateDTO, ReviewFilter, ReviewStats } from '../types/reviews';
import * as reviewsService from '../services/reviewsService';
import { useAuth } from './AuthContext';

interface ReviewsContextType {
  reviews: ReviewDTO[];
  userReview: ReviewDTO | null;
  reviewStats: ReviewStats | null;
  pagination: {
    page: number;
    totalPages: number;
    totalElements: number;
  };
  filter: ReviewFilter;
  loading: boolean;
  error: string | null;
  loadReviews: (newFilter?: Partial<ReviewFilter>) => Promise<void>;
  loadUserReview: (placeId: number) => Promise<void>;
  loadReviewStats: (placeId: number) => Promise<void>;
  createReview: (review: ReviewCreateDTO & { placeId: number }) => Promise<ReviewDTO>;
  updateReview: (id: number, review: Partial<ReviewCreateDTO>) => Promise<ReviewDTO>;
  deleteReview: (id: number) => Promise<void>;
  setFilter: (newFilter: Partial<ReviewFilter>) => void;
  setPage: (page: number) => void;
  clearError: () => void;
  resetContext: () => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const useReviews = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

interface ReviewsProviderProps {
  children: ReactNode;
}

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [userReview, setUserReview] = useState<ReviewDTO | null>(null);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0
  });
  const [filter, setFilterState] = useState<ReviewFilter>({
    page: 0,
    size: 10,
    sortBy: 'timestamp',
    sortDir: 'desc'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Load reviews based on filter
  const loadReviews = useCallback(async (newFilter?: Partial<ReviewFilter>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Apply new filter if provided
      const currentFilter = newFilter 
        ? { ...filter, ...newFilter }
        : filter;
      
      if (newFilter) {
        setFilterState(currentFilter);
      }
      
      const response = await reviewsService.getReviews(currentFilter);
      
      setReviews(response.content);
      setPagination({
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        totalElements: response.pagination.totalElements
      });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load reviews';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Load the current user's review for a place
  const loadUserReview = useCallback(async (placeId: number): Promise<void> => {
    if (!user) {
      setUserReview(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const review = await reviewsService.getUserReviewForPlace(placeId, user.id);
      setUserReview(review);
    } catch (err) {
        console.error('Error loading user review:', err);
      // If no review exists, set userReview to null
      setUserReview(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load review statistics for a place
  const loadReviewStats = useCallback(async (placeId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await reviewsService.getReviewStats(placeId);
      setReviewStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load review statistics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new review
  const createNewReview = useCallback(
    async (review: ReviewCreateDTO & { placeId: number }): Promise<ReviewDTO> => {
      try {
        setLoading(true);
        setError(null);
  
        // Add the current user's ID if not specified
        if (!review.userId && user) {
          review.userId = user.id;
        }
  
        const createdReview = await reviewsService.createReview(review);
  
        setReviews(prevReviews => [createdReview, ...prevReviews]);
        setUserReview(createdReview);
  
        if (filter.placeId) {
          await loadReviewStats(filter.placeId);
        }
  
        return createdReview;
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'Failed to create review';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, filter.placeId, loadReviewStats]
  );
  

  // Update an existing review
  const updateExistingReview = useCallback(async (id: number, review: Partial<ReviewCreateDTO>): Promise<ReviewDTO> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedReview = await reviewsService.updateReview(id, review);
      
      // Update the reviews list and user review
      setReviews(prevReviews => 
        prevReviews.map(r => r.id === id ? updatedReview : r)
      );
      
      if (userReview?.id === id) {
        setUserReview(updatedReview);
      }
      
      // Reload review stats if the current filter has a placeId
      if (filter.placeId) {
        await loadReviewStats(filter.placeId);
      }
      
      return updatedReview;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to update review with ID ${id}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userReview, filter.placeId, loadReviewStats]);

  // Delete a review
  const deleteExistingReview = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await reviewsService.deleteReview(id);
      
      // Update the reviews list and user review
      setReviews(prevReviews => prevReviews.filter(r => r.id !== id));
      
      if (userReview?.id === id) {
        setUserReview(null);
      }
      
      // Reload review stats if the current filter has a placeId
      if (filter.placeId) {
        await loadReviewStats(filter.placeId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to delete review with ID ${id}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userReview, filter.placeId, loadReviewStats]);

  // Set filter with pagination reset
  const setFilter = useCallback((newFilter: Partial<ReviewFilter>): void => {
    setFilterState(prevFilter => ({
      ...prevFilter,
      ...newFilter,
      page: 0 // Reset to first page when filter changes
    }));
  }, []);

  // Set page
  const setPage = useCallback((page: number): void => {
    setFilterState(prevFilter => ({
      ...prevFilter,
      page
    }));
  }, []);

  // Clear error state
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Reset context state
  const resetContext = useCallback((): void => {
    setReviews([]);
    setUserReview(null);
    setReviewStats(null);
    setPagination({
      page: 0,
      totalPages: 0,
      totalElements: 0
    });
    setFilterState({
      page: 0,
      size: 10,
      sortBy: 'timestamp',
      sortDir: 'desc'
    });
    setError(null);
  }, []);

  // Context value
  const value: ReviewsContextType = {
    reviews,
    userReview,
    reviewStats,
    pagination,
    filter,
    loading,
    error,
    loadReviews,
    loadUserReview,
    loadReviewStats,
    createReview: createNewReview,
    updateReview: updateExistingReview,
    deleteReview: deleteExistingReview,
    setFilter,
    setPage,
    clearError,
    resetContext
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};