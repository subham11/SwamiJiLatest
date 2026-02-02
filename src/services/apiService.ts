/**
 * API Service Module - Centralized API client for all requests
 * Handles authentication, error handling, and request/response intercepting
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
  status: number;
}

/**
 * Request headers configuration
 */
interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

/**
 * API Service Class - Singleton for all API operations
 */
class ApiService {
  private static instance: ApiService;
  private token: string | null = null;
  private refreshTokenPromise: Promise<string> | null = null;

  private constructor() {
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    } else if (!token && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params?: Record<string, string | number | boolean>): string {
    if (!params || Object.keys(params).length === 0) return '';

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Build request headers with authorization
   */
  private buildHeaders(config?: RequestConfig): Headers {
    const headers = new Headers(config?.headers || {});

    // Set default content type
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add authorization token
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  /**
   * Handle API errors with structured response
   */
  private async handleError(response: Response): Promise<ApiErrorResponse> {
    try {
      const data = await response.json();
      return data as ApiErrorResponse;
    } catch {
      return {
        statusCode: response.status,
        message: response.statusText || 'Unknown error occurred',
        error: 'PARSE_ERROR',
      };
    }
  }

  /**
   * Make GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const queryString = this.buildQueryString(config?.params);
      const url = `${API_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
      const headers = this.buildHeaders(config);

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error, status: response.status };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: {
          statusCode: 0,
          message: error instanceof Error ? error.message : 'Network error',
          error: 'NETWORK_ERROR',
        },
        status: 0,
      };
    }
  }

  /**
   * Make POST request
   */
  async post<T>(
    endpoint: string,
    body?: Record<string, any>,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = this.buildHeaders(config);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error, status: response.status };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: {
          statusCode: 0,
          message: error instanceof Error ? error.message : 'Network error',
          error: 'NETWORK_ERROR',
        },
        status: 0,
      };
    }
  }

  /**
   * Make PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: Record<string, any>,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = this.buildHeaders(config);

      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error, status: response.status };
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      return {
        error: {
          statusCode: 0,
          message: error instanceof Error ? error.message : 'Network error',
          error: 'NETWORK_ERROR',
        },
        status: 0,
      };
    }
  }

  /**
   * Make DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const queryString = this.buildQueryString(config?.params);
      const url = `${API_BASE_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
      const headers = this.buildHeaders(config);

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        return { error, status: response.status };
      }

      const data = response.status === 204 ? null : await response.json();
      return { data: data as T, status: response.status };
    } catch (error) {
      return {
        error: {
          statusCode: 0,
          message: error instanceof Error ? error.message : 'Network error',
          error: 'NETWORK_ERROR',
        },
        status: 0,
      };
    }
  }
}

/**
 * Export singleton instance
 */
export const apiService = ApiService.getInstance();
