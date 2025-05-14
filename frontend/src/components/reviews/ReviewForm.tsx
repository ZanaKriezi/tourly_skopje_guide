// src/components/reviews/ReviewForm.tsx
import React, { useState } from 'react';
import { ReviewCreateDTO } from '../../types/reviews';
import Button from '../common/Button';

interface ReviewFormProps {
  placeId: number;
  initialRating?: number;
  initialComment?: string;
  onSubmit: (review: ReviewCreateDTO) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  placeId,
  initialRating = 5,
  initialComment = '',
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [comment, setComment] = useState<string>(initialComment);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please provide a comment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const reviewData: ReviewCreateDTO = {
        rating,
        comment,
        placeId
      };
      
      await onSubmit(reviewData);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to submit review. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">
          Rating (1-5)
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`w-10 h-10 rounded-full ${rating >= value ? 'bg-yellow-400' : 'bg-gray-200'}`}
              aria-label={`Rate ${value} stars`}
            >
              <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        <div className="mt-1 text-sm">
          {rating} {rating === 1 ? 'star' : 'stars'}
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="block font-medium mb-1">
          Review
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this place..."
        />
      </div>
      
      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : isEdit ? 'Update Review' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;