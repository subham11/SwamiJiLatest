'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AnnouncementContent {
  text: string;
  ariaLabel: string;
}

export function AnnouncementBar() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<AnnouncementContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch announcement content from API based on current language
  useEffect(() => {
    const fetchAnnouncement = async () => {
      const locale = i18n.language === 'hi' ? 'hi' : 'en';
      try {
        const res = await fetch(`/api/page-content/${locale}/home/announcementBar`);
        if (res.ok) {
          const data = await res.json();
          if (data?.content) {
            setContent({
              text: data.content.text || t('announcement.text'),
              ariaLabel: data.content.ariaLabel || t('announcement.ariaLabel')
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [i18n.language, t]);

  // Fallback to translation if API fails or loading
  const announcementText = content?.text || t('announcement.text');
  const ariaLabel = content?.ariaLabel || t('announcement.ariaLabel');

  return (
    <div className="announcementBar" role="region" aria-label={ariaLabel}>
      <div className="marquee" aria-hidden="true">
        <div className="marqueeContent">
          <span>{announcementText}</span>
          <span>{announcementText}</span>
          <span>{announcementText}</span>
        </div>
      </div>
      {/* Static text for screen readers to avoid repeated reading of marquee */}
      <span className="srOnly">{announcementText}</span>
    </div>
  );
}
