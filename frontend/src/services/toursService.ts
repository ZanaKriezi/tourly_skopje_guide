// src/services/toursService.ts
import { get, post, put, del } from './apiClient';
import { TourDTO, TourCreateDTO, TourFilter } from '../types/tours';

const TOURS_URL = '/tours';

/**
 * Get all tours
 */
export const getAllTours = async (): Promise<TourDTO[]> => {
  return await get<TourDTO[]>(TOURS_URL);
};

/**
 * Get tour by ID
 */
export const getTourById = async (id: number): Promise<TourDTO> => {
  return await get<TourDTO>(`${TOURS_URL}/${id}`);
};

/**
 * Get tours by user ID
 */
export const getToursByUser = async (userId: number): Promise<TourDTO[]> => {
  return await get<TourDTO[]>(`${TOURS_URL}/user/${userId}`);
};

/**
 * Get tours by preference ID
 */
export const getToursByPreference = async (preferenceId: number): Promise<TourDTO[]> => {
  return await get<TourDTO[]>(`${TOURS_URL}/preference/${preferenceId}`);
};

/**
 * Search tours by title
 */
export const searchToursByTitle = async (title: string): Promise<TourDTO[]> => {
  return await get<TourDTO[]>(`${TOURS_URL}/search?title=${encodeURIComponent(title)}`);
};

/**
 * Create a new tour
 */
export const createTour = async (tour: TourCreateDTO): Promise<TourDTO> => {
  return await post<TourDTO>(TOURS_URL, tour);
};

/**
 * Update a tour
 */
export const updateTour = async (id: number, tour: TourCreateDTO): Promise<TourDTO> => {
  return await put<TourDTO>(`${TOURS_URL}/${id}`, tour);
};

/**
 * Delete a tour
 */
export const deleteTour = async (id: number): Promise<void> => {
  await del(`${TOURS_URL}/${id}`);
};

/**
 * Add a place to a tour
 */
export const addPlaceToTour = async (tourId: number, placeId: number): Promise<TourDTO> => {
  return await post<TourDTO>(`${TOURS_URL}/${tourId}/places/${placeId}`, {});
};

/**
 * Remove a place from a tour
 */
export const removePlaceFromTour = async (tourId: number, placeId: number): Promise<TourDTO> => {
  return await del<TourDTO>(`${TOURS_URL}/${tourId}/places/${placeId}`);
};

/**
 * Get filtered tours
 */
export const getFilteredTours = async (filter: TourFilter): Promise<TourDTO[]> => {
  let url = TOURS_URL;
  
  if (filter.userId) {
    url = `${TOURS_URL}/user/${filter.userId}`;
  } else if (filter.preferenceId) {
    url = `${TOURS_URL}/preference/${filter.preferenceId}`;
  } else if (filter.title) {
    url = `${TOURS_URL}/search?title=${encodeURIComponent(filter.title)}`;
  }
  
  return await get<TourDTO[]>(url);
};