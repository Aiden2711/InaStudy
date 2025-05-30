import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarGrid from '../components/calendar/CalendarGrid';
import EventForm from '../components/calendar/EventForm';
import EventItem from '../components/calendar/EventItem';
import { CalendarEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Calendar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { events, subjects, tasks } = state;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Get the selected event if we're editing
  const selectedEvent = selectedEventId 
    ? events.find(event => event.id === selectedEventId) 
    : null;

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigate to previous month/week/day
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentMonth - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next month/week/day
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentMonth + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handler for adding a new event
  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: uuidv4(),
    };
    
    dispatch({ 
      type: 'ADD_EVENT', 
      payload: newEvent 
    });
    
    setIsFormOpen(false);
  };

  // Handler for updating an existing event
  const handleUpdateEvent = (event: CalendarEvent) => {
    dispatch({ 
      type: 'UPDATE_EVENT', 
      payload: event 
    });
    
    setSelectedEventId(null);
    setIsFormOpen(false);
  };

  // Handler for deleting an event
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch({ 
        type: 'DELETE_EVENT', 
        payload: id 
      });
    }
  };

  // Handler for selecting a date
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  // Handler for selecting an event for editing
  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setIsFormOpen(true);
  };

  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    // Set hours to 0 to compare dates properly
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === selected.getTime();
    });
  };

  // Convert tasks with due dates to calendar events (for display only)
  const tasksAsEvents = tasks.map(task => {
    const subject = subjects.find(s => s.id === task.subjectId);
    return {
      id: `task-${task.id}`,
      title: task.title,
      description: task.description,
      startTime: new Date(task.dueDate).toISOString(),
      endTime: new Date(task.dueDate).toISOString(),
      type: 'assignment' as const,
      subjectId: task.subjectId,
      allDay: true,
      isTask: true, // Flag to identify this as a task
      completed: task.completed,
    };
  });

  // Combine real events with task events for display
  const combinedEvents = [...events, ...tasksAsEvents];

  return (
    <div className="space-y-6 fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your schedule and events
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => {
              setSelectedEventId(null);
              setSelectedDate(new Date());
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            <span>New Event</span>
          </button>
        </div>
      </header>

      {/* Calendar Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPrevious}
              className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {viewMode === 'day' 
                ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                : viewMode === 'week'
                ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={goToNext}
              className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight size={20} />
            </button>
            
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Today
            </button>
          </div>
          
          <div className="flex mt-2 sm:mt-0 space-x-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-lg ${
                viewMode === 'month' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-lg ${
                viewMode === 'week' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded-lg ${
                viewMode === 'day' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <CalendarHeader viewMode={viewMode} />
          <CalendarGrid 
            currentDate={currentDate} 
            viewMode={viewMode}
            events={combinedEvents}
            subjects={subjects}
            onSelectDate={handleSelectDate}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>

      {/* Event Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 fade-in">
          <EventForm
            subjects={subjects}
            initialEvent={selectedEvent || undefined}
            initialDate={selectedDate || undefined}
            onSubmit={selectedEvent ? handleUpdateEvent : handleAddEvent}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedEventId(null);
              setSelectedDate(null);
            }}
          />
        </div>
      )}

      {/* Selected Date Events */}
      {selectedDate && !isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 fade-in">
          <div className="flex items-center mb-4">
            <CalendarIcon size={18} className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
          </div>
          
          {getEventsForSelectedDate().length > 0 ? (
            <div className="space-y-3">
              {getEventsForSelectedDate().map(event => (
                <EventItem
                  key={event.id}
                  event={event}
                  subjects={subjects}
                  onEdit={() => handleSelectEvent(event.id)}
                  onDelete={() => handleDeleteEvent(event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <BookOpen className="h-10 w-10 mx-auto opacity-40 mb-2" />
              <p>No events scheduled for this day.</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 hover:underline"
              >
                Add an event
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;