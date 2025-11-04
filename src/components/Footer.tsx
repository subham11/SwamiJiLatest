'use client';

import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {t('brand.name')}</p>
    </footer>
  );
}
