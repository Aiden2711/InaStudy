import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject } from '../types';

export interface NotificationSetting {
  id: string;
  subjectId: string;
  reminderTime: number; // minutes before event
  enabled: boolean;
}

interface NotificationContextType {
  settings: NotificationSetting[];
  addSetting: (setting: Omit<NotificationSetting, 'id'>) => void;
  updateSetting: (setting: NotificationSetting) => void;
  deleteSetting: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  settings: [],
  addSetting: () => {},
  updateSetting: () => {},
  deleteSetting: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const addSetting = (setting: Omit<NotificationSetting, 'id'>) => {
    const newSetting = {
      ...setting,
      id: crypto.randomUUID(),
    };
    setSettings(prev => [...prev, newSetting]);
  };

  const updateSetting = (setting: NotificationSetting) => {
    setSettings(prev => prev.map(s => s.id === setting.id ? setting : s));
  };

  const deleteSetting = (id: string) => {
    setSettings(prev => prev.filter(s => s.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ settings, addSetting, updateSetting, deleteSetting }}>
      {children}
    </NotificationContext.Provider>
  );
};