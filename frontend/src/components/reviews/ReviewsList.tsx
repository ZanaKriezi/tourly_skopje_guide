// src/components/reviews/ReviewsList.tsx
import React from 'react';
import { ReviewDTO } from '../../types/reviews';
import Button from '../common/Button';
import Pagination from '../common/Pagination';

// Format date helper
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Unknown date';
  }
};

// Star rating component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

interface ReviewsListProps {
  reviews: ReviewDTO[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  currentUserId?: number;
  onEdit?: (review: ReviewDTO) => void;
  onDelete?: (reviewId: number) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  totalPages,
  currentPage,
  onPageChange,
  currentUserId,
  onEdit,
  onDelete
}) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium">{review.userName}</div>
              <div className="text-gray-500 text-sm">{formatDate(review.timestamp)}</div>
            </div>
            <StarRating rating={review.rating} />
          </div>
          
          <p className="text-gray-700 mb-2">
            {review.comment}
          </p>
          
          {/* Edit/Delete buttons for current user's reviews */}
          {currentUserId === review.userId && onEdit && onDelete && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(review)}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => onDelete(review.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      ))}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ReviewsList;