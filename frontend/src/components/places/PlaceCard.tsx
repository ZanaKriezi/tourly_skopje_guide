// src/components/places/PlaceCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { PlaceDTO, PlaceType } from "../../types/places";
import Button from "../common/Button";

// Star component for ratings
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} type="full" />
      ))}
      {hasHalfStar && <Star type="half" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} type="empty" />
      ))}
      <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
};

// Star icon
interface StarProps {
  type: "full" | "half" | "empty";
}

const Star: React.FC<StarProps> = ({ type }) => {
  const fillColor = type === "empty" ? "none" : "#FFD700"; // Gold color
  const strokeColor = "#FFD700";

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="2"
    >
      {type === "half" ? (
        <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" fill={fillColor} />
      ) : (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
    </svg>
  );
};

// Icon for location
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

// Helper to format the place type for display
const formatPlaceType = (type: PlaceType): string => {
  return type.replace(/_/g, " ");
};

interface PlaceCardProps {
  place: PlaceDTO;
  className?: string;
  onClick?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, className = "", onClick }) => {
  console.log("Place in PlaceCard:", place);

  // Placeholder image if no image is provided
  const getImageUrl = (): string => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log("API Key available:", !!apiKey); // Log if API key exists

    if (place.photoReference) {
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photoReference}&key=${apiKey}`;
      console.log("Image URL:", url);
      return url;
    }
    console.log("No photo reference, using placeholder");
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  const imageUrl = getImageUrl();
  console.log("Final image URL used:", imageUrl);

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
          {formatPlaceType(place.placeType)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-gray-800">
          {place.name}
        </h3>

        {/* Rating */}
        <div className="mb-2">
          <StarRating rating={place.averageRating ?? 0} />
        </div>

        {/* Description - truncated */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {place.description}
        </p>

        {/* Address - truncated */}
        {place.address && (
          <p className="text-xs text-gray-500 mb-4 line-clamp-1">
            <LocationIcon /> {place.address}
          </p>
        )}

        {/* Reviews count */}
        <p className="text-xs text-gray-500 mb-3">
          {place.reviewCount} {place.reviewCount === 1 ? "review" : "reviews"}
        </p>

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

export default PlaceCard;
