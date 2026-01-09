'use client';

import { useDispatch } from 'react-redux';
import { setLocale } from '@/redux/slices/localeSlice';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const changeLang = (lng: 'en' | 'hi') => {
    dispatch(setLocale(lng));
    i18n.changeLanguage(lng).catch(() => {});
  };

  return (
    <button
      className="langBtn"
      onClick={() => changeLang(i18n.language === 'hi' ? 'en' : 'hi')}
      aria-label="Toggle language"
    >
      {i18n.language === 'hi' ? 'EN' : 'HI'}
    </button>
  );
}
