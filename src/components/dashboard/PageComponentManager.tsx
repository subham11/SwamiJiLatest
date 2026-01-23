'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { usePageContent, ComponentContent, PageSummary } from '@/hooks/usePageContent';
import { PageList } from './PageList';
import { ComponentList } from './ComponentList';
import { ComponentEditor } from './ComponentEditor';
import { BajrangBaanHeroEditor } from './BajrangBaanHeroEditor';
import { HomeHeroEditor } from './HomeHeroEditor';
import { DonationPageEditor } from './DonationPageEditor';

export function PageComponentManager() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, any>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    pages,
    selectedPage,
    loading,
    error,
    saving,
    usingFallback,
    setError,
    fetchPage,
    updateComponent
  } = usePageContent(locale);

  // Fetch the selected page when pageId or locale changes
  useEffect(() => {
    if (selectedPageId) {
      fetchPage(selectedPageId);
      setSelectedComponentId(null);
      setEditedContent({});
    }
  }, [selectedPageId, locale, fetchPage]);

  // Initialize editedContent for donation page when selectedPage loads
  useEffect(() => {
    if (selectedPageId === 'donation' && selectedPage && Object.keys(editedContent).length === 0) {
      const heroComp = selectedPage.components.find(c => c.id === 'donation-hero')?.content as { title?: string; subtitle?: string; backgroundImage?: string } | undefined;
      const guruComp = selectedPage.components.find(c => c.id === 'donation-guruMessage')?.content;
      const galleryComp = selectedPage.components.find(c => c.id === 'donation-gallery')?.content;
      const introComp = selectedPage.components.find(c => c.id === 'donation-intro')?.content;
      
      setEditedContent({
        hero: {
          title: typeof heroComp?.title === 'string' ? heroComp.title : '',
          subtitle: typeof heroComp?.subtitle === 'string' ? heroComp.subtitle : '',
          backgroundImage: typeof heroComp?.backgroundImage === 'string' ? heroComp.backgroundImage : ''
        },
        guruMessage: {
          title: typeof guruComp?.title === 'string' ? guruComp.title : '',
          message: typeof guruComp?.message === 'string' ? guruComp.message : '',
          guruName: typeof guruComp?.guruName === 'string' ? guruComp.guruName : ''
        },
        gallery: galleryComp && typeof galleryComp.title === 'string' && Array.isArray(galleryComp.images)
          ? { title: galleryComp.title, images: galleryComp.images }
          : { title: '', images: [] },
        intro: { text: typeof introComp?.text === 'string' ? introComp.text : '' }
      });
    }
  }, [selectedPageId, selectedPage, editedContent]);

  // Get selected component from the page
  const selectedComponent = selectedPage?.components.find(c => c.id === selectedComponentId);

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedComponentId(null);
    setEditedContent({});
    setSaveSuccess(false);
  };

  // Normalize hero content to ensure slides array exists with 5 items (new format: {text, imageUrl})
  const normalizeHeroContent = (content: Record<string, any>): Record<string, any> => {
    const normalized = { ...content };
    
    const DEFAULT_IMAGES = [
      '/images/TempleImages/Temple_01.jpeg',
      '/images/TempleImages/Temple_02.jpeg',
      '/images/TempleImages/Temple_03.jpeg',
      '/images/TempleImages/Temple_04.jpeg',
      '/images/TempleImages/Temple_05.jpeg',
    ];
    
    const defaultTexts = locale === 'hi' ? [
      'आधुनिक जीवन हेतु दिव्य मार्गदर्शन',
      'दैनिक प्रेरणाएँ और उपदेश',
      'आंतरिक शांति का मार्ग',
      'आज के लिए प्राचीन ज्ञान',
      'आध्यात्मिक जागृति आपका इंतज़ार कर रही है'
    ] : [
      'Divine Guidance For Modern Life',
      'Daily Inspirations & Teachings',
      'Path to Inner Peace',
      'Ancient Wisdom for Today',
      'Spiritual Awakening Awaits'
    ];
    
    // If slides array exists with objects {text, imageUrl}
    if (Array.isArray(normalized.slides) && normalized.slides.length > 0) {
      normalized.slides = normalized.slides.slice(0, 5).map((slide: any, idx: number) => {
        // Handle new format {text, imageUrl}
        if (typeof slide === 'object' && slide !== null) {
          return {
            text: typeof slide.text === 'string' ? slide.text : defaultTexts[idx],
            imageUrl: typeof slide.imageUrl === 'string' ? slide.imageUrl : DEFAULT_IMAGES[idx]
          };
        }
        // Handle legacy format (just strings)
        else if (typeof slide === 'string') {
          return {
            text: slide,
            imageUrl: DEFAULT_IMAGES[idx]
          };
        }
        // Fallback
        return {
          text: defaultTexts[idx],
          imageUrl: DEFAULT_IMAGES[idx]
        };
      });
      
      // Ensure 5 slides
      while (normalized.slides.length < 5) {
        const idx = normalized.slides.length;
        normalized.slides.push({ text: defaultTexts[idx], imageUrl: DEFAULT_IMAGES[idx] });
      }
    } 
    // Legacy: slide1, slide2 as strings
    else if (normalized.slide1 || normalized.slide2) {
      normalized.slides = [
        { text: normalized.slide1 || defaultTexts[0], imageUrl: DEFAULT_IMAGES[0] },
        { text: normalized.slide2 || defaultTexts[1], imageUrl: DEFAULT_IMAGES[1] },
        { text: normalized.slide3 || defaultTexts[2], imageUrl: DEFAULT_IMAGES[2] },
        { text: normalized.slide4 || defaultTexts[3], imageUrl: DEFAULT_IMAGES[3] },
        { text: normalized.slide5 || defaultTexts[4], imageUrl: DEFAULT_IMAGES[4] }
      ];
    }
    // No slides data - create default
    else {
      normalized.slides = DEFAULT_IMAGES.map((img, i) => ({ text: defaultTexts[i], imageUrl: img }));
    }
    
    // Remove legacy keys
    delete normalized.slide1;
    delete normalized.slide2;
    delete normalized.slide3;
    delete normalized.slide4;
    delete normalized.slide5;
    
    return normalized;
  };

  // Normalize sacredTeachings content to ensure cards array exists with 4 items
  const normalizeTeachingsContent = (content: Record<string, any>): Record<string, any> => {
    const normalized = { ...content };
    
    // Default cards for EN/HI
    const defaultCardsEn = [
      { id: 1, icon: '🙏', title: 'Path to Inner Peace', description: 'Discover ancient techniques...', fullContent: '', buttonText: 'Learn More', buttonLink: '/swamiji' },
      { id: 2, icon: '📿', title: 'Power of Mantras', description: 'Learn how sacred sounds...', fullContent: '', buttonText: 'Learn More', buttonLink: '/bajrang-baan' },
      { id: 3, icon: '🙏🏻', title: 'Service to Humanity', description: 'Understand why selfless service...', fullContent: '', buttonText: 'Learn More', buttonLink: '/ashram' },
      { id: 4, icon: '🙏🏼', title: 'Living with Purpose', description: 'Find your dharma...', fullContent: '', buttonText: 'Learn More', buttonLink: '/swamiji' }
    ];
    const defaultCardsHi = [
      { id: 1, icon: '🙏', title: 'आंतरिक शांति का मार्ग', description: 'प्राचीन तकनीकें सीखें...', fullContent: '', buttonText: 'और जानें', buttonLink: '/swamiji' },
      { id: 2, icon: '📿', title: 'मंत्रों की शक्ति', description: 'जानें कैसे पवित्र ध्वनियां...', fullContent: '', buttonText: 'और जानें', buttonLink: '/bajrang-baan' },
      { id: 3, icon: '🙏🏻', title: 'मानवता की सेवा', description: 'समझें कि निस्वार्थ सेवा...', fullContent: '', buttonText: 'और जानें', buttonLink: '/ashram' },
      { id: 4, icon: '🙏🏼', title: 'उद्देश्य के साथ जीवन', description: 'अपना धर्म खोजें...', fullContent: '', buttonText: 'और जानें', buttonLink: '/swamiji' }
    ];
    
    const defaultCards = locale === 'hi' ? defaultCardsHi : defaultCardsEn;
    
    // If cards array exists, ensure it has 4 items with all required fields
    if (Array.isArray(normalized.cards)) {
      normalized.cards = normalized.cards.slice(0, 4).map((card: any, idx: number) => ({
        id: card?.id || idx + 1,
        icon: card?.icon || defaultCards[idx]?.icon || '🕉️',
        title: card?.title || defaultCards[idx]?.title || '',
        description: card?.description || defaultCards[idx]?.description || '',
        fullContent: card?.fullContent || defaultCards[idx]?.fullContent || '',
        buttonText: card?.buttonText || defaultCards[idx]?.buttonText || (locale === 'hi' ? 'और जानें' : 'Learn More'),
        buttonLink: card?.buttonLink || defaultCards[idx]?.buttonLink || '#'
      }));
      while (normalized.cards.length < 4) {
        const idx = normalized.cards.length;
        normalized.cards.push({ ...defaultCards[idx] });
      }
    } else {
      // No cards array, create with defaults
      normalized.cards = [...defaultCards];
    }
    
    return normalized;
  };

  // Normalize wordsOfWisdom content to ensure quotes array exists with 5 items
  const normalizeWisdomContent = (content: Record<string, any>): Record<string, any> => {
    const normalized = { ...content };
    
    const defaultQuotesEn = [
      'The mind is everything. What you think, you become.',
      'Peace comes from within. Do not seek it without.',
      'Meditation brings wisdom; lack of meditation leaves ignorance.',
      'Your purpose in life is to find your purpose and give your whole heart to it.',
      'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.'
    ];
    const defaultQuotesHi = [
      'मन ही सब कुछ है। जो आप सोचते हैं, वही आप बन जाते हैं।',
      'शांति भीतर से आती है। इसे बाहर मत खोजो।',
      'ध्यान ज्ञान लाता है; ध्यान की कमी अज्ञानता छोड़ती है।',
      'जीवन में आपका उद्देश्य अपने उद्देश्य को खोजना और अपना पूरा दिल देना है।',
      'अतीत में मत रहो, भविष्य के सपने मत देखो, वर्तमान क्षण पर मन को केंद्रित करो।'
    ];
    
    const defaultQuotes = locale === 'hi' ? defaultQuotesHi : defaultQuotesEn;
    
    // Ensure title, subtitle, author exist
    if (!normalized.title) {
      normalized.title = locale === 'hi' ? 'ज्ञान के मोती' : 'Words of Wisdom';
    }
    if (!normalized.subtitle) {
      normalized.subtitle = locale === 'hi' ? 'स्वामी जी से दैनिक प्रेरणा' : 'Daily Inspiration from Swami Ji';
    }
    if (!normalized.author) {
      normalized.author = locale === 'hi' ? 'स्वामी रूपेश्वरानंद' : 'Swami Rupeshwaranand';
    }
    
    // If quotes array exists, ensure it has 5 items
    if (Array.isArray(normalized.quotes)) {
      normalized.quotes = normalized.quotes.slice(0, 5).map((q: any, idx: number) => 
        (typeof q === 'string' && q.trim()) ? q : defaultQuotes[idx]
      );
      while (normalized.quotes.length < 5) {
        normalized.quotes.push(defaultQuotes[normalized.quotes.length]);
      }
    } else {
      // No quotes array, create with defaults
      normalized.quotes = [...defaultQuotes];
    }
    
    return normalized;
  };

  // Normalize upcomingEvents content to ensure events array exists
  const normalizeEventsContent = (content: Record<string, any>): Record<string, any> => {
    const normalized = { ...content };
    
    const defaultEventsEn = [
      { id: 1, title: 'Community Bhandara', date: '2025-11-25', time: '12:00 PM - 2:00 PM', location: 'Ashram Grounds', type: 'Community Service', image: '', link: '' },
      { id: 2, title: 'Hanuman Chalisa Path', date: '2025-11-08', time: '7:00 AM - 8:00 AM', location: 'Temple Premises', type: 'Daily Prayer', image: '', link: '' },
      { id: 3, title: 'Yoga & Pranayama Session', date: '2025-11-20', time: '5:30 AM - 7:00 AM', location: 'Yoga Hall', type: 'Health & Wellness', image: '', link: '' },
      { id: 4, title: 'Spiritual Discourse & Meditation', date: '2025-11-15', time: '6:00 PM - 8:00 PM', location: 'Main Ashram Hall', type: 'Weekly Satsang', image: '', link: '' }
    ];
    const defaultEventsHi = [
      { id: 1, title: 'सामुदायिक भंडारा', date: '2025-11-25', time: 'दोपहर 12:00 - 2:00 बजे', location: 'आश्रम मैदान', type: 'सामुदायिक सेवा', image: '', link: '' },
      { id: 2, title: 'हनुमान चालीसा पाठ', date: '2025-11-08', time: 'सुबह 7:00 - 8:00 बजे', location: 'मंदिर परिसर', type: 'दैनिक प्रार्थना', image: '', link: '' },
      { id: 3, title: 'योग एवं प्राणायाम सत्र', date: '2025-11-20', time: 'सुबह 5:30 - 7:00 बजे', location: 'योग हॉल', type: 'स्वास्थ्य एवं कल्याण', image: '', link: '' },
      { id: 4, title: 'आध्यात्मिक प्रवचन एवं ध्यान', date: '2025-11-15', time: 'शाम 6:00 - 8:00 बजे', location: 'मुख्य आश्रम हॉल', type: 'साप्ताहिक सत्संग', image: '', link: '' }
    ];
    
    const defaultEvents = locale === 'hi' ? defaultEventsHi : defaultEventsEn;
    
    // Ensure title and subtitle exist
    if (!normalized.title) {
      normalized.title = locale === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Events';
    }
    if (!normalized.subtitle) {
      normalized.subtitle = locale === 'hi' ? 'आध्यात्मिक सभाओं और सामुदायिक गतिविधियों में हमसे जुड़ें' : 'Join us for spiritual gatherings and community activities';
    }
    
    // If events array exists, normalize each event
    if (Array.isArray(normalized.events)) {
      normalized.events = normalized.events.map((event: any, idx: number) => ({
        id: event?.id || idx + 1,
        title: event?.title || '',
        type: event?.type || '',
        date: event?.date || '',
        time: event?.time || '',
        location: event?.location || '',
        image: event?.image || '',
        link: event?.link || ''
      }));
    } else {
      // No events array, create with defaults
      normalized.events = [...defaultEvents];
    }
    
    return normalized;
  };

  // Normalize bajrang-hero content to ensure slides array exists with 5 items
  const normalizeBajrangHeroContent = (content: Record<string, any>): Record<string, any> => {
    const normalized = { ...content };
    
    const defaultSlidesEn = [
      { id: 1, title: 'Shri Bajrang Baan Campaign', description: 'Achieve success and strength in life with the grace of Lord Hanuman', imageUrl: '/images/Bajrang_Baan/b2l.png' },
      { id: 2, title: 'Spiritual Power', description: 'Recitation of Bajrang Baan provides extraordinary strength and protection', imageUrl: '/images/Bajrang_Baan/c2l.png' },
      { id: 3, title: 'Daily Sadhana', description: 'Regular recitation brings positive energy to life', imageUrl: '/images/Bajrang_Baan/d2l.png' },
      { id: 4, title: 'Sankat Mochan', description: 'All obstacles are removed with the grace of Lord Hanuman', imageUrl: '/images/Bajrang_Baan/e2l.png' },
      { id: 5, title: 'Divine Blessings', description: 'Receive divine blessings through devotion and faith', imageUrl: '/images/Bajrang_Baan/f2l.png' }
    ];
    const defaultSlidesHi = [
      { id: 1, title: 'श्री बजरंग बाण अभियान', description: 'श्री हनुमान जी की कृपा से जीवन में सफलता और शक्ति प्राप्त करें', imageUrl: '/images/Bajrang_Baan/b2l.png' },
      { id: 2, title: 'आध्यात्मिक शक्ति', description: 'बजरंग बाण के पाठ से मिलती है अद्भुत शक्ति और सुरक्षा', imageUrl: '/images/Bajrang_Baan/c2l.png' },
      { id: 3, title: 'दैनिक साधना', description: 'नियमित पाठ से जीवन में आती है सकारात्मक ऊर्जा', imageUrl: '/images/Bajrang_Baan/d2l.png' },
      { id: 4, title: 'संकट मोचन', description: 'हनुमान जी की कृपा से दूर होते हैं सभी संकट', imageUrl: '/images/Bajrang_Baan/e2l.png' },
      { id: 5, title: 'आशीर्वाद', description: 'भक्ति और श्रद्धा से प्राप्त करें दिव्य आशीर्वाद', imageUrl: '/images/Bajrang_Baan/f2l.png' }
    ];
    
    const defaultSlides = locale === 'hi' ? defaultSlidesHi : defaultSlidesEn;
    
    // If slides array exists, normalize each slide
    if (Array.isArray(normalized.slides)) {
      normalized.slides = normalized.slides.slice(0, 5).map((slide: any, idx: number) => ({
        id: slide?.id || idx + 1,
        title: slide?.title || defaultSlides[idx]?.title || '',
        description: slide?.description || defaultSlides[idx]?.description || '',
        imageUrl: slide?.imageUrl || defaultSlides[idx]?.imageUrl || ''
      }));
      while (normalized.slides.length < 5) {
        normalized.slides.push({ ...defaultSlides[normalized.slides.length] });
      }
    } else {
      // No slides array, create with defaults
      normalized.slides = [...defaultSlides];
    }
    
    return normalized;
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
    const component = selectedPage?.components.find(c => c.id === componentId);
    if (component) {
      // Normalize content based on component type
      let content: Record<string, any>;
      if (componentId === 'hero') {
        content = normalizeHeroContent(component.content);
      } else if (componentId === 'sacredTeachings') {
        content = normalizeTeachingsContent(component.content);
      } else if (componentId === 'wordsOfWisdom') {
        content = normalizeWisdomContent(component.content);
      } else if (componentId === 'upcomingEvents') {
        content = normalizeEventsContent(component.content);
      } else if (componentId === 'bajrang-hero') {
        content = normalizeBajrangHeroContent(component.content);
      } else {
        content = { ...component.content };
      }
      setEditedContent(content);
    }
    setSaveSuccess(false);
  };

  const handleContentChange = (key: string, value: any) => {
    setEditedContent(prev => ({ ...prev, [key]: value }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!selectedPageId || !selectedComponentId) return;
    
    const success = await updateComponent(selectedPageId, selectedComponentId, editedContent);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleLocaleChange = (newLocale: 'en' | 'hi') => {
    setLocale(newLocale);
    setSelectedComponentId(null);
    setEditedContent({});
    setSaveSuccess(false);
  };

  return (
    <div className={styles.managerRoot}>
      {/* Language Toggle */}
      <div className={styles.languageBar}>
        <span className={styles.languageBar}>🌐 Editing Language:</span>
        <button
          onClick={() => handleLocaleChange('en')}
          className={locale === 'en' ? styles.activeLangBtn : styles.inactiveLangBtn}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => handleLocaleChange('hi')}
          className={locale === 'hi' ? styles.activeLangBtn : styles.inactiveLangBtn}
        >
          🇮🇳 हिंदी
        </button>
      </div>

      {/* Fallback Mode Warning */}
      {usingFallback && (
        <div className={styles.fallbackWarning}>
          <strong>⚠️ Offline Mode:</strong> Backend server is not available. 
          Showing default content. Start the backend server to save changes to MongoDB.
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={styles.errorBox}>
          <span>⚠️ {error}</span>
          <button 
            onClick={() => setError(null)}
            className={styles.errorCloseBtn}
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className={styles.successBox}>
          ✅ Content saved successfully!
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingBox}>
          Loading...
        </div>
      )}

      {/* Main Grid */}
      {!loading && (
        <div className={styles.gridLayout + ' ' + (selectedPageId === 'donation' ? styles.gridLayoutDonation : styles.gridLayoutDefault)}>
          {/* Pages Sidebar */}
          <PageList
            pages={pages}
            selectedPageId={selectedPageId}
            onSelect={handlePageSelect}
          />

          {/* Components Sidebar - Hide for donation page */}
          {selectedPage && selectedPageId !== 'donation' && (
            <ComponentList
              components={selectedPage.components}
              selectedComponentId={selectedComponentId}
              onSelect={handleComponentSelect}
            />
          )}

          {/* Editor Panel - Donation Page Editor */}
          {selectedPageId === 'donation' && selectedPage && (
            <DonationPageEditor
              content={editedContent.hero ? {
                hero: editedContent.hero,
                guruMessage: editedContent.guruMessage,
                gallery: editedContent.gallery,
                intro: editedContent.intro
              } : {
                hero: (() => {
                  const c = selectedPage.components.find(c => c.id === 'donation-hero')?.content as { title?: string; subtitle?: string; backgroundImage?: string } | undefined;
                  return {
                    title: typeof c?.title === 'string' ? c.title : '',
                    subtitle: typeof c?.subtitle === 'string' ? c.subtitle : '',
                    backgroundImage: typeof c?.backgroundImage === 'string' ? c.backgroundImage : ''
                  };
                })(),
                guruMessage: (() => {
                  const c = selectedPage.components.find(c => c.id === 'donation-guruMessage')?.content;
                  return {
                    title: typeof c?.title === 'string' ? c.title : '',
                    message: typeof c?.message === 'string' ? c.message : '',
                    guruName: typeof c?.guruName === 'string' ? c.guruName : ''
                  };
                })(),
                gallery: (() => {
                  const c = selectedPage.components.find(c => c.id === 'donation-gallery')?.content;
                  return c && typeof c.title === 'string' && Array.isArray(c.images)
                    ? { title: c.title, images: c.images }
                    : { title: '', images: [] };
                })(),
                intro: (() => {
                  const c = selectedPage.components.find(c => c.id === 'donation-intro')?.content;
                  return { text: typeof c?.text === 'string' ? c.text : '' };
                })(),
              }}
              onContentChange={(newContent) => {
                // Update edited content based on which section changed
                setEditedContent(newContent);
              }}
              onSave={async (componentId, componentContent) => {
                const success = await updateComponent(selectedPageId, componentId, componentContent);
                if (success) {
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }
              }}
              saving={saving}
              locale={locale}
            />
          )}

          {/* Editor Panel - Home Hero Editor */}
          {selectedComponent && selectedComponentId === 'hero' && selectedPageId === 'home' && (
            <HomeHeroEditor
              slides={editedContent.slides || []}
              onSlidesChange={(slides) => handleContentChange('slides', slides)}
              onSave={handleSave}
              saving={saving}
              locale={locale}
            />
          )}

          {/* Editor Panel - Bajrang Baan Hero Editor */}
          {selectedComponent && selectedComponentId === 'bajrang-hero' && selectedPageId !== 'donation' && (
            <BajrangBaanHeroEditor
              slides={editedContent.slides || []}
              onSlidesChange={(slides) => handleContentChange('slides', slides)}
              onSave={handleSave}
              saving={saving}
              locale={locale}
            />
          )}

          {/* Editor Panel - Standard Component Editor */}
          {selectedComponent && selectedComponentId !== 'hero' && selectedComponentId !== 'bajrang-hero' && selectedPageId !== 'donation' && (
            <ComponentEditor
              component={selectedComponent}
              editedContent={editedContent}
              onContentChange={handleContentChange}
              onSave={handleSave}
              saving={saving}
              locale={locale}
            />
          )}

          {/* Empty State */}
          {!selectedComponent && selectedPageId !== 'donation' && (
            <div className={styles.emptyState}>
              Select a component to edit its content
            </div>
          )}
        </div>
      )}
    </div>
  );
}
