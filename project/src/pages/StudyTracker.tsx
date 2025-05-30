import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, BookOpen, Save, Plus } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import StudySessionForm from '../components/study/StudySessionForm';
import StudySessionList from '../components/study/StudySessionList';
import { calculateTotalStudyTime } from '../utils/stats';
import { v4 as uuidv4 } from 'uuid';

const StudyTracker: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { studySessions, subjects } = state;
  const [searchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // Get the subject from URL params if available
  const subjectIdFromUrl = searchParams.get('subject');
  
  useEffect(() => {
    // If a subject is specified in the URL, open the form with that subject pre-selected
    if (subjectIdFromUrl) {
      setIsFormOpen(true);
    }
  }, [subjectIdFromUrl]);

  // Get the selected session if we're editing
  const selectedSession = selectedSessionId 
    ? studySessions.find(session => session.id === selectedSessionId) 
    : null;

  // Calculate total study time
  const totalStudyTime = calculateTotalStudyTime(studySessions);
  const totalHours = Math.floor(totalStudyTime / 60);
  const totalMinutes = totalStudyTime % 60;

  // Handler for adding a new study session
  const handleAddSession = (session: Omit<typeof studySessions[0], 'id'>) => {
    const newSession = {
      ...session,
      id: uuidv4(),
    };
    
    dispatch({ 
      type: 'ADD_STUDY_SESSION', 
      payload: newSession 
    });
    
    setIsFormOpen(false);
  };

  // Handler for updating an existing study session
  const handleUpdateSession = (session: typeof studySessions[0]) => {
    dispatch({ 
      type: 'UPDATE_STUDY_SESSION', 
      payload: session 
    });
    
    setSelectedSessionId(null);
    setIsFormOpen(false);
  };

  // Handler for deleting a study session
  const handleDeleteSession = (id: string) => {
    dispatch({ 
      type: 'DELETE_STUDY_SESSION', 
      payload: id 
    });
  };

  // Handle selecting a session for editing
  const handleEditSession = (id: string) => {
    setSelectedSessionId(id);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6 fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Study Sessions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your study activities
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => {
              setSelectedSessionId(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} className="mr-1" />
            <span>New Session</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
              <Clock size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Study Time</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {totalHours}h {totalMinutes}m
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg mr-4">
              <BookOpen size={24} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {studySessions.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg mr-4">
              <Save size={24} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Session Length</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {studySessions.length > 0 
                  ? `${Math.floor(totalStudyTime / studySessions.length)} min` 
                  : "0 min"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Session Form */}
        {isFormOpen && (
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 fade-in">
            <StudySessionForm
              subjects={subjects}
              initialSession={selectedSession || undefined}
              initialSubjectId={subjectIdFromUrl || undefined}
              onSubmit={selectedSession ? handleUpdateSession : handleAddSession}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedSessionId(null);
              }}
            />
          </div>
        )}

        {/* Study Session List */}
        <div className={`${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4`}>
          <StudySessionList
            sessions={studySessions}
            subjects={subjects}
            onEdit={handleEditSession}
            onDelete={handleDeleteSession}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyTracker;