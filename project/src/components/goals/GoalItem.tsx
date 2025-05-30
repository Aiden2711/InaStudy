import React from 'react';
import { CheckSquare, Square, Edit2, Trash2, Calendar, Clock, BookOpen, Target } from 'lucide-react';
import { Goal, Subject, StudySession } from '../../types';
import { formatDate, formatDuration } from '../../utils/formatters';
import { calculateGoalProgress } from '../../utils/stats';

interface GoalItemProps {
  goal: Goal;
  subjects: Subject[];
  studySessions: StudySession[];
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  subjects,
  studySessions,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  // Get subject info
  const subject = goal.subjectId ? subjects.find(s => s.id === goal.subjectId) : null;
  
  // Calculate progress
  const progress = goal.completed ? 100 : calculateGoalProgress(goal, studySessions);
  
  // Get type label
  const getTypeLabel = () => {
    switch(goal.type) {
      case 'daily': return 'Daily Goal';
      case 'weekly': return 'Weekly Goal';
      case 'subject': return subject ? `${subject.name} Goal` : 'Subject Goal';
      default: return 'Goal';
    }
  };
  
  // Get icon based on goal type
  const getTypeIcon = () => {
    switch(goal.type) {
      case 'daily': return <Clock size={16} />;
      case 'weekly': return <Calendar size={16} />;
      case 'subject': return <BookOpen size={16} />;
      default: return <Target size={16} />;
    }
  };
  
  // Get card border color based on goal type
  const getCardBorder = () => {
    if (goal.completed) {
      return 'border-green-200 dark:border-green-900';
    }
    
    switch(goal.type) {
      case 'daily': return 'border-indigo-200 dark:border-indigo-900';
      case 'weekly': return 'border-teal-200 dark:border-teal-900';
      case 'subject': return subject ? `border-${subject.color.replace('#', '')}` : 'border-rose-200 dark:border-rose-900';
      default: return 'border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${getCardBorder()}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          {/* Goal Title and Type */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center text-xs font-medium text-gray-600 dark:text-gray-400">
                {getTypeIcon()}
                <span className="ml-1">{getTypeLabel()}</span>
              </span>
            </div>
            
            <h3 className={`text-lg font-medium ${
              goal.completed ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'
            }`}>
              {goal.title}
            </h3>
          </div>
          
          {/* Checkbox */}
          <button 
            onClick={onToggleComplete}
            className={`mt-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 ${
              goal.completed ? 'text-green-500 dark:text-green-400' : ''
            }`}
          >
            {goal.completed ? (
              <CheckSquare className="h-5 w-5" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Description */}
        {goal.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
            {goal.description}
          </p>
        )}
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mt-3">
          {goal.targetTime > 0 && (
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>Target: {formatDuration(goal.targetTime)}</span>
            </span>
          )}
          
          {goal.targetTasks > 0 && (
            <span className="flex items-center">
              <CheckSquare size={14} className="mr-1" />
              <span>Tasks: {goal.targetTasks}</span>
            </span>
          )}
          
          {goal.dueDate && (
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(goal.dueDate)}</span>
            </span>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full progress-bar ${goal.completed ? 'bg-green-500' : 'bg-indigo-600 dark:bg-indigo-500'}`}
              style={{ 
                width: `${progress}%`,
                '--progress-width': `${progress}%`
              } as React.CSSProperties}
            ></div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-4 flex justify-end space-x-2">
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
  );
};

export default GoalItem;