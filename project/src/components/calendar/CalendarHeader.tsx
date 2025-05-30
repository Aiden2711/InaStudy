import React from 'react';

interface CalendarHeaderProps {
  viewMode: 'month' | 'week' | 'day';
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ viewMode }) => {
  // Days of the week
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
      {viewMode === 'day' ? (
        <div className="col-span-7 py-2 text-center text-gray-500 dark:text-gray-400 text-sm font-medium">
          All Day
        </div>
      ) : (
        weekdays.map((day, index) => (
          <div 
            key={day} 
            className={`py-2 text-center text-gray-500 dark:text-gray-400 text-sm font-medium ${
              index === 0 || index === 6 ? 'text-red-500 dark:text-red-400' : ''
            }`}
          >
            {day}
          </div>
        ))
      )}
    </div>
  );
};

export default CalendarHeader;