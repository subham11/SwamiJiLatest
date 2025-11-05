"use client";

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function LangSetter(){
  const { i18n } = useTranslation();
  useEffect(() => {
    if (typeof document !== 'undefined'){
      const lang = (i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';
      document.documentElement.lang = lang;
    }
  }, [i18n.language]);
  return null;
}

export default LangSetter;
