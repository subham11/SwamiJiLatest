'use client';

import { ComponentContent } from '@/data/pages-components.seed';

type Props = {
  component: ComponentContent;
  editedContent: { [key: string]: string };
  onContentChange: (key: string, value: string) => void;
  onSave: () => void;
};

export function ComponentEditor({ component, editedContent, onContentChange, onSave }: Props) {
  const contentKeys = Object.keys(editedContent);

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1.5rem',
      background: '#fafafa',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>
          ✏️ {component.name}
        </h2>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, color: '#666' }}>
          {component.description}
        </p>
      </div>

      {/* Content Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {contentKeys.map(key => (
          <div key={key}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {key.replace(/_/g, ' ')}
            </label>
            {editedContent[key]?.length > 100 ? (
              <textarea
                value={editedContent[key]}
                onChange={e => onContentChange(key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  minHeight: '120px',
                  maxHeight: '250px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
                placeholder={`Edit ${key.replace(/_/g, ' ')}`}
              />
            ) : (
              <input
                type="text"
                value={editedContent[key]}
                onChange={e => onContentChange(key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                placeholder={`Edit ${key.replace(/_/g, ' ')}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onSave}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.opacity = '0.9';
            (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.opacity = '1';
            (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          💾 Save Changes
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#666',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.background = '#f3f4f6';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          ↻ Reset
        </button>
      </div>

      {/* Info */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem',
        opacity: 0.6,
        color: '#666',
      }}>
        {component.lastModified && (
          <>Last modified: {new Date(component.lastModified).toLocaleString()}</>
        )}
      </div>
    </div>
  );
}
