// src/types/api.ts
export interface PaginationInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pagination: PaginationInfo;
}

export interface ApiError {
  message: string;
  status?: number;
  timestamp?: string;
}