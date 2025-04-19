import React, { useState } from 'react';
import PlaceCard from '../components/places/PlaceCard';
import Button from '../components/common/Button';
import { PlaceType } from '../types/places';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';

const categories = [
  { label: 'All', value: '' },
  { label: 'Landmark', value: 'Landmark' },
  { label: 'Nature', value: 'Nature' },
  { label: 'Historic', value: 'Historic' },
  { label: 'Museum', value: 'Museum' },
  { label: 'Square', value: 'Square' },
  { label: 'Restaurant', value: 'Restaurant' },
  { label: 'Cafe/Bar', value: 'Cafe/Bar' },
  { label: 'Mall', value: 'Mall' },
];

const PlacesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const dummyPlaces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    name: `Sample Place ${i + 1}`,
    description: 'Some short description here.',
    averageRating: 4.2 + (i % 3) * 0.1,
    placeType: [
      PlaceType.HISTORICAL,
      PlaceType.LANDMARKS,
      PlaceType.NATURE,
      PlaceType.MUSEUMS,
      PlaceType.CAFE_BAR,
      PlaceType.MALL,
    ][i % 6],
    category: [
      'Historic',
      'Landmark',
      'Nature',
      'Museum',
      'Cafe/Bar',
      'Mall',
    ][i % 6], // for filtering
    address: 'Skopje City Center',
    sentimentTag: 'Adventure',
    imageUrl: '',
    duration: '1-2 hours',
    tags: ['Cultural', 'Popular'],
  }));

    // Simulate async data fetch
  React.useEffect(() => {
    setLoading(true);
    setError('');
  
    // Simulate async fetch
    const timeout = setTimeout(() => {
      try {
        // Simulate error: uncomment to test
        // throw new Error('Failed to load data');
        setLoading(false);
      } catch (err) {
        setError('Something went wrong while loading places.');
        setLoading(false);
      }
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [selectedCategory]);

  
  // Filter places by category
  const filteredPlaces =
    selectedCategory === ''
      ? dummyPlaces
      : dummyPlaces.filter(
          (place) =>
            place.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
   
    // Pagination logic
    const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
    const paginatedPlaces = filteredPlaces.slice(
        (currentPage - 1) * itemsPerPage,
         currentPage * itemsPerPage
    );
  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-2">Plan Your Perfect Tour</h1>
      <p className="text-gray-600 mb-6">
        Create a personalized itinerary based on your preferences and budget
      </p>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <Button
            key={cat.label}
            onClick={() => {
                setSelectedCategory(cat.value);
                setCurrentPage(1);
              }}              
            className={`px-4 py-1 rounded-full text-sm border ${
              selectedCategory === cat.value
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {loading ? (
    <LoadingSpinner size="md" className="my-12" />
    ) : error ? (
    <div className="text-center text-red-500 my-12">{error}</div>
    ) : (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
        ))}
        </div>

        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        />
    </>
    )}

    </div>
  );
};

export default PlacesPage;
