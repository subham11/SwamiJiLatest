'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styles from './products.module.css';

interface Product {
  _id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stockStatus: string;
  rating: number;
  reviewCount: number;
  images: string[];
  categories: string[];
  isFeatured: boolean;
}

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('-createdAt');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchFeaturedProducts();
    fetchProducts();
    fetchCategories();
  }, [page, selectedCategory, sortBy]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products/featured`);
      const data = await response.json();
      setFeaturedProducts(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        active: 'true',
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy) params.append('sortBy', sortBy);

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
      const response = await fetch(`${apiUrl}/categories/top-level`);
      const data = await response.json();
      setCategories(data.map((cat: any) => cat.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getStockBadgeClass = (status: string) => {
    switch (status) {
      case 'in-stock':
        return styles.inStock;
      case 'limited-stock':
        return styles.limitedStock;
      case 'out-of-stock':
        return styles.outOfStock;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>{t('Our Products')}</h1>
        <p>{t('Explore our collection of sacred items and spiritual products')}</p>
      </section>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3>{t('Categories')}</h3>
            <div className={styles.categoryList}>
              <button
                className={`${styles.categoryItem} ${selectedCategory === '' ? styles.active : ''}`}
                onClick={() => {
                  setSelectedCategory('');
                  setPage(1);
                }}
              >
                {t('All Products')}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>{t('Sort By')}</h3>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className={styles.sortSelect}
            >
              <option value="-createdAt">{t('Newest First')}</option>
              <option value="price">{t('Price: Low to High')}</option>
              <option value="-price">{t('Price: High to Low')}</option>
              <option value="-rating">{t('Highest Rated')}</option>
              <option value="-orderCount">{t('Most Popular')}</option>
            </select>
          </div>
        </aside>

        <main className={styles.main}>
          {/* Featured Products Section */}
          {!selectedCategory && page === 1 && featuredProducts.length > 0 && (
            <div className={styles.featuredSection}>
              <h2>{t('Featured Products')}</h2>
              <div className={styles.featuredGrid}>
                {featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    className={styles.featuredCard}
                    onClick={() => router.push(`/products/${product._id}`)}
                  >
                    <div className={styles.featuredImage}>
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className={styles.noImage}>No Image</div>
                      )}
                      <div className={styles.featuredBadge}>★ {t('Featured')}</div>
                    </div>
                    <div className={styles.featuredInfo}>
                      <h3>{i18n.language === 'hi' ? product.nameHi : product.name}</h3>
                      <div className={styles.rating}>
                        <span className={styles.stars}>
                          {'★'.repeat(Math.floor(product.rating))}
                          {'☆'.repeat(5 - Math.floor(product.rating))}
                        </span>
                        <span className={styles.reviewCount}>({product.reviewCount})</span>
                      </div>
                      <div className={styles.priceSection}>
                        <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <>
                            <span className={styles.originalPrice}>
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                            <span className={styles.discount}>{product.discount}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>{t('Loading products...')}</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{t('No products found')}</p>
            </div>
          ) : (
            <>
              <div className={styles.productsGrid}>
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={styles.productCard}
                    onClick={() => router.push(`/products/${product._id}`)}
                  >
                    <div className={styles.imageContainer}>
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className={styles.noImage}>No Image</div>
                      )}
                      {product.discount && product.discount > 0 && (
                        <div className={styles.discountBadge}>{product.discount}% OFF</div>
                      )}
                      <span className={`${styles.stockBadge} ${getStockBadgeClass(product.stockStatus)}`}>
                        {product.stockStatus === 'in-stock' && t('In Stock')}
                        {product.stockStatus === 'limited-stock' && t('Limited Stock')}
                        {product.stockStatus === 'out-of-stock' && t('Out of Stock')}
                      </span>
                    </div>

                    <div className={styles.productInfo}>
                      <h3>{i18n.language === 'hi' ? product.nameHi : product.name}</h3>

                      <div className={styles.rating}>
                        <span className={styles.stars}>
                          {'★'.repeat(Math.floor(product.rating))}
                          {'☆'.repeat(5 - Math.floor(product.rating))}
                        </span>
                        <span className={styles.reviewCount}>({product.reviewCount})</span>
                      </div>

                      <div className={styles.priceSection}>
                        <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className={styles.originalPrice}>
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {product.categories.length > 0 && (
                        <div className={styles.categories}>
                          {product.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className={styles.categoryTag}>
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={styles.pageButton}
                  >
                    ← {t('Previous')}
                  </button>
                  <span className={styles.pageInfo}>
                    {t('Page')} {page} {t('of')} {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className={styles.pageButton}
                  >
                    {t('Next')} →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
