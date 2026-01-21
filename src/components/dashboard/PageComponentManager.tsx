'use client';

import { useState, useEffect } from 'react';
import { usePageContent, ComponentContent, PageSummary } from '@/hooks/usePageContent';
import { PageList } from './PageList';
import { ComponentList } from './ComponentList';
import { ComponentEditor } from './ComponentEditor';

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

  // Get selected component from the page
  const selectedComponent = selectedPage?.components.find(c => c.id === selectedComponentId);

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedComponentId(null);
    setEditedContent({});
    setSaveSuccess(false);
  };

  // Normalize hero content to ensure slides array exists with 5 items
  const normalizeHeroContent = (content: Record<string, any>): Record<string, any> => {
    const normalized = { ...content };
    
    // If slides array exists, ensure it has 5 items
    if (Array.isArray(normalized.slides)) {
      while (normalized.slides.length < 5) {
        normalized.slides.push('');
      }
      normalized.slides = normalized.slides.slice(0, 5);
    } 
    // If no slides array but slide1/slide2 exist, create slides array
    else if (normalized.slide1 || normalized.slide2) {
      normalized.slides = [
        normalized.slide1 || '',
        normalized.slide2 || '',
        normalized.slide3 || '',
        normalized.slide4 || '',
        normalized.slide5 || ''
      ];
    }
    // Remove legacy slide1/slide2 keys if slides array exists
    if (Array.isArray(normalized.slides)) {
      delete normalized.slide1;
      delete normalized.slide2;
      delete normalized.slide3;
      delete normalized.slide4;
      delete normalized.slide5;
    }
    
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
    <div style={{ marginTop: '1.5rem' }}>
      {/* Language Toggle */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'rgba(0,0,0,0.02)',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <span style={{ fontWeight: 600, color: '#333' }}>🌐 Editing Language:</span>
        <button
          onClick={() => handleLocaleChange('en')}
          style={{
            padding: '0.5rem 1rem',
            border: locale === 'en' ? '2px solid var(--color-primary)' : '1px solid #d1d5db',
            background: locale === 'en' ? 'var(--color-primary)' : 'white',
            color: locale === 'en' ? 'white' : '#666',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => handleLocaleChange('hi')}
          style={{
            padding: '0.5rem 1rem',
            border: locale === 'hi' ? '2px solid var(--color-primary)' : '1px solid #d1d5db',
            background: locale === 'hi' ? 'var(--color-primary)' : 'white',
            color: locale === 'hi' ? 'white' : '#666',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          🇮🇳 हिंदी
        </button>
      </div>

      {/* Fallback Mode Warning */}
      {usingFallback && (
        <div style={{
          padding: '1rem',
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          color: '#92400e',
          marginBottom: '1rem',
        }}>
          <strong>⚠️ Offline Mode:</strong> Backend server is not available. 
          Showing default content. Start the backend server to save changes to MongoDB.
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '1rem',
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {error}</span>
          <button 
            onClick={() => setError(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '1.2rem' 
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div style={{
          padding: '1rem',
          background: '#dcfce7',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          color: '#16a34a',
          marginBottom: '1rem',
        }}>
          ✅ Content saved successfully!
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          color: '#666'
        }}>
          Loading...
        </div>
      )}

      {/* Main Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '250px 250px 1fr', gap: '1.5rem' }}>
          {/* Pages Sidebar */}
          <PageList
            pages={pages}
            selectedPageId={selectedPageId}
            onSelect={handlePageSelect}
          />

          {/* Components Sidebar */}
          {selectedPage && (
            <ComponentList
              components={selectedPage.components}
              selectedComponentId={selectedComponentId}
              onSelect={handleComponentSelect}
            />
          )}

          {/* Editor Panel */}
          {selectedComponent && (
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
          {!selectedComponent && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              color: '#999',
              fontStyle: 'italic',
            }}>
              Select a component to edit its content
            </div>
          )}
        </div>
      )}
    </div>
  );
}
