import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import mn from './locales/mn.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      mn: { translation: mn },
      en: { translation: en }
    },
    fallbackLng: 'mn',
    supportedLngs: ['mn', 'en'],
    detection: {
      order: ['localStorage'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

document.documentElement.lang = i18n.language?.startsWith('en') ? 'en' : 'mn';
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng?.startsWith('en') ? 'en' : 'mn';
});

export default i18n;
