'use client';

import { useState, useRef } from 'react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface DonationPageContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  guruMessage: {
    title: string;
    message: string;
    guruName: string;
  };
  gallery: {
    title: string;
    images: GalleryImage[];
  };
  intro: {
    text: string;
  };
}

type Props = {
  content: DonationPageContent;
  onContentChange: (content: DonationPageContent) => void;
  onSave: (componentId: string, componentContent: Record<string, any>) => Promise<void>;
  saving?: boolean;
  locale?: 'en' | 'hi';
};

export function DonationPageEditor({ content, onContentChange, onSave, saving = false, locale = 'en' }: Props) {
  const [activeSection, setActiveSection] = useState<'hero' | 'guruMessage' | 'gallery' | 'intro'>('hero');
  const [expandedImage, setExpandedImage] = useState<number | null>(0);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleHeroChange = (field: keyof DonationPageContent['hero'], value: string) => {
    onContentChange({
      ...content,
      hero: { ...content.hero, [field]: value }
    });
  };

  const handleGuruMessageChange = (field: keyof DonationPageContent['guruMessage'], value: string) => {
    onContentChange({
      ...content,
      guruMessage: { ...content.guruMessage, [field]: value }
    });
  };

  const handleGalleryTitleChange = (value: string) => {
    onContentChange({
      ...content,
      gallery: { ...content.gallery, title: value }
    });
  };

  const handleGalleryImageChange = (index: number, field: keyof GalleryImage, value: string | number) => {
    const updatedImages = [...content.gallery.images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    onContentChange({
      ...content,
      gallery: { ...content.gallery, images: updatedImages }
    });
  };

  const handleIntroChange = (value: string) => {
    onContentChange({
      ...content,
      intro: { text: value }
    });
  };

  const handleImageUpload = async (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleGalleryImageChange(index, 'src', result);
    };
    reader.readAsDataURL(file);
  };

  const handleHeroImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleHeroChange('backgroundImage', result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleSaveSection = async (componentId: string, componentContent: Record<string, any>) => {
    setSavingSection(componentId);
    setSaveSuccess(null);
    try {
      await onSave(componentId, componentContent);
      setSaveSuccess(componentId);
      setTimeout(() => setSaveSuccess(null), 2000);
    } finally {
      setSavingSection(null);
    }
  };

  const sectionTabs = [
    { id: 'hero', label: locale === 'hi' ? '🎯 हीरो बैनर' : '🎯 Hero Banner', icon: '🎯' },
    { id: 'guruMessage', label: locale === 'hi' ? '🙏 गुरु संदेश' : '🙏 Guru Message', icon: '🙏' },
    { id: 'gallery', label: locale === 'hi' ? '🖼️ गैलरी' : '🖼️ Gallery', icon: '🖼️' },
    { id: 'intro', label: locale === 'hi' ? '📝 परिचय' : '📝 Introduction', icon: '📝' },
  ];

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
            🙏 {locale === 'hi' ? 'दान पृष्ठ संपादक' : 'Donation Page Editor'}
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
            ? 'दान पृष्ठ की सामग्री प्रबंधित करें - हीरो, गुरु संदेश, गैलरी और परिचय'
            : 'Manage donation page content - Hero, Guru Message, Gallery and Introduction'}
        </p>
      </div>

      {/* Section Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '0.75rem'
      }}>
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            style={{
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '8px',
              background: activeSection === tab.id 
                ? 'linear-gradient(135deg, #ff4d00 0%, #ff7400 100%)' 
                : '#f5f5f5',
              color: activeSection === tab.id ? '#fff' : '#666',
              fontWeight: activeSection === tab.id ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section Editor */}
      {activeSection === 'hero' && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#333' }}>
            {locale === 'hi' ? 'हीरो बैनर सेक्शन' : 'Hero Banner Section'}
          </h3>
          
          {/* Background Image */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '📷 पृष्ठभूमि छवि' : '📷 Background Image'}
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '200px',
                height: '120px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px dashed #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
              }}>
                {content.hero.backgroundImage ? (
                  <img 
                    src={content.hero.backgroundImage} 
                    alt="Hero background" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <span style={{ color: '#999', fontSize: '0.85rem' }}>No image</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0])}
                  style={{ marginBottom: '0.5rem' }}
                />
                <input
                  type="text"
                  value={content.hero.backgroundImage}
                  onChange={(e) => handleHeroChange('backgroundImage', e.target.value)}
                  placeholder={locale === 'hi' ? 'या URL दर्ज करें' : 'Or enter URL'}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '📌 शीर्षक' : '📌 Title'}
            </label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              placeholder={locale === 'hi' ? 'हीरो शीर्षक दर्ज करें' : 'Enter hero title'}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Subtitle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '📝 उपशीर्षक' : '📝 Subtitle'}
            </label>
            <textarea
              value={content.hero.subtitle}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              placeholder={locale === 'hi' ? 'हीरो उपशीर्षक दर्ज करें' : 'Enter hero subtitle'}
              rows={2}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            onClick={() => handleSaveSection('donation-hero', content.hero)}
            disabled={saving || savingSection === 'donation-hero'}
            style={{
              padding: '0.75rem 1.5rem',
              background: saveSuccess === 'donation-hero' 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ff4d00 0%, #ff7400 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: saving || savingSection === 'donation-hero' ? 'not-allowed' : 'pointer',
              opacity: saving || savingSection === 'donation-hero' ? 0.7 : 1,
            }}
          >
            {savingSection === 'donation-hero' ? '💾 Saving...' : saveSuccess === 'donation-hero' ? '✅ Saved!' : '💾 Save Hero Section'}
          </button>
        </div>
      )}

      {/* Guru Message Section Editor */}
      {activeSection === 'guruMessage' && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#333' }}>
            {locale === 'hi' ? 'गुरुदेव का संदेश' : 'Message from Gurudev'}
          </h3>

          {/* Title */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '📌 सेक्शन शीर्षक' : '📌 Section Title'}
            </label>
            <input
              type="text"
              value={content.guruMessage.title}
              onChange={(e) => handleGuruMessageChange('title', e.target.value)}
              placeholder={locale === 'hi' ? 'शीर्षक दर्ज करें' : 'Enter title'}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '💬 संदेश' : '💬 Message'}
            </label>
            <textarea
              value={content.guruMessage.message}
              onChange={(e) => handleGuruMessageChange('message', e.target.value)}
              placeholder={locale === 'hi' ? 'गुरुदेव का संदेश दर्ज करें' : 'Enter Gurudev\'s message'}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontStyle: 'italic',
              }}
            />
          </div>

          {/* Guru Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '👤 गुरु का नाम' : '👤 Guru Name'}
            </label>
            <input
              type="text"
              value={content.guruMessage.guruName}
              onChange={(e) => handleGuruMessageChange('guruName', e.target.value)}
              placeholder={locale === 'hi' ? 'गुरु का नाम दर्ज करें' : 'Enter guru name'}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <button
            onClick={() => handleSaveSection('donation-guruMessage', content.guruMessage)}
            disabled={saving || savingSection === 'donation-guruMessage'}
            style={{
              padding: '0.75rem 1.5rem',
              background: saveSuccess === 'donation-guruMessage' 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ff4d00 0%, #ff7400 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: saving || savingSection === 'donation-guruMessage' ? 'not-allowed' : 'pointer',
              opacity: saving || savingSection === 'donation-guruMessage' ? 0.7 : 1,
            }}
          >
            {savingSection === 'donation-guruMessage' ? '💾 Saving...' : saveSuccess === 'donation-guruMessage' ? '✅ Saved!' : '💾 Save Guru Message'}
          </button>
        </div>
      )}

      {/* Gallery Section Editor */}
      {activeSection === 'gallery' && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#333' }}>
            {locale === 'hi' ? 'सेवा गतिविधियाँ गैलरी' : 'Seva Activities Gallery'}
          </h3>

          {/* Gallery Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '📌 गैलरी शीर्षक' : '📌 Gallery Title'}
            </label>
            <input
              type="text"
              value={content.gallery.title}
              onChange={(e) => handleGalleryTitleChange(e.target.value)}
              placeholder={locale === 'hi' ? 'गैलरी शीर्षक दर्ज करें' : 'Enter gallery title'}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {content.gallery.images.map((image, index) => (
              <div
                key={image.id}
                style={{
                  border: expandedImage === index ? '2px solid #fb923c' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#ffffff',
                  overflow: 'hidden',
                }}
              >
                {/* Image Header */}
                <button
                  onClick={() => setExpandedImage(expandedImage === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: expandedImage === index ? '#fff7ed' : '#fafafa',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fb923c',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}>
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
                        {image.alt || `Image ${index + 1}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>
                        {image.src ? '✅ Image set' : '⚠️ No image'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1rem', color: '#999' }}>
                    {expandedImage === index ? '▼' : '▶'}
                  </span>
                </button>

                {/* Image Content (Expanded) */}
                {expandedImage === index && (
                  <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }}>
                      {/* Image Preview */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
                          Preview
                        </label>
                        <div style={{
                          width: '150px',
                          height: '150px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px dashed #ddd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#fafafa',
                        }}>
                          {image.src ? (
                            <img src={image.src} alt={image.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ color: '#999', fontSize: '0.8rem' }}>No image</span>
                          )}
                        </div>
                      </div>

                      {/* Image Fields */}
                      <div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: '#333' }}>
                            {locale === 'hi' ? 'छवि URL / अपलोड' : 'Image URL / Upload'}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            ref={(el) => { fileInputRefs.current[index] = el; }}
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                            style={{ display: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={image.src}
                              onChange={(e) => handleGalleryImageChange(index, 'src', e.target.value)}
                              placeholder="/images/donation/..."
                              style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                              }}
                            />
                            <button
                              onClick={() => triggerFileInput(index)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: '#f5f5f5',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                              }}
                            >
                              📁 Upload
                            </button>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: '#333' }}>
                            {locale === 'hi' ? 'कैप्शन / Alt टेक्स्ट' : 'Caption / Alt Text'}
                          </label>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => handleGalleryImageChange(index, 'alt', e.target.value)}
                            placeholder={locale === 'hi' ? 'छवि विवरण' : 'Image description'}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
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

          <button
            onClick={() => handleSaveSection('donation-gallery', content.gallery)}
            disabled={saving || savingSection === 'donation-gallery'}
            style={{
              padding: '0.75rem 1.5rem',
              background: saveSuccess === 'donation-gallery' 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ff4d00 0%, #ff7400 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: saving || savingSection === 'donation-gallery' ? 'not-allowed' : 'pointer',
              opacity: saving || savingSection === 'donation-gallery' ? 0.7 : 1,
            }}
          >
            {savingSection === 'donation-gallery' ? '💾 Saving...' : saveSuccess === 'donation-gallery' ? '✅ Saved!' : '💾 Save Gallery'}
          </button>
        </div>
      )}

      {/* Intro Section Editor */}
      {activeSection === 'intro' && (
        <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#333' }}>
            {locale === 'hi' ? 'परिचय टेक्स्ट' : 'Introduction Text'}
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              {locale === 'hi' ? '📝 आश्रम का परिचय' : '📝 Ashram Introduction'}
            </label>
            <textarea
              value={content.intro.text}
              onChange={(e) => handleIntroChange(e.target.value)}
              placeholder={locale === 'hi' ? 'आश्रम के बारे में परिचय दर्ज करें' : 'Enter introduction about the ashram'}
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '0.95rem',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />
          </div>

          <button
            onClick={() => handleSaveSection('donation-intro', content.intro)}
            disabled={saving || savingSection === 'donation-intro'}
            style={{
              padding: '0.75rem 1.5rem',
              background: saveSuccess === 'donation-intro' 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ff4d00 0%, #ff7400 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: saving || savingSection === 'donation-intro' ? 'not-allowed' : 'pointer',
              opacity: saving || savingSection === 'donation-intro' ? 0.7 : 1,
            }}
          >
            {savingSection === 'donation-intro' ? '💾 Saving...' : saveSuccess === 'donation-intro' ? '✅ Saved!' : '💾 Save Introduction'}
          </button>
        </div>
      )}
    </div>
  );
}
