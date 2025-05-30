import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  StudySession, 
  Goal, 
  Task, 
  CalendarEvent, 
  Subject, 
  AppState, 
  AppAction 
} from '../types';

// Initial subjects
const initialSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', color: '#4F46E5' },
  { id: '2', name: 'Science', color: '#0D9488' },
  { id: '3', name: 'History', color: '#E11D48' },
  { id: '4', name: 'Literature', color: '#F59E0B' },
  { id: '5', name: 'Computer Science', color: '#22C55E' },
];

// Initial app state
const initialState: AppState = {
  studySessions: [],
  goals: [],
  tasks: [],
  events: [],
  subjects: initialSubjects,
};

// Reducer function to handle state updates
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_STUDY_SESSION':
      return { 
        ...state, 
        studySessions: [...state.studySessions, action.payload] 
      };
    
    case 'UPDATE_STUDY_SESSION':
      return {
        ...state,
        studySessions: state.studySessions.map(session => 
          session.id === action.payload.id ? action.payload : session
        )
      };
    
    case 'DELETE_STUDY_SESSION':
      return {
        ...state,
        studySessions: state.studySessions.filter(session => 
          session.id !== action.payload
        )
      };
    
    case 'ADD_GOAL':
      return { 
        ...state, 
        goals: [...state.goals, action.payload] 
      };
    
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.id ? action.payload : goal
        )
      };
    
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };
    
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload] 
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        )
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'ADD_EVENT':
      return { 
        ...state, 
        events: [...state.events, action.payload] 
      };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event => 
          event.id === action.payload.id ? action.payload : event
        )
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    
    case 'ADD_SUBJECT':
      return { 
        ...state, 
        subjects: [...state.subjects, action.payload] 
      };
    
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(subject => 
          subject.id === action.payload.id ? action.payload : subject
        )
      };
    
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject.id !== action.payload)
      };

    case 'LOAD_STATE':
      return action.payload;
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('studyAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('studyAppState', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};