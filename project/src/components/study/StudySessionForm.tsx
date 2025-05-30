import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, FileText, X } from 'lucide-react';
import { StudySession, Subject } from '../../types';

interface StudySessionFormProps {
  subjects: Subject[];
  initialSession?: StudySession;
  initialSubjectId?: string;
  onSubmit: (session: Omit<StudySession, 'id'> | StudySession) => void;
  onCancel: () => void;
}

const StudySessionForm: React.FC<StudySessionFormProps> = ({
  subjects,
  initialSession,
  initialSubjectId,
  onSubmit,
  onCancel
}) => {
  // Activity type options
  const activityTypes = [
    'Reading',
    'Note-taking',
    'Problem-solving',
    'Revision',
    'Research',
    'Practice',
    'Other'
  ];

  // Form state
  const [formData, setFormData] = useState<Omit<StudySession, 'id'> | StudySession>({
    id: initialSession?.id || '',
    subjectId: initialSession?.subjectId || initialSubjectId || '',
    activityType: initialSession?.activityType || '',
    duration: initialSession?.duration || 30,
    notes: initialSession?.notes || '',
    timestamp: initialSession?.timestamp || new Date().toISOString(),
  });

  // Duration presets
  const durationPresets = [15, 30, 45, 60, 90, 120];

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle duration input specifically
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setFormData(prev => ({ ...prev, duration: value }));
      
      if (errors.duration) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.duration;
          return newErrors;
        });
      }
    }
  };

  // Set a duration preset
  const setDurationPreset = (duration: number) => {
    setFormData(prev => ({ ...prev, duration }));
    
    if (errors.duration) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.duration;
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }
    
    if (!formData.activityType) {
      newErrors.activityType = 'Activity type is required';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }
    
    // If there are errors, show them and don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit the form
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {initialSession ? 'Edit Study Session' : 'Add Study Session'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject Selection */}
        <div>
          <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject
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
              className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.subjectId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          {errors.subjectId && (
            <p className="mt-1 text-sm text-red-500">{errors.subjectId}</p>
          )}
        </div>

        {/* Activity Type */}
        <div>
          <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Activity Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <select
              id="activityType"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.activityType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select activity type</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {errors.activityType && (
            <p className="mt-1 text-sm text-red-500">{errors.activityType}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration (minutes)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleDurationChange}
              className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.duration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
          )}
          
          {/* Duration Presets */}
          <div className="flex flex-wrap gap-2 mt-2">
            {durationPresets.map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setDurationPreset(preset)}
                className={`text-xs px-2 py-1 rounded-full ${
                  formData.duration === preset
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {preset} min
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="What did you cover? What did you learn?"
            className="block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
          />
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
            {initialSession ? 'Update Session' : 'Add Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudySessionForm;