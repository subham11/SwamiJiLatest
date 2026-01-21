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

          // Special handling for cards array (Sacred Teachings - 4 cards)
          if (key === 'cards' && Array.isArray(value)) {
            const cards = value.map((card: any, idx: number) => ({
              id: card?.id || idx + 1,
              icon: card?.icon || '🕉️',
              title: card?.title || '',
              description: card?.description || '',
              fullContent: card?.fullContent || '',
              buttonText: card?.buttonText || (locale === 'hi' ? 'और जानें' : 'Learn More'),
              buttonLink: card?.buttonLink || '#'
            }));
            while (cards.length < 4) {
              cards.push({
                id: cards.length + 1,
                icon: '🕉️',
                title: '',
                description: '',
                fullContent: '',
                buttonText: locale === 'hi' ? 'और जानें' : 'Learn More',
                buttonLink: '#'
              });
            }

            const inputStyle = {
              width: '100%',
              padding: '0.6rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box' as const,
            };

            const labelStyle = {
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: '0.25rem',
              color: '#555',
            };

            return (
              <div key={key}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  📚 TEACHING CARDS ({cards.length})
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {cards.slice(0, 4).map((card: any, idx: number) => (
                    <div key={`card-${idx}`} style={{
                      padding: '1rem',
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '0.75rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <span style={{ fontSize: '1.25rem' }}>{card.icon}</span>
                        <strong style={{ color: '#333' }}>Card {idx + 1}</strong>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem' }}>
                        {/* Icon */}
                        <div>
                          <label style={labelStyle}>Icon</label>
                          <input
                            type="text"
                            value={card.icon}
                            onChange={e => {
                              const next = [...cards];
                              next[idx] = { ...next[idx], icon: e.target.value };
                              onContentChange('cards', next);
                            }}
                            style={{ ...inputStyle, textAlign: 'center' }}
                            placeholder="🕉️"
                          />
                        </div>
                        
                        {/* Title */}
                        <div>
                          <label style={labelStyle}>Title</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={e => {
                              const next = [...cards];
                              next[idx] = { ...next[idx], title: e.target.value };
                              onContentChange('cards', next);
                            }}
                            style={inputStyle}
                            placeholder="Card title..."
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div style={{ marginTop: '0.75rem' }}>
                        <label style={labelStyle}>Description</label>
                        <textarea
                          value={card.description}
                          onChange={e => {
                            const next = [...cards];
                            next[idx] = { ...next[idx], description: e.target.value };
                            onContentChange('cards', next);
                          }}
                          style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                          placeholder="Short description for the card..."
                        />
                      </div>

                      {/* Full Content */}
                      <div style={{ marginTop: '0.75rem' }}>
                        <label style={labelStyle}>Full Content (Modal)</label>
                        <textarea
                          value={card.fullContent}
                          onChange={e => {
                            const next = [...cards];
                            next[idx] = { ...next[idx], fullContent: e.target.value };
                            onContentChange('cards', next);
                          }}
                          style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                          placeholder="Detailed content shown in modal..."
                        />
                      </div>

                      {/* Button Text & Link */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                        <div>
                          <label style={labelStyle}>Button Text</label>
                          <input
                            type="text"
                            value={card.buttonText}
                            onChange={e => {
                              const next = [...cards];
                              next[idx] = { ...next[idx], buttonText: e.target.value };
                              onContentChange('cards', next);
                            }}
                            style={inputStyle}
                            placeholder="Learn More"
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Button Link</label>
                          <input
                            type="text"
                            value={card.buttonLink}
                            onChange={e => {
                              const next = [...cards];
                              next[idx] = { ...next[idx], buttonLink: e.target.value };
                              onContentChange('cards', next);
                            }}
                            style={inputStyle}
                            placeholder="/path or #"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Special handling for quotes array (Words of Wisdom - 5 quotes)
          if (key === 'quotes' && Array.isArray(value)) {
            const quotes: string[] = value.map((v: any) => (typeof v === 'string' ? v : '')).slice(0, 5);
            while (quotes.length < 5) quotes.push('');

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
                  💬 WISDOM QUOTES (5)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {quotes.map((quoteText, idx) => (
                    <div key={`${key}-${idx}`}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        marginBottom: '0.35rem',
                        color: '#555',
                      }}>
                        Quote {idx + 1}
                      </label>
                      <textarea
                        value={quoteText}
                        onChange={e => {
                          const next = [...quotes];
                          next[idx] = e.target.value;
                          onContentChange('quotes', next);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder={`Enter inspirational quote ${idx + 1}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Special handling for events array (Upcoming Events)
          if (key === 'events' && Array.isArray(value)) {
            const events = value.map((event: any, idx: number) => ({
              id: event?.id || idx + 1,
              title: event?.title || '',
              type: event?.type || '',
              date: event?.date || '',
              time: event?.time || '',
              location: event?.location || '',
              image: event?.image || '',
              link: event?.link || ''
            }));

            const inputStyle = {
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.85rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box' as const,
            };

            const labelStyle = {
              display: 'block',
              fontSize: '0.7rem',
              fontWeight: 600,
              marginBottom: '0.2rem',
              color: '#555',
            };

            return (
              <div key={key}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#333',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    📅 EVENTS ({events.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newEvent = {
                        id: events.length + 1,
                        title: '',
                        type: '',
                        date: '',
                        time: '',
                        location: '',
                        image: '',
                        link: ''
                      };
                      onContentChange('events', [...events, newEvent]);
                    }}
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    + Add Event
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {events.map((event: any, idx: number) => (
                    <div key={`event-${idx}`} style={{
                      padding: '1rem',
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <strong style={{ color: '#333' }}>📌 Event {idx + 1}</strong>
                        <button
                          type="button"
                          onClick={() => {
                            const next = events.filter((_: any, i: number) => i !== idx);
                            onContentChange('events', next);
                          }}
                          style={{
                            padding: '0.3rem 0.6rem',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      
                      {/* Title & Type */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div>
                          <label style={labelStyle}>Title</label>
                          <input
                            type="text"
                            value={event.title}
                            onChange={e => {
                              const next = [...events];
                              next[idx] = { ...next[idx], title: e.target.value };
                              onContentChange('events', next);
                            }}
                            style={inputStyle}
                            placeholder="Event title..."
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Type</label>
                          <input
                            type="text"
                            value={event.type}
                            onChange={e => {
                              const next = [...events];
                              next[idx] = { ...next[idx], type: e.target.value };
                              onContentChange('events', next);
                            }}
                            style={inputStyle}
                            placeholder="e.g. Community Service"
                          />
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div>
                          <label style={labelStyle}>Date</label>
                          <input
                            type="date"
                            value={event.date}
                            onChange={e => {
                              const next = [...events];
                              next[idx] = { ...next[idx], date: e.target.value };
                              onContentChange('events', next);
                            }}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Time</label>
                          <input
                            type="text"
                            value={event.time}
                            onChange={e => {
                              const next = [...events];
                              next[idx] = { ...next[idx], time: e.target.value };
                              onContentChange('events', next);
                            }}
                            style={inputStyle}
                            placeholder="e.g. 7:00 AM - 8:00 AM"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div style={{ marginBottom: '0.5rem' }}>
                        <label style={labelStyle}>Location</label>
                        <input
                          type="text"
                          value={event.location}
                          onChange={e => {
                            const next = [...events];
                            next[idx] = { ...next[idx], location: e.target.value };
                            onContentChange('events', next);
                          }}
                          style={inputStyle}
                          placeholder="Event location..."
                        />
                      </div>

                      {/* Image & Link */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <label style={labelStyle}>Image URL</label>
                          <input
                            type="text"
                            value={event.image}
                            onChange={e => {
                              const next = [...events];
                              next[idx] = { ...next[idx], image: e.target.value };
                              onContentChange('events', next);
                            }}
                            style={inputStyle}
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Link URL</label>
                          <input
                            type="text"
                            value={event.link}
                            onChange={e => {
                              const next = [...events];
                              next[idx] = { ...next[idx], link: e.target.value };
                              onContentChange('events', next);
                            }}
                            style={inputStyle}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
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
