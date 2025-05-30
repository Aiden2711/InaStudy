import React, { useState } from 'react';
import { Bell, Globe, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications, NotificationSetting } from '../contexts/NotificationContext';
import { useAppContext } from '../contexts/AppContext';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { settings, addSetting, updateSetting, deleteSetting } = useNotifications();
  const { state } = useAppContext();
  const { subjects } = state;

  const [newSetting, setNewSetting] = useState({
    subjectId: '',
    reminderTime: 30,
    enabled: true,
  });

  const handleSaveNotification = () => {
    if (newSetting.subjectId) {
      addSetting(newSetting);
      setNewSetting({
        subjectId: '',
        reminderTime: 30,
        enabled: true,
      });
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <header>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('settings')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('manageYourPreferences')}
        </p>
      </header>

      {/* Language Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {t('language')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg ${
                language === 'en'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('english')}
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-4 py-2 rounded-lg ${
                language === 'es'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('spanish')}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {t('notifications')}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Add New Notification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={newSetting.subjectId}
              onChange={(e) => setNewSetting({ ...newSetting, subjectId: e.target.value })}
              className="block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            >
              <option value="">{t('selectSubject')}</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={newSetting.reminderTime}
              onChange={(e) => setNewSetting({ ...newSetting, reminderTime: Number(e.target.value) })}
              className="block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            >
              <option value="15">15 {t('minutes')}</option>
              <option value="30">30 {t('minutes')}</option>
              <option value="60">1 {t('hour')}</option>
              <option value="1440">1 {t('day')}</option>
            </select>

            <button
              onClick={handleSaveNotification}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('save')}
            </button>
          </div>

          {/* Existing Notifications */}
          <div className="mt-6 space-y-4">
            {settings.map((setting) => {
              const subject = subjects.find(s => s.id === setting.subjectId);
              return (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: subject?.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {subject?.name} - {setting.reminderTime} {t('minutesBefore')}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSetting(setting.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {t('delete')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;