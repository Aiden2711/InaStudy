import React from 'react';

interface ProgressCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  progress?: number;
  color: 'indigo' | 'teal' | 'rose' | 'amber' | 'green' | 'red';
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  progress,
  color
}) => {
  // Color mappings for different states
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      progress: 'bg-indigo-600 dark:bg-indigo-500',
    },
    teal: {
      bg: 'bg-teal-100 dark:bg-teal-900/30',
      text: 'text-teal-600 dark:text-teal-400',
      progress: 'bg-teal-600 dark:bg-teal-500',
    },
    rose: {
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      text: 'text-rose-600 dark:text-rose-400',
      progress: 'bg-rose-600 dark:bg-rose-500',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
      progress: 'bg-amber-600 dark:bg-amber-500',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      progress: 'bg-green-600 dark:bg-green-500',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      progress: 'bg-red-600 dark:bg-red-500',
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-all hover:shadow-md">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${colorClasses[color].bg}`}>
          {React.cloneElement(icon as React.ReactElement, { 
            size: 24,
            className: colorClasses[color].text
          })}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full progress-bar ${colorClasses[color].progress}`}
              style={{ 
                width: `${progress}%`,
                '--progress-width': `${progress}%`
              } as React.CSSProperties}
            ></div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
};

export default ProgressCard;