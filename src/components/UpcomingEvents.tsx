"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEventsData } from '@/hooks/useEventsData';

type EventItem = {
  id: number | string;
  title: string;
  date: string; // ISO date string
  time: string;
  location: string;
  type: string;
  image?: string;
  link?: string;
};

export function UpcomingEvents() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';
  const { items: events, loading, error } = useEventsData(locale as 'en'|'hi', 'api');
  const [animateIn, setAnimateIn] = useState<boolean>(false);


  // Trigger a subtle staggered fade-in when loading completes
  useEffect(() => {
    if (!loading && events.length) {
      setAnimateIn(true);
      const t = setTimeout(() => setAnimateIn(false), 900);
      return () => clearTimeout(t);
    }
  }, [loading, events.length]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (locale === 'hi') {
      return date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section className="upcomingEvents">
      <div className="eventsContainer" aria-busy={loading} aria-live="polite">
        <div className="eventsHeader">
          <h2 className="sectionTitle">{t('events.title')}</h2>
          <p className="sectionSubtitle">{t('events.subtitle')}</p>
        </div>

        {error && (
          <div className="eventsError" role="alert" style={{ color: '#b91c1c', marginTop: '0.5rem' }}>
            {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="eventsGrid">
            {Array.from({ length: 4 }).map((_, idx) => (
              <article key={idx} className="eventCard skeletonCard" aria-hidden="true">
                <div className="skeletonBlock skBadge" />
                <div className="skeletonBlock skTitle" />
                <div className="eventDetails">
                  <div className="skeletonBlock skLine" />
                  <div className="skeletonBlock skLine" />
                  <div className="skeletonBlock skLine short" />
                </div>
                <div className="skeletonBlock skBtn" />
              </article>
            ))}
          </div>
        ) : (
          <div className={`eventsGrid${animateIn ? ' fadeInGrid' : ''}`}>
            {events.map((event, idx) => (
              <article key={event.id} className="eventCard" style={{ ['--i' as any]: idx }}>
                {event.image && (
                  <div className="eventImageWrap">
                    <img 
                      className="eventImage" 
                      src={event.image} 
                      alt={event.title} 
                      loading={idx < 3 ? 'eager' : 'lazy'} 
                      decoding="async"
                      fetchPriority={idx === 0 ? 'high' : 'low'}
                    />
                  </div>
                )}
                <div className="eventType" role="status" aria-label={`Event type: ${event.type}`}>
                  {event.type}
                </div>
                <h3 className="eventTitle">
                  {event.title}
                </h3>
                <div className="eventDetails">
                  <div className="eventDetail">
                    <span className="eventIcon" aria-hidden="true">📅</span>
                    <span><span className="srOnly">Date: </span>{formatDate(event.date)}</span>
                  </div>
                  <div className="eventDetail">
                    <span className="eventIcon" aria-hidden="true">🕐</span>
                    <span><span className="srOnly">Time: </span>{event.time}</span>
                  </div>
                  <div className="eventDetail">
                    <span className="eventIcon" aria-hidden="true">📍</span>
                    <span><span className="srOnly">Location: </span>{event.location}</span>
                  </div>
                </div>
                {event.link ? (
                  <a className="eventBtn" href={event.link} target="_blank" rel="noopener noreferrer">
                    {locale === 'hi' ? 'विवरण देखें' : 'Learn More'}
                  </a>
                ) : (
                  <button className="eventBtn" type="button">
                    {locale === 'hi' ? 'विवरण देखें' : 'Learn More'}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
