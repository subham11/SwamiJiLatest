'use client';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en/common.json";
import hi from "@/locales/hi/common.json";

// Important: keep the initial language deterministic (en) to avoid hydration mismatches.
// Users can still switch languages at runtime via i18n.changeLanguage from the UI.
if (!i18n.isInitialized) {
  void i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        hi: { translation: hi },
      },
      supportedLngs: ['en', 'hi'],
      lng: 'en', // deterministic initial lang for SSR/CSR parity
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export default i18n;
