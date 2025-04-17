import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Place } from '../types/places';
import { mockApiService } from '../data/dummyData';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const PlaceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await mockApiService.places.getById(Number(id));
        setPlace(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load place details.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchPlace();
  }, [id]);
  
  

  if (loading) return <LoadingSpinner size="md" className="my-12" />;
  if (error || !place) return <div className="text-center text-red-500 my-12">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Name and Category */}
      <h1 className="text-3xl font-bold mb-2 pt-10">{place.name}</h1>
      <p className="text-primary text-sm mb-4 uppercase tracking-wide">{place.placeType.replace(/_/g, ' ')}</p>

      {/* Image */}
      <img
        src={place.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
        alt={place.name}
        className="w-full h-72 object-cover rounded-lg shadow mb-6"
      />

      {/* Rating and Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">⭐ {place.averageRating.toFixed(1)} rating</p>
        <p className="text-gray-700">{place.description}</p>
      </div>

      {/* Address and Details */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">📍 {place.address}</p>
        {place.duration && <p className="text-sm text-gray-500 mb-1">⏱ {place.duration}</p>}
        {place.sentimentTag && (
          <span className="bg-gray-100 text-primary text-xs px-2 py-1 rounded-full inline-block mt-2">
            #{place.sentimentTag}
          </span>
        )}
      </div>

      {/* Placeholder for future reviews */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <p className="text-sm text-gray-500 italic">Reviews section coming soon...</p>
      </div>

      {/* Back button */}
      <div className="mt-8">
        <Button onClick={() => window.history.back()}>← Back to list</Button>
      </div>
    </div>
  );
};

export default PlaceDetailsPage;
