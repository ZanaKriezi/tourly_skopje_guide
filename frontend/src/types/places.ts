// src/types/places.ts
export enum PlaceType {
  HISTORICAL = 'HISTORICAL',
  MUSEUMS = 'MUSEUMS',
  NATURE = 'NATURE',
  PARKS = 'PARKS',
  LANDMARKS = 'LANDMARKS',
  RESTAURANT = 'RESTAURANT',
  CAFE_BAR = 'CAFE_BAR',
  MALL = 'MALL',
  // Add any other PlaceType values from the backend
}

// Basic place information
export interface PlaceDTO {
  id: number;
  name: string;
  description: string;
  placeType: PlaceType;
  latitude?: number;
  longitude?: number;
  address?: string;
  averageRating: number;
  photoReference?: string;
  reviewCount: number;
}

// Detailed place information including reviews
export interface PlaceDetailDTO extends PlaceDTO {
  phoneNumber?: string;
  websiteURL?: string;
  socialMedia?: string;
  sentimentTag?: string;
  recentReviews?: ReviewDTO[];
}

// Review information
export interface ReviewDTO {
  id: number;
  rating: number;
  comment: string;
  timestamp: string;
  userId: number;
  userName: string;
}

// Pagination info returned from API
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Paginated response from API
export interface PageResponse<T> {
  content: T[];
  pagination: PaginationInfo;
}

// Place filter options
export interface PlaceFilter {
  type?: PlaceType;
  name?: string;
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}