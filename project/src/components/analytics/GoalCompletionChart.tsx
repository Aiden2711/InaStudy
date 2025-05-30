import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Goal } from '../../types';

interface GoalCompletionChartProps {
  goals: Goal[];
}

export const GoalCompletionChart: React.FC<GoalCompletionChartProps> = ({ goals }) => {
  // Prepare data for chart
  const prepareData = () => {
    if (goals.length === 0) {
      return [
        { name: 'No Goals', value: 1, color: '#CBD5E1' }
      ];
    }
    
    // Group goals by type
    const dailyGoals = goals.filter(goal => goal.type === 'daily');
    const weeklyGoals = goals.filter(goal => goal.type === 'weekly');
    const subjectGoals = goals.filter(goal => goal.type === 'subject');
    
    // Calculate completion rates
    const dailyCompleted = dailyGoals.filter(goal => goal.completed).length;
    const weeklyCompleted = weeklyGoals.filter(goal => goal.completed).length;
    const subjectCompleted = subjectGoals.filter(goal => goal.completed).length;
    
    return [
      { 
        name: 'Daily Goals', 
        value: dailyGoals.length, 
        completed: dailyCompleted,
        color: '#4F46E5',
        completionRate: dailyGoals.length > 0 ? Math.round((dailyCompleted / dailyGoals.length) * 100) : 0
      },
      { 
        name: 'Weekly Goals', 
        value: weeklyGoals.length, 
        completed: weeklyCompleted,
        color: '#0D9488',
        completionRate: weeklyGoals.length > 0 ? Math.round((weeklyCompleted / weeklyGoals.length) * 100) : 0
      },
      { 
        name: 'Subject Goals', 
        value: subjectGoals.length, 
        completed: subjectCompleted,
        color: '#E11D48',
        completionRate: subjectGoals.length > 0 ? Math.round((subjectCompleted / subjectGoals.length) * 100) : 0
      }
    ];
  };
  
  const data = prepareData();
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (data.name === 'No Goals') {
        return (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">No Goals</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Set some goals to track your progress
            </p>
          </div>
        );
      }
      
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {data.completed} of {data.value} completed ({data.completionRate}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    if (payload[0]?.payload.name === 'No Goals') {
      return (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No goals have been created yet
          </span>
        </div>
      );
    }
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700 dark:text-gray-300">
              {entry.value}: {data[index].completed}/{data[index].value} ({data[index].completionRate}%)
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          nameKey="name"
          animationDuration={1500}
          label={({ name, percent }) => name === 'No Goals' ? 'No Goals' : `${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};