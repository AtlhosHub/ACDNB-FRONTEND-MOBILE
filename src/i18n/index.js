import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import ptBR from './locales/pt-BR.json';

const resources = {
  'pt-BR': { translation: ptBR },
  pt: { translation: ptBR },
};

const deviceLocale = getLocales()[0]?.languageTag ?? 'pt-BR';
const fallbackLocale = 'pt-BR';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLocale,
    fallbackLng: fallbackLocale,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

export default i18n;
