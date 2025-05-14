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
export const createReview = async (review: ReviewCreateDTO): Promise<ReviewDTO> => {
  return await post<ReviewDTO>(REVIEWS_URL, review);
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
 * Get review statistics for a place
 */
export const getReviewStats = async (placeId: number): Promise<ReviewStats> => {
  return await get<ReviewStats>(`${PLACES_URL}/${placeId}/reviews/stats`);
};

/**
 * Get current user's review for a place (if it exists)
 */
export const getUserReviewForPlace = async (placeId: number, userId: number): Promise<ReviewDTO | null> => {
  try {
    return await get<ReviewDTO>(`${PLACES_URL}/${placeId}/reviews/user/${userId}`);
  } catch (error) {
    console.error('Error fetching user review:', error);
    // If no review exists, return null
    return null;
  }
};