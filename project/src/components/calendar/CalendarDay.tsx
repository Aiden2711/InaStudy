import React from 'react';
import { CalendarEvent, Subject } from '../../types';

interface CalendarDayProps {
  date: Date;
  events: (CalendarEvent & { isTask?: boolean; completed?: boolean; })[];
  isToday: boolean;
  isCurrentMonth: boolean;
  subjects: Subject[];
  viewMode: 'month' | 'week' | 'day';
  onSelectDate: () => void;
  onSelectEvent: (id: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  events,
  isToday,
  isCurrentMonth,
  subjects,
  viewMode,
  onSelectDate,
  onSelectEvent,
}) => {
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  
  // Limit visible events in month view
  const visibleEvents = viewMode === 'month' ? sortedEvents.slice(0, 3) : sortedEvents;
  const hiddenEventsCount = sortedEvents.length - visibleEvents.length;
  
  // Get event color based on type or subject
  const getEventColor = (event: CalendarEvent & { isTask?: boolean; completed?: boolean; }) => {
    if (event.isTask) {
      return event.completed ? '#22C55E' : '#F59E0B';
    }
    
    if (event.subjectId) {
      const subject = subjects.find(s => s.id === event.subjectId);
      return subject?.color || '#4F46E5';
    }
    
    switch (event.type) {
      case 'exam': return '#E11D48';
      case 'assignment': return '#F59E0B';
      case 'study': return '#4F46E5';
      default: return '#0D9488';
    }
  };
  
  // Format time for event display
  const formatEventTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  // Get event type label
  const getEventTypeLabel = (event: CalendarEvent & { isTask?: boolean; }) => {
    if (event.isTask) return 'Task';
    
    switch (event.type) {
      case 'exam': return 'Exam';
      case 'assignment': return 'Assignment';
      case 'study': return 'Study';
      default: return 'Event';
    }
  };

  return (
    <div 
      className={`min-h-[100px] ${viewMode === 'day' ? 'h-96' : ''} bg-white dark:bg-gray-800 ${
        isToday ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 z-10' : ''
      } ${
        !isCurrentMonth && viewMode === 'month' ? 'opacity-50' : ''
      }`}
    >
      {/* Date header */}
      <div 
        className={`px-2 py-1 flex justify-between ${
          isToday ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
        }`}
        onClick={onSelectDate}
      >
        <div 
          className={`text-sm font-medium cursor-pointer ${
            isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {date.getDate()}
        </div>
        {viewMode !== 'month' && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
        )}
      </div>
      
      {/* Events */}
      <div className="p-1 space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
        {visibleEvents.map(event => (
          <div 
            key={event.id}
            onClick={() => !event.isTask && onSelectEvent(event.id)}
            className={`px-2 py-1 rounded text-xs truncate ${
              event.isTask ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
            }`}
            style={{ 
              backgroundColor: `${getEventColor(event)}20`,
              borderLeft: `3px solid ${getEventColor(event)}`,
            }}
          >
            {!event.allDay && viewMode !== 'month' && (
              <span className="font-medium mr-1">
                {formatEventTime(event.startTime)}
              </span>
            )}
            
            <span className={event.isTask && event.completed ? 'line-through opacity-70' : ''}>
              {viewMode === 'month' && (
                <span className="inline-block w-2 h-2 rounded-full mr-1\" style={{ backgroundColor: getEventColor(event) }}></span>
              )}
              {viewMode !== 'month' && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                  [{getEventTypeLabel(event)}]
                </span>
              )}
              {event.title}
            </span>
          </div>
        ))}
        
        {hiddenEventsCount > 0 && (
          <div 
            className="px-2 py-1 text-xs text-center text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
            onClick={onSelectDate}
          >
            +{hiddenEventsCount} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;