import React, { useState } from 'react';
import { Calendar, BookOpen, Clock, FileText, AlertTriangle, X } from 'lucide-react';
import { Task, Subject } from '../../types';

interface TaskFormProps {
  subjects: Subject[];
  initialTask?: Task;
  onSubmit: (task: Omit<Task, 'id'> | Task) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  subjects,
  initialTask,
  onSubmit,
  onCancel
}) => {
  // Form state
  const [formData, setFormData] = useState<Omit<Task, 'id'> | Task>({
    id: initialTask?.id || '',
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    subjectId: initialTask?.subjectId || '',
    dueDate: initialTask?.dueDate || new Date().toISOString().split('T')[0],
    priority: initialTask?.priority || 'medium',
    estimatedTime: initialTask?.estimatedTime || 30,
    progress: initialTask?.progress || 0,
    completed: initialTask?.completed || false,
  });

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

  // Handle number input changes
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'estimatedTime' | 'progress'
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      const maxValue = field === 'progress' ? 100 : 1000;
      const validValue = Math.min(value, maxValue);
      
      setFormData(prev => ({ ...prev, [field]: validValue }));
      
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
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
          {initialTask ? 'Edit Task' : 'Add New Task'}
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
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className={`block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

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

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AlertTriangle size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Estimated Time */}
        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estimated Time (minutes)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="number"
              id="estimatedTime"
              name="estimatedTime"
              min="1"
              value={formData.estimatedTime}
              onChange={(e) => handleNumberChange(e, 'estimatedTime')}
              className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Progress */}
        {initialTask && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formData.progress}%
              </span>
            </div>
            <input
              type="range"
              id="progress"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => handleNumberChange(e, 'progress')}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

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
              placeholder="Add details about this task..."
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
            {initialTask ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;