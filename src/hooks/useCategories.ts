'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApi, ApiError } from './useApi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Interface for category data
 */
export interface Category {
  _id: string;
  name: string;
  nameHi: string;
  slug: string;
  description?: string;
  descriptionHi?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  parentCategory?: string;
}

/**
 * Hook for category API operations
 */
export const useCategories = () => {
  const { get, post, patch, delete: delete_, loading, error } = useApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  /**
   * Fetch all categories
   */
  const fetchCategories = useCallback(async () => {
    const data = await get<Category[]>(
      `${API_URL}/categories`,
      (categories) => setCategories(categories || []),
    );
    return data;
  }, [get]);

  /**
   * Fetch top-level categories
   */
  const fetchTopLevelCategories = useCallback(async () => {
    const data = await get<Category[]>(
      `${API_URL}/categories/top-level`,
      (categories) => setCategories(categories || []),
    );
    return data;
  }, [get]);

  /**
   * Fetch category by ID
   */
  const fetchCategoryById = useCallback(
    async (id: string) => {
      const data = await get<Category>(
        `${API_URL}/categories/${id}`,
        (category) => setCategory(category),
      );
      return data;
    },
    [get],
  );

  /**
   * Fetch category by slug
   */
  const fetchCategoryBySlug = useCallback(
    async (slug: string) => {
      const data = await get<Category>(
        `${API_URL}/categories/slug/${slug}`,
        (category) => setCategory(category),
      );
      return data;
    },
    [get],
  );

  /**
   * Create new category
   */
  const createCategory = useCallback(
    async (categoryData: Omit<Category, '_id'>) => {
      const data = await post<Category>(
        `${API_URL}/categories`,
        categoryData,
        (newCategory) => {
          setCategories((prev) => [...prev, newCategory]);
        },
      );
      return data;
    },
    [post],
  );

  /**
   * Update category
   */
  const updateCategory = useCallback(
    async (id: string, categoryData: Partial<Category>) => {
      const data = await patch<Category>(
        `${API_URL}/categories/${id}`,
        categoryData,
        (updatedCategory) => {
          setCategories((prev) =>
            prev.map((cat) => (cat._id === id ? updatedCategory : cat)),
          );
          setCategory(updatedCategory);
        },
      );
      return data;
    },
    [patch],
  );

  /**
   * Delete category
   */
  const deleteCategory = useCallback(
    async (id: string) => {
      await delete_(
        `${API_URL}/categories/${id}`,
        () => {
          setCategories((prev) => prev.filter((cat) => cat._id !== id));
        },
      );
    },
    [delete_],
  );

  return {
    categories,
    category,
    loading,
    error,
    fetchCategories,
    fetchTopLevelCategories,
    fetchCategoryById,
    fetchCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
