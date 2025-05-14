// src/pages/PlacesPage.tsx
import React, { useEffect, useState } from 'react';
import { usePlaces } from '../context/PlacesContext';
import { PlaceType } from '../types/places';
import PlaceCard from '../components/places/PlaceCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Pagination from '../components/common/Pagination';
import Container from '../components/layout/Container';

interface CategoryOption {
  label: string;
  value: PlaceType | '';
}

const categories: CategoryOption[] = [
  { label: 'All', value: '' },
  { label: 'Historical', value: PlaceType.HISTORICAL },
  { label: 'Museums', value: PlaceType.MUSEUMS },
  { label: 'Nature', value: PlaceType.NATURE },
  { label: 'Parks', value: PlaceType.PARKS },
  { label: 'Landmarks', value: PlaceType.LANDMARKS },
  { label: 'Restaurants', value: PlaceType.RESTAURANT },
  { label: 'Cafés & Bars', value: PlaceType.CAFE_BAR },
  { label: 'Shopping', value: PlaceType.MALL },
];

const PlacesPage: React.FC = () => {
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
  
  const [search, setSearch] = useState<string>('');
  
  // Load places on initial mount and when filter changes
  useEffect(() => {
    loadPlaces();
  }, [loadPlaces, filter]);

  // Handle category change
  const handleCategoryChange = (type: PlaceType | ''): void => {
    updateFilter({ type: type || undefined });
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    updateFilter({ name: search || undefined });
  };

  // Handle page change
  const handlePageChange = (page: number): void => {
    setPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-2">Discover Skopje</h1>
      <p className="text-gray-600 mb-6">
        Explore the best places in Skopje based on your interests
      </p>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Search Form */}
          <form 
            className="w-full md:w-1/3"
            onSubmit={handleSearchSubmit}
          >
            <div className="flex">
              <input
                type="text"
                placeholder="Search places..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit">
                Search
              </Button>
            </div>
          </form>
          
          {/* Category Filters */}
          <div className="w-full md:w-2/3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.label}
                onClick={() => handleCategoryChange(category.value)}
                variant={filter.type === category.value ? 'primary' : 'outline'}
                size="sm"
                className="px-4 py-1 rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
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
          <p className="text-lg text-gray-600">No places found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              updateFilter({ type: undefined, name: undefined });
              setSearch('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
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

export default PlacesPage;