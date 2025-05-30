import React, { useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen, FileText, X } from 'lucide-react';
import { CalendarEvent, Subject } from '../../types';

interface EventFormProps {
  subjects: Subject[];
  initialEvent?: CalendarEvent;
  initialDate?: Date;
  onSubmit: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  subjects,
  initialEvent,
  initialDate,
  onSubmit,
  onCancel
}) => {
  // Convert date to yyyy-MM-dd format
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Convert time to HH:mm format
  const formatTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Calculate default times
  const getDefaultTimes = () => {
    const date = initialDate || new Date();
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(10, 0, 0, 0);
    
    return {
      startDate: formatDateForInput(date),
      startTime: formatTimeForInput(startTime.toISOString()),
      endDate: formatDateForInput(date),
      endTime: formatTimeForInput(endTime.toISOString()),
    };
  };
  
  const defaultTimes = getDefaultTimes();
  
  // Initial form state
  const initialFormState = {
    id: initialEvent?.id || '',
    title: initialEvent?.title || '',
    description: initialEvent?.description || '',
    location: initialEvent?.location || '',
    startDate: initialEvent ? formatDateForInput(new Date(initialEvent.startTime)) : defaultTimes.startDate,
    startTime: initialEvent ? formatTimeForInput(initialEvent.startTime) : defaultTimes.startTime,
    endDate: initialEvent ? formatDateForInput(new Date(initialEvent.endTime)) : defaultTimes.endDate,
    endTime: initialEvent ? formatTimeForInput(initialEvent.endTime) : defaultTimes.endTime,
    type: initialEvent?.type || 'study',
    subjectId: initialEvent?.subjectId || '',
    allDay: initialEvent?.allDay || false,
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Create ISO date string from date and time inputs
  const createISOString = (date: string, time: string) => {
    if (!date) return '';
    const datetime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    return new Date(datetime).toISOString();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (!formData.allDay) {
      if (!formData.startTime) {
        newErrors.startTime = 'Start time is required';
      }
      
      if (!formData.endTime) {
        newErrors.endTime = 'End time is required';
      }
    }
    
    // Check if end date/time is after start date/time
    const startDateTime = createISOString(formData.startDate, formData.startTime);
    const endDateTime = createISOString(formData.endDate, formData.endTime);
    
    if (startDateTime && endDateTime && new Date(endDateTime) <= new Date(startDateTime)) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    // If there are errors, show them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create event object
    const event: Omit<CalendarEvent, 'id'> | CalendarEvent = {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startTime: createISOString(formData.startDate, formData.allDay ? '' : formData.startTime),
      endTime: createISOString(formData.endDate, formData.allDay ? '' : formData.endTime),
      type: formData.type as 'exam' | 'assignment' | 'study' | 'other',
      subjectId: formData.subjectId || undefined,
      allDay: formData.allDay,
    };
    
    // Submit the form
    onSubmit(event);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {initialEvent ? 'Edit Event' : 'Add New Event'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            className={`block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="study">Study Session</option>
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Subject (optional) */}
        <div>
          <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <select
              id="subjectId"
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">No subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allDay"
            name="allDay"
            checked={formData.allDay}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="allDay" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            All day event
          </label>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date/Time */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
            )}
            
            {!formData.allDay && (
              <>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">
                  Start Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.startTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
                )}
              </>
            )}
          </div>
          
          {/* End Date/Time */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
            )}
            
            {!formData.allDay && (
              <>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">
                  End Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.endTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
              <FileText size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details about this event..."
              className="block w-full pl-10 px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {initialEvent ? 'Update Event' : 'Add Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;