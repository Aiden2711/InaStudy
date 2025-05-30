import React from 'react';
import { Clock, MapPin, Calendar, BookOpen, Edit2, Trash2 } from 'lucide-react';
import { CalendarEvent, Subject } from '../../types';

interface EventItemProps {
  event: CalendarEvent;
  subjects: Subject[];
  onEdit: () => void;
  onDelete: () => void;
}

const EventItem: React.FC<EventItemProps> = ({
  event,
  subjects,
  onEdit,
  onDelete,
}) => {
  // Get subject info
  const subject = event.subjectId ? subjects.find(s => s.id === event.subjectId) : null;
  
  // Get event color based on type or subject
  const getEventColor = () => {
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
  
  // Format date for event display
  const formatEventDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Get event type label
  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'exam': return 'Exam';
      case 'assignment': return 'Assignment';
      case 'study': return 'Study Session';
      default: return 'Event';
    }
  };

  return (
    <div 
      className="border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      style={{ borderLeftWidth: '4px', borderLeftColor: getEventColor() }}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span 
                className="text-xs px-2 py-1 rounded-full mr-2"
                style={{ backgroundColor: `${getEventColor()}20`, color: getEventColor() }}
              >
                {getEventTypeLabel()}
              </span>
              
              {subject && (
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  <BookOpen size={12} className="mr-1" />
                  {subject.name}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">
              {event.title}
            </h3>
            
            {event.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {event.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mt-3">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formatEventDate(event.startTime)}</span>
              </span>
              
              {!event.allDay && (
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>
                    {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                  </span>
                </span>
              )}
              
              {event.location && (
                <span className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  <span>{event.location}</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="ml-2 flex flex-col space-y-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              <Edit2 size={16} />
              <span className="sr-only">Edit</span>
            </button>
            
            <button
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              <Trash2 size={16} />
              <span className="sr-only">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;