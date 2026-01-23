'use client';

import { useState, useRef } from 'react';

interface HeroSlide {
  text: string;
  imageUrl: string;
}

type Props = {
  slides: HeroSlide[];
  onSlidesChange: (slides: HeroSlide[]) => void;
  onSave: () => void;
  saving?: boolean;
  locale?: 'en' | 'hi';
};

const DEFAULT_IMAGES = [
  '/images/TempleImages/Temple_01.jpeg',
  '/images/TempleImages/Temple_02.jpeg',
  '/images/TempleImages/Temple_03.jpeg',
  '/images/TempleImages/Temple_04.jpeg',
  '/images/TempleImages/Temple_05.jpeg',
];

export function HomeHeroEditor({ slides, onSlidesChange, onSave, saving = false, locale = 'en' }: Props) {
  const [expandedSlide, setExpandedSlide] = useState<number | null>(0);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    onSlidesChange(updatedSlides);
  };

  const handleImageUpload = async (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleSlideChange(index, 'imageUrl', result);
    };
    reader.readAsDataURL(file);
  };

  const handleUseDefaultImage = (index: number) => {
    handleSlideChange(index, 'imageUrl', DEFAULT_IMAGES[index] || DEFAULT_IMAGES[0]);
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '2px solid #ff4d00', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ff4d00' }}>
            🏠 {locale === 'hi' ? 'होम हीरो स्लाइड्स' : 'Home Hero Slides'}
          </h2>
          <span style={{
            padding: '0.25rem 0.75rem',
            background: locale === 'en' ? '#dbeafe' : '#fef3c7',
            color: locale === 'en' ? '#1e40af' : '#92400e',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}>
            {locale === 'en' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
          {locale === 'hi' 
            ? 'होमपेज हीरो सेक्शन के लिए स्लाइड टेक्स्ट और इमेज प्रबंधित करें'
            : 'Manage slide text and images for the homepage hero section'}
        </p>
      </div>

      {/* Slides */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              border: expandedSlide === index ? '2px solid #ff4d00' : '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#ffffff',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Slide Header */}
            <button
              onClick={() => setExpandedSlide(expandedSlide === index ? null : index)}
              style={{
                width: '100%',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: expandedSlide === index ? '#fff7ed' : '#fafafa',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#ff4d00',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}>
                  {index + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>
                    {slide.text || `Slide ${index + 1}`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                    {slide.imageUrl ? '✅ Image set' : '⚠️ Using default image'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '1.2rem', color: '#999' }}>
                {expandedSlide === index ? '▼' : '▶'}
              </span>
            </button>

            {/* Slide Content (Expanded) */}
            {expandedSlide === index && (
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Left: Image Upload */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: '#333',
                    }}>
                      📷 {locale === 'hi' ? 'इमेज' : 'Image'}
                    </label>
                    <div
                      onClick={() => triggerFileInput(index)}
                      style={{
                        width: '100%',
                        height: '200px',
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#f9fafb',
                      }}
                    >
                      {slide.imageUrl || DEFAULT_IMAGES[index] ? (
                        <img
                          src={slide.imageUrl || DEFAULT_IMAGES[index]}
                          alt={`Slide ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                          <div style={{ fontSize: '0.85rem' }}>
                            {locale === 'hi' ? 'इमेज अपलोड करने के लिए क्लिक करें' : 'Click to upload image'}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={(el) => { fileInputRefs.current[index] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      style={{ display: 'none' }}
                    />
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleUseDefaultImage(index)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          fontSize: '0.75rem',
                          background: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        🔄 {locale === 'hi' ? 'डिफ़ॉल्ट इमेज उपयोग करें' : 'Use Default'}
                      </button>
                      <button
                        onClick={() => triggerFileInput(index)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          fontSize: '0.75rem',
                          background: '#ff4d00',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        📤 {locale === 'hi' ? 'अपलोड' : 'Upload'}
                      </button>
                    </div>
                  </div>

                  {/* Right: Text */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: '#333',
                    }}>
                      ✏️ {locale === 'hi' ? 'स्लाइड टेक्स्ट' : 'Slide Text'}
                    </label>
                    <textarea
                      value={slide.text}
                      onChange={(e) => handleSlideChange(index, 'text', e.target.value)}
                      rows={8}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                      placeholder={locale === 'hi' ? 'स्लाइड टेक्स्ट दर्ज करें...' : 'Enter slide text...'}
                    />
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                      {locale === 'hi' 
                        ? 'इस इमेज पर प्रदर्शित होने वाला टेक्स्ट'
                        : 'Text to display over this image'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: saving ? '#9ca3af' : 'linear-gradient(135deg, #ff4d00 0%, #ff7400 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {saving ? '💾 Saving...' : `💾 ${locale === 'hi' ? 'परिवर्तन सहेजें' : 'Save Changes'}`}
      </button>
    </div>
  );
}
