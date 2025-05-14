// src/pages/PlacesSearchPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePlaces } from '../context/PlacesContext';
import { PlaceType } from '../types/places';
import Container from '../components/layout/Container';
import PlaceCard from '../components/places/PlaceCard';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import MapView from '../components/places/MapView';

const PlacesSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    places,
    loading,
    error,
    pagination,
    filter,
    loadPlaces,
    updateFilter,
    setPage,
    clearError
  } = usePlaces();
  
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | undefined>(undefined);

  // Get search parameters
  const type = searchParams.get('type') as PlaceType | null;
  const query = searchParams.get('q');
  const pageParam = searchParams.get('page');

  // Update filter when search parameters change
  useEffect(() => {
    const newFilter: Record<string, unknown> = {};
    
    if (type) {
      newFilter.type = type;
    }
    
    if (query) {
      newFilter.name = query;
    }
    
    if (pageParam) {
      const page = parseInt(pageParam) - 1; // Convert from 1-based to 0-based
      if (!isNaN(page) && page >= 0) {
        newFilter.page = page;
      }
    }
    
    updateFilter(newFilter);
  }, [type, query, pageParam, updateFilter]);

  // Load places when filter changes
  useEffect(() => {
    loadPlaces();
  }, [filter, loadPlaces]);

  // Handle place selection from map
  const handlePlaceSelect = (placeId: number): void => {
    setSelectedPlaceId(placeId);
    
    // Find the place in the list and scroll to it
    const placeElement = document.getElementById(`place-${placeId}`);
    if (placeElement) {
      placeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle page change
  const handlePageChange = (page: number): void => {
    setPage(page);
    
    // Update URL with new page
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', (page + 1).toString()); // Convert to 1-based for URL
    setSearchParams(newSearchParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear filters
  const handleClearFilters = (): void => {
    // Reset search parameters
    setSearchParams({});
    
    // Reset filter
    updateFilter({
      type: undefined,
      name: undefined,
      page: 0
    });
  };

  // Parse search parameters for display
  const getPageTitle = (): string => {
    if (type) {
      return `${type.replace(/_/g, ' ')} Places in Skopje`;
    }
    
    if (query) {
      return `Search results for "${query}"`;
    }
    
    return 'Places in Skopje';
  };

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-2">{getPageTitle()}</h1>
      <p className="text-gray-600 mb-6">
        {pagination.totalElements > 0 
          ? `Found ${pagination.totalElements} places` 
          : 'No places found'}
      </p>

      {/* Map View */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Map View</h2>
        <div className="h-96">
          <MapView 
            places={places} 
            selectedPlaceId={selectedPlaceId}
            onPlaceSelect={(place) => handlePlaceSelect(place.id)}
            height="100%"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => {
            clearError();
            loadPlaces();
          }}
        />
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="my-8">
          <LoadingSpinner size="lg" text="Loading places..." />
        </div>
      )}

      {/* Places Grid */}
      {!loading && places.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600 mb-4">No places found matching your criteria.</p>
          <Button 
            variant="outline" 
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {places.map((place) => (
              <div 
                id={`place-${place.id}`} 
                key={place.id}
                className={selectedPlaceId === place.id ? 'ring-2 ring-primary rounded-lg' : ''}
              >
                <PlaceCard 
                  place={place} 
                  onClick={() => setSelectedPlaceId(place.id)}
                />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            className="mb-8"
          />
        </>
      )}
    </Container>
  );
};

export default PlacesSearchPage;