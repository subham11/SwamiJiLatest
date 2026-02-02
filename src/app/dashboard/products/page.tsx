'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styles from './ProductManagement.module.css';

interface Product {
  _id: string;
  name: string;
  nameHi: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stockStatus: string;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  images: string[];
  categories: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function ProductManagementPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        active: 'false', // Show all products in admin
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`${apiUrl}/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/products/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        alert('Product status updated');
        fetchProducts();
      } else {
        alert('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('Product Management')}</h1>
        <button
          className={styles.addButton}
          onClick={() => router.push('/dashboard/products/add')}
        >
          + {t('Add New Product')}
        </button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder={t('Search products...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">{t('All Categories')}</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.noImage}>No Image</div>
                      )}
                    </td>
                    <td>
                      <div className={styles.productName}>
                        {i18n.language === 'hi' ? product.nameHi : product.name}
                      </div>
                      {product.categories.length > 0 && (
                        <div className={styles.categories}>
                          {product.categories.join(', ')}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.price}>₹{product.price}</div>
                      {product.originalPrice && (
                        <div className={styles.originalPrice}>
                          ₹{product.originalPrice}
                        </div>
                      )}
                      {product.discount && (
                        <div className={styles.discount}>
                          {product.discount}% OFF
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`${styles.stockBadge} ${styles[product.stockStatus]}`}>
                        {product.stockStatus}
                      </span>
                      <div className={styles.stockQty}>
                        Qty: {product.stockQuantity}
                      </div>
                    </td>
                    <td>
                      <div className={styles.rating}>
                        ⭐ {product.rating.toFixed(1)}
                      </div>
                      <div className={styles.reviews}>
                        ({product.reviewCount})
                      </div>
                    </td>
                    <td>
                      <button
                        className={`${styles.statusButton} ${
                          product.isActive ? styles.active : styles.inactive
                        }`}
                        onClick={() => handleToggleStatus(product._id, product.isActive)}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      {product.isFeatured ? (
                        <span className={styles.featuredBadge}>⭐ Featured</span>
                      ) : (
                        <span className={styles.notFeatured}>-</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={styles.pageButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
