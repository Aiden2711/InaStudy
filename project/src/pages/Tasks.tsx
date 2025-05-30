import React, { useState } from 'react';
import { Plus, Filter, CheckSquare, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskForm from '../components/tasks/TaskForm';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Tasks: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { tasks, subjects } = state;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Get the selected task if we're editing
  const selectedTask = selectedTaskId 
    ? tasks.find(task => task.id === selectedTaskId) 
    : null;

  // Filter tasks based on criteria
  const filteredTasks = tasks.filter(task => {
    const matchesSubject = filterSubject === 'all' || task.subjectId === filterSubject;
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'completed' && task.completed) || 
      (filterStatus === 'active' && !task.completed);
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSubject && matchesStatus && matchesPriority;
  });

  // Sort tasks by due date and priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Incomplete tasks first
    }
    
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    
    if (dateA !== dateB) {
      return dateA - dateB; // Earlier due dates first
    }
    
    // Sort by priority if dates are the same
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Handler for adding a new task
  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: uuidv4(),
    };
    
    dispatch({ 
      type: 'ADD_TASK', 
      payload: newTask 
    });
    
    setIsFormOpen(false);
  };

  // Handler for updating an existing task
  const handleUpdateTask = (task: Task) => {
    dispatch({ 
      type: 'UPDATE_TASK', 
      payload: task 
    });
    
    setSelectedTaskId(null);
    setIsFormOpen(false);
  };

  // Handler for deleting a task
  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch({ 
        type: 'DELETE_TASK', 
        payload: id 
      });
    }
  };

  // Handler for toggling task completion
  const handleToggleComplete = (task: Task) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        ...task,
        completed: !task.completed,
        progress: !task.completed ? 100 : task.progress,
      },
    });
  };

  // Handler for editing a task
  const handleEditTask = (id: string) => {
    setSelectedTaskId(id);
    setIsFormOpen(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterSubject('all');
    setFilterStatus('all');
    setFilterPriority('all');
  };

  return (
    <div className="space-y-6 fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your assignments and coursework
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => {
              setSelectedTaskId(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            <span>New Task</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center mb-4">
          <Filter size={18} className="text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filters</h2>
          
          {(filterSubject !== 'all' || filterStatus !== 'all' || filterPriority !== 'all') && (
            <button
              onClick={resetFilters}
              className="ml-auto text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
            >
              <X size={14} className="mr-1" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Filter */}
          <div>
            <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <select
              id="subjectFilter"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
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
          
          {/* Priority Filter */}
          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="block w-full px-3 py-2 text-base border rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 fade-in">
          <TaskForm
            subjects={subjects}
            initialTask={selectedTask || undefined}
            onSubmit={selectedTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedTaskId(null);
            }}
          />
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {sortedTasks.length} Tasks
          </h2>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CheckSquare size={16} className="mr-1" />
            <span>{tasks.filter(t => t.completed).length}/{tasks.length} Completed</span>
          </div>
        </div>
        
        {sortedTasks.length > 0 ? (
          <ul className="space-y-3">
            {sortedTasks.map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                subjects={subjects}
                onToggleComplete={() => handleToggleComplete(task)}
                onEdit={() => handleEditTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {tasks.length === 0
                ? "You don't have any tasks yet."
                : "No tasks match your filters."}
            </p>
            {tasks.length === 0 ? (
              <button
                onClick={() => {
                  setSelectedTaskId(null);
                  setIsFormOpen(true);
                }}
                className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 hover:underline"
              >
                Create your first task
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

export default Tasks;