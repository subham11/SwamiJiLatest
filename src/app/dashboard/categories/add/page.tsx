'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './CategoryForm.module.css';

interface CategoryFormData {
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  slug: string;
  image: string;
  isActive: boolean;
  displayOrder: number;
  parentCategory: string;
}

export default function AddCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;
  const categoryId = params?.id as string;

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    nameHi: '',
    description: '',
    descriptionHi: '',
    slug: '',
    image: '',
    isActive: true,
    displayOrder: 0,
    parentCategory: '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchCategory();
    }
  }, [isEdit, categoryId]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFormData({
        name: data.name || '',
        nameHi: data.nameHi || '',
        description: data.description || '',
        descriptionHi: data.descriptionHi || '',
        slug: data.slug || '',
        image: data.image || '',
        isActive: data.isActive ?? true,
        displayOrder: data.displayOrder || 0,
        parentCategory: data.parentCategory || '',
      });
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEdit
        ? `${apiUrl}/categories/${categoryId}`
        : `${apiUrl}/categories`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      router.push('/dashboard/categories');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{isEdit ? 'Edit Category' : 'Add Category'}</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Basic Information</h3>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Name (English) *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={generateSlug}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Name (Hindi) *</label>
              <input
                type="text"
                name="nameHi"
                value={formData.nameHi}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="auto-generated-slug"
              />
              <small>URL-friendly identifier (auto-generated from name)</small>
            </div>
            <div className={styles.formGroup}>
              <label>Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className={styles.input}
                min="0"
              />
              <small>Lower numbers appear first</small>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Description</h3>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Description (English)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description (Hindi)</label>
              <textarea
                name="descriptionHi"
                value={formData.descriptionHi}
                onChange={handleChange}
                rows={4}
                className={styles.textarea}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Additional Settings</h3>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Parent Category</label>
              <select
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">None (Top Level)</option>
                {categories
                  .filter((cat) => cat._id !== categoryId)
                  .map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.push('/dashboard/categories')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
