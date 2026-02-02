'use client';

import { useState, useCallback } from 'react';
import { useApi } from './useApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Interface for product data
 */
export interface Product {
  _id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stockStatus: string;
  stockQuantity?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  categories: string[];
  isFeatured: boolean;
  tags?: string[];
}

/**
 * Paginated products response
 */
export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Product filter options
 */
export interface ProductFilters {
  category?: string;
  sort?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Hook for product API operations
 * Provides methods for CRUD operations and filtering
 */
export const useProducts = () => {
  const { get, post, patch, delete: delete_, loading, error } = useApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  /**
   * Fetch paginated products with filters
   * @param page - Current page number (1-indexed)
   * @param filters - Optional filter parameters
   * @returns Promise<PaginatedProducts | undefined>
   */
  const fetchProducts = useCallback(
    async (page = 1, filters?: ProductFilters) => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        active: 'true',
      });

      // Add optional filters to query string
      if (filters?.category) params.append('category', filters.category);
      if (filters?.sort) params.append('sort', filters.sort);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());

      const data = await get<PaginatedProducts>(
        `${API_URL}/products?${params}`,
        (response) => {
          setProducts(response.products || []);
          setPagination({
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
          });
        },
      );
      return data;
    },
    [get],
  );

  /**
   * Fetch featured products
   */
  const fetchFeaturedProducts = useCallback(async () => {
    const data = await get<Product[]>(
      `${API_URL}/products/featured`,
      (products) => {
        // Don't set as main products, just return for featured section
        return products;
      },
    );
    return data || [];
  }, [get]);

  /**
   * Fetch single product by ID
   */
  const fetchProductById = useCallback(
    async (id: string) => {
      const data = await get<Product>(
        `${API_URL}/products/${id}`,
        (product) => setProduct(product),
      );
      return data;
    },
    [get],
  );

  /**
   * Fetch related products
   */
  const fetchRelatedProducts = useCallback(
    async (id: string) => {
      const data = await get<Product[]>(
        `${API_URL}/products/${id}/related`,
      );
      return data || [];
    },
    [get],
  );

  /**
   * Create new product
   */
  const createProduct = useCallback(
    async (productData: Omit<Product, '_id'>) => {
      const data = await post<Product>(
        `${API_URL}/products`,
        productData,
        (newProduct) => {
          setProducts((prev) => [newProduct, ...prev]);
        },
      );
      return data;
    },
    [post],
  );

  /**
   * Update product
   */
  const updateProduct = useCallback(
    async (id: string, productData: Partial<Product>) => {
      const data = await patch<Product>(
        `${API_URL}/products/${id}`,
        productData,
        (updatedProduct) => {
          setProducts((prev) =>
            prev.map((prod) => (prod._id === id ? updatedProduct : prod)),
          );
          setProduct(updatedProduct);
        },
      );
      return data;
    },
    [patch],
  );

  /**
   * Delete product
   */
  const deleteProduct = useCallback(
    async (id: string) => {
      await delete_(
        `${API_URL}/products/${id}`,
        () => {
          setProducts((prev) => prev.filter((prod) => prod._id !== id));
        },
      );
    },
    [delete_],
  );

  return {
    products,
    product,
    pagination,
    loading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductById,
    fetchRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
