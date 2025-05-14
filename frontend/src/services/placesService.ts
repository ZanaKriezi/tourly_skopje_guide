// src/services/placesService.ts
import { get, post, put, del } from './apiClient';
import { PlaceDTO, PlaceDetailDTO, PlaceFilter, PageResponse, ReviewDTO, PlaceType } from '../types/places';

const PLACES_URL = '/places';

/**
 * Get all places with pagination
 */
export const getPlaces = async (filter: PlaceFilter): Promise<PageResponse<PlaceDTO>> => {
  const { type, name, page, size, sortBy, sortDir } = filter;
  
  let url = `${PLACES_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
  
  if (name) {
    url = `${PLACES_URL}/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
  } else if (type) {
    url = `${PLACES_URL}/type/${type}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
  }
  
  return await get<PageResponse<PlaceDTO>>(url);
};

/**
 * Get place details by ID
 */
export const getPlaceById = async (id: number, previewReviews: number = 3): Promise<PlaceDetailDTO> => {
  try {
    return await get<PlaceDetailDTO>(`${PLACES_URL}/${id}?previewReviews=${previewReviews}`);
  } catch (error) {
    console.error(`Error fetching place ${id}:`, error);
    // Return a default placeholder object instead of throwing
    return {
      id: id,
      name: "Place information unavailable",
      description: "Could not load place details at this time.",
      placeType: PlaceType.LANDMARKS,
      averageRating: 0,
      reviewCount: 0,
      recentReviews: []
    };
  }
};

/**
 * Get place reviews with pagination
 */
export const getPlaceReviews = async (
  placeId: number, 
  page: number = 0, 
  size: number = 10,
  sortBy: string = 'timestamp',
  sortDir: string = 'desc'
): Promise<PageResponse<ReviewDTO>> => {
  return await get<PageResponse<ReviewDTO>>(
    `${PLACES_URL}/${placeId}/reviews?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
};

/**
 * Create a new place (for admin users)
 */
export const createPlace = async (place: Partial<PlaceDTO>): Promise<PlaceDTO> => {
  return await post<PlaceDTO>(PLACES_URL, place);
};

/**
 * Update a place (for admin users)
 */
export const updatePlace = async (id: number, place: Partial<PlaceDTO>): Promise<PlaceDTO> => {
  return await put<PlaceDTO>(`${PLACES_URL}/${id}`, place);
};

/**
 * Delete a place (for admin users)
 */
export const deletePlace = async (id: number): Promise<void> => {
  await del(`${PLACES_URL}/${id}`);
};

/**
 * Get places by filter with default values
 */
export const getFilteredPlaces = async (
  filter: Partial<PlaceFilter> = {}
): Promise<PageResponse<PlaceDTO>> => {
  // Default values
  const defaultFilter: PlaceFilter = {
    page: 0,
    size: 12,
    sortBy: 'averageRating',
    sortDir: 'desc',
    ...filter
  };
  
  return await getPlaces(defaultFilter);
};