import React, { useState } from 'react';
import { PieChart, LineChart, Calendar as CalendarIcon, Clock, BookOpen, CheckSquare, Target } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import ProgressCard from '../components/shared/ProgressCard';
import { 
  calculateTotalStudyTime, 
  getStudyTimeBySubject,
  getStudyTimeByDay,
  calculateGoalProgress,
  getTaskCompletionRate
} from '../utils/stats';
import { StudyTimeChart } from '../components/analytics/StudyTimeChart';
import { SubjectDistributionChart } from '../components/analytics/SubjectDistributionChart';
import { WeeklyStudyChart } from '../components/analytics/WeeklyStudyChart';
import { GoalCompletionChart } from '../components/analytics/GoalCompletionChart';

const Analytics: React.FC = () => {
  const { state } = useAppContext();
  const { studySessions, goals, tasks, subjects } = state;
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      // For 'all', set to a date far in the past
      startDate.setFullYear(2020);
    }
    
    return { startDate, endDate: now };
  };
  
  // Filter data based on selected time range
  const filterDataByTimeRange = (sessions: typeof studySessions) => {
    const { startDate, endDate } = getDateRange();
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };
  
  // Filter tasks based on selected time range
  const filterTasksByTimeRange = (tasks: typeof state.tasks) => {
    const { startDate, endDate } = getDateRange();
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startDate && taskDate <= endDate;
    });
  };
  
  // Get filtered sessions based on time range
  const filteredSessions = filterDataByTimeRange(studySessions);
  const filteredTasks = filterTasksByTimeRange(tasks);
  
  // Calculate statistics
  const totalStudyTime = calculateTotalStudyTime(filteredSessions);
  const studyTimeBySubject = getStudyTimeBySubject(filteredSessions, subjects);
  const studyTimeByDay = getStudyTimeByDay(filteredSessions);
  const goalCompletionRate = goals.length > 0 
    ? (goals.filter(goal => goal.completed).length / goals.length) * 100 
    : 0;
  const taskCompletionRate = getTaskCompletionRate(filteredTasks);
  
  // Get most studied subject
  const mostStudiedSubject = studyTimeBySubject.length > 0
    ? studyTimeBySubject.reduce((prev, current) => (prev.minutes > current.minutes) ? prev : current)
    : null;
  
  // Get average study time per session
  const averageStudyTime = filteredSessions.length > 0
    ? Math.round(totalStudyTime / filteredSessions.length)
    : 0;
  
  // Get time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'Past 7 Days';
      case 'month': return 'Past 30 Days';
      case 'all': return 'All Time';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your study patterns and progress
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'all')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard 
          icon={<Clock className="text-indigo-600" />}
          title="Total Study Time"
          value={`${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`}
          subtitle={getTimeRangeLabel()}
          color="indigo"
        />
        
        <ProgressCard 
          icon={<BookOpen className="text-teal-600" />}
          title="Study Sessions"
          value={filteredSessions.length}
          subtitle={`Avg. ${averageStudyTime} min per session`}
          color="teal"
        />
        
        <ProgressCard 
          icon={<Target className="text-rose-600" />}
          title="Goal Completion"
          value={`${Math.round(goalCompletionRate)}%`}
          subtitle="of goals completed"
          progress={goalCompletionRate}
          color="rose"
        />
        
        <ProgressCard 
          icon={<CheckSquare className="text-amber-600" />}
          title="Task Completion"
          value={`${Math.round(taskCompletionRate)}%`}
          subtitle={`of tasks completed (${filteredTasks.filter(t => t.completed).length}/${filteredTasks.length})`}
          progress={taskCompletionRate}
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center mb-4">
            <CalendarIcon size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Study Time by Day
            </h2>
          </div>
          
          <div className="h-64">
            <WeeklyStudyChart data={studyTimeByDay} />
          </div>
        </div>
        
        {/* Subject Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center mb-4">
            <PieChart size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Study Time by Subject
            </h2>
          </div>
          
          <div className="h-64">
            <SubjectDistributionChart data={studyTimeBySubject} />
          </div>
        </div>
        
        {/* Study Progress Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center mb-4">
            <LineChart size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Study Progress Over Time
            </h2>
          </div>
          
          <div className="h-64">
            <StudyTimeChart 
              sessions={filteredSessions} 
              timeRange={timeRange} 
            />
          </div>
        </div>
        
        {/* Goal Completion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center mb-4">
            <Target size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Goal Completion Rate
            </h2>
          </div>
          
          <div className="h-64">
            <GoalCompletionChart goals={goals} />
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Study Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white">
                Most Studied Subject
              </h3>
              {mostStudiedSubject ? (
                <div className="flex items-center mt-2">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: mostStudiedSubject.color }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {mostStudiedSubject.subject} ({Math.floor(mostStudiedSubject.minutes / 60)}h {mostStudiedSubject.minutes % 60}m)
                  </span>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  No study data available for this period.
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white">
                Average Study Session
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {averageStudyTime > 0 ? (
                  <>
                    Your average study session is {averageStudyTime} minutes.
                    {averageStudyTime < 25 && (
                      <span className="block text-amber-600 dark:text-amber-400 text-sm mt-1">
                        Consider longer focused sessions for better retention.
                      </span>
                    )}
                    {averageStudyTime > 120 && (
                      <span className="block text-amber-600 dark:text-amber-400 text-sm mt-1">
                        Long sessions may lead to fatigue. Consider more breaks.
                      </span>
                    )}
                  </>
                ) : (
                  'No study data available for this period.'
                )}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white">
                Task Efficiency
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {filteredTasks.length > 0 ? (
                  <>
                    You've completed {filteredTasks.filter(t => t.completed).length} out of {filteredTasks.length} tasks ({Math.round(taskCompletionRate)}%).
                    {taskCompletionRate < 50 && (
                      <span className="block text-amber-600 dark:text-amber-400 text-sm mt-1">
                        Try breaking down large tasks into smaller ones.
                      </span>
                    )}
                    {taskCompletionRate > 80 && (
                      <span className="block text-green-600 dark:text-green-400 text-sm mt-1">
                        Great task completion rate! Keep it up.
                      </span>
                    )}
                  </>
                ) : (
                  'No tasks available for this period.'
                )}
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-white">
                Recommended Focus
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {studyTimeBySubject.length > 0 ? (
                  <>
                    {studyTimeBySubject.length > 1 && studyTimeBySubject[studyTimeBySubject.length - 1].minutes < 60 ? (
                      <>
                        Consider allocating more time to <span className="font-medium\" style={{ color: studyTimeBySubject[studyTimeBySubject.length - 1].color }}>{studyTimeBySubject[studyTimeBySubject.length - 1].subject}</span>.
                      </>
                    ) : (
                      'Your study time seems well-distributed across subjects.'
                    )}
                  </>
                ) : (
                  'No study data available to provide recommendations.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;