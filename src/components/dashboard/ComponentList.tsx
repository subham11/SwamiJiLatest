'use client';

import { ComponentContent } from '@/data/pages-components.seed';

type Props = {
  components: ComponentContent[];
  selectedComponentId: string | null;
  onSelect: (componentId: string) => void;
};

export function ComponentList({ components, selectedComponentId, onSelect }: Props) {
  if (components.length === 0) {
    return (
      <div>
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
          🧩 Components
        </h3>
        <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>No components available</div>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
        🧩 Components ({components.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '600px', overflowY: 'auto' }}>
        {components.map(component => (
          <button
            key={component.id}
            onClick={() => onSelect(component.id)}
            style={{
              border: selectedComponentId === component.id ? '2px solid var(--color-primary)' : '1px solid #e5e7eb',
              background: selectedComponentId === component.id ? 'rgba(var(--color-primary-rgb), 0.05)' : '#fff',
              padding: '0.75rem',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: selectedComponentId === component.id ? 'var(--color-primary)' : '#333',
              fontWeight: selectedComponentId === component.id ? 600 : 500,
            }}
            onMouseEnter={e => {
              if (selectedComponentId !== component.id) {
                (e.target as HTMLButtonElement).style.background = '#f9fafb';
              }
            }}
            onMouseLeave={e => {
              if (selectedComponentId !== component.id) {
                (e.target as HTMLButtonElement).style.background = '#fff';
              }
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{component.name}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem', lineHeight: 1.3 }}>
              {component.description}
            </div>
            {component.lastModified && (
              <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.25rem' }}>
                Edited: {new Date(component.lastModified).toLocaleDateString()}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
