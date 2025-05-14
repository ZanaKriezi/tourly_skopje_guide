// src/pages/UserReviewsPage.tsx
import React, { useEffect } from 'react';
import { useReviews } from '../context/ReviewsContext';
import { useAuth } from '../context/AuthContext';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ReviewsList from '../components/reviews/ReviewsList';
import { ReviewDTO } from '../types/reviews';
import { useNavigate } from 'react-router-dom';

const UserReviewsPage: React.FC = () => {
  const { 
    reviews, 
    pagination, 
    loading, 
    error,
    loadReviews,
    deleteReview,
    setFilter,
    setPage,
    clearError 
  } = useReviews();
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Navigate to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Load user's reviews on component mount
  useEffect(() => {
    if (user) {
      setFilter({ userId: user.id });
      loadReviews({ userId: user.id });
    }
  }, [user, loadReviews, setFilter]);
  
  // Handle edit review button
  const handleEditReview = (review: ReviewDTO): void => {
    // Navigate to the place details page and open edit form
    navigate(`/places/${review.placeId}?editReview=${review.id}`);
  };
  
  // Handle delete review button
  const handleDeleteReview = async (reviewId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(reviewId);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number): void => {
    setPage(page);
  };

  if (!isAuthenticated) {
    return null; // Redirect will happen via the useEffect
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-2">My Reviews</h1>
      <p className="text-gray-600 mb-6">
        Manage the reviews you've left for places in Skopje
      </p>
      
      {/* Loading state */}
      {loading && (
        <LoadingSpinner size="lg" text="Loading your reviews..." />
      )}
      
      {/* Error message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => {
            clearError();
            if (user) {
              loadReviews({ userId: user.id });
            }
          }} 
        />
      )}
      
      {/* Reviews List */}
      {!loading && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
              <Button 
                onClick={() => navigate('/places')}
              >
                Explore Places to Review
              </Button>
            </div>
          ) : (
            <ReviewsList 
              reviews={reviews}
              totalPages={pagination.totalPages}
              currentPage={pagination.page}
              onPageChange={handlePageChange}
              currentUserId={user?.id}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          )}
        </div>
      )}
    </Container>
  );
};

export default UserReviewsPage;