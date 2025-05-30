import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    dashboard: 'Dashboard',
    studySessions: 'Study Sessions',
    goals: 'Goals',
    calendar: 'Calendar',
    tasks: 'Tasks',
    analytics: 'Analytics',
    settings: 'Settings',
    notifications: 'Notifications',
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
    save: 'Save',
    // Add more translations as needed
  },
  es: {
    dashboard: 'Panel',
    studySessions: 'Sesiones de Estudio',
    goals: 'Objetivos',
    calendar: 'Calendario',
    tasks: 'Tareas',
    analytics: 'Análisis',
    settings: 'Configuración',
    notifications: 'Notificaciones',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    save: 'Guardar',
    // Add more translations as needed
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};