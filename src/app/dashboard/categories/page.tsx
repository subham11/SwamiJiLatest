'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CategoryManagement.module.css';

interface Category {
  _id: string;
  name: string;
  nameHi: string;
  description?: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  parentCategory?: string;
  image?: string;
}

export default function CategoryManagementPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.nameHi.includes(searchTerm) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Category Management</h1>
        <button
          className={styles.addButton}
          onClick={() => router.push('/dashboard/categories/add')}
        >
          + Add Category
        </button>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Loading categories...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name (EN)</th>
                <th>Name (HI)</th>
                <th>Slug</th>
                <th>Order</th>
                <th>Status</th>
                <th>Parent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.noData}>
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.nameHi}</td>
                    <td>
                      <code>{category.slug}</code>
                    </td>
                    <td>{category.displayOrder}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          category.isActive ? styles.active : styles.inactive
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{category.parentCategory || '-'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() =>
                            router.push(`/dashboard/categories/edit/${category._id}`)
                          }
                        >
                          Edit
                        </button>
                        {deleteConfirm === category._id ? (
                          <div className={styles.deleteConfirm}>
                            <span>Sure?</span>
                            <button
                              className={styles.confirmYes}
                              onClick={() => handleDelete(category._id)}
                            >
                              Yes
                            </button>
                            <button
                              className={styles.confirmNo}
                              onClick={() => setDeleteConfirm(null)}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            className={styles.deleteButton}
                            onClick={() => setDeleteConfirm(category._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
