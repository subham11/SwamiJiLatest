'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styles from './productDetail.module.css';

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
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes?: string[];
  sizeWisePrice?: Record<string, number>;
  categories: string[];
  tags: string[];
  specifications?: Record<string, string>;
  metaTitle?: string;
  metaDescription?: string;
  viewCount: number;
  orderCount: number;
}

export default function ProductDetailPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/products/${productId}`);
      const data = await response.json();
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products/${productId}/related`);
      const data = await response.json();
      setRelatedProducts(data);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = product ? (i18n.language === 'hi' ? product.nameHi : product.name) : '';

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
      whatsapp: `https://wa.me/?text=${title} ${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    if (product.sizes && selectedSize && product.sizeWisePrice) {
      return product.sizeWisePrice[selectedSize] || product.price;
    }
    return product.price;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{t('Loading product...')}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>{t('Product not found')}</h1>
        <button onClick={() => router.push('/products')} className={styles.backButton}>
          {t('Back to Products')}
        </button>
      </div>
    );
  }

  const currentPrice = getCurrentPrice();
  const displayName = i18n.language === 'hi' ? product.nameHi : product.name;
  const displayDescription = i18n.language === 'hi' ? product.descriptionHi : product.description;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <button onClick={() => router.push('/')}>{t('Home')}</button>
        <span>/</span>
        <button onClick={() => router.push('/products')}>{t('Products')}</button>
        <span>/</span>
        <span>{displayName}</span>
      </div>

      <div className={styles.productSection}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            {product.images[selectedImage] ? (
              <img src={product.images[selectedImage]} alt={displayName} />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${displayName} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.productDetails}>
          <h1>{displayName}</h1>

          <div className={styles.stockStatus}>
            {product.stockStatus === 'in-stock' && (
              <span className={styles.inStock}>✓ {t('In Stock')}</span>
            )}
            {product.stockStatus === 'limited-stock' && (
              <span className={styles.limitedStock}>⚠ {t('Limited Stock')}</span>
            )}
            {product.stockStatus === 'out-of-stock' && (
              <span className={styles.outOfStock}>✗ {t('Out of Stock')}</span>
            )}
          </div>

          <div className={styles.rating}>
            <span className={styles.stars}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span className={styles.ratingValue}>{product.rating}</span>
            <span className={styles.reviewCount}>({product.reviewCount}+ {t('Reviews')})</span>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.price}>₹{currentPrice.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
                <span className={styles.discountBadge}>{product.discount}% Off</span>
              </>
            )}
          </div>

          <div className={styles.description}>
            <p>{displayDescription}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className={styles.sizeSection}>
              <label>{t('Select Size')}</label>
              <div className={styles.sizes}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.active : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.quantitySection}>
            <label>{t('Quantity')}</label>
            <div className={styles.quantityControls}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input type="number" value={quantity} readOnly />
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={product.stockStatus === 'out-of-stock'}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.addToCart}
              disabled={product.stockStatus === 'out-of-stock'}
            >
              {product.stockStatus === 'out-of-stock' ? t('Out of Stock') : t('Add to Cart')}
            </button>
            <button className={styles.buyNow}>
              {t('Buy Now')}
            </button>
          </div>

          <div className={styles.shareSection}>
            <label>{t('Share')}:</label>
            <div className={styles.shareButtons}>
              <button onClick={() => handleShare('facebook')} title="Facebook">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button onClick={() => handleShare('twitter')} title="Twitter">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button onClick={() => handleShare('pinterest')} title="Pinterest">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </button>
              <button onClick={() => handleShare('whatsapp')} title="WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
          </div>

          {product.categories.length > 0 && (
            <div className={styles.categories}>
              <label>{t('Categories')}:</label>
              <div className={styles.categoryTags}>
                {product.categories.map((cat) => (
                  <span key={cat} className={styles.categoryTag}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className={styles.specificationsSection}>
          <h2>{t('Specifications')}</h2>
          <table className={styles.specificationsTable}>
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td className={styles.specKey}>{key}</td>
                  <td className={styles.specValue}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2>{t('Related Products')}</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((relProd) => (
              <div
                key={relProd._id}
                className={styles.relatedCard}
                onClick={() => router.push(`/products/${relProd._id}`)}
              >
                <div className={styles.relatedImage}>
                  {relProd.images[0] ? (
                    <img src={relProd.images[0]} alt={relProd.name} />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                </div>
                <div className={styles.relatedInfo}>
                  <h3>{i18n.language === 'hi' ? relProd.nameHi : relProd.name}</h3>
                  <div className={styles.relatedPrice}>
                    <span className={styles.price}>₹{relProd.price.toLocaleString()}</span>
                    {relProd.originalPrice && (
                      <span className={styles.originalPrice}>
                        ₹{relProd.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
