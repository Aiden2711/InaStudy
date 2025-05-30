import React from 'react';
import { CalendarEvent, Subject } from '../../types';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  currentDate: Date;
  viewMode: 'month' | 'week' | 'day';
  events: (CalendarEvent & { isTask?: boolean; completed?: boolean; })[];
  subjects: Subject[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (id: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  viewMode,
  events,
  subjects,
  onSelectDate,
  onSelectEvent,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Generate calendar days for the month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Previous month's days to show
    const prevMonthDays = firstDayOfWeek;
    
    // Last day of previous month
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    // Days from previous month
    const prevMonthDate = new Date(year, month - 1);
    const prevDays = Array.from({ length: prevMonthDays }, (_, i) => {
      const day = lastDayOfPrevMonth - prevMonthDays + i + 1;
      const date = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), day);
      return { date, isCurrentMonth: false };
    });
    
    // Days from current month
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return { date, isCurrentMonth: true };
    });
    
    // Days from next month
    const nextMonthDays = 42 - (prevDays.length + currentDays.length); // 6 rows of 7 days
    const nextMonthDate = new Date(year, month + 1);
    const nextDays = Array.from({ length: nextMonthDays }, (_, i) => {
      const date = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), i + 1);
      return { date, isCurrentMonth: false };
    });
    
    return [...prevDays, ...currentDays, ...nextDays];
  };
  
  // Generate calendar days for the week view
  const generateWeekDays = () => {
    const date = new Date(currentDate);
    const day = date.getDay(); // 0-6, where 0 is Sunday
    
    // Set date to first day of the week (Sunday)
    date.setDate(date.getDate() - day);
    
    return Array.from({ length: 7 }, (_, i) => {
      const weekDate = new Date(date);
      weekDate.setDate(date.getDate() + i);
      return { date: weekDate, isCurrentMonth: true };
    });
  };
  
  // Generate day view
  const generateDayView = () => {
    return [{ date: new Date(currentDate), isCurrentMonth: true }];
  };
  
  // Get days based on view mode
  const days = viewMode === 'month' 
    ? generateMonthDays() 
    : viewMode === 'week'
    ? generateWeekDays()
    : generateDayView();
  
  // Filter events for a specific day
  const getEventsForDay = (date: Date) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === day.getTime();
    });
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    return date.getTime() === today.getTime();
  };

  return (
    <div className={`grid ${viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7'} gap-px bg-gray-200 dark:bg-gray-700 ${viewMode === 'month' ? 'grid-rows-6' : ''}`}>
      {days.map(({ date, isCurrentMonth }, index) => (
        <CalendarDay
          key={date.toISOString()}
          date={date}
          events={getEventsForDay(date)}
          isToday={isToday(date)}
          isCurrentMonth={isCurrentMonth}
          subjects={subjects}
          viewMode={viewMode}
          onSelectDate={() => onSelectDate(date)}
          onSelectEvent={onSelectEvent}
        />
      ))}
    </div>
  );
};

export default CalendarGrid;