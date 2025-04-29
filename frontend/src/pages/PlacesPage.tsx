import React, { useState, useEffect } from 'react';
import PlaceCard from '../components/places/PlaceCard';
import Button from '../components/common/Button';
import { Place, PlaceType } from '../types/places';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MapContainer from '../components/MapView'; // Import the new map component

interface Category {
  label: string;
  value: string;
}

interface GooglePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  photos?: GooglePhoto[];
}

const categories: Category[] = [
  { label: 'All', value: '' },
  { label: 'Landmark', value: 'tourist_attraction' }, // Use Google Maps API type values
  { label: 'Nature', value: 'park' },
  { label: 'Historic', value: 'museum' },
  { label: 'Museum', value: 'museum' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Cafe/Bar', value: 'cafe' },
  { label: 'Shopping', value: 'shopping_mall' },
];

const GOOGLE_MAPS_API_KEY = 'AIzaSyCJIYdrnrRp1x3d-nQOLTVA5v940bTjUT4'; // Use your actual API key

const PlacesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [places, setPlaces] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);
  const itemsPerPage = 6;

  // Fetch places based on the selected category
  useEffect(() => {
    setLoading(true);
    setError('');

    // Default type and radius if no category is selected
    const type = selectedCategory || 'tourist_attraction';
    const radius = 5000;

    fetch(`http://localhost:8080/api/maps/places?type=${type}&radius=${radius}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched places:', data);
        if (data.results && Array.isArray(data.results)) {
          setPlaces(data.results);
        } else {
          setPlaces([]);
          console.warn('No results found or invalid data format', data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Something went wrong while loading places.');
        setLoading(false);
      });
  }, [selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(places.length / itemsPerPage);
  const paginatedPlaces = places.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle place selection from map
  const handlePlaceSelect = (place: GooglePlace) => {
    setSelectedPlace(place);
    // Optionally scroll to the place card
    const placeIndex = places.findIndex(p => p.place_id === place.place_id);
    if (placeIndex !== -1) {
      const pageIndex = Math.floor(placeIndex / itemsPerPage) + 1;
      setCurrentPage(pageIndex);
    }
  };

  // Convert Google Place to our Place type
  const convertToPlace = (googlePlace: GooglePlace): Place => {
    return {
      id: googlePlace.place_id,
      name: googlePlace.name,
      description: googlePlace.vicinity || 'No description available.',
      averageRating: googlePlace.rating || 4.0,
      placeType: mapGoogleTypeToPlaceType(googlePlace.types?.[0]),
      category: googlePlace.types?.[0] || 'Unknown',
      address: googlePlace.vicinity || '',
      sentimentTag: 'Adventure',
      imageUrl: googlePlace.photos && googlePlace.photos.length > 0 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${googlePlace.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
        : '',
      duration: '1-2 hours',
      tags: ['Popular'],
    };
  };

  // Map Google place types to your PlaceType enum
  const mapGoogleTypeToPlaceType = (googleType?: string): PlaceType => {
    if (!googleType) return PlaceType.LANDMARKS;
    
    switch (googleType.toLowerCase()) {
      case 'tourist_attraction':
      case 'landmark':
        return PlaceType.LANDMARKS;
      case 'museum':
        return PlaceType.MUSEUMS;
      case 'park':
        return PlaceType.PARKS;
      case 'natural_feature':
        return PlaceType.NATURE;
      case 'restaurant':
        return PlaceType.RESTAURANT;
      case 'cafe':
      case 'bar':
        return PlaceType.CAFE_BAR;
      case 'shopping_mall':
        return PlaceType.MALL;
      case 'historic':
      case 'historical_site':
        return PlaceType.HISTORICAL;
      default:
        return PlaceType.LANDMARKS;
    }
  };

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
                ? 'bg-blue-500 text-white font-semibold'
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map section - takes up 2/3 of the width on large screens */}
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-md bg-white p-4 h-96 lg:h-auto">
            <h2 className="text-xl font-semibold mb-4">Explore Skopje</h2>
            <div className="h-full">
              <MapContainer 
                apiKey={GOOGLE_MAPS_API_KEY}
                places={places}
                selectedPlace={selectedPlace}
                onPlaceSelect={handlePlaceSelect}
              />
            </div>
          </div>

          {/* Places list section - takes up 1/3 of the width on large screens */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Places to Visit</h2>
            {paginatedPlaces.length === 0 ? (
              <div className="text-center text-gray-500 my-6">No places found in this category.</div>
            ) : (
              paginatedPlaces.map((place) => (
                <div 
                  key={place.place_id} 
                  className={`cursor-pointer ${selectedPlace?.place_id === place.place_id ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
                  onClick={() => setSelectedPlace(place)}
                >
                  <PlaceCard place={convertToPlace(place)} />
                </div>
              ))
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesPage;