'use client';

import { useTranslation } from 'react-i18next';

export function AnnouncementBar() {
  const { t } = useTranslation();

  const announcementText = t('announcement.text');
  const ariaLabel = t('announcement.ariaLabel');

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
