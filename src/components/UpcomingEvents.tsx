'use client';

import { useTranslation } from 'react-i18next';

const events = [
  {
    id: 1,
    titleEn: "Spiritual Discourse & Meditation",
    titleHi: "आध्यात्मिक प्रवचन एवं ध्यान",
    date: "2025-11-15",
    time: "6:00 PM - 8:00 PM",
    location: "Main Ashram Hall",
    locationHi: "मुख्य आश्रम हॉल",
    type: "Weekly Satsang",
    typeHi: "साप्ताहिक सत्संग"
  },
  {
    id: 2,
    titleEn: "Hanuman Chalisa Path",
    titleHi: "हनुमान चालीसा पाठ",
    date: "2025-11-08",
    time: "7:00 AM - 8:00 AM",
    location: "Temple Premises",
    locationHi: "मंदिर परिसर",
    type: "Daily Prayer",
    typeHi: "दैनिक प्रार्थना"
  },
  {
    id: 3,
    titleEn: "Yoga & Pranayama Session",
    titleHi: "योग एवं प्राणायाम सत्र",
    date: "2025-11-20",
    time: "5:30 AM - 7:00 AM",
    location: "Yoga Hall",
    locationHi: "योग हॉल",
    type: "Health & Wellness",
    typeHi: "स्वास्थ्य एवं कल्याण"
  },
  {
    id: 4,
    titleEn: "Community Bhandara",
    titleHi: "सामुदायिक भंडारा",
    date: "2025-11-25",
    time: "12:00 PM - 2:00 PM",
    location: "Ashram Grounds",
    locationHi: "आश्रम परिसर",
    type: "Community Service",
    typeHi: "सामुदायिक सेवा"
  }
];

export function UpcomingEvents() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (locale === 'hi') {
      return date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section className="upcomingEvents">
      <div className="eventsContainer">
        <div className="eventsHeader">
          <h2 className="sectionTitle">{t('events.title')}</h2>
          <p className="sectionSubtitle">{t('events.subtitle')}</p>
        </div>

        <div className="eventsGrid">
          {events.map((event) => (
            <article key={event.id} className="eventCard">
              <div className="eventType">
                {locale === 'hi' ? event.typeHi : event.type}
              </div>
              <h3 className="eventTitle">
                {locale === 'hi' ? event.titleHi : event.titleEn}
              </h3>
              <div className="eventDetails">
                <div className="eventDetail">
                  <span className="eventIcon">📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="eventDetail">
                  <span className="eventIcon">🕐</span>
                  <span>{event.time}</span>
                </div>
                <div className="eventDetail">
                  <span className="eventIcon">📍</span>
                  <span>{locale === 'hi' ? event.locationHi : event.location}</span>
                </div>
              </div>
              <button className="eventBtn">
                {locale === 'hi' ? 'विवरण देखें' : 'Learn More'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
