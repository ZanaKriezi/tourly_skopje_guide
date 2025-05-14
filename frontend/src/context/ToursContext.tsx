// src/context/ToursContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TourDTO, TourCreateDTO, TourFilter, PreferenceDTO, TourLength, BudgetLevel } from '../types/tours';
import * as toursService from '../services/toursService';
import { useAuth } from './AuthContext';

interface ToursContextType {
  tours: TourDTO[];
  selectedTour: TourDTO | null;
  loading: boolean;
  error: string | null;
  createTourPreference: PreferenceDTO | null;
  loadTours: (filter?: TourFilter) => Promise<void>;
  loadTourById: (id: number) => Promise<void>;
  createNewTour: (tour: TourCreateDTO) => Promise<TourDTO>;
  updateTour: (id: number, tour: TourCreateDTO) => Promise<TourDTO>;
  deleteTour: (id: number) => Promise<void>;
  addPlaceToTour: (tourId: number, placeId: number) => Promise<TourDTO>;
  removePlaceFromTour: (tourId: number, placeId: number) => Promise<TourDTO>;
  setCreateTourPreference: (preference: PreferenceDTO) => void;
  resetCreateTourPreference: () => void;
  clearError: () => void;
}

const ToursContext = createContext<ToursContextType | undefined>(undefined);

export const useTours = (): ToursContextType => {
  const context = useContext(ToursContext);
  if (!context) {
    throw new Error('useTours must be used within a ToursProvider');
  }
  return context;
};

interface ToursProviderProps {
  children: ReactNode;
}

export const ToursProvider: React.FC<ToursProviderProps> = ({ children }) => {
  const [tours, setTours] = useState<TourDTO[]>([]);
  const [selectedTour, setSelectedTour] = useState<TourDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createTourPreference, setCreateTourPreference] = useState<PreferenceDTO | null>(null);
  
  const { user } = useAuth();

  // Default preference
  const defaultPreference: PreferenceDTO = {
    tourLength: TourLength.HALF_DAY,
    budgetLevel: BudgetLevel.MODERATE,
    includeShoppingMalls: false,
    foodTypePreferences: [],
    drinkTypePreferences: [],
    attractionTypePreferences: []
  };

  // Load tours with optional filtering
  const loadTours = useCallback(async (filter?: TourFilter): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedTours = filter 
        ? await toursService.getFilteredTours(filter)
        : await toursService.getAllTours();
      
      setTours(loadedTours);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load tours';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific tour by ID
  const loadTourById = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const tour = await toursService.getTourById(id);
      setSelectedTour(tour);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to load tour with ID ${id}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new tour
  const createNewTour = useCallback(async (tour: TourCreateDTO): Promise<TourDTO> => {
    try {
      setLoading(true);
      setError(null);
      
      // Add the current user's ID if not specified
      if (!tour.userId && user) {
        tour.userId = user.id;
      }
      
      const createdTour = await toursService.createTour(tour);
      
      // Update the tours list
      setTours(prevTours => [...prevTours, createdTour]);
      
      return createdTour;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to create tour';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update an existing tour
  const updateExistingTour = useCallback(async (id: number, tour: TourCreateDTO): Promise<TourDTO> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTour = await toursService.updateTour(id, tour);
      
      // Update the tours list and selected tour
      setTours(prevTours => 
        prevTours.map(t => t.id === id ? updatedTour : t)
      );
      
      if (selectedTour?.id === id) {
        setSelectedTour(updatedTour);
      }
      
      return updatedTour;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to update tour with ID ${id}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTour]);

  // Delete a tour
  const deleteTourById = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await toursService.deleteTour(id);
      
      // Update the tours list
      setTours(prevTours => prevTours.filter(t => t.id !== id));
      
      // Clear selected tour if it's the deleted one
      if (selectedTour?.id === id) {
        setSelectedTour(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to delete tour with ID ${id}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTour]);

  // Add a place to a tour
  const addPlace = useCallback(async (tourId: number, placeId: number): Promise<TourDTO> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTour = await toursService.addPlaceToTour(tourId, placeId);
      
      // Update the tours list and selected tour
      setTours(prevTours => 
        prevTours.map(t => t.id === tourId ? updatedTour : t)
      );
      
      if (selectedTour?.id === tourId) {
        setSelectedTour(updatedTour);
      }
      
      return updatedTour;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to add place to tour`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTour]);

  // Remove a place from a tour
  const removePlace = useCallback(async (tourId: number, placeId: number): Promise<TourDTO> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTour = await toursService.removePlaceFromTour(tourId, placeId);
      
      // Update the tours list and selected tour
      setTours(prevTours => 
        prevTours.map(t => t.id === tourId ? updatedTour : t)
      );
      
      if (selectedTour?.id === tourId) {
        setSelectedTour(updatedTour);
      }
      
      return updatedTour;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to remove place from tour`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTour]);

  // Reset the create tour preference to default
  const resetCreateTourPreference = useCallback((): void => {
    setCreateTourPreference(defaultPreference);
  }, [defaultPreference]);

  // Clear any error state
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Context value
  const value: ToursContextType = {
    tours,
    selectedTour,
    loading,
    error,
    createTourPreference,
    loadTours,
    loadTourById,
    createNewTour,
    updateTour: updateExistingTour,
    deleteTour: deleteTourById,
    addPlaceToTour: addPlace,
    removePlaceFromTour: removePlace,
    setCreateTourPreference,
    resetCreateTourPreference,
    clearError,
  };

  return (
    <ToursContext.Provider value={value}>
      {children}
    </ToursContext.Provider>
  );
};