import React from 'react';
import { Clock, BookOpen, Target, CheckSquare, Plus, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import ProgressCard from '../components/shared/ProgressCard';
import TaskItem from '../components/tasks/TaskItem';
import StudyChart from '../components/analytics/StudyChart';
import { calculateTotalStudyTime, getStudyTimeBySubject, calculateGoalProgress } from '../utils/stats';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { studySessions, goals, tasks, subjects } = state;

  // Calculate dashboard statistics
  const totalStudyTime = calculateTotalStudyTime(studySessions);
  const studyTimeBySubject = getStudyTimeBySubject(studySessions, subjects);
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Calculate goal progress
  const weeklyGoal = goals.find(goal => goal.type === 'weekly' && !goal.subjectId);
  const weeklyProgress = weeklyGoal ? calculateGoalProgress(weeklyGoal, studySessions) : 0;

  return (
    <div className="space-y-6 fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your study progress and upcoming tasks
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link
            to="/study"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            <span>New Session</span>
          </Link>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard 
          icon={<Clock className="text-indigo-600" />}
          title="Study Time"
          value={`${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`}
          subtitle="This week"
          color="indigo"
        />
        
        <ProgressCard 
          icon={<BookOpen className="text-teal-600" />}
          title="Sessions"
          value={studySessions.length}
          subtitle="Total sessions"
          color="teal"
        />
        
        <ProgressCard 
          icon={<Target className="text-rose-600" />}
          title="Weekly Goal"
          value={`${weeklyProgress}%`}
          subtitle="of target completed"
          progress={weeklyProgress}
          color="rose"
        />
        
        <ProgressCard 
          icon={<CheckSquare className="text-amber-600" />}
          title="Tasks"
          value={`${tasks.filter(t => t.completed).length}/${tasks.length}`}
          subtitle="Tasks completed"
          progress={(tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0)}
          color="amber"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Time Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Study Time Distribution
            </h2>
            <Link to="/analytics" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
              <BarChart2 size={16} className="mr-1" />
              <span>View Analytics</span>
            </Link>
          </div>
          
          <div className="h-64">
            <StudyChart data={studyTimeBySubject} />
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Upcoming Tasks
            </h2>
            <Link to="/tasks" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-3">
              {upcomingTasks.map(task => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  subjects={subjects}
                  compact
                />
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <CheckSquare className="h-10 w-10 mx-auto opacity-40 mb-2" />
              <p>No upcoming tasks.</p>
              <Link to="/tasks" className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 inline-block hover:underline">
                Create a task
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Mathematics', 'Science', 'Literature'].map((subject, index) => {
          const subjectObj = subjects.find(s => s.name === subject);
          if (!subjectObj) return null;
          
          return (
            <Link 
              key={index}
              to={`/study?subject=${subjectObj.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${subjectObj.color}20` }}
                >
                  <BookOpen size={20} style={{ color: subjectObj.color }} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    Study {subject}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start a new session
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;