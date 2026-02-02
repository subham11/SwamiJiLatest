'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories, Category } from '@/hooks/useCategories';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSkeletons, LoadingSpinner } from '@/components/Loading';
import styles from './products.module.css';

/**
 * Products Page - Displays products with filtering and pagination
 * Uses custom hooks for API operations following React best practices
 */
export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Custom hooks for API calls
  const {
    products,
    pagination,
    loading,
    error: productError,
    fetchProducts,
    fetchFeaturedProducts,
  } = useProducts();

  const {
    categories,
    error: categoryError,
    fetchTopLevelCategories,
  } = useCategories();

  // Local state
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Initialize page - fetch featured products and categories
   */
  useEffect(() => {
    const initialize = async () => {
      const featured = await fetchFeaturedProducts();
      if (featured) {
        setFeaturedProducts(featured.slice(0, 4));
      }
      await fetchTopLevelCategories();
    };

    initialize();
  }, [fetchFeaturedProducts, fetchTopLevelCategories]);

  /**
   * Fetch products when filters change
   */
  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts(page, {
        category: selectedCategory,
        sort: sortBy,
      });
    };

    loadProducts();
  }, [page, selectedCategory, sortBy, fetchProducts]);

  /**
   * Handle errors
   */
  useEffect(() => {
    if (productError) {
      setErrorMessage(productError.message);
    }
  }, [productError]);

  /**
   * Handle category selection with reset
   */
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page
  }, []);

  /**
   * Get CSS class for stock status
   */
  const getStockBadgeClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      'in-stock': styles.inStock,
      'limited-stock': styles.limitedStock,
      'out-of-stock': styles.outOfStock,
    };
    return statusMap[status] || '';
  };

  /**
   * Get stock text based on language
   */
  const getStockText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'in-stock': t('In Stock'),
      'limited-stock': t('Limited Stock'),
      'out-of-stock': t('Out of Stock'),
    };
    return statusMap[status] || '';
  };

  const categoryNames = categories.map((cat: Category) => cat.name);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>{t('Our Products')}</h1>
        <p>{t('Explore our collection of sacred items and spiritual products')}</p>
      </section>

      {/* Error Message */}
      <ErrorMessage error={errorMessage} onDismiss={() => setErrorMessage(null)} />

      <div className={styles.content}>
        {/* Sidebar - Filters */}
        <aside className={styles.sidebar}>
          {/* Categories Filter */}
          <div className={styles.filterSection}>
            <h3>{t('Categories')}</h3>
            <div className={styles.categoryList}>
              <button
                className={`${styles.categoryItem} ${selectedCategory === '' ? styles.active : ''}`}
                onClick={() => handleCategoryChange('')}
                aria-pressed={selectedCategory === ''}
              >
                {t('All Products')}
              </button>
              {categoryNames.map((category) => (
                <button
                  key={category}
                  className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => handleCategoryChange(category)}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className={styles.filterSection}>
            <h3>{t('Sort By')}</h3>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className={styles.sortSelect}
              aria-label={t('Sort products by')}
            >
              <option value="-createdAt">{t('Newest First')}</option>
              <option value="price">{t('Price: Low to High')}</option>
              <option value="-price">{t('Price: High to Low')}</option>
              <option value="-rating">{t('Highest Rated')}</option>
              <option value="-orderCount">{t('Most Popular')}</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Featured Products Section */}
          {!selectedCategory && page === 1 && featuredProducts.length > 0 && (
            <section className={styles.featuredSection} aria-label={t('Featured Products')}>
              <h2>{t('Featured Products')}</h2>
              <div className={styles.featuredGrid}>
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isFeatured
                    onClick={() => router.push(`/products/${product._id}`)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Products Grid or Loading/Empty State */}
          {loading ? (
            <LoadingSkeletons count={12} type="card" />
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{t('No products found')}</p>
            </div>
          ) : (
            <>
              <div className={styles.productsGrid} role="grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => router.push(`/products/${product._id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Product Card Component - Reusable product display
 */
interface ProductCardProps {
  product: Product;
  isFeatured?: boolean;
  onClick: () => void;
}

function ProductCard({ product, isFeatured = false, onClick }: ProductCardProps) {
  const { i18n, t } = useTranslation();
  const displayName = i18n.language === 'hi' ? product.nameHi : product.name;

  const getStockBadgeClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      'in-stock': 'bg-green-500',
      'limited-stock': 'bg-yellow-500',
      'out-of-stock': 'bg-red-500',
    };
    return statusMap[status] || '';
  };

  const getStockText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'in-stock': t('In Stock'),
      'limited-stock': t('Limited Stock'),
      'out-of-stock': t('Out of Stock'),
    };
    return statusMap[status] || '';
  };

  if (isFeatured) {
    return (
      <div className={styles.featuredCard} onClick={onClick} role="button" tabIndex={0}>
        <div className={styles.featuredImage}>
          {product.images[0] ? (
            <img src={product.images[0]} alt={displayName} loading="lazy" />
          ) : (
            <div className={styles.noImage}>{t('No Image')}</div>
          )}
          <div className={styles.featuredBadge}>★ {t('Featured')}</div>
        </div>
        <div className={styles.featuredInfo}>
          <h3>{displayName}</h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <PriceSection
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imageContainer}>
        {product.images[0] ? (
          <img src={product.images[0]} alt={displayName} loading="lazy" />
        ) : (
          <div className={styles.noImage}>{t('No Image')}</div>
        )}
        {product.discount && product.discount > 0 && (
          <div className={styles.discountBadge}>{product.discount}% OFF</div>
        )}
        <span className={`${styles.stockBadge} ${getStockBadgeClass(product.stockStatus)}`}>
          {getStockText(product.stockStatus)}
        </span>
      </div>

      <div className={styles.productInfo}>
        <h3>{displayName}</h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <PriceSection
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
        />

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
  );
}

/**
 * Star Rating Component
 */
interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

function StarRating({ rating, reviewCount }: StarRatingProps) {
  return (
    <div className={styles.rating}>
      <span className={styles.stars}>
        {'★'.repeat(Math.floor(rating))}
        {'☆'.repeat(5 - Math.floor(rating))}
      </span>
      <span className={styles.reviewCount}>({reviewCount})</span>
    </div>
  );
}

/**
 * Price Section Component
 */
interface PriceSectionProps {
  price: number;
  originalPrice?: number;
  discount?: number;
}

function PriceSection({ price, originalPrice, discount }: PriceSectionProps) {
  return (
    <div className={styles.priceSection}>
      <span className={styles.price}>₹{price.toLocaleString()}</span>
      {originalPrice && (
        <>
          <span className={styles.originalPrice}>₹{originalPrice.toLocaleString()}</span>
          {discount && <span className={styles.discount}>{discount}% OFF</span>}
        </>
      )}
    </div>
  );
}

/**
 * Pagination Component
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.pagination} role="navigation" aria-label={t('Pagination')}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={styles.pageButton}
        aria-label={t('Previous page')}
      >
        ← {t('Previous')}
      </button>
      <span className={styles.pageInfo}>
        {t('Page')} {currentPage} {t('of')} {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={styles.pageButton}
        aria-label={t('Next page')}
      >
        {t('Next')} →
      </button>
    </div>
  );
}
