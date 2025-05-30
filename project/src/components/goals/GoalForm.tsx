import React, { useState } from 'react';
import { BookOpen, Target, Clock, Calendar, FileText, X } from 'lucide-react';
import { Goal, Subject } from '../../types';

interface GoalFormProps {
  subjects: Subject[];
  initialGoal?: Goal;
  onSubmit: (goal: Omit<Goal, 'id'> | Goal) => void;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({
  subjects,
  initialGoal,
  onSubmit,
  onCancel
}) => {
  // Form state
  const [formData, setFormData] = useState<Omit<Goal, 'id'> | Goal>({
    id: initialGoal?.id || '',
    title: initialGoal?.title || '',
    description: initialGoal?.description || '',
    type: initialGoal?.type || 'weekly',
    subjectId: initialGoal?.subjectId || '',
    targetTime: initialGoal?.targetTime || 120,
    targetTasks: initialGoal?.targetTasks || 0,
    dueDate: initialGoal?.dueDate || '',
    progress: initialGoal?.progress || 0,
    completed: initialGoal?.completed || false,
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
    field: 'targetTime' | 'targetTasks'
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  // Show subject selection only for subject-specific goals
  const showSubjectSelection = formData.type === 'subject';
  
  // Show due date for weekly and subject goals
  const showDueDate = formData.type === 'weekly' || formData.type === 'subject';

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.type === 'subject' && !formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }
    
    if (formData.targetTime <= 0 && formData.targetTasks <= 0) {
      newErrors.targetTime = 'Either target time or target tasks must be set';
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
          {initialGoal ? 'Edit Goal' : 'Add New Goal'}
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
            Goal Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter goal title"
            className={`block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Goal Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Goal Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Target size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">Daily Goal</option>
              <option value="weekly">Weekly Goal</option>
              <option value="subject">Subject-Specific Goal</option>
            </select>
          </div>
        </div>

        {/* Subject Selection (only for subject goals) */}
        {showSubjectSelection && (
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
        )}

        {/* Target Time */}
        <div>
          <label htmlFor="targetTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Study Time (minutes)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="number"
              id="targetTime"
              name="targetTime"
              min="0"
              value={formData.targetTime}
              onChange={(e) => handleNumberChange(e, 'targetTime')}
              className={`block w-full pl-10 pr-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.targetTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
          </div>
          {errors.targetTime && (
            <p className="mt-1 text-sm text-red-500">{errors.targetTime}</p>
          )}
        </div>

        {/* Target Tasks */}
        <div>
          <label htmlFor="targetTasks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Tasks (optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckSquare size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="number"
              id="targetTasks"
              name="targetTasks"
              min="0"
              value={formData.targetTasks}
              onChange={(e) => handleNumberChange(e, 'targetTasks')}
              className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Due Date (for weekly and subject goals) */}
        {showDueDate && (
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date (optional)
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
                className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
              placeholder="Add details about this goal..."
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
            {initialGoal ? 'Update Goal' : 'Add Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;