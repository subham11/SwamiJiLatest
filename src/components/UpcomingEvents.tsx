"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type EventItem = {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image?: string;
  link?: string;
};

interface EventsContent {
  title: string;
  subtitle: string;
  events: EventItem[];
}

const defaultContent: Record<string, EventsContent> = {
  en: {
    title: 'Upcoming Events',
    subtitle: 'Join us for spiritual gatherings and community activities',
    events: [
      { id: 1, title: 'Community Bhandara', date: '2025-11-25', time: '12:00 PM - 2:00 PM', location: 'Ashram Grounds', type: 'Community Service', image: '', link: '' },
      { id: 2, title: 'Hanuman Chalisa Path', date: '2025-11-08', time: '7:00 AM - 8:00 AM', location: 'Temple Premises', type: 'Daily Prayer', image: '', link: '' },
      { id: 3, title: 'Yoga & Pranayama Session', date: '2025-11-20', time: '5:30 AM - 7:00 AM', location: 'Yoga Hall', type: 'Health & Wellness', image: '', link: '' },
      { id: 4, title: 'Spiritual Discourse & Meditation', date: '2025-11-15', time: '6:00 PM - 8:00 PM', location: 'Main Ashram Hall', type: 'Weekly Satsang', image: '', link: '' }
    ]
  },
  hi: {
    title: 'आगामी कार्यक्रम',
    subtitle: 'आध्यात्मिक सभाओं और सामुदायिक गतिविधियों में हमसे जुड़ें',
    events: [
      { id: 1, title: 'सामुदायिक भंडारा', date: '2025-11-25', time: 'दोपहर 12:00 - 2:00 बजे', location: 'आश्रम मैदान', type: 'सामुदायिक सेवा', image: '', link: '' },
      { id: 2, title: 'हनुमान चालीसा पाठ', date: '2025-11-08', time: 'सुबह 7:00 - 8:00 बजे', location: 'मंदिर परिसर', type: 'दैनिक प्रार्थना', image: '', link: '' },
      { id: 3, title: 'योग एवं प्राणायाम सत्र', date: '2025-11-20', time: 'सुबह 5:30 - 7:00 बजे', location: 'योग हॉल', type: 'स्वास्थ्य एवं कल्याण', image: '', link: '' },
      { id: 4, title: 'आध्यात्मिक प्रवचन एवं ध्यान', date: '2025-11-15', time: 'शाम 6:00 - 8:00 बजे', location: 'मुख्य आश्रम हॉल', type: 'साप्ताहिक सत्संग', image: '', link: '' }
    ]
  }
};

export function UpcomingEvents() {
  const { i18n } = useTranslation();
  const locale = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';
  const [content, setContent] = useState<EventsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState<boolean>(false);

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/page-content/${locale}/home/upcomingEvents`);
        if (response.ok) {
          const data = await response.json();
          if (data?.content) {
            const apiContent = data.content;
            setContent({
              title: apiContent.title || defaultContent[locale].title,
              subtitle: apiContent.subtitle || defaultContent[locale].subtitle,
              events: Array.isArray(apiContent.events) && apiContent.events.length > 0
                ? apiContent.events.map((e: any, idx: number) => ({
                    id: e.id || idx + 1,
                    title: e.title || '',
                    date: e.date || '',
                    time: e.time || '',
                    location: e.location || '',
                    type: e.type || '',
                    image: e.image || '',
                    link: e.link || ''
                  }))
                : defaultContent[locale].events
            });
            setLoading(false);
            return;
          }
        }
        setContent(defaultContent[locale]);
      } catch (err) {
        console.error('Failed to fetch events content:', err);
        setError('Failed to load events');
        setContent(defaultContent[locale]);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [locale]);

  // Trigger animation when loading completes
  useEffect(() => {
    if (!loading && content?.events?.length) {
      setAnimateIn(true);
      const t = setTimeout(() => setAnimateIn(false), 900);
      return () => clearTimeout(t);
    }
  }, [loading, content]);

  const displayContent = content || defaultContent[locale];
  const events = displayContent.events.filter(e => e.title); // Only show events with title

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    if (locale === 'hi') {
      return date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section className="upcomingEvents">
      <div className="eventsContainer" aria-busy={loading} aria-live="polite">
        <div className="eventsHeader">
          <h2 className="sectionTitle">{displayContent.title}</h2>
          <p className="sectionSubtitle">{displayContent.subtitle}</p>
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
