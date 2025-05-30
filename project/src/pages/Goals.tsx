import React, { useState } from 'react';
import { Plus, Filter, Target, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import GoalItem from '../components/goals/GoalItem';
import GoalForm from '../components/goals/GoalForm';
import { Goal } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { calculateGoalProgress } from '../utils/stats';

const Goals: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { goals, subjects, studySessions } = state;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'daily' | 'weekly' | 'subject'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  // Get the selected goal if we're editing
  const selectedGoal = selectedGoalId 
    ? goals.find(goal => goal.id === selectedGoalId) 
    : null;

  // Filter goals based on criteria
  const filteredGoals = goals.filter(goal => {
    const matchesType = filterType === 'all' || goal.type === filterType;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'completed' && goal.completed) || 
      (filterStatus === 'active' && !goal.completed);
    
    return matchesType && matchesStatus;
  });

  // Sort goals by type and completion status
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Incomplete goals first
    }
    
    // Sort by type: daily, weekly, subject
    const typeOrder = { daily: 0, weekly: 1, subject: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  // Handler for adding a new goal
  const handleAddGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: uuidv4(),
    };
    
    dispatch({ 
      type: 'ADD_GOAL', 
      payload: newGoal 
    });
    
    setIsFormOpen(false);
  };

  // Handler for updating an existing goal
  const handleUpdateGoal = (goal: Goal) => {
    dispatch({ 
      type: 'UPDATE_GOAL', 
      payload: goal 
    });
    
    setSelectedGoalId(null);
    setIsFormOpen(false);
  };

  // Handler for deleting a goal
  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      dispatch({ 
        type: 'DELETE_GOAL', 
        payload: id 
      });
    }
  };

  // Handler for toggling goal completion
  const handleToggleComplete = (goal: Goal) => {
    dispatch({
      type: 'UPDATE_GOAL',
      payload: {
        ...goal,
        completed: !goal.completed,
        progress: !goal.completed ? 100 : calculateGoalProgress(goal, studySessions),
      },
    });
  };

  // Handler for editing a goal
  const handleEditGoal = (id: string) => {
    setSelectedGoalId(id);
    setIsFormOpen(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
  };

  return (
    <div className="space-y-6 fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set and track your study goals
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => {
              setSelectedGoalId(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            <span>New Goal</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center mb-4">
          <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filters</h2>
          
          {(filterType !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={resetFilters}
              className="ml-auto text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
            >
              <X size={14} className="mr-1" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Goal Type
            </label>
            <select
              id="typeFilter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'daily' | 'weekly' | 'subject')}
              className="block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            >
              <option value="all">All Types</option>
              <option value="daily">Daily Goals</option>
              <option value="weekly">Weekly Goals</option>
              <option value="subject">Subject Goals</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
              className="block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Goal Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 fade-in">
          <GoalForm
            subjects={subjects}
            initialGoal={selectedGoal || undefined}
            onSubmit={selectedGoal ? handleUpdateGoal : handleAddGoal}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedGoalId(null);
            }}
          />
        </div>
      )}

      {/* Goals List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {sortedGoals.length} Goals
          </h2>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Target size={16} className="mr-1" />
            <span>{goals.filter(g => g.completed).length}/{goals.length} Completed</span>
          </div>
        </div>
        
        {sortedGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedGoals.map(goal => (
              <GoalItem 
                key={goal.id}
                goal={goal}
                subjects={subjects}
                studySessions={studySessions}
                onToggleComplete={() => handleToggleComplete(goal)}
                onEdit={() => handleEditGoal(goal.id)}
                onDelete={() => handleDeleteGoal(goal.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {goals.length === 0
                ? "You don't have any goals yet."
                : "No goals match your filters."}
            </p>
            {goals.length === 0 ? (
              <button
                onClick={() => {
                  setSelectedGoalId(null);
                  setIsFormOpen(true);
                }}
                className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 hover:underline"
              >
                Create your first goal
              </button>
            ) : (
              <button
                onClick={resetFilters}
                className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;