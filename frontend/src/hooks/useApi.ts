// src/hooks/useApi.ts
import { useState, useCallback } from 'react';

// Improved type for API status
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// Interface for hook options
interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// Return type for the hook
interface UseApiReturn<T, P extends unknown[]> {
  execute: (...args: P) => Promise<T>;
  data: T | null;
  error: Error | null;
  status: ApiStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Custom hook for making API calls with loading and error states
 * @param apiFunction The API function to call
 * @param options Options for success and error callbacks
 */
export function useApi<T, P extends unknown[] = []>(
  apiFunction: (...args: P) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<ApiStatus>('idle');

  const execute = useCallback(
    async (...args: P): Promise<T> => {
      try {
        setStatus('loading');
        setError(null);
        
        const result = await apiFunction(...args);
        
        setData(result);
        setStatus('success');
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setStatus('error');
        
        if (options.onError) {
          options.onError(errorObj);
        }
        
        throw errorObj;
      }
    },
    [apiFunction, options]
  );

  return {
    execute,
    data,
    error,
    status,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
}