'use client';

import { useState, useMemo } from 'react';
import { PageLayout, ComponentContent, getSeedPageComponents, updateComponentContent } from '@/data/pages-components.seed';
import { PageList } from './PageList';
import { ComponentList } from './ComponentList';
import { ComponentEditor } from './ComponentEditor';

export function PageComponentManager() {
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<{ [key: string]: string }>({});

  const pagesData = useMemo(() => getSeedPageComponents(), []);
  const selectedPage = useMemo(() => pagesData[selectedPageId], [pagesData, selectedPageId]);
  const selectedComponent = useMemo(
    () => selectedPage?.components.find(c => c.id === selectedComponentId),
    [selectedPage, selectedComponentId]
  );

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedComponentId(null);
    setEditedContent({});
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponentId(componentId);
    const component = selectedPage?.components.find(c => c.id === componentId);
    if (component) {
      setEditedContent({ ...component.content });
    }
  };

  const handleContentChange = (key: string, value: string) => {
    setEditedContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (selectedComponentId && selectedComponent) {
      // In a real app, this would persist to a backend
      updateComponentContent(selectedPageId, selectedComponentId, editedContent);
      alert('Content updated successfully! (Note: Changes are in-memory for demo)');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 250px 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
      {/* Pages Sidebar */}
      <PageList selectedPageId={selectedPageId} onSelect={handlePageSelect} />

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
  );
}
