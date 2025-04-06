export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: string;
  }
  
  export interface BaseEntity {
    id: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';