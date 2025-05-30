import React from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SubjectDistributionChartProps {
  data: Array<{
    subject: string;
    minutes: number;
    color: string;
  }>;
}

export const SubjectDistributionChart: React.FC<SubjectDistributionChartProps> = ({ data }) => {
  // Format minutes to hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  // Calculate total minutes
  const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0);
  
  // Calculate percentage
  const getPercentage = (minutes: number) => {
    return totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0;
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = getPercentage(data.minutes);
      
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{data.subject}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {formatMinutes(data.minutes)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-gray-700 dark:text-gray-300">
              {entry.value} ({getPercentage(data[index].minutes)}%)
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
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="minutes"
          nameKey="subject"
          animationDuration={1500}
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