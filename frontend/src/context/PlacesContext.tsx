// src/context/PlacesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  PlaceDTO,
  PlaceDetailDTO,
  PlaceFilter,
  ReviewDTO,
} from "../types/places";
import * as placesService from "../services/placesService";

interface PlacesContextType {
  places: PlaceDTO[];
  selectedPlace: PlaceDetailDTO | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    totalElements: number;
  };
  filter: PlaceFilter;
  loadPlaces: (newFilter?: Partial<PlaceFilter>) => Promise<void>;
  loadPlaceDetails: (id: number) => Promise<void>;
  loadPlaceReviews: (placeId: number, page?: number) => Promise<void>;
  updateFilter: (newFilter: Partial<PlaceFilter>) => void;
  setPage: (page: number) => void;
  clearError: () => void;
  reviews: ReviewDTO[];
  reviewsPagination: {
    page: number;
    totalPages: number;
    totalElements: number;
  };
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export const usePlaces = (): PlacesContextType => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error("usePlaces must be used within a PlacesProvider");
  }
  return context;
};

interface PlacesProviderProps {
  children: ReactNode;
}

export const PlacesProvider: React.FC<PlacesProviderProps> = ({ children }) => {
  const [places, setPlaces] = useState<PlaceDTO[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetailDTO | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [filter, setFilter] = useState<PlaceFilter>({
    page: 0,
    size: 12,
    sortBy: "averageRating",
    sortDir: "desc",
  });
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [reviewsPagination, setReviewsPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });

  // Load places with the current filter
  const loadPlaces = useCallback(
    async (newFilter?: Partial<PlaceFilter>): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Apply new filter if provided
        const currentFilter = newFilter ? { ...filter, ...newFilter } : filter;

        if (newFilter) {
          setFilter(currentFilter);
        }

        const response = await placesService.getPlaces(currentFilter);
        console.log("Places API Response:", response); // Log the entire response
        console.log("First place data:", response.content[0]); // Log the first place object

        setPlaces(response.content);
        setPagination({
          page: response.pagination.page,
          totalPages: response.pagination.totalPages,
          totalElements: response.pagination.totalElements,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load places";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  // Load place details by ID
  const loadPlaceDetails = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const placeDetails = await placesService.getPlaceById(id);
      console.log("Place Details API Response:", placeDetails);

      // Ensure recentReviews is always an array
      if (!placeDetails.recentReviews) {
        placeDetails.recentReviews = [];
      }

      setSelectedPlace(placeDetails);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to load place with ID ${id}`;
      setError(errorMessage);
      console.error("Error loading place details:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load place reviews
  const loadPlaceReviews = useCallback(
    async (placeId: number, page: number = 0): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await placesService.getPlaceReviews(placeId, page);

        setReviews(response.content);
        setReviewsPagination({
          page: response.pagination.page,
          totalPages: response.pagination.totalPages,
          totalElements: response.pagination.totalElements,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to load reviews for place with ID ${placeId}`;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update filter parameters
  const updateFilter = useCallback((newFilter: Partial<PlaceFilter>): void => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
      page: 0, // Reset to first page when changing filters
    }));
  }, []);

  // Change page
  const setPage = useCallback((page: number): void => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page,
    }));
  }, []);

  // Clear error state
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Context value
  const value: PlacesContextType = {
    places,
    selectedPlace,
    loading,
    error,
    pagination,
    filter,
    loadPlaces,
    loadPlaceDetails,
    loadPlaceReviews,
    updateFilter,
    setPage,
    clearError,
    reviews,
    reviewsPagination,
  };

  return (
    <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
  );
};
