import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StudySession } from '../../types';

interface StudyTimeChartProps {
  sessions: StudySession[];
  timeRange: 'week' | 'month' | 'all';
}

export const StudyTimeChart: React.FC<StudyTimeChartProps> = ({ sessions, timeRange }) => {
  // Prepare data for chart
  const prepareData = () => {
    if (sessions.length === 0) return [];
    
    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Group sessions by date
    const groupedByDate: Record<string, number> = {};
    
    sortedSessions.forEach(session => {
      const date = new Date(session.timestamp);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = 0;
      }
      
      groupedByDate[dateStr] += session.duration;
    });
    
    // Convert to chart data format
    const chartData = Object.entries(groupedByDate).map(([date, minutes]) => ({
      date,
      minutes,
      hours: Math.round(minutes / 60 * 10) / 10, // Round to 1 decimal place
    }));
    
    return chartData;
  };
  
  const data = prepareData();
  
  // Format date for x-axis
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const minutes = payload[0].value;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-2 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(label)}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={formatDate}
        />
        <YAxis 
          tick={{ fill: '#6B7280', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={(value) => `${Math.floor(value / 60)}h`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="minutes" 
          stroke="#4F46E5" 
          strokeWidth={2}
          dot={{ fill: '#4F46E5', r: 4 }}
          activeDot={{ fill: '#4F46E5', r: 6 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};