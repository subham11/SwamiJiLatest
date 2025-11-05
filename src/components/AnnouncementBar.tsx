'use client';

import { useTranslation } from 'react-i18next';

export function AnnouncementBar() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';

  const announcements = {
    en: "🔔 Join us for Hanuman Chalisa Path every Tuesday at 7 AM • 🎉 Special Bhandara on Nov 25th • 📿 New Yoga Sessions starting Nov 20th • 🙏 Daily Satsang at 6 PM",
    hi: "🔔 प्रत्येक मंगलवार सुबह 7 बजे हनुमान चालीसा पाठ में शामिल हों • 🎉 25 नवंबर को विशेष भंडारा • 📿 20 नवंबर से नए योग सत्र शुरू • 🙏 शाम 6 बजे दैनिक सत्संग"
  };

  return (
    <div className="announcementBar" role="region" aria-label={locale === 'hi' ? 'घोषणा' : 'Announcements'}>
      <div className="marquee" aria-hidden="true">
        <div className="marqueeContent">
          <span>{announcements[locale]}</span>
          <span>{announcements[locale]}</span>
          <span>{announcements[locale]}</span>
        </div>
      </div>
      {/* Static text for screen readers to avoid repeated reading of marquee */}
      <span className="srOnly">{announcements[locale]}</span>
    </div>
  );
}
