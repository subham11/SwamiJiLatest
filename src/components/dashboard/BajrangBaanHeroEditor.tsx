'use client';

import { useState, useRef } from 'react';

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

type Props = {
  slides: HeroSlide[];
  onSlidesChange: (slides: HeroSlide[]) => void;
  onSave: () => void;
  saving?: boolean;
  locale?: 'en' | 'hi';
};

export function BajrangBaanHeroEditor({ slides, onSlidesChange, onSave, saving = false, locale = 'en' }: Props) {
  const [expandedSlide, setExpandedSlide] = useState<number | null>(0);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string | number) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    onSlidesChange(updatedSlides);
  };

  const handleImageUpload = async (index: number, file: File) => {
    // For now, create a local URL - in production, this would upload to a server
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Store in public folder path format
      // In a real implementation, this would upload to server and get back the URL
      handleSlideChange(index, 'imageUrl', result);
    };
    reader.readAsDataURL(file);
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
      <div style={{ marginBottom: '1.5rem', borderBottom: '2px solid #fb923c', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ea580c' }}>
            🙏 Bajrang Baan Hero Slides
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
          Manage hero section images with titles and descriptions for the Bajrang Baan page
        </p>
      </div>

      {/* Slides */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              border: expandedSlide === index ? '2px solid #fb923c' : '1px solid #e5e7eb',
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
                  background: '#fb923c',
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
                    {slide.title || `Slide ${index + 1}`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                    {slide.imageUrl ? '✅ Image set' : '⚠️ No image'}
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
                      📷 Image
                    </label>
                    <div
                      onClick={() => triggerFileInput(index)}
                      style={{
                        width: '100%',
                        height: '150px',
                        border: '2px dashed #d1d5db',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: slide.imageUrl ? `url(${slide.imageUrl}) center/cover no-repeat` : '#f9fafb',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {!slide.imageUrl && (
                        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                          <div style={{ fontSize: '2rem' }}>📁</div>
                          <div style={{ fontSize: '0.85rem' }}>Click to upload</div>
                        </div>
                      )}
                      {slide.imageUrl && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          padding: '0.5rem',
                          textAlign: 'center',
                          fontSize: '0.75rem',
                        }}>
                          Click to change image
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => { fileInputRefs.current[index] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      style={{ display: 'none' }}
                    />
                    {/* Image URL input */}
                    <input
                      type="text"
                      value={slide.imageUrl}
                      onChange={(e) => handleSlideChange(index, 'imageUrl', e.target.value)}
                      placeholder="/images/Bajrang_Baan/example.png"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.8rem',
                        marginTop: '0.5rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Right: Title & Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '0.35rem',
                        color: '#333',
                      }}>
                        {locale === 'en' ? '📝 Title (English)' : '📝 शीर्षक (हिंदी)'}
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                        placeholder={locale === 'en' ? 'Enter title...' : 'शीर्षक दर्ज करें...'}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.95rem',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: '0.35rem',
                        color: '#333',
                      }}>
                        {locale === 'en' ? '📄 Description (English)' : '📄 विवरण (हिंदी)'}
                      </label>
                      <textarea
                        value={slide.description}
                        onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                        placeholder={locale === 'en' ? 'Enter description...' : 'विवरण दर्ज करें...'}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.9rem',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      />
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
          padding: '0.85rem 1.5rem',
          background: saving ? '#9ca3af' : 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        {saving ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
            Saving...
          </>
        ) : (
          <>
            💾 Save Changes
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
