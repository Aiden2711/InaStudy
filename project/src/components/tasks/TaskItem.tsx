import React, { useState } from 'react';
import { CheckSquare, Square, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { Task, Subject } from '../../types';
import { formatDate, formatDuration } from '../../utils/formatters';

interface TaskItemProps {
  task: Task;
  subjects: Subject[];
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  subjects,
  onToggleComplete,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get subject info
  const subject = subjects.find(s => s.id === task.subjectId);
  
  // Get days remaining
  const getDaysRemaining = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Format days remaining
  const formatDaysRemaining = () => {
    const days = getDaysRemaining();
    
    if (days < 0) {
      return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return 'Due tomorrow';
    } else {
      return `${days} days remaining`;
    }
  };
  
  // Get status color based on due date and completion
  const getStatusColor = () => {
    if (task.completed) {
      return 'bg-green-500';
    }
    
    const days = getDaysRemaining();
    
    if (days < 0) {
      return 'bg-red-500';
    } else if (days <= 2) {
      return 'bg-amber-500';
    } else {
      return 'bg-blue-500';
    }
  };
  
  // Get priority color
  const getPriorityColor = () => {
    switch(task.priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <li 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        task.completed ? 'bg-opacity-80 dark:bg-opacity-80' : ''
      }`}
    >
      <div 
        className={`p-4 ${compact ? '' : 'cursor-pointer'}`}
        onClick={compact ? undefined : () => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start">
          {/* Checkbox */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete?.();
            }}
            className={`mt-1 mr-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 ${
              task.completed ? 'text-green-500 dark:text-green-400' : ''
            }`}
          >
            {task.completed ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Subject Tag */}
              {subject && (
                <span 
                  className="inline-block w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: subject.color }}
                ></span>
              )}
              
              <h3 className={`text-base font-medium ${
                task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-white'
              }`}>
                {task.title}
              </h3>
              
              {/* Priority Badge */}
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()}`}>
                {task.priority}
              </span>
            </div>
            
            {/* Metadata - always visible */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subject && !compact && (
                <span>{subject.name}</span>
              )}
              
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(task.dueDate)}</span>
              </span>
              
              <span className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{formatDaysRemaining()}</span>
              </span>
            </div>
            
            {/* Description and Progress - only in expanded view */}
            {!compact && isExpanded && task.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {task.description}
              </p>
            )}
            
            {/* Progress Bar - visible based on context */}
            {(!compact || (compact && task.progress > 0 && task.progress < 100)) && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full progress-bar ${getStatusColor()}`}
                    style={{ 
                      width: `${task.progress}%`,
                      '--progress-width': `${task.progress}%`
                    } as React.CSSProperties}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          {!compact && (
            <div className="ml-2 flex space-x-1">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  <Edit2 size={16} />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;