// src/types/reviews.ts
export interface ReviewDTO {
  id: number;
  rating: number;
  comment: string;
  timestamp: string;
  userId: number;
  userName: string;
  placeId: number;
}

export interface ReviewCreateDTO {
  rating: number;
  comment: string;
  placeId: number;
  userId?: number;
}

export interface ReviewFilter {
  placeId?: number;
  userId?: number;
  minRating?: number;
  maxRating?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}