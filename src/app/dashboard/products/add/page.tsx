'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styles from './ProductForm.module.css';

export default function AddProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const isEdit = !!productId;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    description: '',
    descriptionHi: '',
    price: '',
    originalPrice: '',
    stockStatus: 'in-stock',
    stockQuantity: '0',
    sizes: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    images: [] as string[],
    isActive: true,
    isFeatured: false,
    rating: '0',
    reviewCount: '0',
    specifications: {} as Record<string, string>,
  });

  const [sizeInput, setSizeInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/products/${productId}`);
      const data = await response.json();

      setFormData({
        name: data.name || '',
        nameHi: data.nameHi || '',
        description: data.description || '',
        descriptionHi: data.descriptionHi || '',
        price: data.price?.toString() || '',
        originalPrice: data.originalPrice?.toString() || '',
        stockStatus: data.stockStatus || 'in-stock',
        stockQuantity: data.stockQuantity?.toString() || '0',
        sizes: data.sizes || [],
        categories: data.categories || [],
        tags: data.tags || [],
        images: data.images || [],
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        rating: data.rating?.toString() || '0',
        reviewCount: data.reviewCount?.toString() || '0',
        specifications: data.specifications || {},
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
      };

      const url = isEdit ? `${apiUrl}/products/${productId}` : `${apiUrl}/products`;
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(isEdit ? 'Product updated successfully' : 'Product added successfully');
        router.push('/dashboard/products');
      } else {
        const error = await response.json();
        alert(`Failed to ${isEdit ? 'update' : 'add'} product: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product');
    } finally {
      setSubmitLoading(false);
    }
  };

  const addToArray = (field: 'sizes' | 'categories' | 'tags', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    }
  };

  const removeFromArray = (field: 'sizes' | 'categories' | 'tags' | 'images', index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData({
        ...formData,
        specifications: { ...formData.specifications, [specKey.trim()]: specValue.trim() },
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] });
      setImageInput('');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading product...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{isEdit ? t('Edit Product') : t('Add New Product')}</h1>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← {t('Back')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>{t('Basic Information')}</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t('Product Name (English)')} *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label>{t('Product Name (Hindi)')} *</label>
              <input
                type="text"
                required
                value={formData.nameHi}
                onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t('Description (English)')} *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label>{t('Description (Hindi)')} *</label>
              <textarea
                required
                rows={4}
                value={formData.descriptionHi}
                onChange={(e) => setFormData({ ...formData, descriptionHi: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('Pricing')}</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t('Selling Price')} (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label>{t('Original Price')} (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
              <small>{t('Leave empty if no discount')}</small>
            </div>
          </div>

          {formData.price && formData.originalPrice && (
            <div className={styles.discountPreview}>
              {t('Discount')}: {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)}% OFF
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>{t('Inventory')}</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t('Stock Status')} *</label>
              <select
                value={formData.stockStatus}
                onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
              >
                <option value="in-stock">In Stock</option>
                <option value="limited-stock">Limited Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>{t('Stock Quantity')} *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('Product Variants')}</h2>

          <div className={styles.field}>
            <label>{t('Sizes')}</label>
            <div className={styles.arrayInput}>
              <input
                type="text"
                placeholder="e.g., 6 inches, 8 inches, 9 inches"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('sizes', sizeInput);
                    setSizeInput('');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  addToArray('sizes', sizeInput);
                  setSizeInput('');
                }}
              >
                {t('Add')}
              </button>
            </div>
            <div className={styles.chips}>
              {formData.sizes.map((size, index) => (
                <div key={index} className={styles.chip}>
                  {size}
                  <button type="button" onClick={() => removeFromArray('sizes', index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('Categories & Tags')}</h2>

          <div className={styles.field}>
            <label>{t('Categories')}</label>
            <div className={styles.arrayInput}>
              <input
                type="text"
                placeholder="e.g., Pooja Items, Havan Materials"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('categories', categoryInput);
                    setCategoryInput('');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  addToArray('categories', categoryInput);
                  setCategoryInput('');
                }}
              >
                {t('Add')}
              </button>
            </div>
            <div className={styles.chips}>
              {formData.categories.map((category, index) => (
                <div key={index} className={styles.chip}>
                  {category}
                  <button type="button" onClick={() => removeFromArray('categories', index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label>{t('Tags')}</label>
            <div className={styles.arrayInput}>
              <input
                type="text"
                placeholder="e.g., copper, handmade, traditional"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray('tags', tagInput);
                    setTagInput('');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  addToArray('tags', tagInput);
                  setTagInput('');
                }}
              >
                {t('Add')}
              </button>
            </div>
            <div className={styles.chips}>
              {formData.tags.map((tag, index) => (
                <div key={index} className={styles.chip}>
                  {tag}
                  <button type="button" onClick={() => removeFromArray('tags', index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('Product Images')}</h2>

          <div className={styles.field}>
            <label>{t('Image URLs')}</label>
            <div className={styles.arrayInput}>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
              />
              <button type="button" onClick={addImage}>
                {t('Add')}
              </button>
            </div>
            <div className={styles.imageGallery}>
              {formData.images.map((image, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={image} alt={`Product ${index + 1}`} />
                  <button type="button" onClick={() => removeFromArray('images', index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('Specifications')}</h2>

          <div className={styles.specsInput}>
            <input
              type="text"
              placeholder="Key (e.g., Material)"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value (e.g., Pure Copper)"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
            />
            <button type="button" onClick={addSpecification}>
              {t('Add')}
            </button>
          </div>
          <div className={styles.specsList}>
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className={styles.specItem}>
                <strong>{key}:</strong> {value}
                <button type="button" onClick={() => removeSpecification(key)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('Rating & Reviews')}</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t('Rating')} (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>

            <div className={styles.field}>
              <label>{t('Review Count')}</label>
              <input
                type="number"
                min="0"
                value={formData.reviewCount}
                onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('Status')}</h2>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span>{t('Active (visible to customers)')}</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <span>{t('Featured Product')}</span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={() => router.back()}>
            {t('Cancel')}
          </button>
          <button type="submit" className={styles.submitButton} disabled={submitLoading}>
            {submitLoading ? t('Saving...') : isEdit ? t('Update Product') : t('Add Product')}
          </button>
        </div>
      </form>
    </div>
  );
}
