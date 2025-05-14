// src/components/reviews/ReviewsStats.tsx
import React from 'react';
import { ReviewStats } from '../../types/reviews';

interface ReviewsStatsProps {
  stats: ReviewStats;
}

const ReviewsStats: React.FC<ReviewsStatsProps> = ({ stats }) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;
  
  // Calculate percentages for the rating bars
  const calculatePercentage = (count: number): number => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold mb-4">Ratings Summary</h3>
      
      <div className="flex items-center mb-4">
        <div className="text-4xl font-bold mr-3">{averageRating.toFixed(1)}</div>
        <div>
          <div className="flex text-yellow-400 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </div>
      
      {/* Rating distribution bars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0;
          const percentage = calculatePercentage(count);
          
          return (
            <div key={rating} className="flex items-center">
              <div className="w-12 text-sm font-medium text-gray-700">
                {rating} stars
              </div>
              <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full">
                <div 
                  className="h-4 bg-yellow-400 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-12 text-sm text-gray-600 text-right">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewsStats;