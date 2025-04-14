import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { Place } from '../../types/places';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  // Placeholder image if no image is provided
  const imageUrl = place.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
  
  // Function to render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} type="full" />
        ))}
        {hasHalfStar && <StarIcon type="half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} type="empty" />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
          {place.placeType.replace(/_/g, ' ')}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-lg mb-1 text-text">
          {place.name}
        </h3>
        
        {/* Rating */}
        <div className="mb-2">
          {renderRating(place.averageRating)}
        </div>
        
        {/* Description - truncated */}
        <p className="font-inter text-sm text-gray-600 mb-3 line-clamp-2">
          {place.description}
        </p>
        
        {/* Address - truncated */}
        <p className="font-inter text-xs text-gray-500 mb-4 line-clamp-1">
          <LocationIcon /> {place.address}
        </p>
        
        {/* Tags */}
        {place.sentimentTag && (
          <div className="mb-4">
            <span className="bg-background text-primary text-xs px-2 py-1 rounded-full">
              #{place.sentimentTag}
            </span>
          </div>
        )}
        
        {/* Button */}
        <Link to={`/places/${place.id}`}>
          <Button variant="outline" fullWidth>
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Helper icons
const StarIcon: React.FC<{ type: 'full' | 'half' | 'empty' }> = ({ type }) => {
  const fillColor = type === 'empty' ? 'none' : '#4FC3F7';
  const strokeColor = '#4FC3F7';
  
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="2">
      {type === 'half' ? (
        <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" fill={fillColor} />
      ) : (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
    </svg>
  );
};

const LocationIcon: React.FC = () => (
  <svg 
    className="inline-block mr-1" 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default PlaceCard;