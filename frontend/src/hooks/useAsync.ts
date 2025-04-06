import { useState, useCallback, useEffect } from 'react';
import { LoadingState } from '../types/common';

interface UseAsyncReturn<T, Args extends unknown[]> {
  execute: (...args: Args) => Promise<T | undefined>;
  status: LoadingState;
  value: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Custom hook for handling async operations with strong typing
 */
function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate = false,
  initialArgs: Args = [] as unknown as Args
): UseAsyncReturn<T, Args> {
  const [status, setStatus] = useState<LoadingState>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // The execute function wraps asyncFunction and handles state changes
  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setStatus('loading');
      setValue(null);
      setError(null);
      
      try {
        const response = await asyncFunction(...args);
        setValue(response);
        setStatus('succeeded');
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setStatus('failed');
        return undefined;
      }
    },
    [asyncFunction]
  );

  // Call execute if immediate is true
  useEffect(() => {
    if (immediate) {
      execute(...initialArgs);
    }
  }, [execute, immediate]); // Omitted initialArgs from dependencies to avoid infinite loop

  return {
    execute,
    status,
    value,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'succeeded',
    isError: status === 'failed'
  };
}

export default useAsync;