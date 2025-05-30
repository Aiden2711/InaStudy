import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Target, 
  Calendar, 
  CheckSquare, 
  BarChart2, 
  Menu, 
  X,
  Bell,
  User,
  Settings as SettingsIcon,
  Zap
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { state } = useAppContext();
  const { t } = useLanguage();
  
  // Count incomplete tasks for notification badge
  const incompleteTasks = state.tasks.filter(task => !task.completed).length;
  
  // Navigation items
  const navItems = [
    { path: '/', label: t('dashboard'), icon: <Home size={20} /> },
    { path: '/study', label: t('studySessions'), icon: <BookOpen size={20} /> },
    { path: '/goals', label: t('goals'), icon: <Target size={20} /> },
    { path: '/calendar', label: t('calendar'), icon: <Calendar size={20} /> },
    { path: '/tasks', label: t('tasks'), icon: <CheckSquare size={20} /> },
    { path: '/analytics', label: t('analytics'), icon: <BarChart2 size={20} /> },
    { path: '/settings', label: t('settings'), icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">InaStudy</h1>
              <Zap size={24} className="ml-1 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                {incompleteTasks > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {incompleteTasks}
                  </span>
                )}
              </button>
            </div>
            
            <ThemeToggle />
            
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <User size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the layout remains the same */}
      {/* ... */}
    </div>
  );
};

export default Layout;