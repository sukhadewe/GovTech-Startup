import React, { createContext, useContext, useState } from 'react';
import translations from './i18n';

export const LangContext = createContext();

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('mr');
  
  const t = (key) => {
    try {
      if (!translations[lang]) return translations['en']?.[key] || key;
      return translations[lang][key] || translations['en']?.[key] || key;
    } catch (e) {
      return key;
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
