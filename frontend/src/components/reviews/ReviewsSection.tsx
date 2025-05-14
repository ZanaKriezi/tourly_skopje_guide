// src/components/reviews/ReviewsSection.tsx
import React, { useState, useEffect } from 'react';
import { useReviews } from '../../context/ReviewsContext';
import { useAuth } from '../../context/AuthContext';
import { ReviewCreateDTO, ReviewDTO } from '../../types/reviews';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import ReviewsStats from './ReviewsStats';
import ErrorMessage from '../common/ErrorMessage';

interface ReviewsSectionProps {
  placeId: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ placeId }) => {
  const { 
    reviews, 
    userReview, 
    reviewStats, 
    pagination, 
    loading, 
    error,
    loadReviews, 
    loadUserReview, 
    loadReviewStats,
    createReview,
    updateReview,
    deleteReview,
    setFilter,
    setPage,
    clearError
  } = useReviews();
  
  const { isAuthenticated, user } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<ReviewDTO | null>(null);
  
  // Load reviews, user review, and stats on component mount
  useEffect(() => {
    const initReviews = async (): Promise<void> => {
      setFilter({ placeId });
      await loadReviews({ placeId });
      await loadReviewStats(placeId);
      
      if (isAuthenticated && user) {
        await loadUserReview(placeId);
      }
    };
    
    initReviews();
  }, [placeId, loadReviews, loadUserReview, loadReviewStats, setFilter, isAuthenticated, user]);
  
  // Handle form submission for new review
  const handleSubmitReview = async (reviewData: ReviewCreateDTO): Promise<void> => {
    await createReview(reviewData);
    setShowReviewForm(false);
  };
  
  // Handle form submission for edit review
  const handleUpdateReview = async (reviewData: ReviewCreateDTO): Promise<void> => {
    if (editingReview) {
      await updateReview(editingReview.id, reviewData);
      setEditingReview(null);
    }
  };
  
  // Handle edit review button
  const handleEditReview = (review: ReviewDTO): void => {
    setEditingReview(review);
  };
  
  // Handle delete review button
  const handleDeleteReview = async (reviewId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(reviewId);
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = (): void => {
    setEditingReview(null);
  };
  
  // Handle page change
  const handlePageChange = (page: number): void => {
    setPage(page);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Reviews & Ratings</h2>
      
      {/* Loading state */}
      {loading && !reviews.length && !reviewStats && (
        <LoadingSpinner size="md" text="Loading reviews..." />
      )}
      
      {/* Error message */}
    {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => {
            clearError();
            loadReviews({ placeId });
            loadReviewStats(placeId);
            if (isAuthenticated && user) {
              loadUserReview(placeId);
            }
          }} 
        />
      )}
      
      {/* Stats and Add Review Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="md:col-span-2">
          {reviewStats && <ReviewsStats stats={reviewStats} />}
        </div>
        
        {/* Add Review Button or User Review */}
        <div>
          {isAuthenticated ? (
            userReview ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Your Review</h3>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-3">{userReview.comment}</p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditReview(userReview)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteReview(userReview.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Share Your Experience</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Have you visited this place? Share your thoughts with other travelers.
                </p>
                <Button onClick={() => setShowReviewForm(true)} fullWidth>
                  Write a Review
                </Button>
              </div>
            )
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold mb-2">Share Your Experience</h3>
              <p className="text-sm text-gray-600 mb-3">
                Log in to write a review and share your experience.
              </p>
              <Button 
                onClick={() => window.location.href = '/login'}
                fullWidth
              >
                Log In to Review
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-semibold mb-4">Write Your Review</h3>
          <ReviewForm 
            placeId={placeId}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}
      
      {/* Edit Review Form */}
      {editingReview && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-semibold mb-4">Edit Your Review</h3>
          <ReviewForm 
            placeId={placeId}
            initialRating={editingReview.rating}
            initialComment={editingReview.comment}
            onSubmit={handleUpdateReview}
            onCancel={handleCancelEdit}
            isEdit
          />
        </div>
      )}
      
      {/* Reviews List */}
      <div>
        <h3 className="font-semibold mb-4">All Reviews</h3>
        <ReviewsList 
          reviews={reviews}
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          onPageChange={handlePageChange}
          currentUserId={user?.id}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
        />
      </div>
    </div>
  );
};

export default ReviewsSection;