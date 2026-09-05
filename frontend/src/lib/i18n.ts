import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';
import n811 from '@/locales/n811.json';

const resources = {
  tr: { translation: tr },
  en: { translation: en },
  n811: { translation: n811 },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    defaultNS: 'translation',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
