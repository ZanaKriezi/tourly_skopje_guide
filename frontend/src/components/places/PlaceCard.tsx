// src/components/places/PlaceCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { PlaceDTO, PlaceType } from '../../types/places';

interface PlaceCardProps {
  place: PlaceDTO;
  className?: string;
  onClick?: () => void;
}

// Helper to format the place type for display
const formatPlaceType = (type: PlaceType): string => {
  return type.replace(/_/g, ' ');
};

// Get a color based on place type
const getTypeColor = (type: PlaceType): string => {
  const colors: Record<string, string> = {
    HISTORICAL: 'bg-amber-100 text-amber-800',
    MUSEUMS: 'bg-violet-100 text-violet-800',
    NATURE: 'bg-emerald-100 text-emerald-800',
    PARKS: 'bg-green-100 text-green-800',
    LANDMARKS: 'bg-blue-100 text-blue-800',
    RESTAURANT: 'bg-red-100 text-red-800',
    CAFE_BAR: 'bg-orange-100 text-orange-800',
    MALL: 'bg-purple-100 text-purple-800'
  };
  
  return colors[type] || 'bg-gray-100 text-gray-800';
};

const PlaceCard: React.FC<PlaceCardProps> = ({ place, className = '', onClick }) => {
  // Placeholder image if no image is provided
  const getImageUrl = (): string => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (place.photoReference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photoReference}&key=${apiKey}`;
    }
    
    // Use different placeholder images based on place type
    const placeholderImages: Record<string, string> = {
      HISTORICAL: 'https://via.placeholder.com/400x240?text=Historical+Site',
      MUSEUMS: 'https://via.placeholder.com/400x240?text=Museum',
      NATURE: 'https://via.placeholder.com/400x240?text=Nature',
      PARKS: 'https://via.placeholder.com/400x240?text=Park',
      LANDMARKS: 'https://via.placeholder.com/400x240?text=Landmark',
      RESTAURANT: 'https://via.placeholder.com/400x240?text=Restaurant',
      CAFE_BAR: 'https://via.placeholder.com/400x240?text=Cafe+or+Bar',
      MALL: 'https://via.placeholder.com/400x240?text=Shopping+Mall',
    };
    
    return placeholderImages[place.placeType] || 'https://via.placeholder.com/400x240?text=No+Image';
  };

  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 h-full ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 right-3 ${getTypeColor(place.placeType)} text-xs font-medium px-2 py-1 rounded-full`}>
          {formatPlaceType(place.placeType)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
          {place.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {(place.averageRating ?? 0).toFixed(1)}
            </span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            {place.reviewCount ?? 0} {(place.reviewCount ?? 0) === 1 ? 'review' : 'reviews'}
          </span>
        </div>
        
        {/* Description - truncated */}
        {place.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {place.description}
          </p>
        )}
        
        {/* Location */}
        {place.address && (
          <div className="flex items-start mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="ml-1.5 text-xs text-gray-500 line-clamp-1">
              {place.address}
            </p>
          </div>
        )}
        
        {/* Link to details */}
        <Link 
          to={`/places/${place.id}`}
          className="block mt-4 text-center py-2 px-4 border border-gray-300 rounded-lg text-primary-600 font-medium hover:bg-primary-50 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PlaceCard;