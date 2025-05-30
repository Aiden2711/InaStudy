import React, { useState } from 'react';
import { Edit2, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { StudySession, Subject } from '../../types';
import { formatDate, formatDuration } from '../../utils/formatters';

interface StudySessionListProps {
  sessions: StudySession[];
  subjects: Subject[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const StudySessionList: React.FC<StudySessionListProps> = ({
  sessions,
  subjects,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'timestamp' | 'duration'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter and sort sessions
  const filteredAndSortedSessions = sessions
    .filter(session => {
      const subject = subjects.find(s => s.id === session.subjectId);
      const subjectName = subject ? subject.name.toLowerCase() : '';
      const activityType = session.activityType.toLowerCase();
      const notes = session.notes.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        subjectName.includes(searchLower) ||
        activityType.includes(searchLower) ||
        notes.includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortField === 'timestamp') {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' 
          ? a.duration - b.duration 
          : b.duration - a.duration;
      }
    });

  // Toggle sort direction
  const toggleSort = (field: 'timestamp' | 'duration') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get subject name and color by ID
  const getSubject = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  };

  // Handle delete confirmation
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this study session?')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {sessions.length} Study Sessions
      </h2>

      {/* Search and Filters */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by subject, activity or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Sessions List */}
      {filteredAndSortedSessions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Activity
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('duration')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Duration</span>
                    {sortField === 'duration' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('timestamp')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortField === 'timestamp' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedSessions.map((session) => {
                const subject = getSubject(session.subjectId);
                return (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: subject?.color || '#cbd5e1' }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {subject?.name || 'Unknown Subject'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {session.activityType}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDuration(session.duration)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(session.timestamp)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(session.id)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-3"
                      >
                        <Edit2 size={16} />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {sessions.length === 0
              ? "You haven't logged any study sessions yet."
              : "No sessions match your search."}
          </p>
          {sessions.length === 0 && (
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
              Click "New Session" to log your first study session.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudySessionList;