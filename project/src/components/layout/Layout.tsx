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
  User
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { state } = useAppContext();
  
  // Count incomplete tasks for notification badge
  const incompleteTasks = state.tasks.filter(task => !task.completed).length;
  
  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/study', label: 'Study Sessions', icon: <BookOpen size={20} /> },
    { path: '/goals', label: 'Goals', icon: <Target size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">StudyFlow</h1>
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

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile (Overlay) */}
        <div 
          className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-20 transition-opacity duration-200 md:hidden ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar Content */}
        <aside 
          className={`w-64 bg-white dark:bg-gray-800 shadow-md z-30 transition-transform duration-300 overflow-y-auto fixed md:static inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 flex justify-between items-center md:hidden">
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">StudyFlow</h2>
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              <X size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="px-8 py-6 mt-auto">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                Pro Tip
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Regular study breaks increase productivity. Try the Pomodoro technique: 25 minutes of focus followed by a 5-minute break.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;