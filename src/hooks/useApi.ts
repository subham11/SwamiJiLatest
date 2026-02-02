'use client';

import { useState, useCallback } from 'react';
import { useAppDispatch } from '@/redux/store';

/**
 * Common API error response type
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: any;
  timestamp?: string;
}

/**
 * Hook for making API calls with loading and error handling
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const dispatch = useAppDispatch();

  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }, []);

  const buildHeaders = useCallback(
    (customHeaders?: Record<string, string>) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      const token = getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return headers;
    },
    [getAuthToken],
  );

  const request = useCallback(
    async <T = any>(
      url: string,
      options: RequestInit & { method: string },
      onSuccess?: (data: T) => void,
      onError?: (error: ApiError) => void,
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          ...options,
          headers: buildHeaders(options.headers as Record<string, string>),
        });

        const data = await response.json();

        if (!response.ok) {
          const apiError: ApiError = {
            statusCode: response.status,
            message: data.message || 'An error occurred',
            error: data.error,
          };
          setError(apiError);
          onError?.(apiError);
          return null;
        }

        onSuccess?.(data.data || data);
        return data.data || data;
      } catch (err) {
        const apiError: ApiError = {
          statusCode: 500,
          message: err instanceof Error ? err.message : 'An error occurred',
        };
        setError(apiError);
        onError?.(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [buildHeaders],
  );

  const get = useCallback(
    async <T = any>(
      url: string,
      onSuccess?: (data: T) => void,
      onError?: (error: ApiError) => void,
    ) =>
      request<T>(
        url,
        { method: 'GET' },
        onSuccess,
        onError,
      ),
    [request],
  );

  const post = useCallback(
    async <T = any>(
      url: string,
      body?: any,
      onSuccess?: (data: T) => void,
      onError?: (error: ApiError) => void,
    ) =>
      request<T>(
        url,
        {
          method: 'POST',
          body: body ? JSON.stringify(body) : undefined,
        },
        onSuccess,
        onError,
      ),
    [request],
  );

  const patch = useCallback(
    async <T = any>(
      url: string,
      body?: any,
      onSuccess?: (data: T) => void,
      onError?: (error: ApiError) => void,
    ) =>
      request<T>(
        url,
        {
          method: 'PATCH',
          body: body ? JSON.stringify(body) : undefined,
        },
        onSuccess,
        onError,
      ),
    [request],
  );

  const delete_ = useCallback(
    async <T = any>(
      url: string,
      onSuccess?: (data: T) => void,
      onError?: (error: ApiError) => void,
    ) =>
      request<T>(
        url,
        { method: 'DELETE' },
        onSuccess,
        onError,
      ),
    [request],
  );

  return {
    loading,
    error,
    get,
    post,
    patch,
    delete: delete_,
  };
};
