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

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
    const component = selectedPage?.components.find(c => c.id === componentId);
    if (component) {
      setEditedContent({ ...component.content });
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
