// src/pages/PlaceDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaces } from '../context/PlacesContext';
import { PlaceType } from '../types/places';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

// Helper to format the place type for display
const formatPlaceType = (type: PlaceType): string => {
  return type.replace(/_/g, ' ');
};

// Star component for ratings
const StarRating: React.FC<{ rating: number | null | undefined, size?: 'sm' | 'md' | 'lg' }> = ({ 
  rating = 0, // Provide default value when null/undefined
  size = 'md' 
}) => {
  // Use 0 if rating is null or undefined
  const actualRating = rating ?? 0;
  
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(actualRating);
  const hasHalfStar = actualRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Determine star size
  const getStarSize = (): number => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };
  const starSize = getStarSize();
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} type="full" size={starSize} />
      ))}
      {hasHalfStar && <Star type="half" size={starSize} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} type="empty" size={starSize} />
      ))}
      <span className={`ml-2 ${size === 'lg' ? 'text-lg' : 'text-sm'} text-gray-600`}>
        ({actualRating.toFixed(1)})
      </span>
    </div>
  );
};

// Star icon
interface StarProps {
  type: 'full' | 'half' | 'empty';
  size: number;
}

const Star: React.FC<StarProps> = ({ type, size }) => {
  const fillColor = type === 'empty' ? 'none' : '#FFD700'; // Gold color
  const strokeColor = '#FFD700';
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} stroke={strokeColor} strokeWidth="2">
      {type === 'half' ? (
        <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" fill={fillColor} />
      ) : (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
    </svg>
  );
};

// Review Card Component
interface ReviewCardProps {
  review: {
    id?: number;
    rating: number;
    comment: string;
    timestamp: string;
    userName: string;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Format date
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

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex justify-between mb-2">
        <div className="font-medium">{review.userName || 'Anonymous User'}</div>
        <div className="text-gray-500 text-sm">{formatDate(review.timestamp)}</div>
      </div>
      <div className="mb-2">
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-gray-700">{review.comment || 'No comment provided'}</p>
    </div>
  );
};

const PlaceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedPlace, loading, error, loadPlaceDetails, clearError, loadPlaceReviews, reviews, reviewsPagination } = usePlaces();
  const [showAllReviews, setShowAllReviews] = React.useState<boolean>(false);

  useEffect(() => {
    if (id) {
      loadPlaceDetails(Number(id)).catch(error => {
        // Log the error but don't crash the component
        console.error("Error loading place details:", error);
      });
    }
  }, [id, loadPlaceDetails]);

  // Handle back button
  const handleBack = (): void => {
    navigate(-1); // Go back to previous page
  };

  // Handle viewing all reviews
  const handleViewAllReviews = async (): Promise<void> => {
    if (id) {
      try {
        await loadPlaceReviews(Number(id));
        setShowAllReviews(true);
      } catch (error) {
        console.error("Error loading all reviews:", error);
      }
    }
  };

  // Generate image URL from photo reference
  const getImageUrl = (): string => {
    if (selectedPlace?.photoReference) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${selectedPlace.photoReference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    }
    return 'https://via.placeholder.com/800x400?text=No+Image+Available';
  };

  // Render reviews section with error handling
  const renderReviewsSection = () => {
    if (error && showAllReviews) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-700">
              Sorry, we couldn't load reviews at this time. Please try again later.
            </p>
          </div>
        </div>
      );
    }

    if (showAllReviews && reviews.length > 0) {
      // Show all reviews that were loaded
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Reviews ({reviewsPagination.totalElements})</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowAllReviews(false)}
          >
            Show Less
          </Button>
        </div>
      );
    }

    // Show preview reviews from the place details
    if (!selectedPlace?.recentReviews || selectedPlace.recentReviews.length === 0) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {selectedPlace.recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          
          {selectedPlace.reviewCount > selectedPlace.recentReviews.length && (
            <div className="text-center mt-4">
              <Button 
                variant="outline"
                onClick={handleViewAllReviews}
              >
                See all {selectedPlace.reviewCount} reviews
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner size="lg" text="Loading place details..." />
      </Container>
    );
  }

  if (error && !showAllReviews) {
    return (
      <Container>
        <ErrorMessage 
          message={error} 
          onRetry={() => {
            clearError();
            if (id) loadPlaceDetails(Number(id));
          }} 
        />
        <Button
          variant="outline"
          className="mt-4"
          onClick={handleBack}
        >
          ← Back
        </Button>
      </Container>
    );
  }

  if (!selectedPlace) {
    return (
      <Container>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Place not found</h2>
          <p className="text-gray-600 mb-6">The place you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="outline"
            onClick={handleBack}
          >
            ← Back to Places
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Breadcrumb navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <button onClick={handleBack} className="hover:text-primary">
          Places
        </button>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{selectedPlace.name}</span>
      </div>

      {/* Title and Category */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{selectedPlace.name}</h1>
        <div className="flex items-center mt-2">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded">
            {formatPlaceType(selectedPlace.placeType)}
          </span>
          {selectedPlace.sentimentTag && (
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded ml-2">
              #{selectedPlace.sentimentTag}
            </span>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="rounded-lg overflow-hidden mb-6 shadow-md">
        <img
          src={getImageUrl()}
          alt={selectedPlace.name}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Rating */}
          <div>
            <StarRating rating={selectedPlace.averageRating ?? 0} size="lg" />
            <p className="text-gray-600 mt-1">
              Based on {selectedPlace.reviewCount ?? 0} {selectedPlace.reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700">
              {selectedPlace.description || 'No description available. This attraction is coming soon.'}
            </p>
          </div>

          {/* Reviews */}
          {renderReviewsSection()}
        </div>

        {/* Right Column: Contact Info */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Information</h2>
          
          {/* Address */}
          {selectedPlace.address && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Address</h3>
              <p className="text-gray-600">{selectedPlace.address}</p>
            </div>
          )}
          
          {/* Phone */}
          {selectedPlace.phoneNumber && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Phone</h3>
              <p className="text-gray-600">
                <a href={`tel:${selectedPlace.phoneNumber}`} className="hover:text-primary">
                  {selectedPlace.phoneNumber}
                </a>
              </p>
            </div>
          )}
          
          {/* Website */}
          {selectedPlace.websiteURL && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Website</h3>
              <p className="text-gray-600">
                <a 
                  href={selectedPlace.websiteURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit website
                </a>
              </p>
            </div>
          )}
          
          {/* Social Media */}
          {selectedPlace.socialMedia && (
            <div>
              <h3 className="font-medium text-gray-700 mb-1">Social Media</h3>
              <p className="text-gray-600">
                <a 
                  href={selectedPlace.socialMedia} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {selectedPlace.socialMedia.includes('facebook') ? 'Facebook' : 
                   selectedPlace.socialMedia.includes('instagram') ? 'Instagram' : 
                   'Social Media'}
                </a>
              </p>
            </div>
          )}
          
          {/* If none of the above are available, show a message */}
          {!selectedPlace.address && !selectedPlace.phoneNumber && 
           !selectedPlace.websiteURL && !selectedPlace.socialMedia && (
            <p className="text-gray-500 italic">Additional information coming soon.</p>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={handleBack}
        >
          ← Back to Places
        </Button>
      </div>
    </Container>
  );
};

export default PlaceDetailsPage;