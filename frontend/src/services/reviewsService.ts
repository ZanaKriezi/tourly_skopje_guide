// src/services/reviewsService.ts
import { get, post, put, del } from './apiClient';
import { ReviewDTO, ReviewCreateDTO, ReviewFilter, ReviewStats } from '../types/reviews';
import { PageResponse } from '../types/api';

const REVIEWS_URL = '/reviews';
const PLACES_URL = '/places';

/**
 * Get all reviews with pagination and filtering
 */
export const getReviews = async (
  filter: ReviewFilter = {}
): Promise<PageResponse<ReviewDTO>> => {
  const {
    placeId,
    userId,
    minRating,
    maxRating,
    page = 0,
    size = 10,
    sortBy = 'timestamp',
    sortDir = 'desc'
  } = filter;

  let url = `${REVIEWS_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

  if (placeId) {
    url = `${PLACES_URL}/${placeId}/reviews?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
  }

  if (userId) {
    url = `${REVIEWS_URL}/user/${userId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
  }

  if (minRating !== undefined) {
    url += `&minRating=${minRating}`;
  }

  if (maxRating !== undefined) {
    url += `&maxRating=${maxRating}`;
  }

  return await get<PageResponse<ReviewDTO>>(url);
};

/**
 * Get a review by ID
 */
export const getReviewById = async (id: number): Promise<ReviewDTO> => {
  return await get<ReviewDTO>(`${REVIEWS_URL}/${id}`);
};

/**
 * Create a new review
 */
export const createReview = async (
  review: ReviewCreateDTO & { placeId: number }
): Promise<ReviewDTO> => {
  return await post<ReviewDTO>(`${PLACES_URL}/${review.placeId}/reviews`, review);
};

/**
 * Update an existing review
 */
export const updateReview = async (id: number, review: Partial<ReviewCreateDTO>): Promise<ReviewDTO> => {
  return await put<ReviewDTO>(`${REVIEWS_URL}/${id}`, review);
};

/**
 * Delete a review
 */
export const deleteReview = async (id: number): Promise<void> => {
  await del(`${REVIEWS_URL}/${id}`);
};

/**
 * Calculate review statistics from a list of reviews
 * This replaces the server-side endpoint that doesn't exist
 */
export const calculateReviewStats = (reviews: ReviewDTO[]): ReviewStats => {
  // Default empty stats
  const emptyStats: ReviewStats = {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  };
  
  // If no reviews, return empty stats
  if (!reviews || reviews.length === 0) {
    return emptyStats;
  }
  
  // Calculate total and distribution
  const totalReviews = reviews.length;
  const ratingDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  let ratingSum = 0;
  
  reviews.forEach(review => {
    ratingSum += review.rating;
    
    // Ensure rating is a valid key (1-5)
    const validRating = Math.min(Math.max(Math.round(review.rating), 1), 5);
    ratingDistribution[validRating as 1|2|3|4|5]++;
  });
  
  return {
    averageRating: totalReviews > 0 ? ratingSum / totalReviews : 0,
    totalReviews,
    ratingDistribution
  };
};

/**
 * Find a user's review for a place from the reviews list
 * This replaces the server-side endpoint that doesn't exist
 */
export const findUserReviewInList = (reviews: ReviewDTO[], userId: number): ReviewDTO | null => {
  if (!reviews || reviews.length === 0 || !userId) {
    return null;
  }
  
  return reviews.find(review => review.userId === userId) || null;
};