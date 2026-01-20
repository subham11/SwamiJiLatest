'use client';

import { ComponentContent } from '@/hooks/usePageContent';

type Props = {
  component: ComponentContent;
  editedContent: { [key: string]: any };
  onContentChange: (key: string, value: any) => void;
  onSave: () => void;
  saving?: boolean;
  locale?: 'en' | 'hi';
};

export function ComponentEditor({ component, editedContent, onContentChange, onSave, saving = false, locale = 'en' }: Props) {
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>
            ✏️ {component.name}
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
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, color: '#666' }}>
          {component.description}
        </p>
      </div>

      {/* Content Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {contentKeys.map(key => {
          const value = editedContent[key];

          // Special handling for slides array (5 slots)
          if (key === 'slides' && Array.isArray(value)) {
            const slides: string[] = value.map((v: any) => (typeof v === 'string' ? v : '')).slice(0, 5);
            while (slides.length < 5) slides.push('');

            return (
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
                  HERO SLIDES (5)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                  {slides.map((slideText, idx) => (
                    <div key={`${key}-${idx}`}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '0.35rem',
                        color: '#555',
                      }}>
                        Slide {idx + 1}
                      </label>
                      <input
                        type="text"
                        value={slideText}
                        onChange={e => {
                          const next = [...slides];
                          next[idx] = e.target.value;
                          onContentChange('slides', next);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                        placeholder={`Slide ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Default text/textarea handling
          return (
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
              {typeof value === 'string' && value.length > 100 ? (
                <textarea
                  value={value}
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
                  value={typeof value === 'string' ? value : ''}
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
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            background: saving ? '#9ca3af' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            opacity: saving ? 0.7 : 1,
          }}
          onMouseEnter={e => {
            if (!saving) {
              (e.target as HTMLButtonElement).style.opacity = '0.9';
              (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={e => {
            if (!saving) {
              (e.target as HTMLButtonElement).style.opacity = '1';
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            }
          }}
        >
          {saving ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
        <button
          onClick={() => window.location.reload()}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#666',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            if (!saving) {
              (e.target as HTMLButtonElement).style.background = '#f3f4f6';
            }
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
