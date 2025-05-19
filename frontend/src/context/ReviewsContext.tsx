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
  loadUserReview: (placeId: number) => void;
  loadReviewStats: (placeId: number) => void;
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
  const [lastErrorTime, setLastErrorTime] = useState<number>(0);
  
  const { user } = useAuth();

  // Load reviews based on filter
  const loadReviews = useCallback(async (newFilter?: Partial<ReviewFilter>): Promise<void> => {
    // Don't attempt if we've had a recent error
    if (error && Date.now() - lastErrorTime < 5000) return;
    
    // Don't reload if already loading
    if (loading) return;
    
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
      
      // Now that we have reviews, calculate stats and find user review
      if (user && currentFilter.placeId) {
        // Find user review from loaded reviews
        const foundUserReview = reviewsService.findUserReviewInList(response.content, user.id);
        setUserReview(foundUserReview);
        
        // Calculate stats from all loaded reviews
        const calculatedStats = reviewsService.calculateReviewStats(response.content);
        setReviewStats(calculatedStats);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load reviews';
      setError(errorMessage);
      setLastErrorTime(Date.now());
    } finally {
      setLoading(false);
    }
  }, [filter, loading, error, lastErrorTime, user]);

  // Load user review from the current reviews list
  const loadUserReview = useCallback((): void => {
    if (!user) {
      setUserReview(null);
      return;
    }
    
    // Find the user's review from the loaded reviews
    const foundUserReview = reviewsService.findUserReviewInList(reviews, user.id);
    setUserReview(foundUserReview);
  }, [user, reviews]);

  // Calculate review statistics from the reviews list
  const loadReviewStats = useCallback((): void => {
    // Calculate stats from all loaded reviews
    const calculatedStats = reviewsService.calculateReviewStats(reviews);
    setReviewStats(calculatedStats);
  }, [reviews]);

  // Create a new review
  const createNewReview = useCallback(async (
    review: ReviewCreateDTO & { placeId: number }
  ): Promise<ReviewDTO> => {
    try {
      setLoading(true);
      setError(null);
      
      // Add the current user's ID if not specified
      if (!review.userId && user) {
        review.userId = user.id;
      }
      
      const createdReview = await reviewsService.createReview(review);
      
      // Update the reviews list and user review
      setReviews(prevReviews => [createdReview, ...prevReviews]);
      setUserReview(createdReview);
      
      // Update stats with the new review
      const updatedReviews = [createdReview, ...reviews];
      const calculatedStats = reviewsService.calculateReviewStats(updatedReviews);
      setReviewStats(calculatedStats);
      
      return createdReview;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create review';
      setError(errorMessage);
      setLastErrorTime(Date.now());
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, reviews]);

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
      
      // Update stats with the updated review
      const updatedReviews = reviews.map(r => r.id === id ? updatedReview : r);
      const calculatedStats = reviewsService.calculateReviewStats(updatedReviews);
      setReviewStats(calculatedStats);
      
      return updatedReview;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to update review with ID ${id}`;
      setError(errorMessage);
      setLastErrorTime(Date.now());
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userReview, reviews]);

  // Delete a review
  const deleteExistingReview = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await reviewsService.deleteReview(id);
      
      // Update the reviews list and user review
      const updatedReviews = reviews.filter(r => r.id !== id);
      setReviews(updatedReviews);
      
      if (userReview?.id === id) {
        setUserReview(null);
      }
      
      // Update stats after removing the review
      const calculatedStats = reviewsService.calculateReviewStats(updatedReviews);
      setReviewStats(calculatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to delete review with ID ${id}`;
      setError(errorMessage);
      setLastErrorTime(Date.now());
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userReview, reviews]);

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