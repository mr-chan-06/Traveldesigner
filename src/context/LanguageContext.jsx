import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('ooty_locale') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('ooty_locale', locale);
  }, [locale]);

  const t = (key) => {
    const langObj = translations[locale] || translations['en'];
    return langObj[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
