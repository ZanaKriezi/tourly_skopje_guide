// src/components/tours/TourCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { TourDTO } from '../../types/tours';
import Button from '../common/Button';

interface TourCardProps {
  tour: TourDTO;
  className?: string;
  onClick?: () => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, className = '', onClick }) => {
  // Format the date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
        console.log('Error parsing date:', error);
      return 'Unknown date';
    }
  };

  // Get an image from the first place, or a default
  const getImageUrl = (): string => {
    if (tour.places && tour.places.length > 0 && tour.places[0].photoReference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${tour.places[0].photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    }
    return 'https://via.placeholder.com/400x300?text=Tour+Image';
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform ${className}`}
      onClick={onClick}
    >
      {/* Tour Image */}
      <div className="h-40 overflow-hidden">
        <img 
          src={getImageUrl()} 
          alt={tour.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Tour Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-800">
          {tour.title}
        </h3>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span>Created by {tour.userName}</span>
          <span>{formatDate(tour.dateCreated)}</span>
        </div>
        
        <div className="mb-3">
          <span className="text-sm text-gray-600">
            {tour.preferenceDescription || 'Custom tour'}
          </span>
        </div>
        
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            {tour.places.length} {tour.places.length === 1 ? 'place' : 'places'}
          </span>
        </div>
        
        <Link to={`/tours/${tour.id}`}>
          <Button variant="outline" fullWidth>
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TourCard;